export default function AccredSection() {
  return (
    <section className="accred-section">
      <div className="accred-inner">
        <p className="accred-eyebrow">Built on Anthropic's Claude · For India's AI hiring market</p>
        <div className="accred-grid">
          <div className="accred-tile">
            <div className="accred-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><circle cx="9" cy="9" r="2" fill="currentColor"/></svg>
            </div>
            <p className="accred-text"><strong>Claude-native curriculum</strong>Designed around Anthropic's Claude — not a generic LLM survey.</p>
          </div>
          <div className="accred-tile alt">
            <div className="accred-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="accred-text"><strong>Claude Specialist credential</strong>Domain-specific. Written + practical exam.</p>
          </div>
          <div className="accred-tile warm">
            <div className="accred-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6V4.5a3 3 0 0 1 6 0V6" stroke="currentColor" strokeWidth="1.4"/></svg>
            </div>
            <p className="accred-text"><strong>25+ hiring partners</strong>Founder's offices, VCs, AI-native startups across India.</p>
          </div>
          <div className="accred-tile dark">
            <div className="accred-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
            <p className="accred-text"><strong>India-first program</strong>Bengaluru-based. Hybrid delivery. INR-priced.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
