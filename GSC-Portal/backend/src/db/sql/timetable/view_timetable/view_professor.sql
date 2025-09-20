SELECT vt.*
FROM v_timetable vt
JOIN course_professor cp ON vt.course_id = cp.course_id
WHERE cp.user_id = :user_id;
