const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, JWT_SECRET } = process.env;

/**
 * 🔹 1️⃣ Google 로그인 URL 요청
 */
const getGoogleAuthUrl = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20email%20profile&response_type=code&access_type=offline`;
  return res.json({ authUrl });
};

/**
 * 🔹 2️⃣ Google OAuth 콜백 (인가 코드 받아서 사용자 정보 조회 후 응답)
 */
const googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    console.error("❌ 인가 코드 없음!");
    return res.status(400).json({ message: "❌ 인가 코드가 없습니다." });
  }

  try {
    // ✅ Google에서 Access Token 요청
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    });

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      console.error("❌ Access Token 받기 실패!");
      return res.status(400).json({ message: "❌ Access Token을 받을 수 없습니다." });
    }

    // ✅ Access Token으로 사용자 정보 요청
    const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = userInfoResponse.data;
    console.log("✅ Google 사용자 정보:", userInfo);

    // ✅ @g.yju.ac.kr 이메일 검증 추가
    if (!userInfo.email.endsWith("@g.yju.ac.kr")) {
      console.log("❌ 유효하지 않은 이메일:", userInfo.email);
      return res.send(`
        <script>
          window.opener.postMessage({ error: "유효한 이메일이 아닙니다." }, "http://localhost:5173");
          window.close();
        </script>
      `);
    }    

    // ✅ DB에서 사용자 확인
    db.query("SELECT * FROM users WHERE email = ?", [userInfo.email], (err, results) => {
      if (err) {
        console.error("❌ DB 조회 오류:", err);
        return res.status(500).json({ message: "❌ 서버 오류 발생", error: err });
      }

      // ✅ 회원가입이 필요한 경우
      if (results.length === 0) {
        console.log("🚀 회원가입 필요!");
        return res.send(`
          <script>
            window.opener.postMessage({ needRegister: true, email: "${userInfo.email}" }, "http://localhost:5173");
            window.close();
          </script>
        `);
      }

      // ✅ 기존 회원이면 JWT 발급
      const user = results[0];

      // ✅ 승인 대기 상태 확인
      if (user.is_verified === 0) {
        console.log("⏳ 승인 대기 상태:", user.email);
        return res.send(`
          <script>
            if (!window.sessionStorage.getItem("approvalPending")) {
              window.sessionStorage.setItem("approvalPending", "true");
              window.opener.postMessage({ error: "승인 대기 중입니다." }, "http://localhost:5173");
            }
            window.close();
          </script>
        `);
      }

      const jwtToken = jwt.sign(
        {
          sub: user.google_id || "unknown",  // ✅ google_id가 없을 경우 'unknown'으로 설정
          email: user.email,
          name: user.name,
          role: user.role || "student",  // ✅ 기본값 'student'
          is_verified: user.is_verified || 0, // ✅ 기본값 0 (false)
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ 로그인 성공! JWT 발급 완료:", jwtToken);

      // ✅ JWT 토큰과 역할을 프론트엔드로 전달 후 창 닫기
      return res.send(`
        <script>
          window.opener.postMessage({ token: "${jwtToken}", role: "${user.role || "student"}" }, "http://localhost:5173");
          window.close();
        </script>
      `);
    });
  } catch (error) {
    console.error("❌ Google OAuth 처리 중 오류 발생:", error.message);
    return res.status(500).json({ message: "Google 로그인 실패", error: error.message });
  }
};

module.exports = {
  getGoogleAuthUrl,
  googleCallback,
};
