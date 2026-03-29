ALTER TABLE bookings
  ADD COLUMN expires_at TIMESTAMP NULL AFTER created_at;

ALTER TABLE bookings
  ADD INDEX idx_bookings_status_expires_at (status, expires_at);
