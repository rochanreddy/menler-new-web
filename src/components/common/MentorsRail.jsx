import { useRef, useEffect } from 'react';
import { useContent } from '../../lib/useContent';

// Fallback content — used until Sanity is configured/populated (see useContent).
const MENTORS = [
  { name: 'Anuttam G', role: 'Product Manager', company: 'Flipkart, Ex-BigBasket', img: '/mentors/Anuttam.png' },
  { name: 'Shashank Kumar', role: 'Technical Operations & Analytics Lead', company: 'Equifax', img: '/mentors/Shashank.png' },
  { name: 'Abhinay Kumar', role: 'CTO', company: 'Kernel Theory', img: '/mentors/Abhinay.png' },
  { name: 'Rohit', role: 'CEO-Office · Business Manager at Zolve', company: 'Zolve', img: '/mentors/ROHIT.png' },
  { name: 'Nitin K Sethi', role: 'AI Engineer', company: 'McKinsey ', img: '/mentors/Nitin.png' },
  { name: 'Deepak K', role: 'AI Operations Lead', company: 'Testbook', img: '/mentors/Deepak.png' },
  { name: 'Manish Yadav', role: 'AI Service Business Analyst', company: 'Zendesk', img: '/mentors/Manish.png' },
  { name: 'Pranay W', role: 'AI Product Generalist', company: 'Wednesday Solution', img: '/mentors/Pranay.jpeg' },
  { name: 'Salimullah Khan', role: 'AI Product Manager — Digital Solution', company: 'Black Tiger Cement', img: '/mentors/Salimullah.png' },
  { name: 'Jyotiraditya', role: 'AI Growth Manager', company: 'AstroNext', img: '/mentors/Jyotiraditya.png' },
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

const MENTORS_QUERY = '*[_type == "mentor"] | order(orderRank) { name, role, company, "img": photo.asset->url }';

// A real horizontal scroll container with 3 identical copies. A light per-frame
// auto-advance keeps it moving continuously (one scrollLeft write/frame); the
// user can swipe left/right at any time and it carries on from there. It pauses
// only on MOUSE hover (desktop) — touch never stops it. Loops seamlessly by
// snapping back a copy-width at the boundaries.
function CaptainRow({ list, dir, tint }) {
  const railRef = useRef(null);
  const items = [...list, ...list, ...list];

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const track = el.firstElementChild;
    let raf, paused = false, copy = 0, centred = false;
    const speed = dir === 'ltr' ? -0.5 : 0.5; // px/frame

    const measure = () => {
      copy = el.scrollWidth / 3;
      if (copy > 0 && !centred) { el.scrollLeft = copy; centred = true; } // start in the middle copy
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track) ro.observe(track); // re-measure when lazy images change the width

    const loop = () => {
      if (!paused && copy > 0) {
        let x = el.scrollLeft + speed;
        if (x >= copy * 2) x -= copy;
        else if (x <= 0) x += copy;
        el.scrollLeft = x;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Pause for a hovering mouse only; touch interactions keep it scrolling.
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
    <div className="captains-rail" ref={railRef}>
      <div className="captains-track">
        {items.map((m, i) => (
          <article className="captain-card" key={i} aria-label={`${m.name}, ${m.role}`}>
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

export default function MentorsRail({ style, className = '', rows = 2, bare = false, labelStyle = {}, titleStyle = {} } = {}) {
  // `rows` caps how many scrolling rows render (default: all). `bare` skips the
  // section wrapper + heading so the rail can sit inside another section.
  // A single row has no "above/below" twin to worry about, so show every mentor
  // there; multi-row uses split halves so no face lines up with itself.
  const mentors = useContent(MENTORS_QUERY, MENTORS);
  const half = Math.ceil(mentors.length / 2);
  const shown = rows === 1
    ? [{ list: mentors, dir: 'rtl', tint: 0 }]
    : [
        { list: mentors.slice(0, half), dir: 'rtl', tint: 0 },
        { list: mentors.slice(half), dir: 'ltr', tint: 4 },
      ].slice(0, Math.max(1, rows));

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
        <p className="captains-label" style={labelStyle}>Mentors</p>
        <h2 className="captains-title" style={titleStyle}>The People Behind Menler</h2>
        <p className="captains-sub">leaders and mentors from industry who shape what you learn and how you grow.</p>
      </div>

      {railRows}
    </section>
  );
}
