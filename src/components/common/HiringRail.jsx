import { useRef, useEffect } from 'react';
import { BrandLogo } from './PartnersMarquee';

// One auto-scrolling row of logo chips (same drag/auto-scroll behaviour as the
// mentors rail). dir 'ltr' scrolls right→left start, 'rtl' the other way.
function LogoRow({ list, dir }) {
  const railRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0 });
  const paused = useRef(false);
  const inited = useRef(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let raf;
    const tick = () => {
      const half = el.scrollWidth / 2;
      if (half > 0 && !inited.current) {
        el.scrollLeft = dir === 'ltr' ? half : 0;
        inited.current = true;
      }
      if (!paused.current && !drag.current.down && half > 0) {
        el.scrollLeft += dir === 'ltr' ? -0.5 : 0.5;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const onPointerDown = (e) => {
    const el = railRef.current;
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.down) return;
    railRef.current.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const onPointerUp = (e) => {
    drag.current.down = false;
    railRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const items = [...list, ...list, ...list];

  return (
    <div
      className="logorail-rail"
      ref={railRef}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="logorail-track">
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
