const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/api/auth/google/callback";

// ✅ 1️⃣ 프론트에서 Google 로그인 요청 (OAuth 로그인 URL 반환)
router.get("/google", (req, res) => {
  const authURL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar`;
  res.json({ url: authURL });
});

// ✅ 2️⃣ Google OAuth 로그인 후, 인가코드로 accessToken 요청
router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "구글 인증 코드가 없습니다." });
    }
  
    try {
      console.log("✅ 1. 받은 인가코드:", code); // ✅ 인가코드 출력
  
      // Google 서버에 accessToken 요청
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });
  
      const { access_token, refresh_token, id_token } = tokenResponse.data;
      console.log("✅ 2. 받은 access_token:", access_token); // ✅ access_token 출력
  
      // 사용자 정보 가져오기
      const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      const { email, name } = userInfoResponse.data;
        // DB에서 사용자 존재 여부 확인
        console.log("🟢 DB 조회 시작: 이메일 =", email);

        db.query("SELECT id, role FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error("❌ DB 조회 중 오류:", err);
            return res.status(500).json({ message: "서버 오류", error: err.message });
        }

        console.log("🟢 DB 조회 완료. 결과:", result);

        // 신규 사용자라면 회원가입 페이지로 이동
        if (result.length === 0) {
            console.log("🟠 신규 사용자 → 회원가입 필요");
            return res.redirect(`http://localhost:5173/register?email=${email}`);
        }

        const user = result[0];
        console.log("✅ 기존 사용자 → 로그인 성공:", user);

        // JWT 발급
        const jwtToken = jwt.sign({ id: user.id, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // accessToken과 refreshToken을 DB에 저장 (선택 사항)
        db.query("UPDATE users SET google_access_token = ?, google_refresh_token = ? WHERE email = ?", [access_token, refresh_token, email]);

        // 로그인 성공 → 프론트엔드로 리디렉트
        return res.json({
            message: "로그인 성공",
            token: jwtToken,
          });
        });

    } catch (error) {
      console.error("❌ Google 로그인 실패:", error.message);
      return res.status(500).json({ message: "구글 로그인 실패", error: error.message });
    }
  });

  // ✅ 사용자 정보 가져오기 API
router.get("/user", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Bearer 토큰 추출
    if (!token) return res.status(401).json({ message: "토큰이 없습니다." });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      db.query("SELECT id, email, name, role FROM users WHERE id = ?", [decoded.id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB 오류", error: err });
  
        if (result.length === 0) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  
        res.json(result[0]); // ✅ 사용자 정보 반환
      });
    } catch (error) {
      res.status(401).json({ message: "유효하지 않은 토큰", error });
    }
  });
  

module.exports = router;
