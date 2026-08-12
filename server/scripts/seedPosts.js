/**
 * Move the four hand-written posts out of src/data/blogData.js and into the
 * database, once. Safe to re-run: a slug that already exists is left alone, so
 * this can't overwrite something a writer has since edited.
 *
 *   node server/scripts/seedPosts.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';

import { Post } from '../models/Post.js';
import { BLOG_POSTS } from '../../src/data/blogData.js';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set.');
  process.exit(1);
}

await mongoose.connect(uri);
console.log(`Seeding ${BLOG_POSTS.length} posts…\n`);

let added = 0;
let skipped = 0;

for (const p of BLOG_POSTS) {
  const exists = await Post.findOne({ slug: p.slug }).lean();
  if (exists) {
    console.log(`  · skipped (already there)  ${p.slug}`);
    skipped += 1;
    continue;
  }
  await Post.create({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.tag,
    author: p.author,
    body: p.body || [],
    cover: p.cover || '',
    thumb: p.thumb || 'alumni',
    featured: Boolean(p.featured),
    // Only the ones with real body copy go live; the three stubs land as drafts
    // so nobody has to discover an empty article on the live site.
    status: p.body ? 'published' : 'draft',
    datePublished: p.datePublished ? new Date(`${p.datePublished}T09:00:00+05:30`) : new Date(),
    dateModified: p.dateModified ? new Date(`${p.dateModified}T09:00:00+05:30`) : new Date(),
  });
  console.log(`  ✓ added ${p.body ? '(published)' : '(draft — no body yet)'}  ${p.slug}`);
  added += 1;
}

console.log(`\nDone — ${added} added, ${skipped} left alone.`);
await mongoose.disconnect();
