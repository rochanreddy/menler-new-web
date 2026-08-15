import { ADMIN_COOKIE_NAME, verifyAdmin } from '../utils/adminToken.js';
import { BLOG_COOKIE_NAME, verifyBlogEditor } from '../utils/blogToken.js';

/* Who is asking, for the blog endpoints only.
 *
 * Two identities can reach them: the full admin (already signed in to the admin
 * panel) and the blog-portal editor. Everything else on the API keeps using
 * requireAdmin, which only ever accepts the admin cookie — so a blog-portal
 * session cannot reach leads, payments, users, or anything else by guessing a
 * URL. That's enforced here, on the server, not by hiding navigation. */
export function blogActor(req) {
  const admin = verifyAdmin(req.cookies?.[ADMIN_COOKIE_NAME] || '');
  if (admin?.role === 'admin') return 'admin';
  if (verifyBlogEditor(req.cookies?.[BLOG_COOKIE_NAME] || '')) return 'blog';
  return null;
}

/* The portal's own front door — the blog cookie and nothing else.
 *
 * An admin session deliberately does NOT open it. The admin already has the
 * Blog tab; letting their cookie through here only meant nobody could see what
 * an outsider actually sees without opening a private window, which is exactly
 * the check worth being able to make. */
export function requireBlogPortal(req, res, next) {
  if (!verifyBlogEditor(req.cookies?.[BLOG_COOKIE_NAME] || '')) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  req.blogActor = 'blog';
  next();
}

/** Read + write blog content: the admin, or a signed-in blog-portal editor. */
export function requireBlogAccess(req, res, next) {
  const actor = blogActor(req);
  if (!actor) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  req.blogActor = actor;
  next();
}

/* Publishing to the live site and deleting posts stay with the admin.
 *
 * The blog portal exists so someone outside the team can write, edit and share
 * a preview; neither of those needs the power to put a page in front of the
 * public or to destroy one. Least access that still gets the job done. */
export function requireBlogAdmin(req, res, next) {
  const actor = blogActor(req);
  if (actor !== 'admin') {
    res.status(actor ? 403 : 401).json({
      error: actor
        ? 'Your login can write and edit posts, but publishing and deleting are admin-only. Share the preview link instead.'
        : 'Not authenticated.',
    });
    return;
  }
  req.blogActor = actor;
  next();
}
