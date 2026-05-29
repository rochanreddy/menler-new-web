import { Router } from 'express';

import { Profile } from '../models/Profile.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/* ── Read the current user's profile ─────────────────────────────────────── */
router.get('/', requireAuth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ profile: profile ? profile.toClient() : null });
});

/* ── Create / update the current user's profile ──────────────────────────── */
router.put('/', requireAuth, async (req, res) => {
  try {
    const b = req.body || {};
    const update = {
      fullName: b.full_name ?? '',
      contact: b.contact ?? '',
      degree: b.degree ?? '',
      fieldOfStudy: b.field_of_study ?? '',
      passoutYear: b.passout_year ?? '',
      collegeName: b.college_name ?? '',
      currentlyStudying: Boolean(b.currently_studying),
      designation: b.designation ?? '',
      companyName: b.company_name ?? '',
      location: b.location ?? '',
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Keep the user's display name in sync with their profile.
    if (update.fullName && req.user.fullName !== update.fullName) {
      req.user.fullName = update.fullName;
      await req.user.save();
    }

    res.json({ profile: profile.toClient() });
  } catch (err) {
    console.error('profile update error', err);
    res.status(500).json({ error: 'Could not save profile. Please try again.' });
  }
});

export default router;
