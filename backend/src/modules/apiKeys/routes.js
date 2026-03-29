import crypto from 'crypto';
import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/mysql.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

const issueKeySchema = z.object({
  name: z.string().min(2),
  groundId: z.number().int().positive().nullable().optional(),
  scopes: z.array(z.string()).min(1),
  env: z.enum(['test', 'live']).default('test')
});

router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const body = issueKeySchema.parse(req.body);
    const raw = `trf_${body.env}_${crypto.randomBytes(24).toString('hex')}`;
    const prefix = raw.slice(0, 16);
    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    const result = await query(
      `INSERT INTO api_keys (owner_id, ground_id, name, key_prefix, key_hash, scopes, env)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, body.groundId ?? null, body.name, prefix, hash, JSON.stringify(body.scopes), body.env]
    );

    return res.status(201).json({ id: result.insertId, apiKey: raw, keyPrefix: prefix });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const keys = await query(
      `SELECT id, owner_id, ground_id, name, key_prefix, env, rate_limit, expires_at, revoked_at, last_used_at, created_at
       FROM api_keys
       ORDER BY id DESC`
    );

    res.json({ apiKeys: keys });
  } catch (error) {
    next(error);
  }
});

export default router;
