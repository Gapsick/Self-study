require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
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

// ✅ 로그인 유지 API (자동 로그인 확인) → 가장 위에 배치하는 것이 직관적
app.get("/api/auth/me", (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"에서 토큰 추출
        if (!token) return res.status(401).json({ message: "토큰 없음" });

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.is_verified) {
            return res.status(403).json({ message: "관리자 승인이 필요합니다." });
        }

        res.json({ message: "✅ 승인된 사용자", userInfo: decoded });
    } catch (error) {
        res.status(401).json({ message: "유효하지 않은 토큰" });
    }
});

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
            redirect_uri: "http://localhost:5173/",
            grant_type: "authorization_code",
            code
        });

        console.log("✅ Google OAuth Response:", tokenResponse.data); // ✅ 응답 전체 확인

        const { access_token, id_token } = tokenResponse.data;

        if (!access_token) {
            console.error("❌ [ERROR] access_token이 존재하지 않습니다!");
        } else {
            console.log("✅ Access Token:", access_token);
        }

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
        // ✅ Google Access Token을 JWT에 포함
        const jwtToken = jwt.sign(
            {
                sub: userInfo.id,  
                email: userInfo.email,  
                name: userInfo.name,  
                role: "student",  
                is_verified: true,  
                googleAccessToken: access_token,  // ✅ Google Access Token 추가
                iat: Math.floor(Date.now() / 1000),  
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)  
            },
            JWT_SECRET
        );

        console.log("🔹 JWT Token Issued:", jwtToken);

        // 4️⃣ 클라이언트에게 JWT 토큰과 사용자 정보 반환
        res.json({
            message: "로그인 성공!",
            access_token,
            jwtToken,
            userInfo: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                role: userRole,
                is_verified: isVerified
            }
        });

        console.log("🔹 클라이언트로 전송되는 응답 데이터:", {
            message: "로그인 성공!",
            access_token,
            jwtToken,
            userInfo: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                role: "student",
                is_verified: true
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
