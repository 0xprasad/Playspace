import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { requireAuth, requireRole } from '../src/middleware/auth.js';
import { env } from '../src/config/env.js';

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('requireAuth accepts valid bearer token', () => {
  const token = jwt.sign({ id: 10, role: 'user' }, env.jwtSecret);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = makeRes();
  let called = false;

  requireAuth(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(req.user.id, 10);
  assert.equal(req.user.role, 'user');
});

test('requireRole blocks unauthorized role', () => {
  const req = { user: { id: 1, role: 'user' } };
  const res = makeRes();
  let called = false;

  requireRole('admin')(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { message: 'Insufficient role' });
});
