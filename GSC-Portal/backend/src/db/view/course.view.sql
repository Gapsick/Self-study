CREATE OR REPLACE VIEW v_course_details AS
SELECT
    c.course_id,
    c.title AS course_title,
    s.year,
    s.semester,
    cs.day_of_week,
    ts.start_time,
    ts.end_time,
    cl.building,
    cl.room_number,
    up.name AS professor_name,
    up.user_id AS professor_id
FROM
    course c
    LEFT JOIN section s ON c.sec_id = s.sec_id
    LEFT JOIN course_schedule cs ON c.course_id = cs.course_id
    LEFT JOIN time_slot ts ON cs.time_slot_id = ts.time_slot_id
    LEFT JOIN classroom cl ON cs.classroom_id = cl.classroom_id
    LEFT JOIN course_professor cp ON c.course_id = cp.course_id
    LEFT JOIN user_account up ON cp.user_id = up.user_id;