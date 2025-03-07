const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ 전체 과목 가져오기
router.get("/", (req, res) => {
  const { academic_year } = req.query; // ✅ 학년을 query parameter로 받음

  if (!academic_year) {
    return res.status(400).json({ error: "❌ 학년 정보가 없습니다." });
  }

  const query = "SELECT * FROM subjects WHERE academic_year = ? ORDER BY id ASC";
  db.query(query, [academic_year], (err, results) => {
    if (err) {
      console.error("❌ 학년별 과목 조회 실패:", err);
      return res.status(500).json({ message: "과목 조회 중 오류 발생!" });
    }
    res.json(results);
  });
});


// ✅ 학년별 과목 가져오기 (예: /api/subjects?academic_year=1)
router.get("/:academic_year", (req, res) => {
  const { academic_year } = req.params;
  const query = "SELECT * FROM subjects WHERE academic_year = ? ORDER BY id ASC";
  db.query(query, [academic_year], (err, results) => {
    if (err) {
      console.error("❌ 학년별 과목 조회 실패:", err);
      return res.status(500).json({ message: "과목 조회 중 오류 발생!" });
    }
    res.json(results);
  });
});

module.exports = router;
