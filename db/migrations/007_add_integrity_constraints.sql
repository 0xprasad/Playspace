ALTER TABLE bookings
  ADD CONSTRAINT fk_bookings_created_by
  FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE api_keys
  ADD CONSTRAINT fk_api_keys_ground
  FOREIGN KEY (ground_id) REFERENCES grounds(id);
