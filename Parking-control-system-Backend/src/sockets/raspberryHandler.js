// Raspberry Pi 전용 소켓 핸들러
export default (io, pool, clientManager) => {
    io.on("connection", (socket) => {
        console.log("🔗 [Raspberry 연결됨]:", socket.id);

        // 라즈베리파이 데이터 수신
        socket.on("raspberry_data", async (data) => {
            console.log("raspberry_data 수신:", data);

            const raspberry_data = data.raspberry_data;

            // 예외 처리
            if (!raspberry_data || typeof raspberry_data !== "object") {
                return console.warn("arduino_data 없음 또는 잘못된 형식:", raspberry_data);
            }

            // 라즈베리파이에 값 전달
            // 1 -> pi1번,  2-> pi2번, 
            for (const [piNumber, info] of Object.entries(raspberry_data || {})) {
                const { car_number, direction } = info;

                // direction 값이 없을 경우
                if (!direction) {
                    console.warn(`pi${piNumber} direction 값이 없음`);
                    continue;
                } else if (!car_number) {
                    console.warn((`pi${piNumber} car_number 값이 없음`));
                };

                const targetPi = `pi${piNumber}`;

                // 특정 라즈베리파이에 전달
                clientManager.sendTo(targetPi, "update-display", {
                    car_number, direction
                });
            };

            // 결과 값 확인
            console.log("===== Socket 이벤트 발생 =====");
            console.log("수신 데이터 구조:", Object.keys(data));
            console.log("raspberry_data keys:", Object.keys(raspberry_data));
            console.log("raspberry_data 전체:", raspberry_data);
            console.log("=================================");

        });
    });
};
