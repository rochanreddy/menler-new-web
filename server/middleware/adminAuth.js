import { ADMIN_COOKIE_NAME, verifyAdmin } from '../utils/adminToken.js';

/** Express guard — 401s unless a valid admin session cookie is present. */
export function requireAdmin(req, res, next) {
  const token = req.cookies[ADMIN_COOKIE_NAME];
  const payload = token ? verifyAdmin(token) : null;
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  next();
}
