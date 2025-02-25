const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Google OAuth 콜백 처리 라우트 추가
router.get("/google/callback", authController.googleCallback);

// ✅ Google 로그인 URL 요청
router.get("/google/url", authController.getGoogleAuthUrl);

// ✅ Google OAuth 후 토큰 요청
router.post("/google", authController.googleCallback);

module.exports = router;
