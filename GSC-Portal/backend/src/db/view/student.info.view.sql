CREATE OR REPLACE VIEW v_student_details AS
SELECT
    -- 기본 정보 (user_account)
    ua.user_id,
    ua.name,
    ua.email,
    ua.phone,
    ua.status AS account_status,

    -- 역할 정보 (user_role)
    ur.role_type,

    -- 학생 상세 정보 (student_entity)
    se.is_international,
    se.status AS student_status, -- 재학, 휴학 등

    -- 소속 정보 (grade, level_class, level, language)
    g.name    AS grade_name,    -- 예: 1학년
    lc.name   AS class_name,    -- 예: A반
    lv.name   AS level_name,    -- 예: JLPT N1
    lang.name AS language_name, -- 예: 일본어

    -- 원본 ID (필요시 사용)
    g.grade_id,
    lc.class_id,
    lv.level_id,
    lang.language_id
FROM
    user_account ua
    -- 학생 역할을 가진 사용자를 기준으로 JOIN 시작
    JOIN user_role ur ON ua.user_id = ur.user_id AND ur.role_type = 'student'
    -- 학생 상세 정보 연결 (LEFT JOIN: 학생 정보가 아직 없을 수도 있으므로)
    LEFT JOIN student_entity se ON ua.user_id = se.user_id
    -- 각종 이름 정보 연결
    LEFT JOIN grade g ON se.grade_id = g.grade_id
    LEFT JOIN level_class lc ON se.class_id = lc.class_id
    LEFT JOIN level lv ON lc.level_id = lv.level_id
    LEFT JOIN language lang ON se.language_id = lang.language_id;