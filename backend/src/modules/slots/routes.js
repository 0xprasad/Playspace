import { Router } from 'express';
import { query } from '../../db/mysql.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

router.get('/:groundId', async (req, res, next) => {
  try {
    const { groundId } = req.params;
    const date = req.query.date;

    const rows = await query(
      `SELECT * FROM ground_slots
       WHERE ground_id = ?
         AND (? IS NULL OR date = ?)
       ORDER BY date, start_time`,
      [groundId, date ?? null, date ?? null]
    );

    res.json({ slots: rows });
  } catch (error) {
    next(error);
  }
});

router.patch('/:slotId/block', requireAuth, requireRole('staff', 'admin'), async (req, res, next) => {
  try {
    const { slotId } = req.params;
    const reason = req.body.reason ?? 'Blocked by staff';

    await query(
      `UPDATE ground_slots
          SET status = 'blocked', blocked_reason = ?
        WHERE id = ? AND status IN ('available','offline')`,
      [reason, slotId]
    );

    res.json({ message: 'Slot blocked' });
  } catch (error) {
    next(error);
  }
});

export default router;
