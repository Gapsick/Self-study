
-- =========================================================
-- 03. Courses & Schedule Mock Data
-- =========================================================

USE gsc_portal;

-- 과목 (2025-1 학기)
INSERT INTO course (course_id, sec_id, title, is_special) VALUES
('C001', '2025-1', '인공지능 개론', false),
('C002', '2025-1', '데이터베이스', false),
('C003', '2025-1', '일본어 특강', true);

-- 과목 언어 매핑
INSERT INTO course_language (course_id, language_id) VALUES
('C001', 'KR'),
('C002', 'KR'),
('C003', 'JP');

-- 과목 타겟 (학년/레벨/언어 대상)
INSERT INTO course_target (target_id, course_id, grade_id, level_id, language_id) VALUES
('T001', 'C001', '2', NULL, 'KR'),
('T002', 'C002', '2', NULL, 'KR'),
('T003', 'C003', '1', '1', 'JP');

-- 강의 시간표 (월/수/금)
INSERT INTO course_schedule (schedule_id, classroom_id, time_slot_id, course_id, sec_id, day_of_week) VALUES
('SCH1', '101', '1', 'C001', '2025-1', '월'),
('SCH2', '101', '2', 'C001', '2025-1', '수'),
('SCH3', '102', '1', 'C002', '2025-1', '화'),
('SCH4', '201', '3', 'C003', '2025-1', '금');

-- 교수 배정
INSERT INTO course_professor (user_id, course_id) VALUES
('U002', 'C001'),
('U002', 'C002'),
('U002', 'C003');

-- 학생 수강신청
INSERT INTO course_student (user_id, course_id) VALUES
('U001', 'C001'),
('U001', 'C002'),
('U004', 'C003');
