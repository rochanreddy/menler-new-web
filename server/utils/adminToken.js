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
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_MAX_AGE_MS,
    path: '/',
  };
}
