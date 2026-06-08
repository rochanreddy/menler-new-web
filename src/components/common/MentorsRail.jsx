import { useRef, useEffect } from 'react';

// NOTE: photos are portrait placeholders and company shows as a text wordmark —
// swap `img` for real instructor photos (and add `logo`) when available.
const MENTORS = [
  { name: 'Anutham G', role: 'Product Manager at Flipkart', company: 'Flipkart', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80' },
  { name: 'Shashank K', role: 'AI-Operations Analytics at Equifax', company: 'Equifax', img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=500&q=80' },
  { name: 'Sumit K', role: 'Senior Principal Software Engineer at Autodesk', company: 'Autodesk', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80' },
  { name: 'Abhinay', role: 'Director — Engineering at Kernel Theory', company: 'Kernel Theory', img: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=500&q=80' },
  { name: 'Vishal Kumar', role: 'Senior Software Engineer at Fractal', company: 'Fractal', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=500&q=80' },
  { name: 'Rohit', role: "CEO-Office · Business Manager at Zolve", company: 'Zolve', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
  { name: 'Abhishek D', role: 'Product Manager at Imarticus Learning', company: 'Imarticus', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80' },
  { name: 'Deepak K', role: 'Educator', company: '', img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=500&q=80' },
  { name: 'Ravi Kumar', role: 'Sr. AI Business Analyst at Cadmium', company: 'Cadmium', img: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=500&q=80' },
  { name: 'Nitin K Sethi', role: 'AI-DS Expert at McKinsey', company: 'McKinsey', img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500&q=80' },
];

// Full-card gradient placeholders (no photo yet — add `img` back later).
const OVERLAYS = [
  'linear-gradient(120deg, #0c2f2e 0%, #061a19 100%)',
  'linear-gradient(120deg, #14391f 0%, #0a1f10 100%)',
  'linear-gradient(120deg, #1a2030 0%, #0a0c14 100%)',
  'linear-gradient(120deg, #0a1f33 0%, #061320 100%)',
  'linear-gradient(120deg, #3a2a12 0%, #1f1609 100%)',
  'linear-gradient(120deg, #160f2b 0%, #0c0818 100%)',
];

// Three rows, distinct people, alternating scroll directions.
const ROWS = [
  { list: MENTORS.slice(0, 4), dir: 'rtl', tint: 0 },
  { list: MENTORS.slice(4, 7), dir: 'ltr', tint: 4 },
  { list: MENTORS.slice(7, 10), dir: 'rtl', tint: 2 },
];

function CaptainRow({ list, dir, tint }) {
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
      className="captains-rail"
      ref={railRef}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="captains-track">
        {items.map((m, i) => (
          <article className="captain-card" key={i} aria-label={`${m.name}, ${m.role}`}>
            {/* Photo slot — add a real photo later: set m.img and restore the
                <img className="captain-photo-img" src={m.img} .../> tag here. */}
            <div className="captain-overlay" style={{ backgroundImage: OVERLAYS[(tint + i) % OVERLAYS.length] }}>
              <p className="captain-name">{m.name}</p>
              <p className="captain-role">{m.role}</p>
              {m.company && <span className="captain-company">{m.company}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function MentorsRail({ style, rows = ROWS.length, bare = false, labelStyle = {}, titleStyle = {} } = {}) {
  // `rows` caps how many scrolling rows render (default: all). `bare` skips the
  // section wrapper + heading so the rail can sit inside another section.
  const shown = ROWS.slice(0, Math.max(1, rows));

  const railRows = (
    <div className="captains-rows">
      {shown.map((r, i) => (
        <CaptainRow key={i} list={r.list} dir={r.dir} tint={r.tint} />
      ))}
    </div>
  );

  if (bare) return railRows;

  return (
    <section className="captains-section" style={style}>
      <div className="captains-head">
        <p className="captains-label" style={labelStyle}>Instructors / Mentors</p>
        <h2 className="captains-title" style={titleStyle}>The People Behind Menler</h2>
        <p className="captains-sub">Instructors, mentors, and leaders from industry who shape what you learn and how you grow.</p>
      </div>

      {railRows}
    </section>
  );
}
