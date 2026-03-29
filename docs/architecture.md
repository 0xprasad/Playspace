# System Architecture (Phase 1)

## Roles

- **User (Player):** browse grounds, view slots, book and pay online.
- **Staff (Ground Ops):** manage availability, block slots, add offline bookings.
- **Admin (Platform):** manage grounds, staff, disputes, and integrations.

## Booking Lifecycle

1. Ground schedules are defined in `slot_templates`.
2. Scheduler job generates concrete `ground_slots` for upcoming days.
3. User selects slot and creates booking (`status='pending'`).
4. Payment order is created in Razorpay (`env='test'` for Phase 1).
5. On payment verification:
   - `payments.status='success'`
   - `bookings.status='confirmed'`
   - `ground_slots.status='booked'`

## Data Model Rationale

- **Templates vs actual slots**
  - `slot_templates` stores recurring intent.
  - `ground_slots` stores operational, mutable inventory.

- **Offline handling**
  - `bookings.user_id` is nullable to support walk-ins.
  - `customer_name`, `customer_phone`, and `created_by` preserve auditability.

- **Scalable API auth**
  - Store only `api_keys.key_hash` and prefix metadata.
  - Enforce lookup performance with `idx_key_hash`.

## Reliability Constraints

- `uq_ground_slot (ground_id, date, start_time)` prevents duplicate slot rows.
- `uq_staff_ground (user_id, ground_id)` prevents duplicate staff mappings.

## Real-time Control Plane

Staff operations should publish socket events so user-facing slot inventories are updated immediately after:

- slot blocked/unblocked
- offline booking inserted
- booking status transition
