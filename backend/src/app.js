import cors from 'cors';
import express from 'express';

import authRoutes from './modules/auth/routes.js';
import groundsRoutes from './modules/grounds/routes.js';
import slotsRoutes from './modules/slots/routes.js';
import bookingsRoutes from './modules/bookings/routes.js';
import paymentsRoutes from './modules/payments/routes.js';
import apiKeysRoutes from './modules/apiKeys/routes.js';
import { requireApiKey } from './middleware/apiKey.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/grounds', groundsRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin/api-keys', apiKeysRoutes);

app.get('/api/integrations/slots', requireApiKey, async (_req, res) => {
  res.json({ message: 'API key validated' });
});

app.use((error, _req, res, _next) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error', issues: error.issues });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
