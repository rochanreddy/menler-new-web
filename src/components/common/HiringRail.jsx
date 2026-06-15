import { BrandLogo } from './PartnersMarquee';

// One logo row. Pure-CSS marquee: 3 identical copies + a transform animation
// (see global.css .logorail-track--rtl/ltr) — GPU-smooth on mobile, no JS.
function LogoRow({ list, dir }) {
  const items = [...list, ...list, ...list];
  return (
    <div className="logorail-rail">
      <div className={`logorail-track logorail-track--${dir}`}>
        {items.map((c, i) => (
          <BrandLogo key={i} name={c.name} domain={c.domain} logo={c.logo} />
        ))}
      </div>
    </div>
  );
}

export default function HiringRail({ companies, rows = 1 }) {
  if (rows === 2) {
    const mid = Math.ceil(companies.length / 2);
    return (
      <div className="logorail-rows">
        <LogoRow list={companies.slice(0, mid)} dir="rtl" />
        <LogoRow list={companies.slice(mid)} dir="ltr" />
      </div>
    );
  }
  return (
    <div className="logorail-rows">
      <LogoRow list={companies} dir="rtl" />
    </div>
  );
}
