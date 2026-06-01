/**
 * Drop-in auth/data client backed by the Menler MongoDB API.
 *
 * This intentionally mirrors the small slice of the Supabase JS surface the app
 * actually uses (`supabase.auth.*` and `supabase.from('profiles')`), so the page
 * components didn't have to change when we moved off Supabase. Sessions live in
 * an httpOnly cookie set by the server — the browser never sees the JWT.
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
    /* response had no JSON body */
  }
  return { res, data };
}

const errFrom = (data, fallback) => ({ message: data?.error || fallback });

/* ── Lightweight session state + change notifications ────────────────────── */
let currentSession = null; // { user } | null
const listeners = new Set();

function setSession(user) {
  currentSession = user ? { user } : null;
}

function emit(event) {
  for (const cb of listeners) {
    try {
      cb(event, currentSession);
    } catch {
      /* a listener throwing shouldn't break the others */
    }
  }
}

async function refreshSession() {
  const { res, data } = await api('/auth/session');
  setSession(res.ok && data?.authenticated ? data.user : null);
  return currentSession;
}

/* ── auth ────────────────────────────────────────────────────────────────── */
const auth = {
  async getSession() {
    await refreshSession();
    return { data: { session: currentSession }, error: null };
  },

  async getUser() {
    await refreshSession();
    if (!currentSession) {
      return { data: { user: null }, error: errFrom(null, 'Not authenticated') };
    }
    return { data: { user: currentSession.user }, error: null };
  },

  onAuthStateChange(callback) {
    listeners.add(callback);
    return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
  },

  async signUp({ email, password, options }) {
    const { res, data } = await api('/auth/signup', {
      method: 'POST',
      body: {
        email,
        password,
        full_name: options?.data?.full_name || '',
        phone: options?.data?.phone || '',
      },
    });
    if (!res.ok) return { data: { session: null, user: null }, error: errFrom(data, 'Sign up failed.') };
    // Email verification required → no session yet (matches the prior flow).
    return { data: { session: null, user: null }, error: null };
  },

  async signInWithPassword({ email, password }) {
    const { res, data } = await api('/auth/login', { method: 'POST', body: { email, password } });
    if (!res.ok) return { data: { session: null }, error: errFrom(data, 'Invalid email or password.') };
    setSession(data.user);
    emit('SIGNED_IN');
    return { data: { session: currentSession }, error: null };
  },

  async signInWithOAuth({ provider }) {
    if (provider === 'google') {
      const url = `${API_URL}/auth/google/start`;
      window.location.href = url;
      return { data: { provider, url }, error: null };
    }
    return { data: null, error: errFrom(null, `Unsupported provider: ${provider}`) };
  },

  async verifyOtp({ email, token }) {
    const { res, data } = await api('/auth/verify-otp', { method: 'POST', body: { email, token } });
    if (!res.ok) return { data: {}, error: errFrom(data, 'Verification failed.') };
    setSession(data.user);
    emit('SIGNED_IN');
    return { data: { session: currentSession, user: data.user }, error: null };
  },

  async resend({ email }) {
    const { res, data } = await api('/auth/resend', { method: 'POST', body: { email } });
    if (!res.ok) return { error: errFrom(data, 'Could not resend code.') };
    return { error: null };
  },

  async resetPasswordForEmail(email, options) {
    const { res, data } = await api('/auth/forgot-password', {
      method: 'POST',
      body: { email, redirectTo: options?.redirectTo },
    });
    if (!res.ok) return { error: errFrom(data, 'Could not send reset link.') };
    return { error: null };
  },

  // Used on the reset-password page — the token comes from the emailed link.
  async updateUser({ password }) {
    const token = new URLSearchParams(window.location.search).get('token');
    const { res, data } = await api('/auth/reset-password', { method: 'POST', body: { token, password } });
    if (!res.ok) return { data: {}, error: errFrom(data, 'Could not update password.') };
    return { data: {}, error: null };
  },

  async signOut() {
    await api('/auth/logout', { method: 'POST' });
    setSession(null);
    emit('SIGNED_OUT');
    return { error: null };
  },
};

/* ── from('profiles') — minimal query-builder shim ───────────────────────── */
function from(table) {
  if (table !== 'profiles') {
    throw new Error(`Unsupported table: ${table}`);
  }

  const single = async () => {
    const { res, data } = await api('/profile');
    if (!res.ok) return { data: null, error: errFrom(data, 'Could not load profile.') };
    return { data: data.profile, error: null };
  };

  return {
    select() {
      return {
        eq() {
          return { single };
        },
      };
    },
    async upsert(payload) {
      const { res, data } = await api('/profile', { method: 'PUT', body: payload });
      if (!res.ok) return { data: null, error: errFrom(data, 'Could not save profile.') };
      return { data: data.profile, error: null };
    },
  };
}

export const supabase = { auth, from };
