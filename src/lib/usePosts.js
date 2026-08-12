import { useEffect, useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Published posts, newest first.
 *
 * Three layers, in order of preference:
 *  1. window.__POSTS__ — baked into the HTML at build time by the prerender
 *     script, so the first paint (and any crawler that doesn't run JS) sees
 *     real content rather than a spinner.
 *  2. The live API — picked up straight after, so a post published in the
 *     admin appears without waiting for a redeploy.
 *  3. src/data/blogData.js — the original file, used only if the API is
 *     unreachable and nothing was baked in. The blog never renders empty.
 */
export function usePosts() {
  const baked = typeof window !== 'undefined' && Array.isArray(window.__POSTS__) ? window.__POSTS__ : null;
  const [posts, setPosts] = useState(baked || BLOG_POSTS);
  const [loading, setLoading] = useState(!baked);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/posts`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        // An empty database shouldn't blank a blog that has baked-in content.
        if (alive && Array.isArray(d.posts) && d.posts.length) setPosts(d.posts);
      })
      .catch(() => { /* keep whatever we already have */ })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { posts, loading };
}
