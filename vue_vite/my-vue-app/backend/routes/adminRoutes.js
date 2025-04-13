const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// 사용자 승인 로직
router.get("/pending-users", adminController.getPendingUsers);
router.post("/approve-user", adminController.approveUser);
router.post("/reject", adminController.rejectUser);

// 과목 CRUD
router.get("/subjects", adminController.getSubjects);
router.post("/subjects", adminController.createSubject);
router.put("/subjects/:id", adminController.updateSubject);
router.delete("/subjects/:id", adminController.deleteSubject);

// 학생 특강 정보 목록 조회
router.get("/special-lecture-users", adminController.getSpecialLectureUsers)

// 학생 특강 정보 수정
router.put("/special-lecture-users/:id", adminController.updateSpecialLectureUser)

module.exports = router;
