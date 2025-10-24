CREATE TABLE parking_event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    slot_name VARCHAR(20) NULL,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    exit_time DATETIME NULL,
    duration INT NULL,
    fee INT NULL,
    status VARCHAR(20) DEFAULT 'entry',
    entry_photo_url VARCHAR(255) NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE parking_route (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 경로 ID
    event_id INT NOT NULL,                      -- 어떤 세션에 속하는지
    type ENUM('entry', 'parking', 'exit') NOT NULL,        -- 입차/출차 구분
    node_list JSON NOT NULL,                    -- 노드 리스트 (예: [1,2,5,7,13])
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES parking_event(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
