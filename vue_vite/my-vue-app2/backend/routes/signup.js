const express = require("express");
const db = require("../models/db");

const router = express.Router();

// ✅ 회원가입 API
router.post("/", (req, res) => {
  const { email, name, phone, student_id, grade, role } = req.body;

  if (!email || !name || !phone || !role) {
    return res.status(400).json({ message: "모든 정보를 입력하세요" });
  }

  // ✅ 학생이 아닌 경우 학번/학년을 NULL로 설정
  const studentIdValue = role === "student" ? student_id : null;
  const gradeValue = role === "student" ? grade : null;

  // ✅ 승인 대기 상태로 사용자 추가
  db.query(
    "INSERT INTO users (email, name, phone, student_id, grade, role, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [email, name, phone, studentIdValue, gradeValue, role, false],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "회원가입 실패" });
      }
      res.status(201).json({ message: "회원가입 성공, 승인 대기 중" });
    }
  );
});

module.exports = router;
