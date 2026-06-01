/**
 * Brand illustration for card thumbnails — the Menler orbit + half-disc (◐)
 * motif, tinted per category. Replaces flat gradient placeholders.
 * Decorative only (aria-hidden); scales to fill its container.
 */

const THEMES = {
  default: { from: '#EEEDFE', to: '#C9C2F5', tone: 'light' },
  eng:     { from: '#085041', to: '#1D9E75', tone: 'dark' },
  kick:    { from: '#F4C879', to: '#BA7517', tone: 'dark' },
  alumni:  { from: '#AFA9EC', to: '#534AB7', tone: 'dark' },
  career:  { from: '#1A1647', to: '#26215C', tone: 'dark' },
  india:   { from: '#E98B8B', to: '#A32D2D', tone: 'dark' },
  founder: { from: '#26215C', to: '#7A5BBA', tone: 'dark' },
  marketing: { from: '#EEEDFE', to: '#AFA9EC', tone: 'light' },
  finance: { from: '#FAEEDA', to: '#E3B873', tone: 'dark' },
};

export default function Thumb({ variant = 'default', className = '', style }) {
  const t = THEMES[variant] || THEMES.default;
  const ink = t.tone === 'dark' ? '255,255,255' : '38,33,92';
  const gid = `tg-${variant || 'default'}`;
  const rid = `tr-${variant || 'default'}`;

  return (
    <div className={`thumb ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.from} />
            <stop offset="100%" stopColor={t.to} />
          </linearGradient>
          <radialGradient id={rid} cx="68%" cy="32%" r="60%">
            <stop offset="0%" stopColor={`rgba(${ink},0.18)`} />
            <stop offset="100%" stopColor={`rgba(${ink},0)`} />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${gid})`} />
        <rect width="400" height="300" fill={`url(#${rid})`} />
        {/* orbit rings */}
        <g fill="none" stroke={`rgba(${ink},0.16)`} strokeWidth="1">
          <circle cx="278" cy="150" r="118" />
          <circle cx="278" cy="150" r="82" stroke={`rgba(${ink},0.22)`} />
          <circle cx="278" cy="150" r="46" stroke={`rgba(${ink},0.30)`} />
        </g>
        {/* half-disc ◐ */}
        <path d="M278 104 a46 46 0 0 1 0 92 z" fill={`rgba(${ink},0.40)`} />
        <path d="M278 104 a46 46 0 0 0 0 92 z" fill={`rgba(${ink},0.14)`} />
        {/* orbit nodes */}
        <g fill={`rgba(${ink},0.55)`}>
          <circle cx="278" cy="32" r="4" />
          <circle cx="396" cy="150" r="4" />
          <circle cx="200" cy="232" r="3" />
          <circle cx="362" cy="68" r="2.6" />
        </g>
      </svg>
    </div>
  );
}
