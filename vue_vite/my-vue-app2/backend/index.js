require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 허용 (다른 도메인에서 API 요청 가능)
app.use(express.json()); // JSON 형식의 요청(body) 데이터를 파싱

// API 라우트 연결
const authRoutes = require("./routes/auth");
const signupRoutes = require("./routes/signup");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/admin", adminRoutes);

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
