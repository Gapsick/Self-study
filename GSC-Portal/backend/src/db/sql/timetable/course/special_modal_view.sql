-- 레벨 목록
SELECT level_id, name
FROM level;

-- 선택한 레벨에 따른 반 목록
SELECT class_id, name
FROM level_class
WHERE level_id = '2'; -- 프론트에서 선택한 level_id 바인딩
