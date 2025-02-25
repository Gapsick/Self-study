const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, REDIRECT_URI } = require("../config/authConfig");

// ✅ Google 로그인 URL 제공 (프론트에서 요청)
const getGoogleAuthUrl = (req, res) => {
    console.log("🔹 사용 중인 REDIRECT_URI:", REDIRECT_URI);

    const authUrl = `https://accounts.google.com/o/oauth2/auth`
        + `?client_id=${GOOGLE_CLIENT_ID}`
        + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
        + `&scope=${encodeURIComponent("openid email profile")}`
        + `&response_type=code`
        + `&access_type=offline`;

    console.log("🔹 Google 로그인 URL:", authUrl);
    res.json({ authUrl });
};

// ✅ Google OAuth 콜백 처리 (토큰 발급 및 사용자 정보 가져오기)
const googleCallback = async (req, res) => {

    console.log("✅ 요청 도착! URL:", req.url);
    console.log("✅ 받은 쿼리:", req.query);  // 🔹 `code` 확인 로그 추가

    const code = req.query.code;  // ✅ `code` 값 추출 방식 변경
    console.log("✅ 받은 인가 코드:", code); // 🔹 확인용 로그 추가

        if (!code || code === "undefined" || code === "null") {
        console.error("❌ 인가 코드 없음!");
        return res.status(400).json({ message: "❌ 인가 코드가 없습니다." });
    }


    let access_token = null; // ✅ 토큰을 try 바깥에서 선언하여 유지
    let refresh_token = null;
    let userInfo = null;
    
    try {
        // ✅ 1. Google OAuth 토큰 요청
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
            code
        });
    
        access_token = tokenResponse.data.access_token;
        refresh_token = tokenResponse.data.refresh_token;
    
        if (!access_token) throw new Error("Google에서 액세스 토큰을 받지 못했습니다.");
        if (!refresh_token) console.warn("⚠️ Google에서 Refresh Token을 제공하지 않았습니다.");
    } catch (error) {
        console.error("❌ Google OAuth 토큰 요청 실패:", error.message);
        return res.status(500).json({ message: "Google 로그인 실패 (토큰 요청)", error: error.message });
    }
    
    try {
        // ✅ 2. Google 사용자 정보 가져오기 & 이메일 검증
        const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });
    
        userInfo = userInfoResponse.data;
        if (!userInfo.email.endsWith("@g.yju.ac.kr")) {
            return res.status(403).json({ message: "❌ 유효하지 않은 이메일입니다. 학교 이메일을 사용하세요." });
        }
    } catch (error) {
        console.error("❌ Google 사용자 정보 가져오기 실패:", error.message);
        return res.status(500).json({ message: "Google 로그인 실패 (사용자 정보)", error: error.message });
    }
    
    try {
        // ✅ 3. MySQL에서 기존 사용자 확인
        db.query("SELECT * FROM users WHERE google_id = ?", [userInfo.id], (err, results) => {
            if (err) {
                console.error("❌ DB 조회 오류:", err);
                return res.status(500).json({ message: "서버 오류 (DB 조회)", error: err });
            }
    
            if (results.length === 0) {
                return res.status(200).json({ 
                    message: "회원가입이 필요합니다.", 
                    needRegister: true,
                    email: userInfo.email
                });
            }
    
            const user = results[0];
    
            // ✅ Refresh Token을 HttpOnly 쿠키에 저장
            res.cookie("refreshToken", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
    
            // ✅ JWT 발급
            const jwtToken = jwt.sign(
                {
                    sub: user.google_id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    is_verified: user.is_verified
                },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
    
            // ✅ 프론트엔드에 JWT 토큰 반환
            res.json({ jwtToken });
        });
    } catch (error) {
        console.error("❌ JWT 발급 또는 DB 처리 중 오류:", error.message);
        return res.status(500).json({ message: "로그인 실패 (JWT 발급)", error: error.message });
    }
    
}    

module.exports = { getGoogleAuthUrl, googleCallback };
