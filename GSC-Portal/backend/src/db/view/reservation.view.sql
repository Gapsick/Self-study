CREATE OR REPLACE VIEW v_reservation_status AS
SELECT
    -- 예약 정보
    r.reservation_id,
    r.title AS reservation_title,
    r.start_at,
    r.end_at,
    r.status AS reservation_status,

    -- 예약자 정보
    ua.user_id AS reserver_id,
    ua.name AS reserver_name,
    ua.email AS reserver_email,

    -- 강의실 정보
    c.classroom_id,
    c.building,
    c.room_number
FROM
    reservation r
    JOIN user_account ua ON r.user_id = ua.user_id
    JOIN classroom c ON r.classroom_id = c.classroom_id;