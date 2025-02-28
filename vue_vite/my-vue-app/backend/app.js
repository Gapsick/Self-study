const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");  // ✅ 일반 사용자 관련 API
const adminRoutes = require("./routes/adminRoutes"); // ✅ 관리자 전용 API

const noticeRoutes = require("./routes/noticeRoutes");
const subjectRoutes = require("./routes/subjectRoutes"); 

const app = express();

// ✅ CORS 설정 (프론트엔드 도메인 허용)
app.use(cors({
  origin: "http://localhost:5173", // ✅ Vue.js 프론트엔드 주소
  credentials: true,  // ✅ 쿠키 및 인증 정보 전달 허용
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);  // ✅ 관리자 API 경로 추가

app.use("/api/notices", noticeRoutes);
app.use("/api/subjects", subjectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: 포트 ${PORT}`);
});
