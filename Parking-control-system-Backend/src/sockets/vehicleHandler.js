import fs from "fs";
import path from "path";

export default (io, pool) => {
    io.on("connection", (socket) => {
        console.log("클라이언트 연결됨:", socket.id);

        socket.on("vehicle_data", (data) => {
            for (const carInfo of Object.values(data)) {
                const { car_number, status, entry_time, position, photo } = carInfo;

                // 1. 세션 가져오기 or 생성
                pool.query(
                    `SELECT id FROM parking_event 
                    WHERE plate_number=? AND status<>'completed'
                    ORDER BY id DESC LIMIT 1`,
                    [car_number],
                    (err, rows) => {
                        if (err) return console.error("세션 조회 오류:", err.message);

                        const ensureEvent = (cb) => {
                            if (rows.length) return cb(rows[0].id, false); // 기존 세션
                            pool.query(
                                `INSERT INTO parking_event (plate_number, entry_time, status)
                                VALUES (?, FROM_UNIXTIME(?), ?)`,
                                [car_number, entry_time, status],
                                (err2, result) => {
                                    if (err2) {
                                        console.error("세션 생성 오류:", err2.message);
                                        return cb(null, false);
                                    }
                                    cb(result.insertId, true); // 새 세션
                                }
                            );
                        };

                        ensureEvent((eventId, isNew) => {
                            if (!eventId) return;

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

                                    pool.query(
                                        `UPDATE parking_event SET entry_photo_url=? WHERE id=?`,
                                        [`/uploads/cars/${fileName}`, eventId],
                                        (err3) => {
                                            if (err3) console.error("사진 저장 오류:", err3.message);
                                            else console.log("사진 저장 완료:", fileName);
                                        }
                                    );
                                } catch (errPhoto) {
                                    console.error("사진 처리 오류:", errPhoto.message);
                                }
                            }

                            // 3. 상태 처리
                            if (status === "parking") {
                                pool.query(
                                    `UPDATE parking_event SET status='parking' WHERE id=?`,
                                    [eventId],
                                    (err3) => err3 && console.error("상태 업데이트 오류:", err3.message)
                                );
                            } else if (status === "exiting") {
                                pool.query(
                                    `UPDATE parking_event 
                                    SET status='completed', exit_time=NOW() 
                                    WHERE id=?`,
                                    [eventId],
                                    (err3) => err3 && console.error("세션 완료 오류:", err3.message)
                                );
                            }

                            // 4. 좌표 로그 저장
                            if (position) {
                                pool.query(
                                    `INSERT INTO parking_route (event_id, type, node_list)
                                    VALUES (?, ?, ?)`,
                                    [
                                        eventId,
                                        status === "exiting" ? "exit" : "entry",
                                        JSON.stringify(position),
                                    ],
                                    (err4) => {
                                        if (err4)
                                            console.error("경로 저장 오류:", err4.message);
                                        else
                                            console.log(`경로 저장 완료: event ${eventId}, pos=${position}`);
                                    }
                                );
                            }
                        });
                    }
                );
            }

            io.emit("vehicle_data", data); // 이벤트 이름 지정해서 프론트로 전달
        });
    });
};
