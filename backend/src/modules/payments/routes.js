import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { env } from '../../config/env.js';
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

    const generatedSignature = crypto
      .createHmac('sha256', env.razorpayWebhookSecret)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== payload.razorpaySignature) {
      return res.status(400).json({ message: 'Invalid Razorpay signature' });
    }

    const bookingRows = await query('SELECT id, amount, status, slot_id, expires_at FROM bookings WHERE id = ?', [
      payload.bookingId
    ]);
    const booking = bookingRows[0];

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'pending') {
      return res.status(409).json({ message: 'Booking is not pending' });
    }
    if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
      return res.status(409).json({ message: 'Payment window expired' });
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

    await query(`UPDATE ground_slots SET status = 'booked' WHERE id = ?`, [booking.slot_id]);

    return res.json({ message: 'Payment recorded and booking confirmed' });
  } catch (error) {
    return next(error);
  }
});

export default router;
