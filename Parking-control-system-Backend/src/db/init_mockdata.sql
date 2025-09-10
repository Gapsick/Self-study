USE parking_db;

INSERT INTO cars (plate_number, status) VALUES
(1234, 'parking'),
(5678, 'moving');

INSERT INTO zones (name, total_slots, description) VALUES
('A', 10, '테스트 A');

INSERT INTO parking_slots (zone_id, slot_number, status) VALUES
(1, 'A1', 'occupied'),
(1, 'A2', 'empty');

INSERT INTO parking_sessions (car_id, slot_id, entry_time, exit_time, fee, route) VALUES
(6, 3, '2025-09-10 12:30:00', '2025-09-10 15:45:00', 3000, NULL),
(7, 4, '2025-09-10 14:00:00', NULL, NULL, NULL);