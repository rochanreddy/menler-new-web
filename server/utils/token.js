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

export function sessionCookieOptions() {
  // In production the frontend and API live on different domains (e.g. Vercel +
  // Render), so the cookie must be SameSite=None + Secure to be sent cross-site.
  // Locally we keep Lax/non-secure so http://localhost works without HTTPS.
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  };
}
