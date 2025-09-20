SELECT name 
FROM user_account 
WHERE user_id = ?;

SELECT classroom_id, building, room_number, room_type 
FROM classroom;

SELECT '수업' AS purpose
UNION ALL SELECT '회의'
UNION ALL SELECT '기타';
