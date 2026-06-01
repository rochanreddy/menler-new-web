// Split-sphere mark — mirrors the hero "moon": one blue half, one light half.
export default function MenlerLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {/* light (whitish) half */}
      <path d="M13 2 A11 11 0 0 0 13 24 Z" fill="#E7E4F8" />
      {/* blue half */}
      <path d="M13 2 A11 11 0 0 1 13 24 Z" fill="#534AB7" />
      {/* outline keeps the sphere readable on light and dark surfaces */}
      <circle cx="13" cy="13" r="11" stroke="#AFA9EC" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
