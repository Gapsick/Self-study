module.exports = (io, pool) => {
    io.on("connection", (socket) => {
        console.log("클라이언트 연결됨:", socket.id);

        socket.on("vehicle_data", (data) => {
        for (const carInfo of Object.values(data)) {
            const { car_number, status, entry_time, position } = carInfo;

            // 1. 세션 가져오기 or 생성
            pool.query(
            `SELECT id FROM parking_event 
            WHERE plate_number=? AND status<>'completed'
            ORDER BY id DESC LIMIT 1`,
            [car_number],
            (err, rows) => {
                if (err) return console.error("세션 조회 오류:", err.message);

                const ensureEvent = (cb) => {
                if (rows.length) return cb(rows[0].id); // 기존 세션
                pool.query(
                    `INSERT INTO parking_event (plate_number, entry_time, status)
                    VALUES (?, FROM_UNIXTIME(?), ?)`,
                    [car_number, entry_time, status],
                    (err2, result) => {
                    if (err2) {
                        console.error("세션 생성 오류:", err2.message);
                        return cb(null);
                    }
                    cb(result.insertId);
                    }
                );
                };

                ensureEvent((eventId) => {
                if (!eventId) return;

                // 2. 상태 처리
                if (status === "parking") {
                    pool.query(
                    `UPDATE parking_event SET status='parking' WHERE id=?`,
                    [eventId],
                    (err3) =>
                        err3 && console.error("상태 업데이트 오류:", err3.message)
                    );
                } else if (status === "exiting") {
                    pool.query(
                    `UPDATE parking_event 
                    SET status='completed', exit_time=NOW() 
                    WHERE id=?`,
                    [eventId],
                    (err3) =>
                        err3 && console.error("세션 완료 오류:", err3.message)
                    );
                }

                // 3. 좌표 로그 저장
                if (position) {
                    pool.query(
                    `INSERT INTO parking_route (event_id, type, polygon)
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
                        console.log(
                            `경로 저장 완료: event ${eventId}, pos=${position}`
                        );
                    }
                    );
                }
                });
            }
            );
        }

        io.emit(data); // 프론트 전달
        });
    });
    };
