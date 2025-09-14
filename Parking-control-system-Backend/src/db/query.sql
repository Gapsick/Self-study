-- 전체 + 구역별 점유율 조회
SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN ps.status = 'occupied' THEN 1 ELSE 0 END) AS used,
    SUM(CASE WHEN ps.status = 'empty' THEN 1 ELSE 0 END) AS free
FROM parking_slots ps;

-- 구역별 (zone별) 집계
SELECT 
    z.name AS zone_name,
    COUNT(*) AS total,
    SUM(CASE WHEN ps.status = 'occupied' THEN 1 ELSE 0 END) AS used,
    SUM(CASE WHEN ps.status = 'empty' THEN 1 ELSE 0 END) AS free
FROM parking_slots ps
JOIN zones z ON ps.zone_id = z.id
GROUP BY z.name;
