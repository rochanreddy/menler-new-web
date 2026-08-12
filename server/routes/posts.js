import { Router } from 'express';

import { Post, slugify } from '../models/Post.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

/* Shape a stored post into the contract the site already renders against, so
 * the pages, the prerender script and the JSON-LD all keep working unchanged. */
/* Computed here rather than read off the schema virtual: these queries use
 * .lean() for speed, and plain lean() doesn't run virtuals — which silently
 * shipped `readTime: undefined` to every card until a test caught it. */
function readTimeOf(body = []) {
  const words = body.reduce((n, b) => {
    const t = b.type === 'ul' ? (b.items || []).join(' ') : (b.text || '');
    return n + t.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

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
    body: (p.body || []).length ? p.body.map((b) => (b.type === 'ul'
      ? { type: 'ul', items: b.items || [] }
      : { type: b.type, text: b.text })) : null,
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

/* ── Admin ───────────────────────────────────────────────────────────────── */

// Drafts included, newest edit first — this is the writer's desk.
router.get('/admin/all', requireAdmin, async (req, res) => {
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

router.get('/admin/one/:id', requireAdmin, async (req, res) => {
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

router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim() || 'Untitled post';
    const post = await Post.create({
      title,
      slug: await uniqueSlug(b.slug || title),
      excerpt: String(b.excerpt || '').trim(),
      tag: String(b.tag || '').trim(),
      body: Array.isArray(b.body) ? b.body : [],
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

router.patch('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found.' });

    const b = req.body || {};
    for (const k of EDITABLE) if (k in b) post[k] = b[k];
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
router.post('/admin/:id/status', requireAdmin, async (req, res) => {
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
      if (!(post.body || []).some((x) => (x.type === 'ul' ? (x.items || []).length : x.text?.trim()))) missing.push('some body text');
      if (missing.length) {
        return res.status(400).json({ error: `Still needs ${missing.join(', ')} before it can go live.` });
      }
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

router.delete('/admin/:id', requireAdmin, async (req, res) => {
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
