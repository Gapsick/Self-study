const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ 휴강 추가
router.post('/', (req, res) => {
    const { holiday_date, subject_id, day, lecture_period, period } = req.body;
  
    console.log("📥 받은 holiday_date:", holiday_date)  // 👈 이거 꼭 추가
  
    if (!holiday_date || !subject_id || !day || !lecture_period || !period) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }
  
    const query = `
      INSERT INTO holidays (holiday_date, subject_id, day, lecture_period, period)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(query, [holiday_date, subject_id, day, lecture_period, period], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    });
  });
  
  


// ✅ 휴강 삭제
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM holidays WHERE id = ?`;
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

module.exports = router;
