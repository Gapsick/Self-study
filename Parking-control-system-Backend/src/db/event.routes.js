const express = require("express");
const router = express.Router();
const pool = require("./connection");

// 입구 차량 인식
router.post("/", (req, res) => {
    const { plate_number, entry_time } = req.body;

    if (!plate_number || !entry_time) {
        return res.status(400).json({ error: "plate_number and entry_time are required" });
    }

    const sql = `
        INSERT INTO parking_event (plate_number, entry_time, status)
        VALUES (?, ?, 'moving')
    `;
    pool.query(sql, [plate_number, entry_time], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "DB error" });
        }
        res.status(201).json({ id: result.insertId, message: "Vehicle entered (moving)" });
    });
});

// 주차 완료
router.patch("/park", (req, res) => {
    const { plate_number, entry_route } = req.body;

    if (!plate_number || !entry_route) {
        return res.status(400).json({ error: "plate_number and entry_route are required" });
    }

    const sql = `
        UPDATE parking_event
        SET entry_route = ?, status = 'parking'
        WHERE plate_number = ? AND status = 'moving'
        ORDER BY id DESC LIMIT 1
    `;
    pool.query(sql, [JSON.stringify(entry_route), plate_number], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "DB error" });
        }
        res.json({ message: "Vehicle parked" });
    });
});

// 출차
router.patch("/exit", (req, res) => {
    const { plate_number, exit_time, exit_route, fee } = req.body;

    if (!plate_number || !exit_time || !exit_route) {
        return res.status(400).json({ error: "plate_number, exit_time, exit_route are required" });
    }

    const sql = `
        UPDATE parking_event
        SET exit_time = ?, exit_route = ?, fee = ?, status = 'exiting',
            duration = TIMESTAMPDIFF(MINUTE, entry_time, ?)
        WHERE plate_number = ? AND status = 'parking'
        ORDER BY id DESC LIMIT 1
    `;
    pool.query(sql, [exit_time, JSON.stringify(exit_route), fee, exit_time, plate_number], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "DB error" });
        }
        res.json({ message: "Vehicle exiting" });
    });
});

module.exports = router;
