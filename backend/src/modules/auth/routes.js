import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { query } from '../../db/mysql.js';

const router = Router();

const loginSchema = z.object({ email: z.string().email() });

router.post('/login', async (req, res, next) => {
  try {
    const { email } = loginSchema.parse(req.body);
    const users = await query('SELECT id, email, role, name FROM users WHERE email = ? LIMIT 1', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, env.jwtSecret, {
      expiresIn: '12h'
    });

    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
});

export default router;
