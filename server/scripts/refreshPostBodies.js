/**
 * Push a post's body from src/data/blogData.js back into the database.
 *
 * seedPosts.js deliberately never touches a post that already exists, because
 * the database is where a writer's edits live. This is the explicit escape
 * hatch for the other direction — when the file has been updated (say, with the
 * new image / infographic / CTA blocks) and you want that content in the live
 * post. It OVERWRITES the body of every slug you name, so it never runs by
 * accident: no slugs, no changes.
 *
 *   node server/scripts/refreshPostBodies.js why-online-courses-have-a-completion-problem
 *   node server/scripts/refreshPostBodies.js --all      # every slug in the file
 */
import 'dotenv/config';
import mongoose from 'mongoose';

import { Post } from '../models/Post.js';
import { BLOG_POSTS } from '../../src/data/blogData.js';

const args = process.argv.slice(2);
const all = args.includes('--all');
const slugs = args.filter((a) => !a.startsWith('--'));

if (!all && !slugs.length) {
  console.error('Name at least one slug, or pass --all. Nothing was changed.');
  console.error('Available in blogData.js:');
  for (const p of BLOG_POSTS) console.error(`  ${p.slug}${p.body ? '' : '  (no body in the file)'}`);
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set.');
  process.exit(1);
}

await mongoose.connect(uri);

const wanted = all ? BLOG_POSTS : BLOG_POSTS.filter((p) => slugs.includes(p.slug));
const unknown = slugs.filter((s) => !BLOG_POSTS.some((p) => p.slug === s));
for (const s of unknown) console.warn(`  ! no such slug in blogData.js: ${s}`);

let updated = 0;
for (const p of wanted) {
  if (!p.body) {
    console.log(`  · skipped (no body in the file)  ${p.slug}`);
    continue;
  }
  const post = await Post.findOne({ slug: p.slug });
  if (!post) {
    console.log(`  · skipped (not in the database — run seedPosts.js first)  ${p.slug}`);
    continue;
  }
  post.body = p.body;
  post.dateModified = new Date();
  await post.save();
  console.log(`  ✓ body replaced (${p.body.length} blocks)  ${p.slug}`);
  updated += 1;
}

console.log(`\nDone — ${updated} post${updated === 1 ? '' : 's'} updated.`);
await mongoose.disconnect();
