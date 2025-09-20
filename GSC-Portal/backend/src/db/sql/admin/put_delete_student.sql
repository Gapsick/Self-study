-- PUT Student
UPDATE student_entity
SET grade_id = ?, is_international = ?, level_id = ?, class_id = ?
WHERE user_id = ?;

-- DELETE Student
DELETE FROM student_entity
WHERE user_id = ?;
