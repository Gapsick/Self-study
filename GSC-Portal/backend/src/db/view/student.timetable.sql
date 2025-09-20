CREATE OR REPLACE VIEW v_student_timetable AS
SELECT
cs.user_id,
s.year, s.semester,
c.course_id, c.title AS course_title,
ts.start_time, ts.end_time,
csd.day_of_week, cl.building, cl.room_number,
p_ua.name AS professor_name
FROM course_student cs
JOIN course c ON cs.course_id = c.course_id
JOIN section s ON c.sec_id = s.sec_id
JOIN course_schedule csd ON cs.course_id = csd.course_id
JOIN time_slot ts ON csd.time_slot_id = ts.time_slot_id
JOIN classroom cl ON csd.classroom_id = cl.classroom_id
LEFT JOIN course_professor cp ON c.course_id = cp.course_id
LEFT JOIN user_account p_ua ON cp.user_id = p_ua.user_id;
