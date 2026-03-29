import { query } from '../db/mysql.js';

export async function cleanupExpiredPendingBookings() {
  const expired = await query(
    `SELECT id, slot_id
       FROM bookings
      WHERE status = 'pending'
        AND expires_at IS NOT NULL
        AND expires_at < NOW()`
  );

  for (const booking of expired) {
    await query(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`, [booking.id]);
    await query(
      `UPDATE ground_slots
          SET status = 'available', blocked_reason = NULL
        WHERE id = ? AND status = 'booked'`,
      [booking.slot_id]
    );
  }

  return expired.length;
}
