import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

// 목록 조회 (route 제외)
router.get("/", async (req, res) => {
    const { plate, start_date, end_date } = req.query;
    let sql =
        "SELECT id, plate_number, entry_time, exit_time, fee, status FROM parking_event WHERE 1=1";
    let params = [];

    if (plate) {
        sql += " AND plate_number = ?";
        params.push(plate);
    }

    if (start_date && end_date) {
        sql += " AND entry_time BETWEEN ? AND ?";
        params.push(start_date + " 00:00:00", end_date + " 23:59:59");
    }

    try {
        const [results] = await pool.query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "DB error" });
    }
});

// 상세 조회 (route 포함)
router.get("/:id", async (req, res) => {
    try {
        const [results] = await pool.query(
        "SELECT * FROM parking_event WHERE id = ?",
        [req.params.id]
        );
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: "DB error" });
    }
});

export default router;
