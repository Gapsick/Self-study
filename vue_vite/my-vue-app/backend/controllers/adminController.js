const db = require("../config/db");

// ✅ 승인 대기 중인 사용자 목록 조회
const getPendingUsers = (req, res) => {
    db.query("SELECT name, email, student_id, phone, is_verified FROM users WHERE is_verified = 0", (err, results) => {
        if (err) return res.status(500).json({ message: "❌ 서버 오류", error: err });
        res.json({ users: results });
    });
};

// ✅ 특정 사용자를 승인 처리
const approveUser = (req, res) => {
    const { email, role } = req.body;
  
    // ✅ 이메일과 역할이 모두 있어야 처리 가능
    if (!email || !role) {
      return res.status(400).json({ message: "❌ 이메일과 역할을 입력해주세요." });
    }
  
    // ✅ 사용자 승인 및 역할 업데이트
    const query = "UPDATE users SET is_verified = 1, role = ? WHERE email = ?";
    db.query(query, [role, email], (err, result) => {
      if (err) {
        console.error("❌ 사용자 승인 실패:", err);
        return res.status(500).json({ message: "❌ 사용자 승인 중 오류 발생", error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "❌ 해당 사용자를 찾을 수 없습니다." });
      }
  
      res.json({ success: true, message: `✅ ${email} 승인 완료 (역할: ${role})` });
    });
  };
  const rejectUser = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "❌ 이메일이 필요합니다." });
    }

    db.query("DELETE FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "❌ 서버 오류 발생", error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ 해당 사용자를 찾을 수 없습니다." });
        }

        res.json({ success: true, message: `❌ ${email} 사용자가 거부되었습니다.` });
    });
};
module.exports = { getPendingUsers, approveUser, rejectUser };
