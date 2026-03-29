import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/mysql.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

const verifySchema = z.object({
  bookingId: z.number().int().positive(),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(3)
});

router.post('/verify', requireAuth, async (req, res, next) => {
  try {
    const payload = verifySchema.parse(req.body);

    const bookingRows = await query('SELECT id, amount, status FROM bookings WHERE id = ?', [payload.bookingId]);
    const booking = bookingRows[0];

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await query(
      `INSERT INTO payments
        (booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status)
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [booking.id, payload.razorpayOrderId, payload.razorpayPaymentId, payload.razorpaySignature, booking.amount]
    );

    await query(`UPDATE bookings SET status = 'confirmed', razorpay_order_id = ? WHERE id = ?`, [
      payload.razorpayOrderId,
      booking.id
    ]);

    return res.json({ message: 'Payment recorded and booking confirmed' });
  } catch (error) {
    return next(error);
  }
});

export default router;
