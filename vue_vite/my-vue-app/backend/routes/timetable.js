const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL 연결 파일
router.get("/timetable", async (req, res) => {
    try {
        const { start, end, academic_year } = req.query;
        console.log(`📅 주간 시간표 조회 요청: ${start} ~ ${end} (학년: ${academic_year})`);

        if (!start || !end || !academic_year) {
            return res.status(400).json({ error: "❌ start, end, academic_year 값이 필요합니다." });
        }

        // ✅ 학년 기준으로 timetable 조회
        // ✅ 학년 기준으로 timetable 조회
        const timetableQuery = `
            SELECT t.id, t.day, t.lecture_period, t.period, t.professor, t.classroom, 
                DATE_FORMAT(t.start_date, '%Y-%m-%d') AS start_date,  -- ✅ UTC → YYYY-MM-DD
                DATE_FORMAT(t.end_date, '%Y-%m-%d') AS end_date,  -- ✅ UTC → YYYY-MM-DD
                s.name AS subject_name, t.subject_id
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            WHERE t.start_date <= ? 
            AND t.end_date >= ? 
            AND t.period = ?
            ORDER BY FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'), t.lecture_period;
        `;    
        const [timetableRows] = await db.promise().query(timetableQuery, [end, start, academic_year]);


        // ✅ 해당 주간의 휴강 데이터 조회 (subject_id 기준)
        const holidayQuery = `
        SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') AS holiday_date, day, subject_id, lecture_period, period
        FROM holidays
        WHERE holiday_date BETWEEN ? AND ? AND period = ?;
        `;
        const [holidayRows] = await db.promise().query(holidayQuery, [start, end, academic_year]); // ✅ 학년 필터 추가

        console.log("📌 시간표 데이터:", timetableRows);
        console.log("📌 휴강 데이터:", holidayRows);

        res.json({ timetable: timetableRows, holidays: holidayRows });

    } catch (error) {
        console.error("❌ 주간 시간표 조회 오류:", error);
        res.status(500).json({ error: "주간 시간표 조회 중 오류 발생" });
    }
    });


router.get("/subjects", async (req, res) => {
    try {
        const { academic_year } = req.query;
        console.log("🔍 과목 목록 요청 학년:", academic_year);

        if (!academic_year) {
            return res.status(400).json({ error: "❌ 학년 정보가 없습니다." });
        }

        // ✅ 학년 필터링 추가
        const query = "SELECT id, name FROM subjects WHERE academic_year = ?";
        const [rows] = await db.promise().query(query, [academic_year]);

        console.log("📌 과목 목록 데이터 (필터링됨):", rows);
        res.json({ subjects: rows }); // ✅ 학년 필터링된 결과 반환
    } catch (error) {
        console.error("❌ 과목 목록 조회 오류:", error);
        res.status(500).json({ error: "과목 목록 조회 중 오류 발생" });
    }
});

// 📌 새로운 시간표 추가 (POST)
router.post("/timetable", async (req, res) => {
    try {
      const { subject_id, professor, classroom, day, period, lecture_period, start_date, end_date } = req.body;
  
      if (!subject_id || !professor || !classroom || !day || !period || !lecture_period || !start_date || !end_date) {
        return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
      }
  
      const insertQuery = `
        INSERT INTO timetable (subject_id, day, period, professor, classroom, lecture_period, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(insertQuery, [subject_id, day, period, professor, classroom, lecture_period, start_date, end_date]);

      console.log("✅ 새로운 시간표 추가 성공", { subject_id, day, period, professor, classroom, lecture_period, start_date, end_date });
      res.status(201).json({ message: "시간표 추가 완료" });
    } catch (error) {
      console.error("❌ 시간표 추가 오류:", error);
      res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

// 📌 기존 시간표 수정 (PUT)
router.put("/timetable/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { subject_id, professor, classroom, lecture_period, start_date, end_date, day } = req.body;

        console.log("📌 요청 데이터 확인:", req.body); // ✅ 요청 데이터 확인

        // ✅ 필수 값 검증 (누락된 값 확인)
        if (!subject_id || !professor || !classroom || !lecture_period || !start_date || !end_date || !day) {
            console.error("❌ 필수 입력값 누락!");
            return res.status(400).json({ error: "❌ 필수 입력값이 누락되었습니다." });
        }

        // ✅ 시간표 수정 쿼리 실행 (day 포함)
        const updateQuery = `
            UPDATE timetable
            SET subject_id = ?, professor = ?, classroom = ?, lecture_period = ?, start_date = ?, end_date = ?, day = ?
            WHERE id = ?
        `;
        await db.promise().query(updateQuery, [subject_id, professor, classroom, lecture_period, start_date, end_date, day, id]);

        console.log(`✅ 시간표 수정 성공 (ID: ${id})`);
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

// ✅ 정상적인 라우트 등록 방식
router.post("/holidays", async (req, res) => {
    try {
        const { holiday_date, subject_id, day, lecture_period, period } = req.body;

        if (!holiday_date || !subject_id || !day || !lecture_period || !period) {
            return res.status(400).json({ error: "❌ 필수 값이 누락되었습니다." });
        }

        const insertQuery = `
            INSERT INTO holidays (holiday_date, subject_id, day, lecture_period, period)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.promise().query(insertQuery, [holiday_date, subject_id, day, lecture_period, period]);

        console.log(`✅ 휴강 등록 성공 (날짜: ${holiday_date}, 과목 ID: ${subject_id}, ${day} ${lecture_period}교시, 학년: ${period})`);
        res.json({ message: "휴강 등록 완료" });
    } catch (error) {
        console.error("❌ 휴강 등록 오류:", error);
        res.status(500).json({ error: "휴강 등록 중 오류 발생" });
    }
});

module.exports = router;
