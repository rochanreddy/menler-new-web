export default function SectionHeader({ label, title, subtitle, align = 'left', style = {} }) {
  return (
    <div style={{ textAlign: align, ...style }}>
      {label && <p className="section-label">{label}</p>}
      <h2
        className="section-h2"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
