import { User } from '../models/User.js';
import { SESSION_COOKIE_NAME, verifySession } from '../utils/token.js';

/** Resolves the current user from the session cookie, or null. */
export async function getCurrentUser(req) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload?.sub) return null;
  return User.findById(payload.sub);
}

/** Express guard — 401s when there is no valid session. */
export async function requireAuth(req, res, next) {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  req.user = user;
  next();
}
