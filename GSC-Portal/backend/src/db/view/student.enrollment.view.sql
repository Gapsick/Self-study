CREATE OR REPLACE VIEW v_student_enrollment AS
SELECT
    cs.user_id,
    ua.name AS student_name,
    cs.course_id,
    c.title AS course_title,
    s.year,
    s.semester
FROM
    course_student cs
    LEFT JOIN user_account ua ON cs.user_id = ua.user_id
    LEFT JOIN course c ON cs.course_id = c.course_id
    LEFT JOIN section s ON c.sec_id = s.sec_id;