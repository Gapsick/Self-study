const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { createNotice, getNotices } = require("../controllers/noticeController");
const authMiddleware = require("../middleware/authMiddleware");


// 🔹 공지사항 작성 (관리자 & 교수만 가능)
router.post("/", authMiddleware, createNotice);

// 🔹 공지사항 목록 조회
router.get("/", getNotices);



module.exports = router;
