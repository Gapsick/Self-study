
-- =========================================================
-- GSC Portal - One-shot Bootstrap (MySQL)
--   1) Drop & Create DB
--   2) Create Schema (MySQL syntax)
--   3) Seed Mock Data (numeric user_id version)
-- =========================================================

DROP DATABASE IF EXISTS gsc_portal;
CREATE DATABASE gsc_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE gsc_portal;

-- =========================================================
-- 01. Users & Roles
-- =========================================================
CREATE TABLE user_account (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) UNIQUE,
  phone VARCHAR(50) UNIQUE,
  status ENUM('active','inactive','pending') NOT NULL DEFAULT 'pending',
  refresh_token VARCHAR(255),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB;

CREATE TABLE user_role (
  user_id BIGINT UNSIGNED NOT NULL,
  role_type ENUM('student','professor','admin') NOT NULL,
  PRIMARY KEY (user_id, role_type),
  KEY ix_user_role_type (role_type),
  CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

CREATE TABLE grade (
  grade_id VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (grade_id)
) ENGINE=InnoDB;

CREATE TABLE level (
  level_id VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (level_id)
) ENGINE=InnoDB;

CREATE TABLE level_class (
  class_id VARCHAR(20) NOT NULL,
  level_id VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL,
  UNIQUE KEY ux_level_class_level_name (level_id, name),
  PRIMARY KEY (class_id),
  CONSTRAINT fk_level_class_level FOREIGN KEY (level_id) REFERENCES level(level_id)
) ENGINE=InnoDB;

CREATE TABLE language (
  language_id VARCHAR(10) NOT NULL,
  name VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (language_id)
) ENGINE=InnoDB;

CREATE TABLE student_entity (
  user_id BIGINT UNSIGNED NOT NULL,
  grade_id VARCHAR(20) NOT NULL,
  class_id VARCHAR(20) NOT NULL,
  language_id VARCHAR(10) NOT NULL,
  is_international BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('재학','휴학','자퇴') NOT NULL DEFAULT '재학',
  PRIMARY KEY (user_id),
  KEY ix_student_grade (grade_id),
  KEY ix_student_class (class_id),
  KEY ix_student_language (language_id),
  CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_student_grade FOREIGN KEY (grade_id) REFERENCES grade(grade_id),
  CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES level_class(class_id),
  CONSTRAINT fk_student_lang FOREIGN KEY (language_id) REFERENCES language(language_id)
) ENGINE=InnoDB;

-- Kakao
CREATE TABLE kakao_user (
  user_id BIGINT UNSIGNED NOT NULL,
  kakao_id VARCHAR(128) NOT NULL UNIQUE,
  linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_kakao_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- =========================================================
-- 02. Academic
-- =========================================================
CREATE TABLE section (
  sec_id VARCHAR(8) NOT NULL,
  semester TINYINT NOT NULL,
  year YEAR NOT NULL,
  start_date DATE,
  end_date DATE,
  UNIQUE KEY ux_section_year_sem (year, semester),
  PRIMARY KEY (sec_id)
) ENGINE=InnoDB;

CREATE TABLE time_slot (
  time_slot_id VARCHAR(6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE KEY ux_slot_day_time (start_time, end_time),
  PRIMARY KEY (time_slot_id)
) ENGINE=InnoDB;

CREATE TABLE classroom (
  classroom_id VARCHAR(6) NOT NULL,
  building VARCHAR(50) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  room_type ENUM('CLASSROOM','LAB') NOT NULL DEFAULT 'CLASSROOM',
  UNIQUE KEY ux_room_building_no (building, room_number),
  PRIMARY KEY (classroom_id)
) ENGINE=InnoDB;

CREATE TABLE course (
  course_id VARCHAR(15) NOT NULL,
  sec_id VARCHAR(8) NOT NULL,
  title VARCHAR(100) NOT NULL,
  is_special BOOLEAN NOT NULL DEFAULT FALSE,
  KEY ix_course_sec_title (sec_id, title),
  PRIMARY KEY (course_id),
  CONSTRAINT fk_course_section FOREIGN KEY (sec_id) REFERENCES section(sec_id)
) ENGINE=InnoDB;

CREATE TABLE course_schedule (
  schedule_id VARCHAR(10) NOT NULL,
  classroom_id VARCHAR(6) NOT NULL,
  time_slot_id VARCHAR(6) NOT NULL,
  course_id VARCHAR(15) NOT NULL,
  sec_id VARCHAR(8) NOT NULL,
  day_of_week ENUM('월','화','수','목','금') NOT NULL,
  UNIQUE KEY ux_sched_slot_room (time_slot_id, classroom_id),
  KEY ix_sched_course_slot (sec_id, course_id, time_slot_id),
  PRIMARY KEY (schedule_id),
  CONSTRAINT fk_sched_course FOREIGN KEY (course_id) REFERENCES course(course_id),
  CONSTRAINT fk_sched_section FOREIGN KEY (sec_id) REFERENCES section(sec_id),
  CONSTRAINT fk_sched_slot FOREIGN KEY (time_slot_id) REFERENCES time_slot(time_slot_id),
  CONSTRAINT fk_sched_room FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id)
) ENGINE=InnoDB;

CREATE TABLE course_target (
  target_id VARCHAR(10) NOT NULL,
  course_id VARCHAR(15) NOT NULL,
  grade_id VARCHAR(20),
  level_id VARCHAR(20),
  language_id VARCHAR(10),
  UNIQUE KEY ux_course_target_combo (course_id, grade_id, level_id, language_id),
  PRIMARY KEY (target_id),
  CONSTRAINT fk_ct_course FOREIGN KEY (course_id) REFERENCES course(course_id),
  CONSTRAINT fk_ct_grade FOREIGN KEY (grade_id) REFERENCES grade(grade_id),
  CONSTRAINT fk_ct_level FOREIGN KEY (level_id) REFERENCES level(level_id),
  CONSTRAINT fk_ct_lang FOREIGN KEY (language_id) REFERENCES language(language_id)
) ENGINE=InnoDB;

CREATE TABLE course_language (
  course_id VARCHAR(15) NOT NULL,
  language_id VARCHAR(10) NOT NULL,
  PRIMARY KEY (course_id, language_id),
  CONSTRAINT fk_cl_course FOREIGN KEY (course_id) REFERENCES course(course_id),
  CONSTRAINT fk_cl_lang FOREIGN KEY (language_id) REFERENCES language(language_id)
) ENGINE=InnoDB;

CREATE TABLE course_professor (
  user_id BIGINT UNSIGNED NOT NULL,
  course_id VARCHAR(15) NOT NULL,
  PRIMARY KEY (user_id, course_id),
  CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_cp_course FOREIGN KEY (course_id) REFERENCES course(course_id)
) ENGINE=InnoDB;

CREATE TABLE course_student (
  user_id BIGINT UNSIGNED NOT NULL,
  course_id VARCHAR(15) NOT NULL,
  PRIMARY KEY (user_id, course_id),
  CONSTRAINT fk_cs_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_cs_course FOREIGN KEY (course_id) REFERENCES course(course_id)
) ENGINE=InnoDB;

-- =========================================================
-- 03. Notice & Event & Files
-- =========================================================
CREATE TABLE file_assets (
  file_id CHAR(10) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  size_type INT,
  file_type ENUM('PDF','IMG') NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (file_id)
) ENGINE=InnoDB;

CREATE TABLE notice (
  notice_id INT NOT NULL AUTO_INCREMENT,
  course_id VARCHAR(15) NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY ix_notice_course_time (course_id, created_at),
  PRIMARY KEY (notice_id),
  CONSTRAINT fk_notice_course FOREIGN KEY (course_id) REFERENCES course(course_id)
) ENGINE=InnoDB;

CREATE TABLE notice_file (
  file_id CHAR(10) NOT NULL,
  notice_id INT NOT NULL,
  PRIMARY KEY (file_id),
  CONSTRAINT fk_nf_file FOREIGN KEY (file_id) REFERENCES file_assets(file_id),
  CONSTRAINT fk_nf_notice FOREIGN KEY (notice_id) REFERENCES notice(notice_id)
) ENGINE=InnoDB;

CREATE TABLE notice_target (
  target_id CHAR(10) NOT NULL,
  notice_id INT NOT NULL,
  grade_id VARCHAR(20),
  level_id VARCHAR(20),
  language_id VARCHAR(10),
  UNIQUE KEY ux_notice_target_combo (notice_id, grade_id, level_id, language_id),
  PRIMARY KEY (target_id),
  CONSTRAINT fk_nt_notice FOREIGN KEY (notice_id) REFERENCES notice(notice_id),
  CONSTRAINT fk_nt_grade FOREIGN KEY (grade_id) REFERENCES grade(grade_id),
  CONSTRAINT fk_nt_level FOREIGN KEY (level_id) REFERENCES level(level_id),
  CONSTRAINT fk_nt_lang FOREIGN KEY (language_id) REFERENCES language(language_id)
) ENGINE=InnoDB;

CREATE TABLE course_event (
  event_id CHAR(10) NOT NULL,
  schedule_id VARCHAR(10) NOT NULL,
  event_type ENUM('휴강','보강') NOT NULL,
  event_date DATE NOT NULL,
  UNIQUE KEY ux_event_sched_date_type (schedule_id, event_date, event_type),
  KEY ix_event_date (event_date),
  PRIMARY KEY (event_id),
  CONSTRAINT fk_event_schedule FOREIGN KEY (schedule_id) REFERENCES course_schedule(schedule_id)
) ENGINE=InnoDB;

CREATE TABLE notification_delivery_notice (
  delivery_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  notice_id INT NOT NULL,
  message_id VARCHAR(64) NOT NULL UNIQUE,
  send_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  status ENUM('QUEUED','SENT','FAILED') NOT NULL DEFAULT 'QUEUED',
  UNIQUE KEY ux_ndn_notice_user (notice_id, user_id),
  KEY ix_ndn_inbox (user_id, status, read_at),
  PRIMARY KEY (delivery_id),
  CONSTRAINT fk_ndn_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_ndn_notice FOREIGN KEY (notice_id) REFERENCES notice(notice_id)
) ENGINE=InnoDB;

CREATE TABLE notification_delivery_event (
  delivery_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  event_id CHAR(10) NOT NULL,
  message_id VARCHAR(64) NOT NULL UNIQUE,
  send_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  status ENUM('QUEUED','SENT','FAILED') NOT NULL DEFAULT 'QUEUED',
  UNIQUE KEY ux_nde_event_user (event_id, user_id),
  KEY ix_nde_read_at (user_id, status, read_at),
  PRIMARY KEY (delivery_id),
  CONSTRAINT fk_nde_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_nde_event FOREIGN KEY (event_id) REFERENCES course_event(event_id)
) ENGINE=InnoDB;

CREATE TABLE log_entity (
  log_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  action ENUM('LOGIN','READ_NOTICE','READ_EVENT','RESERVE','VOTE') NOT NULL,
  event_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY ix_log_user_time (user_id, action, event_time),
  PRIMARY KEY (log_id),
  CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

CREATE TABLE allowed_email (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(200) NOT NULL UNIQUE,
  reason VARCHAR(100),
  tag VARCHAR(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE student_exams (
  exam_id CHAR(10) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  file_id CHAR(10),
  level_id VARCHAR(20),
  exam_type ENUM('JLPT','TOPIK'),
  score INT,
  UNIQUE KEY ux_exam_user_type_level (user_id, exam_type, level_id),
  PRIMARY KEY (exam_id),
  CONSTRAINT fk_exam_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_exam_file FOREIGN KEY (file_id) REFERENCES file_assets(file_id),
  CONSTRAINT fk_exam_level FOREIGN KEY (level_id) REFERENCES level(level_id)
) ENGINE=InnoDB;

-- =========================================================
-- 04. Reservations & Polls & Cleaning
-- =========================================================
CREATE TABLE reservation (
  reservation_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  classroom_id VARCHAR(6) NOT NULL,
  title VARCHAR(100),
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  status ENUM('ACTIVE','CANCELLED','FINISHED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY ux_resv_start (classroom_id, start_at),
  KEY ux_resv_end (classroom_id, end_at),
  PRIMARY KEY (reservation_id),
  CONSTRAINT fk_resv_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_resv_room FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id)
) ENGINE=InnoDB;

CREATE TABLE weekend_attendance_poll (
  poll_id CHAR(10) NOT NULL,
  grade_id VARCHAR(20),
  classroom_id VARCHAR(6) NOT NULL,
  poll_date DATE NOT NULL,
  target_weekend ENUM('SAT','SUN'),
  required_count INT NOT NULL DEFAULT 8,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ux_poll_room_date_day (classroom_id, poll_date, target_weekend),
  PRIMARY KEY (poll_id),
  CONSTRAINT fk_poll_grade FOREIGN KEY (grade_id) REFERENCES grade(grade_id),
  CONSTRAINT fk_poll_room FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id)
) ENGINE=InnoDB;

CREATE TABLE weekend_attendance_votes (
  votes_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  poll_id CHAR(10) NOT NULL,
  will_join BOOLEAN NOT NULL,
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ux_poll_user_once (poll_id, user_id),
  PRIMARY KEY (votes_id),
  CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT fk_vote_poll FOREIGN KEY (poll_id) REFERENCES weekend_attendance_poll(poll_id)
) ENGINE=InnoDB;

CREATE TABLE cleaning_assignment (
  assignment_id BIGINT NOT NULL AUTO_INCREMENT,
  sec_id VARCHAR(8) NOT NULL,
  grade_id VARCHAR(20) NOT NULL,
  classroom_id VARCHAR(6) NOT NULL,
  work_date DATE NOT NULL,
  team_size TINYINT NOT NULL DEFAULT 4,
  members_json JSON,
  status ENUM('SCHEDULED','DONE','MISSED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME NULL,
  UNIQUE KEY ux_cleaning_scope_day (sec_id, grade_id, classroom_id, work_date),
  KEY ix_cleaning_date (work_date),
  PRIMARY KEY (assignment_id),
  CONSTRAINT fk_cleaning_sec FOREIGN KEY (sec_id) REFERENCES section(sec_id),
  CONSTRAINT fk_cleaning_grade FOREIGN KEY (grade_id) REFERENCES grade(grade_id),
  CONSTRAINT fk_cleaning_room FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id)
) ENGINE=InnoDB;

-- =========================================================
-- 05. Seed Mock Data (numeric user_id)
-- =========================================================

-- Master data
INSERT INTO grade (grade_id, name) VALUES
('1','1학년'),('2','2학년'),('3','3학년');

INSERT INTO level (level_id, name) VALUES
('1','JLPT N1'),('2','JLPT N2'),('3','JLPT N3'),('4','TOPIK 4급'),('5','TOPIK 6급');

INSERT INTO level_class (class_id, level_id, name) VALUES
('1','1','A'),('2','1','B'),('3','2','A'),('4','2','B'),('5','3','A');

INSERT INTO language (language_id, name) VALUES
('KR','한국어'),('JP','일본어'),('EN','영어');

INSERT INTO section (sec_id, semester, year, start_date, end_date) VALUES
('2025-1',1,2025,'2025-03-01','2025-06-30');

INSERT INTO time_slot (time_slot_id, start_time, end_time) VALUES
('1','09:00:00','09:50:00'),('2','10:00:00','10:50:00'),('3','11:00:00','11:50:00');

INSERT INTO classroom (classroom_id, building, room_number, room_type) VALUES
('101','본관','101','CLASSROOM'),('102','본관','102','CLASSROOM'),('201','실습동','201','LAB');

-- Users
INSERT INTO user_account (user_id, name, email, phone, status) VALUES
(1,'김성식','gapsicke@g.yju.ac.kr','010-1234-5678','active'),
(2,'이교수','prof1@g.yju.ac.kr','010-2345-6789','active'),
(3,'관리자','admin@g.yju.ac.kr','010-3456-7890','active'),
(4,'유학생A','intl1@example.com','010-4567-8901','active');

INSERT INTO user_role (user_id, role_type) VALUES
(1,'student'),(2,'professor'),(3,'admin'),(4,'student');

INSERT INTO student_entity (user_id, grade_id, class_id, language_id, is_international, status) VALUES
(1,'2','3','JP',FALSE,'재학'),
(4,'1','1','KR',TRUE,'재학');

-- Courses
INSERT INTO course (course_id, sec_id, title, is_special) VALUES
('C001','2025-1','인공지능 개론',FALSE),
('C002','2025-1','데이터베이스',FALSE),
('C003','2025-1','일본어 특강',TRUE);

INSERT INTO course_language (course_id, language_id) VALUES
('C001','KR'),('C002','KR'),('C003','JP');

INSERT INTO course_target (target_id, course_id, grade_id, level_id, language_id) VALUES
('T001','C001','2',NULL,'KR'),
('T002','C002','2',NULL,'KR'),
('T003','C003','1','1','JP');

INSERT INTO course_schedule (schedule_id, classroom_id, time_slot_id, course_id, sec_id, day_of_week) VALUES
('SCH1','101','1','C001','2025-1','월'),
('SCH2','101','2','C001','2025-1','수'),
('SCH3','102','1','C002','2025-1','화'),
('SCH4','201','3','C003','2025-1','금');

INSERT INTO course_professor (user_id, course_id) VALUES
(2,'C001'),(2,'C002'),(2,'C003');

INSERT INTO course_student (user_id, course_id) VALUES
(1,'C001'),(1,'C002'),(4,'C003');

-- Notice & Files & Events
INSERT INTO file_assets (file_id, file_name, file_url, size_type, file_type) VALUES
('F001','exam_schedule.pdf','/files/exam_schedule.pdf',1024,'PDF'),
('F002','lecture_intro.png','/files/lecture_intro.png',512,'IMG');

INSERT INTO notice (notice_id, course_id, title, content, created_at) VALUES
(1,'C001','중간고사 안내','인공지능 개론 중간고사는 4월 15일입니다.',NOW()),
(2,'C002','과제 제출 안내','데이터베이스 과제는 5월 1일까지 제출하세요.',NOW()),
(3,NULL,'학과 행사 안내','글로벌 시스템 융합과 MT는 4월 5일입니다.',NOW());

INSERT INTO notice_file (file_id, notice_id) VALUES ('F001',1),('F002',2);

INSERT INTO notice_target (target_id, notice_id, grade_id, level_id, language_id) VALUES
('NT001',1,'2',NULL,'KR'),
('NT002',2,'2',NULL,'KR'),
('NT003',3,NULL,NULL,'KR');

INSERT INTO course_event (event_id, schedule_id, event_type, event_date) VALUES
('E001','SCH1','휴강','2025-04-15'),
('E002','SCH3','보강','2025-05-10');

-- Reservations & Polls & Cleaning & Misc
INSERT INTO reservation (reservation_id, user_id, classroom_id, title, start_at, end_at, status) VALUES
(1,1,'201','AI 프로젝트 회의','2025-04-01 10:00:00','2025-04-01 12:00:00','ACTIVE'),
(2,4,'101','스터디 모임','2025-04-03 09:00:00','2025-04-03 11:00:00','CANCELLED');

INSERT INTO weekend_attendance_poll (poll_id, grade_id, classroom_id, poll_date, target_weekend, required_count, status) VALUES
('P001','2','101','2025-04-05','SAT',8,TRUE);

INSERT INTO weekend_attendance_votes (votes_id, user_id, poll_id, will_join) VALUES
(1,1,'P001',TRUE),(2,4,'P001',FALSE);

INSERT INTO cleaning_assignment (assignment_id, sec_id, grade_id, classroom_id, work_date, team_size, members_json, status) VALUES
(1,'2025-1','2','101','2025-04-04',4,'[{\"user_id\":1,\"name\":\"김성식\",\"role\":\"student\",\"attended\":true}]','SCHEDULED');

INSERT INTO kakao_user (user_id, kakao_id, is_verified) VALUES
(1,'kakao_12345',TRUE),(2,'kakao_67890',FALSE);

INSERT INTO student_exams (exam_id, user_id, file_id, level_id, exam_type, score) VALUES
('EX001',1,'F001','1','JLPT',120),
('EX002',4,NULL,'5','TOPIK',180);

INSERT INTO log_entity (log_id, user_id, action) VALUES
(1,1,'LOGIN'),(2,1,'READ_NOTICE'),(3,2,'LOGIN');
