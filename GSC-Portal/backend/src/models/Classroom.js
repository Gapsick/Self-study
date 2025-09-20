import pool from "../db/connection.js";

// 강의실 예약
export async function getClassroomReservation() {
    const [rows] = await pool.query()
}