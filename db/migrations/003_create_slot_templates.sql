CREATE TABLE slot_templates (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  ground_id     INT NOT NULL,
  day_of_week   TINYINT NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  duration_mins INT DEFAULT 60,
  price         DECIMAL(8,2) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (ground_id) REFERENCES grounds(id)
);
