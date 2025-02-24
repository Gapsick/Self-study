require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2"); // ✅ MySQL 추가

const app = express();

// CORS 설정 (프론트엔드 URL 허용)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// ✅ 환경 변수 불러오기
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // 기본값 설정

// 🔹 필수 환경 변수 체크
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("❌ [ERROR] Google OAuth 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
}

if (!JWT_SECRET || JWT_SECRET === "default_jwt_secret") {
    console.warn("⚠️ [WARNING] JWT_SECRET이 안전하지 않습니다. .env 파일에서 변경하세요.");
}

// ✅ MySQL 연결 설정
const db = mysql.createConnection({
    host: "210.101.236.159",
    user: "ss",        // MySQL 사용자명
    password: "1234", // MySQL 비밀번호
    database: "ss_vue_test", // 사용할 데이터베이스
});

// MySQL 연결 확인
db.connect((err) => {
    if (err) {
        console.error("❌ MySQL 연결 실패:", err);
        process.exit(1);
    }
    console.log("✅ MySQL 연결 성공!");
});

// ✅ 로그인 유지 API (JWT 검증)
app.get("/api/auth/me", (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
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
        return res.status(400).json({ message: "❌ 인증 코드가 없습니다." });
    }

    try {
        // 1️⃣ Google OAuth API에서 Access Token 요청
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5173/",
            grant_type: "authorization_code",
            code
        });

        const { access_token } = tokenResponse.data;
        if (!access_token) return res.status(500).json({ message: "Google Access Token 없음" });

        // 2️⃣ Google API에서 사용자 정보 가져오기
        const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userInfo = userInfoResponse.data;

        // 3️⃣ MySQL에서 기존 사용자 확인
        db.query("SELECT * FROM users WHERE google_id = ?", [userInfo.id], (err, results) => {
            if (err) {
                console.error("❌ MySQL 조회 오류:", err);
                return res.status(500).json({ message: "서버 오류" });
            }

            let user;
            if (results.length > 0) {
                // 기존 사용자 로그인 처리
                user = results[0];
                console.log("✅ 기존 사용자 로그인:", user.email);
            } else {
                // 새로운 사용자 등록
                const newUser = {
                    google_id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    role: "student",
                    is_verified: false, // 기본적으로 승인되지 않은 상태
                };

                db.query("INSERT INTO users SET ?", newUser, (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("❌ MySQL 저장 오류:", insertErr);
                        return res.status(500).json({ message: "유저 저장 실패" });
                    }
                    console.log("✅ 신규 사용자 등록:", newUser.email);
                });

                user = newUser;
            }

            // 4️⃣ JWT 발급
            const jwtToken = jwt.sign(
                {
                    sub: user.google_id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    is_verified: user.is_verified,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
                },
                JWT_SECRET
            );

            // 5️⃣ 클라이언트에 응답
            res.json({
                message: "로그인 성공!",
                jwtToken,
                userInfo: {
                    id: user.google_id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    is_verified: user.is_verified
                }
            });
        });

    } catch (error) {
        console.error("❌ Google OAuth Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Google 로그인 실패", error: error.response?.data });
    }
});

// ✅ 관리자 승인 API
app.post("/api/admin/approve", (req, res) => {
    const { google_id } = req.body;

    if (!google_id) {
        return res.status(400).json({ message: "유효한 사용자 ID가 없습니다." });
    }

    // ✅ 유저 승인 업데이트
    db.query("UPDATE users SET is_verified = TRUE WHERE google_id = ?", [google_id], (err, result) => {
        if (err) {
            console.error("❌ 승인 업데이트 오류:", err);
            return res.status(500).json({ message: "승인 실패" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "사용자를 찾을 수 없음" });
        }

        console.log(`✅ ${google_id} 승인 완료`);
        res.json({ message: "사용자 승인 완료" });
    });
});

// ✅ 서버 실행
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
