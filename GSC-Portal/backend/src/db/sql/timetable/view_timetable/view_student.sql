SELECT vt.*
FROM v_timetable vt
JOIN student_entity se ON se.user_id = :user_id
JOIN level_class lc ON se.class_id = lc.class_id
WHERE
    (vt.is_special = 0 AND vt.grade_id = se.grade_id)
OR (vt.is_special = 1 AND vt.level_id = lc.level_id AND vt.language_id = se.language_id)
OR (se.is_international = 1 AND vt.language_id = 'KR');
