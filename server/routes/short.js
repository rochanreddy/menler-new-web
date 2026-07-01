import { Router } from 'express';

import { ShortLink } from '../models/ShortLink.js';

const router = Router();

// Public redirect: GET /l/:code → 302 to the stored long URL.
// 302 (temporary) so the target can be re-pointed later and browsers won't
// cache it permanently. Clicks are counted best-effort (never block the redirect).
router.get('/:code', async (req, res) => {
  try {
    const code = String(req.params.code || '').trim();
    if (!code) return res.status(404).send('Link not found');

    const link = await ShortLink.findOne({ code });
    if (!link || !link.target) return res.status(404).send('Link not found');

    ShortLink.updateOne({ _id: link._id }, { $inc: { clicks: 1 } }).catch(() => {});
    return res.redirect(302, link.target);
  } catch (err) {
    console.error('short redirect error', err);
    return res.status(500).send('Something went wrong');
  }
});

export default router;
