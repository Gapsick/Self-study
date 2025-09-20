CREATE OR REPLACE VIEW v_timetable_details AS
SELECT
    -- 학기 및 과목 정보
    s.year,
    s.semester,
    c.course_id,
    c.title AS course_title,

    -- 교수 정보
    p_ua.user_id AS professor_id,
    p_ua.name AS professor_name,

    -- 수업 시간 정보
    cs.day_of_week,
    ts.start_time,
    ts.end_time,

    -- 수업 장소 정보
    cl.building,
    cl.room_number,
    cl.room_type
FROM
    course_schedule cs
    JOIN course c ON cs.course_id = c.course_id
    JOIN section s ON c.sec_id = s.sec_id
    JOIN time_slot ts ON cs.time_slot_id = ts.time_slot_id
    JOIN classroom cl ON cs.classroom_id = cl.classroom_id
    LEFT JOIN course_professor cp ON c.course_id = cp.course_id
    LEFT JOIN user_account p_ua ON cp.user_id = p_ua.user_id;