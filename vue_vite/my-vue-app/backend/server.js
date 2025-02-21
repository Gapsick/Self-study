require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

// ✅ 환경 변수 확인
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // 기본값 설정

// 🔹 필수 환경 변수가 없으면 서버 실행 중지
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("❌ [ERROR] Google OAuth 환경 변수가 설정되지 않았습니다.");
    process.exit(1); // 서버 강제 종료
}

if (!JWT_SECRET || JWT_SECRET === "default_jwt_secret") {
    console.warn("⚠️ [WARNING] JWT_SECRET이 안전하지 않습니다. .env 파일에서 변경하세요.");
}

// ✅ Google OAuth 로그인 처리
app.post("/api/auth/google", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: "❌ [ERROR] 인증 코드가 없습니다." });
    }

    try {
        console.log("🔹 Received OAuth Code:", code);
        console.log("🔹 Using GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

        // 1️⃣ Google OAuth API에서 Access Token 요청
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5173/auth/callback",
            grant_type: "authorization_code",
            code
        });

        const { access_token, id_token } = tokenResponse.data;
        console.log("✅ Access Token:", access_token);
        console.log("✅ ID Token:", id_token);

        // 2️⃣ Google API에서 사용자 정보 가져오기
        const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userInfo = userInfoResponse.data;
        console.log("✅ User Info:", userInfo);

        // ✅ DB에서 사용자 역할과 승인 여부 조회 (여기서는 예제 값 사용)
        const userRole = "student"; // 기본 역할을 학생으로 설정
        const isVerified = true; // 관리자가 승인했다고 가정

        // 3️⃣ JWT 토큰 발급 (자동 로그인 유지)
        const jwtToken = jwt.sign(
            {
                sub: userInfo.id,  // Google 사용자 ID (기존 id에서 변경)
                email: userInfo.email,  // 사용자의 이메일
                name: userInfo.name,  // 사용자의 이름
                role: "student",  // 예제: 기본 역할을 학생(student)으로 설정
                is_verified: true,  // 예제: 관리자가 승인한 사용자 여부
                iat: Math.floor(Date.now() / 1000),  // 발급 시간 (초 단위)
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7일 후 만료
            },
            JWT_SECRET
        );
        
        console.log("🔹 JWT Token Issued:", jwtToken);

        // 4️⃣ 클라이언트에게 JWT 토큰과 사용자 정보 반환
        res.json({
            message: "로그인 성공!",
            jwtToken,
            userInfo: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                role: userRole,
                is_verified: isVerified
            }
        });

    } catch (error) {
        console.error("❌ Google OAuth Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Google 로그인 실패", error: error.response?.data });
    }
});

// ✅ Express 서버 실행
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
