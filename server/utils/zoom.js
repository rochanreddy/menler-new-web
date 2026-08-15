// Zoom Server-to-Server OAuth + past-meeting reports.
//
// Env (server-side only): ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET.
// The app needs the `report:read:admin` scope, and the Zoom account must be on a
// paid plan — the /report endpoints return 400 on free, whatever the scopes say.

const API = 'https://api.zoom.us/v2';

export const zoomConfigured = () =>
  Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET);

// Access tokens last an hour; cache until shortly before expiry rather than
// minting a new one per request.
let cached = { token: '', expires: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.expires) return cached.token;

  const basic = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(process.env.ZOOM_ACCOUNT_ID)}`,
    { method: 'POST', headers: { Authorization: `Basic ${basic}` }, signal: AbortSignal.timeout(20000) },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(data.reason || data.message || `Zoom auth failed (${res.status})`);
  }
  cached = { token: data.access_token, expires: Date.now() + (data.expires_in || 3600) * 1000 - 60_000 };
  return cached.token;
}

async function zoomGet(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
    signal: AbortSignal.timeout(25000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Zoom request failed (${res.status})`);
    err.status = res.status;
    err.zoomCode = data.code;
    throw err;
  }
  return data;
}

/**
 * Pull the meeting id out of a stored join link.
 * Handles zoom.us/j/<id>, /w/<id>, /s/<id> and vanity subdomains.
 */
export function meetingIdFromLink(link) {
  const m = String(link || '').match(/zoom\.us\/(?:j|w|s|my)\/([A-Za-z0-9]+)/i);
  if (m) return m[1].replace(/\D/g, '') || m[1];
  const digits = String(link || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits : '';
}

/* A meeting UUID can contain "/" or start with one, and Zoom needs those
 * double-encoded or the path breaks. Missing this returns a confusing 404. */
const encodeUuid = (uuid) =>
  (uuid.startsWith('/') || uuid.includes('//')) ? encodeURIComponent(encodeURIComponent(uuid)) : encodeURIComponent(uuid);

/**
 * Past occurrences of a meeting id, newest first. Recurring meetings have many.
 *
 * Needs meeting:read:list_past_instances:admin. That scope isn't offered on
 * every plan, so a refusal returns an empty list rather than throwing — the
 * caller falls back to the single most recent occurrence, which is what anyone
 * opening this actually wants nine times out of ten.
 */
export async function pastInstances(meetingId) {
  try {
    const data = await zoomGet(`/past_meetings/${encodeURIComponent(meetingId)}/instances`);
    return (data.meetings || []).sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
  } catch (err) {
    if (err.status === 400 || err.status === 401 || err.status === 403) return [];
    throw err;
  }
}

/**
 * The UUID of the most recent finished occurrence.
 *
 * Asking for a meeting id (rather than a UUID) returns the latest occurrence,
 * so this works with only meeting:read:past_meeting:admin — no instance-listing
 * scope required.
 */
export async function latestInstanceUuid(meetingId) {
  const data = await pastMeeting(meetingId);
  return data?.uuid || '';
}

/** Summary for one past occurrence — topic, start, and Zoom's own totals. */
export async function pastMeeting(uuid) {
  return zoomGet(`/past_meetings/${encodeUuid(uuid)}`);
}

/**
 * Everyone who was in one past occurrence.
 *
 * Zoom reports a separate row each time somebody joins, so a person who drops
 * and rejoins appears two or three times. Rows are merged per person here —
 * their earliest join, latest leave, and total minutes actually connected,
 * which is the number anyone actually means by "how long were they in".
 */
export async function meetingParticipants(uuid) {
  const rows = [];
  let token = '';
  do {
    const qs = `page_size=300${token ? `&next_page_token=${encodeURIComponent(token)}` : ''}`;
    const data = await zoomGet(`/report/meetings/${encodeUuid(uuid)}/participants?${qs}`);
    rows.push(...(data.participants || []));
    token = data.next_page_token || '';
  } while (token);

  const byPerson = new Map();
  for (const p of rows) {
    const email = String(p.user_email || '').trim().toLowerCase();
    const key = email || `name:${String(p.name || '').trim().toLowerCase()}`;
    const join = p.join_time ? new Date(p.join_time) : null;
    const leave = p.leave_time ? new Date(p.leave_time) : null;
    const secs = Number(p.duration || 0);

    const prev = byPerson.get(key);
    if (!prev) {
      byPerson.set(key, {
        name: p.name || '', email, sessions: 1,
        joinedAt: join, leftAt: leave, seconds: secs,
      });
      continue;
    }
    prev.sessions += 1;
    prev.seconds += secs;
    if (join && (!prev.joinedAt || join < prev.joinedAt)) prev.joinedAt = join;
    if (leave && (!prev.leftAt || leave > prev.leftAt)) prev.leftAt = leave;
    if (!prev.name && p.name) prev.name = p.name;
  }

  return [...byPerson.values()]
    .map((p) => ({ ...p, minutes: Math.round(p.seconds / 60) }))
    .sort((a, b) => b.seconds - a.seconds);
}

/**
 * Every meeting this account finished in a date window, newest first.
 *
 * This is what removes the manual step: instead of hunting a meeting id in the
 * Zoom portal and pasting it per campaign, the sessions can simply be listed
 * and picked. Needs report:read:user:admin.
 *
 * Zoom caps a single report query at one month, so a longer window is walked a
 * month at a time.
 */
export async function pastMeetings({ days = 90 } = {}) {
  /* "me" doesn't resolve for a Server-to-Server token — there is no signed-in
   * user behind it, and Zoom answers "User does not exist: me". So the host is
   * named explicitly: ZOOM_USER_ID, the email of the account that runs the
   * classes. Discovering it instead would mean asking for user:read scopes,
   * which is a lot of access for one lookup. */
  const host = (process.env.ZOOM_USER_ID || '').trim();
  if (!host) {
    const err = new Error('Set ZOOM_USER_ID to the email of the Zoom account that hosts the classes — a server-to-server token has no "me" to fall back on.');
    err.status = 400;
    throw err;
  }
  const user = encodeURIComponent(host);
  const out = [];
  const end = new Date();
  let cursor = new Date(end.getTime() - days * 864e5);

  while (cursor < end) {
    const chunkEnd = new Date(Math.min(cursor.getTime() + 29 * 864e5, end.getTime()));
    const from = cursor.toISOString().slice(0, 10);
    const to = chunkEnd.toISOString().slice(0, 10);

    let token = '';
    do {
      const qs = `from=${from}&to=${to}&page_size=300&type=past${token ? `&next_page_token=${encodeURIComponent(token)}` : ''}`;
      const data = await zoomGet(`/report/users/${user}/meetings?${qs}`);
      out.push(...(data.meetings || []));
      token = data.next_page_token || '';
    } while (token);

    cursor = new Date(chunkEnd.getTime() + 864e5);
  }

  // The same meeting id recurs; keep each occurrence but present newest first.
  return out
    .map((m) => ({
      id: String(m.id),
      uuid: m.uuid,
      topic: m.topic || '',
      startTime: m.start_time,
      minutes: m.duration,
      participants: m.participants_count ?? null,
    }))
    .sort((a, b) => (a.startTime < b.startTime ? 1 : -1));
}

/** Turn a Zoom API failure into something an admin can act on. */
export function explainZoomError(err) {
  const msg = String(err?.message || '');
  if (err?.status === 400 && /plan|subscription|not.*available/i.test(msg)) {
    return 'Zoom reports need a paid Zoom plan (Pro or above). This account is on a plan that does not expose them.';
  }
  if (err?.status === 401) return 'Zoom rejected the credentials — check ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET.';
  if (err?.status === 403) return 'The Zoom app is missing the report:read:admin scope, or has not been activated.';
  if (err?.status === 404) return 'Zoom has no record of that meeting — it may not have happened yet, or the link points at a different account.';
  return msg || 'Could not reach Zoom.';
}
