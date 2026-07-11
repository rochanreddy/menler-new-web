import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured } from './sanity';

// Small localStorage-backed cache (stale-while-revalidate). On a reload it lets
// the FIRST paint show the last-seen content for this exact query+params —
// instead of the hardcoded fallback — so campaign pages don't flash the previous
// campaign before Sanity responds. It still revalidates in the background.
const cacheKey = (query, paramsKey) => {
  const s = `${query}|${paramsKey}`;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `mnlr:content:${h}`;
};
const readCache = (key) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
};
const writeCache = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota / unavailable — ignore */ }
};

/**
 * Returns CMS content with a graceful fallback to hardcoded data.
 *
 * - First paint: the last-seen cached result for this query (if any), else the
 *   `fallback`. So the site works before Sanity is configured/populated, and a
 *   reload doesn't flash mismatched fallback content.
 * - When Sanity is configured, fetches `query` and swaps in the result ONLY if
 *   it's non-empty (and caches it). On error it keeps what it had.
 *
 * Usage: const mentors = useContent(MENTORS_QUERY, MENTORS);
 */
export function useContentState(query, fallback, params = {}) {
  const paramsKey = JSON.stringify(params);
  const key = cacheKey(query, paramsKey);

  const [data, setData] = useState(() => (isSanityConfigured && query ? readCache(key) : null) ?? fallback);
  // `loading` is true only while a Sanity fetch is in flight — lets callers show
  // a skeleton instead of the (possibly mismatched) fallback on first paint.
  const [loading, setLoading] = useState(Boolean(isSanityConfigured && query));

  useEffect(() => {
    if (!isSanityConfigured || !query) { setLoading(false); return undefined; }
    let cancelled = false;
    setLoading(true);
    // Re-seed from cache when the query/params change (e.g. navigating slugs
    // without a remount) so the swap is cache → fresh, not fallback → fresh.
    const cached = readCache(key);
    if (cached) setData(cached);
    sanityClient
      .fetch(query, params)
      .then((res) => {
        if (cancelled) return;
        const empty = res == null || (Array.isArray(res) && res.length === 0)
          || (typeof res === 'object' && !Array.isArray(res) && Object.keys(res).length === 0);
        if (!empty) { setData(res); writeCache(key, res); }
      })
      .catch(() => { /* keep what we have */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey]);

  return { data, loading };
}

// Back-compatible: returns just the data.
export function useContent(query, fallback, params = {}) {
  return useContentState(query, fallback, params).data;
}
