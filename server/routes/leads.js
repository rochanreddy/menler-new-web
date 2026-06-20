import { Router } from 'express';

import { Lead } from '../models/Lead.js';

const router = Router();

const KNOWN_FIELDS = new Set([
  'name', 'email', 'phone', 'program', 'track', 'background', 'message',
  'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
]);

// Forward a new lead to an external CRM webhook (Zapier/Make/CRM intake URL).
// Configured via env: CRM_WEBHOOK_URL (required to enable) and an optional
// CRM_WEBHOOK_SECRET sent as the X-Webhook-Secret header for verification.
// Fire-and-forget + try/catch so it NEVER blocks or breaks lead capture.
async function forwardLeadToCrm(lead) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  try {
    const payload = {
      id: lead._id.toString(),
      name: lead.name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      program: lead.program || null,
      track: lead.track || null,
      message: lead.message || null,
      source: lead.source || null,
      page: lead.page || null,
      utm_source: lead.utm_source || null,
      utm_medium: lead.utm_medium || null,
      utm_campaign: lead.utm_campaign || null,
      utm_content: lead.utm_content || null,
      extra: lead.extra || {},
      createdAt: lead.createdAt,
    };
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.CRM_WEBHOOK_SECRET) headers['X-Webhook-Secret'] = process.env.CRM_WEBHOOK_SECRET;
    const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!resp.ok) console.error('CRM webhook responded', resp.status);
  } catch (err) {
    console.error('CRM webhook forward failed:', err.message);
  }
}

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
    // Push to the CRM webhook (non-blocking — don't await; failures are logged only).
    forwardLeadToCrm(lead);
    res.status(201).json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error('lead capture error', err);
    res.status(500).json({ error: 'Could not submit. Please try again.' });
  }
});

export default router;
