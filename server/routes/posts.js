import { Router } from 'express';
import crypto from 'crypto';

import { Post, slugify, blockWords } from '../models/Post.js';
import { requireBlogAccess, requireBlogAdmin } from '../middleware/blogAuth.js';
import { BLOG_COOKIE_NAME, signBlogEditor, blogCookieOptions } from '../utils/blogToken.js';

const router = Router();

/* Shape a stored post into the contract the site already renders against, so
 * the pages, the prerender script and the JSON-LD all keep working unchanged. */
/* Computed here rather than read off the schema virtual: these queries use
 * .lean() for speed, and plain lean() doesn't run virtuals — which silently
 * shipped `readTime: undefined` to every card until a test caught it. */
function readTimeOf(body = []) {
  const words = body.reduce((n, b) => n + blockWords(b), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/* A URL that's safe to put in an href or a src.
 *
 * Blocks now carry author-supplied links, and an author-supplied link is
 * user input: `javascript:` and friends never reach the page. Absolute
 * http(s), site-relative paths, and mailto: are what a blog actually needs. */
function safeUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (raw.startsWith('//')) return '';                    // protocol-relative
  if (raw.startsWith('/')) return raw;                    // /images/chart.png
  return /^(https?:|mailto:)/i.test(raw) ? raw : '';
}

const str = (v) => String(v ?? '').trim();

/* Keep only the fields the block's own type uses. Anything a writer typed into
 * a field, then switched type away from, is dropped rather than stored — which
 * is also what stops an unused `href` from resurfacing later. */
function cleanBlock(input = {}) {
  const type = String(input.type || 'p');
  switch (type) {
    case 'ul':
      return { type, items: (Array.isArray(input.items) ? input.items : []).map(str) };
    case 'image':
    case 'infographic':
      return {
        type,
        src: safeUrl(input.src),
        alt: str(input.alt),
        caption: str(input.caption),
        ...(type === 'infographic' ? { summary: str(input.summary) } : {}),
      };
    case 'cta':
      return { type, text: str(input.text), buttonLabel: str(input.buttonLabel), href: safeUrl(input.href) };
    case 'resource':
      return { type, text: str(input.text), href: safeUrl(input.href), description: str(input.description) };
    default:
      return { type: ['p', 'h2', 'h3', 'quote'].includes(type) ? type : 'p', text: str(input.text) };
  }
}

const cleanBody = (body) => (Array.isArray(body) ? body.map(cleanBlock) : []);

/* What a block still needs before the post can go live. Enforced here rather
 * than on every keystroke: the editor autosaves as the writer types, so a
 * half-filled image block has to be storable — it just can't be published. */
function blockProblem(b, i) {
  const at = `Block ${i + 1}`;
  if (b.type === 'image' || b.type === 'infographic') {
    const what = b.type === 'infographic' ? 'infographic' : 'image';
    if (!str(b.src)) return `${at}: the ${what} has no image URL.`;
    if (!str(b.alt)) return `${at}: the ${what} needs alt text — it's what a screen reader and Google read.`;
    if (b.type === 'infographic' && !str(b.summary)) {
      return `${at}: the infographic needs a short text summary — words inside a picture can't be read by a screen reader or a crawler.`;
    }
  }
  if (b.type === 'cta') {
    if (!str(b.text)) return `${at}: the call-to-action needs its line of text.`;
    if (!str(b.buttonLabel)) return `${at}: the call-to-action needs a button label.`;
    if (!safeUrl(b.href)) return `${at}: the call-to-action needs a valid button link (https://… or /a-page).`;
  }
  if (b.type === 'resource') {
    if (!str(b.text)) return `${at}: the further-reading link needs a title.`;
    if (!safeUrl(b.href)) return `${at}: the further-reading link needs a valid URL (https://… or /a-page).`;
  }
  return '';
}

/** Blocks that carry no words and no picture — never rendered, never counted. */
const blockHasContent = (b) => (b.type === 'ul'
  ? (b.items || []).some((it) => str(it))
  : b.type === 'image' || b.type === 'infographic'
    ? Boolean(str(b.src))
    : Boolean(blockWords(b)));

function toPublic(p) {
  const iso = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.tag,
    author: p.author,
    datePublished: iso(p.datePublished || p.createdAt),
    dateModified: iso(p.dateModified || p.updatedAt || p.datePublished),
    readTime: readTimeOf(p.body),
    cover: p.cover || null,
    thumb: p.thumb || 'alumni',
    featured: Boolean(p.featured),
    // An empty body means "card only" to the article page — keep it null, not [].
    // Blocks go out re-cleaned, so a block stored before a schema change (or by
    // hand) can't ship a field the renderer doesn't expect.
    body: (p.body || []).length ? p.body.map(cleanBlock) : null,
    seoTitle: p.seoTitle || '',
    seoDescription: p.seoDescription || '',
  };
}

/* ── Public ──────────────────────────────────────────────────────────────── */

// Every published post, newest first. The listing, the article page and the
// build-time prerender all read this one endpoint.
router.get('/', async (_req, res) => {
  try {
    const rows = await Post.find({ status: 'published' })
      .sort({ featured: -1, datePublished: -1, createdAt: -1 })
      .lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    res.json({ posts: rows.map(toPublic) });
  } catch (err) {
    console.error('posts list error', err);
    res.status(500).json({ error: 'Could not load posts.' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const p = await Post.findOne({ slug: String(req.params.slug).toLowerCase(), status: 'published' })
      .lean();
    if (!p) return res.status(404).json({ error: 'Not found.' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    res.json({ post: toPublic(p) });
  } catch (err) {
    console.error('post fetch error', err);
    res.status(500).json({ error: 'Could not load the post.' });
  }
});

/* ── Shareable preview ───────────────────────────────────────────────────── */

/* One post by its preview token, published or not. The token is the whole
 * credential, so it's compared as an exact match on a long random string and
 * the response is never cached or indexed. Regenerating the token in the editor
 * replaces this one, and every link already sent out stops resolving. */
router.get('/preview/:token', async (req, res) => {
  try {
    const token = String(req.params.token || '');
    if (token.length < 20) return res.status(404).json({ error: 'Not found.' });
    const p = await Post.findOne({ previewToken: token }).lean();
    if (!p) return res.status(404).json({ error: 'This preview link is no longer valid.' });
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.json({ post: { ...toPublic(p), status: p.status } });
  } catch (err) {
    console.error('post preview error', err);
    res.status(500).json({ error: 'Could not load the preview.' });
  }
});

/* ── Blog portal session ─────────────────────────────────────────────────── */

/** Constant-time compare that doesn't leak length through an early return. */
function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) {
    crypto.timingSafeEqual(x, x);
    return false;
  }
  return crypto.timingSafeEqual(x, y);
}

router.post('/portal/login', (req, res) => {
  const envUser = process.env.BLOG_PORTAL_USERNAME;
  const envPass = process.env.BLOG_PORTAL_PASSWORD;
  if (!envUser || !envPass) {
    res.status(500).json({ error: 'The blog portal login is not configured.' });
    return;
  }
  const { username = '', password = '' } = req.body || {};
  if (!(safeEqual(username, envUser) && safeEqual(password, envPass))) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }
  res.cookie(BLOG_COOKIE_NAME, signBlogEditor(), blogCookieOptions());
  res.json({ ok: true });
});

router.post('/portal/logout', (_req, res) => {
  res.clearCookie(BLOG_COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

/* Who's signed in, and what they're allowed to do with it. The portal UI reads
 * `canPublish` to decide what to show — the server enforces it either way. */
router.get('/portal/session', requireBlogAccess, (req, res) => {
  res.json({ authenticated: true, actor: req.blogActor, canPublish: req.blogActor === 'admin' });
});

/* ── Admin ───────────────────────────────────────────────────────────────── */

// Drafts included, newest edit first — this is the writer's desk.
router.get('/admin/all', requireBlogAccess, async (req, res) => {
  try {
    const q = String(req.query.search || '').trim();
    const filter = {};
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: rx }, { slug: rx }, { tag: rx }, { excerpt: rx }];
    }
    if (req.query.status) filter.status = req.query.status;
    const raw = await Post.find(filter).sort({ updatedAt: -1 }).lean();
    const rows = raw.map((r) => ({ ...r, readTime: readTimeOf(r.body) }));
    res.json({
      rows,
      counts: {
        all: await Post.countDocuments(),
        published: await Post.countDocuments({ status: 'published' }),
        draft: await Post.countDocuments({ status: 'draft' }),
      },
    });
  } catch (err) {
    console.error('admin posts list error', err);
    res.status(500).json({ error: 'Could not load posts.' });
  }
});

router.get('/admin/one/:id', requireBlogAccess, async (req, res) => {
  const p = await Post.findById(req.params.id).lean();
  if (!p) return res.status(404).json({ error: 'Not found.' });
  res.json({ post: p });
});

/** Make a slug unique by suffixing -2, -3 … rather than rejecting the save. */
async function uniqueSlug(base, ignoreId) {
  const root = slugify(base) || 'post';
  for (let i = 0; i < 50; i++) {
    const candidate = i ? `${root}-${i + 1}` : root;
    const clash = await Post.findOne({ slug: candidate, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) }).lean();
    if (!clash) return candidate;
  }
  return `${root}-${Date.now()}`;
}

router.post('/admin', requireBlogAccess, async (req, res) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim() || 'Untitled post';
    const post = await Post.create({
      title,
      slug: await uniqueSlug(b.slug || title),
      excerpt: String(b.excerpt || '').trim(),
      tag: String(b.tag || '').trim(),
      body: cleanBody(b.body),
      status: 'draft',
    });
    res.status(201).json({ post });
  } catch (err) {
    console.error('admin post create error', err);
    res.status(500).json({ error: 'Could not create the post.' });
  }
});

const EDITABLE = ['title', 'excerpt', 'tag', 'body', 'cover', 'thumb', 'featured',
  'author', 'seoTitle', 'seoDescription'];

router.patch('/admin/:id', requireBlogAccess, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found.' });

    const b = req.body || {};
    for (const k of EDITABLE) if (k in b) post[k] = k === 'body' ? cleanBody(b.body) : b[k];
    if (b.slug !== undefined) post.slug = await uniqueSlug(b.slug, post._id);

    // Only one post can be the listing hero.
    if (b.featured === true) await Post.updateMany({ _id: { $ne: post._id } }, { $set: { featured: false } });

    post.dateModified = new Date();
    await post.save();
    res.json({ post });
  } catch (err) {
    console.error('admin post update error', err);
    res.status(500).json({ error: 'Could not save the post.' });
  }
});

/* Publish / unpublish. Publishing is refused unless the post can actually stand
 * on its own — an empty article that reaches Google is worse than a late one. */
router.post('/admin/:id/status', requireBlogAdmin, async (req, res) => {
  try {
    const status = String(req.body?.status || '');
    if (!['draft', 'published'].includes(status)) return res.status(400).json({ error: 'Unknown status.' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found.' });

    if (status === 'published') {
      const missing = [];
      if (!post.title?.trim() || post.title === 'Untitled post') missing.push('a title');
      if (!post.excerpt?.trim()) missing.push('an excerpt');
      if (!post.tag?.trim()) missing.push('a category');
      if (!(post.body || []).some(blockHasContent)) missing.push('some body text');
      if (missing.length) {
        return res.status(400).json({ error: `Still needs ${missing.join(', ')} before it can go live.` });
      }
      // Alt text, an infographic summary and a working CTA link are not
      // polish — a page missing them is broken for screen readers and for
      // search, so it doesn't go live half-done.
      const problems = (post.body || []).map(blockProblem).filter(Boolean);
      if (problems.length) return res.status(400).json({ error: problems[0] });
      if (!post.datePublished) post.datePublished = new Date();
    }

    post.status = status;
    post.dateModified = new Date();
    await post.save();
    res.json({ post });
  } catch (err) {
    console.error('admin post status error', err);
    res.status(500).json({ error: 'Could not change the status.' });
  }
});

/* Mint (or replace) the post's shareable preview token.
 *
 * Called without a flag it hands back the link that already exists, so opening
 * the preview twice doesn't quietly break the one already in someone's inbox.
 * With `regenerate` it issues a fresh token, and every link handed out before
 * this moment stops working — which is the point of having the button. */
router.post('/admin/:id/preview-token', requireBlogAccess, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found.' });

    if (req.body?.regenerate || !post.previewToken) {
      post.previewToken = crypto.randomBytes(24).toString('base64url');
      post.previewTokenAt = new Date();
      await post.save();
    }
    res.json({ token: post.previewToken, createdAt: post.previewTokenAt });
  } catch (err) {
    console.error('preview token error', err);
    res.status(500).json({ error: 'Could not create the preview link.' });
  }
});

router.delete('/admin/:id', requireBlogAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found.' });
    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('admin post delete error', err);
    res.status(500).json({ error: 'Could not delete the post.' });
  }
});

export default router;
