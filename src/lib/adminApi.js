/**
 * Admin API client — talks to the read-only /admin endpoints on the Menler API.
 * Mirrors the fetch pattern used in src/lib/supabase.js (cookie-based session).
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no JSON body */
  }
  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

/** POSTs a body and opens the returned document (PDF or HTML) in a new tab. */
async function openPreview(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = 'Preview failed';
    try { msg = (await res.json())?.error || msg; } catch { /* not JSON */ }
    throw new Error(msg);
  }
  const url = URL.createObjectURL(await res.blob());
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const qs = (params = {}) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const adminApi = {
  login: (username, password) =>
    api('/admin/login', { method: 'POST', body: { username, password } }),
  logout: () => api('/admin/logout', { method: 'POST' }),
  getSession: () => api('/admin/session'),
  getStats: () => api('/admin/stats'),

  /** Leads count for one calendar day (IST). date = "YYYY-MM-DD". */
  getDayLeads: (date) => api(`/admin/stats/day?date=${encodeURIComponent(date)}`),

  /** Leads count for a rolling period of N days. */
  getPeriodLeads: (days) => api(`/admin/stats/period?days=${encodeURIComponent(days)}`),

  /** Distinct pages leads were captured on (for the Pages filter). */
  getLeadPages: () => api('/admin/leads/pages'),

  /** Sections seen on one page (for the per-page section filter). */
  getLeadSections: (page) => api(`/admin/leads/sections?page=${encodeURIComponent(page)}`),

  /** UTM sources seen on one page (for the per-campaign UTM filter). */
  getLeadUtms: (page) => api(`/admin/leads/utms?page=${encodeURIComponent(page)}`),
  getLeads: (params) => api(`/admin/leads${qs(params)}`),
  deleteLead: (id) => api(`/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getUsers: (params) => api(`/admin/users${qs(params)}`),

  // Paid users — everyone with a confirmed PAID order (site-wide), plus
  // manually recorded Cashfree-payment-link payments.
  getPaidUsers: (params) => api(`/admin/paid-users${qs(params)}`),
  verifyPayment: (reference) => api('/admin/paid-users/verify', { method: 'POST', body: { reference } }),
  verifyExisting: (id, reference) =>
    api(`/admin/paid-users/${encodeURIComponent(id)}/verify`, { method: 'POST', body: { reference } }),
  // Blog
  posts: (params) => api(`/posts/admin/all${qs(params)}`),
  post: (id) => api(`/posts/admin/one/${encodeURIComponent(id)}`),
  createPost: (body) => api('/posts/admin', { method: 'POST', body }),
  updatePost: (id, body) => api(`/posts/admin/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  setPostStatus: (id, status) => api(`/posts/admin/${encodeURIComponent(id)}/status`, { method: 'POST', body: { status } }),
  deletePost: (id) => api(`/posts/admin/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  /** The post's shareable no-login preview token. `regenerate` kills the old one. */
  postPreviewToken: (id, regenerate = false) =>
    api(`/posts/admin/${encodeURIComponent(id)}/preview-token`, { method: 'POST', body: { regenerate } }),

  /* Blog portal — a separate login that unlocks the blog screens and nothing
   * else. Its own credentials and its own cookie; signing in here gives no
   * access to any other admin endpoint. */
  blogPortalLogin: (username, password) =>
    api('/posts/portal/login', { method: 'POST', body: { username, password } }),
  blogPortalLogout: () => api('/posts/portal/logout', { method: 'POST' }),
  blogPortalSession: () => api('/posts/portal/session'),

  resendPack: (id) => api('/admin/paid-users/' + encodeURIComponent(id) + '/resend-pack', { method: 'POST' }),
  setBatch: (id, batch) =>
    api(`/admin/paid-users/${encodeURIComponent(id)}/batch`, { method: 'PATCH', body: { batch } }),
  addPaidUser: (body) => api('/admin/paid-users', { method: 'POST', body }),
  deletePaidUser: (id) => api(`/admin/paid-users/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Zoom attendance for a campaign's session (admin-only).
  zoomInstances: (slug) => api(`/admin/zoom/instances${qs({ slug })}`),
  zoomAttendance: (slug, uuid) => api(`/admin/zoom/attendance${qs({ slug, uuid })}`),

  // Per-campaign Zoom links (admin-only; never shown on the public site).
  getCampaigns: () => api('/admin/campaigns'),
  saveCampaign: (slug, body) =>
    api(`/admin/campaigns/${encodeURIComponent(slug)}`, { method: 'PUT', body }),

  // Branded URL shortener (admin-only).
  getShortLinks: () => api('/admin/shortlinks'),
  createShortLink: (body) => api('/admin/shortlinks', { method: 'POST', body }),
  updateShortLink: (code, body) =>
    api(`/admin/shortlinks/${encodeURIComponent(code)}`, { method: 'PUT', body }),
  deleteShortLink: (code) =>
    api(`/admin/shortlinks/${encodeURIComponent(code)}`, { method: 'DELETE' }),

  sendCertificates: (body) =>
    api('/admin/certificates/send', { method: 'POST', body }),

  mailStatus: () => api('/admin/certificates/mail-status'),

  /** Renders one sample certificate and opens it in a new tab for checking. */
  previewCertificate: (body) => openPreview('/admin/certificates/preview', body),

  /** Renders the covering email (with custom copy) in a new tab. */
  previewCertificateEmail: (body) => openPreview('/admin/certificates/email-preview', body),

  /** Fetches a CSV with credentials and triggers a browser download. */
  async downloadCsv(kind, params = {}) {
    const path = kind === 'users' ? '/admin/users/export.csv'
      : kind === 'paid' ? '/admin/paid-users/export.csv'
        : '/admin/leads/export.csv';
    const res = await fetch(`${API_URL}${path}${qs(params)}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
