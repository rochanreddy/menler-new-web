import jwt from 'jsonwebtoken';

/* The blog portal's session — deliberately its own everything.
 *
 * Its own credentials (BLOG_PORTAL_USERNAME / BLOG_PORTAL_PASSWORD), its own
 * cookie, and its own signing secret, so this login can be handed to someone
 * outside the team and later changed or revoked without touching the main
 * admin account — and so a blog-portal cookie can never be mistaken for an
 * admin one, whichever way the roles are read. */
const BLOG_SECRET =
  process.env.BLOG_JWT_SECRET
  || `${process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'dev-insecure-secret-change-me'}:blog-portal`;

const BLOG_MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours, same as the admin panel

export const BLOG_COOKIE_NAME = 'meridian_blog';

export function signBlogEditor() {
  return jwt.sign({ role: 'blog' }, BLOG_SECRET, { expiresIn: '12h' });
}

export function verifyBlogEditor(token) {
  try {
    const payload = jwt.verify(token, BLOG_SECRET);
    // Belt and braces: the secret already differs from the admin one, but never
    // accept anything that isn't explicitly the blog role.
    return payload?.role === 'blog' ? payload : null;
  } catch {
    return null;
  }
}

export function blogCookieOptions() {
  // Matches adminCookieOptions — cross-site (SameSite=None + Secure) in
  // production where the API and the site sit on different hosts.
  const crossSite =
    process.env.NODE_ENV === 'production'
    || (process.env.FRONTEND_URL || '').startsWith('https://');
  return {
    httpOnly: true,
    sameSite: crossSite ? 'none' : 'lax',
    secure: crossSite,
    maxAge: BLOG_MAX_AGE_MS,
    path: '/',
  };
}
