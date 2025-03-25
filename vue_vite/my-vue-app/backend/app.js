const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // 이거도 필요!
require("dotenv").config();
const app = express(); // ✅ 제일 위로 올리기


// 라인 Webhook 먼저 연결
const webhookRoutes = require('./config/webhook');
app.use(bodyParser.json());
app.use('/webhook', webhookRoutes);


// ✅ 기존 라우트 유지
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetable");
const holidayRoutes = require("./routes/holidays");

const path = require("path");
const fs = require("fs");


app.get("/uploads/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  }

  // ✅ 숫자 제거: "1234-파일명.확장자" → "파일명.확장자"
  const originalName = filename.replace(/^\d+-/, "");

  // ✅ 브라우저 호환을 위한 Content-Disposition 설정 (크롬/엣지/사파리 모두 지원)
  const encodedFileName = encodeURIComponent(originalName);
  res.setHeader("Content-Disposition", `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
  res.setHeader("Content-Type", "application/octet-stream");

  res.download(filePath);
});


// ✅ CORS 설정 (프론트엔드 도메인 허용)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // ✅ 쿠키 및 인증 정보 전달 허용
}));

// ✅ JSON 데이터 처리 및 URL 인코딩된 데이터 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 업로드된 파일 정적 제공
app.use("/uploads", express.static("uploads"));

// ✅ API 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/holidays", holidayRoutes);


// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: 포트 ${PORT}`);
});
