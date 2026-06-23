import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const SESSION_COOKIE_NAME = 'meridian_session';

export function signSession(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ── Resource-download magic link (double opt-in for gated PDFs) ──
// Short-lived signed token embedding the lead id + the exact PDF to deliver.
// Because it's signed with JWT_SECRET, the payload can't be tampered with.
export function signResourceToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyResourceToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  // In production the frontend and API live on different domains (e.g. Vercel +
  // Render), so the cookie must be SameSite=None + Secure to be sent cross-site.
  // Locally we keep Lax/non-secure so http://localhost works without HTTPS.
  // Detect cross-site from NODE_ENV OR an https FRONTEND_URL, so it works even
  // when the host (e.g. Render) doesn't set NODE_ENV=production.
  const crossSite =
    process.env.NODE_ENV === 'production' ||
    (process.env.FRONTEND_URL || '').startsWith('https://');
  return {
    httpOnly: true,
    sameSite: crossSite ? 'none' : 'lax',
    secure: crossSite,
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  };
}
