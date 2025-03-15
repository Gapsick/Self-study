const express = require("express");
const router = express.Router();
const db = require("../config/db");  // 📌 MySQL 연결 코드

// 📌 3️⃣ 특정 학년 + 특정 날짜 기준 시간표 (휴강 포함)
router.get('/:academic_year/date/:date', (req, res) => {
    const { academic_year, date } = req.params;
    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }); // 예: "Wednesday"
  
    const query = `
      SELECT 
          t.id,
          s.name AS subject_name,
          t.day,
          t.period,
          t.professor,
          t.classroom,
          t.start_date,
          t.end_date,
          t.lecture_period,
          CASE
              WHEN h.holiday_date IS NOT NULL THEN '휴강'
              ELSE '수업 있음'
          END AS status
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN holidays h 
        ON t.subject_id = h.subject_id 
        AND t.lecture_period = h.lecture_period
        AND t.day = h.day
        AND h.holiday_date = ?
      WHERE 
          ? BETWEEN t.start_date AND t.end_date
          AND t.day = ?
          AND s.academic_year = ?
      ORDER BY t.period;
    `;
  
    db.query(query, [date, date, dayOfWeek, academic_year], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });


// 추가
router.post('/', (req, res) => {
    const {
      subject_id, day, professor, classroom,
      start_date, end_date, lecture_period, period
    } = req.body
  
    if (!subject_id || !day || !lecture_period || !professor || !classroom || !period || !start_date || !end_date) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }
  
    const query = `
      INSERT INTO timetable (
        subject_id, day, professor, classroom,
        start_date, end_date, lecture_period, period
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  
    db.query(query, [
      subject_id, day, professor, classroom,
      start_date, end_date, lecture_period, period
    ], (err, result) => {
      if (err) return res.status(500).json({ error: err })
      res.json({ success: true, id: result.insertId })
    })
  })
  

  // 수정
  router.put('/:id', (req, res) => {
    const {
      subject_id, day, professor, classroom,
      start_date, end_date, lecture_period, period
    } = req.body
  
    const query = `
      UPDATE timetable SET
        subject_id = ?, day = ?, professor = ?, classroom = ?,
        start_date = ?, end_date = ?, lecture_period = ?, period = ?
      WHERE id = ?
    `
  
    db.query(query, [
      subject_id, day, professor, classroom,
      start_date, end_date, lecture_period, period, req.params.id
    ], (err) => {
      if (err) return res.status(500).json({ error: err })
      res.json({ success: true })
    })
  })
  
// 삭제
router.delete('/:id', (req, res) => {
    const query = `DELETE FROM timetable WHERE id = ?`
    db.query(query, [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err })
      res.json({ success: true })
    })
  })
  

// 📌 라우터 내보내기
module.exports = router;
