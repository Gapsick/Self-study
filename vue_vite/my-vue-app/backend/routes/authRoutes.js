const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Google 로그인 관련
router.get("/google/url", authController.getGoogleAuthUrl);
router.post("/google", authController.googleCallback);
router.get("/google/callback", authController.googleCallback);

module.exports = router;
