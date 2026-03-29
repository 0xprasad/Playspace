# Playspace — Sports Infrastructure Platform

Playspace is a 3-sided sports operations platform (starting with cricket) that connects:

- **Players** to discover and book grounds instantly.
- **Ground owners/staff** to manage availability and walk-ins in real time.
- **Platform admins** to control operations, disputes, integrations, and compliance.

## Core Product Pillars

1. **Real-time slot inventory**
   - Ground availability is represented as materialized `ground_slots` rows.
   - Staff can block/unblock slots without altering base recurring templates.

2. **Reliable booking + payment flow**
   - Booking is created in `pending` state.
   - Razorpay test mode is used first for end-to-end validation.
   - On verified payment, booking moves to `confirmed` and slot is locked.

3. **Online + offline compatibility**
   - Walk-in bookings are first-class (`booking_type='offline'`).
   - `bookings.user_id` is nullable by design.

4. **Platform-ready integration model**
   - API keys are hashed and scope-based.
   - `api_keys.key_hash` is indexed for high-frequency request validation.

## Database Constraints That Matter

- `UNIQUE KEY uq_ground_slot (ground_id, date, start_time)` on `ground_slots`
  - This is the primary anti-double-booking guardrail at the database level.

- `INDEX idx_key_hash (key_hash)` on `api_keys`
  - Critical for O(log n)-style key lookup behavior under load.

## Migrations

SQL migrations are available under `db/migrations`:

1. `001_create_users.sql`
2. `002_create_grounds.sql`
3. `003_create_slot_templates.sql`
4. `004_create_ground_slots.sql`
5. `005_create_bookings.sql`
6. `006_create_api_keys.sql`
7. `007_add_integrity_constraints.sql`
8. `008_add_booking_expiry.sql`

## Next Implementation Milestones

- Add backend modules (`auth`, `grounds`, `slots`, `bookings`, `payments`, `api-keys`).
- Add nightly slot-generation cron (`slot_templates` -> `ground_slots` for next 7 days).
- Add Redis-backed rate limiting and session/token controls.
- Add Socket.IO event channel for staff-triggered slot updates.
- Add role-specific Next.js experiences (user/staff/admin dashboards).

## Backend bootstrap (Node.js + Express)

A backend service scaffold is available under `backend/` with modular routes and shared middleware:

- `auth` (JWT login bootstrap)
- `grounds`
- `slots`
- `bookings` (online + offline)
- `payments` (verification persistence)
- `api-keys` (issuance + listing)

### Quick start

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

### API surface (initial)

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login` (email + password)
- `POST /api/auth/login`
- `GET|POST /api/grounds`
- `GET /api/slots/:groundId`
- `PATCH /api/slots/:slotId/block`
- `PATCH /api/slots/:slotId/unblock`
- `POST /api/bookings/online`
  - creates a 15-minute pending booking window before cleanup
- `POST /api/bookings/online`
- `POST /api/bookings/offline`
- `GET /api/bookings`
- `POST /api/payments/verify`
- `POST|GET /api/admin/api-keys`
