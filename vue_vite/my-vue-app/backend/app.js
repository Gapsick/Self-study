const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ✅ 반드시 먼저: JSON 파싱 (webhook도 JSON으로 들어옴!)
app.use(bodyParser.json());

// ✅ webhook 등록은 json 미들웨어 바로 다음
const webhookRoutes = require('./config/webhook');
app.use('/webhook', webhookRoutes);

// --- 나머지 코드는 기존대로 ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetable");
const holidayRoutes = require("./routes/holidays");
const publicHolidays = require("./routes/publicHolidays")

const path = require("path");
const fs = require("fs");

app.get("/uploads/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  }

  const encodedFileName = encodeURIComponent(filename.replace(/^\d+-/, ""));

  // ✅ 파일 이름이 한글일 경우에도 깨지지 않도록 Content-Disposition 설정
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`
  );
  res.setHeader("Content-Type", "application/octet-stream");

  res.sendFile(filePath);
});

// ✅ 미리보기용 (inline 렌더링을 위한 전용 경로)
app.get("/preview/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  };
  const mimeType = mimeTypes[ext] || "application/octet-stream";

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", "inline"); // ✅ 바로 이게 미리보기 핵심!
  fs.createReadStream(filePath).pipe(res);
});


// ✅ CORS 설정
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ 추가적인 JSON 처리 (bodyParser와 중복되면 이건 생략 가능)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 정적 파일
app.use("/uploads", express.static("uploads"));

// ✅ API 라우터
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api", timetableRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api", publicHolidays)

// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: 포트 ${PORT}`);
});
