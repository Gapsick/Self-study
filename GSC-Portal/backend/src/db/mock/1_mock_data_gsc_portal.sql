
-- =========================================================
-- MOCK DATA for gsc_portal
-- Author: 김성식 Capstone Project
-- =========================================================

USE gsc_portal;

-- =========================================================
-- 01. Master Data
-- =========================================================

-- 학년
-- INSERT INTO grade (grade_id, name) VALUES
-- ('1', '1학년'),
-- ('2', '2학년'),
-- ('3', '3학년');

-- 레벨
INSERT INTO level (level_id, name) VALUES
('1', 'JLPT N1'),
('2', 'JLPT N2'),
('3', 'JLPT N3'),
('4', 'TOPIK 4급'),
('5', 'TOPIK 6급');

-- 반 (레벨별)
INSERT INTO level_class (class_id, level_id, name) VALUES
('1', '1', 'A'),
('2', '1', 'B'),
('3', '2', 'A'),
('4', '2', 'B'),
('5', '3', 'A');

-- 언어
INSERT INTO language (language_id, name) VALUES
('KR', '한국어'),
('JP', '일본어'),
('EN', '영어');

-- 학기 (2025년 1학기 예시)
INSERT INTO section (sec_id, semester, year, start_date, end_date) VALUES
('2025-1', 1, 2025, '2025-03-01', '2025-06-30');

-- 교시 (09:00 ~ 12:00 예시)
INSERT INTO time_slot (time_slot_id, start_time, end_time) VALUES
('1', '09:00:00', '09:50:00'),
('2', '10:00:00', '10:50:00'),
('3', '11:00:00', '11:50:00');

-- 강의실
INSERT INTO classroom (classroom_id, building, room_number, room_type) VALUES
('101', '본관', '101', 'CLASSROOM'),
('102', '본관', '102', 'CLASSROOM'),
('201', '실습동', '201', 'LAB');

-- =========================================================
-- 02. Users & Roles
-- =========================================================

-- 사용자 계정
INSERT INTO user_account (user_id, name, email, phone, status) VALUES
('U001', '김성식', 'gapsicke@g.yju.ac.kr', '010-1234-5678', 'active'),
('U002', '이교수', 'prof1@g.yju.ac.kr', '010-2345-6789', 'active'),
('U003', '관리자', 'admin@g.yju.ac.kr', '010-3456-7890', 'active'),
('U004', '유학생A', 'intl1@example.com', '010-4567-8901', 'active');

-- 사용자 역할
INSERT INTO user_role (user_id, role_type) VALUES
('U001', 'student'),
('U002', 'professor'),
('U003', 'admin'),
('U004', 'student');

-- 학생 엔티티
INSERT INTO student_entity (user_id, grade_id, class_id, language_id, is_international, status) VALUES
('U001', '2', '3', 'JP', false, '재학'),
('U004', '1', '1', 'KR', true, '재학');
