// fetch() for the Menler API, with failures that say what actually went wrong.
//
// A bare fetch gives the caller three very different failures that all look
// alike: no connection ("Failed to fetch"), a server that never answers (the
// request just hangs), and a server that answers with an error. Each one wants
// a different message for the visitor, so each is thrown with a `kind`:
//
//   kind 'network' — the request never reached us (offline, DNS, blocked)
//   kind 'timeout' — we did not answer in time (server waking up / overloaded)
//   kind 'http'    — we answered with an error; `status` and the server's own
//                    message (its `error` field) are on the Error
//
// See friendlyError() in ./friendlyError for how each is put to the visitor.

const DEFAULT_TIMEOUT_MS = 30000;

function failure(message, props) {
  return Object.assign(new Error(message), props);
}

export async function apiFetch(url, options = {}, { fallback = 'Request failed.', timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  let res;
  try {
    const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined;
    res = await fetch(url, { ...options, ...(signal ? { signal } : {}) });
  } catch (e) {
    const timedOut = e && (e.name === 'TimeoutError' || e.name === 'AbortError');
    throw failure(timedOut ? 'The server took too long to respond.' : 'Could not reach the server.', {
      kind: timedOut ? 'timeout' : 'network',
      cause: e,
    });
  }
  if (!res.ok) {
    let message = fallback;
    try { const j = await res.json(); if (j && j.error) message = j.error; } catch { /* not JSON */ }
    throw failure(message, { kind: 'http', status: res.status });
  }
  return res.json();
}
