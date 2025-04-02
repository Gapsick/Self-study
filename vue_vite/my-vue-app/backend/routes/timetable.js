const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ 날짜별 시간표 조회 (학년 기준)
router.get("/timetable/:academic_year/date/:date", async (req, res) => {
  const { academic_year, date } = req.params;

  try {
    const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });

    const query = `
      SELECT t.id, t.day, t.start_period, t.end_period, t.professor, t.classroom,
             DATE_FORMAT(t.start_date, '%Y-%m-%d') AS start_date,
             DATE_FORMAT(t.end_date, '%Y-%m-%d') AS end_date,
             s.name AS subject_name, s.category, s.level,
             s.class_group AS subject_class_group,
             t.class_group AS timetable_class_group, t.subject_id
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      WHERE ? BETWEEN t.start_date AND t.end_date
        AND t.day = ?
        AND (
          (s.category = '정규' AND s.academic_year = ?)
          OR s.category = '특강'
        )
      ORDER BY t.start_period;
    `;

    const [results] = await db.promise().query(query, [date, dayOfWeek, academic_year]);
    res.json(results);
  } catch (err) {
    console.error("❌ 날짜별 시간표 조회 오류:", err);
    res.status(500).json({ error: "시간표 조회 중 오류 발생" });
  }
});

// ✅ 주간 시간표 조회 (학년 기준)
router.get("/timetable", async (req, res) => {
  try {
    const { academic_year, is_korean } = req.query; // 'is_korean' 파라미터로 한국어 여부 판단

    // if (!academic_year && !is_korean) {
    //   return res.status(400).json({ error: "학년 또는 한국어 여부 필요" });
    // }

    // 특강(0), 정규(1/2/3), 한국어(NULL) 각각 조건 분기
    let condition = "";
    if (academic_year === "0") {
      // 특강
      condition = "s.academic_year = 0";
    } else if (academic_year === "1" || academic_year === "2" || academic_year === "3") {
      // 정규
      condition = `s.academic_year = ${db.escape(academic_year)}`;
    } else if (academic_year === "KOR") {
      // 한국어 (subjects.academic_year IS NULL)
      condition = "s.academic_year IS NULL";
    } else {
      // 기본: 아무것도 전달 안 되면 전체 or 에러
      // return res.status(400).json({ error: "학년 정보가 없습니다." });
      condition = "1=1"; // 전체
    }

    const sql = `
      SELECT 
        t.id, t.day, t.start_period, t.end_period, t.professor, t.classroom,
        DATE_FORMAT(t.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(t.end_date, '%Y-%m-%d') AS end_date,
        s.name AS subject_name, t.subject_id, t.class_group, s.academic_year
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      WHERE ${condition}
      ORDER BY FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday'), t.start_period
    `;
    const [rows] = await db.promise().query(sql);
    res.json(rows); // 배열 그대로 응답
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
});



// ✅ 시간표 추가
router.post("/timetable", async (req, res) => {
  try {
    const {
      subject_id, professor, classroom, day,
      start_period, end_period, start_date, end_date, class_group
    } = req.body;

    if (!subject_id || !professor || !classroom || !day || !start_period || !end_period || !start_date || !end_date) {
      return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
    }

    const insertQuery = `
      INSERT INTO timetable (
        subject_id, day, professor, classroom,
        start_period, end_period, start_date, end_date, class_group
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [
      subject_id, day, professor, classroom,
      start_period, end_period, start_date, end_date, class_group || null
    ]);

    res.status(201).json({ message: "시간표 추가 완료" });
  } catch (error) {
    console.error("❌ 시간표 추가 오류:", error);
    res.status(500).json({ error: "서버 내부 오류 발생" });
  }
});

// ✅ 시간표 수정
router.put("/timetable/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject_id, professor, classroom,
      start_period, end_period, start_date, end_date, day, class_group
    } = req.body;

    if (!subject_id || !professor || !classroom || !start_period || !end_period || !start_date || !end_date || !day) {
      return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
    }

    const updateQuery = `
      UPDATE timetable
      SET subject_id = ?, professor = ?, classroom = ?,
          start_period = ?, end_period = ?, start_date = ?, end_date = ?, day = ?, class_group = ?
      WHERE id = ?
    `;
    await db.promise().query(updateQuery, [
      subject_id, professor, classroom,
      start_period, end_period, start_date, end_date, day, class_group || null, id
    ]);

    res.json({ message: "시간표 수정 완료" });
  } catch (error) {
    console.error("❌ 시간표 수정 오류:", error);
    res.status(500).json({ error: "시간표 수정 중 오류 발생" });
  }
});

// ✅ 시간표 삭제
router.delete("/timetable/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery = "SELECT * FROM timetable WHERE id = ?";
    const [result] = await db.promise().query(checkQuery, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "해당 시간표가 존재하지 않습니다." });
    }

    const deleteQuery = "DELETE FROM timetable WHERE id = ?";
    await db.promise().query(deleteQuery, [id]);

    res.json({ message: "시간표 삭제 완료" });
  } catch (error) {
    console.error("❌ 시간표 삭제 오류:", error);
    res.status(500).json({ error: "시간표 삭제 중 오류 발생" });
  }
});

module.exports = router;