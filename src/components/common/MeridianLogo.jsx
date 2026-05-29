export default function MeridianLogo({ color = '#534AB7', size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="11" stroke={color} strokeWidth="1" />
      <circle cx="13" cy="13" r="2.5" fill={color} />
      <line x1="13" y1="2" x2="13" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="19" x2="13" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="13" x2="7" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="13" x2="24" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
