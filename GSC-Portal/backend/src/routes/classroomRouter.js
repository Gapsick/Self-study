import express from 'express';
import * as classroomController from '../controllers/classroomController';

const router = express.Router();

// 강의실 예약
router.get("/:classroom_id/reservations", classroomController.getClassroomReservation);

