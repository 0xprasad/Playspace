import crypto from 'crypto';
import { query } from '../db/mysql.js';

export async function requireApiKey(req, res, next) {
  try {
    const raw = req.header('x-api-key');
    if (!raw) {
      return res.status(401).json({ message: 'Missing API key' });
    }

    const keyHash = crypto.createHash('sha256').update(raw).digest('hex');

    const rows = await query(
      `SELECT id, owner_id, ground_id, scopes, env, revoked_at, expires_at
         FROM api_keys
        WHERE key_hash = ?
        LIMIT 1`,
      [keyHash]
    );

    const apiKey = rows[0];
    if (!apiKey) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    if (apiKey.revoked_at) {
      return res.status(401).json({ message: 'API key revoked' });
    }
    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return res.status(401).json({ message: 'API key expired' });
    }

    req.apiKey = apiKey;
    return next();
  } catch (error) {
    return next(error);
  }
}
