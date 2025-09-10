USE parking_db;

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number INT NOT NULL UNIQUE,
    status ENUM('parking','moving','exiting') NOT NULL DEFAULT 'parking',
    route JSON,
    entry_time DOUBLE,
    last_visited_space INT,
    x_coord FLOAT,
    y_coord FLOAT
);

CREATE TABLE IF NOT EXISTS zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(5) NOT NULL UNIQUE,
    total_slots INT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS routes_nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    node_name VARCHAR(20) NOT NULL UNIQUE,
    x_coord FLOAT,
    y_coord FLOAT,
    is_blocked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS routes_edges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_node_id INT NOT NULL,
    to_node_id INT NOT NULL,
    distance FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (from_node_id) REFERENCES routes_nodes(id),
    FOREIGN KEY (to_node_id) REFERENCES routes_nodes(id)
);

CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone_id INT NOT NULL,
    slot_number VARCHAR(10) NOT NULL,
    node_id INT,
    is_occupied BOOLEAN DEFAULT FALSE,
    status ENUM('empty','occupied','in_progress') NOT NULL DEFAULT 'empty',
    car_id INT,
    polygon JSON,
    entry_time DOUBLE,
    parking_time DOUBLE,
    updated_at DATETIME,
    FOREIGN KEY (zone_id) REFERENCES zones(id),
    FOREIGN KEY (node_id) REFERENCES routes_nodes(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- 6. parking_sessions
CREATE TABLE IF NOT EXISTS parking_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    slot_id INT,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME,
    fee INT,
    route JSON,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
);

-- 7. parking_logs
CREATE TABLE IF NOT EXISTS parking_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    action ENUM('ENTER','EXIT','MOVE') NOT NULL,
    timestamp DATETIME NOT NULL,
    position JSON,
    route JSON,
    FOREIGN KEY (session_id) REFERENCES parking_sessions(id)
);
