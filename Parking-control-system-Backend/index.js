const express = require("express");
const { swaggerUi, specs } = require("./docs/swagger");

const app = express();
app.use(express.json());

// Swagger 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 테스트 라우트
app.get("/", (req, res) => {
  res.send("🚗 Parking Control System Backend running...");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
  console.log("✅ Swagger docs at http://localhost:3000/api-docs");
});
