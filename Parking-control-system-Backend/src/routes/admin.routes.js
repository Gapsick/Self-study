import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

// 목록 조회 (route 제외)
router.get("/", async (req, res) => {
    const { plate, start_date, end_date } = req.query;
    let sql =
        "SELECT id, plate_number, slot_name, entry_time, exit_time, status FROM parking_event WHERE 1=1";
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
        const eventId = req.params.id;

        // 기본 정보
        const [eventRows] = await pool.query(
        `
        SELECT id, plate_number, slot_name, entry_time, exit_time, duration,fee, status, entry_photo_url
        FROM parking_event
        WHERE id = ?
        `,
        [eventId]
        );

        if (!eventRows.length) {
        return res.status(404).json({ error: "Data not found" });
        }
        const event = eventRows[0];

        // 경로 데이터 (node_list)
        const [routeRows] = await pool.query(
        `
        SELECT node_list
        FROM parking_route
        WHERE event_id = ?
        ORDER BY created_at ASC
        `,
        [eventId]
        );

        const routes = routeRows
        .map(r => {
            const data = r.node_list;
            if (typeof data === "string") {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error("⚠️ node_list JSON 파싱 실패:", data);
                return [];
            }
            } else {
            return data;
            }
        })
        .flat();

        // 응답
        res.json({
        ...event,
        routes
        });

    } catch (err) {
        console.error("상세 조회 에러:", err.message);
        res.status(500).json({ error: "DB error" });
    }
});


export default router;
