import { Router } from 'express';
import crypto from 'crypto';

import { Report } from '../models/Report.js';

const router = Router();

const FRONTEND_BASE = () =>
  (process.env.FRONTEND_URL || 'https://menler.in').split(',')[0].trim().replace(/\/+$/, '');

// Create a shareable aptitude report → returns its id + public URL.
router.post('/', async (req, res) => {
  try {
    const b = req.body || {};
    const rid = crypto.randomBytes(6).toString('base64url'); // ~8 url-safe chars
    await Report.create({
      rid,
      name: String(b.name || '').slice(0, 120),
      cluster: String(b.cluster || '').slice(0, 80),
      setIdx: Number(b.setIdx) || 0,
      score: Number(b.score) || 0,
      maxScore: Number(b.maxScore) || 0,
      dims: Array.isArray(b.dims)
        ? b.dims.slice(0, 20).map((d) => ({ label: String(d.label || '').slice(0, 60), pct: Number(d.pct) || 0 }))
        : [],
    });
    res.status(201).json({ id: rid, url: `${FRONTEND_BASE()}/report/${rid}` });
  } catch (err) {
    console.error('report create error', err);
    res.status(500).json({ error: 'Could not create the report.' });
  }
});

// Fetch a report for the read-only /report/:id page.
router.get('/:id', async (req, res) => {
  try {
    const r = await Report.findOne({ rid: req.params.id }).lean();
    if (!r) return res.status(404).json({ error: 'Report not found.' });
    res.json({
      name: r.name, cluster: r.cluster, setIdx: r.setIdx,
      score: r.score, maxScore: r.maxScore, dims: r.dims, createdAt: r.createdAt,
    });
  } catch (err) {
    console.error('report fetch error', err);
    res.status(500).json({ error: 'Could not load the report.' });
  }
});

export default router;
