import { Server } from "socket.io";
import clientManager from "../sockets/clientManager.js";
import vehicleHandler from "../sockets/vehicleHandler.js";
import raspberryHandler from "../sockets/raspberryHandler.js";

export default function setupSocketServer(httpServer, pool) {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    console.log("Socket.IO 서버 초기화 완료");

    const manager = clientManager(io);
    vehicleHandler(io, pool, manager);
    raspberryHandler(io, pool, manager)

    // 연결 상태 로깅
    io.on("connection", (socket) => {
        console.log(`🟢 Socket 연결됨: ${socket.id}`);
    });

    return io;
}
