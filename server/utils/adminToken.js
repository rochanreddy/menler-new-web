import jwt from 'jsonwebtoken';

// The admin panel uses its own session, fully separate from user accounts.
const ADMIN_SECRET =
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const ADMIN_MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours

export const ADMIN_COOKIE_NAME = 'meridian_admin';

export function signAdmin() {
  return jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '12h' });
}

export function verifyAdmin(token) {
  try {
    return jwt.verify(token, ADMIN_SECRET);
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  // Cross-domain in production (frontend and API on different hosts) needs
  // SameSite=None + Secure; locally we keep Lax/non-secure for http://localhost.
  // Detect cross-site from NODE_ENV OR an https FRONTEND_URL, so it works even
  // when the host (e.g. Render) doesn't set NODE_ENV=production.
  const crossSite =
    process.env.NODE_ENV === 'production' ||
    (process.env.FRONTEND_URL || '').startsWith('https://');
  return {
    httpOnly: true,
    sameSite: crossSite ? 'none' : 'lax',
    secure: crossSite,
    maxAge: ADMIN_MAX_AGE_MS,
    path: '/',
  };
}
