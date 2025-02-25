const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes"); // ✅ 인증 라우트 불러오기

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // 프론트엔드 CORS 허용
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes); // ✅ 인증 관련 라우트 적용

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
