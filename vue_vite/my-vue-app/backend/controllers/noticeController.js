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
exports.getNoticeById = (req, res) => {
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
exports.createNotice = (req, res) => {
  const { title, content, academic_year, subject_id } = req.body;
  const file = req.file ? req.file.filename : null;

  const sql = "INSERT INTO notices (title, content, academic_year, subject_id, file_path) VALUES (?, ?, ?, ?, ?)";
  const values = [title, content, academic_year, subject_id || null, file];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ 공지사항 작성 실패:", err);
      return res.status(500).json({ message: "공지사항을 작성할 수 없습니다." });
    }
    res.status(201).json({ message: "공지사항이 등록되었습니다!", noticeId: result.insertId });
  });
};
