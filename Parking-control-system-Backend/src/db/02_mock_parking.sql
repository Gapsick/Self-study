-- mock_parking.sql
INSERT INTO parking_event
(plate_number, slot_name, entry_time, exit_time, duration, fee, status, entry_photo_url)
VALUES
('1234', 'B2', '2025-10-23 09:10:00', NULL, NULL, NULL, 'entry', '/uploads/cars/1234.jpg'),
('3456', 'C3', '2025-10-23 08:40:00', NULL, 3600, 1800, 'parking', '/uploads/cars/3456.jpg'),
('5678', 'D2', '2025-10-23 07:50:00', '2025-10-23 09:00:00', 4200, 2100, 'exit', '/uploads/cars/5678.jpg'),
('2468', 'C1', '2025-10-22 20:10:00', '2025-10-23 05:40:00', 5400, 12300, 'exit', '/uploads/cars/2468.jpg');

INSERT INTO parking_route (event_id, type, node_list) VALUES
(1, 'entry', JSON_ARRAY(JSON_ARRAY(100, 200), JSON_ARRAY(120, 220), JSON_ARRAY(140, 240))),
(2, 'entry', JSON_ARRAY(JSON_ARRAY(200, 150), JSON_ARRAY(220, 180), JSON_ARRAY(240, 210))),
(2, 'parking', JSON_ARRAY(JSON_ARRAY(240, 210), JSON_ARRAY(245, 220), JSON_ARRAY(250, 230))),
(3, 'entry', JSON_ARRAY(JSON_ARRAY(300, 400), JSON_ARRAY(320, 420), JSON_ARRAY(340, 440))),
(3, 'exit', JSON_ARRAY(JSON_ARRAY(340, 440), JSON_ARRAY(360, 460), JSON_ARRAY(380, 480))),
(4, 'entry', JSON_ARRAY(JSON_ARRAY(400, 180), JSON_ARRAY(420, 190), JSON_ARRAY(440, 200))),
(4, 'parking', JSON_ARRAY(JSON_ARRAY(440, 200), JSON_ARRAY(445, 205), JSON_ARRAY(450, 210))),
(4, 'exit', JSON_ARRAY(JSON_ARRAY(450, 210), JSON_ARRAY(460, 230), JSON_ARRAY(470, 250)));
