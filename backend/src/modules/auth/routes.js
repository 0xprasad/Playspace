import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { query } from '../../db/mysql.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(15).optional(),
  password: z.string().min(8).max(72)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = registerSchema.parse(req.body);
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES (?, ?, ?, ?, 'user')`,
      [name, email, phone ?? null, passwordHash]
    );

    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const users = await query('SELECT id, email, role, name, password_hash FROM users WHERE email = ? LIMIT 1', [
      email
    ]);
const loginSchema = z.object({ email: z.string().email() });

router.post('/login', async (req, res, next) => {
  try {
    const { email } = loginSchema.parse(req.body);
    const users = await query('SELECT id, email, role, name FROM users WHERE email = ? LIMIT 1', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, env.jwtSecret, {
      expiresIn: '12h'
    });

    delete user.password_hash;
    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
});

export default router;
