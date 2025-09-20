-- 1학년
SELECT * 
FROM v_admin_student_info 
WHERE grade_name = '1학년' 
AND status = '재학';

-- 2학년
SELECT * 
FROM v_admin_student_info 
WHERE grade_name = '2학년' 
AND status = '재학';

-- 3학년
SELECT * 
FROM v_admin_student_info 
WHERE grade_name = '3학년' 
AND status = '재학';


-- 휴학한 학생 전체
SELECT * FROM v_admin_student_info WHERE status = '휴학';

-- 자퇴한 학생 전체
SELECT * FROM v_admin_student_info WHERE status = '자퇴';

-- 졸업한 학생 전체
SELECT * FROM v_admin_student_info WHERE status = '졸업';
