-- 강의실 리스트
SELECT classroom_id, building, room_number, room_type
FROM classroom;

-- 학년 리스트
SELECT grade_id, name
FROM grades;

-- 특정 poll 상세 + 현재 참여 인원 수 + 내 투표 여부
SELECT
    p.poll_id,
    g.name AS grade,
    c.building, c.room_number,
    p.poll_date, p.target_weekend, p.required_count,
    SUM(CASE WHEN v.will_join = TRUE THEN 1 ELSE 0 END) AS joined_count,
    SUM(CASE WHEN v.user_id = ? THEN 1 ELSE 0 END) AS already_voted
FROM weekend_attendance_poll p
JOIN grades g ON p.grade_id = g.grade_id
JOIN classroom c ON p.classroom_id = c.classroom_id
LEFT JOIN weekend_attendance_votes v ON p.poll_id = v.poll_id
WHERE p.poll_id = ?
GROUP BY p.poll_id;

-- 이번 주 모든 poll 현황
SELECT 
    p.poll_id,
    g.name AS grade,
    c.building, c.room_number,
    p.poll_date, p.target_weekend, p.required_count,
    SUM(CASE WHEN v.will_join = TRUE THEN 1 ELSE 0 END) AS joined_count
FROM weekend_attendance_poll p
JOIN grades g ON p.grade_id = g.grade_id
JOIN classroom c ON p.classroom_id = c.classroom_id
LEFT JOIN weekend_attendance_votes v ON p.poll_id = v.poll_id
WHERE p.poll_date BETWEEN '2025-09-15' AND '2025-09-21'
GROUP BY p.poll_id;
