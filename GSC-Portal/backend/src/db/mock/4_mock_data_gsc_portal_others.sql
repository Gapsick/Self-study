
-- =========================================================
-- 05. Reservation, Cleaning, Kakao, Exams, Logs Mock Data
-- =========================================================

USE gsc_portal;

-- 실습실 예약
INSERT INTO reservation (reservation_id, user_id, classroom_id, title, start_at, end_at, status) VALUES
(1, 'U001', '201', 'AI 프로젝트 회의', '2025-04-01 10:00:00', '2025-04-01 12:00:00', 'ACTIVE'),
(2, 'U004', '101', '스터디 모임', '2025-04-03 09:00:00', '2025-04-03 11:00:00', 'CANCELLED');

-- 주말 출석 투표 (예: 토요일)
INSERT INTO weekend_attendance_poll (poll_id, grade_id, classroom_id, poll_date, target_weekend, required_count, status) VALUES
('P001', '2', '101', '2025-04-05', 'SAT', 8, true);

-- 투표 결과
INSERT INTO weekend_attendance_votes (votes_id, user_id, poll_id, will_join) VALUES
(1, 'U001', 'P001', true),
(2, 'U004', 'P001', false);

-- 청소 배정
INSERT INTO cleaning_assignment (assignment_id, sec_id, grade_id, classroom_id, work_date, team_size, members_json, status) VALUES
(1, '2025-1', '2', '101', '2025-04-04', 4,
    '[{"user_id":"U001","name":"김성식","role":"student","attended":true}]',
    'SCHEDULED');

-- 카카오 사용자 연동
INSERT INTO kakao_user (user_id, kakao_id, is_verified) VALUES
('U001', 'kakao_12345', true),
('U002', 'kakao_67890', false);

-- 학생 시험 성적
INSERT INTO student_exams (exam_id, user_id, file_id, level_id, exam_type, score) VALUES
('EX001', 'U001', 'F001', '1', 'JLPT', 120),
('EX002', 'U004', NULL, '5', 'TOPIK', 180);

-- 로그 기록
INSERT INTO log_entity (log_id, user_id, action) VALUES
(1, 'U001', 'LOGIN'),
(2, 'U001', 'READ_NOTICE'),
(3, 'U002', 'LOGIN');
