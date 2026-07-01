import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/adminApi';
import Seo from '../components/common/Seo';

/* ── helpers ─────────────────────────────────────────────────────────────── */

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const dash = (v) => (v === undefined || v === null || v === '' ? '—' : v);

/* ── Login ───────────────────────────────────────────────────────────────── */

function AdminLogin({ onSuccess }) {
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
      await adminApi.login(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <Seo noindex />
      <form className="admin-login-card" onSubmit={submit} noValidate>
        <p className="admin-login-brand">menler · admin</p>
        <h1 className="admin-login-title">Sign in</h1>
        <p className="admin-login-sub">Restricted area. Authorized staff only.</p>

        <label className="admin-field">
          <span>Username</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/* ── Detail drawer ───────────────────────────────────────────────────────── */

function Row({ label, value }) {
  const isObj = value && typeof value === 'object';
  return (
    <div className="admin-detail-row">
      <span className="admin-detail-key">{label}</span>
      <span className="admin-detail-val">
        {isObj
          ? <pre className="admin-detail-pre">{JSON.stringify(value, null, 2)}</pre>
          : dash(value)}
      </span>
    </div>
  );
}

function Drawer({ title, fields, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-head">
          <h2>{title}</h2>
          <button className="admin-drawer-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="admin-drawer-body">
          {fields.map(([label, value]) => (
            <Row key={label} label={label} value={value} />
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ── Overview ────────────────────────────────────────────────────────────── */

function StatCard({ label, value, accent }) {
  return (
    <div className="admin-stat" style={accent ? { borderTopColor: accent } : undefined}>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}

function BreakdownList({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="admin-panel-card">
      <p className="admin-card-title">{title}</p>
      {rows.length === 0 && <p className="admin-empty">No data yet.</p>}
      <ul className="admin-breakdown">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="admin-breakdown-label">{r.label}</span>
            <span className="admin-breakdown-bar">
              <span style={{ width: `${(r.count / max) * 100}%` }} />
            </span>
            <span className="admin-breakdown-count">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="admin-empty">{error}</p>;
  if (!stats) return <p className="admin-empty">Loading…</p>;

  const t = stats.totals;
  const maxDay = Math.max(1, ...stats.byDay.map((d) => d.count));

  return (
    <div className="admin-overview">
      <div className="admin-stat-grid">
        <StatCard label="Total leads" value={t.leads} accent="var(--specialist)" />
        <StatCard label="Leads · last 7 days" value={t.leads7} accent="var(--placed)" />
        <StatCard label="Leads · last 30 days" value={t.leads30} accent="var(--placed)" />
        <StatCard label="Registered users" value={t.users} accent="var(--ink)" />
        <StatCard label="Verified users" value={t.verifiedUsers} accent="var(--ink)" />
        <StatCard label="Profiles" value={t.profiles} accent="var(--lavender)" />
      </div>

      <div className="admin-panel-card">
        <p className="admin-card-title">Leads · last 14 days</p>
        <div className="admin-chart">
          {stats.byDay.map((d) => (
            <div className="admin-chart-col" key={d.date} title={`${d.date}: ${d.count}`}>
              <div className="admin-chart-bar" style={{ height: `${(d.count / maxDay) * 100}%` }}>
                {d.count > 0 && <span className="admin-chart-num">{d.count}</span>}
              </div>
              <span className="admin-chart-x">{d.date.slice(8)}/{d.date.slice(5, 7)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-two-col">
        <BreakdownList title="Leads by program" rows={stats.byProgram} />
        <BreakdownList title="Leads by source" rows={stats.bySource} />
      </div>

      <div className="admin-panel-card">
        <p className="admin-card-title">Most recent leads</p>
        {stats.recentLeads.length === 0 && <p className="admin-empty">No leads yet.</p>}
        <ul className="admin-recent">
          {stats.recentLeads.map((l) => (
            <li key={l._id}>
              <strong>{dash(l.name)}</strong>
              <span>{dash(l.email)}</span>
              <span className="admin-pill">{dash(l.program || l.source)}</span>
              <time>{fmtDate(l.createdAt)}</time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Generic paginated table ─────────────────────────────────────────────── */

function Pager({ page, limit, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="admin-pager">
      <span>
        {total === 0 ? '0' : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="admin-pager-btns">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</button>
        <span>Page {page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => onPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
}

/* ── Leads tab ───────────────────────────────────────────────────────────── */

const LEAD_SORTS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'program', label: 'Program A–Z' },
];

function LeadsTab() {
  const [search, setSearch] = useState('');
  const [program, setProgram] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, page: 1, limit: 25 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [facets, setFacets] = useState({ programs: [], sources: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.getLeads({ search, program, source, sort, page, limit: 25 });
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [search, program, source, sort, page]);

  useEffect(() => { load(); }, [load]);

  // Build filter dropdown options once from the overview stats.
  useEffect(() => {
    adminApi.getStats()
      .then((s) => setFacets({
        programs: s.byProgram.map((x) => x.label).filter((x) => x && x !== '—'),
        sources: s.bySource.map((x) => x.label).filter((x) => x && x !== '—'),
      }))
      .catch(() => {});
  }, []);

  const onSearch = (e) => { setPage(1); setSearch(e.target.value); };

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search name, email, phone, message…"
          value={search}
          onChange={onSearch}
        />
        <select value={program} onChange={(e) => { setPage(1); setProgram(e.target.value); }}>
          <option value="">All programs</option>
          {facets.programs.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={source} onChange={(e) => { setPage(1); setSource(e.target.value); }}>
          <option value="">All sources</option>
          {facets.sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }}>
          {LEAD_SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button
          className="admin-btn"
          onClick={() => adminApi.downloadCsv('leads', { search, program, source })}
        >
          ⭳ Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th>Program</th><th>Source</th><th>Section</th><th>CTA / button</th><th>Page</th><th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} className="admin-empty">Loading…</td></tr>}
            {!loading && data.rows.length === 0 && (
              <tr><td colSpan={9} className="admin-empty">No leads found.</td></tr>
            )}
            {!loading && data.rows.map((l) => (
              <tr key={l._id} onClick={() => setSelected(l)}>
                <td>{dash(l.name)}</td>
                <td>{dash(l.email)}</td>
                <td>{dash(l.phone)}</td>
                <td>{l.program ? <span className="admin-pill">{l.program}</span> : '—'}</td>
                <td>{dash(l.source)}</td>
                <td className="admin-muted">{dash(l.section)}</td>
                <td className="admin-muted">{dash(l.cta_label || l.resource)}</td>
                <td className="admin-muted">{dash(l.page)}</td>
                <td className="admin-muted">{fmtDate(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />

      {selected && (
        <Drawer
          title="Lead detail"
          onClose={() => setSelected(null)}
          fields={[
            ['Name', selected.name],
            ['Email', selected.email],
            ['Phone', selected.phone],
            ['Program', selected.program],
            ['Track', selected.track],
            ['Background', selected.background],
            ['Message', selected.message],
            ['Source', selected.source],
            ['Section', selected.section],
            ['CTA / button', selected.cta_label],
            ['Resource', selected.resource],
            ['Report link', selected.report_url],
            ['Page', selected.page],
            ['UTM Source', selected.utm_source],
            ['UTM Medium', selected.utm_medium],
            ['UTM Campaign', selected.utm_campaign],
            ['UTM Content', selected.utm_content],
            ['UTM Term', selected.utm_term],
            ['Google Click ID (gclid)', selected.gclid],
            ['Facebook Click ID (fbclid)', selected.fbclid],
            ['Communication opt-in', selected.communication_optin === false ? 'No' : 'Yes'],
            ['Referrer URL', selected.referrer_url],
            ['Page URL', selected.page_url],
            ['Extra fields', selected.extra && Object.keys(selected.extra).length ? selected.extra : '—'],
            ['Created', fmtDate(selected.createdAt)],
            ['Updated', fmtDate(selected.updatedAt)],
            ['Record ID', selected._id],
          ]}
        />
      )}
    </div>
  );
}

/* ── Users tab ───────────────────────────────────────────────────────────── */

function UsersTab() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, page: 1, limit: 25 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await adminApi.getUsers({ search, page, limit: 25 }));
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <button className="admin-btn" onClick={() => adminApi.downloadCsv('users', { search })}>
          ⭳ Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th>Provider</th><th>Verified</th><th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="admin-empty">Loading…</td></tr>}
            {!loading && data.rows.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">No users found.</td></tr>
            )}
            {!loading && data.rows.map((u) => (
              <tr key={u._id} onClick={() => setSelected(u)}>
                <td>{dash(u.fullName)}</td>
                <td>{dash(u.email)}</td>
                <td>{dash(u.phone)}</td>
                <td><span className="admin-pill">{dash(u.provider)}</span></td>
                <td>
                  {u.emailVerified
                    ? <span className="admin-badge admin-badge--ok">Verified</span>
                    : <span className="admin-badge">Pending</span>}
                </td>
                <td className="admin-muted">{fmtDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />

      {selected && (
        <Drawer
          title="User detail"
          onClose={() => setSelected(null)}
          fields={[
            ['Name', selected.fullName],
            ['Email', selected.email],
            ['Phone', selected.phone],
            ['Provider', selected.provider],
            ['Email verified', selected.emailVerified ? 'Yes' : 'No'],
            ['Created', fmtDate(selected.createdAt)],
            ['Updated', fmtDate(selected.updatedAt)],
            ['User ID', selected._id],
            ['— Profile —', selected.profile ? '' : 'No profile saved'],
            ...(selected.profile ? [
              ['Degree', selected.profile.degree],
              ['Field of study', selected.profile.fieldOfStudy],
              ['Passout year', selected.profile.passoutYear],
              ['College', selected.profile.collegeName],
              ['Currently studying', selected.profile.currentlyStudying ? 'Yes' : 'No'],
              ['Designation', selected.profile.designation],
              ['Company', selected.profile.companyName],
              ['Location', selected.profile.location],
            ] : []),
          ]}
        />
      )}
    </div>
  );
}

/* ── Campaigns tab (per-campaign Zoom link — admin only) ─────────────────── */

function CampaignsTab() {
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({}); // slug -> zoom link being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingSlug, setSavingSlug] = useState('');
  const [savedSlug, setSavedSlug] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const d = await adminApi.getCampaigns();
      const list = d.rows || [];
      setRows(list);
      setDrafts(Object.fromEntries(list.map((r) => [r.slug, r.zoomLink || ''])));
    } catch (e) {
      setError(e.message || 'Could not load campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (slug) => {
    setSavingSlug(slug);
    setSavedSlug('');
    setError('');
    try {
      await adminApi.saveCampaign(slug, { zoomLink: drafts[slug] || '' });
      setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, zoomLink: drafts[slug] || '' } : r)));
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug((s) => (s === slug ? '' : s)), 2000);
    } catch (e) {
      setError(e.message || 'Could not save the link.');
    } finally {
      setSavingSlug('');
    }
  };

  const addCampaign = async (e) => {
    e.preventDefault();
    const slug = newSlug.trim();
    if (!slug) return;
    setError('');
    setSavingSlug(slug);
    try {
      // Persist immediately so the campaign survives navigation / reload.
      await adminApi.saveCampaign(slug, { zoomLink: drafts[slug] || '' });
      setNewSlug('');
      await load();
    } catch (e2) {
      setError(e2.message || 'Could not add the campaign — is the admin API running?');
    } finally {
      setSavingSlug('');
    }
  };

  return (
    <div>
      <div className="admin-panel-card" style={{ marginBottom: 16 }}>
        <p className="admin-card-title">Campaign Zoom links</p>
        <p className="admin-empty" style={{ textAlign: 'left', margin: '0 0 12px' }}>
          Set the Zoom / meeting link for each campaign. These are <b>internal only</b> — the link is never shown on the website. It is keyed by the campaign URL slug ({'menler.in/campaign/<slug>'}). Campaigns that have received registrations appear automatically; use the box below to add one before any leads arrive.
        </p>
        <form className="admin-toolbar" onSubmit={addCampaign}>
          <input
            className="admin-search"
            placeholder="Add a campaign slug (e.g. claude-mastery-for-ai-native-careers)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
          <button className="admin-btn admin-btn--primary" type="submit">+ Add campaign</button>
        </form>
      </div>

      {error && <p className="admin-empty">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Campaign (slug)</th><th>Leads</th><th>Zoom link</th><th /></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="admin-empty">Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={4} className="admin-empty">No campaigns yet.</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.slug}>
                <td>
                  <strong>{r.slug}</strong>
                  {r.title && <div className="admin-muted">{r.title}</div>}
                </td>
                <td className="admin-muted">{r.leads || 0}</td>
                <td>
                  <input
                    className="admin-search"
                    style={{ minWidth: 280, width: '100%' }}
                    type="url"
                    placeholder="https://zoom.us/j/…"
                    value={drafts[r.slug] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.slug]: e.target.value }))}
                  />
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn--primary"
                    disabled={savingSlug === r.slug}
                    onClick={() => save(r.slug)}
                  >
                    {savingSlug === r.slug ? 'Saving…' : savedSlug === r.slug ? 'Saved ✓' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Short links tab (branded URL shortener — admin only) ────────────────── */

// Where the short links live. Defaults to the API origin + /l so links work
// out of the box; set VITE_SHORT_BASE to "https://go.menler.in/l" once that
// subdomain points at the API.
const SHORT_BASE = (import.meta.env.VITE_SHORT_BASE || '').trim()
  || `${(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')}/l`;

function ShortLinksTab() {
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({}); // code -> target being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingCode, setSavingCode] = useState('');
  const [copied, setCopied] = useState('');
  // Create form
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const d = await adminApi.getShortLinks();
      const list = d.rows || [];
      setRows(list);
      setDrafts(Object.fromEntries(list.map((r) => [r.code, r.target])));
    } catch (e) {
      setError(e.message || 'Could not load short links.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shortUrl = (c) => `${SHORT_BASE}/${c}`;

  const copy = async (c) => {
    try { await navigator.clipboard.writeText(shortUrl(c)); setCopied(c); setTimeout(() => setCopied((x) => (x === c ? '' : x)), 1500); } catch { /* clipboard blocked */ }
  };

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await adminApi.createShortLink({ target: target.trim(), code: code.trim(), label: label.trim() });
      setTarget(''); setCode(''); setLabel('');
      await load();
    } catch (e2) {
      setError(e2.message || 'Could not create the short link.');
    } finally {
      setCreating(false);
    }
  };

  const saveTarget = async (c) => {
    setSavingCode(c);
    setError('');
    try {
      await adminApi.updateShortLink(c, { target: (drafts[c] || '').trim() });
      setRows((rs) => rs.map((r) => (r.code === c ? { ...r, target: drafts[c] } : r)));
    } catch (e) {
      setError(e.message || 'Could not update.');
    } finally {
      setSavingCode('');
    }
  };

  const remove = async (c) => {
    setError('');
    try {
      await adminApi.deleteShortLink(c);
      setRows((rs) => rs.filter((r) => r.code !== c));
    } catch (e) {
      setError(e.message || 'Could not delete.');
    }
  };

  return (
    <div>
      <div className="admin-panel-card" style={{ marginBottom: 16 }}>
        <p className="admin-card-title">Create a short link</p>
        <p className="admin-empty" style={{ textAlign: 'left', margin: '0 0 12px' }}>
          Paste a long URL (a campaign, a Zoom link, anything) and get a short link at <b>{SHORT_BASE}/…</b>. Great for SMS — the short domain is whitelisted once, then every code under it is covered. Leave the code blank for a random one, or type your own (e.g. <b>cm</b>).
        </p>
        <form className="admin-toolbar" onSubmit={create}>
          <input className="admin-search" style={{ flex: 2 }} type="url" required placeholder="https://menler.in/campaign/…  (long URL)" value={target} onChange={(e) => setTarget(e.target.value)} />
          <input className="admin-search" style={{ maxWidth: 150 }} placeholder="code (optional)" value={code} onChange={(e) => setCode(e.target.value)} />
          <input className="admin-search" style={{ maxWidth: 180 }} placeholder="label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <button className="admin-btn admin-btn--primary" type="submit" disabled={creating}>{creating ? 'Creating…' : '+ Create'}</button>
        </form>
      </div>

      {error && <p className="admin-empty">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Short link</th><th>Target URL</th><th>Clicks</th><th /></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="admin-empty">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={4} className="admin-empty">No short links yet.</td></tr>}
            {!loading && rows.map((r) => (
              <tr key={r.code}>
                <td>
                  <button className="admin-btn" onClick={() => copy(r.code)} title="Copy short link" style={{ fontFamily: 'monospace' }}>
                    {copied === r.code ? 'Copied ✓' : `/${r.code}`}
                  </button>
                  {r.label && <div className="admin-muted" style={{ marginTop: 4 }}>{r.label}</div>}
                </td>
                <td>
                  <input
                    className="admin-search"
                    style={{ width: '100%', minWidth: 260 }}
                    type="url"
                    value={drafts[r.code] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.code]: e.target.value }))}
                  />
                </td>
                <td className="admin-muted">{r.clicks || 0}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="admin-btn admin-btn--primary" disabled={savingCode === r.code} onClick={() => saveTarget(r.code)}>
                    {savingCode === r.code ? 'Saving…' : 'Save'}
                  </button>{' '}
                  <button className="admin-btn" onClick={() => remove(r.code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'leads', label: 'Leads' },
  { key: 'users', label: 'Users' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'shortlinks', label: 'Short links' },
];

function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('overview');

  return (
    <div className="admin-shell">
      <Seo noindex />
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          menler <span>admin</span>
        </div>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className="admin-btn admin-logout" onClick={onLogout}>Log Out</button>
      </header>

      <main className="admin-main">
        {tab === 'overview' && <Overview />}
        {tab === 'leads' && <LeadsTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'campaigns' && <CampaignsTab />}
        {tab === 'shortlinks' && <ShortLinksTab />}
      </main>
    </div>
  );
}

/* ── Entry ───────────────────────────────────────────────────────────────── */

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null = checking, false/true known

  useEffect(() => {
    adminApi.getSession()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  const logout = async () => {
    try { await adminApi.logout(); } catch { /* ignore */ }
    setAuthed(false);
  };

  if (authed === null) {
    return <div className="admin-login-wrap"><p className="admin-empty">Loading…</p></div>;
  }
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminPanel onLogout={logout} />;
}
