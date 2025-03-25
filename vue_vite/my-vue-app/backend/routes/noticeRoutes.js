const express = require("express");
const router = express.Router();
const {
  createNotice,
  getNoticeById,
  getNotices,
  updateNotice,
  deleteNotice
} = require("../controllers/noticeController");

const multer = require("multer");

// ✅ 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ 저장할 폴더
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
  
    // ✅ 한글 파일명 깨짐 방지: latin1 → utf8
    const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
  
    // ✅ 공백 제거 및 특수문자 필터링 (선택)
    const safeName = originalName.replace(/\s+/g, "_").replace(/[^\w가-힣.\-_]/g, "");
  
    cb(null, `${timestamp}-${safeName}`);
  },
  
});

const upload = multer({ storage });

// ✅ 파일 업로드 문제 해결: `upload.single("file")` 필드명 확인
router.post("/", upload.single("file"), (req, res, next) => {
  console.log("📂 업로드된 파일:", req.file);
  next();
}, createNotice);

router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.put("/:id", upload.single("file"), updateNotice);
router.delete("/:id", deleteNotice);

module.exports = router;
