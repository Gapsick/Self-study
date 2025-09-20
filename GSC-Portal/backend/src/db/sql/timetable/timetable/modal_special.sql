-- 특강 과목 목록 (레벨 + 반)
SELECT c.course_id, c.title, ct.level_id, l.name AS level_name,
        lc.class_id, lc.name AS class_name
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
JOIN level l ON ct.level_id = l.level_id
JOIN level_class lc ON ct.level_id = lc.level_id
WHERE c.is_special = TRUE;
