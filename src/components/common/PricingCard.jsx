// Reusable premium pricing card (modern glowing beam) — used on the Kickstarter
// and Generalist pages. Styling lives in global.css under the `.kp-*` classes.
const checkProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3.2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const IcoCheck = <svg {...checkProps}><path d="M5 12l4.5 4.5L19 6.5" /></svg>;

export default function PricingCard({
  pill,
  name,
  tagline,
  price,
  origPrice,
  priceSub,
  ctaLabel = 'Enrol now',
  onCta,
  features = [],
  chips = [],
}) {
  return (
    <div className="kp-card">
      <div className="kp-head">
        <div className="kp-head-l">
          <div className="kp-pill"><span className="kp-dot" />{pill}</div>
          <h3 className="kp-name">{name}</h3>
          <p className="kp-tagline">{tagline}</p>
        </div>
        <div className="kp-price">
          {origPrice && <span className="kp-price-orig">₹{origPrice}</span>}
          <div className="kp-price-row"><span className="kp-price-sym">₹</span><span className="kp-price-num">{price}</span></div>
          <span className="kp-price-sub">{priceSub}</span>
          <button className="kp-cta" onClick={onCta}>
            {ctaLabel}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div className="kp-divider" />

      <p className="kp-fhdr">What's included</p>
      <div className="kp-feats">
        {features.map((f) => {
          const title = Array.isArray(f) ? f[0] : f.title;
          const detail = Array.isArray(f) ? f[1] : f.detail;
          return (
            <div className="kp-feat" key={title}>
              <span className="kp-chk">{IcoCheck}</span>
              <div><p className="kp-ft">{title}</p><p className="kp-fd">{detail}</p></div>
            </div>
          );
        })}
      </div>

      <div className="kp-chips">
        {chips.map((c) => (
          <div className="kp-chip" key={c.label}><span className="kp-chip-l">{c.label}</span><span className="kp-chip-v">{c.value}</span></div>
        ))}
      </div>
    </div>
  );
}
