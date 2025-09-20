CREATE OR REPLACE VIEW v_notice_details AS
SELECT
    -- 공지사항 정보
    n.notice_id,
    n.title AS notice_title,
    n.content,
    n.created_at,

    -- 과목 정보 (학과 공지일 경우 NULL)
    c.course_id,
    c.title AS course_title,

    -- 공지 대상 정보 (JSON 배열로 집계)
    (SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'grade_name', g.name,
            'level_name', lv.name,
            'language_name', lang.name
        )
    )
    FROM notice_target nt
    LEFT JOIN grade g ON nt.grade_id = g.grade_id
    LEFT JOIN level lv ON nt.level_id = lv.level_id
    LEFT JOIN language lang ON nt.language_id = lang.language_id
    WHERE nt.notice_id = n.notice_id
    ) AS targets,

    -- 첨부파일 정보 (JSON 배열로 집계)
    (SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'file_id', fa.file_id,
            'file_name', fa.file_name,
            'file_url', fa.file_url
        )
    )
    FROM notice_file nf
    JOIN file_assets fa ON nf.file_id = fa.file_id
    WHERE nf.notice_id = n.notice_id
    ) AS files
FROM
    notice n
    LEFT JOIN course c ON n.course_id = c.course_id;