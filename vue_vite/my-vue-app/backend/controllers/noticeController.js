const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ✅ 공지사항 목록 조회
const getNotices = async (req, res) => {
  try {
    const sql = "SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC";
    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (err) {
    console.error("❌ 공지사항 조회 실패:", err);
    res.status(500).json({ message: "공지사항을 가져올 수 없습니다." });
  }
};

// ✅ 공지사항 상세 조회
const getNoticeById = async (req, res) => {
  const noticeId = req.params.id;
  try {
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
const createNotice = async (req, res) => {
  try {
    console.log("📢 (createNotice) 요청된 데이터:", req.body);
    console.log("📂 (createNotice) 업로드된 파일 정보:", req.file);

    const { title, content, academic_year, subject_id, is_pinned } = req.body;
    const file = req.file ? `uploads/${req.file.filename}` : null; // ✅ 파일 경로 설정

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용은 필수 입력값입니다." });
    }

    // 🔹 SQL 실행
    const sql = `
      INSERT INTO notices (title, content, academic_year, subject_id, file_path, is_pinned) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title,
      content,
      academic_year || null,
      subject_id || null,
      file,
      is_pinned === "1" ? 1 : 0
    ];

    const [result] = await db.promise().query(sql, values);
    console.log("✅ (createNotice) 공지사항 작성 성공! ID:", result.insertId);

    res.status(201).json({ message: "공지사항이 등록되었습니다!", noticeId: result.insertId });
  } catch (err) {
    console.error("❌ (createNotice) 공지사항 작성 실패:", err);
    res.status(500).json({ message: "공지사항을 작성할 수 없습니다." });
  }
};


// ✅ 공지사항 수정
const updateNotice = async (req, res) => {
  const noticeId = req.params.id;
  try {
    const { title, content, academic_year, is_pinned, removeFile } = req.body;
    let filePath = null;

    // 🔹 새로운 파일 업로드 확인
    if (req.file) {
      filePath = `uploads/${req.file.filename}`;
    }

    // 🔹 기존 파일 삭제 요청 확인
    if (removeFile === "true") {
      const [[existingNotice]] = await db.promise().query("SELECT file_path FROM notices WHERE id = ?", [noticeId]);

      if (existingNotice && existingNotice.file_path) {
        const oldFilePath = path.join(__dirname, "..", existingNotice.file_path);
        console.log("📢 삭제할 파일 경로:", oldFilePath);

        // ✅ 파일이 존재하면 동기적으로 삭제 (순차적 실행을 위해)
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
            console.log("✅ 기존 파일 삭제 성공!");
          } catch (error) {
            console.error("❌ 기존 파일 삭제 실패:", error);
          }
        } else {
          console.warn("⚠ 기존 파일이 존재하지 않음:", oldFilePath);
        }
      }
      filePath = null; // 기존 파일 삭제 시 DB에서 NULL 처리 필요
    }

    // 🔹 SQL 업데이트 문 생성
    let sql = "UPDATE notices SET title=?, content=?, academic_year=?, is_pinned=?, file_path=? WHERE id=?";
    let values = [title, content, academic_year || null, is_pinned === "1" ? 1 : 0, filePath, noticeId];

    // 🔹 기존 파일 삭제 요청이 있었고, 새로운 파일이 없을 경우 file_path를 NULL로 저장
    if (removeFile === "true" && !req.file) {
      sql = "UPDATE notices SET title=?, content=?, academic_year=?, is_pinned=?, file_path=NULL WHERE id=?";
      values = [title, content, academic_year || null, is_pinned === "1" ? 1 : 0, noticeId];
    }

    await db.promise().query(sql, values);
    
    console.log("✅ 공지사항 수정 완료!");
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
