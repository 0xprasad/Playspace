CREATE TABLE ground_slots (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  ground_id      INT NOT NULL,
  date           DATE NOT NULL,
  start_time     TIME NOT NULL,
  end_time       TIME NOT NULL,
  price          DECIMAL(8,2) NOT NULL,
  status         ENUM('available','booked','blocked','offline') DEFAULT 'available',
  blocked_reason VARCHAR(255),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ground_slot (ground_id, date, start_time),
  FOREIGN KEY (ground_id) REFERENCES grounds(id)
);
