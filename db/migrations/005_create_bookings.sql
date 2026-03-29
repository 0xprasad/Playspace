CREATE TABLE bookings (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  user_id           INT,
  slot_id           INT NOT NULL,
  ground_id         INT NOT NULL,
  booking_type      ENUM('online','offline') DEFAULT 'online',
  customer_name     VARCHAR(100),
  customer_phone    VARCHAR(15),
  amount            DECIMAL(8,2) NOT NULL,
  status            ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  created_by        INT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (slot_id) REFERENCES ground_slots(id),
  FOREIGN KEY (ground_id) REFERENCES grounds(id)
);

CREATE TABLE payments (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  booking_id          INT NOT NULL,
  razorpay_order_id   VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature  VARCHAR(255),
  amount              DECIMAL(8,2) NOT NULL,
  status              ENUM('pending','success','failed') DEFAULT 'pending',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
