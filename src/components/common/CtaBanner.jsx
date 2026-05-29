export default function CtaBanner({ badge, title, subtitle, buttonText, onButtonClick, style = {}, buttonStyle = {} }) {
  return (
    <section className="cta-banner" style={style}>
      {badge && (
        <div className="cohort-badge">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" fill="#9FE1CB" />
          </svg>
          {badge}
        </div>
      )}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <button className="btn-white" onClick={onButtonClick} style={buttonStyle}>
        {buttonText}
      </button>
    </section>
  );
}
