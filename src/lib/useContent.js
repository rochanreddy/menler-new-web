import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured } from './sanity';

/**
 * Returns CMS content with a graceful fallback to hardcoded data.
 *
 * - Renders `fallback` synchronously on first paint (no loading flash, and the
 *   site keeps working before Sanity is configured / populated).
 * - When Sanity is configured, fetches `query` and swaps in the result ONLY if
 *   it's non-empty. On error it keeps the fallback.
 *
 * Usage: const mentors = useContent(MENTORS_QUERY, MENTORS);
 */
export function useContentState(query, fallback, params = {}) {
  const [data, setData] = useState(fallback);
  // `loading` is true only while a Sanity fetch is in flight — lets callers show
  // a skeleton instead of the (possibly mismatched) fallback on first paint.
  const [loading, setLoading] = useState(Boolean(isSanityConfigured && query));

  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    if (!isSanityConfigured || !query) { setLoading(false); return undefined; }
    let cancelled = false;
    setLoading(true);
    sanityClient
      .fetch(query, params)
      .then((res) => {
        if (cancelled) return;
        const empty = res == null || (Array.isArray(res) && res.length === 0)
          || (typeof res === 'object' && !Array.isArray(res) && Object.keys(res).length === 0);
        if (!empty) setData(res);
      })
      .catch(() => { /* keep fallback */ })
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
