import { Component } from 'react';

// Catches any render-time error so a single failure shows a friendly fallback
// instead of a blank white screen. Also auto-recovers from the most common
// cause: a dynamically-imported route chunk that fails to load (stale hash
// after a new deploy, or a transient network blip) — reload once to fetch the
// fresh build.
const isChunkError = (err) =>
  /dynamically imported|module script failed|Loading chunk|ChunkLoadError|Failed to fetch dynamically|error loading dynamically imported module/i
    .test(String((err && err.message) || err));

const reloadOnce = () => {
  const last = Number(sessionStorage.getItem('eb-reload-at') || 0);
  if (Date.now() - last > 10000) { // guard against reload loops
    sessionStorage.setItem('eb-reload-at', String(Date.now()));
    window.location.reload();
  }
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, msg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, msg: String((error && error.message) || error) };
  }

  componentDidCatch(error) {
    // Surface the real error so it's diagnosable from the live site too.
    // eslint-disable-next-line no-console
    console.error('[Menler] render error:', error);
    if (isChunkError(error)) reloadOnce();
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    // When a `fallback` is provided (e.g. fallback={null} around an optional
    // widget like the 3D hero), render that instead of the full-page card so a
    // non-critical failure degrades gracefully rather than blanking the page.
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#26215C' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 34, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#6b6790', margin: '12px 0 22px', fontSize: 15 }}>Please reload the page — it usually fixes it.</p>
        {this.state.msg ? (
          <pre style={{ maxWidth: 680, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, color: '#a32d2d', background: '#fcebeb', border: '1px solid rgba(163,45,45,0.2)', borderRadius: 8, padding: '10px 14px', margin: '0 0 20px' }}>{this.state.msg}</pre>
        ) : null}
        <button
          onClick={() => { sessionStorage.removeItem('eb-reload-at'); window.location.reload(); }}
          style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          Reload
        </button>
      </div>
    );
  }
}
