import express from "express";
import httpPkg from "http";

import pool from "./src/db/connection.js";
import testDBConnection from "./src/server/dbTest.js";
import setupSocketServer from "./src/server/socket.js";

import { swaggerUi, specs } from "./docs/swagger.js";
import routes from "./src/routes/index.js";

const app = express();
const http = httpPkg.createServer(app);

app.use(express.json());

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// REST API 라우트
app.use("/", routes);

// 사진 미리보기
app.use("/uploads", express.static("uploads"));

// DB 연결 테스트
await testDBConnection(pool);

// Socket.IO 서버 등록
setupSocketServer(http, pool);

// 서버 실행
const PORT = process.env.PORT || 3000;
http.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
