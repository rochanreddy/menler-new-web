import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { User } from '../models/User.js';
import { sendMail } from '../utils/email.js';
import { getCurrentUser } from '../middleware/auth.js';
import {
  SESSION_COOKIE_NAME,
  signSession,
  sessionCookieOptions,
} from '../utils/token.js';

const router = Router();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const OTP_TTL_MS = 1000 * 60 * 10; // 10 minutes
const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setSessionCookie(res, userId) {
  res.cookie(SESSION_COOKIE_NAME, signSession(userId), sessionCookieOptions());
}

async function issueVerificationOtp(user) {
  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
  await user.save();
  await sendMail({
    to: user.email,
    subject: 'Your Meridian verification code',
    text: `Welcome to Meridian!\n\nYour verification code is: ${otp}\n\nIt expires in 10 minutes.`,
  });
}

/* ── Sign up ─────────────────────────────────────────────────────────────── */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name = '', phone = '' } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    if (String(password).length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.emailVerified) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user =
      existing ||
      new User({ email: normalizedEmail, provider: 'email' });
    user.passwordHash = passwordHash;
    user.fullName = full_name;
    user.phone = phone;
    await user.save();

    await issueVerificationOtp(user);

    // No session yet — the client routes to /verify-email (matches prior flow).
    res.status(201).json({ requiresVerification: true });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'Could not create account. Please try again.' });
  }
});

/* ── Verify email OTP ────────────────────────────────────────────────────── */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, token } = req.body || {};
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
    if (!user || !user.otpCode || !user.otpExpires) {
      res.status(400).json({ error: 'Invalid or expired verification code.' });
      return;
    }
    if (user.otpExpires.getTime() < Date.now()) {
      res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      return;
    }
    if (String(token).trim() !== user.otpCode) {
      res.status(400).json({ error: 'Invalid verification code.' });
      return;
    }

    user.emailVerified = true;
    user.otpCode = '';
    user.otpExpires = null;
    await user.save();

    setSessionCookie(res, user._id.toString());
    res.json({ user: user.toPublic() });
  } catch (err) {
    console.error('verify-otp error', err);
    res.status(500).json({ error: 'Could not verify code. Please try again.' });
  }
});

/* ── Resend verification OTP ─────────────────────────────────────────────── */
router.post('/resend', async (req, res) => {
  try {
    const user = await User.findOne({ email: String(req.body?.email || '').toLowerCase().trim() });
    // Always 200 — don't reveal whether the account exists.
    if (user && !user.emailVerified) {
      await issueVerificationOtp(user);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('resend error', err);
    res.status(500).json({ error: 'Could not resend code. Please try again.' });
  }
});

/* ── Log in ──────────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
    if (!user || !user.passwordHash) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }
    const ok = await bcrypt.compare(String(password || ''), user.passwordHash);
    if (!ok) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }
    if (!user.emailVerified) {
      res.status(403).json({ error: 'Please verify your email before logging in.', requiresVerification: true });
      return;
    }

    setSessionCookie(res, user._id.toString());
    res.json({ user: user.toPublic() });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Could not log in. Please try again.' });
  }
});

/* ── Current session ─────────────────────────────────────────────────────── */
router.get('/session', async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true, user: user.toPublic() });
});

/* ── Log out ─────────────────────────────────────────────────────────────── */
router.post('/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

/* ── Forgot password → email a reset link ────────────────────────────────── */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, redirectTo } = req.body || {};
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetTokenHash = hashToken(rawToken);
      user.resetExpires = new Date(Date.now() + RESET_TTL_MS);
      await user.save();

      const base = redirectTo || `${frontendUrl}/reset-password`;
      const link = `${base}?token=${rawToken}`;
      await sendMail({
        to: user.email,
        subject: 'Reset your Meridian password',
        text: `We received a request to reset your password.\n\nReset it here (expires in 1 hour):\n${link}\n\nIf you didn't request this, you can ignore this email.`,
      });
    }
    // Always 200 — don't reveal whether the account exists.
    res.json({ ok: true });
  } catch (err) {
    console.error('forgot-password error', err);
    res.status(500).json({ error: 'Could not send reset link. Please try again.' });
  }
});

/* ── Reset password using the emailed token ──────────────────────────────── */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token) {
      res.status(400).json({ error: 'Missing or invalid reset token.' });
      return;
    }
    if (String(password || '').length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const user = await User.findOne({
      resetTokenHash: hashToken(String(token)),
      resetExpires: { $gt: new Date() },
    });
    if (!user) {
      res.status(400).json({ error: 'Reset link is invalid or has expired.' });
      return;
    }

    user.passwordHash = await bcrypt.hash(String(password), 10);
    user.resetTokenHash = '';
    user.resetExpires = null;
    user.emailVerified = true; // proving inbox access also verifies the email
    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error('reset-password error', err);
    res.status(500).json({ error: 'Could not reset password. Please try again.' });
  }
});

export default router;
