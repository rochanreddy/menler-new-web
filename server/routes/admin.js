import { Router } from 'express';
import crypto from 'crypto';

import { Lead } from '../models/Lead.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { CampaignSetting } from '../models/CampaignSetting.js';
import { requireAdmin } from '../middleware/adminAuth.js';
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

router.get('/stats', requireAdmin, async (_req, res) => {
  try {
    const now = Date.now();
    const since7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const since30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const since14 = new Date(now - 13 * 24 * 60 * 60 * 1000);
    since14.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      leads7,
      leads30,
      totalUsers,
      verifiedUsers,
      totalProfiles,
      byProgram,
      bySource,
      byDayRaw,
      recentLeads,
    ] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ createdAt: { $gte: since7 } }),
      Lead.countDocuments({ createdAt: { $gte: since30 } }),
      User.countDocuments({}),
      User.countDocuments({ emailVerified: true }),
      Profile.countDocuments({}),
      Lead.aggregate([
        { $group: { _id: { $ifNull: ['$program', ''] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate([
        { $group: { _id: { $ifNull: ['$source', ''] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate([
        { $match: { createdAt: { $gte: since14 } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
      ]),
      Lead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Fill the 14-day series so every day has a bar (zero when no leads).
    const dayMap = new Map(byDayRaw.map((d) => [d._id, d.count]));
    const byDay = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(since14.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      byDay.push({ date: key, count: dayMap.get(key) || 0 });
    }

    const tidy = (arr) =>
      arr.map((x) => ({ label: x._id || '—', count: x.count }));

    res.json({
      totals: {
        leads: totalLeads,
        leads7,
        leads30,
        users: totalUsers,
        verifiedUsers,
        profiles: totalProfiles,
      },
      byProgram: tidy(byProgram),
      bySource: tidy(bySource),
      byDay,
      recentLeads,
    });
  } catch (err) {
    console.error('admin stats error', err);
    res.status(500).json({ error: 'Could not load stats.' });
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

    const { zoomLink = '', title } = req.body || {};
    const link = String(zoomLink).trim();
    if (link && !/^https?:\/\//i.test(link)) {
      return res.status(400).json({ error: 'Zoom link must start with http:// or https://' });
    }

    const update = { zoomLink: link };
    if (typeof title === 'string') update.title = title.trim();

    const doc = await CampaignSetting.findOneAndUpdate(
      { slug },
      { $set: update, $setOnInsert: { slug } },
      { new: true, upsert: true },
    ).lean();

    res.json({ ok: true, campaign: { slug: doc.slug, title: doc.title || '', zoomLink: doc.zoomLink || '' } });
  } catch (err) {
    console.error('admin campaign save error', err);
    res.status(500).json({ error: 'Could not save the campaign.' });
  }
});

export default router;
