-- 정규 (예: 1학년)
SELECT c.course_id, c.title
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
WHERE ct.grade_id = '1' AND c.is_special = FALSE;

-- 한국어
SELECT c.course_id, c.title, ct.level_id, l.name AS level_name
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
JOIN level l ON ct.level_id = l.level_id
WHERE ct.language_id = 'KR';

-- 특강
SELECT c.course_id, c.title, ct.level_id, l.name AS level_name, lc.class_id, lc.name AS class_name
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
JOIN level l ON ct.level_id = l.level_id
JOIN level_class lc ON ct.level_id = lc.level_id
WHERE c.is_special = TRUE;
