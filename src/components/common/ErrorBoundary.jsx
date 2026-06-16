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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (isChunkError(error)) reloadOnce();
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#26215C' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 34, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#6b6790', margin: '12px 0 22px', fontSize: 15 }}>Please reload the page — it usually fixes it.</p>
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
