// Load .env FIRST — before any module below reads process.env at import time.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDb } from './db.js';
import authRoutes from './routes/auth.js';
import googleRoutes from './routes/google.js';
import profileRoutes from './routes/profile.js';
import leadRoutes from './routes/leads.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendUrl, credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);
app.use('/profile', profileRoutes);
app.use('/leads', leadRoutes);

async function start() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Meridian API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
