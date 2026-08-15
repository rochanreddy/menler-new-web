import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';

/* Class attendance, per campaign.
 *
 * Pick a campaign, see everyone Zoom recorded plus everyone who registered and
 * never showed, and take the whole thing away as a CSV. The Zoom link lives on
 * this page too — attendance is the only reason the link is stored, so being
 * sent to another tab to add one before this page will work is pure friction. */

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const clock = (d) => (d ? new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '—');

export default function AttendanceTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [slug, setSlug] = useState('');
  const [link, setLink] = useState('');
  const [savingLink, setSavingLink] = useState(false);
  const [zoomList, setZoomList] = useState([]);
  const [suggested, setSuggested] = useState('');
  const [zoomListErr, setZoomListErr] = useState('');
  const [relink, setRelink] = useState(false);

  const [data, setData] = useState(null);
  const [instances, setInstances] = useState([]);
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  const loadCampaigns = useCallback(() => {
    adminApi.getCampaigns()
      .then((d) => {
        // Newest first. The API already sorts this way, but the order matters
        // enough here — you almost always want the class that just ran — that
        // it's worth not depending on a caller staying sorted.
        const rows = [...(d.rows || d.campaigns || [])].sort((a, b) => {
          const ta = a.lastLeadAt ? +new Date(a.lastLeadAt) : 0;
          const tb = b.lastLeadAt ? +new Date(b.lastLeadAt) : 0;
          return tb - ta;
        });
        setCampaigns(rows);
        // Preselect the most recent one: it's the reason this page is open.
        // Set functionally rather than reading `slug`, which would make this
        // callback depend on state it also writes — a refetch loop.
        if (rows.length) setSlug((prev) => prev || rows[0].slug);
      })
      .catch((e) => setErr(e.message));
  }, []);
  useEffect(loadCampaigns, [loadCampaigns]);

  const current = campaigns.find((c) => c.slug === slug);

  // Reset per-campaign state whenever the selection changes, so a previous
  // campaign's table can't sit under a new campaign's heading.
  useEffect(() => {
    setData(null); setInstances([]); setUuid(''); setErr(''); setFilter('all'); setRelink(false);
    setLink(current?.zoomLink || '');
  }, [slug, current?.zoomLink]);

  // Offer the account's real sessions to link against, and pre-select the one
  // whose Zoom topic looks like this campaign.
  useEffect(() => {
    if (!slug || (current?.zoomLink && !relink)) return;
    let alive = true;
    setZoomList([]); setSuggested(''); setZoomListErr('');
    adminApi.zoomMeetings(slug)
      .then((d) => {
        if (!alive) return;
        setZoomList(d.meetings || []);
        setSuggested(d.suggestedId || '');
        if (d.suggestedId) setLink(d.suggestedId);
      })
      .catch((e) => { if (alive) setZoomListErr(e.message); });
    return () => { alive = false; };
  }, [slug, current?.zoomLink, relink]);

  const fetchAttendance = useCallback((forUuid = '') => {
    if (!slug) return;
    setLoading(true); setErr(''); setData(null);
    adminApi.zoomAttendance(slug, forUuid)
      .then((d) => { setData(d); setUuid(d.uuid || ''); })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
    adminApi.zoomInstances(slug).then((d) => setInstances(d.instances || [])).catch(() => {});
  }, [slug]);

  // Load as soon as a linked campaign is chosen. Making someone press a button
  // to see the only thing this page exists for is a step with no decision in it.
  useEffect(() => {
    if (slug && current?.zoomLink && !relink) fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, current?.zoomLink, relink]);

  const saveLink = async () => {
    setSavingLink(true); setErr('');
    try {
      // When the session came from the picker, pin that exact occurrence. A
      // meeting id alone means "most recent run of this room", and these rooms
      // are reused — the class and the sound check before it share an id.
      const picked = zoomList.find((m) => m.id === link.trim());
      const body = { zoomLink: link.trim(), zoomUuid: picked?.uuid || '' };
      await adminApi.saveCampaign(slug, body);
      setCampaigns((cs) => cs.map((c) => (c.slug === slug ? { ...c, ...body } : c)));
      setRelink(false);
      setData(null);
    } catch (e) { setErr(e.message); } finally { setSavingLink(false); }
  };

  const s = data?.summary || {};
  const rows = (data?.rows || []).filter((r) => (
    filter === 'attended' ? r.attended
      : filter === 'noshow' ? !r.attended
        : filter === 'walkin' ? (r.attended && !r.registered)
          : true));

  const csv = () => {
    const cell = (c) => (/[",\n]/.test(String(c ?? '')) ? `"${String(c).replace(/"/g, '""')}"` : String(c ?? ''));
    const head = ['Name', 'Email', 'Phone', 'Attended', 'Joined', 'Left', 'Minutes', 'Rejoins', 'Registered'];
    const body = (data?.rows || []).map((r) => [
      r.name, r.email, r.phone, r.attended ? 'yes' : 'no',
      r.joinedAt ? new Date(r.joinedAt).toLocaleString('en-IN') : '',
      r.leftAt ? new Date(r.leftAt).toLocaleString('en-IN') : '',
      r.minutes, r.sessions || 0, r.registered ? 'yes' : 'no',
    ].map(cell).join(','));
    const when = data?.meeting?.startTime ? new Date(data.meeting.startTime).toISOString().slice(0, 10) : 'session';
    const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${slug}-${when}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };

  const TABS = [['all', 'Everyone', data?.rows?.length], ['attended', 'Attended', s.attended],
    ['noshow', 'Did not join', s.noShows], ['walkin', 'Not registered', s.walkIns]];

  /* Does the session on screen actually belong to the campaign on screen?
   *
   * A wrong link doesn't look wrong — it looks like a class nobody registered
   * for. That is exactly how a list appeared for a workshop that hadn't run
   * yet: a different session's attendees, compared against these registrants,
   * so everybody showed as "not registered". Two signals catch it, and neither
   * needs the reader to notice a date in small print. */
  const mismatch = (() => {
    if (!data?.meeting) return '';
    const campaignName = current?.title || slug || '';
    const words = (x) => new Set((String(x).toLowerCase().match(/[a-z0-9]{4,}/g) || [])
      .filter((w) => !['with', 'your', 'from', 'this', 'that', 'into', 'menler', 'live', 'session', 'workshop', 'class', 'build', 'claude'].includes(w)));
    const want = words(campaignName);
    const got = words(data.meeting.topic);
    const shared = [...want].filter((w) => got.has(w)).length;
    if (want.size && shared === 0) {
      return `This session is called “${data.meeting.topic}”, which doesn’t look like “${campaignName}”.`;
    }
    // Everyone unregistered means the two sides are almost certainly unrelated.
    if (s.attended > 5 && s.walkIns === s.attended) {
      return 'Not one attendee matches this campaign’s registrations, which usually means the wrong session is linked.';
    }
    return '';
  })();

  return (
    <div>
      <div className="admin-toolbar">
        <select className="admin-search" style={{ flex: 1 }} value={slug} onChange={(e) => setSlug(e.target.value)}>
          <option value="">Choose a campaign…</option>
          {campaigns.map((c, i) => (
            <option key={c.slug} value={c.slug}>
              {i === 0 ? '★ ' : ''}
              {c.lastLeadAt ? `${fmtDate(c.lastLeadAt)} · ` : ''}
              {c.title || c.slug} — {c.leads || 0} registered{c.zoomLink ? '' : ' · no Zoom link'}
            </option>
          ))}
        </select>
        {slug && current?.zoomLink && (
          <button className="admin-btn admin-btn--primary" onClick={() => fetchAttendance()} disabled={loading}>
            {loading ? 'Asking Zoom…' : 'Refresh'}
          </button>
        )}
      </div>

      {!slug && (
        <div className="admin-table-wrap">
          <div className="admin-empty">
            <b>Pick a campaign above</b>
            You&rsquo;ll see everyone who joined its Zoom class, how long they stayed, and who
            registered but never showed.
          </div>
        </div>
      )}

      {/* Linking a campaign to its Zoom session lives here, because this page is
          the only reason that link is stored. Picking from the account's real
          sessions beats hunting a meeting id in the Zoom portal — the paste box
          stays as the fallback for when Zoom won't list them. */}
      {/* Which session this campaign points at, and a way out of a wrong one.
          Auto-matching can pick the wrong class, and without this the only
          remedy was editing the database. */}
      {slug && current?.zoomLink && !relink && (
        <p className="admin-muted" style={{ fontSize: 12.5, margin: '0 0 12px' }}>
          Linked to Zoom meeting <b>{current.zoomLink}</b>
          {' · '}
          <button type="button" className="admin-linkbtn" onClick={() => { setRelink(true); setLink(''); }}>
            wrong session? change it
          </button>
        </p>
      )}

      {slug && (!current?.zoomLink || relink) && (
        <div className="admin-note admin-note--warn">
          <b>{relink ? 'Pick the right session for this campaign.' : 'This campaign isn’t linked to a Zoom session yet.'}</b>

          {zoomList.length > 0 ? (
            <>
              <p style={{ margin: '8px 0 0' }}>
                Pick the class from your Zoom account
                {suggested && ' — the likely match is marked'}.
              </p>
              <div className="admin-toolbar" style={{ marginTop: 10 }}>
                <select className="admin-search" style={{ flex: 1 }} value={link} onChange={(e) => setLink(e.target.value)}>
                  <option value="">Choose a session…</option>
                  {zoomList.map((m) => (
                    <option key={m.uuid || m.id} value={m.id}>
                      {m.id === suggested ? '★ ' : ''}
                      {new Date(m.startTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                      {' · '}{m.topic || 'Untitled meeting'}
                      {m.participants != null ? ` · ${m.participants} joined` : ''}
                    </option>
                  ))}
                </select>
                <button className="admin-btn admin-btn--primary" onClick={saveLink} disabled={savingLink || !link.trim()}>
                  {savingLink ? 'Linking…' : 'Link this session'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ margin: '8px 0 0' }}>
                Paste the <b>Meeting ID</b> from Zoom → Meetings → <b>Previous</b>. Spaces are fine —{' '}
                <code>823 5894 9022</code> works as typed. You only do this once per campaign.
              </p>
              {/* The reason the picker is unavailable is a server-configuration
                  detail, so it's kept out of the instruction and set apart —
                  whoever is linking a campaign can act without reading it. */}
              {zoomListErr && (
                <p className="admin-muted" style={{ margin: '6px 0 0', fontSize: 12 }}>
                  Sessions can’t be listed automatically yet: {zoomListErr}
                </p>
              )}
              <div className="admin-toolbar" style={{ marginTop: 10 }}>
                <input className="admin-search" style={{ flex: 1 }} placeholder="89123456789 or https://us06web.zoom.us/j/89123456789"
                  value={link} onChange={(e) => setLink(e.target.value)} />
                <button className="admin-btn admin-btn--primary" onClick={saveLink} disabled={savingLink || !link.trim()}>
                  {savingLink ? 'Saving…' : 'Save link'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {err && (
        <div className="admin-note admin-note--bad">
          {err}
          <br />
          <span className="admin-muted">
            Zoom only reports on sessions that have finished, and takes about half an hour to settle afterwards.
          </span>
        </div>
      )}

      {/* Numbers we don't believe are not shown. A warning above a table still
          leaves the table there to be read, screenshotted and exported — and a
          plausible wrong figure travels further than an obvious one. */}
      {data && mismatch && (
        <div className="admin-note admin-note--bad">
          <b>Not showing this — it looks like the wrong session.</b>
          <br />
          {mismatch}
          <br />
          <span className="admin-muted">
            Those attendees belong to a different class, so counting them against this
            campaign would be wrong. Pick the right session and the list will load.
          </span>
          <div className="row" style={{ marginTop: 12 }}>
            <button type="button" className="admin-btn admin-btn--primary"
              onClick={() => { setRelink(true); setLink(''); setData(null); }}>
              Pick the right session
            </button>
          </div>
        </div>
      )}

      {data && !mismatch && (
        <>

          {/* Say plainly which class these numbers are, above the numbers —
              a mismatch spotted after reading the table is spotted too late. */}
          <p className="admin-sessionline">
            Showing <b>{data.meeting?.topic || 'this session'}</b>
            {data.meeting?.startTime && <> · {fmtDate(data.meeting.startTime)}, {clock(data.meeting.startTime)}</>}
            {data.meeting?.durationMinutes ? <> · ran {data.meeting.durationMinutes} min</> : null}
          </p>

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
              <select className="admin-search" style={{ flex: '0 0 240px' }}
                value={uuid} onChange={(e) => fetchAttendance(e.target.value)}>
                {instances.map((i) => (
                  <option key={i.uuid} value={i.uuid}>{new Date(i.start_time).toLocaleString('en-IN')}</option>
                ))}
              </select>
            )}
            <button className="admin-btn" onClick={csv}>⭳ Download list (CSV)</button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Left</th><th>Time in call</th><th /></tr>
              </thead>
              <tbody>
                {!rows.length && <tr><td colSpan={7} className="admin-empty">Nobody in this group.</td></tr>}
                {rows.map((r, i) => (
                  <tr key={(r.email || r.name) + i}>
                    <td><b>{r.name || '—'}</b></td>
                    <td className="admin-muted">{r.email || '—'}</td>
                    <td className="admin-muted">{r.phone || '—'}</td>
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
  );
}
