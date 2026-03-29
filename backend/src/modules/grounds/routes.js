import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/mysql.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

const createGroundSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  price_per_hour: z.number().positive()
});

router.get('/', async (_req, res, next) => {
  try {
    const grounds = await query('SELECT * FROM grounds WHERE is_active = TRUE ORDER BY id DESC');
    res.json({ grounds });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = createGroundSchema.parse(req.body);
    const result = await query(
      `INSERT INTO grounds (name, description, address, city, price_per_hour)
       VALUES (?, ?, ?, ?, ?)`,
      [body.name, body.description ?? null, body.address ?? null, body.city ?? null, body.price_per_hour]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

export default router;
