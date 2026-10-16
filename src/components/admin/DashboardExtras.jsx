import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { sanityClient } from '../../lib/sanity';

/* Overview additions: how each upcoming masterclass is doing, plus the
   search that sits in the top bar. All read-only. */

const inr = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');

/* ── Upcoming masterclasses ─────────────────────────────────────────────── */

// The same campaigns the Events page lists as Live, soonest first. Sessions
// stay on the panel until a day after they start, so tonight's still shows.
const UPCOMING_QUERY = `*[_type == "campaignPage" && isLiveEvent == true && hideFromEvents != true && defined(eventStart) && eventStart > $since] | order(eventStart asc){
  title, "slug": slug.current, date, time, eventStart, bannerLine1, bannerLine2
}`;

// Calendar days in India, not hours rounded up — a session at 7 PM tonight
// is "Today" at 1 AM, not "Tomorrow".
const IST = 'Asia/Kolkata';
const istDay = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: IST });
const daysUntil = (iso) => {
  const start = new Date(iso);
  if (start.getTime() <= Date.now()) return { label: 'Live / ended', tone: 'live' };
  const diff = Math.round((new Date(istDay(start)) - new Date(istDay(new Date()))) / 86400000);
  if (diff <= 0) return { label: 'Today', tone: 'today' };
  if (diff === 1) return { label: 'Tomorrow', tone: 'soon' };
  return { label: `In ${diff} days`, tone: diff <= 7 ? 'soon' : 'later' };
};
const startsAt = (iso) => new Date(iso).toLocaleString('en-IN', {
  timeZone: IST, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
});

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
            const due = daysUntil(c.eventStart);
            const reg = c.s.registrations ?? 0;
            const done = c.s.completed ?? 0;
            const pct = reg ? Math.round((done / reg) * 100) : 0;
            return (
              <div className={`admin-up-card admin-up-card--${due.tone}`} key={c.slug}>
                <div className="admin-up-head">
                  <span className={`admin-up-when admin-up-when--${due.tone}`}>{due.label}</span>
                  <span className="admin-up-date">{startsAt(c.eventStart)}</span>
                </div>
                <p className="admin-up-title">{name}</p>

                <div className="admin-up-main">
                  <b>{reg}</b>
                  <span>registered</span>
                  <span className={`admin-up-today${c.s.today ? ' on' : ''}`}>+{c.s.today ?? 0} today</span>
                </div>
                <div className="admin-up-bar" title={`${done} of ${reg} completed checkout`}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <p className="admin-up-sub">{done} completed checkout{reg ? ` · ${pct}%` : ''}</p>

                <div className="admin-up-foot">
                  <span>Pack sales <b>{inr(c.s.revenue)}</b> · {c.s.packs ?? 0} sold</span>
                  <a className="admin-up-link" href={`/campaign/${c.slug}`} target="_blank" rel="noreferrer">Open page ↗</a>
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
