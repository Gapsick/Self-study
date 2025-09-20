
-- =========================================================
-- 04. Notice, Event & Files Mock Data
-- =========================================================

USE gsc_portal;

-- 파일 (공지 첨부용)
INSERT INTO file_assets (file_id, file_name, file_url, size_type, file_type) VALUES
('F001', 'exam_schedule.pdf', '/files/exam_schedule.pdf', 1024, 'PDF'),
('F002', 'lecture_intro.png', '/files/lecture_intro.png', 512, 'IMG');

-- 공지사항 (과목별/학과 전체)
INSERT INTO notice (notice_id, course_id, title, content, created_at) VALUES
(1, 'C001', '중간고사 안내', '인공지능 개론 중간고사는 4월 15일입니다.', NOW()),
(2, 'C002', '과제 제출 안내', '데이터베이스 과제는 5월 1일까지 제출하세요.', NOW()),
(3, NULL, '학과 행사 안내', '글로벌 시스템 융합과 MT는 4월 5일입니다.', NOW());

-- 공지-파일 연결
INSERT INTO notice_file (file_id, notice_id) VALUES
('F001', 1),
('F002', 2);

-- 공지 대상
INSERT INTO notice_target (target_id, notice_id, grade_id, level_id, language_id) VALUES
('NT001', 1, '2', NULL, 'KR'),
('NT002', 2, '2', NULL, 'KR'),
('NT003', 3, NULL, NULL, 'KR');

-- 수업 이벤트 (휴강/보강)
INSERT INTO course_event (event_id, schedule_id, event_type, event_date) VALUES
('E001', 'SCH1', '휴강', '2025-04-15'),
('E002', 'SCH3', '보강', '2025-05-10');
