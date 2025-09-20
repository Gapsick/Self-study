CREATE OR REPLACE VIEW v_user_full AS
SELECT
    ua.user_id,
    ua.name,
    ua.email,
    ua.phone,
    ua.status AS account_status,
    ur.role_type,

    -- 학생만 값이 채워지는 컬럼
    g.name        AS grade_name,
    lc.name       AS class_name,
    lv.name       AS level_name,
    lang.name     AS language_name,
    se.is_international

FROM user_account ua
JOIN user_role ur ON ua.user_id = ur.user_id
LEFT JOIN student_entity se ON ua.user_id = se.user_id
LEFT JOIN grade g           ON se.grade_id = g.grade_id
LEFT JOIN level_class lc    ON se.class_id = lc.class_id
LEFT JOIN level lv          ON lc.level_id = lv.level_id
LEFT JOIN language lang     ON se.language_id = lang.language_id;
