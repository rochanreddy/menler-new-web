import { useRef, useEffect } from 'react';
import { BrandLogo } from './PartnersMarquee';

// One logo row. Transform-based continuous marquee (3 identical copies) — moved
// with translateX each frame so it NEVER stops on touch or hover. Draggable:
// an active drag follows the pointer and auto-advance resumes on release; a
// resting finger does not stop it.
function LogoRow({ list, dir }) {
  const trackRef = useRef(null);
  const items = [...list, ...list, ...list];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf, copy = 0, offset = 0;
    let down = false, dragging = false, startX = 0, downX = 0, startOffset = 0;
    const speed = dir === 'ltr' ? 0.5 : -0.5; // px/frame

    const wrap = () => { if (copy > 0) { while (offset <= -copy) offset += copy; while (offset > 0) offset -= copy; } };
    const apply = () => { track.style.transform = `translate3d(${offset}px,0,0)`; };
    const measure = () => { copy = track.scrollWidth / 3; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const loop = () => {
      if (copy > 0 && !dragging) { offset += speed; wrap(); apply(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = (e) => { down = true; downX = startX = e.clientX; startOffset = offset; };
    const onMove = (e) => {
      if (!down) return;
      if (!dragging && Math.abs(e.clientX - downX) > 6) dragging = true;
      if (dragging) { offset = startOffset + (e.clientX - startX); wrap(); apply(); startOffset = offset; startX = e.clientX; }
    };
    const onUp = () => { down = false; dragging = false; };
    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dir, list]);

  return (
    <div className="logorail-rail">
      <div className="logorail-track" ref={trackRef}>
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
