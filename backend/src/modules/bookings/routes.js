import { Router } from 'express';
import { z } from 'zod';
import { query, pool } from '../../db/mysql.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

const onlineBookingSchema = z.object({ slotId: z.number().int().positive() });

router.post('/online', requireAuth, requireRole('user', 'admin'), async (req, res, next) => {
  const conn = await pool.getConnection();

  try {
    const { slotId } = onlineBookingSchema.parse(req.body);
    await conn.beginTransaction();

    const [slots] = await conn.execute(
      `SELECT id, ground_id, price, status FROM ground_slots WHERE id = ? FOR UPDATE`,
      [slotId]
    );

    const slot = slots[0];
    if (!slot || slot.status !== 'available') {
      await conn.rollback();
      return res.status(409).json({ message: 'Slot not available' });
    }

    const [bookingResult] = await conn.execute(
      `INSERT INTO bookings (user_id, slot_id, ground_id, booking_type, amount, status)
       VALUES (?, ?, ?, 'online', ?, 'pending')`,
      [req.user.id, slot.id, slot.ground_id, slot.price]
    );

    await conn.execute(`UPDATE bookings SET expires_at = DATE_ADD(created_at, INTERVAL 15 MINUTE) WHERE id = ?`, [
      bookingResult.insertId
    ]);

    await conn.execute(`UPDATE ground_slots SET status = 'booked' WHERE id = ?`, [slotId]);

    await conn.commit();
    return res.status(201).json({
      bookingId: bookingResult.insertId,
      paymentWindowMinutes: 15
    });
    await conn.execute(`UPDATE ground_slots SET status = 'booked' WHERE id = ?`, [slotId]);

    await conn.commit();
    return res.status(201).json({ bookingId: bookingResult.insertId });
  } catch (error) {
    await conn.rollback();
    return next(error);
  } finally {
    conn.release();
  }
});

const offlineBookingSchema = z.object({
  slotId: z.number().int().positive(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(8).max(15)
});

router.post('/offline', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const body = offlineBookingSchema.parse(req.body);

    const rows = await query('SELECT id, ground_id, price, status FROM ground_slots WHERE id = ?', [body.slotId]);
    const slot = rows[0];

    if (!slot || !['available', 'offline'].includes(slot.status)) {
      return res.status(409).json({ message: 'Slot not available for offline booking' });
    }

    const result = await query(
      `INSERT INTO bookings
         (user_id, slot_id, ground_id, booking_type, customer_name, customer_phone, amount, status, created_by)
       VALUES
         (NULL, ?, ?, 'offline', ?, ?, ?, 'confirmed', ?)`,
      [slot.id, slot.ground_id, body.customerName, body.customerPhone, slot.price, req.user.id]
    );

    await query(`UPDATE ground_slots SET status = 'offline' WHERE id = ?`, [slot.id]);

    return res.status(201).json({ bookingId: result.insertId });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const bookings = req.user.role === 'user'
      ? await query('SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC', [req.user.id])
      : await query('SELECT * FROM bookings ORDER BY id DESC LIMIT 200');

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

export default router;
