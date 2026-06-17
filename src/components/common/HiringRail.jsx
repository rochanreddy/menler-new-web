import { useRef, useEffect } from 'react';
import { BrandLogo } from './PartnersMarquee';

// One logo row. A real horizontal scroll container with 3 identical copies and a
// light per-frame auto-advance: it keeps moving continuously (doesn't stop on
// touch), the user can swipe left/right at will, and it pauses only on MOUSE
// hover. Loops seamlessly by snapping back a copy-width at the boundaries.
function LogoRow({ list, dir }) {
  const railRef = useRef(null);
  const items = [...list, ...list, ...list];

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const track = el.firstElementChild;
    let raf, paused = false, copy = 0, centred = false;
    const speed = dir === 'ltr' ? -0.5 : 0.5; // px/frame

    let pos = 0, lastSet = -1;
    const measure = () => {
      copy = el.scrollWidth / 3;
      if (copy > 0 && !centred) { pos = copy; el.scrollLeft = copy; lastSet = el.scrollLeft; centred = true; }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track) ro.observe(track);

    const loop = () => {
      if (copy > 0) {
        if (lastSet < 0 || Math.abs(el.scrollLeft - lastSet) > 1.5) pos = el.scrollLeft;
        if (!paused) {
          pos += speed;
          if (pos >= copy * 2) pos -= copy;
          else if (pos <= 0) pos += copy;
          el.scrollLeft = pos;
          lastSet = el.scrollLeft;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onEnter = (e) => { if (e.pointerType === 'mouse') paused = true; };
    const onLeave = (e) => { if (e.pointerType === 'mouse') paused = false; };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [dir, list]);

  return (
    <div className="logorail-rail" ref={railRef} data-lenis-prevent>
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
