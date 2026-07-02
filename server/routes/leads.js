import { Router } from 'express';

import { Lead } from '../models/Lead.js';
import { sendMail } from '../utils/email.js';
import { pdfAttachments, isAllowedPdf } from '../utils/pdfAttachments.js';
import { verifyResourceToken } from '../utils/token.js';
import { validateEmail } from '../utils/emailValidation.js';

const router = Router();

const BROCHURE_PDFS = {
  kickstarter: '/pdfs/1_updated_Menler AI Kickstarter Brochure_2026.pdf',
  generalist: '/pdfs/Menler_Claude_Gen_brochure.pdf',
  engineering: '/pdfs/Menler_Claude_Gen_brochure.pdf',
};

function brochurePdfForProgram(program) {
  const key = String(program || '').toLowerCase();
  if (key.includes('kick')) return BROCHURE_PDFS.kickstarter;
  if (key.includes('eng')) return BROCHURE_PDFS.engineering;
  return BROCHURE_PDFS.generalist;
}

function buildAttachmentEmail({ name, labels }) {
  const items = labels.filter(Boolean);
  const greeting = name ? `Hi ${name},` : 'Hi,';
  const list = items.map((l) => `• ${l}`).join('\n');

  return `${greeting}

Thanks for your interest! Your PDF${items.length > 1 ? 's are' : ' is'} attached to this email:

${list}

If you didn't request this, you can safely ignore this email.

— Team Menler`;
}

async function emailPdfAttachments({ to, name, subject, labels, pdfPaths }) {
  const attachments = pdfAttachments(pdfPaths);
  await sendMail({
    to,
    subject,
    text: buildAttachmentEmail({ name, labels }),
    attachments,
  });
}

async function markLeadDelivered(lead) {
  if (!lead) return;
  if (!lead.verified) {
    lead.verified = true;
    lead.verified_at = new Date();
    await lead.save();
  }
  forwardLeadToCrm(lead);
}

const KNOWN_FIELDS = new Set([
  'name', 'email', 'phone', 'program', 'track', 'background', 'message',
  'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
  'utm_term', 'gclid', 'fbclid', 'page_url', 'referrer_url', 'cta_label',
  'communication_optin', 'lead_source', 'lead_sub_source', 'resource', 'section', 'report_url',
  'checkout_completed',
]);

// ── Amplifeed CRM webhook ──────────────────────────────────────────────────
// Forwards every new lead to Amplifeed. The endpoint defaults to the Menler
// inbound URL; set AMPLIFEED_WEBHOOK_SECRET on the server to enable (the secret
// is shared by Amplifeed). Override the URL with AMPLIFEED_WEBHOOK_URL if needed.
const AMPLIFEED_URL =
  process.env.AMPLIFEED_WEBHOOK_URL ||
  'https://www.amplifeed.tech/api/lead-sources/inbound/S0-1VbVfoh_ydsCFUsu1MXld';

// Shared with Amplifeed. Prefer the env var; fall back to the known value so
// forwarding works even if the env isn't set (this same key is already present
// in the client OTP widget, so it is not a new exposure).
const AMPLIFEED_SECRET =
  process.env.AMPLIFEED_WEBHOOK_SECRET || 'AYnA2j75Izjd7arD_AiKIDy2';

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
    resource: lead.resource || undefined,
    section: lead.section || undefined,
    report_url: lead.report_url || undefined,
    lead_quality: lead.verified ? 'verified' : 'unverified',
    checkout_completed: lead.checkout_completed || undefined,
    checkout_at: lead.checkout_at || undefined,
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
  const secret = AMPLIFEED_SECRET;
  if (!secret) return; // not configured → skip silently
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

    // Honeypot: a hidden field only bots fill. Pretend success, store nothing.
    if (body.hp_field) return res.status(201).json({ ok: true, id: null });

    // Email quality gate (only when an email is supplied): reject malformed,
    // disposable, and non-existent-domain addresses before saving.
    if (body.email) {
      const v = await validateEmail(body.email);
      if (!v.ok) return res.status(400).json({ error: v.reason });
    }

    const doc = { extra: {} };
    for (const [key, value] of Object.entries(body)) {
      if (key === 'hp_field') continue;
      if (KNOWN_FIELDS.has(key)) doc[key] = value;
      else doc.extra[key] = value;
    }
    // OTP-verified submissions (email/phone verified client-side via Amplifeed/MSG91)
    // → mark verified so the admin panel + CRM see them as high quality.
    if (body.otp_token) { doc.verified = true; doc.verified_at = new Date(); }

    if (doc.checkout_completed) doc.checkout_at = new Date();

    const lead = await Lead.create(doc);
    // Push to Amplifeed CRM (non-blocking — don't await; failures are logged only).
    forwardLeadToCrm(lead);
    res.status(201).json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error('lead capture error', err);
    res.status(500).json({ error: 'Could not submit. Please try again.' });
  }
});

/* ── Mark an existing lead as checked-out ────────────────────────────────── */
// Called after the checkout step completes. Updates the SAME registration lead
// (so there's one lead per registrant) and flags checkout as done, instead of
// creating a duplicate lead.
router.post('/:id/checkout', async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[a-f\d]{24}$/i.test(id)) return res.status(400).json({ error: 'Invalid lead id.' });

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });

    const body = req.body || {};
    lead.checkout_completed = true;
    lead.checkout_at = new Date();
    if (body.section) lead.section = body.section;
    if (body.cta_label) lead.cta_label = body.cta_label;
    lead.extra = {
      ...(lead.extra && typeof lead.extra === 'object' ? lead.extra : {}),
      ...(body.items !== undefined ? { items: body.items } : {}),
      ...(body.amount !== undefined ? { amount: body.amount } : {}),
    };
    await lead.save();

    // Reflect the checkout in the CRM (non-blocking).
    forwardLeadToCrm(lead);
    res.json({ ok: true });
  } catch (err) {
    console.error('lead checkout update error', err);
    res.status(500).json({ error: 'Could not update the lead.' });
  }
});

/* ── PDF delivery by email attachment ────────────────────────────────────── */
const FRONTEND_BASE = () =>
  (process.env.FRONTEND_URL || 'https://menler.in').split(',')[0].trim().replace(/\/+$/, '');

// 1) Request a gated resource — save lead, attach PDF to email.
router.post('/resource-request', async (req, res) => {
  try {
    const body = req.body || {};

    if (body.hp_field) return res.status(201).json({ ok: true });

    const email = String(body.email || '').trim();
    const pdf = String(body.pdf || '');
    if (!email || !isAllowedPdf(pdf)) {
      return res.status(400).json({ error: 'A valid email and resource are required.' });
    }
    const v = await validateEmail(email);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const doc = { extra: {}, verified: false, resource: body.resource || '', resource_pdf: pdf };
    for (const [key, value] of Object.entries(body)) {
      if (key === 'pdf' || key === 'hp_field') continue;
      if (KNOWN_FIELDS.has(key)) doc[key] = value;
      else if (!(key in doc)) doc.extra[key] = value;
    }
    const lead = await Lead.create(doc);
    const label = lead.resource || 'Menler resource';

    await emailPdfAttachments({
      to: email,
      name: lead.name,
      subject: `Your Menler resource${label ? `: ${label}` : ''}`,
      labels: [label],
      pdfPaths: [pdf],
    });

    await markLeadDelivered(lead);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('resource-request error', err);
    const msg = err.message?.includes('PDF not found')
      ? 'This resource is temporarily unavailable. Please try again later.'
      : 'Could not send the email. Please try again.';
    res.status(500).json({ error: msg });
  }
});

// Brochure request — program → PDF is resolved server-side, then emailed as attachment.
router.post('/brochure-request', async (req, res) => {
  try {
    const body = req.body || {};
    if (body.hp_field) return res.status(201).json({ ok: true });

    const email = String(body.email || '').trim();
    const program = body.program || body.track || body.section || '';
    const pdf = brochurePdfForProgram(program);
    if (!email || !isAllowedPdf(pdf)) {
      return res.status(400).json({ error: 'A valid email and program are required.' });
    }

    const v = await validateEmail(email);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const resourceLabel = body.resource || `${program || 'Menler'} Brochure`;
    const doc = {
      extra: {},
      verified: false,
      resource: resourceLabel,
      resource_pdf: pdf,
      program: program || undefined,
    };
    for (const [key, value] of Object.entries(body)) {
      if (key === 'hp_field') continue;
      if (KNOWN_FIELDS.has(key)) doc[key] = value;
      else if (!(key in doc)) doc.extra[key] = value;
    }
    const lead = await Lead.create(doc);

    await emailPdfAttachments({
      to: email,
      name: lead.name,
      subject: `Your Menler brochure${program ? `: ${program}` : ''}`,
      labels: [resourceLabel],
      pdfPaths: [pdf],
    });

    await markLeadDelivered(lead);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('brochure-request error', err);
    const msg = err.message?.includes('PDF not found')
      ? 'This brochure is temporarily unavailable. Please try again later.'
      : 'Could not send the brochure email. Please try again.';
    res.status(500).json({ error: msg });
  }
});

// Batch resource delivery (checkout add-ons) — one email, all PDFs attached.
router.post('/resource-batch', async (req, res) => {
  try {
    const body = req.body || {};
    if (body.hp_field) return res.status(201).json({ ok: true });

    const email = String(body.email || '').trim();
    const items = Array.isArray(body.resources) ? body.resources : [];
    const valid = items.filter((i) => i && isAllowedPdf(String(i.pdf || '')));
    if (!email || !valid.length) {
      return res.status(400).json({ error: 'A valid email and at least one resource are required.' });
    }

    const v = await validateEmail(email);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const labels = valid.map((i) => i.title || i.resource).filter(Boolean);
    const resourceLabel = labels.join(' | ') || 'Menler resources';

    // If this batch belongs to an existing lead (e.g. a checkout registrant),
    // attach the resources to that SAME lead instead of creating a duplicate —
    // so the admin/CRM shows one record per person, not a second row.
    let lead = null;
    const leadId = String(body.leadId || '');
    if (/^[a-f\d]{24}$/i.test(leadId)) {
      lead = await Lead.findById(leadId);
    }

    if (lead) {
      lead.resource = lead.resource ? `${lead.resource} | ${resourceLabel}` : resourceLabel;
      lead.extra = {
        ...(lead.extra && typeof lead.extra === 'object' ? lead.extra : {}),
        resource_items: labels,
      };
      await lead.save();
    } else {
      const doc = {
        extra: { resource_items: labels },
        verified: false,
        resource: resourceLabel,
      };
      for (const [key, value] of Object.entries(body)) {
        if (key === 'hp_field' || key === 'resources' || key === 'leadId') continue;
        if (KNOWN_FIELDS.has(key)) doc[key] = value;
        else if (!(key in doc)) doc.extra[key] = value;
      }
      lead = await Lead.create(doc);
    }

    await emailPdfAttachments({
      to: email,
      name: lead.name,
      subject: `Your Menler resources (${valid.length})`,
      labels: labels.length ? labels : valid.map((i) => 'Resource'),
      pdfPaths: valid.map((i) => String(i.pdf)),
    });

    await markLeadDelivered(lead);
    res.status(201).json({ ok: true, count: valid.length });
  } catch (err) {
    console.error('resource-batch error', err);
    const msg = err.message?.includes('PDF not found')
      ? 'One or more resources are temporarily unavailable. Please try again later.'
      : 'Could not send the resource email. Please try again.';
    res.status(500).json({ error: msg });
  }
});

// Legacy magic-link route — old emails may still hit this; redirect to resources page.
router.get('/resource/:token', async (req, res) => {
  const front = FRONTEND_BASE();
  const claims = verifyResourceToken(req.params.token);
  if (!claims || !isAllowedPdf(claims.pdf)) {
    return res.redirect(302, `${front}/resources?resource=expired`);
  }
  return res.redirect(302, `${front}/resources?resource=emailed`);
});

export default router;
