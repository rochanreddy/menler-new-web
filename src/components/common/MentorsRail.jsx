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

// Each row shows every mentor (rotated to a different start so the rows look
// distinct), so the same face never appears twice within one visible row.
const rotate = (arr, n) => [...arr.slice(n), ...arr.slice(0, n)];
const ROWS = [
  { list: rotate(MENTORS, 0), dir: 'rtl', tint: 0 },
  { list: rotate(MENTORS, 4), dir: 'ltr', tint: 4 },
  { list: rotate(MENTORS, 7), dir: 'rtl', tint: 2 },
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
