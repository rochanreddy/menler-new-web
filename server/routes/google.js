import { Router } from 'express';
import crypto from 'crypto';

import { User } from '../models/User.js';
import { signSession, sessionCookieOptions, SESSION_COOKIE_NAME } from '../utils/token.js';

const router = Router();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const port = Number(process.env.PORT || 4000);
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI || `http://localhost:${port}/auth/google/callback`;

const STATE_COOKIE_NAME = 'meridian_oauth_state';

/* ── Begin Google OAuth ──────────────────────────────────────────────────── */
router.get('/start', (req, res) => {
  if (!googleClientId || !googleClientSecret) {
    res.status(500).json({ error: 'Google OAuth is not configured on the server.' });
    return;
  }

  const state = crypto.randomBytes(16).toString('hex');
  res.cookie(STATE_COOKIE_NAME, state, { ...sessionCookieOptions(), maxAge: 1000 * 60 * 10 });

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleRedirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

/* ── OAuth callback → upsert user + set session ──────────────────────────── */
router.get('/callback', async (req, res) => {
  const failRedirect = `${frontendUrl}/register?tab=login`;
  try {
    const { code, state } = req.query;
    const expectedState = req.cookies[STATE_COOKIE_NAME];
    if (!code || !state || !expectedState || state !== expectedState) {
      res.redirect(failRedirect);
      return;
    }

    const tokenParams = new URLSearchParams({
      code: String(code),
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });
    if (!tokenResponse.ok) {
      res.redirect(failRedirect);
      return;
    }

    const tokenData = await tokenResponse.json();
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userInfoResponse.ok) {
      res.redirect(failRedirect);
      return;
    }

    const profile = await userInfoResponse.json();
    const email = String(profile.email || '').toLowerCase().trim();
    if (!email) {
      res.redirect(failRedirect);
      return;
    }

    // Find by Google id or email, otherwise create.
    let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email }] });
    if (!user) {
      user = new User({ email, provider: 'google' });
    }
    user.googleId = profile.sub || user.googleId;
    user.fullName = user.fullName || profile.name || '';
    user.picture = profile.picture || user.picture;
    user.emailVerified = true; // Google has verified the address
    if (!user.provider) user.provider = 'google';
    await user.save();

    res.clearCookie(STATE_COOKIE_NAME, { path: '/' });
    res.cookie(SESSION_COOKIE_NAME, signSession(user._id.toString()), sessionCookieOptions());
    res.redirect(`${frontendUrl}/profile`);
  } catch (err) {
    console.error('google callback error', err);
    res.redirect(failRedirect);
  }
});

export default router;
