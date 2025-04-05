const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 휴강 조회
router.get('/', (req, res) => {
  const query = 'SELECT * FROM holidays';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ 휴강 추가
router.post('/', (req, res) => {
    const { holiday_date, subject_id, day, lecture_period, period } = req.body;
  
    console.log("📥 받은 holiday_date:", holiday_date)  // 👈 이거 꼭 추가
  
    if (!holiday_date || !subject_id || !day || !lecture_period || period === undefined || period === null) {
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
  
// ✅ 바디로 삭제하는 DELETE 추가
router.delete('/', (req, res) => {
  const { holiday_date, subject_id, day, lecture_period, period } = req.body;

  if (!holiday_date || !subject_id || !day || !lecture_period) {
    return res.status(400).json({ error: '필수 필드를 입력해주세요.' });
  }

  let query = `
    DELETE FROM holidays
    WHERE holiday_date = ? AND subject_id = ? AND day = ? AND lecture_period = ?
  `;
  const params = [holiday_date, subject_id, day, lecture_period];

  // 🟡 period가 null이라고 넘어오더라도 실제 저장된 값과 매칭되도록 수정!
  if (period === null || period === undefined) {
    query += ` AND (period IS NULL OR period = '')`; // 혹시 몰라 빈 문자열도 포함
  } else {
    query += ` AND period = ?`;
    params.push(period);
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, deleted: result.affectedRows });
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
