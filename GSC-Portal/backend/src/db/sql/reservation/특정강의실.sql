SELECT name FROM user_account WHERE user_id = :user_id;

-- 강의실 리스트
SELECT classroom_id, building, room_number, room_type FROM classroom;

-- 이번 주 예약 현황 (선택한 강의실)
SELECT r.reservation_id, u.name, r.title, r.start_at, r.end_at, r.status
FROM reservation r
JOIN user_account u ON r.user_id = u.user_id
WHERE r.classroom_id = ?
    AND r.start_at BETWEEN ? AND ?
    AND r.status = 'ACTIVE'
ORDER BY r.start_at;
