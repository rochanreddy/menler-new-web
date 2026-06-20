import { Router } from 'express';

import { Lead } from '../models/Lead.js';

const router = Router();

const KNOWN_FIELDS = new Set([
  'name', 'email', 'phone', 'program', 'track', 'background', 'message',
  'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
  'utm_term', 'gclid', 'fbclid', 'page_url', 'referrer_url', 'cta_label',
  'communication_optin', 'lead_source', 'lead_sub_source',
]);

// ── Amplifeed CRM webhook ──────────────────────────────────────────────────
// Forwards every new lead to Amplifeed. The endpoint defaults to the Menler
// inbound URL; set AMPLIFEED_WEBHOOK_SECRET on the server to enable (the secret
// is shared by Amplifeed). Override the URL with AMPLIFEED_WEBHOOK_URL if needed.
const AMPLIFEED_URL =
  process.env.AMPLIFEED_WEBHOOK_URL ||
  'https://www.amplifeed.tech/api/lead-sources/inbound/Zh7UZLt_nOqTmNpc85Bybn_t';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Best-effort E.164 for Indian numbers (Amplifeed wants a country code).
function normalizePhone(p) {
  if (!p) return undefined;
  const t = String(p).trim();
  if (t.startsWith('+')) return t;
  const digits = t.replace(/\D/g, '');
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  return t;
}

// Map our lead document → Amplifeed's canonical payload keys.
function buildAmplifeedPayload(lead) {
  const extra = (lead.extra && typeof lead.extra === 'object') ? lead.extra : {};
  const payload = {
    name: lead.name || undefined,
    email: lead.email || undefined,
    phone: normalizePhone(lead.phone),
    lead_source: lead.lead_source || 'Website',
    lead_sub_source: lead.lead_sub_source || lead.source || undefined,
    source: lead.source || undefined,
    channel: 'web',
    communication_optin: lead.communication_optin !== false,
    utm_source: lead.utm_source || undefined,
    utm_medium: lead.utm_medium || undefined,
    utm_campaign: lead.utm_campaign || undefined,
    utm_content: lead.utm_content || undefined,
    utm_term: lead.utm_term || undefined,
    gclid: lead.gclid || undefined,
    fbclid: lead.fbclid || undefined,
    page_url: lead.page_url || undefined,
    referrer_url: lead.referrer_url || undefined,
    cta_label: lead.cta_label || lead.source || undefined,
    program: lead.program || undefined,
    track: lead.track || undefined,
    description: lead.message || undefined,
    submitted_at: lead.createdAt,
    // Campaign / form-specific custom fields (campaign, workshop, score, etc.)
    ...extra,
  };
  // Drop undefined keys.
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
}

// POST with a few retries on network errors, 5xx, and 429 (endpoint is
// idempotent within ~60s, so retries are safe).
async function postWithRetry(url, options, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const resp = await fetch(url, options);
      if ((resp.status === 429 || resp.status >= 500) && i < attempts - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
      return resp;
    } catch (err) {
      if (i < attempts - 1) { await sleep(1000 * (i + 1)); continue; }
      throw err;
    }
  }
  return null;
}

// Fire-and-forget; never blocks or breaks lead capture.
async function forwardLeadToCrm(lead) {
  const secret = process.env.AMPLIFEED_WEBHOOK_SECRET;
  if (!secret) return; // not configured yet → skip silently
  // Amplifeed requires name + (email or phone); skip clearly invalid leads.
  if (!lead.email && !lead.phone) return;
  try {
    const resp = await postWithRetry(AMPLIFEED_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
      body: JSON.stringify(buildAmplifeedPayload(lead)),
    });
    if (!resp || !resp.ok) {
      const txt = resp ? await resp.text().catch(() => '') : '';
      console.error('Amplifeed webhook non-OK:', resp && resp.status, txt.slice(0, 300));
    }
  } catch (err) {
    console.error('Amplifeed webhook failed:', err.message);
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
    // Push to Amplifeed CRM (non-blocking — don't await; failures are logged only).
    forwardLeadToCrm(lead);
    res.status(201).json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error('lead capture error', err);
    res.status(500).json({ error: 'Could not submit. Please try again.' });
  }
});

export default router;
