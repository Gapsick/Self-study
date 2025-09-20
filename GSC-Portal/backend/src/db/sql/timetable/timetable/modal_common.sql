-- 학기 목록
SELECT sec_id, CONCAT(year, '-', semester) AS label
FROM section;

-- 강의실 목록
SELECT classroom_id, CONCAT(building, '-', room_number) AS label
FROM classroom;

-- 교시 목록
SELECT time_slot_id, start_time, end_time
FROM time_slot;

-- 요일 (ENUM이지만 SQL로 뽑고 싶다면)
SELECT '월' AS day_of_week
UNION SELECT '화'
UNION SELECT '수'
UNION SELECT '목'
UNION SELECT '금';
