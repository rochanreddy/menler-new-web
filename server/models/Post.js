import mongoose from 'mongoose';

/* One block of article body. Deliberately a small, closed set: a writer picking
 * from a short menu produces consistent pages, where a free-form rich text
 * field produces five different heading sizes by the end of the month.
 *
 * Fields are shared across types rather than nested per type, so the existing
 * text blocks keep exactly the shape they've always had and older posts need no
 * migration. Which fields matter for which type:
 *   p / h2 / h3 / quote   text
 *   ul                    items
 *   image                 src, alt (required), caption
 *   infographic           src, alt (required), summary (required), caption
 *   cta                   text, buttonLabel, href
 *   resource              text (title), href, description
 */
export const BLOCK_TYPES = ['p', 'h2', 'h3', 'quote', 'ul', 'image', 'infographic', 'cta', 'resource'];

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: BLOCK_TYPES, default: 'p' },
    text: { type: String, default: '' },        // p / h2 / h3 / quote / cta / resource title
    items: { type: [String], default: undefined }, // ul

    // image / infographic
    src: { type: String, default: undefined },
    alt: { type: String, default: undefined },
    caption: { type: String, default: undefined },
    // Text baked into a picture is invisible to a screen reader and to a
    // crawler, so an infographic carries its point in words as well.
    summary: { type: String, default: undefined },

    // cta / resource
    buttonLabel: { type: String, default: undefined },
    href: { type: String, default: undefined },
    description: { type: String, default: undefined },
  },
  { _id: false },
);

/** Words a block contributes to the read time — every human-readable field. */
export function blockWords(b = {}) {
  const parts = b.type === 'ul'
    ? (b.items || [])
    : [b.text, b.caption, b.summary, b.description];
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '', trim: true },
    tag: { type: String, default: '', trim: true, index: true },

    author: {
      name: { type: String, default: 'The Menler Team' },
      role: { type: String, default: 'Menler Editorial' },
      initials: { type: String, default: 'M' },
      type: { type: String, enum: ['Person', 'Organization'], default: 'Organization' },
    },

    body: { type: [blockSchema], default: [] },

    cover: { type: String, default: '' },       // absolute or /public URL
    thumb: { type: String, default: 'alumni' }, // brand art used when cover is empty
    featured: { type: Boolean, default: false },

    // Drafts are invisible to the public API, so a half-written post can't leak.
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    datePublished: { type: Date, default: null },
    dateModified: { type: Date, default: null },

    // Optional overrides — when blank the title and excerpt are used, which is
    // right often enough that most writers should never touch these.
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },

    /* Shareable no-login preview. The token IS the credential, so it's long,
     * random, and regenerating it silently invalidates every link already sent
     * out — the only way to take a preview back once it's been shared. */
    previewToken: { type: String, default: '', index: true },
    previewTokenAt: { type: Date, default: null },

    lastEditedBy: { type: String, default: '' },
  },
  { timestamps: true, collection: 'posts' },
);

/** ~200 wpm over every word in the body — close enough, and never stale. */
postSchema.virtual('readTime').get(function readTime() {
  const words = (this.body || []).reduce((n, b) => n + blockWords(b), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

/** URL-safe slug from a title. Exported so the admin can preview it live. */
export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
