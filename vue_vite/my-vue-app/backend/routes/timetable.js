const express = require("express");
const router = express.Router();
const db = require("../config/db");  // 📌 MySQL 연결 코드

// ✅ 모든 시간표 목록 조회
router.get("/", (req, res) => {
  const query = `
    SELECT t.*, s.academic_year AS grade, s.name AS subject_name
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// 📌 3️⃣ 특정 학년 + 특정 날짜 기준 시간표 (휴강 포함)
router.get('/:academic_year/date/:date', (req, res) => {
  const { academic_year, date } = req.params;
  const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });

  const query = `
    SELECT 
      t.*, s.name AS subject_name, s.category, s.academic_year
    FROM timetable t
    JOIN subjects s ON t.subject_id = s.id
    WHERE 
      ? BETWEEN t.start_date AND t.end_date
      AND t.day = ?
      AND (
        s.category = '정규' AND s.academic_year = ?
        OR s.category = '특강'
      )
    ORDER BY t.start_period;
  `;

  db.query(query, [date, dayOfWeek, academic_year], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// 추가
router.post('/', (req, res) => {
  const {
    subject_id, day, professor, classroom,
    start_date, end_date, start_period, end_period
  } = req.body;

  if (!subject_id || !day || !professor || !classroom || !start_date || !end_date || start_period == null || end_period == null) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  const query = `
    INSERT INTO timetable (
      subject_id, day, professor, classroom,
      start_date, end_date, start_period, end_period
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    subject_id, day, professor, classroom,
    start_date, end_date, start_period, end_period
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId });
  });
});

  

// 수정
router.put('/:id', (req, res) => {
  const {
    subject_id, day, professor, classroom,
    start_date, end_date, start_period, end_period
  } = req.body;

  const query = `
    UPDATE timetable SET
      subject_id = ?, day = ?, professor = ?, classroom = ?,
      start_date = ?, end_date = ?, start_period = ?, end_period = ?
    WHERE id = ?
  `;

  db.query(query, [
    subject_id, day, professor, classroom,
    start_date, end_date, start_period, end_period, req.params.id
  ], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// 삭제
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM timetable WHERE id = ?`;
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});


// 📌 라우터 내보내기
module.exports = router;
