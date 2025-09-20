-- 학기 목록 (예: 2025-1)
SELECT sec_id, CONCAT(year, '-', semester) AS label
FROM section;

-- 교수 목록
SELECT ua.user_id, ua.name
FROM user_account ua
JOIN user_role ur ON ua.user_id = ur.user_id
WHERE ur.role_type = 'professor';
