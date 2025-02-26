const express = require("express");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser); // ✅ 회원가입 요청만 유지

module.exports = router;
