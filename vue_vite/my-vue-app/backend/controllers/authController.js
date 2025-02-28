const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, JWT_SECRET } = process.env;

/**
 * 🔹 1️⃣ Google 로그인 URL 요청
 */
const getGoogleAuthUrl = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20email%20profile&response_type=code&access_type=offline&prompt=consent`;
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
    // ✅ Google에서 Access Token 및 Refresh Token 요청
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    });

    const { access_token, refresh_token } = tokenResponse.data;

    console.log("📢 (googleCallback) Google 응답:", tokenResponse.data); // ✅ Google 응답 전체 출력
    console.log("✅ (googleCallback) 받은 Access Token:", access_token);
    console.log("✅ (googleCallback) 받은 Refresh Token:", refresh_token || "없음");

    if (!access_token) {
      console.error("❌ Access Token 받기 실패!");
      return res.status(400).json({ message: "❌ Access Token을 받을 수 없습니다." });
    }

    // ✅ Access Token으로 사용자 정보 요청
    const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = userInfoResponse.data;
    console.log("✅ (googleCallback) Google 사용자 정보:", userInfo);

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

      let user = results[0];

      if (!user) {
        console.log("🚀 신규 사용자 회원가입 진행!");
        console.log("📢 (googleCallback) 신규 사용자의 Refresh Token:", refresh_token || "없음");

        // ✅ 신규 회원 추가 후 다시 조회
        db.query(
          "INSERT INTO users (email, name, role, refresh_token) VALUES (?, ?, ?, ?)",
          [userInfo.email, userInfo.name, "student", refresh_token || null],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("❌ 사용자 저장 오류:", insertErr);
              return res.status(500).json({ message: "사용자 저장 오류" });
            }

            console.log("✅ (googleCallback) 신규 사용자 저장 완료!");

            // ✅ 새로 추가된 유저 정보 다시 조회
            db.query("SELECT * FROM users WHERE email = ?", [userInfo.email], (reFetchErr, newResults) => {
              if (reFetchErr) {
                console.error("❌ 사용자 재조회 오류:", reFetchErr);
                return res.status(500).json({ message: "사용자 정보 재조회 오류" });
              }

              user = newResults[0];
              proceedWithLogin(user);
            });
          }
        );
      } else {
        console.log("✅ 기존 사용자 로그인!");
        console.log("📢 (googleCallback) 기존 사용자의 Refresh Token:", refresh_token || user.refresh_token);

        // ✅ 기존 사용자라면 Refresh Token 업데이트
        db.query(
          "UPDATE users SET refresh_token = ? WHERE email = ?",
          [refresh_token || user.refresh_token, user.email],
          (updateErr) => {
            if (updateErr) {
              console.error("❌ Refresh Token 업데이트 오류:", updateErr);
            } else {
              console.log("✅ (googleCallback) Refresh Token 업데이트 성공!");
            }
          }
        );

        proceedWithLogin(user);
      }

      function proceedWithLogin(user) {
        // ✅ 승인 대기 상태 확인
        if (user.is_verified === 0) {
          console.log("⏳ 승인 대기 상태:", user.email);
          return res.send(`
            <script>
              window.opener.postMessage({ error: "승인 대기 중입니다." }, "http://localhost:5173");
              window.close();
            </script>
          `);
        }

        // ✅ JWT Access Token 발급 (1시간)
        const jwtToken = jwt.sign(
          {
            sub: user.google_id || "unknown",
            email: user.email,
            name: user.name,
            role: user.role || "student",
            is_verified: user.is_verified || 0,
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        console.log("✅ (googleCallback) 로그인 성공! JWT 발급 완료:", jwtToken);
        console.log("📢 (googleCallback) 클라이언트로 보낼 Refresh Token:", refresh_token || "없음");

        return res.send(`
          <script>
            window.opener.postMessage({ 
              token: "${jwtToken}", 
              refreshToken: "${refresh_token || ""}", 
              email: "${user.email}",  // ✅ 이메일 추가
              role: "${user.role || "student"}"
            }, "http://localhost:5173");
            window.close();
          </script>
        `);
      }
    });
  } catch (error) {
    console.error("❌ Google OAuth 처리 중 오류 발생:", error.message);
    return res.status(500).json({ message: "Google 로그인 실패", error: error.message });
  }
};


module.exports = {
  getGoogleAuthUrl,
  googleCallback
};
