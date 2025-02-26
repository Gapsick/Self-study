const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ✅ 승인 대기 중인 사용자 목록 조회
router.get("/pending-users", adminController.getPendingUsers);

// ✅ 사용자 승인 및 역할 변경
router.post("/approve-user", adminController.approveUser);

// 거부
router.post("/reject", adminController.rejectUser);


module.exports = router;
