import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { sanityClient } from '../../lib/sanity';

/* Overview additions: money in, and how each upcoming masterclass is doing.
   Plus the search that sits in the top bar. All read-only. */

const inr = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');

/* ── Revenue ────────────────────────────────────────────────────────────── */

export function RevenueCards() {
  const [r, setR] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getRevenue().then(setR).catch((e) => setError(e.message)); }, []);

  if (error) return <p className="admin-empty">{error}</p>;
  if (!r) return <p className="admin-empty">Loading revenue…</p>;

  const card = (label, v, note) => (
    <div className="admin-stat" style={{ borderTopColor: '#1D9E75' }}>
      <div className="admin-stat-value">{inr(v.amount)}</div>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-note">{note || `${v.count} payment${v.count === 1 ? '' : 's'}`}</div>
    </div>
  );

  return (
    <div className="admin-panel-card">
      <p className="admin-card-title">Revenue</p>
      <div className="admin-stat-grid admin-rev-grid">
        {card('Today', r.today)}
        {card('Last 7 days', r.last7)}
        {card('Last 30 days', r.last30)}
        {card('All time', r.allTime)}
      </div>
      <div className="admin-rev-split">
        <span className="admin-muted">Last 30 days by product:</span>
        {r.byCategory30.map((c) => (
          <span key={c.key} className="admin-rev-chip">{c.label} <b>{inr(c.amount)}</b> · {c.count}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Upcoming masterclasses ─────────────────────────────────────────────── */

// The same campaigns the Events page lists as Live, soonest first. Sessions
// stay on the panel until a day after they start, so tonight's still shows.
const UPCOMING_QUERY = `*[_type == "campaignPage" && isLiveEvent == true && hideFromEvents != true && defined(eventStart) && eventStart > $since] | order(eventStart asc){
  title, "slug": slug.current, date, time, eventStart, bannerLine1, bannerLine2
}`;

const daysUntil = (iso) => {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 'Today / live';
  const d = Math.ceil(ms / (24 * 60 * 60 * 1000));
  return d === 1 ? 'Tomorrow' : `In ${d} days`;
};

export function UpcomingMasterclasses() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sanityClient) return;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    sanityClient
      .fetch(UPCOMING_QUERY, { since })
      .then(async (camps) => {
        const slugs = camps.map((c) => c.slug).filter(Boolean);
        const { stats } = slugs.length ? await adminApi.getCampaignStats(slugs) : { stats: {} };
        setRows(camps.map((c) => ({ ...c, s: stats[c.slug] || {} })));
      })
      .catch((e) => setError(e.message || 'Could not load masterclasses.'));
  }, []);

  if (!sanityClient) return <p className="admin-empty">Sanity is not configured.</p>;
  if (error) return <p className="admin-empty">{error}</p>;
  if (!rows) return <p className="admin-empty">Loading masterclasses…</p>;

  return (
    <div className="admin-panel-card">
      <p className="admin-card-title">Upcoming masterclasses</p>
      {rows.length === 0 ? (
        <p className="admin-empty">No live masterclasses scheduled.</p>
      ) : (
        <div className="admin-up-grid">
          {rows.map((c) => {
            const name = [c.bannerLine1, c.bannerLine2].filter(Boolean).join(' ').trim() || c.title;
            return (
              <div className="admin-up-card" key={c.slug}>
                <div className="admin-up-head">
                  <span className="admin-up-when">{daysUntil(c.eventStart)}</span>
                  <a className="admin-up-link" href={`/campaign/${c.slug}`} target="_blank" rel="noreferrer">Open page ↗</a>
                </div>
                <p className="admin-up-title">{name}</p>
                <p className="admin-muted">{c.date} · {c.time}</p>
                <div className="admin-up-nums">
                  <div><b>{c.s.registrations ?? 0}</b><span>Registered</span></div>
                  <div><b>+{c.s.today ?? 0}</b><span>Today</span></div>
                  <div><b>{c.s.completed ?? 0}</b><span>Completed</span></div>
                  <div><b>{c.s.packs ?? 0}</b><span>₹99 packs · {inr(c.s.revenue)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Search ─────────────────────────────────────────────────────────────── */

const when = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');

export function SearchResults({ q }) {
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');

  // Waits for typing to pause, then searches. A result for an older query is
  // never shown for the current one (res.q is checked below).
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      adminApi.search(q)
        .then((r) => { if (live) { setRes(r); setError(''); } })
        .catch((e) => { if (live) setError(e.message); });
    }, 300);
    return () => { live = false; clearTimeout(t); };
  }, [q]);

  if (error) return <p className="admin-empty">{error}</p>;
  if (!res || res.q !== q) return <p className="admin-empty">Searching for “{q}”…</p>;

  const none = !res.leads.length && !res.payments.length && !res.users.length;
  return (
    <div className="admin-overview">
      <p className="admin-muted">Results for “{res.q}” — leads, payments and accounts.</p>
      {none && <p className="admin-empty">Nothing matches. Try part of an email, a name or the last digits of a phone number.</p>}

      {res.payments.length > 0 && (
        <div className="admin-panel-card">
          <p className="admin-card-title">Payments ({res.payments.length})</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Phone</th><th>For</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {res.payments.map((o) => (
                  <tr key={o.order_id}>
                    <td>{when(o.paid_at || o.createdAt)}</td><td>{o.customer_name}</td><td>{o.customer_email}</td>
                    <td>{o.customer_phone}</td><td>{o.program}</td><td>{inr(o.amount)}</td><td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {res.leads.length > 0 && (
        <div className="admin-panel-card">
          <p className="admin-card-title">Leads & registrations ({res.leads.length})</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Phone</th><th>From</th><th>Completed</th></tr></thead>
              <tbody>
                {res.leads.map((l) => (
                  <tr key={l._id}>
                    <td>{when(l.createdAt)}</td><td>{l.name}</td><td>{l.email}</td><td>{l.phone}</td>
                    <td>{l.extra?.workshop || l.extra?.campaign || l.section || l.source}</td>
                    <td>{l.checkout_completed ? 'Yes' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {res.users.length > 0 && (
        <div className="admin-panel-card">
          <p className="admin-card-title">Accounts ({res.users.length})</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Joined</th><th>Name</th><th>Email</th><th>Phone</th><th>Sign-in</th></tr></thead>
              <tbody>
                {res.users.map((u) => (
                  <tr key={u._id}>
                    <td>{when(u.createdAt)}</td><td>{u.fullName}</td><td>{u.email}</td><td>{u.phone}</td>
                    <td>{u.provider}{u.emailVerified ? ' · verified' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
