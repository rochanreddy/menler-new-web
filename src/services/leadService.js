/**
 * Lead capture service — posts marketing-form submissions to the Menler API.
 * Captures UTM + ad-click tracking (gclid/fbclid) and persists them for the
 * session, so attribution survives navigation from the ad landing to the form.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Read a param from the URL; if present, remember it for the session; otherwise
// fall back to the remembered value (so it survives in-site navigation).
function tracked(params, key) {
  const fromUrl = params.get(key);
  try {
    if (fromUrl) { sessionStorage.setItem('ld_' + key, fromUrl); return fromUrl; }
    return sessionStorage.getItem('ld_' + key) || '';
  } catch {
    return fromUrl || '';
  }
}

function getTracking() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: tracked(params, 'utm_source'),
    utm_medium: tracked(params, 'utm_medium'),
    utm_campaign: tracked(params, 'utm_campaign'),
    utm_content: tracked(params, 'utm_content'),
    utm_term: tracked(params, 'utm_term'),
    gclid: tracked(params, 'gclid'),
    fbclid: tracked(params, 'fbclid'),
    page_url: window.location.href,
    referrer_url: document.referrer || '',
  };
}

export async function submitLead(payload) {
  const data = {
    ...payload,
    ...getTracking(),
    page: window.location.pathname,
  };

  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await errorMessage(res, 'Lead submission failed'));
  return res.json();
}

// Pull a user-facing reason out of the API's JSON error body, if present.
async function errorMessage(res, fallback) {
  try {
    const j = await res.json();
    if (j && j.error) return j.error;
  } catch { /* not JSON */ }
  return fallback;
}

/**
 * Request a gated resource (PDF). Stores an unverified lead and emails a magic
 * link; the PDF is delivered only after the user clicks it (double opt-in).
 * `payload` must include `email` and `pdf` (the resource's public path).
 */
export async function requestResource(payload) {
  const data = {
    ...payload,
    ...getTracking(),
    page: window.location.pathname,
  };

  const res = await fetch(`${API_URL}/leads/resource-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await errorMessage(res, 'Resource request failed'));
  return res.json();
}
