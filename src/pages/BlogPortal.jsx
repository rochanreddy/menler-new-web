import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/adminApi';
import Seo from '../components/common/Seo';
import BlogTab from '../components/admin/BlogTab';

/* The blog portal — a door with one room behind it.
 *
 * Same writing desk as the admin panel's Blog tab (there is only one editor;
 * a second would drift), reached through its own login on its own URL with its
 * own credentials. Nothing here links to any other admin screen, and nothing
 * else on the API accepts this session — /posts/portal/session is the only
 * thing it can open besides the blog endpoints themselves. */

function PortalLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await adminApi.blogPortalLogin(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <Seo title="Blog portal | Menler" noindex />
      <form className="admin-login-card" onSubmit={submit} noValidate>
        <p className="admin-login-brand">menler · blog</p>
        <h1 className="admin-login-title">Sign in</h1>
        <p className="admin-login-sub">Blog content only. Ask Menler for your username and password.</p>

        <label className="admin-field">
          <span>Username</span>
          <input type="text" autoComplete="username" value={username}
            onChange={(e) => setUsername(e.target.value)} autoFocus />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input type="password" autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function BlogPortal() {
  // null = still checking, false = signed out, object = the session
  const [session, setSession] = useState(null);

  const check = useCallback(() => {
    adminApi.blogPortalSession()
      .then(setSession)
      .catch(() => setSession(false));
  }, []);
  useEffect(check, [check]);

  const logout = async () => {
    try { await adminApi.blogPortalLogout(); } catch { /* the cookie may already be gone */ }
    setSession(false);
  };

  if (session === null) {
    return <div className="admin-login-wrap"><p className="admin-empty">Loading…</p></div>;
  }
  if (!session) return <PortalLogin onSuccess={check} />;

  /* An admin who's already signed in to the main panel lands here too — they
   * keep their own rights rather than being downgraded by the URL they used. */
  return (
    <div className="admin-shell">
      <Seo title="Blog portal | Menler" noindex />
      <header className="admin-topbar">
        <div className="admin-topbar-brand">menler <span>blog</span></div>
        <nav className="admin-tabs">
          <button className="admin-tab is-active" type="button">Posts</button>
        </nav>
        <button className="admin-btn admin-logout" onClick={logout}>Log Out</button>
      </header>

      <main className="admin-main">
        <BlogTab canPublish={Boolean(session.canPublish)} />
      </main>
    </div>
  );
}
