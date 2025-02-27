const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ 공지사항 추가 API (POST)
router.post("/", (req, res) => {
  const { title, content, academic_year, subject_id } = req.body;

  if (!title || !content || !academic_year || !subject_id) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const query = "INSERT INTO notices (title, content, academic_year, subject_id) VALUES (?, ?, ?, ?)";
  db.query(query, [title, content, academic_year, subject_id], (err, result) => {
    if (err) {
      console.error("❌ 공지사항 추가 실패:", err);
      return res.status(500).json({ message: "공지사항 추가 중 오류 발생!" });
    }
    res.json({ message: "공지사항이 성공적으로 추가되었습니다!", noticeId: result.insertId });
  });
});

// ✅ 공지사항 목록 가져오기
router.get("/", (req, res) => {
    console.log("📢 공지사항 목록 조회 API 호출됨"); // ✅ 추가된 디버깅 로그

    const query = "SELECT * FROM notices ORDER BY created_at DESC";
    db.query(query, (err, results) => {
      if (err) {
        console.error("❌ 공지사항 목록 조회 실패:", err);
        return res.status(500).json({ message: "공지사항 조회 중 오류 발생!" });
      }
      res.json(results);
    });
});



module.exports = router;
