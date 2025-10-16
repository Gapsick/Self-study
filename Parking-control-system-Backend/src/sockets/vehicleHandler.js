import fs from "fs";
import path from "path";

/**
 * Jetson에서 보내는 vehicle_data를 처리하고,
 * DB 업데이트 후 특정 라즈베리파이로 값을 전달
 */

export default (io, pool, clientManager) => {
    io.on("connection", (socket) => {
        console.log("클라이언트 연결됨:", socket.id);
        
        // Jetson만 vehicle_data를 보냄
        socket.on("vehicle_data", async (data) => {
            console.log("vehicle_data 수신:", data);
            
            // 실시간 Data 처리
            const { time, parking, moving } = data;

            for (const [carId, carInfo] of Object.entries(moving || {})) {
                const { car_number, status, entry_time, position, photo } = carInfo;

                try {
                    // 1. 세션 가져오기 or 생성
                    const [rows] = await pool.query(
                        `SELECT id FROM parking_event 
                        WHERE plate_number=? AND exit_time is NULL
                        ORDER BY id DESC LIMIT 1`,
                        [car_number]
                    );

                    let eventId;
                    let isNew = false;

                    if (rows.length) {
                        eventId = rows[0].id; // 기존 세션
                    } else {
                        const [result] = await pool.query(
                            `INSERT INTO parking_event (plate_number, entry_time, status)
                            VALUES (?, FROM_UNIXTIME(?), ?)`,
                            [car_number, entry_time, status]
                        );
                        eventId = result.insertId; // 새 세션
                        isNew = true;
                    }

                    // 2. 새 세션일 때만 사진 저장
                    if (isNew && photo) {
                        try {
                            const fileName = `${Date.now()}_${car_number}.jpg`;
                            const uploadDir = path.join(process.cwd(), "uploads/cars");
                            if (!fs.existsSync(uploadDir)) {
                                fs.mkdirSync(uploadDir, { recursive: true });
                            }

                            const filePath = path.join(uploadDir, fileName);
                            const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
                            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

                            await pool.query(
                                `UPDATE parking_event SET entry_photo_url=? WHERE id=?`,
                                [`/uploads/cars/${fileName}`, eventId]
                            );

                            console.log("사진 저장 완료:", fileName);
                        } catch (errPhoto) {
                            console.error("사진 처리 오류:", errPhoto.message);
                        }
                    }

                    // 3. 상태 처리
                    if (status === "Parking") {
                        await pool.query(
                            `UPDATE parking_event SET status='parking' WHERE id=?`,
                            [eventId]
                        );
                    } else if (status === "Exit") {
                        await pool.query(
                            `UPDATE parking_event 
                            SET status='exit', exit_time=NOW() 
                            WHERE id=?`,
                            [eventId]
                        );
                    }

                    // 4. 좌표 로그 저장
                    if (position && Array.isArray(position) && position.length === 2) {
                        await pool.query(
                            `INSERT INTO parking_route (event_id, type, node_list)
                            VALUES (?, ?, ?)`,
                            [eventId, status === "exit" ? "exit" : "entry", JSON.stringify(position)]
                        );

                        console.log(`경로 저장 완료: event ${eventId}, pos=${position}`);
                    }
                } catch (err) {
                    console.error("DB 처리 오류:", err.message);
                }
            }
    
            // 브로드 캐스트
            io.emit("vehicle_update", data);
        });
    });
};
