CREATE TABLE api_keys (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  owner_id     INT NOT NULL,
  ground_id    INT,
  name         VARCHAR(100) NOT NULL,
  key_prefix   VARCHAR(20) NOT NULL,
  key_hash     VARCHAR(64) NOT NULL,
  scopes       JSON NOT NULL,
  env          ENUM('test','live') DEFAULT 'test',
  rate_limit   INT DEFAULT 1000,
  expires_at   TIMESTAMP NULL,
  revoked_at   TIMESTAMP NULL,
  last_used_at TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_key_hash (key_hash),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
