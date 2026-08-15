import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/adminApi';
import Seo from '../components/common/Seo';
import AttendanceTab from '../components/admin/AttendanceTab';

/* Courses offered in the manual-payment form. The paid campaign packs and the
 * library aren't in the client price list (registration for those is free and
 * only the pack is charged), so they're spelled out here with the same slugs
 * the checkout uses — otherwise a hand-added library sale wouldn't group with
 * the ones that came through the website. */
/* Cohort programmes run month by month, so a batch is meaningful for them.
 * A ₹49 library download or a ₹99 pack has no cohort, and demanding one would
 * just get a wrong month picked to clear the form. */
/** "2026-08" -> "Aug 2026". Falls back to the raw value rather than crashing. */
const monthLabel = (m) => {
  if (!/^d{4}-d{2}$/.test(m || '')) return m || '—';
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1, 1)
    .toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const COHORT_COURSES = new Set(['kickstarter', 'generalist', 'generalist-6w', 'engineering']);

const COURSE_OPTIONS = [
  { key: 'kickstarter', label: 'Gen AI Kickstarter', amount: 4999 },
  { key: 'generalist', label: 'Claude AI Generalist Fellowship', amount: 59999 },
  // Slug matches the one Generalist.jsx sends for the full fellowship, with a
  // suffix — the shorter cohort is a different product at a different price and
  // must not be totalled as if it were the same one.
  { key: 'generalist-6w', label: 'Claude AI Generalist — 6 weeks', amount: 35000 },
  // 'engineering' is exactly what Engineering.jsx posts, so sales taken by hand
  // group with the ones that came through the website.
  { key: 'engineering', label: 'Claude AI Engineering Fellowship', amount: 59999 },
  { key: 'build-ai-automation-with-claude', label: 'Build AI Automation with Claude — pack', amount: 99 },
  { key: 'program-and-ops-with-ai', label: 'AI powered Program & Operations — pack', amount: 99 },
  { key: 'library', label: 'Menler Library — single resource', amount: 49 },
];

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
    // Same as the modal: Lenis owns the wheel, so hiding body overflow on its
    // own leaves the page scrolling away underneath an open panel.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <div className="admin-drawer-backdrop" onClick={onClose} data-lenis-prevent>
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

// Leads over a chosen date range (IST). Both ends inclusive; same date twice
// means a single day, which is what this card used to do.
function DayStatCard() {
  const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState(null);

  useEffect(() => {
    let stale = false;
    setData(null);
    adminApi.getDayLeads(from, to)
      .then((r) => { if (!stale) setData(r); })
      .catch(() => { if (!stale) setData({ count: '—' }); });
    return () => { stale = true; };
  }, [from, to]);

  // Quick ranges cover what people actually ask for; the pickers stay for the
  // rest. Each sets both ends, so the two controls never disagree.
  const quick = (days) => {
    const end = new Date(Date.now() + 5.5 * 3600 * 1000);
    const start = new Date(end.getTime() - (days - 1) * 864e5);
    setFrom(start.toISOString().slice(0, 10));
    setTo(end.toISOString().slice(0, 10));
  };

  const label = from === to
    ? 'Leads on'
    : `Leads · ${data?.days ? `${data.days} days` : 'range'}`;

  return (
    <div className="admin-stat" style={{ borderTopColor: 'var(--placed)' }}>
      <div className="admin-stat-value">{data === null ? '…' : data.count}</div>
      <div className="admin-stat-label">
        {label}
        {data?.unique != null && data.unique !== data.count && (
          <span className="admin-muted"> · {data.unique} people</span>
        )}
      </div>

      <div className="admin-stat-range">
        <input className="admin-stat-date" type="date" value={from} max={to || today}
          onChange={(e) => e.target.value && setFrom(e.target.value)}
          aria-label="From date" />
        <span>to</span>
        <input className="admin-stat-date" type="date" value={to} min={from} max={today}
          onChange={(e) => e.target.value && setTo(e.target.value)}
          aria-label="To date" />
      </div>

      <div className="admin-stat-quick">
        <button type="button" onClick={() => quick(1)}>Today</button>
        <button type="button" onClick={() => quick(7)}>7d</button>
        <button type="button" onClick={() => quick(30)}>30d</button>
        <button type="button" onClick={() => quick(90)}>90d</button>
        <button type="button" onClick={() => quick(365)}>1y</button>
      </div>
    </div>
  );
}

function BreakdownList({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const hasUnique = rows.some((r) => r.unique != null);
  return (
    <div className="admin-panel-card">
      <p className="admin-card-title">
        {title}
        {hasUnique && <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}> · unique / total</span>}
      </p>
      {rows.length === 0 && <p className="admin-empty">No data yet.</p>}
      <ul className="admin-breakdown">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="admin-breakdown-label">{r.label}</span>
            <span className="admin-breakdown-bar">
              <span style={{ width: `${(r.count / max) * 100}%` }} />
            </span>
            <span className="admin-breakdown-count">
              {r.unique != null
                ? <>{r.unique}<span style={{ opacity: 0.45, fontWeight: 400 }}> / {r.count}</span></>
                : r.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Campaign-page leads with a per-campaign filter — pick a campaign to see just
// its count, or "All campaigns" for the full breakdown.
function CampaignBreakdown({ rows }) {
  const [picked, setPicked] = useState('');
  const shown = picked ? rows.filter((r) => r.label === picked) : rows;
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <p className="admin-card-title" style={{ margin: 0 }}>
          Campaign page leads
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}> · unique / total</span>
        </p>
        <select className="admin-card-filter" value={picked} onChange={(e) => setPicked(e.target.value)} aria-label="Filter by campaign">
          <option value="">All campaigns</option>
          {rows.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
        </select>
      </div>
      {shown.length === 0 && <p className="admin-empty">No campaign leads yet.</p>}
      <ul className="admin-breakdown">
        {shown.map((r) => (
          <li key={r.label}>
            <span className="admin-breakdown-label">{r.label}</span>
            <span className="admin-breakdown-bar">
              <span style={{ width: `${(r.count / max) * 100}%` }} />
            </span>
            <span className="admin-breakdown-count">
              {r.unique}<span style={{ opacity: 0.45, fontWeight: 400 }}> / {r.count}</span>
            </span>
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
        <StatCard label="Unique leads" value={t.uniqueLeads} accent="var(--specialist)" />
        <DayStatCard />
        <StatCard label="Registrations completed" value={t.checkoutDone} accent="var(--ink)" />
        <StatCard label="Verified leads" value={t.verifiedLeads} accent="var(--lavender)" />
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
        <BreakdownList title="Website leads · by page" rows={stats.websiteByPage || stats.bySource} />
        <CampaignBreakdown rows={stats.byCampaign || []} />
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

// Friendly label for a lead-capture page path, e.g. "/resources" → "Library".
const PAGE_LABELS = {
  '/': 'Home', '/resources': 'Library', '/aptitude': 'Aptitude Test',
  '/generalist': 'Generalist', '/engineering': 'Engineering', '/kickstarter': 'Kickstarter',
  '/checkout': 'Checkout', '/join': 'Join', '/events': 'Events', '/community': 'Community',
};
const pageLabel = (p) => {
  if (PAGE_LABELS[p]) return PAGE_LABELS[p];
  if (p.startsWith('/campaign/')) return `Campaign · ${p.slice('/campaign/'.length)}`;
  return p.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || p;
};

function LeadsTab() {
  const [search, setSearch] = useState('');
  const [pagePath, setPagePath] = useState('');
  const [section, setSection] = useState('');
  const [sections, setSections] = useState([]);
  const [campaignPath, setCampaignPath] = useState('');
  const [campUtms, setCampUtms] = useState([]);
  const [source, setSource] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [checkout, setCheckout] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, page: 1, limit: 25 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [facets, setFacets] = useState({ pages: [], sources: [], utmSources: [] });

  // Pages and campaigns are two dropdowns over the same underlying `page`
  // filter — whichever is picked wins (choosing one clears the other).
  const effectivePage = pagePath || campaignPath;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.getLeads({ search, page_path: effectivePage, section, source, utm_source: utmSource, checkout, from, to, sort, page, limit: 25 });
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [search, effectivePage, section, source, utmSource, checkout, from, to, sort, page]);

  // Picking a page loads that page's sections for the drill-down dropdown.
  useEffect(() => {
    setSection('');
    setSections([]);
    if (!pagePath) return;
    adminApi.getLeadSections(pagePath)
      .then((r) => setSections(r.sections || []))
      .catch(() => {});
  }, [pagePath]);

  // Picking a campaign loads that campaign's UTM sources for its drill-down.
  useEffect(() => {
    setCampUtms([]);
    if (!campaignPath) return;
    adminApi.getLeadUtms(campaignPath)
      .then((r) => setCampUtms(r.utms || []))
      .catch(() => {});
  }, [campaignPath]);

  // Delete a lead (with confirm). Stops the row click so the drawer doesn't open.
  const onDelete = async (e, l) => {
    e.stopPropagation();
    const who = l.name || l.email || l.phone || 'this lead';
    if (!window.confirm(`Delete "${who}"? This permanently removes the lead and cannot be undone.`)) return;
    try {
      await adminApi.deleteLead(l._id);
      load();
    } catch (err) {
      window.alert(err.message || 'Could not delete the lead.');
    }
  };

  useEffect(() => { load(); }, [load]);

  // Build filter dropdown options once — pages from the leads themselves,
  // sources/UTMs from the overview stats.
  useEffect(() => {
    Promise.all([adminApi.getLeadPages(), adminApi.getStats()])
      .then(([p, s]) => setFacets({
        pages: p.pages || [],
        sources: s.bySource.map((x) => x.label).filter((x) => x && x !== '—'),
        utmSources: (s.byUtmSource || []).map((x) => x.label).filter(Boolean),
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
        <select value={pagePath} onChange={(e) => { setPage(1); setPagePath(e.target.value); setCampaignPath(''); setUtmSource(''); }}>
          <option value="">All pages</option>
          {facets.pages.filter((p) => !p.page.startsWith('/campaign/') && p.page !== '/checkout').map((p) => (
            <option key={p.page} value={p.page}>{pageLabel(p.page)} ({p.count})</option>
          ))}
        </select>
        {pagePath && (
          <select value={section} onChange={(e) => { setPage(1); setSection(e.target.value); }}>
            <option value="">All sections</option>
            {sections.map((s) => <option key={s.section} value={s.section}>{s.section} ({s.count})</option>)}
          </select>
        )}
        <select value={campaignPath} onChange={(e) => { setPage(1); setCampaignPath(e.target.value); setPagePath(''); setSection(''); setUtmSource(''); }}>
          <option value="">All campaigns</option>
          {facets.pages.filter((p) => p.page.startsWith('/campaign/')).map((p) => (
            <option key={p.page} value={p.page}>{p.page.slice('/campaign/'.length)} ({p.count})</option>
          ))}
        </select>
        {campaignPath && (
          <select value={utmSource} onChange={(e) => { setPage(1); setUtmSource(e.target.value); }}>
            <option value="">All UTM sources</option>
            <option value="__none__">(No UTM source)</option>
            {campUtms.map((u) => <option key={u.utm} value={u.utm}>{u.utm} ({u.count})</option>)}
          </select>
        )}
        <select value={source} onChange={(e) => { setPage(1); setSource(e.target.value); }}>
          <option value="">All sources</option>
          {facets.sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={utmSource} onChange={(e) => { setPage(1); setUtmSource(e.target.value); }}>
          <option value="">All UTM sources</option>
          <option value="__none__">(No UTM source)</option>
          {facets.utmSources.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={checkout} onChange={(e) => { setPage(1); setCheckout(e.target.value); }}>
          <option value="">All checkout</option>
          <option value="paid">Paid</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
        <select value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }}>
          {LEAD_SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <label className="admin-date"><span>From</span>
          <input type="date" value={from} max={to || undefined} onChange={(e) => { setPage(1); setFrom(e.target.value); }} />
        </label>
        <label className="admin-date"><span>To</span>
          <input type="date" value={to} min={from || undefined} onChange={(e) => { setPage(1); setTo(e.target.value); }} />
        </label>
        {(from || to) && (
          <button className="admin-btn" onClick={() => { setPage(1); setFrom(''); setTo(''); }}>Clear dates</button>
        )}
        <button
          className="admin-btn"
          onClick={() => adminApi.downloadCsv('leads', { search, page_path: effectivePage, section, source, utm_source: utmSource, checkout, from, to })}
        >
          ⭳ Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th>Background</th><th>Source</th><th>Checkout</th><th>Section</th><th>CTA / button</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={10} className="admin-empty">Loading…</td></tr>}
            {!loading && data.rows.length === 0 && (
              <tr><td colSpan={10} className="admin-empty">No leads found.</td></tr>
            )}
            {!loading && data.rows.map((l) => (
              <tr key={l._id} onClick={() => setSelected(l)}>
                <td>{dash(l.name)}</td>
                <td>{dash(l.email)}</td>
                <td>{dash(l.phone)}</td>
                <td className="admin-muted">{dash(l.background)}</td>
                <td>{dash(l.source)}</td>
                <td>
                  {l.extra?.paid_amount
                    ? <span className="admin-badge admin-badge--paid">Paid ₹{l.extra.paid_amount}</span>
                    : l.checkout_completed
                      ? <span className="admin-badge admin-badge--ok">Done</span>
                      : (l.source === 'campaign-workshop' ? <span className="admin-badge">Pending</span> : '—')}
                </td>
                <td className="admin-muted">{dash(l.section)}</td>
                <td className="admin-muted">{dash(l.cta_label || l.resource)}</td>
                <td className="admin-muted">{fmtDate(l.createdAt)}</td>
                <td>
                  <button className="admin-del" title="Delete lead" aria-label="Delete lead" onClick={(e) => onDelete(e, l)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                  </button>
                </td>
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
            ['Checkout completed', selected.checkout_completed ? `Yes${selected.checkout_at ? ' · ' + fmtDate(selected.checkout_at) : ''}` : 'No'],
            ['Paid', selected.extra?.paid_amount ? `₹${selected.extra.paid_amount}${selected.extra.order_id ? ' · ' + selected.extra.order_id : ''}` : 'No'],
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
  const [batch, setBatch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, page: 1, limit: 25 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', email: '', phone: '', amount: '', program: '', otherProgram: '', paid_at: '', batch: '', txn_id: '', note: '',
  });
  const [addErr, setAddErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [ref, setRef] = useState('');
  const [found, setFound] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [verifyRow, setVerifyRow] = useState(null);
  const [verifyRef, setVerifyRef] = useState('');
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyErr, setVerifyErr] = useState('');
  const [verifyDone, setVerifyDone] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await adminApi.getPaidUsers({ search, batch, page, limit: 25 }));
    } finally {
      setLoading(false);
    }
  }, [search, batch, page]);

  useEffect(() => { load(); }, [load]);

  const setF = (k, v) => setAddForm((f) => ({ ...f, [k]: v }));

  const closeAdd = () => {
    setAdding(false);
    setRef(''); setFound(null); setAddErr(''); setManualMode(false);
    setAddForm({ name: '', email: '', phone: '', amount: '', program: '', otherProgram: '', paid_at: '', batch: '', txn_id: '', note: '', });
  };

  // Escape closes it, and the page behind stays put while it's open.
  //
  // body{overflow:hidden} alone isn't enough here: Lenis drives the page from
  // wheel events, so it keeps scrolling the background regardless. It has to be
  // stopped explicitly, and the modal itself carries data-lenis-prevent so the
  // wheel still reaches its own scrollbar.
  useEffect(() => {
    if (!adding) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeAdd(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [adding]);

  const sendPack = async (row) => {
    const who = row.customer_email || row.customer_name || 'this buyer';
    if (!window.confirm(`Email the resource pack to ${who}?`)) return;
    try {
      const r = await adminApi.resendPack(row._id);
      window.alert(`Sent ${r.sent} file${r.sent === 1 ? '' : 's'} to ${r.to}.`);
      load();
    } catch (e) {
      window.alert(e.message || 'Could not send the resources.');
    }
  };

  const openVerify = (row) => {
    // Whatever reference the row already carries is worth trying on its own —
    // a real order id, or the transaction id that was typed in. Only if neither
    // resolves does anyone have to go and fetch something.
    const known = (!/^MANUAL_/.test(row.order_id) && row.order_id)
      || row.extra?.cf_payment_id || row.extra?.txn_id || '';
    setVerifyRow(row);
    setVerifyRef(known);
    setVerifyErr(''); setVerifyDone(null);
    if (known) runExistingVerify(row, known);
  };

  const runExistingVerify = async (row, raw) => {
    const target = row || verifyRow;
    const value = String(raw ?? verifyRef).trim();
    if (!target || !value) return;
    setVerifyBusy(true); setVerifyErr(''); setVerifyDone(null);
    try {
      const res = await adminApi.verifyExisting(target._id, value);
      setVerifyDone(res);
      load();
    } catch (err) {
      setVerifyErr(err.message || 'Could not verify that payment.');
    } finally {
      setVerifyBusy(false);
    }
  };

  const doVerify = async (raw) => {
    const value = String(raw ?? ref).trim();
    if (!value) return;
    setVerifying(true); setAddErr(''); setFound(null);
    try {
      const res = await adminApi.verifyPayment(value);
      if (res.duplicate) {
        setAddErr(`Already recorded — ${res.duplicate.name || 'an existing entry'} has this payment. Adding it again would double-count your revenue.`);
        return;
      }
      setFound(res);
      // Fill in what Cashfree knows. The course is left alone — only you know that.
      const p = res.payment;
      setAddForm((f) => ({
        ...f,
        name: p.customer.name || f.name,
        email: p.customer.email || f.email,
        phone: p.customer.phone || f.phone,
        amount: String(p.amount),
        txn_id: p.cf_payment_id || f.txn_id,
        paid_at: p.paid_at ? new Date(p.paid_at).toISOString().slice(0, 10) : f.paid_at,
      }));
    } catch (err) {
      setAddErr(err.message || 'Could not check that reference.');
    } finally {
      setVerifying(false);
    }
  };

  const saveManual = async (e) => {
    e.preventDefault();
    setAddErr('');
    setSaving(true);
    try {
      const program = addForm.program === '__other'
        ? (addForm.otherProgram || '').trim()
        : addForm.program;
      await adminApi.addPaidUser({
        ...addForm,
        program,
        amount: Number(addForm.amount),
        reference: manualMode ? '' : ref.trim(),
        unverified: manualMode,   // the server refuses a blank reference without this
      });
      closeAdd();
      load();
    } catch (err) {
      setAddErr(err.message || 'Could not add the payment.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (e, r) => {
    e.stopPropagation();
    if (!window.confirm(`Delete the manual entry for "${r.customer_name || r.customer_email}"?`)) return;
    try { await adminApi.deletePaidUser(r._id); load(); }
    catch (err) { window.alert(err.message || 'Could not delete.'); }
  };

  const sum = data.summary || {};
  const cohortCourse = COHORT_COURSES.has(addForm.program);
  // Reuse the programme names already in use, so the same thing doesn't end up
  // recorded three ways ("library", "Library", "libary") and split the reports.
  const programOptions = [...new Set(
    data.rows.map((r) => (r.program || '').trim()).filter((p) => p && p !== 'manual'),
  )].slice(0, 6);

  return (
    <div>
      <div className="admin-money">
        <div className="admin-money-box">
          <span>{search ? 'Revenue (matching)' : 'Total revenue'}</span>
          <b>₹{(sum.revenue || 0).toLocaleString('en-IN')}</b>
        </div>
        <div className="admin-money-box">
          <span>This month</span>
          <b>₹{(sum.thisMonth || 0).toLocaleString('en-IN')}</b>
        </div>
        <div className="admin-money-box">
          <span>Payments</span>
          <b>{(sum.count || 0).toLocaleString('en-IN')}</b>
        </div>
        <div className="admin-money-box">
          <span>Added by hand</span>
          <b>{(sum.manual || 0).toLocaleString('en-IN')}</b>
        </div>
      </div>

      {sum.unverified > 0 && (
        <div className="admin-note admin-note--warn">
          <b>{sum.unverified} payment{sum.unverified === 1 ? '' : 's'} in this list {sum.unverified === 1 ? 'was' : 'were'} typed
          in by hand and never checked.</b>{' '}
          Those amounts may not match what Cashfree actually received. In the <b>Via</b> column
          below, look for the amber{' '}
          <span className="admin-verifybtn admin-verifybtn--inline">
            <span className="admin-verifybtn-dot" aria-hidden="true" />Unverified
            <span className="admin-verifybtn-cta">Verify&nbsp;→</span>
          </span>{' '}
          marker and click it — each one checks itself against Cashfree and corrects the row.
        </div>
      )}

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search name, email, phone, program, order id…"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <select className="admin-search" style={{ flex: '0 0 210px', minWidth: 170 }}
          value={batch} onChange={(e) => { setPage(1); setBatch(e.target.value); }}>
          <option value="">All batches</option>
          {(data.batches || []).map((b) => (
            <option key={b.batch} value={b.batch}>
              {monthLabel(b.batch)} — {b.count} · ₹{b.revenue.toLocaleString('en-IN')}
            </option>
          ))}
          {data.unbatched > 0 && <option value="none">No batch set — {data.unbatched}</option>}
        </select>
        <button className="admin-btn admin-btn--primary" onClick={() => { setAddErr(''); setAdding(true); }}>+ Record a payment</button>
        <button className="admin-btn" onClick={() => adminApi.downloadCsv('paid', { search, batch })}>
          ⭳ Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th>Program</th><th>Batch</th><th>Amount</th><th>Resources</th><th>Via</th><th>Paid on</th><th />
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={10} className="admin-empty">Loading…</td></tr>}
            {!loading && data.rows.length === 0 && (
              <tr><td colSpan={10} className="admin-empty">No paid users yet.</td></tr>
            )}
            {!loading && data.rows.map((r) => (
              <tr key={r._id} onClick={() => setSelected(r)}>
                <td>{dash(r.customer_name)}</td>
                <td>{dash(r.customer_email)}</td>
                <td>{dash(r.customer_phone)}</td>
                <td><span className="admin-pill">{dash(r.program)}</span></td>
                <td>
                  {/* Editable in place: the website never asks which cohort
                      someone is joining, so gateway rows arrive without one. */}
                  <input
                    type="month"
                    className="admin-batchcell"
                    value={r.extra?.batch || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      e.stopPropagation();
                      try { await adminApi.setBatch(r._id, e.target.value); load(); }
                      catch (err) { window.alert(err.message || 'Could not set the batch.'); }
                    }}
                  />
                </td>
                <td><b>₹{r.amount}</b></td>
                <td>
                  {/* Only programmes that ship files can be undelivered. */}
                  {!r.packExpected ? <span className="admin-muted">—</span>
                    : r.packSent
                      ? <span className="admin-badge admin-badge--ok">Sent</span>
                      : (
                        <button type="button" className="admin-verifybtn"
                          title="This buyer never received their playbooks — click to send them now"
                          onClick={(e) => { e.stopPropagation(); sendPack(r); }}>
                          <span className="admin-verifybtn-dot" aria-hidden="true" />
                          Not sent
                          <span className="admin-verifybtn-cta">Send&nbsp;→</span>
                        </button>
                      )}
                </td>
                <td>
                  {!r.extra?.manual
                    ? <span className="admin-badge admin-badge--ok">Website</span>
                    : r.extra?.verified
                      ? <span className="admin-badge admin-badge--ok" title={`Checked against Cashfree${r.extra.verified_at ? ' on ' + fmtDate(r.extra.verified_at) : ''}`}>Link · verified</span>
                      : (
                        // The badge is also the fix, so it has to read as a
                        // control: a verb, an arrow, and a button's affordances.
                        // "unverified" alone states a problem and offers nothing.
                        <button type="button" className="admin-verifybtn"
                          title="This amount was typed in, not confirmed. Click to check it against Cashfree."
                          onClick={(e) => { e.stopPropagation(); openVerify(r); }}>
                          <span className="admin-verifybtn-dot" aria-hidden="true" />
                          Unverified
                          <span className="admin-verifybtn-cta">Verify&nbsp;→</span>
                        </button>
                      )}
                </td>
                <td className="admin-muted">{fmtDate(r.paid_at || r.createdAt)}</td>
                <td>
                  {r.extra?.manual && (
                    <button className="admin-del" title="Delete manual entry" aria-label="Delete manual entry" onClick={(e) => onDelete(e, r)}>🗑</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />

      {selected && (
        <Drawer
          title="Payment detail"
          onClose={() => setSelected(null)}
          fields={[
            ['Name', selected.customer_name],
            ['Email', selected.customer_email],
            ['Phone', selected.customer_phone],
            ['Program', selected.program],
            ['Batch', selected.extra?.batch ? monthLabel(selected.extra.batch) : 'not set'],
            ['Amount', `₹${selected.amount}`],
            ['Status', selected.status],
            ['Via', selected.extra?.manual
              ? `Cashfree payment link${selected.extra?.verified ? ' — verified against Cashfree' : ' — never verified'}`
              : 'Cashfree (paid on the website)'],
            ['Order ID', selected.order_id],
            ['Transaction ID', selected.extra?.cf_payment_id || selected.extra?.txn_id || '—'],
            ['Payment method', selected.extra?.payment_method || '—'],
            ['Paid at', fmtDate(selected.paid_at || selected.createdAt)],
            ...(selected.extra?.verified_at ? [['Verified on', fmtDate(selected.extra.verified_at)]] : []),
            ...(selected.extra?.note ? [['Note', selected.extra.note]] : []),
          ]}
        />
      )}

      {verifyRow && (
        <div className="admin-modal-backdrop" onClick={() => setVerifyRow(null)} role="presentation" data-lenis-prevent>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-labelledby="cf-verify-title">
            <div className="admin-modal-head">
              <div>
                <h2 id="cf-verify-title">Verify against Cashfree</h2>
                <p>{verifyRow.customer_name || verifyRow.customer_email || 'This entry'} · ₹{verifyRow.amount}</p>
              </div>
              <button className="admin-modal-close" onClick={() => setVerifyRow(null)} aria-label="Close">×</button>
            </div>

            <div className="admin-modal-body admin-addpay">
              {verifyDone ? (
                <>
                  <div className="admin-note admin-note--ok">
                    <b>Verified.</b> This row is now marked <b>Link · verified</b>.
                  </div>
                  {(verifyDone.changed?.amount || verifyDone.changed?.name) ? (
                    <div className="admin-note admin-note--warn">
                      <b>Cashfree disagreed with what was typed, and Cashfree wins:</b>
                      <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                        {verifyDone.changed.amount && (
                          <li>Amount ₹{verifyDone.changed.amount.from.toLocaleString('en-IN')} → <b>₹{verifyDone.changed.amount.to.toLocaleString('en-IN')}</b></li>
                        )}
                        {verifyDone.changed.name && (
                          <li>Name “{verifyDone.changed.name.from}” → <b>“{verifyDone.changed.name.to}”</b></li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="admin-addpay-help">Everything on the row matched what Cashfree holds.</p>
                  )}
                  <div className="admin-modal-foot">
                    <button className="admin-btn admin-btn--primary" type="button"
                      onClick={() => setVerifyRow(null)}>Done</button>
                  </div>
                </>
              ) : (
                <>
                  {verifyBusy ? (
                    <p className="admin-addpay-help" style={{ marginTop: 0 }}>
                      Checking <b>{verifyRef}</b> with Cashfree…
                    </p>
                  ) : (
                    <p className="admin-addpay-help" style={{ marginTop: 0 }}>
                      This entry was typed in by hand, so its amount has never been checked.
                      Paste the <b>transaction ID</b> or the <b>Order ID</b> — either is tried
                      against Cashfree, and the amount and payer are replaced with theirs.
                    </p>
                  )}
                  <label className="admin-field"><span>Transaction ID or Order ID</span>
                    <input className="admin-search admin-mono-input" placeholder="5114772211 or order_1739…"
                      value={verifyRef} autoFocus spellCheck="false" disabled={verifyBusy}
                      onChange={(e) => { setVerifyRef(e.target.value); setVerifyErr(''); }}
                      onPaste={(e) => {
                        const pasted = (e.clipboardData || window.clipboardData)?.getData('text') || '';
                        if (pasted.trim()) { e.preventDefault(); setVerifyRef(pasted.trim()); runExistingVerify(null, pasted.trim()); }
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); runExistingVerify(); } }} />
                  </label>
                  {verifyErr && <div className="admin-note admin-note--bad">{verifyErr}</div>}
                  <div className="admin-modal-foot">
                    <button className="admin-btn" type="button" onClick={() => setVerifyRow(null)}>Cancel</button>
                    <button className="admin-btn admin-btn--primary" type="button"
                      onClick={() => runExistingVerify()} disabled={verifyBusy || !verifyRef.trim()}>
                      {verifyBusy ? 'Checking…' : 'Verify'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {adding && (
        <div className="admin-modal-backdrop" onClick={closeAdd} role="presentation" data-lenis-prevent>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-labelledby="cf-modal-title">
            <div className="admin-modal-head">
              <div>
                <h2 id="cf-modal-title">Record a Cashfree payment</h2>
                <p>For money taken through a payment link, not the website.</p>
              </div>
              <button className="admin-modal-close" onClick={closeAdd} aria-label="Close">×</button>
            </div>

            <form onSubmit={saveManual} className="admin-modal-body admin-addpay">
              {/* Verification is the default path, not a shortcut. Pasting is
                  enough — there's nothing to press. The unverified route stays
                  reachable, because a payment you can't find an ID for still
                  happened, but it has to be chosen deliberately. */}
              <div className={`admin-lookup-box ${found ? 'is-ok' : ''}`}>
                <label className="admin-addpay-label" htmlFor="cf-ref">
                  Cashfree Order ID or Transaction ID {manualMode
                    ? <span className="admin-muted">— skipped</span>
                    : <span className="admin-req">*</span>}
                </label>
                <div className="admin-lookup">
                  <input
                    id="cf-ref"
                    className="admin-lookup-input"
                    placeholder="5114772211 or order_1739…"
                    value={ref}
                    disabled={manualMode}
                    spellCheck="false"
                    autoComplete="off"
                    onChange={(e) => { setRef(e.target.value); setFound(null); setAddErr(''); }}
                    onPaste={(e) => {
                      // Verify straight off the paste — waiting for a button press
                      // is a step that exists only because the code needed it to.
                      const pasted = (e.clipboardData || window.clipboardData)?.getData('text') || '';
                      if (pasted.trim()) { e.preventDefault(); setRef(pasted.trim()); doVerify(pasted.trim()); }
                    }}
                    onBlur={() => { if (ref.trim() && !found && !verifying) doVerify(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doVerify(); } }}
                  />
                  <button className="admin-btn" type="button"
                    onClick={() => doVerify()} disabled={!ref.trim() || verifying || manualMode}>
                    {verifying ? 'Checking…' : found ? 'Re-check' : 'Verify'}
                  </button>
                </div>

                {found ? (
                  <p className="admin-lookup-ok">
                    ✓ Verified with Cashfree — ₹{found.payment.amount.toLocaleString('en-IN')} received
                    {found.payment.cf_payment_id ? ` · txn ${found.payment.cf_payment_id}` : ''}.
                    The details below came from Cashfree.
                  </p>
                ) : manualMode ? (
                  <p className="admin-addpay-help">
                    Recording without verification.{' '}
                    <button type="button" className="admin-linkbtn"
                      onClick={() => { setManualMode(false); setAddErr(''); }}>
                      Verify with an Order ID instead
                    </button>
                  </p>
                ) : (
                  <p className="admin-addpay-help">
                    Paste it and it checks itself — no need to press anything. Cashfree
                    dashboard → Payments → open the payment → copy the <b>Order ID</b>.
                  </p>
                )}

                {addErr && <div className="admin-note admin-note--bad" style={{ marginTop: 10, marginBottom: 0 }}>{addErr}</div>}

                {!found && !manualMode && (
                  <p className="admin-addpay-help" style={{ marginTop: 8 }}>
                    <button type="button" className="admin-linkbtn"
                      onClick={() => { setManualMode(true); setRef(''); setFound(null); setAddErr(''); }}>
                      Can’t find the Order ID? Record it unverified
                    </button>
                  </p>
                )}
              </div>

              {manualMode && (
                <div className="admin-note admin-note--warn">
                  <b>Recording without verification.</b> Fill everything in yourself, including
                  the Transaction ID at the bottom — that’s required here, since it’s the only
                  reference tying the row to a real payment. On save it goes into the list like
                  any other, counts towards your revenue, and is marked{' '}
                  <b>Link · unverified</b> so everyone can see the amount was typed rather than
                  read from Cashfree.
                </div>
              )}

              <div className="admin-grid2">
                <label className="admin-field"><span>Full name *</span>
                  <input className="admin-search" required value={addForm.name} readOnly={Boolean(found)}
                    onChange={(e) => setF('name', e.target.value)} />
                </label>
                <label className="admin-field"><span>Email</span>
                  <input className="admin-search" type="email" value={addForm.email} readOnly={Boolean(found)}
                    onChange={(e) => setF('email', e.target.value)} />
                </label>
                <label className="admin-field"><span>Phone</span>
                  <input className="admin-search" value={addForm.phone} readOnly={Boolean(found)}
                    onChange={(e) => setF('phone', e.target.value)} />
                </label>
                <label className="admin-field"><span>Paid on</span>
                  <input className="admin-search" type="date" value={addForm.paid_at} readOnly={Boolean(found)}
                    onChange={(e) => setF('paid_at', e.target.value)} />
                </label>
                <label className="admin-field">
                  <span>Batch month {cohortCourse && <span className="admin-req">*</span>}</span>
                  <input className="admin-search" type="month" value={addForm.batch}
                    required={cohortCourse}
                    onChange={(e) => setF('batch', e.target.value)} />
                  <em className="admin-field-hint">
                    Which monthly cohort they’re joining. Not the same as when they paid —
                    someone paying late in August can still start in September.
                  </em>
                </label>
              </div>

              <label className="admin-field"><span>Course / what they paid for *</span>
                <select className="admin-search" required value={addForm.program}
                  onChange={(e) => {
                    const v = e.target.value;
                    setF('program', v);
                    // Fill the usual price, still editable for part payments.
                    const known = COURSE_OPTIONS.find((c) => c.key === v);
                    if (known && !found) setF('amount', String(known.amount));
                    // Suggest the month they paid in — right most of the time,
                    // and a wrong suggestion is easier to correct than a blank.
                    if (COHORT_COURSES.has(v) && !addForm.batch) {
                      setF('batch', (addForm.paid_at || new Date().toISOString().slice(0, 10)).slice(0, 7));
                    }
                  }}>
                  <option value="">Select a course…</option>
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label} — ₹{c.amount.toLocaleString('en-IN')}</option>
                  ))}
                  {programOptions.filter((p) => !COURSE_OPTIONS.some((c) => c.key === p)).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="__other">Something else…</option>
                </select>
              </label>

              {addForm.program === '__other' && (
                <label className="admin-field"><span>Name it</span>
                  <input className="admin-search" required placeholder="e.g. workshop, mentoring"
                    value={addForm.otherProgram || ''} onChange={(e) => setF('otherProgram', e.target.value)} />
                </label>
              )}

              <label className="admin-field">
                <span>Amount paid (₹) *{found && <em className="admin-field-ok"> — from Cashfree</em>}</span>
                <input className="admin-search" required type="number" min="1" value={addForm.amount}
                  readOnly={Boolean(found)} onChange={(e) => setF('amount', e.target.value)} />
              </label>

              <label className="admin-field">
                <span>
                  Cashfree Transaction ID
                  {found ? <em className="admin-field-ok"> — filled in from Cashfree</em>
                    : <span className="admin-req"> *</span>}
                </span>
                <input className="admin-search admin-mono-input" placeholder="e.g. 5114772211"
                  value={addForm.txn_id} readOnly={Boolean(found)} required={manualMode}
                  onChange={(e) => setF('txn_id', e.target.value)} />
                {!found && (
                  <em className="admin-field-hint">
                    Required when you’re recording without verification — it’s the only thing
                    tying this row back to a real payment, so you can match it against a
                    settlement later. Copy it from the Cashfree dashboard.
                  </em>
                )}
              </label>

              <label className="admin-field"><span>Note <span className="admin-muted">— optional</span></span>
                <input className="admin-search" placeholder="Anything worth remembering"
                  value={addForm.note} onChange={(e) => setF('note', e.target.value)} />
              </label>

              <div className="admin-modal-foot">
                {!found && !manualMode && (
                  <span className="admin-foot-hint">Verify the Order ID above to save.</span>
                )}
                <button className="admin-btn" type="button" onClick={closeAdd}>Cancel</button>
                <button className="admin-btn admin-btn--primary admin-addpay-save" type="submit"
                  disabled={saving || (!found && !manualMode)}>
                  {saving ? 'Saving…' : found ? `Save verified ₹${found.payment.amount.toLocaleString('en-IN')}` : 'Save payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Campaigns tab (per-campaign Zoom link — admin only) ─────────────────── */

/* Who actually turned up to a campaign's Zoom session, and for how long.
 *
 * Read straight from Zoom's report API and matched to the people who registered,
 * so the interesting rows — registered but never joined, joined for four minutes
 * — are visible rather than having to be worked out from two lists. */
function Attendance({ slug, onClose }) {
  const [data, setData] = useState(null);
  const [instances, setInstances] = useState([]);
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let alive = true;
    setLoading(true); setErr('');
    adminApi.zoomAttendance(slug, uuid)
      .then((d) => { if (alive) { setData(d); if (!uuid) setUuid(d.uuid); } })
      .catch((e) => { if (alive) setErr(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [slug, uuid]);

  // Session picker only matters for recurring meetings, so it's fetched
  // separately and simply doesn't appear when there's a single occurrence.
  useEffect(() => {
    adminApi.zoomInstances(slug).then((d) => setInstances(d.instances || [])).catch(() => {});
  }, [slug]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [onClose]);

  const s = data?.summary || {};
  const rows = (data?.rows || []).filter((r) => (
    filter === 'attended' ? r.attended
      : filter === 'noshow' ? !r.attended
        : filter === 'walkin' ? (r.attended && !r.registered)
          : true));

  const clock = (d) => (d ? new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '—');

  const csv = () => {
    const head = ['Name', 'Email', 'Phone', 'Attended', 'Joined', 'Left', 'Minutes', 'Registered'];
    const body = (data?.rows || []).map((r) => [
      r.name, r.email, r.phone, r.attended ? 'yes' : 'no',
      r.joinedAt ? new Date(r.joinedAt).toISOString() : '',
      r.leftAt ? new Date(r.leftAt).toISOString() : '',
      r.minutes, r.registered ? 'yes' : 'no',
    ].map((c) => (/[",\n]/.test(String(c ?? '')) ? `"${String(c).replace(/"/g, '""')}"` : String(c ?? ''))).join(','));
    const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const TABS = [['all', 'Everyone', data?.rows?.length], ['attended', 'Attended', s.attended],
    ['noshow', 'Did not join', s.noShows], ['walkin', 'Not registered', s.walkIns]];

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation" data-lenis-prevent>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-modal-head">
          <div>
            <h2>Session attendance</h2>
            <p>
              {data?.meeting?.topic || slug}
              {data?.meeting?.startTime && ` · ${new Date(data.meeting.startTime).toLocaleString('en-IN')}`}
              {data?.meeting?.durationMinutes ? ` · ran ${data.meeting.durationMinutes} min` : ''}
            </p>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="admin-modal-body">
          {loading && <p className="admin-empty">Asking Zoom…</p>}
          {err && (
            <div className="admin-note admin-note--bad">
              {err}
              <br />
              <span className="admin-muted">
                Zoom only reports on sessions that have finished, and takes about half an hour to settle afterwards.
              </span>
            </div>
          )}

          {!loading && !err && data && (
            <>
              <div className="admin-money">
                <div className="admin-money-box"><span>Attended</span><b>{s.attended}</b></div>
                <div className="admin-money-box"><span>Registered</span><b>{s.registered}</b></div>
                <div className="admin-money-box"><span>Did not join</span><b>{s.noShows}</b></div>
                <div className="admin-money-box"><span>Avg time</span><b>{s.avgMinutes}<span style={{ fontSize: 14 }}> min</span></b></div>
              </div>

              <div className="admin-toolbar">
                <div className="bl-tabs">
                  {TABS.map(([k, label, n]) => (
                    <button key={k} className={`bl-tab ${filter === k ? 'is-on' : ''}`} onClick={() => setFilter(k)}>
                      {label} {n !== undefined && <em>{n}</em>}
                    </button>
                  ))}
                </div>
                {instances.length > 1 && (
                  <select className="admin-search" style={{ flex: '0 0 230px' }}
                    value={uuid} onChange={(e) => setUuid(e.target.value)}>
                    {instances.map((i) => (
                      <option key={i.uuid} value={i.uuid}>
                        {new Date(i.start_time).toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                )}
                <button className="admin-btn" onClick={csv}>⭳ Export CSV</button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Joined</th><th>Left</th><th>Time in call</th><th /></tr>
                  </thead>
                  <tbody>
                    {!rows.length && <tr><td colSpan={6} className="admin-empty">Nobody in this group.</td></tr>}
                    {rows.map((r, i) => (
                      <tr key={(r.email || r.name) + i}>
                        <td><b>{r.name || '—'}</b></td>
                        <td className="admin-muted">{r.email || '—'}</td>
                        <td>{clock(r.joinedAt)}</td>
                        <td>{clock(r.leftAt)}</td>
                        <td>
                          {r.attended ? <b>{r.minutes} min</b> : <span className="admin-muted">—</span>}
                          {r.sessions > 1 && <><br /><span className="admin-muted" style={{ fontSize: 11.5 }}>rejoined {r.sessions}×</span></>}
                        </td>
                        <td>
                          {!r.attended && <span className="admin-badge admin-badge--warn">Did not join</span>}
                          {r.attended && !r.registered && <span className="admin-badge">Not registered</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="admin-muted" style={{ fontSize: 12, marginTop: 10 }}>
                Matched on email, so somebody who joined Zoom with a different address shows as
                “Not registered”. Rejoins are merged — the time shown is total minutes connected.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CampaignsTab() {
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({}); // slug -> zoom link being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingSlug, setSavingSlug] = useState('');
  const [savedSlug, setSavedSlug] = useState('');
  const [attendanceSlug, setAttendanceSlug] = useState(null);
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
                  {r.zoomLink && (
                    <button className="admin-btn" style={{ marginLeft: 6 }}
                      onClick={() => setAttendanceSlug(r.slug)}>
                      Attendance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendanceSlug && (
        <Attendance slug={attendanceSlug} onClose={() => setAttendanceSlug(null)} />
      )}
    </div>
  );
}

/* ── Short links tab (branded URL shortener — admin only) ────────────────── */

// Where the short links live. Defaults to the API origin + /MNLRAI so links
// work out of the box; set VITE_SHORT_BASE to "https://go.menler.in/MNLRAI"
// once that subdomain points at the API.
const SHORT_BASE = (import.meta.env.VITE_SHORT_BASE || '').trim()
  || `${(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')}/MNLRAI`;

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

/* ── Certificates ────────────────────────────────────────────────────────── */

/** Minimal RFC-4180-ish parser — handles quoted fields, commas and tabs. */
function parseDelimited(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const delim = text.split('\n')[0].includes('\t') ? '\t' : ',';

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === delim) { row.push(field); field = ''; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field); field = '';
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pulls {name,email} out of a parsed sheet, with or without a header row. */
function toRecipients(rows) {
  if (!rows.length) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const nameIdx = header.findIndex((h) => /^(name|full ?name|participant|student)$/.test(h));
  const emailIdx = header.findIndex((h) => /^(e-?mail|email ?address)$/.test(h));
  const hasHeader = nameIdx !== -1 || emailIdx !== -1;

  const body = hasHeader ? rows.slice(1) : rows;
  // No header — fall back to "whichever column looks like an email".
  const guessEmail = (r) => r.findIndex((c) => EMAIL_RE.test(c.trim()));

  return body
    .map((r) => {
      const ei = emailIdx !== -1 ? emailIdx : guessEmail(r);
      const ni = nameIdx !== -1 ? nameIdx : r.findIndex((c, i) => i !== ei && c.trim());
      return { name: (r[ni] || '').trim(), email: (r[ei] || '').trim().toLowerCase() };
    })
    .filter((r) => r.name || r.email);
}

// Kept in sync with the server defaults in server/utils/certificate.js.
const DEFAULT_EMAIL_HEADING = 'Hi {first_name},';
const DEFAULT_EMAIL_MESSAGE = [
  "We're glad you made it to Menler Live Masterclass — **{program}**",
  "Your certificate of participation is attached. It's yours to keep, share, and add to your LinkedIn profile.",
  'Before you go, we have one small ask.',
  'Tell us how the session was for you. Honestly. It takes just a minute, and every response helps us make the next session better.',
].join('\n\n');
const DEFAULT_EMAIL_CLOSING = [
  "If today's session sparked something for you, here's where to go next.",
  'Menler Claude AI Generalist Fellowship is designed to take you from where you are today to where AI-native professionals are headed.',
].join('\n\n');

function CertificatesTab() {
  const [programName, setProgramName] = useState('');
  const [mentorName, setMentorName] = useState('Nitin K Sethi');
  const [mentorRole, setMentorRole] = useState('Ex-McKinsey | MIT & UT Mentor');
  const [founderName, setFounderName] = useState('Sachin Roy');
  const [founderRole, setFounderRole] = useState('Founder, Menler');
  const [oneSignature, setOneSignature] = useState(false);
  const [subject, setSubject] = useState('');
  const [emailHeading, setEmailHeading] = useState(DEFAULT_EMAIL_HEADING);
  const [emailMessage, setEmailMessage] = useState(DEFAULT_EMAIL_MESSAGE);
  const [emailClosing, setEmailClosing] = useState(DEFAULT_EMAIL_CLOSING);
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [deckUrl, setDeckUrl] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(null);
  const [mail, setMail] = useState(null);

  const checkMail = async () => {
    setMail({ checking: true });
    try {
      const s = await adminApi.mailStatus();
      setMail(s.ok
        ? { ok: true, msg: 'Email server connected — sending will work.' }
        : { ok: false, msg: s.error || 'Email server is not reachable.' });
    } catch (err) {
      setMail({ ok: false, msg: err.message || 'Could not check the email server.' });
    }
  };

  const valid = recipients.filter((r) => r.name && EMAIL_RE.test(r.email));
  const invalid = recipients.filter((r) => !(r.name && EMAIL_RE.test(r.email)));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResults(null);
    try {
      // .xlsx/.xls are zip/OLE binaries — read as text they parse into garbage
      // rows rather than failing, so reject them up front with a clear fix.
      if (/\.xlsx?$/i.test(file.name)) {
        throw new Error('Excel files aren’t supported yet. In Excel: File → Save As → CSV (Comma delimited), then upload that .csv.');
      }
      const list = toRecipients(parseDelimited(await file.text()));
      if (!list.length) throw new Error('No rows found — the file needs a name and an email per participant.');
      if (!list.some((r) => EMAIL_RE.test(r.email))) {
        throw new Error('No email addresses found in that file. It needs a column of emails alongside the names.');
      }
      setRecipients(list);
      setFileName(file.name);
    } catch (err) {
      setRecipients([]);
      setFileName('');
      setError(err.message || 'Could not read that file.');
    }
    e.target.value = ''; // let the same file be picked again
  };

  const preview = async () => {
    setError('');
    if (!programName.trim()) return setError('Enter the program name first.');
    setBusy('preview');
    try {
      await adminApi.previewCertificate({
        name: valid[0]?.name || 'Your Name',
        programName: programName.trim(),
        ...(oneSignature ? { mentorName: '', mentorRole: '' } : { mentorName, mentorRole }),
        founderName, founderRole,
      });
    } catch (err) {
      setError(err.message || 'Could not generate the preview.');
    } finally {
      setBusy('');
    }
  };

  const previewEmail = async () => {
    setError('');
    if (!programName.trim()) return setError('Enter the program name first.');
    setBusy('email');
    try {
      await adminApi.previewCertificateEmail({
        name: valid[0]?.name || 'Aarav Sharma',
        programName: programName.trim(),
        emailHeading, emailMessage, emailClosing, feedbackUrl, deckUrl,
      });
    } catch (err) {
      setError(err.message || 'Could not preview the email.');
    } finally {
      setBusy('');
    }
  };

  // Each certificate costs ~0.2s to render plus an SMTP round trip, so a whole
  // cohort in one request would run for minutes and trip the gateway timeout —
  // the browser would error while mail kept going out, and a retry would send
  // twice. Sending in small batches keeps every request short and lets results
  // land incrementally, so a failure halfway is visible and recoverable.
  const CHUNK = 20;

  const send = async () => {
    setError('');
    setBusy('send');
    setConfirming(false);

    const done = [];
    const tally = (list) => ({
      sent: list.filter((r) => r.ok).length,
      failed: list.filter((r) => !r.ok).length,
      results: [...list],
    });

    try {
      for (let i = 0; i < valid.length; i += CHUNK) {
        setProgress({ done: i, total: valid.length });
        const r = await adminApi.sendCertificates({
          recipients: valid.slice(i, i + CHUNK),
          programName: programName.trim(),
          ...(oneSignature ? { mentorName: '', mentorRole: '' } : { mentorName, mentorRole }),
        founderName, founderRole,
          subject: subject.trim(),
          emailHeading, emailMessage, emailClosing, feedbackUrl, deckUrl,
        });
        done.push(...(r.results || []));
        setResults(tally(done));
      }
      setProgress(null);
    } catch (err) {
      setResults(tally(done));
      setError(
        `Stopped after ${done.length} of ${valid.length}. ${err.message || 'Request failed.'} ` +
        'Everyone marked “Sent” below did receive their certificate — use “Remove already-sent” before retrying so nobody gets two.',
      );
    } finally {
      setBusy('');
      setProgress(null);
    }
  };

  // Retry-safe: drops the recipients that already went out.
  const dropSent = () => {
    const sent = new Set((results?.results || []).filter((r) => r.ok).map((r) => r.email));
    setRecipients((rs) => rs.filter((r) => !sent.has(r.email)));
    setResults(null);
  };

  return (
    <div>
      <div className="admin-panel-card" style={{ marginBottom: 16 }}>
        <p className="admin-card-title">Certificate details</p>
        <p className="admin-empty" style={{ textAlign: 'left', margin: '0 0 12px' }}>
          Upload a participants <b>.csv</b> (in Excel/Sheets: <i>File → Save As → CSV</i>) with a <b>name</b> and an <b>email</b> column — names are picked up automatically, with or without a header row.
          Each participant gets their own certificate PDF, emailed to them. <b>Always hit Preview first.</b>
        </p>
        <div className="admin-toolbar">
          <input className="admin-search" style={{ flex: 1 }} placeholder="Program name — printed on the certificate" value={programName} onChange={(e) => setProgramName(e.target.value)} />
        </div>
        <label className="admin-onesig">
          <input type="checkbox" checked={oneSignature}
            onChange={(e) => setOneSignature(e.target.checked)} />
          <span>
            <b>One signature only</b>
            <em>Tick this when the founder ran the session himself — the left signature is
              left off entirely and only the right one is printed.</em>
          </span>
        </label>

        <div className="admin-toolbar" style={{ marginTop: 10 }}>
          {/* Hidden rather than disabled when unused: a greyed-out name still
              reads as "this will be printed", which is the confusion here. */}
          {!oneSignature && (
            <>
              <input className="admin-search" style={{ maxWidth: 170 }} placeholder="Left signature name" value={mentorName} onChange={(e) => setMentorName(e.target.value)} />
              <input className="admin-search" style={{ flex: 1 }} placeholder="Left signature role" value={mentorRole} onChange={(e) => setMentorRole(e.target.value)} />
            </>
          )}
          <input className="admin-search" style={{ maxWidth: 170 }} placeholder={oneSignature ? 'Signature name' : 'Right signature name'} value={founderName} onChange={(e) => setFounderName(e.target.value)} />
          <input className="admin-search" style={{ flex: 1 }} placeholder={oneSignature ? 'Signature role' : 'Right signature role'} value={founderRole} onChange={(e) => setFounderRole(e.target.value)} />
        </div>
        <div className="admin-toolbar" style={{ marginTop: 10 }}>
          <input className="admin-search" style={{ flex: 2 }} placeholder="Email subject (optional — defaults to “Your … certificate”)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <label className="admin-btn" style={{ cursor: 'pointer' }}>
            {fileName ? `📄 ${fileName}` : '⬆ Upload participants file'}
            <input type="file" accept=".csv,.tsv,.txt,text/csv" onChange={onFile} style={{ display: 'none' }} />
          </label>
          <button className="admin-btn" onClick={preview} disabled={busy === 'preview'}>
            {busy === 'preview' ? 'Rendering…' : '👁 Preview certificate'}
          </button>
          <button className="admin-btn" onClick={checkMail} disabled={mail?.checking}>
            {mail?.checking ? 'Checking…' : '✉ Check email connection'}
          </button>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid #ECECF2', paddingTop: 16 }}>
          <p className="admin-card-title" style={{ margin: '0 0 4px' }}>Email write-up</p>
          <p className="admin-empty" style={{ textAlign: 'left', margin: '0 0 12px' }}>
            The message that goes in the email body (the certificate PDF is always attached). Use <b>{'{first_name}'}</b>, <b>{'{name}'}</b> and <b>{'{program}'}</b> — they’re filled in per person. <b>{'**bold**'}</b> works, and a blank line starts a new paragraph.
          </p>
          <input
            className="admin-search"
            style={{ width: '100%', marginBottom: 10 }}
            placeholder="Email heading"
            value={emailHeading}
            onChange={(e) => setEmailHeading(e.target.value)}
          />
          <textarea
            className="admin-search"
            style={{ width: '100%', minHeight: 120, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            placeholder="Email message"
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
          <input
            className="admin-search"
            style={{ width: '100%', marginTop: 10 }}
            type="url"
            placeholder="Feedback form link (leave blank to hide the feedback button)"
            value={feedbackUrl}
            onChange={(e) => setFeedbackUrl(e.target.value)}
          />
          <input
            className="admin-search"
            style={{ width: '100%', marginTop: 10 }}
            type="url"
            placeholder="Session slides link (leave blank to hide the “Download the session slides” button)"
            value={deckUrl}
            onChange={(e) => setDeckUrl(e.target.value)}
          />
          <textarea
            className="admin-search"
            style={{ width: '100%', minHeight: 90, marginTop: 10, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            placeholder="Closing copy — shown above the “Explore program and enroll” button"
            value={emailClosing}
            onChange={(e) => setEmailClosing(e.target.value)}
          />
          <div className="admin-toolbar" style={{ marginTop: 10 }}>
            <button className="admin-btn" onClick={previewEmail} disabled={busy === 'email'}>
              {busy === 'email' ? 'Rendering…' : '👁 Preview email'}
            </button>
            <button
              className="admin-btn"
              onClick={() => { setEmailHeading(DEFAULT_EMAIL_HEADING); setEmailMessage(DEFAULT_EMAIL_MESSAGE); setEmailClosing(DEFAULT_EMAIL_CLOSING); }}
            >
              ↺ Reset to default
            </button>
          </div>
        </div>
        {mail && !mail.checking && (
          <p className="admin-empty" style={{ textAlign: 'left', margin: '10px 0 0', color: mail.ok ? '#1D9E75' : undefined }}>
            {mail.ok ? '✓ ' : '⚠ '}{mail.msg}
          </p>
        )}
      </div>

      {error && <p className="admin-empty">{error}</p>}

      {recipients.length > 0 && (
        <>
          <div className="admin-toolbar" style={{ marginBottom: 12, alignItems: 'center' }}>
            <span className="admin-muted">
              <b>{valid.length}</b> ready to send{invalid.length ? ` · ${invalid.length} skipped (missing name or invalid email)` : ''}
            </span>
            <span style={{ flex: 1 }} />
            {results?.sent > 0 && (
              <button className="admin-btn" onClick={dropSent}>Remove already-sent ({results.sent})</button>
            )}
            <button className="admin-btn" onClick={() => { setRecipients([]); setFileName(''); setResults(null); }}>Clear list</button>
            <button
              className="admin-btn admin-btn--primary"
              disabled={!valid.length || !programName.trim() || busy === 'send'}
              onClick={() => setConfirming(true)}
            >
              {busy === 'send'
                ? `Sending… ${progress ? `${progress.done}/${progress.total}` : ''}`
                : `✉ Send ${valid.length} certificate${valid.length === 1 ? '' : 's'}`}
            </button>
          </div>

          {confirming && (
            <div className="admin-panel-card" style={{ marginBottom: 12, borderColor: '#E0B23C' }}>
              <p className="admin-card-title">Send for real?</p>
              <p className="admin-empty" style={{ textAlign: 'left', margin: '0 0 12px' }}>
                This emails <b>{valid.length}</b> {valid.length === 1 ? 'person' : 'people'} a certificate for <b>{programName.trim()}</b>. It can't be undone — make sure you've previewed the design.
                {valid.length > CHUNK && <> Sending goes out in batches of {CHUNK}, so keep this tab open until it finishes.</>}
              </p>
              <button className="admin-btn admin-btn--primary" onClick={send}>Yes, send them</button>{' '}
              <button className="admin-btn" onClick={() => setConfirming(false)}>Cancel</button>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th /></tr></thead>
              <tbody>
                {recipients.map((r, i) => {
                  const res = results?.results?.find((x) => x.email === r.email && x.name === r.name);
                  const ok = r.name && EMAIL_RE.test(r.email);
                  return (
                    <tr key={`${r.email}-${i}`}>
                      <td className="admin-muted">{i + 1}</td>
                      <td>
                        <input className="admin-search" style={{ width: '100%', minWidth: 160 }} value={r.name}
                          onChange={(e) => setRecipients((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                      </td>
                      <td>
                        <input className="admin-search" style={{ width: '100%', minWidth: 200 }} value={r.email}
                          onChange={(e) => setRecipients((rs) => rs.map((x, j) => (j === i ? { ...x, email: e.target.value.trim() } : x)))} />
                      </td>
                      <td className="admin-muted" style={{ whiteSpace: 'nowrap' }}>
                        {res ? (res.ok ? `✓ Sent · ${res.certId}` : `✗ ${res.error}`) : ok ? 'Ready' : 'Needs fixing'}
                      </td>
                      <td>
                        <button className="admin-btn" onClick={() => setRecipients((rs) => rs.filter((_, j) => j !== i))}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {results && (
        <p className="admin-empty" style={{ marginTop: 12 }}>
          Done — <b>{results.sent}</b> sent{results.failed ? `, ${results.failed} failed` : ''}.
        </p>
      )}
    </div>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'leads', label: 'Leads' },
  { key: 'users', label: 'Paid users' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'shortlinks', label: 'Short links' },
  { key: 'certificates', label: 'Certificates' },
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
        {tab === 'certificates' && <CertificatesTab />}
        {tab === 'attendance' && <AttendanceTab />}
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
