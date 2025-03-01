const express = require("express");
const router = express.Router();
const {
  createNotice,
  getNoticeById,
  getNotices,
  updateNotice,
  deleteNotice
} = require("../controllers/noticeController");

const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// ✅ 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // ✅ 저장할 폴더
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const safeFileName = file.originalname.replace(/\s+/g, "_"); // ✅ 파일명 공백 제거
      cb(null, `${timestamp}-${safeFileName}`);
    },
  });
  
const upload = multer({ storage });

// ✅ 공지사항 CRUD API
router.post("/", authMiddleware, upload.single("file"), createNotice);
router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.put("/:id", authMiddleware, upload.single("file"), updateNotice);
router.delete("/:id", authMiddleware, deleteNotice);

module.exports = router;
