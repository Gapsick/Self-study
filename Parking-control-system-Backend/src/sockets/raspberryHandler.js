// Raspberry Pi 전용 소켓 핸들러
export default (io, pool, clientManager) => {
    io.on("connection", (socket) => {
        console.log("[Raspberry 연결됨]:", socket.id);
    });
};
