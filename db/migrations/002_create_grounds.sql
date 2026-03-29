CREATE TABLE grounds (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(150) NOT NULL,
  description    TEXT,
  address        VARCHAR(255),
  city           VARCHAR(100),
  lat            DECIMAL(10,8),
  lng            DECIMAL(11,8),
  images         JSON,
  amenities      JSON,
  price_per_hour DECIMAL(8,2) NOT NULL,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ground_staff (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  ground_id  INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_staff_ground (user_id, ground_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ground_id) REFERENCES grounds(id)
);
