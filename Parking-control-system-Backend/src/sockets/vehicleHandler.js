import fs from "fs";
import path from "path";

/**
 * Jetson에서 보내는 vehicle_data(send_data)를 처리:
 * - 전체 데이터는 프론트로 그대로 전달 (update-display)
 * - cars 데이터만 DB에 기록 (parking_event + parking_route)
 */

export default (io, pool, clientManager) => {
    io.on("connection", (socket) => {
        console.log("Jetson 연결됨:", socket.id);

        socket.on("vehicle_data", async (data) => {
            console.log("vehicle_data 수신됨");

            const { time, cars, parking_spaces, moving_spaces, web_positions, display } = data;

            // Jetson → 프론트 (라즈베리파이/웹)로 전체 브로드캐스트
            io.emit("update-display", data);

            // 라즈베리파이에 값 전달
            // 1 -> pi1번,  2-> pi2번, 
            for (const [piNumber, info] of Object.entries(display || {})) {
                if (!Array.isArray(info) || !info.length) continue;

                const [ car_number, direction ] = info[0];
                if (!car_number || !direction) continue;


                const convertedDir = convertDirection(piNumber, direction.toLowerCase());
                const targetPi = `pi${piNumber}`;

                // 특정 라즈베리파이에 전달
                clientManager.sendTo(targetPi, "update-display", {
                    car_number, direction: convertedDir
                });
                console.log(`서버 → ${targetPi} 데이터 전송됨:`, { car_number, converted: convertedDir });
            };

            // 차량 데이터(cars)만 DB에 반영
            for (const [carId, carInfo] of Object.entries(cars || {})) {
                const { car_number, status, entry_time, position, photo } = carInfo;

                if (!car_number || !status) continue;

                try {
                    // 🔹 기존 세션(아직 출차 안한 차량) 조회
                    const [rows] = await pool.query(
                        `SELECT id, status FROM parking_event
                        WHERE plate_number=? AND exit_time IS NULL
                        ORDER BY id DESC LIMIT 1`,
                        [car_number]
                    );

                    let eventId;

                    // 1) 세션 없으면 새로 생성 (입차)
                    if (!rows.length) {
                        const [result] = await pool.query(
                            `INSERT INTO parking_event (plate_number, entry_time, status)
                            VALUES (?, FROM_UNIXTIME(?), ?)`,
                            [car_number, entry_time, status]
                        );
                        eventId = result.insertId;
                        console.log(`[입차] 새로운 세션 생성: ${car_number}`);
                    } else {
                        // 2) 세션 있으면 기존 ID 사용
                        eventId = rows[0].id;

                        // 상태 변경 감지 → 업데이트
                        if (rows[0].status !== status) {
                            await pool.query(
                                `UPDATE parking_event SET status=? WHERE id=?`,
                                [status, eventId]
                            );
                            console.log(`[상태 변경] ${car_number}: ${rows[0].status} → ${status}`);
                        }
                    }

                    // 3) 좌표 로그 저장 (매 tick)
                    if (position && Array.isArray(position)) {
                        await pool.query(
                            `INSERT INTO parking_route (event_id, type, node_list)
                            VALUES (?, ?, ?)`,
                            [eventId, status, JSON.stringify(position)]
                        );
                        // console.log(`[경로 저장] ${car_number}: ${position}`);
                    }

                    // 4) 출차 시 세션 종료
                    if (status.toLowerCase() === "exit") {
                        await pool.query(
                            `UPDATE parking_event 
                            SET exit_time=NOW(), status='exit'
                            WHERE id=?`,
                            [eventId]
                        );
                        console.log(`[출차 완료] ${car_number}`);
                    }

                    // 사진 저장
                    if (photo && status.toLowerCase() === "entry") {
                        try {
                            const fileName = `${Date.now()}_${car_number}.jpg`;
                            const uploadDir = path.join(process.cwd(), "uploads/cars");
                            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                            const filePath = path.join(uploadDir, fileName);
                            const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
                            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

                            await pool.query(
                                `UPDATE parking_event SET entry_photo_url=? WHERE id=?`,
                                [`/uploads/cars/${fileName}`, eventId]
                            );
                            console.log(`[사진 저장 완료] ${fileName}`);
                        } catch (errPhoto) {
                            console.error("사진 처리 오류:", errPhoto.message);
                        }
                    }
                } catch (err) {
                    console.error("DB 처리 오류:", err.message);
                }
            }
        });
    });
};

// 방향 변환 함수
function convertDirection(piNumber, agxDir) {
  const mapGroup1 = { left: "up", right: "down", up: "right", down: "left" };  // 1~3번용
  const mapGroup2 = { left: "down", right: "up", up: "left", down: "right" };  // 4~6번용

    if (piNumber >= 1 && piNumber <= 3) return mapGroup1[agxDir] || agxDir;
    if (piNumber >= 4 && piNumber <= 6) return mapGroup2[agxDir] || agxDir;

  return agxDir; // 기본 (예외)
}

