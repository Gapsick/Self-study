const db = require("../config/db");

// ✅ 승인 대기 중인 사용자 목록 조회
const getPendingUsers = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      "SELECT name, email, student_id, phone, grade, is_foreign, is_verified FROM users WHERE is_verified = 0"
    );    
    res.json({ users: results });
  } catch (err) {
    res.status(500).json({ message: "❌ 서버 오류", error: err });
  }
};


// ✅ 특정 사용자를 승인 처리
const approveUser = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "❌ 이메일과 역할을 입력해주세요." });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE users SET is_verified = 1, role = ? WHERE email = ?",
      [role, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ 해당 사용자를 찾을 수 없습니다." });
    }

    res.json({ success: true, message: `✅ ${email} 승인 완료 (역할: ${role})` });
  } catch (err) {
    console.error("❌ 사용자 승인 실패:", err);
    res.status(500).json({ message: "❌ 사용자 승인 중 오류 발생", error: err });
  }
};

const rejectUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "❌ 이메일이 필요합니다." });
  }

  try {
    const [result] = await db.promise().query("DELETE FROM users WHERE email = ?", [email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ 해당 사용자를 찾을 수 없습니다." });
    }

    res.json({ success: true, message: `❌ ${email} 사용자가 거부되었습니다.` });
  } catch (err) {
    res.status(500).json({ message: "❌ 서버 오류 발생", error: err });
  }
};

// ✅ 과목 목록 조회
const getSubjects = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM subjects");
    res.json(rows); 
  } catch (err) {
    console.error("❌ 과목 목록 조회 실패:", err);
    res.status(500).json({ message: "❌ 과목 목록 조회 실패", error: err });
  }
};

// ✅ 과목 추가
const createSubject = async (req, res) => {
  const { name, academic_year, level, class_group, category } = req.body;

  if (!name || academic_year === undefined) {
    return res.status(400).json({ message: "❌ 과목명과 학년을 입력해주세요." });
  }

  try {
    await db.promise().query(
      "INSERT INTO subjects (name, academic_year, level, class_group, category) VALUES (?, ?, ?, ?, ?)",
      [
        name,
        academic_year,
        level || null,
        class_group === '' ? null : class_group,
        category || '정규'  // ✅ category 기본값 설정
      ]
    );
    res.json({ success: true, message: "✅ 과목이 추가되었습니다." });
  } catch (err) {
    console.error("❌ 과목 추가 실패:", err);
    res.status(500).json({ message: "❌ 과목 추가 실패", error: err });
  }
};


// ✅ 과목 수정
const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, academic_year, level, class_group, category } = req.body;

  if (!name || academic_year === undefined) {
    return res.status(400).json({ message: "❌ 과목명과 학년을 입력해주세요." });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE subjects SET name = ?, academic_year = ?, level = ?, class_group = ?, category = ? WHERE id = ?",
      [
        name,
        academic_year,
        level || null,
        class_group === '' ? null : class_group,
        category || '정규',
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ 해당 과목을 찾을 수 없습니다." });
    }

    res.json({ success: true, message: "✅ 과목이 수정되었습니다." });
  } catch (err) {
    console.error("❌ 과목 수정 실패:", err);
    res.status(500).json({ message: "❌ 과목 수정 실패", error: err });
  }
};



// ✅ 과목 삭제
const deleteSubject = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.promise().query(
      "DELETE FROM subjects WHERE id=?",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ 해당 과목을 찾을 수 없습니다." });
    }

    res.json({ success: true, message: "✅ 과목이 삭제되었습니다." });
  } catch (err) {
    console.error("❌ 과목 삭제 실패:", err);
    res.status(500).json({ message: "❌ 과목 삭제 실패", error: err });
  }
};


// 학생 특광 관리
const getSpecialLectureUsers = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        id, 
        name, 
        grade, 
        is_foreign, 
        special_lecture AS level, 
        class_group 
      FROM users 
      WHERE role = 'student'
    `)
    res.json(rows)
  } catch (err) {
    console.error("특강 사용자 목록 조회 실패:", err)
    res.status(500).json({ message: "서버 오류" })
  }
}


// 🔹 학생 특강 정보 수정
const updateSpecialLectureUser = async (req, res) => {
  const { id } = req.params
  const { level, class_group } = req.body

  try {
    await db.promise().query(
      "UPDATE users SET special_lecture = ?, class_group = ? WHERE id = ?",
      [level, class_group, id]
    )
    res.json({ message: "수정 완료" })
  } catch (err) {
    console.error("특강 정보 수정 실패:", err)
    res.status(500).json({ message: "서버 오류" })
  }
}

module.exports = { 
  
  // 사용자 승인 관련
  getPendingUsers, 
  approveUser, 
  rejectUser,

  // 과목 관련
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,

  // 특강 정보
  getSpecialLectureUsers,
  updateSpecialLectureUser,


 };
