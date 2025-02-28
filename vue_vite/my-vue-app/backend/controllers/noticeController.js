const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/**
 * 🔹 1️⃣ 공지사항 목록 조회 (GET /api/notices)
 */
exports.getNotices = (req, res) => {
  const sql = "SELECT * FROM notices ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ 공지사항 조회 실패:", err);
      return res.status(500).json({ message: "공지사항을 불러오지 못했습니다." });
    }
    res.json(results);
  });
};

/**
 * 🔹 2️⃣ 공지사항 상세 조회 (GET /api/notices/:id)
 */
exports.getNotices = async (req, res) => {
  try {
    // 🔹 `is_pinned`이 `1`인 공지는 우선 출력, 그 후 `created_at` 기준 최신순 정렬
    const sql = "SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC";

    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (err) {
    console.error("❌ 공지사항 조회 실패:", err);
    res.status(500).json({ message: "공지사항을 가져올 수 없습니다." });
  }
};

exports.getNoticeById = async (req, res) => {
  const noticeId = req.params.id;
  const sql = "SELECT * FROM notices WHERE id = ?";

  db.query(sql, [noticeId], (err, results) => {
    if (err) {
      console.error("❌ 공지사항 상세 조회 실패:", err);
      return res.status(500).json({ message: "공지사항을 불러오지 못했습니다." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });
    }
    res.json(results[0]);
  });
};



/**
 * 🔹 3️⃣ 공지사항 작성 (POST /api/notices)
 */
exports.createNotice = async (req, res) => {
  try {
    const { title, content, academic_year, subject_id, is_pinned } = req.body;
    const file = req.file ? req.file.filename : null;

    // 🔹 필수 입력값 검증
    if (!title || !content || academic_year === undefined) {
      return res.status(400).json({ message: "제목, 내용, 학년은 필수 입력값입니다." });
    }

    // 🔹 `academic_year`, `subject_id`, `is_pinned` 변환
    const academicYear = academic_year !== null ? parseInt(academic_year) : null;
    const subjectId = subject_id ? parseInt(subject_id) : null;
    const pinned = is_pinned === true ? 1 : 0;  // ✅ `true/false` 값을 `1/0`으로 변환

    if (academicYear !== null && isNaN(academicYear)) {
      return res.status(400).json({ message: "학년은 숫자이거나 NULL이어야 합니다." });
    }

    // ✅ SQL 실행 (is_pinned 필드 추가)
    const sql = "INSERT INTO notices (title, content, academic_year, subject_id, file_path, is_pinned) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [title, content, academicYear, subjectId, file, pinned];  // ✅ is_pinned 추가

    const [result] = await db.promise().query(sql, values);

    console.log("✅ 공지사항 작성 성공:", result.insertId);
    res.status(201).json({ message: "공지사항이 등록되었습니다!", noticeId: result.insertId });

  } catch (err) {
    console.error("❌ 공지사항 작성 실패:", err);
    res.status(500).json({ message: "공지사항을 작성할 수 없습니다." });
  }
};




