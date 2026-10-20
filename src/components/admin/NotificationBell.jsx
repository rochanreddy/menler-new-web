import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi } from '../../lib/adminApi';

/* The bell in the admin header: failed or abandoned Cashfree payments and
   emails that did not go out (server/utils/notify.js). Checks every minute and
   whenever the tab comes back into focus; the red count is the unread alerts.
   Opening an alert marks it read. */

const KIND = {
  payment_failed: { icon: '₹', tone: 'bad' },
  payment_dropped: { icon: '₹', tone: 'warn' },
  email_failed: { icon: '@', tone: 'bad' },
  email_bounced: { icon: '@', tone: 'warn' },
};

function ago(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await adminApi.getNotifications();
      setItems(data.items || []);
      setUnread(data.unread || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load alerts.');
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const t = setInterval(load, 60_000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { clearTimeout(first); clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, [load]);

  // Close on a click outside or Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const markOne = async (n) => {
    if (n.read) return;
    setItems((list) => list.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    setUnread((u) => Math.max(0, u - 1));
    try { await adminApi.markNotificationsRead(n._id); } catch { load(); }
  };

  const markAll = async () => {
    setItems((list) => list.map((x) => ({ ...x, read: true })));
    setUnread(0);
    try { await adminApi.markNotificationsRead(); } catch { load(); }
  };

  return (
    <div className="admin-bell" ref={wrapRef}>
      <button
        type="button"
        className={`admin-bell-btn${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Alerts, ${unread} unread` : 'Alerts'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && <span className="admin-bell-count">{unread > 99 ? '99+' : unread}</span>}
      </button>

      {open && (
        <div className="admin-bell-panel" role="dialog" aria-label="Alerts">
          <div className="admin-bell-head">
            <strong>Alerts</strong>
            {unread > 0 && <button type="button" onClick={markAll}>Mark all read</button>}
          </div>
          {error && <p className="admin-bell-empty">{error}</p>}
          {!error && items.length === 0 && (
            <p className="admin-bell-empty">No alerts. Failed payments and emails that don&rsquo;t go out will show here.</p>
          )}
          <ul className="admin-bell-list">
            {items.map((n) => {
              const k = KIND[n.kind] || { icon: '!', tone: 'warn' };
              return (
                <li key={n._id}>
                  <button type="button" className={`admin-bell-item${n.read ? '' : ' is-unread'}`} onClick={() => markOne(n)}>
                    <span className={`admin-bell-icon is-${k.tone}`} aria-hidden="true">{k.icon}</span>
                    <span className="admin-bell-text">
                      <span className="admin-bell-title">
                        {n.title}
                        {n.resolved && <em className="admin-bell-resolved">Paid later</em>}
                      </span>
                      <span className="admin-bell-detail">{n.detail}</span>
                      <span className="admin-bell-time">{ago(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
