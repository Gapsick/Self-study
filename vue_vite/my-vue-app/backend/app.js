const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ✅ 기존 라우트 유지
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetable");


const app = express();

const path = require("path");
const fs = require("fs");

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // 파일이 존재하는지 확인
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  }

  // 📌 다운로드 헤더 추가
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
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
app.use("/api", timetableRoutes);
app.use("/api/timetable", timetableRoutes);


// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: 포트 ${PORT}`);
});
