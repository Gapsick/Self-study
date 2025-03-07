const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL 연결 파일

router.get("/timetable", async (req, res) => {
    try {
        const { start, end, academic_year } = req.query;
        console.log(`📅 주간 시간표 조회 요청: ${start} ~ ${end} (학년: ${academic_year})`);

        if (!start || !end || !academic_year) {
            return res.status(400).json({ error: "❌ 요청에 start, end, academic_year 값이 필요합니다." });
        }

        // ✅ 주간 시간표 조회
        const timetableQuery = `
        SELECT t.id, t.day, t.lecture_period, t.period, t.professor, t.classroom, 
               s.name AS subject_name, t.subject_id
        FROM timetable t
        JOIN subjects s ON t.subject_id = s.id
        WHERE t.start_date <= ? 
        AND t.end_date >= ? 
        AND t.period = ? 
        ORDER BY FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'), t.lecture_period;
        `;    
        const [timetableRows] = await db.promise().query(timetableQuery, [end, start, academic_year]);

        // ✅ 해당 주간의 휴강 데이터 조회 (holiday_date 변환)
        const holidayQuery = `
            SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') AS holiday_date, day, subject_id 
            FROM holidays
            WHERE holiday_date BETWEEN ? AND ?;
        `;
        const [holidayRows] = await db.promise().query(holidayQuery, [start, end]);

        console.log("📌 시간표 데이터:", timetableRows);
        console.log("📌 휴강 데이터:", holidayRows);

        res.json({ timetable: timetableRows, holidays: holidayRows });
    } catch (error) {
        console.error("❌ 주간 시간표 조회 오류:", error);
        res.status(500).json({ error: "주간 시간표 조회 중 오류 발생" });
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
