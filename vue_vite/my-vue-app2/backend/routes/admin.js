const express = require("express");
const db = require("../models/db");

const router = express.Router();

// ✅ 승인 대기 사용자 목록 가져오기
router.get("/pending-users", (req, res) => {
  db.query("SELECT id, email, name FROM users WHERE is_approved = 0", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB 오류" });
    }
    res.json(result);
  });
});

// ✅ 사용자 승인
router.post("/approve", (req, res) => {
  const { userId } = req.body;
  db.query("UPDATE users SET is_approved = 1 WHERE id = ?", [userId], (err) => {
    if (err) {
      return res.status(500).json({ message: "DB 오류" });
    }
    res.json({ message: "사용자 승인 완료" });
  });
});

// ✅ 사용자 거부 (삭제)
router.post("/reject", (req, res) => {
  const { userId } = req.body;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) {
      return res.status(500).json({ message: "DB 오류" });
    }
    res.json({ message: "사용자 삭제 완료" });
  });
});

module.exports = router;
