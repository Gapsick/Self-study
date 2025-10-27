import fs from "fs";
import path from "path";
import pool from "../db/connection.js";

// 연결된 클라이언트를 저장할 객체
// 예: { pi1: "socketId_1", pi2: "socketId_2", jetson: "socketId_3" }
const connectedClients = {};

export default (io) => {
    io.on("connection", (socket) => {
        console.log(`연결: ${socket.id}`);
        console.log(`IP 주소: ${socket.handshake.address}`);

        // 장치가 연결될 때 자신을 등록
        socket.on("register", (data) => {
        const { id } = data; // 예: { id: "pi1" } 또는 { id: "jetson" }

        // 이미 존재하면 socketId 갱신
        connectedClients[id] = socket.id;
        console.log(`등록 완료 → ${id} (${socket.id})`);
        });

        // pi7번으로부터 사진 받기
        socket.on("entry_photo", async (data) => {
            const { car_number, image } = data
            if (!car_number || !image) return;

            try {
                const fileName = `${Date.now()}_${car_number}.jpg`;
                const uploadDir = path.join(process.cwd(), "uploads/cars");
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                const filePath = path.join(uploadDir, fileName);

                fs.writeFileSync(filePath, Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64"));
                
                const maxAttempts = 5; // 최대 5번 시도 (5초)
                let success = false;

                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                const [result] = await pool.query(
                    `UPDATE parking_event 
                    SET entry_photo_url=? 
                    WHERE plate_number=? AND exit_time IS NULL
                    ORDER BY id DESC LIMIT 1`,
                    [`/uploads/cars/${fileName}`, car_number]
                );

                if (result.affectedRows > 0) {
                    console.log(`✅ [입구 사진 DB 반영 완료] ${car_number} (시도 ${attempt}회)`);

                    // 프론트 알림 추가
                    io.emit("entry_data", { car_number, image });

                    success = true;
                    break;
                } else {
                    console.log(`⏳ ${car_number} 차량 DB 미존재 — ${attempt}회차 재시도 대기 중...`);
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
                }
                }

                if (!success) {
                console.warn(`⚠️ [사진 반영 실패] ${car_number} 차량의 parking_event 미생성`);
                }
            } catch (err) {
                console.error("사진 저장 오류:", err.message);
            }
        });

        // 연결 해제 시 목록에서 제거
        socket.on("disconnect", () => {
        const disconnectedId = Object.keys(connectedClients).find(
            (key) => connectedClients[key] === socket.id
        );
        if (disconnectedId) {
            delete connectedClients[disconnectedId];
            console.log(`연결 해제됨: ${disconnectedId}`);
        }
        });
    });

    // 외부에서 emit을 쉽게 하기 위한 단순 헬퍼
    return {
        getAll: () => connectedClients,

        sendTo: (id, event, data) => {
        const socketId = connectedClients[id];
        if (socketId) {
            io.to(socketId).emit(event, data);
            console.log(`${id}에게 '${event}' 전송:`, data);
        } else {
            console.log(`${id}는 현재 연결되어 있지 않음`);
        }
        },
    };
};