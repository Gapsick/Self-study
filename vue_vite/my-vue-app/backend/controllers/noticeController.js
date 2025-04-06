const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ✅ 공지사항 목록 조회 (과목 정보 포함)
const getNotices = async (req, res) => {
  try {
    const sql = `
      SELECT 
        n.*, 
        s.name AS subject_name, 
        s.category AS subject_category 
      FROM notices n
      LEFT JOIN subjects s ON n.subject_id = s.id
      ORDER BY n.is_pinned DESC, n.created_at DESC
    `;

    const [rows] = await db.promise().query(sql);

    // ✅ 프론트에서 사용하기 쉽게 subject 정보 포함
    const formatted = rows.map((row) => ({
      ...row,
      subject: {
        id: row.subject_id,
        name: row.subject_name,
        category: row.subject_category,
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ 공지사항 조회 실패:", err);
    res.status(500).json({ message: "공지사항을 가져올 수 없습니다." });
  }
};



// ✅ 공지사항 상세 조회
const getNoticeById = async (req, res) => {
  const noticeId = req.params.id;
  try {
    
    const updateSql = "UPDATE notices SET views = views + 1 WHERE id = ?";
    await db.promise().query(updateSql, [noticeId]);

    const sql = "SELECT * FROM notices WHERE id = ?";
    const [rows] = await db.promise().query(sql, [noticeId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "해당 공지사항을 찾을 수 없습니다." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ 공지사항 상세 조회 실패:", err);
    res.status(500).json({ message: "공지사항을 불러올 수 없습니다." });
  }
};

// ✅ 공지사항 작성
const { sendNoticeAlert } = require('../utils/lineMessageUtil');

const createNotice = async (req, res) => {
  try {
    console.log("📢 (createNotice) 요청된 데이터:", req.body);
    console.log("📂 (createNotice) 업로드된 파일 정보:", req.file);

    let {
      title,
      content,
      category,
      academic_year,
      subject_id,
      is_pinned,
      author,
      level,
      class_group
    } = req.body;

    const finalCategory = category || "학과";
    const finalAuthor = author || "관리자";
    const file = req.file ? `uploads/${req.file.filename}`.replace(/\\/g, '/') : null;

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용은 필수 입력값입니다." });
    }

    academic_year = (academic_year === "null" || academic_year === null || academic_year === "all" || academic_year === "0")
      ? null : parseInt(academic_year, 10);
    subject_id = (subject_id === "null" || subject_id === null) ? null : parseInt(subject_id, 10);

    // ✅ 공지사항 저장
    const sql = `
      INSERT INTO notices (title, content, category, academic_year, subject_id, file_path, is_pinned, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title,
      content,
      finalCategory,
      academic_year,
      subject_id,
      file,
      is_pinned === "1" ? 1 : 0,
      finalAuthor,
    ];

    const [result] = await db.promise().query(sql, values);
    console.log("✅ 공지사항 작성 성공! ID:", result.insertId);

    // ✅ LINE 전송 대상 추출
    let userQuery = 'SELECT line_user_id FROM users WHERE line_user_id IS NOT NULL';
    let userParams = [];

    if (finalCategory === '한국어') {
      userQuery += ' AND level = ?';
      userParams.push(level);
    } else if (academic_year === 0) {
      userQuery += ' AND level = ?';
      userParams.push(level);
      if (class_group && class_group !== '전체') {
        userQuery += ' AND class_group = ?';
        userParams.push(class_group);
      }
    } else if (academic_year !== null) {
      userQuery += ' AND grade = ?';
      userParams.push(academic_year);
    }

    const [users] = await db.promise().query(userQuery, userParams);
    const userIds = users.map(user => user.line_user_id);
    const link = `http://localhost:5173/notices/${result.insertId}`;

    if (req.body.sendLine === "1" && userIds.length > 0) {
      await sendNoticeAlert(userIds, {
        type: 'create',
        title,
        content,
        author: finalAuthor,
        academic_year,
        category: finalCategory,
        level,
        class_group,
        link,
        file_path: file,
      });
    }    

    res.status(201).json({ message: "공지사항이 등록되었습니다!", noticeId: result.insertId });
  } catch (err) {
    console.error("❌ 공지사항 작성 실패:", err);
    res.status(500).json({ message: "공지사항을 작성할 수 없습니다." });
  }
};


// ✅ 공지사항 수정
const updateNotice = async (req, res) => {
  const noticeId = req.params.id;
  try {
    let {
      title,
      content,
      category,
      academic_year,
      is_pinned,
      removeFile,
      subject_id,
      level,
      class_group,
      author
    } = req.body;

    const finalCategory = category || "학과";
    const finalAuthor = author || "관리자";
    let filePath = null;

    if (req.file) {
      filePath = `uploads/${req.file.filename}`.replace(/\\/g, '/');
    }

    // 🔹 기존 파일 삭제 처리
    if (removeFile === "true") {
      const [[existingNotice]] = await db.promise().query("SELECT file_path FROM notices WHERE id = ?", [noticeId]);
      if (existingNotice?.file_path) {
        const oldPath = path.join(__dirname, "..", existingNotice.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      filePath = null;
    }

    academic_year = academic_year === "" || academic_year === "null" ? null : parseInt(academic_year, 10);
    subject_id = subject_id === "" || subject_id === "null" ? null : parseInt(subject_id, 10);

    let sql = `
      UPDATE notices
      SET title=?, content=?, category=?, academic_year=?, subject_id=?, is_pinned=?, file_path=?
      WHERE id=?`;
    let values = [
      title,
      content,
      finalCategory,
      academic_year,
      subject_id,
      is_pinned === "1" ? 1 : 0,
      filePath,
      noticeId,
    ];

    if (removeFile === "true" && !req.file) {
      sql = `
        UPDATE notices
        SET title=?, content=?, category=?, academic_year=?, subject_id=?, is_pinned=?, file_path=NULL
        WHERE id=?`;
      values = [
        title,
        content,
        finalCategory,
        academic_year,
        subject_id,
        is_pinned === "1" ? 1 : 0,
        noticeId,
      ];
    }

    await db.promise().query(sql, values);
    console.log("✅ 공지사항 수정 완료");

    // 🔹 LINE 전송 대상 추출
    let userQuery = 'SELECT line_user_id FROM users WHERE line_user_id IS NOT NULL';
    let userParams = [];

    if (finalCategory === '한국어') {
      userQuery += ' AND level = ?';
      userParams.push(level);
    } else if (academic_year === 0) {
      userQuery += ' AND level = ?';
      userParams.push(level);
      if (class_group && class_group !== '전체') {
        userQuery += ' AND class_group = ?';
        userParams.push(class_group);
      }
    } else if (academic_year !== null) {
      userQuery += ' AND grade = ?';
      userParams.push(academic_year);
    }

    const [users] = await db.promise().query(userQuery, userParams);
    const userIds = users.map(user => user.line_user_id);
    const link = `http://localhost:5173/notice/${noticeId}`;

    if (userIds.length > 0) {
      await sendNoticeAlert(userIds, {
        type: 'update',
        title,
        content,
        author: finalAuthor,
        academic_year,
        category: finalCategory,
        level,
        class_group,
        link,
        file_path: filePath,
      });
    }

    res.json({ message: "공지사항이 수정되었습니다!" });
  } catch (err) {
    console.error("❌ 공지사항 수정 실패:", err);
    res.status(500).json({ message: "공지사항을 수정할 수 없습니다." });
  }
};



// ✅ 공지사항 삭제
const deleteNotice = async (req, res) => {
  const noticeId = req.params.id;
  try {
    // 🔹 기존 공지사항 조회하여 파일 경로 가져오기
    const [rows] = await db.promise().query("SELECT file_path FROM notices WHERE id = ?", [noticeId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "해당 공지사항을 찾을 수 없습니다." });
    }

    const filePath = rows[0].file_path;
    if (filePath) {
      const absolutePath = path.join(__dirname, "../", filePath);
      fs.unlink(absolutePath, (err) => {
        if (err) console.error("❌ 파일 삭제 실패:", err);
      });
    }

    // 🔹 공지사항 삭제
    const [result] = await db.promise().query("DELETE FROM notices WHERE id = ?", [noticeId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "공지사항 삭제 실패: 존재하지 않는 ID" });
    }

    res.json({ message: "공지사항이 삭제되었습니다!" });

  } catch (err) {
    console.error("❌ 공지사항 삭제 실패:", err);
    res.status(500).json({ message: "공지사항을 삭제할 수 없습니다." });
  }
};


// ✅ 모듈 내보내기
module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
