-- 한국어 과목 목록 (레벨 기반, 반 없음)
SELECT c.course_id, c.title, ct.level_id, l.name AS level_name
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
JOIN level l ON ct.level_id = l.level_id
WHERE ct.language_id = 'KR';
