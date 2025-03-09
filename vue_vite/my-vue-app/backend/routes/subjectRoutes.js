const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ 학년별 과목 가져오기 + 전체 과목 조회 추가
router.get("/", (req, res) => {
  const { academic_year } = req.query;

  let query;
  let params = [];

  // 🔹 "전체" 또는 학년 정보가 없으면 모든 과목 반환
  if (!academic_year || academic_year === "전체") {
    query = "SELECT * FROM subjects ORDER BY academic_year, id";
  } else {
    query = "SELECT * FROM subjects WHERE academic_year = ? ORDER BY id";
    params = [academic_year];
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ 과목 조회 실패:", err);
      return res.status(500).json({ message: "과목 조회 중 오류 발생!" });
    }
    res.json(results);
  });
});

module.exports = router;
