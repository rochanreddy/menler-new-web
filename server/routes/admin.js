import { Router } from 'express';
import crypto from 'crypto';

import { Lead } from '../models/Lead.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { CampaignSetting } from '../models/CampaignSetting.js';
import { ShortLink } from '../models/ShortLink.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { buildCertificatePdf, buildCertificateEmail } from '../utils/certificate.js';
import { sendMail, isMailConfigured, verifyMailer } from '../utils/email.js';
import { cashfreeConfigured, findCashfreePayment, getCashfreePayments } from '../utils/cashfree.js';
import { deliverPackForOrder } from '../utils/packDelivery.js';
import { zoomConfigured, meetingIdFromLink, pastInstances, latestInstanceUuid, pastMeeting, pastMeetings, meetingParticipants, explainZoomError } from '../utils/zoom.js';
import { RESOURCE_PACKS } from '../../src/data/resourceCatalog.js';
import {
  ADMIN_COOKIE_NAME,
  signAdmin,
  adminCookieOptions,
} from '../utils/adminToken.js';

const router = Router();

/* ── helpers ─────────────────────────────────────────────────────────────── */

/** Constant-time string compare that tolerates differing lengths. */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) {
    // Still run a comparison to avoid leaking length via timing.
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

/** Escapes a single CSV cell. */
function csvCell(value) {
  if (value === null || value === undefined) return '';
  let s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Builds a CSV string from an ordered column list and an array of row objects. */
function toCsv(columns, rows) {
  const header = columns.map((c) => csvCell(c.label ?? c.key)).join(',');
  const body = rows
    .map((row) => columns.map((c) => csvCell(c.get ? c.get(row) : row[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

function sendCsv(res, filename, csv) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
}

const clampInt = (v, def, min, max) => {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.min(max, Math.max(min, n));
};

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Builds the Mongo filter for the Lead list/export from query params. */
function leadFilter(query) {
  const filter = {};
  const search = (query.search || '').trim();
  if (search) {
    const rx = new RegExp(esc(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];
  }
  if (query.program) filter.program = query.program;
  if (query.source) filter.source = query.source;
  // Page the lead was captured on (e.g. /generalist) + the section within it.
  // Section matches the same derived key the sections facet groups by
  // (section → cta_label → source), so picking a dropdown entry always works.
  if (query.page_path) filter.page = query.page_path;
  if (query.section) filter.$expr = { $eq: [SECTION_KEY, query.section] };
  // Checkout status, mirroring the table badges: paid = money confirmed via
  // Cashfree; done = completed checkout without paying; pending = campaign
  // registrant who never finished checkout.
  if (query.checkout === 'paid') {
    filter['extra.paid_amount'] = { $gt: 0 };
  } else if (query.checkout === 'done') {
    filter.checkout_completed = true;
    filter['extra.paid_amount'] = { $not: { $gt: 0 } };
  } else if (query.checkout === 'pending') {
    filter.checkout_completed = { $ne: true };
    filter.source = query.source || 'campaign-workshop';
  }
  if (query.utm_source === '__none__') filter.utm_source = { $in: [null, ''] };
  else if (query.utm_source) filter.utm_source = query.utm_source;
  // Date range on createdAt (YYYY-MM-DD; `to` is inclusive to end of day).
  const from = (query.from || '').trim();
  const to = (query.to || '').trim();
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(`${from}T00:00:00.000`);
    if (to) filter.createdAt.$lte = new Date(`${to}T23:59:59.999`);
  }
  return filter;
}

/* ── Auth ────────────────────────────────────────────────────────────────── */

router.post('/login', (req, res) => {
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  if (!envUser || !envPass) {
    res.status(500).json({ error: 'Admin login is not configured.' });
    return;
  }
  const { username = '', password = '' } = req.body || {};
  const ok = safeEqual(username, envUser) && safeEqual(password, envPass);
  if (!ok) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }
  res.cookie(ADMIN_COOKIE_NAME, signAdmin(), adminCookieOptions());
  res.json({ ok: true });
});

router.post('/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

router.get('/session', requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

/* ── Overview stats ──────────────────────────────────────────────────────── */

// Identity for a "unique lead": lowercased email if present, else phone. Used to
// dedupe repeat submissions (e.g. someone who registers the campaign twice).
const CONTACT_KEY = {
  $let: {
    vars: { e: { $toLower: { $trim: { input: { $ifNull: ['$email', ''] } } } } },
    in: { $cond: [{ $eq: ['$$e', ''] }, { $ifNull: ['$phone', ''] }, '$$e'] },
  },
};

router.get('/stats', requireAdmin, async (_req, res) => {
  try {
    const now = Date.now();
    const since7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const since14 = new Date(now - 13 * 24 * 60 * 60 * 1000);
    since14.setHours(0, 0, 0, 0);

    // "Today" in IST — the admin team's day, not the server's UTC day.
    const istNow = new Date(now + 5.5 * 60 * 60 * 1000);
    const istDay = istNow.toISOString().slice(0, 10);
    const todayStart = new Date(`${istDay}T00:00:00+05:30`);

    const [
      totalLeads,
      leads7,
      leadsToday,
      checkoutDone,
      verifiedLeads,
      byProgram,
      bySource,
      byUtmSource,
      byDayRaw,
      uniqueAgg,
      recentLeads,
      websiteByPage,
      byCampaign,
    ] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ createdAt: { $gte: since7 } }),
      Lead.countDocuments({ createdAt: { $gte: todayStart } }),
      Lead.countDocuments({ checkout_completed: true }),
      Lead.countDocuments({ verified: true }),
      Lead.aggregate([
        { $group: { _id: { g: { $ifNull: ['$program', ''] }, person: CONTACT_KEY }, n: { $sum: 1 } } },
        { $group: { _id: '$_id.g', count: { $sum: '$n' }, unique: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate([
        { $group: { _id: { g: { $ifNull: ['$source', ''] }, person: CONTACT_KEY }, n: { $sum: 1 } } },
        { $group: { _id: '$_id.g', count: { $sum: '$n' }, unique: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate([
        { $match: { utm_source: { $nin: [null, ''] } } },
        { $group: { _id: '$utm_source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ]),
      Lead.aggregate([
        { $match: { createdAt: { $gte: since14 } } },
        {
          $group: {
            // Group in IST. Without the timezone Mongo buckets by UTC, so
            // everything logged between midnight and 5:30am India time is
            // counted under the previous day — the chart and the day counter
            // then disagree about every single day.
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
            count: { $sum: 1 },
            // Split by source per day, so the chart can show where a spike came
            // from rather than only that there was one.
            campaign: {
              $sum: { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$extra.campaign', ''] } }, 0] }, 1, 0] },
            },
          },
        },
      ]),
      Lead.aggregate([
        { $group: { _id: CONTACT_KEY } },
        { $count: 'n' },
      ]),
      Lead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      // Campaign-page leads carry their campaign slug in extra.campaign (and
      // register with source 'campaign-workshop'); everything else is an
      // organic menler.in website lead, grouped by the PAGE it came from so the
      // admin can see which pages pull the most leads.
      Lead.aggregate([
        { $match: { page: { $nin: [null, ''] }, $nor: [{ 'extra.campaign': { $nin: [null, ''] } }, { source: 'campaign-workshop' }] } },
        { $group: { _id: { g: '$page', person: CONTACT_KEY }, n: { $sum: 1 } } },
        { $group: { _id: '$_id.g', count: { $sum: '$n' }, unique: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      Lead.aggregate([
        { $match: { $or: [{ 'extra.campaign': { $nin: [null, ''] } }, { source: 'campaign-workshop' }] } },
        { $group: { _id: { g: { $ifNull: ['$extra.campaign', '—'] }, person: CONTACT_KEY }, n: { $sum: 1 } } },
        { $group: { _id: '$_id.g', count: { $sum: '$n' }, unique: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 30 },
      ]),
    ]);

    /* Fill the 14-day series so every day has a bar (zero when no leads).
     *
     * The keys have to be IST days too, or they miss the IST-grouped buckets
     * they're looking up — shifting the clock forward before slicing gives the
     * India date for that moment. Ends on today rather than 13 days after a
     * midnight-adjusted start, which is what drifted the axis by a day. */
    const istDay = (ms) => new Date(ms + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
    const dayMap = new Map(byDayRaw.map((d) => [d._id, d]));
    const byDay = [];
    for (let i = 13; i >= 0; i--) {
      const key = istDay(Date.now() - i * 864e5);
      const hit = dayMap.get(key);
      const count = hit?.count || 0;
      const campaign = hit?.campaign || 0;
      byDay.push({ date: key, count, campaign, website: Math.max(0, count - campaign) });
    }

    const tidy = (arr) =>
      arr.map((x) => ({ label: x._id || '—', count: x.count, unique: x.unique }));

    res.json({
      totals: {
        leads: totalLeads,
        uniqueLeads: uniqueAgg[0]?.n || 0,
        leads7,
        leadsToday,
        checkoutDone,
        verifiedLeads,
      },
      byProgram: tidy(byProgram),
      bySource: tidy(bySource),
      websiteByPage: tidy(websiteByPage),
      byCampaign: tidy(byCampaign),
      byUtmSource: byUtmSource.map((x) => ({ label: x._id, count: x.count })),
      byDay,
      recentLeads,
    });
  } catch (err) {
    console.error('admin stats error', err);
    res.status(500).json({ error: 'Could not load stats.' });
  }
});

// Leads count for a rolling period — powers the "Leads · last N" stat card.
router.get('/stats/period', requireAdmin, async (req, res) => {
  try {
    const days = clampInt(req.query.days, 7, 1, 730);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const count = await Lead.countDocuments({ createdAt: { $gte: since } });
    res.json({ days, count });
  } catch (err) {
    console.error('admin stats/period error', err);
    res.status(500).json({ error: 'Could not load the period count.' });
  }
});

// Leads count for one calendar day (IST) — powers the date-picker stat card.
/* Leads in a date range, inclusive of both ends, in IST — the team's day, not
 * the server's UTC one. `from`/`to` may be the same date for a single day, and
 * a lone `date` is still accepted so nothing calling the older shape breaks. */
router.get('/stats/day', requireAdmin, async (req, res) => {
  try {
    const isDay = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
    const single = String(req.query.date || '').trim();
    let from = String(req.query.from || '').trim() || single;
    let to = String(req.query.to || '').trim() || single;

    if (!isDay(from) || !isDay(to)) {
      return res.status(400).json({ error: 'Pass ?from=YYYY-MM-DD&to=YYYY-MM-DD (or ?date=YYYY-MM-DD).' });
    }
    // Tolerate a range entered backwards rather than returning zero.
    if (from > to) [from, to] = [to, from];

    const start = new Date(`${from}T00:00:00+05:30`);
    const end = new Date(new Date(`${to}T00:00:00+05:30`).getTime() + 24 * 60 * 60 * 1000);

    const inRange = { createdAt: { $gte: start, $lt: end } };
    const [count, unique, fromCampaign] = await Promise.all([
      Lead.countDocuments(inRange),
      Lead.aggregate([
        { $match: inRange },
        { $group: { _id: CONTACT_KEY } },
        { $count: 'n' },
      ]).then((r) => r[0]?.n || 0),
      // A lead carries a campaign slug when it came from a campaign landing
      // page; everything else arrived through the main site. Split here so the
      // card can answer "campaign or website" without anyone scrolling to the
      // breakdowns to work it out.
      Lead.countDocuments({ ...inRange, 'extra.campaign': { $type: 'string', $ne: '' } }),
    ]);

    const days = Math.round((end - start) / 864e5);
    res.json({
      from, to, days, count, unique, date: from,
      fromCampaign,
      fromWebsite: Math.max(0, count - fromCampaign),
    });
  } catch (err) {
    console.error('admin stats/day error', err);
    res.status(500).json({ error: 'Could not load the count.' });
  }
});

// Distinct pages leads were captured on (with counts) — powers the Pages filter.
router.get('/leads/pages', requireAdmin, async (_req, res) => {
  try {
    const rows = await Lead.aggregate([
      { $match: { page: { $nin: [null, ''] } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 60 },
    ]);
    res.json({ pages: rows.map((r) => ({ page: r._id, count: r.count })) });
  } catch (err) {
    console.error('admin leads/pages error', err);
    res.status(500).json({ error: 'Could not load pages.' });
  }
});

// UTM sources seen on one page (with counts) — the drill-down after picking a
// campaign, so the admin can see which ad/traffic source filled it.
router.get('/leads/utms', requireAdmin, async (req, res) => {
  try {
    const page = String(req.query.page || '').trim();
    if (!page) return res.status(400).json({ error: 'Pass ?page=/path.' });
    const rows = await Lead.aggregate([
      { $match: { page, utm_source: { $nin: [null, ''] } } },
      { $group: { _id: '$utm_source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 60 },
    ]);
    res.json({ utms: rows.map((r) => ({ utm: r._id, count: r.count })) });
  } catch (err) {
    console.error('admin leads/utms error', err);
    res.status(500).json({ error: 'Could not load UTM sources.' });
  }
});

// A lead's "section within the page": the explicit section label when set,
// else the CTA/button it came from, else its source — so every lead lands in a
// meaningful bucket and the per-page drill-down is never empty.
const SECTION_KEY = {
  $switch: {
    branches: [
      { case: { $gt: [{ $strLenCP: { $ifNull: ['$section', ''] } }, 0] }, then: '$section' },
      { case: { $gt: [{ $strLenCP: { $ifNull: ['$cta_label', ''] } }, 0] }, then: '$cta_label' },
    ],
    default: { $ifNull: ['$source', '—'] },
  },
};

// Sections seen on one page (with counts) — the drill-down after picking a page.
router.get('/leads/sections', requireAdmin, async (req, res) => {
  try {
    const page = String(req.query.page || '').trim();
    if (!page) return res.status(400).json({ error: 'Pass ?page=/path.' });
    const rows = await Lead.aggregate([
      { $match: { page } },
      { $group: { _id: SECTION_KEY, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 60 },
    ]);
    res.json({ sections: rows.map((r) => ({ section: r._id || '—', count: r.count })) });
  } catch (err) {
    console.error('admin leads/sections error', err);
    res.status(500).json({ error: 'Could not load sections.' });
  }
});

/* ── Paid users ──────────────────────────────────────────────────────────────
 * Everyone who has PAID — site-wide (campaign packs, library, programs), from
 * the Orders collection (only webhook/status-confirmed PAID orders). Manual
 * entries cover people who paid through a direct Cashfree payment link instead
 * of the website; they're stored as PAID orders flagged extra.manual. */

function paidFilter(query) {
  const filter = { status: 'PAID' };
  const search = (query.search || '').trim();
  if (search) {
    const rx = new RegExp(esc(search), 'i');
    filter.$or = [
      { customer_name: rx }, { customer_email: rx }, { customer_phone: rx },
      { program: rx }, { order_id: rx },
      { 'extra.cf_payment_id': rx }, { 'extra.txn_id': rx },
      { 'extra.batch': rx },
    ];
  }
  // Cohorts run month by month, so "who's in the August batch" is the question
  // this list gets asked most — it deserves a filter of its own rather than
  // relying on a date range that a late payment would fall outside.
  const batch = (query.batch || '').trim();
  if (batch) filter['extra.batch'] = batch === 'none' ? { $in: [null, ''] } : batch;
  return filter;
}

/** A YYYY-MM month, or '' — anything else is refused rather than stored. */
function cleanBatch(value) {
  const s = String(value || '').trim();
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(s) ? s : '';
}

router.get('/paid-users', requireAdmin, async (req, res) => {
  try {
    const limit = clampInt(req.query.limit, 25, 1, 100);
    const page = clampInt(req.query.page, 1, 1, 10000);
    const filter = paidFilter(req.query);
    const [rows, total] = await Promise.all([
      Order.find(filter).sort({ paid_at: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    // Backfill Cashfree's real transaction id (cf_payment_id) for rows that
    // predate the webhook storing it. One API call per missing row, saved back,
    // so each order is only ever fetched once.
    if (cashfreeConfigured()) {
      await Promise.all(rows.map(async (r) => {
        if (r.extra?.manual || r.extra?.cf_payment_id) return;
        try {
          const payments = await getCashfreePayments(r.order_id);
          const paid = payments.find((p) => (p.payment_status || '').toUpperCase() === 'SUCCESS') || payments[0];
          if (paid?.cf_payment_id) {
            r.extra = { ...(r.extra || {}), cf_payment_id: String(paid.cf_payment_id) };
            await Order.updateOne({ _id: r._id }, { $set: { 'extra.cf_payment_id': String(paid.cf_payment_id) } });
          }
        } catch { /* leave blank; the order id still cross-references */ }
      }));
    }

    // Money totals over everything matching the search, not just this page —
    // a revenue figure that changes when you turn the page is worse than none.
    const startOfMonthIST = (() => {
      const now = new Date(Date.now() + 5.5 * 3600 * 1000);
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) - 5.5 * 3600 * 1000);
    })();
    const [agg] = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
          manual: { $sum: { $cond: ['$extra.manual', 1, 0] } },
          // Manual rows added before payments were checked against Cashfree.
          unverified: { $sum: { $cond: [{ $and: ['$extra.manual', { $ne: ['$extra.verified', true] }] }, 1, 0] } },
          thisMonth: {
            $sum: {
              $cond: [{ $gte: [{ $ifNull: ['$paid_at', '$createdAt'] }, startOfMonthIST] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    // Every batch that exists, ignoring the batch filter itself — otherwise
    // picking one would empty the dropdown you picked it from.
    const batchAgg = await Order.aggregate([
      { $match: { ...paidFilter({ search: req.query.search }) } },
      { $group: { _id: '$extra.batch', n: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $sort: { _id: -1 } },
    ]);

    // Whether each buyer actually got their pack. Orders paid before delivery
    // moved server-side have no marker of their own, so fall back to the lead's
    // resource list, which is where the browser used to record it.
    const packOrders = rows.filter((r) => RESOURCE_PACKS[String(r.program || '').toLowerCase()]);
    const leadIds = packOrders.map((r) => r.leadId).filter(Boolean);
    const leads = leadIds.length
      ? await Lead.find({ _id: { $in: leadIds } }).select('resource').lean()
      : [];
    const resourceByLead = new Map(leads.map((l) => [String(l._id), l.resource || '']));
    for (const r of rows) {
      const hasPack = Boolean(RESOURCE_PACKS[String(r.program || '').toLowerCase()]);
      r.packExpected = hasPack;
      r.packSent = hasPack
        ? Boolean(r.extra?.resources_sent_at || resourceByLead.get(String(r.leadId)))
        : null;
    }

    res.json({
      rows,
      total,
      page,
      limit,
      packsUndelivered: rows.filter((r) => r.packExpected && !r.packSent).length,
      batches: batchAgg
        .filter((b) => b._id)
        .map((b) => ({ batch: b._id, count: b.n, revenue: b.revenue })),
      unbatched: batchAgg.find((b) => !b._id)?.n || 0,
      summary: {
        revenue: agg?.revenue || 0,
        count: agg?.count || 0,
        manual: agg?.manual || 0,
        unverified: agg?.unverified || 0,
        thisMonth: agg?.thisMonth || 0,
      },
    });
  } catch (err) {
    console.error('admin paid-users error', err);
    res.status(500).json({ error: 'Could not load paid users.' });
  }
});

/* Look a reference up in Cashfree before anything is written. Read-only —
 * it exists so the admin sees what they're about to record. */
router.post('/paid-users/verify', requireAdmin, async (req, res) => {
  try {
    if (!cashfreeConfigured()) {
      return res.status(503).json({ error: 'Cashfree keys are not configured on this server, so payments cannot be verified here.' });
    }
    const ref = String(req.body?.reference || '').trim();
    if (!ref) return res.status(400).json({ error: 'Paste the Cashfree Order ID or payment-link ID.' });

    const found = await findCashfreePayment(ref);
    if (!found.found) {
      return res.status(404).json({ error: found.detail || 'No matching payment in Cashfree.', reason: found.reason });
    }

    // Already recorded? Say so now rather than after they fill the form in.
    const dupe = await Order.findOne({
      $or: [
        { order_id: found.payment.order_id },
        ...(found.payment.cf_payment_id ? [{ 'extra.cf_payment_id': found.payment.cf_payment_id }] : []),
      ],
    }).lean();

    res.json({
      ok: true,
      via: found.via,
      payment: found.payment,
      duplicate: dupe
        ? { id: dupe._id, name: dupe.customer_name, paid_at: dupe.paid_at, manual: Boolean(dupe.extra?.manual) }
        : null,
    });
  } catch (err) {
    console.error('admin paid-users verify error', err);
    res.status(502).json({ error: err?.message || 'Could not reach Cashfree.' });
  }
});

/* Record an off-site payment (taken through a direct Cashfree link).
 *
 * The reference is re-verified here rather than trusted from the request: the
 * amount and the payer come back from Cashfree, so a typo — or a wrong number
 * typed deliberately — can't become a revenue figure. */
router.post('/paid-users', requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const name = String(b.name || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const phone = String(b.phone || '').trim();
    const program = String(b.program || '').trim();
    let amount = Number(b.amount);
    const ref = String(b.reference || '').trim();

    if (!name) return res.status(400).json({ error: 'A name is required.' });
    if (!program) return res.status(400).json({ error: 'Pick what they paid for.' });

    // Skipping verification has to be asked for explicitly. Without this the
    // gate is only in the browser, and anything posting to this route directly
    // would land an unverified row that looks exactly like a verified one.
    if (!ref && b.unverified !== true) {
      return res.status(400).json({ error: 'A Cashfree Order ID is required, or tick the option to record it unverified.' });
    }
    // An unverified row with no reference at all is unauditable — there'd be
    // nothing to reconcile it against a settlement with, ever.
    if (!ref && !String(b.txn_id || '').trim()) {
      return res.status(400).json({ error: 'A Cashfree Transaction ID is required when recording without verification.' });
    }

    // A reference is optional. When there is one, Cashfree decides the money and
    // the payment id — a hand-typed amount must never silently outrank the
    // gateway. Without one the entry is saved as-is and flagged unverified, so
    // the difference stays visible in the list rather than being assumed.
    let verified = null;
    if (ref && cashfreeConfigured()) {
      const found = await findCashfreePayment(ref);
      if (!found.found) {
        return res.status(400).json({ error: found.detail || 'That reference has no successful payment in Cashfree.' });
      }
      verified = found;
      amount = found.payment.amount;

      const dupe = await Order.findOne({
        $or: [
          { order_id: found.payment.order_id },
          ...(found.payment.cf_payment_id ? [{ 'extra.cf_payment_id': found.payment.cf_payment_id }] : []),
        ],
      }).lean();
      if (dupe) {
        return res.status(409).json({ error: `Already recorded — ${dupe.customer_name || dupe.customer_email || found.payment.order_id} is in the list.` });
      }
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'A positive amount is required.' });
    }

    const p = verified?.payment;
    const order = await Order.create({
      order_id: p?.order_id || `MANUAL_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      program,
      amount,
      status: 'PAID',
      paid_at: b.paid_at
        ? new Date(`${b.paid_at}T12:00:00+05:30`)
        : (p?.paid_at ? new Date(p.paid_at) : new Date()),
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      extra: {
        manual: true,
        // Which monthly cohort this person is in. Free-standing from paid_at,
        // because someone paying late in August can still belong to September.
        ...(cleanBatch(b.batch) ? { batch: cleanBatch(b.batch) } : {}),
        ...(verified ? {
          verified: true,
          verified_at: new Date(),
          verified_via: verified.via,      // 'order' | 'link'
          cf_payment_id: p.cf_payment_id,
          payment_method: p.method,
        } : {
          // Typed by hand off the Cashfree dashboard. Kept separate from
          // cf_payment_id so a number nobody checked never passes for one the
          // gateway confirmed — the two are searchable either way.
          ...(b.txn_id ? { txn_id: String(b.txn_id).trim() } : {}),
        }),
        ...(b.note ? { note: String(b.note).trim() } : {}),
      },
    });
    res.status(201).json({ ok: true, id: order._id, verified: Boolean(verified) });
  } catch (err) {
    console.error('admin paid-users add error', err);
    res.status(500).json({ error: 'Could not add the payment.' });
  }
});

/* Verify a row that's already in the list.
 *
 * An unverified entry isn't meant to stay that way — once the Order ID turns
 * up, this checks it and promotes the row in place, keeping its id so nothing
 * that references it breaks. Cashfree's amount and payer overwrite what was
 * typed, since the point of verifying is to replace a guess with a fact. */
router.post('/paid-users/:id/verify', requireAdmin, async (req, res) => {
  try {
    if (!cashfreeConfigured()) {
      return res.status(503).json({ error: 'Cashfree keys are not configured on this server.' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found.' });
    if (order.extra?.verified) return res.status(400).json({ error: 'This one is already verified.' });

    // Use the reference given, else the row's own order_id when it looks like a
    // real Cashfree one rather than a placeholder we minted.
    const ref = String(req.body?.reference || '').trim()
      || (/^MANUAL_/.test(order.order_id) ? '' : order.order_id);
    if (!ref) {
      return res.status(400).json({ error: 'Give the Cashfree Order ID for this payment.', needsReference: true });
    }

    const found = await findCashfreePayment(ref);
    if (!found.found) {
      return res.status(400).json({ error: found.detail || 'No successful payment in Cashfree for that reference.' });
    }
    const p = found.payment;

    // That Cashfree payment must not already belong to a different row.
    const clash = await Order.findOne({
      _id: { $ne: order._id },
      $or: [
        { order_id: p.order_id },
        ...(p.cf_payment_id ? [{ 'extra.cf_payment_id': p.cf_payment_id }] : []),
      ],
    }).lean();
    if (clash) {
      return res.status(409).json({
        error: `That payment is already recorded under ${clash.customer_name || clash.customer_email || clash.order_id}.`,
      });
    }

    const before = { amount: order.amount, name: order.customer_name };
    order.order_id = p.order_id;
    order.amount = p.amount;
    if (p.customer.name) order.customer_name = p.customer.name;
    if (p.customer.email) order.customer_email = p.customer.email.toLowerCase();
    if (p.customer.phone) order.customer_phone = p.customer.phone;
    if (p.paid_at) order.paid_at = new Date(p.paid_at);
    order.extra = {
      ...(order.extra || {}),
      verified: true,
      verified_at: new Date(),
      verified_via: found.via,
      cf_payment_id: p.cf_payment_id,
      payment_method: p.method,
    };
    order.markModified('extra');
    await order.save();

    res.json({
      ok: true,
      changed: {
        // Surfaced so a corrected figure is noticed rather than silently applied.
        amount: before.amount !== p.amount ? { from: before.amount, to: p.amount } : null,
        name: before.name !== order.customer_name ? { from: before.name, to: order.customer_name } : null,
      },
      payment: p,
    });
  } catch (err) {
    console.error('admin paid-users verify-existing error', err);
    res.status(502).json({ error: err?.message || 'Could not reach Cashfree.' });
  }
});

/* Send (or re-send) the resource pack for one paid order. `force` is what makes
 * this useful after a failure: without it an order that recorded a delivery is
 * skipped, which is right for the webhook and wrong for a human who can see the
 * buyer never got the email. */
router.post('/paid-users/:id/resend-pack', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found.' });
    if (order.status !== 'PAID') return res.status(400).json({ error: 'That order is not paid.' });

    const out = await deliverPackForOrder(order, { force: true });
    if (!out.sent) return res.status(400).json({ error: out.reason || 'Nothing to send.' });
    res.json({ ok: true, sent: out.sent, to: out.to });
  } catch (err) {
    console.error('admin resend pack error', err);
    res.status(500).json({ error: err?.message || 'Could not send the resources.' });
  }
});

/* Set or clear a row's batch month. Allowed on gateway orders too — the
 * website never asks which cohort someone is joining, so this is the only
 * place that information can be attached. */
router.patch('/paid-users/:id/batch', requireAdmin, async (req, res) => {
  try {
    const raw = String(req.body?.batch || '').trim();
    const batch = cleanBatch(raw);
    if (raw && !batch) return res.status(400).json({ error: 'Give the batch as a month, e.g. 2026-08.' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found.' });
    order.extra = { ...(order.extra || {}), ...(batch ? { batch } : { batch: '' }) };
    order.markModified('extra');
    await order.save();
    res.json({ ok: true, batch });
  } catch (err) {
    console.error('admin paid-users batch error', err);
    res.status(500).json({ error: 'Could not set the batch.' });
  }
});

// Remove a MANUAL entry (typo fix). Gateway-confirmed orders can't be deleted.
router.delete('/paid-users/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found.' });
    if (!order.extra?.manual) {
      return res.status(403).json({ error: 'Only manually added entries can be deleted.' });
    }
    await order.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('admin paid-users delete error', err);
    res.status(500).json({ error: 'Could not delete the entry.' });
  }
});

router.get('/paid-users/export.csv', requireAdmin, async (req, res) => {
  try {
    const rows = await Order.find(paidFilter(req.query)).sort({ paid_at: -1 }).lean();
    const csv = toCsv([
      { key: 'customer_name', label: 'Name' },
      { key: 'customer_email', label: 'Email' },
      { key: 'customer_phone', label: 'Phone' },
      { key: 'program', label: 'Program' },
      { label: 'Batch', get: (r) => r.extra?.batch || '' },
      { key: 'amount', label: 'Amount' },
      { key: 'order_id', label: 'Order ID' },
      { label: 'Transaction ID', get: (r) => r.extra?.cf_payment_id || r.extra?.txn_id || '' },
      { label: 'Paid at', get: (r) => (r.paid_at ? new Date(r.paid_at).toISOString() : '') },
      { label: 'Manual', get: (r) => (r.extra?.manual ? 'yes' : '') },
      { label: 'Verified', get: (r) => (r.extra?.verified ? 'yes' : '') },
      { label: 'Note', get: (r) => r.extra?.note || '' },
    ], rows);
    sendCsv(res, 'menler-paid-users.csv', csv);
  } catch (err) {
    console.error('admin paid-users export error', err);
    res.status(500).json({ error: 'Export failed.' });
  }
});

/* ── Leads ───────────────────────────────────────────────────────────────── */

router.get('/leads', requireAdmin, async (req, res) => {
  try {
    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 25, 1, 100);
    const sort = typeof req.query.sort === 'string' && req.query.sort ? req.query.sort : '-createdAt';
    const filter = leadFilter(req.query);

    const [rows, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({ rows, total, page, limit });
  } catch (err) {
    console.error('admin leads error', err);
    res.status(500).json({ error: 'Could not load leads.' });
  }
});

/* Delete one lead (permanent). */
router.delete('/leads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[a-f\d]{24}$/i.test(id)) return res.status(400).json({ error: 'Invalid lead id.' });
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Lead not found.' });
    res.json({ ok: true });
  } catch (err) {
    console.error('admin lead delete error', err);
    res.status(500).json({ error: 'Could not delete the lead.' });
  }
});

router.get('/leads/export.csv', requireAdmin, async (req, res) => {
  try {
    const filter = leadFilter(req.query);
    const rows = await Lead.find(filter).sort('-createdAt').lean();
    const columns = [
      { key: 'createdAt', label: 'Created' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'program', label: 'Program' },
      { key: 'track', label: 'Track' },
      { key: 'background', label: 'Background' },
      { key: 'message', label: 'Message' },
      { key: 'source', label: 'Source' },
      { key: 'page', label: 'Page' },
      { key: 'utm_source', label: 'UTM Source' },
      { key: 'utm_medium', label: 'UTM Medium' },
      { key: 'utm_campaign', label: 'UTM Campaign' },
      { key: 'utm_content', label: 'UTM Content' },
      { key: 'extra', label: 'Extra', get: (r) => (r.extra && Object.keys(r.extra).length ? r.extra : '') },
      { key: '_id', label: 'ID' },
    ];
    sendCsv(res, `leads-${Date.now()}.csv`, toCsv(columns, rows));
  } catch (err) {
    console.error('admin leads export error', err);
    res.status(500).json({ error: 'Could not export leads.' });
  }
});

/* ── Users (+ joined profile) ────────────────────────────────────────────── */

const USER_SELECT = '-passwordHash -otpCode -otpExpires -resetTokenHash -resetExpires';

async function attachProfiles(users) {
  if (!users.length) return [];
  const ids = users.map((u) => u._id);
  const profiles = await Profile.find({ user: { $in: ids } }).lean();
  const byUser = new Map(profiles.map((p) => [String(p.user), p]));
  return users.map((u) => ({ ...u, profile: byUser.get(String(u._id)) || null }));
}

function userFilter(query) {
  const search = (query.search || '').trim();
  if (!search) return {};
  const rx = new RegExp(esc(search), 'i');
  return { $or: [{ email: rx }, { fullName: rx }, { phone: rx }] };
}

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 25, 1, 100);
    const filter = userFilter(req.query);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(USER_SELECT)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const rows = await attachProfiles(users);
    res.json({ rows, total, page, limit });
  } catch (err) {
    console.error('admin users error', err);
    res.status(500).json({ error: 'Could not load users.' });
  }
});

router.get('/users/export.csv', requireAdmin, async (req, res) => {
  try {
    const filter = userFilter(req.query);
    const users = await User.find(filter).select(USER_SELECT).sort('-createdAt').lean();
    const rows = await attachProfiles(users);
    const p = (r, key) => (r.profile ? r.profile[key] : '');
    const columns = [
      { key: 'createdAt', label: 'Created' },
      { key: 'fullName', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'provider', label: 'Provider' },
      { key: 'emailVerified', label: 'Verified' },
      { key: 'degree', label: 'Degree', get: (r) => p(r, 'degree') },
      { key: 'fieldOfStudy', label: 'Field of Study', get: (r) => p(r, 'fieldOfStudy') },
      { key: 'passoutYear', label: 'Passout Year', get: (r) => p(r, 'passoutYear') },
      { key: 'collegeName', label: 'College', get: (r) => p(r, 'collegeName') },
      { key: 'designation', label: 'Designation', get: (r) => p(r, 'designation') },
      { key: 'companyName', label: 'Company', get: (r) => p(r, 'companyName') },
      { key: 'location', label: 'Location', get: (r) => p(r, 'location') },
      { key: '_id', label: 'ID' },
    ];
    sendCsv(res, `users-${Date.now()}.csv`, toCsv(columns, rows));
  } catch (err) {
    console.error('admin users export error', err);
    res.status(500).json({ error: 'Could not export users.' });
  }
});

/* ── Campaigns (per-campaign Zoom link — admin only) ─────────────────────── */

// List every campaign the CRM might need a link for: those that have produced
// leads (derived from extra.campaign) plus any saved settings. Zoom links live
// only here and are never exposed to the public site.
/* ── Zoom attendance ─────────────────────────────────────────────────────────
 * Who actually turned up to a campaign's session, and for how long, matched
 * against the people who registered for it. Zoom only reports on meetings that
 * have finished, and takes roughly half an hour to settle after one ends. */

router.get('/zoom/instances', requireAdmin, async (req, res) => {
  try {
    if (!zoomConfigured()) return res.status(503).json({ error: 'Zoom is not configured on this server.', notConfigured: true });
    const slug = String(req.query.slug || '').trim();
    const setting = await CampaignSetting.findOne({ slug }).lean();
    const meetingId = meetingIdFromLink(setting?.zoomLink);
    if (!meetingId) {
      return res.status(400).json({ error: 'No Zoom link saved for this campaign — add one first.', needsLink: true });
    }
    res.json({ meetingId, instances: await pastInstances(meetingId) });
  } catch (err) {
    console.error('zoom instances', err.message);
    res.status(502).json({ error: explainZoomError(err) });
  }
});

/* Past Zoom sessions on this account, so a campaign can be pointed at one by
 * picking it rather than by hunting a meeting id in the Zoom portal.
 *
 * When a slug is given, sessions whose Zoom topic resembles the campaign's title
 * are marked — the classes are usually named after the campaign, so the right
 * one can be offered rather than searched for. */
router.get('/zoom/meetings', requireAdmin, async (req, res) => {
  try {
    if (!zoomConfigured()) return res.status(503).json({ error: 'Zoom is not configured on this server.', notConfigured: true });

    const meetings = await pastMeetings({ days: clampInt(req.query.days, 90, 1, 365) });

    const slug = String(req.query.slug || '').trim();
    let suggestedId = '';
    let matchedBy = '';

    /* Only a hint, so only cheap signals.
     *
     * Confirming a match by comparing attendee lists is far more reliable, but
     * it costs one Zoom call per candidate session and the whole page waits on
     * it. That was worth paying when the result was linked automatically; now
     * that a person picks and confirms, it buys a starred row at the price of
     * several seconds' delay on every campaign — a bad trade.
     *
     * Wording and date are free, and a wrong hint costs nothing here: nothing
     * is saved until it's chosen, and a mismatched session is still caught
     * afterwards by comparing who attended against who registered. */
    if (slug && meetings.length) {
      const setting = await CampaignSetting.findOne({ slug }).lean();
      const lead = await Lead.findOne({ 'extra.campaign': slug, 'extra.workshop': { $type: 'string', $ne: '' } })
        .sort('-createdAt').select('extra.workshop createdAt').lean();
      const title = String(setting?.title || lead?.extra?.workshop || slug);

      /* Title similarity alone is not enough here: nearly every campaign is
       * called "Build … with Claude", so shared words match the wrong class as
       * readily as the right one. Filler words are dropped, and the score is
       * weighted by how close the session ran to the campaign's last signup —
       * a class is held within days of its registrations, which separates two
       * similarly-named campaigns that title matching cannot. */
      const STOP = new Set(['with', 'your', 'yours', 'from', 'this', 'that', 'into', 'menler',
        'live', 'session', 'workshop', 'masterclass', 'class', 'free', 'online', 'zoom', 'meeting']);
      const words = (s) => new Set((String(s).toLowerCase().match(/[a-z0-9]{4,}/g) || []).filter((w) => !STOP.has(w)));

      /* Weight each word by how rare it is across the account's own topics.
       *
       * Counting words equally matched "Build Your WebApp with Claude" to
       * "Build Claude Skills and Schedules": two of three words agreed, which
       * cleared the bar, even though the only word that distinguishes the class
       * — webapp — was absent. Nearly every session here is "Build … Claude",
       * so those words carry almost no information and rarer ones carry nearly
       * all of it. */
      const df = new Map();
      for (const m of meetings) for (const w of words(m.topic)) df.set(w, (df.get(w) || 0) + 1);
      const weight = (w) => Math.log((meetings.length + 1) / ((df.get(w) || 0) + 1)) + 0.1;

      const want = [...words(title)];
      const wantWeight = want.reduce((n, w) => n + weight(w), 0);
      const anchor = lead?.createdAt || setting?.updatedAt || null;

      let best = 0;
      for (const m of meetings) {
        const got = words(m.topic);
        const matched = want.filter((w) => got.has(w));
        const text = wantWeight ? matched.reduce((n, w) => n + weight(w), 0) / wantWeight : 0;
        if (text < 0.6) continue;                       // too weak to be a match at all

        // 1.0 for a same-day session, tailing off across a fortnight.
        const days = anchor && m.startTime
          ? Math.abs(new Date(m.startTime) - new Date(anchor)) / 864e5
          : 7;
        const recency = Math.max(0, 1 - days / 14);

        const score = text * 0.85 + recency * 0.15;     // wording decides; date only breaks ties
        if (score > best) { best = score; suggestedId = m.id; }
      }
      if (best < 0.7) suggestedId = '';                 // offer nothing rather than the wrong class
      else matchedBy = 'name';
    }

    res.json({ meetings, suggestedId, matchedBy });
  } catch (err) {
    console.error('zoom meetings', err.message);
    res.status(502).json({ error: explainZoomError(err) });
  }
});

router.get('/zoom/attendance', requireAdmin, async (req, res) => {
  try {
    if (!zoomConfigured()) return res.status(503).json({ error: 'Zoom is not configured on this server.', notConfigured: true });

    const slug = String(req.query.slug || '').trim();
    let uuid = String(req.query.uuid || '').trim();

    if (!uuid) {
      const setting = await CampaignSetting.findOne({ slug }).lean();

      // A pinned occurrence wins. Resolving a meeting id instead gives the most
      // recent run of that room, and these rooms get reused for rehearsals —
      // the class with 262 people and the two-minute sound check share an id,
      // so "most recent" can quietly report the sound check.
      if (setting?.zoomUuid) {
        uuid = setting.zoomUuid;
      } else {
        const meetingId = meetingIdFromLink(setting?.zoomLink);
        if (!meetingId) return res.status(400).json({ error: 'No Zoom session linked to this campaign yet.', needsLink: true });
        const list = await pastInstances(meetingId);
        uuid = list[0]?.uuid || await latestInstanceUuid(meetingId);
        if (!uuid) return res.status(404).json({ error: 'Zoom has no finished sessions for this meeting yet.' });
      }
    }

    const [meeting, attended] = await Promise.all([
      pastMeeting(uuid).catch(() => null),
      meetingParticipants(uuid),
    ]);

    // Match on email, which is the only field both sides reliably share — Zoom
    // display names are whatever somebody typed into their client.
    const leads = await Lead.find({ 'extra.campaign': slug }).select('name email phone createdAt extra').lean();
    const byEmail = new Map();
    for (const l of leads) {
      const e = String(l.email || '').trim().toLowerCase();
      if (e && !byEmail.has(e)) byEmail.set(e, l);
    }

    const seen = new Set();
    const rows = attended.map((p) => {
      const lead = p.email ? byEmail.get(p.email) : null;
      if (lead) seen.add(String(lead.email).toLowerCase());
      return {
        name: lead?.name || p.name,
        email: p.email || lead?.email || '',
        phone: lead?.phone || '',
        joinedAt: p.joinedAt,
        leftAt: p.leftAt,
        minutes: p.minutes,
        sessions: p.sessions,
        registered: Boolean(lead),
        attended: true,
      };
    });

    // Registrants Zoom never saw. Worth as much as the attendance itself — this
    // is the list to follow up, and the one to think twice about certifying.
    const noShows = leads
      .filter((l) => !seen.has(String(l.email || '').trim().toLowerCase()))
      .map((l) => ({
        name: l.name, email: l.email, phone: l.phone || '',
        joinedAt: null, leftAt: null, minutes: 0, sessions: 0,
        registered: true, attended: false,
      }));

    const totalMinutes = rows.reduce((n, r) => n + r.minutes, 0);
    res.json({
      uuid,
      meeting: meeting ? {
        topic: meeting.topic, startTime: meeting.start_time, endTime: meeting.end_time,
        durationMinutes: meeting.duration, zoomTotal: meeting.participants_count,
      } : null,
      rows: [...rows, ...noShows],
      summary: {
        attended: rows.length,
        registered: leads.length,
        noShows: noShows.length,
        walkIns: rows.filter((r) => !r.registered).length,
        avgMinutes: rows.length ? Math.round(totalMinutes / rows.length) : 0,
      },
    });
  } catch (err) {
    console.error('zoom attendance', err.message);
    res.status(502).json({ error: explainZoomError(err) });
  }
});

router.get('/campaigns', requireAdmin, async (_req, res) => {
  try {
    const [fromLeads, saved] = await Promise.all([
      Lead.aggregate([
        { $match: { 'extra.campaign': { $type: 'string', $ne: '' } } },
        {
          $group: {
            _id: '$extra.campaign',
            leads: { $sum: 1 },
            title: { $last: '$extra.workshop' },
            lastLeadAt: { $max: '$createdAt' },
          },
        },
      ]),
      CampaignSetting.find({}).lean(),
    ]);

    const map = new Map();
    for (const c of fromLeads) {
      map.set(c._id, { slug: c._id, title: c.title || '', zoomLink: '', leads: c.leads, lastLeadAt: c.lastLeadAt || null });
    }
    for (const s of saved) {
      const prev = map.get(s.slug) || { slug: s.slug, title: '', zoomLink: '', leads: 0, lastLeadAt: null };
      map.set(s.slug, { ...prev, title: s.title || prev.title, zoomLink: s.zoomLink || '' });
    }

    const rows = [...map.values()].sort((a, b) => {
      const ta = a.lastLeadAt ? +new Date(a.lastLeadAt) : 0;
      const tb = b.lastLeadAt ? +new Date(b.lastLeadAt) : 0;
      return tb - ta || a.slug.localeCompare(b.slug);
    });
    res.json({ rows });
  } catch (err) {
    console.error('admin campaigns error', err);
    res.status(500).json({ error: 'Could not load campaigns.' });
  }
});

// Upsert a campaign's Zoom link (and optional title). Creates the setting row
// even if the campaign has no leads yet, so the CRM can pre-set the link.
router.put('/campaigns/:slug', requireAdmin, async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) return res.status(400).json({ error: 'A campaign slug is required.' });

    const { zoomLink = '', zoomUuid, title } = req.body || {};
    const link = String(zoomLink).trim();
    // A bare meeting id is what Zoom actually prints in Meetings → Previous, so
    // accept it as readily as a join link — requiring a URL meant the value most
    // people have to hand was refused.
    if (link && !/^https?:\/\//i.test(link) && !meetingIdFromLink(link)) {
      return res.status(400).json({ error: 'Paste a Zoom join link, or the meeting ID (e.g. 823 5894 9022).' });
    }

    const update = { zoomLink: link };
    if (typeof title === 'string') update.title = title.trim();
    // Pin the exact occurrence when one was chosen. A meeting id alone resolves
    // to "most recent occurrence", which on a room used for rehearsals lands on
    // a one-person test run rather than the class.
    if (typeof zoomUuid === 'string') update.zoomUuid = zoomUuid.trim();

    const doc = await CampaignSetting.findOneAndUpdate(
      { slug },
      { $set: update, $setOnInsert: { slug } },
      { new: true, upsert: true },
    ).lean();

    res.json({ ok: true, campaign: { slug: doc.slug, title: doc.title || '', zoomLink: doc.zoomLink || '', zoomUuid: doc.zoomUuid || '' } });
  } catch (err) {
    console.error('admin campaign save error', err);
    res.status(500).json({ error: 'Could not save the campaign.' });
  }
});

/* ── Short links (branded URL shortener — admin only) ────────────────────── */

// Unambiguous alphabet (no 0/O/1/l/i) for auto-generated codes.
const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
function genCode(len = 5) {
  let s = '';
  for (let i = 0; i < len; i++) s += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  return s;
}

router.get('/shortlinks', requireAdmin, async (_req, res) => {
  try {
    const rows = await ShortLink.find({}).sort('-createdAt').lean();
    res.json({ rows });
  } catch (err) {
    console.error('admin shortlinks error', err);
    res.status(500).json({ error: 'Could not load short links.' });
  }
});

// Create a short link. Body: { target, code?, label? }. If no code is given,
// a unique random one is generated.
router.post('/shortlinks', requireAdmin, async (req, res) => {
  try {
    const target = String(req.body?.target || '').trim();
    if (!/^https?:\/\//i.test(target)) {
      return res.status(400).json({ error: 'Target must start with http:// or https://' });
    }
    const label = String(req.body?.label || '').trim();
    let code = String(req.body?.code || '').trim();

    if (code) {
      if (!/^[A-Za-z0-9_-]{1,40}$/.test(code)) {
        return res.status(400).json({ error: 'Code can only contain letters, numbers, - and _' });
      }
      if (await ShortLink.findOne({ code })) {
        return res.status(409).json({ error: 'That code is already taken.' });
      }
    } else {
      for (let i = 0; i < 8 && !code; i++) {
        const c = genCode(5);
        if (!(await ShortLink.findOne({ code: c }))) code = c;
      }
      if (!code) return res.status(500).json({ error: 'Could not generate a code — please try again.' });
    }

    const doc = await ShortLink.create({ code, target, label });
    res.status(201).json({ ok: true, link: { code: doc.code, target: doc.target, label: doc.label, clicks: doc.clicks } });
  } catch (err) {
    console.error('admin shortlink create error', err);
    res.status(500).json({ error: 'Could not create the short link.' });
  }
});

// Re-point (or relabel) an existing short link without changing its code.
router.put('/shortlinks/:code', requireAdmin, async (req, res) => {
  try {
    const code = String(req.params.code || '').trim();
    const update = {};
    if (typeof req.body?.target === 'string') {
      const t = req.body.target.trim();
      if (!/^https?:\/\//i.test(t)) {
        return res.status(400).json({ error: 'Target must start with http:// or https://' });
      }
      update.target = t;
    }
    if (typeof req.body?.label === 'string') update.label = req.body.label.trim();

    const doc = await ShortLink.findOneAndUpdate({ code }, { $set: update }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Short link not found.' });
    res.json({ ok: true });
  } catch (err) {
    console.error('admin shortlink update error', err);
    res.status(500).json({ error: 'Could not update the short link.' });
  }
});

router.delete('/shortlinks/:code', requireAdmin, async (req, res) => {
  try {
    await ShortLink.deleteOne({ code: String(req.params.code || '').trim() });
    res.json({ ok: true });
  } catch (err) {
    console.error('admin shortlink delete error', err);
    res.status(500).json({ error: 'Could not delete the short link.' });
  }
});

/* ──────────────────────────  Participation certificates  ──────────────────────── */

const MAX_RECIPIENTS = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Filename-safe slug of a participant name, e.g. "Aarav Sharma" → "Aarav-Sharma" */
const slugName = (name) =>
  String(name).trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60) || 'participant';

/**
 * Forward the signature fields the request actually carries.
 *
 * A field that is present but empty is forwarded as an empty string, not
 * dropped: the PDF builder skips a signature with no name, so an empty value is
 * how you get a certificate with one signature instead of two. Dropping it
 * meant the built-in default reappeared, and clearing the left name in the
 * panel did nothing — the old mentor kept signing sessions he never ran.
 *
 * A field that is absent entirely still falls through to the built-in default.
 */
const signatories = (body = {}) =>
  ['mentorName', 'mentorRole', 'founderName', 'founderRole'].reduce((acc, k) => {
    if (body[k] === undefined) return acc;
    acc[k] = String(body[k] ?? '').trim();
    return acc;
  }, {});

// Checks whether the mail server is configured and reachable, without sending
// anything — lets an admin diagnose "stuck sending" from the panel itself.
router.get('/certificates/mail-status', requireAdmin, async (_req, res) => {
  if (!isMailConfigured()) {
    return res.json({ ok: false, configured: false, error: 'No email transport is configured on the server (Gmail API or SMTP).' });
  }
  const conn = await verifyMailer();
  res.json({ ok: conn.ok, configured: true, mode: conn.mode, error: conn.error || null });
});

// Render a single sample certificate so the design can be checked before any send.
router.post('/certificates/preview', requireAdmin, async (req, res) => {
  try {
    const { name, programName } = req.body || {};
    if (!name || !programName) {
      return res.status(400).json({ error: 'A name and program name are required.' });
    }
    const { buffer } = await buildCertificatePdf({
      name: String(name).trim(),
      programName: String(programName).trim(),
      ...signatories(req.body),
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate-preview.pdf"');
    res.send(buffer);
  } catch (err) {
    console.error('[admin] certificate preview failed:', err);
    res.status(500).json({ error: 'Could not generate the preview.' });
  }
});

// Renders the covering email (with the admin's custom heading/message) so it
// can be checked before sending.
router.post('/certificates/email-preview', requireAdmin, (req, res) => {
  const { name, programName, emailHeading, emailMessage, emailClosing, feedbackUrl, deckUrl } = req.body || {};
  const { html } = buildCertificateEmail({
    name: String(name || '').trim() || 'Your Name',
    programName: String(programName || '').trim() || 'the program',
    certId: 'MNLR-PREVIEW',
    heading: String(emailHeading || '').trim() || undefined,
    message: String(emailMessage || '').trim() || undefined,
    closing: typeof emailClosing === 'string' ? emailClosing : undefined,
    feedbackUrl: String(feedbackUrl || '').trim() || undefined,
    deckUrl: String(deckUrl || '').trim() || undefined,
  });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Generate a certificate per recipient and email it as a PDF attachment.
router.post('/certificates/send', requireAdmin, async (req, res) => {
  try {
    const { recipients, programName, subject, emailHeading, emailMessage, emailClosing, feedbackUrl, deckUrl } = req.body || {};

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients were provided.' });
    }
    if (recipients.length > MAX_RECIPIENTS) {
      return res.status(400).json({ error: `Too many recipients — the limit is ${MAX_RECIPIENTS} per batch.` });
    }
    if (!programName || !String(programName).trim()) {
      return res.status(400).json({ error: 'A program name is required.' });
    }
    if (!isMailConfigured()) {
      return res.status(503).json({ error: 'Email is not configured on this server, so nothing was sent.' });
    }

    // Confirm the transport actually works before generating and looping —
    // otherwise a bad key/connection would fail on every recipient.
    const conn = await verifyMailer();
    if (!conn.ok) {
      return res.status(502).json({ error: `Couldn't connect to the email service, so nothing was sent. ${conn.error}` });
    }

    const program = String(programName).trim();
    const signs = signatories(req.body);
    const results = [];

    for (const raw of recipients) {
      const name = String(raw?.name || '').trim();
      const email = String(raw?.email || '').trim().toLowerCase();

      if (!name || !EMAIL_RE.test(email)) {
        results.push({ name, email, ok: false, error: 'Missing or invalid name/email' });
        continue;
      }

      try {
        const { buffer, certId } = await buildCertificatePdf({
          name,
          programName: program,
          ...signs,
        });
        const { text, html } = buildCertificateEmail({
          name,
          programName: program,
          certId,
          heading: String(emailHeading || '').trim() || undefined,
          message: String(emailMessage || '').trim() || undefined,
          closing: typeof emailClosing === 'string' ? emailClosing : undefined,
          feedbackUrl: String(feedbackUrl || '').trim() || undefined,
          deckUrl: String(deckUrl || '').trim() || undefined,
        });

        await sendMail({
          to: email,
          subject: String(subject || '').trim() || `Your certificate from Menler — ${program}`,
          text,
          html,
          attachments: [{
            filename: `Menler-Certificate-${slugName(name)}.pdf`,
            content: buffer,
            contentType: 'application/pdf',
          }],
        });

        results.push({ name, email, ok: true, certId });
      } catch (err) {
        // Surface the provider's actual reason (e.g. Resend "domain not
        // verified" / "can only send to your own address") so it can be fixed.
        const reason = (err?.message || 'Send failed').replace(/\s+/g, ' ').trim().slice(0, 200);
        console.error(`[admin] certificate send failed for ${email}:`, reason);
        results.push({ name, email, ok: false, error: reason });
      }
    }

    const sent = results.filter((r) => r.ok).length;
    res.json({ sent, failed: results.length - sent, results });
  } catch (err) {
    console.error('[admin] certificate batch failed:', err);
    res.status(500).json({ error: 'Could not send the certificates.' });
  }
});

export default router;
