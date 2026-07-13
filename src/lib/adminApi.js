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
  getLeads: (params) => api(`/admin/leads${qs(params)}`),
  deleteLead: (id) => api(`/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getUsers: (params) => api(`/admin/users${qs(params)}`),

  // Record a payment made outside our checkout (e.g. a Cashfree payment link),
  // by its Cashfree order id. The server verifies it's PAID before recording.
  reconcilePayment: (orderId) => api('/payments/reconcile', { method: 'POST', body: { orderId } }),

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

  /** Fetches a CSV with credentials and triggers a browser download. */
  async downloadCsv(kind, params = {}) {
    const path = kind === 'users' ? '/admin/users/export.csv' : '/admin/leads/export.csv';
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
