import { Router } from 'express';

import { Lead } from '../models/Lead.js';

const router = Router();

const KNOWN_FIELDS = new Set([
  'name', 'email', 'phone', 'program', 'track', 'background', 'message',
  'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
]);

/* ── Capture a marketing lead (public) ───────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const doc = { extra: {} };
    for (const [key, value] of Object.entries(body)) {
      if (KNOWN_FIELDS.has(key)) doc[key] = value;
      else doc.extra[key] = value;
    }

    const lead = await Lead.create(doc);
    res.status(201).json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error('lead capture error', err);
    res.status(500).json({ error: 'Could not submit. Please try again.' });
  }
});

export default router;
