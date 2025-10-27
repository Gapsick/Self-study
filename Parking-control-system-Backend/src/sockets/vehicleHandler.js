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

        // 값 받아오기
        const { time, cars, parking_spaces, moving_spaces, web_positions, display = {}, exit = {} } = data;

        // 그대로 프론트 전체 Data 전달
        io.emit("update-display", data);

        // 라즈베리파이 화면에 표시
        for (const [piNumber, info] of Object.entries(display || {})) {
            if (!Array.isArray(info) || !info.length) continue;
            const [car_number, direction] = info[0];
            if (!car_number || !direction) continue;

            const convertedDir = convertDirection(piNumber, direction.toLowerCase());
            const targetPi = `pi${piNumber}`;
            clientManager.sendTo(targetPi, "update-display", {
            car_number,
            direction: convertedDir,
            });
            console.log(`서버 → ${targetPi} 데이터 전송됨:`, {
            car_number,
            converted: convertedDir,
            });
        }

        // 차량 데이터(cars) DB 반영
        for (const [carId, carInfo] of Object.entries(cars || {})) {
            const { car_number, status, entry_time, position, space_id } = carInfo;
            if (!car_number || !status) continue;
            
            console.log("----------------------")
            console.log("carInfo:", space_id)
            console.log("----------------------")

            const spaceMap = {
                0: "A1", 1: "A2", 2: "A3", 3: "A4", 4: "A5", 5: "A6",
                6: "B1", 7: "B2", 8: "B3", 9: "B4",
                10: "C1", 11: "C2", 12: "C3", 13: "C4",
                14: "D1", 15: "D2", 16: "D3", 17: "D4", 18: "D5", 19: "D6", 20: "D7", 21: "D8", 22: "D9"
            };

            const slot_name = spaceMap[space_id] || null;

            console.log("----------------------")
            console.log("slot_name:", slot_name)
            console.log("----------------------")

            try {
            // 기존 세션 조회
            const [rows] = await pool.query(
                `SELECT id, status FROM parking_event
                WHERE plate_number=? AND exit_time IS NULL
                ORDER BY id DESC LIMIT 1`,
                [car_number]
            );

            let eventId;

            // 입차
            if (!rows.length) {
                const [result] = await pool.query(
                `INSERT INTO parking_event (plate_number, entry_time, status, slot_name)
                VALUES (?, FROM_UNIXTIME(?), ?, ?)`,
                [car_number, entry_time, status, slot_name]
                );
                eventId = result.insertId;
                console.log(`[입차] 새로운 세션 생성: ${car_number}`);
            } else {
                // 없으면 기존 세션 사용
                eventId = rows[0].id;

                // 상태 변경 감지
                if (rows[0].status !== status) {
                await pool.query(`UPDATE parking_event SET status=? WHERE id=?`, [status, eventId]);
                console.log(`[상태 변경] ${car_number}: ${rows[0].status} → ${status}`);
                }
            }

            // 이동 좌표 저장
            if (position && Array.isArray(position)) {
                await pool.query(
                `INSERT INTO parking_route (event_id, type, node_list)
                VALUES (?, ?, ?)`,
                [eventId, status, JSON.stringify(position)]
                );
            }
            } catch (err) {
            console.error("DB 처리 오류:", err.message);
            }
        }

        // 출차 데이터 처리 -> 만약에 처리를 한번에 2번 해야될 경우가 있을수 있음 (없으면 그냥 if문)
        for (const [_, info] of Object.entries(exit)) {
            const car_number = info.car_number;
            console.log(car_number)

            if (!car_number) continue;

            try {
            const [rows] = await pool.query(
                `SELECT id FROM parking_event
                WHERE plate_number=? AND exit_time IS NULL
                ORDER BY id DESC LIMIT 1`,
                [car_number]
            );

            if (!rows.length) {
                console.log(`출차 대상 없음 ${car_number}`);
                continue;
            }

            const eventId = rows[0].id;

            // 출차 시간 저장
            await pool.query(
                `UPDATE parking_event SET exit_time=NOW(), status='exit' WHERE id=?`,
                [eventId]
            );

            // entry_time, exit_time 가져오기
            const [result] = await pool.query(
                `SELECT entry_time, exit_time FROM parking_event WHERE id=?`,
                [eventId]
            );

            const { entry_time, exit_time } = result[0];

            console.log(`[출차 완료] ${car_number}`);

            // 라즈베리파이 7번 open 신호 전송
            clientManager.sendTo("pi7", "gate_open", true);
            console.log(`pi7번 에게 open data 보냄`)


            // 요금 계산
            const { durationSeconds, durationString, fee } = calculateParkingFee(entry_time, exit_time);

            // DB에 요금/시간 저장
            await pool.query(
                `UPDATE parking_event SET duration=?, fee=? WHERE id=?`,
                [durationSeconds, fee, eventId]
            );

            // 상세 데이터 조회
            const [detail] = await pool.query(
                `SELECT 
                    plate_number AS car_number,
                    slot_name,
                    entry_time,
                    exit_time,
                    entry_photo_url
                FROM parking_event
                WHERE id=?`,
                [eventId]
            );

            const d = detail[0];

            // 프론트로 전송
            const responseData = {
                car_number: d.car_number,
                entry_time: d.entry_time,
                exit_time: d.exit_time,
                duration: durationString,
                fee,
                slot_name: d.slot_name,
                entry_photo_url: d.entry_photo_url,
            };

            clientManager.sendTo("exitFront", "exit_summary", responseData);
            console.log(`exitFront에게 Data 전송 완료`, responseData);
            } catch (err) {
            console.error("출차 처리 에러:", err.message);
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

// 총 주차시간, 금액 계산 함수
function calculateParkingFee (entryTime, exitTime) {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);

    // 총 주차시간(초 단위)
    const diffSeconds = Math.floor((exit - entry) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    // 시간, 분 전환
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    // 요금 계산 규칙 (1초당 1원씩 = 분당 60원)
    const fee = Math.round(diffSeconds * 1);

    return {
        durationSeconds: diffSeconds,
        durationString: `${hours ? hours + "시간 " : ""}${minutes ? minutes + "분 " : ""}${seconds}초`,
        fee,
    }
}
