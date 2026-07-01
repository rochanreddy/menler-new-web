// Load .env FIRST — before any module below reads process.env at import time.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDb } from './db.js';
import { isSmtpConfigured } from './utils/email.js';
import authRoutes from './routes/auth.js';
import googleRoutes from './routes/google.js';
import profileRoutes from './routes/profile.js';
import leadRoutes from './routes/leads.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import shortRoutes from './routes/short.js';

const app = express();
const port = Number(process.env.PORT || 4000);

// Allowed CORS origins: from FRONTEND_URL (supports a comma-separated list)
// plus sensible defaults. Trailing slashes/whitespace are stripped so a stray
// "/" in an env var can't silently break CORS (which surfaces as "Failed to
// fetch" in the browser). When an origin is allowed, the cors package echoes
// the request's exact Origin back, so matching is always exact.
const normalizeOrigin = (s) => (s || '').trim().replace(/\/+$/, '');
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://menler.in',
    'https://www.menler.in',
  ]
    .flatMap((v) => (v ? v.split(',') : []))
    .map(normalizeOrigin)
    .filter(Boolean),
);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin(origin, cb) {
    // Allow non-browser clients (curl, health checks) that send no Origin.
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);
app.use('/profile', profileRoutes);
app.use('/leads', leadRoutes);
app.use('/reports', reportRoutes);
app.use('/admin', adminRoutes);
app.use('/l', shortRoutes);

async function start() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Meridian API listening on http://localhost:${port}`);
      if (isSmtpConfigured()) {
        console.log('SMTP email delivery: enabled');
      } else {
        console.log('SMTP email delivery: disabled — emails log to console until SMTP_HOST, SMTP_USER, and SMTP_PASS are set');
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
