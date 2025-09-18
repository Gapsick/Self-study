const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// 목록 조회 (route 제외)
router.get("/", (req, res) => {
    const { plate, start_date, end_date } = req.query;
    let sql = 'SELECT id, plate_number, entry_time, exit_time, fee, status FROM parking_event WHERE 1=1';
    let params = [];

    if (plate) {
        sql += " AND plate_number = ?";
        params.push(plate);
    }

    if (start_date && end_date) {
        sql += " AND entry_time BETWEEN ? AND ?";
        params.push(start_date + " 00:00:00", end_date + " 23:59:59");
    }

    pool.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(results);
        }
    );
});

// 상세 조회 (route 포함)
router.get("/:id", (req, res) => {
    pool.query(
        'SELECT * FROM parking_event WHERE id = ?',
        [req.params.id],
        (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(results[0]);
        }
    );
});

module.exports = router;