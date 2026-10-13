import express from 'express';
import { ClientError } from '../models/ClientError.js';

// POST /client-errors — the browser reports a registration or checkout failure.
// Public by necessity (it is called from the page), so it accepts only short,
// known-shape fields and is rate-limited per address: a script can't flood the
// collection, and a visitor stuck in a retry loop is logged a few times, not
// a few hundred.

const router = express.Router();

const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.at > WINDOW_MS) { hits.set(ip, { n: 1, at: now }); return false; }
  h.n += 1;
  return h.n > LIMIT;
}
// The map would otherwise grow by one entry per visitor for the life of the process.
setInterval(() => { const cut = Date.now() - WINDOW_MS; for (const [k, v] of hits) if (v.at < cut) hits.delete(k); }, WINDOW_MS).unref();

const STAGES = new Set(['otp', 'register', 'order', 'payment', 'confirm']);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

router.post('/', async (req, res) => {
  const ip = String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
  if (limited(ip)) return res.status(429).end();
  const b = req.body || {};
  const stage = str(b.stage, 20);
  if (!STAGES.has(stage)) return res.status(400).end();
  const doc = {
    stage,
    code: str(b.code, 40),
    message: str(b.message, 300),
    status: Number.isInteger(b.status) ? b.status : null,
    campaign: str(b.campaign, 120),
    page: str(b.page, 200),
    userAgent: str(req.get('user-agent'), 200),
  };
  // Also to the Render log, where it shows up beside the server's own errors.
  console.warn(`[client-error] ${doc.stage}/${doc.code} ${doc.campaign || doc.page}: ${doc.message}`);
  try { await ClientError.create(doc); } catch (e) { console.error('client-error save failed', e.message); }
  res.status(204).end();
});

export default router;
