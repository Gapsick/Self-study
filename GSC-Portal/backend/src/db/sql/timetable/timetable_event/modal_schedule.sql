SELECT cs.schedule_id, cs.course_id, c.title,
    cs.day_of_week, ts.start_time, ts.end_time,
    cr.building, cr.room_number
FROM course_schedule cs
JOIN course c ON cs.course_id = c.course_id
JOIN time_slot ts ON cs.time_slot_id = ts.time_slot_id
JOIN classroom cr ON cs.classroom_id = cr.classroom_id
WHERE cs.course_id = 'C001';  -- 프론트에서 선택한 course_id
