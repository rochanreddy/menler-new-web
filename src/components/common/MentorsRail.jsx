import { useRef, useEffect } from 'react';

// NOTE: photos are portrait placeholders and company shows as a text wordmark —
// swap `img` for real instructor photos (and add `logo`) when available.
const MENTORS = [
  { name: 'Anuttam G', role: 'Product Manager', company: 'Flipkart, Ex-BigBasket', img: '/mentors/Anuttam.png' },
  { name: 'Shashank Kumar', role: 'AI Automation — Operation & Analytics Lead', company: 'Equifax', img: '/mentors/Shashank.png' },
  { name: 'Abhinay Kumar', role: 'CTO', company: 'Kernel Theory', img: '/mentors/Abhinay.png' },
  { name: 'Rohit', role: 'CEO-Office · Business Manager at Zolve', company: 'Zolve', img: '/mentors/ROHIT.png' },
  { name: 'Nitin K Sethi', role: 'AI Engineer', company: 'McKinsey, Yusr L&F', img: '/mentors/Nitin.png' },
  { name: 'Deepak K', role: 'AI Operations Lead', company: 'Testbook', img: '/mentors/Deepak.png' },
  { name: 'Manish Yadav', role: 'AI Service Business Analyst', company: 'Zendesk', img: '/mentors/Manish.png' },
  { name: 'Pranay W', role: 'AI Product Generalist', company: 'Wednesday Solution', img: '/mentors/Pranay.jpeg' },
  { name: 'Salimullah Khan', role: 'AI Product Manager — Digital Solution', company: 'Black Tiger Cement', img: '/mentors/Salimullah.png' },
  { name: 'Sachin Roy', role: 'Founder', company: 'Menler', img: '/mentors/Sachin.png' },
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

// Both rows show every mentor, but in genuinely different orders (row 2 is an
// odd-then-even interleave, not a rotation) and scroll in opposite directions,
// so the same face never lines up above/below itself while scrolling.
const interleave = (arr) => [
  ...arr.filter((_, i) => i % 2 === 1),
  ...arr.filter((_, i) => i % 2 === 0),
];
const ROWS = [
  { list: MENTORS, dir: 'rtl', tint: 0 },
  { list: interleave(MENTORS), dir: 'ltr', tint: 4 },
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
    // Cache the scroll width: reading el.scrollWidth every frame forces a
    // synchronous layout reflow, which is the main source of jank on mobile.
    let half = 0;
    const measure = () => {
      half = el.scrollWidth / 2;
      if (half > 0 && !inited.current) {
        el.scrollLeft = dir === 'ltr' ? half : 0;
        inited.current = true;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Only animate while the rail is on screen — no wasted frames (and no
    // scroll writes competing with the page) while the user scrolls past it.
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const tick = () => {
      if (visible && half > 0 && !paused.current && !drag.current.down) {
        let next = el.scrollLeft + (dir === 'ltr' ? -0.5 : 0.5);
        if (next >= half) next -= half;
        else if (next <= 0) next += half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [dir]);

  const onPointerDown = (e) => {
    // Leave touch gestures alone so the page scrolls vertically without the rail
    // capturing the pointer (which caused the stutter on mobile). Drag = mouse only.
    if (e.pointerType === 'touch') return;
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
            {/* Gradient fills the card; the photo (if any) sits on top, with a
                dark scrim over it so the name/role/company stay readable. */}
            <div className="captain-bg" style={{ backgroundImage: OVERLAYS[(tint + i) % OVERLAYS.length] }} />
            {m.img && <img className="captain-photo-img" src={encodeURI(m.img)} alt={m.name} loading="lazy" />}
            <div className={`captain-overlay${m.img ? ' captain-overlay--photo' : ''}`}>
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

export default function MentorsRail({ style, className = '', rows = ROWS.length, bare = false, labelStyle = {}, titleStyle = {} } = {}) {
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
    <section className={`captains-section ${className}`} style={style}>
      <div className="captains-head">
        <p className="captains-label" style={labelStyle}>Instructors / Mentors</p>
        <h2 className="captains-title" style={titleStyle}>The People Behind Menler</h2>
        <p className="captains-sub">Instructors, mentors, and leaders from industry who shape what you learn and how you grow.</p>
      </div>

      {railRows}
    </section>
  );
}
