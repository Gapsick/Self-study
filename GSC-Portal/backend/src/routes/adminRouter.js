import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// 승인
router.get('/users', adminController.getPendingUsers);
router.post('/users', adminController.postPendingUsers);
router.delete('/users', adminController.deletePendingUsers);

// 예외 이메일
router.get('/email', adminController.getAllowedEmail);
router.post('/email', adminController.postAllowedEmail);
router.delete('/email', adminController.deleteAllowedEmail);

// 학생 정보
router.get('/students', adminController.getStudentInfo);
router.patch('/students/:user_id', adminController.patchStudentInfo);
router.delete('/students', adminController.deleteStudentInfo);


export default router;