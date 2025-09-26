CREATE TABLE parking_event (
    id INT AUTO_INCREMENT PRIMARY KEY,             -- 이벤트 고유 ID
    plate_number VARCHAR(20) NOT NULL,             -- 차량 번호
    entry_time DATETIME NOT NULL,                  -- 입차 시간
    exit_time DATETIME NULL,                       -- 출차 시간
    duration INT,
    fee INT NULL,                                  -- 요금
    entry_photo_url VARCHAR(255) NULL,             -- 사진
    status ENUM('entry','parking', 'exit') NOT NULL DEFAULT 'entry', -- 현재 상태
    INDEX idx_plate_date (plate_number, entry_time) -- 차량번호 + 날짜 검색 인덱스
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE parking_route (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 경로 ID
    event_id INT NOT NULL,                      -- 어떤 세션에 속하는지
    type ENUM('entry', 'exit') NOT NULL,        -- 입차/출차 구분
    node_list JSON NOT NULL,                    -- 노드 리스트 (예: [1,2,5,7,13])
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES parking_event(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
