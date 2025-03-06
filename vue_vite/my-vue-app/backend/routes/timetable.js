const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL 연결 파일

// 📌 1️⃣ 특정 학년의 시간표 조회 (GET)
router.get("/timetable/:grade", async (req, res) => {
  try {
    const grade = req.params.grade;
    const query = `
      SELECT t.id, s.name AS subject_name, t.day, t.period, t.professor, t.classroom
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      WHERE s.academic_year = ?
      ORDER BY FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'), t.period;
    `;
    const [rows] = await db.promise().query(query, [grade]);

    // ✅ 데이터가 없을 경우 404 응답
    if (rows.length === 0) {
      return res.status(404).json({ error: `❌ ${grade}학년 시간표가 없습니다.` });
    }

    res.json(rows);
  } catch (error) {
    console.error("❌ 시간표 조회 오류:", error);
    res.status(500).json({ error: "시간표 조회 중 오류 발생" });
  }
});

// 📌 2️⃣ 새로운 시간표 추가 (POST)
router.post("/timetable", async (req, res) => {
    try {
      const { subject_id, professor, classroom, day, period } = req.body;
  
      if (!subject_id || !professor || !classroom || !day || !period) {
        return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
      }
  
      const insertQuery = `
        INSERT INTO timetable (subject_id, day, period, professor, classroom)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.promise().query(insertQuery, [subject_id, day, period, professor, classroom]);
  
      console.log("✅ 새로운 시간표 추가 성공");
      res.status(201).json({ message: "시간표 추가 완료" });
    } catch (error) {
      console.error("❌ 시간표 추가 오류:", error);
      res.status(500).json({ error: "서버 내부 오류 발생" });
    }
  });
  

// 📌 3️⃣ 기존 시간표 수정 (PUT)
router.put("/timetable/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { subject_id, professor, classroom } = req.body;

        // ✅ 필수 값 검증
        if (!subject_id || !professor || !classroom) {
            return res.status(400).json({ error: "❌ 필수 입력값이 누락되었습니다." });
        }

        // ✅ 시간표 수정 쿼리 실행
        const updateQuery = `
            UPDATE timetable
            SET subject_id = ?, professor = ?, classroom = ?
            WHERE id = ?
        `;
        await db.promise().query(updateQuery, [subject_id, professor, classroom, id]);

        console.log("✅ 시간표 수정 성공");
        res.json({ message: "시간표 수정 완료" });
    } catch (error) {
        console.error("❌ 시간표 수정 오류:", error);
        res.status(500).json({ error: "시간표 수정 중 오류 발생" });
    }
});

// 📌 4️⃣ 시간표 삭제 (DELETE)
router.delete("/timetable/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ ID가 존재하는지 확인
        const checkQuery = "SELECT * FROM timetable WHERE id = ?";
        const [result] = await db.promise().query(checkQuery, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: "❌ 해당 시간표가 존재하지 않습니다." });
        }

        // ✅ 시간표 삭제 실행
        const deleteQuery = "DELETE FROM timetable WHERE id = ?";
        await db.promise().query(deleteQuery, [id]);

        console.log(`✅ 시간표 삭제 완료 (ID: ${id})`);
        res.json({ message: "시간표 삭제 완료" });
    } catch (error) {
        console.error("❌ 시간표 삭제 오류:", error);
        res.status(500).json({ error: "시간표 삭제 중 오류 발생" });
    }
});


module.exports = router;
