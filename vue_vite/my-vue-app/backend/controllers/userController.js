const db = require("../config/db");


const getPendingUsers = async (req, res) => {
    try {
      const [results] = await db.promise().query(
        "SELECT name, email, student_id, phone, grade, is_foreign FROM users WHERE is_verified = 0"
      );
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: "❌ 사용자 목록 불러오기 실패", error: err });
    }
  };
  

const registerUser = async (req, res) => {
  const { name, studentId, phone, grade, isForeign, email } = req.body;

  if (!name || !studentId || !phone || !grade || !email) {
    return res.status(400).json({ message: "❌ 모든 필드를 입력해주세요." });
  }

  try {
    const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "❌ 이미 등록된 이메일입니다." });
    }

    const insertQuery = `
      INSERT INTO users (name, student_id, phone, grade, is_foreign, email, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, studentId, phone, grade, isForeign, email, false];

    await db.promise().query(insertQuery, values);

    console.log("✅ 회원가입 성공!");
    res.json({ success: true, message: "✅ 회원가입 신청 완료! 관리자의 승인을 기다려주세요." });

  } catch (err) {
    console.error("❌ 회원가입 중 오류:", err);
    res.status(500).json({ message: "❌ 서버 오류 발생", error: err });
  }
};

  

module.exports = { getPendingUsers, registerUser };
