const express = require("express");
const { swaggerUi, specs } = require("./docs/swagger");
const pool = require('./src/db/connection');

const app = express();
app.use(express.json());

// DB 연결
pool.getConnection((err, connection) => {
  if (err) {
    console.error('DB 연결 안됨:', err.message);
    return;
  }
  console.log('DB 연결 성공');
  connection.release();
});

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 라우트
const routes = require("./src/routes");
app.use("/api/v1", routes);


// 테스트 라우트
app.get("/", (req, res) => {
  res.send("🚗 Parking Control System Backend running...");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
  console.log("✅ Swagger docs at http://localhost:3000/api-docs");
});
