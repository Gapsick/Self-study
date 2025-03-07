const express = require("express");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const db = require("../models/db");

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/api/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// ✅ Google 로그인
router.get("/google", (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar`;
  res.redirect(redirectUrl);
});

// ✅ Google 로그인 콜백 처리
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "인가 코드가 없습니다." });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const email = userInfo.data.email;

    db.query("SELECT id, role FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.error("❌ DB 조회 오류:", err); // ✅ 콘솔에 오류 출력 추가
        return res.status(500).json({ message: "DB 오류 발생", error: err });
      }
    
      if (result.length === 0) {
        console.log("🟠 신규 사용자 → 회원가입 필요");
        return res.status(401).json({ message: "회원가입 필요" });
      }
    
      const user = result[0];
    
      const accessToken = jwt.sign({ id: user.id, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id, email }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    
      db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [refreshToken, user.id], (updateErr) => {
        if (updateErr) {
          console.error("❌ Refresh Token 저장 실패:", updateErr); // ✅ 콘솔에 오류 출력 추가
          return res.status(500).json({ message: "Refresh Token 저장 실패", error: updateErr });
        }
    
        res.send(`
          <script>
            window.opener.postMessage({ accessToken: "${accessToken}", refreshToken: "${refreshToken}" }, "http://localhost:5173");
            window.close();
          </script>
        `);
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Google 인증 중 오류 발생", error });
  }
});

// ✅ Refresh Token으로 Access Token 재발급
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh Token이 없습니다." });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "유효하지 않은 Refresh Token" });

    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  });
});

// ✅ 사용자 정보 API
router.get("/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.query("SELECT id, email, name, role FROM users WHERE id = ?", [decoded.id], (err, result) => {
      if (err) return res.status(500).json({ message: "DB 오류", error: err });

      if (result.length === 0) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

      res.json(result[0]);
    });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰", error });
  }
});

// ✅ 라우터 내보내기 (여기가 중요!)
module.exports = router;
