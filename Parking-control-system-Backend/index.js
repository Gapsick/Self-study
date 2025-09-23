import express from "express";
import { swaggerUi, specs } from "./docs/swagger.js";
import pool from "./src/db/connection.js";
import routes from "./src/routes/index.js";

import httpPkg from "http";
import { Server } from "socket.io";

import vehicleHandler from "./src/sockets/vehicleHandler.js";

const app = express();
app.use(express.json());

const http = httpPkg.createServer(app);
const io = new Server(http, { cors: { origin: "*" } });

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// REST API 라우트
app.use("/", routes);

// 사진 미리보기
app.use("/uploads", express.static("uploads"));

// DB 연결 테스트
const testDBConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log("DB 연결 성공");
      connection.release();
      return;
    } catch (err) {
      console.error(`DB 연결 실패 (${i + 1}/${retries}):`, err.message);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  console.error("DB 연결 최종 실패: DB가 준비되지 않았습니다.");
};

testDBConnection();



// Socket.IO 핸들러
vehicleHandler(io, pool);

// 서버 실행
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
