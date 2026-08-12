import mongoose from 'mongoose';

/* One block of article body. Deliberately a small, closed set: a writer picking
 * from five options produces consistent pages, where a free-form rich text
 * field produces five different heading sizes by the end of the month. */
const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['p', 'h2', 'h3', 'quote', 'ul'], default: 'p' },
    text: { type: String, default: '' },        // p / h2 / h3 / quote
    items: { type: [String], default: undefined }, // ul
  },
  { _id: false },
);

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

    lastEditedBy: { type: String, default: '' },
  },
  { timestamps: true, collection: 'posts' },
);

/** ~200 wpm over every word in the body — close enough, and never stale. */
postSchema.virtual('readTime').get(function readTime() {
  const words = (this.body || []).reduce((n, b) => {
    const text = b.type === 'ul' ? (b.items || []).join(' ') : (b.text || '');
    return n + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
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
