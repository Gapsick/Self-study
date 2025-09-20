CREATE OR REPLACE VIEW v_timetable AS
SELECT
    c.course_id,
    c.title            AS course_title,
    sec.year           AS year,
    sec.semester       AS semester,
    cs.day_of_week     AS day,
    ts.start_time      AS start_time,
    ts.end_time        AS end_time,
    cr.building        AS building,
    cr.room_number     AS room_number,
    ua.name            AS professor_name,
    ct.grade_id,
    g.name             AS grade_name,
    ct.level_id,
    l.name             AS level_name,
    ct.language_id,
    lang.name          AS language_name,
    c.is_special       AS is_special,
    ce.event_type      AS event_status,
    ce.event_date      AS event_date
FROM course_schedule cs
JOIN course c ON cs.course_id = c.course_id
JOIN time_slot ts ON cs.time_slot_id = ts.time_slot_id
JOIN classroom cr ON cs.classroom_id = cr.classroom_id
JOIN section sec ON cs.sec_id = sec.sec_id
JOIN course_professor cp ON c.course_id = cp.course_id
JOIN user_account ua ON cp.user_id = ua.user_id
LEFT JOIN course_target ct ON c.course_id = ct.course_id
LEFT JOIN grades g ON ct.grade_id = g.grade_id
LEFT JOIN level l ON ct.level_id = l.level_id
LEFT JOIN language lang ON ct.language_id = lang.language_id
LEFT JOIN course_event ce ON cs.schedule_id = ce.schedule_id;
