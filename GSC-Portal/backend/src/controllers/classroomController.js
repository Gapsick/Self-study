import * as classService from '../service/classroom-service.js';

// 강의실 예약
export const getClassroomReservation = async function (req, res) {
    try {
        var result = await classService.getClassroomReservation();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};