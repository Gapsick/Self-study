-- 정규 과목 목록 (학년별)
SELECT c.course_id, c.title, ct.grade_id
FROM course c
JOIN course_target ct ON c.course_id = ct.course_id
WHERE c.is_special = FALSE
    AND ct.grade_id IN ('1', '2', '3');
