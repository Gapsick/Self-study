const db = require("../config/db");

const registerUser = (req, res) => {
    const { name, studentId, phone, grade, isForeign, email } = req.body;

    // ✅ 모든 필드가 입력되었는지 확인
    if (!name || !studentId || !phone || !grade || !email) {
        return res.status(400).json({ message: "❌ 모든 필드를 입력해주세요." });
    }

    // ✅ 기존 이메일이 이미 존재하는지 확인 (중복 가입 방지)
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "서버 오류", error: err });

        if (results.length > 0) {
            return res.status(400).json({ message: "❌ 이미 등록된 이메일입니다." });
        }

        // ✅ 새로운 사용자 추가
        const query = `
            INSERT INTO users (name, student_id, phone, grade, is_foreign, email, is_verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, studentId, phone, grade, isForeign, email, false]; // 관리자가 승인해야 하므로 기본값: false

        db.query(query, values, (err, result) => {
            if (err) return res.status(500).json({ message: "❌ 회원가입 실패", error: err });

            res.json({ success: true, message: "✅ 회원가입 신청 완료! 관리자의 승인을 기다려주세요." });
        });
    });
};

module.exports = { registerUser };
