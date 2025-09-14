const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/now", (req, res) => {
const totalQuery = `
SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN ps.status = 'occupied' THEN 1 ELSE 0 END) AS used,
    SUM(CASE WHEN ps.status = 'empty' THEN 1 ELSE 0 END) AS free
FROM parking_slots ps`;

const zoneQuery = `
SELECT 
    z.name AS zone,
    COUNT(*) AS total,
    SUM(CASE WHEN ps.status = 'occupied' THEN 1 ELSE 0 END) AS used,
    SUM(CASE WHEN ps.status = 'empty' THEN 1 ELSE 0 END) AS free
FROM parking_slots ps
JOIN zones z ON ps.zone_id = z.id
GROUP BY z.name`;

pool.query(totalQuery, (err, totalResult) => {
if (err) {
    console.error("DB Error (total):", err);
    return res.status(500).json({ error: "DB error" });
}

pool.query(zoneQuery, (err, zoneResult) => {
    if (err) {
    console.error("DB Error (zone):", err);
    return res.status(500).json({ error: "DB error2" });
    }

    // 구역별 데이터 변환
    const byZone = {};
    zoneResult.forEach(r => {
    byZone[r.zone] = {
        total: r.total,
        used: r.used,
        free: r.free
    };
    });

    // 최종 응답
    res.json({
    total: totalResult[0].total,
    used: totalResult[0].used,
    free: totalResult[0].free,
    by_zone: byZone
    });
});
});
});

module.exports = router;
