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
import paymentRoutes from './routes/payments.js';
import postRoutes from './routes/posts.js';
import clientErrorRoutes from './routes/clientErrors.js';
import webhookRoutes from './routes/webhooks.js';
import { rateLimit } from './middleware/rateLimit.js';

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

// Capture the raw body so the Cashfree webhook can verify its HMAC signature
// (the signature is computed over the exact bytes, which JSON.parse would lose).
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
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

// Rate limits on the endpoints worth abusing — see middleware/rateLimit.js.
const MIN = 60 * 1000;
app.use('/admin/login', rateLimit({ name: 'admin-login', max: 10, windowMs: 15 * MIN, message: 'Too many login attempts. Please wait 15 minutes and try again.' }));
for (const p of ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/resend', '/auth/forgot-password', '/auth/reset-password']) {
  app.use(p, rateLimit({ name: `auth${p.slice(5)}`, max: 20, windowMs: 15 * MIN }));
}
app.use('/leads', rateLimit({ name: 'leads', max: 40, windowMs: 10 * MIN }));
app.use('/payments/cashfree/order', rateLimit({ name: 'payment-order', max: 20, windowMs: 10 * MIN }));

app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);
app.use('/profile', profileRoutes);
app.use('/leads', leadRoutes);
app.use('/reports', reportRoutes);
app.use('/admin', adminRoutes);
app.use('/MNLRAI', shortRoutes);
app.use('/l', shortRoutes); // legacy prefix — keeps older short links working
app.use('/payments', paymentRoutes);
app.use('/posts', postRoutes);
app.use('/client-errors', clientErrorRoutes);
app.use('/webhooks', rateLimit({ name: 'webhooks', max: 120, windowMs: 1 * MIN }), webhookRoutes);

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
