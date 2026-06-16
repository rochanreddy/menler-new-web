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

// Pure-CSS marquee: 3 identical copies + a transform animation (see global.css
// .captains-track--rtl/ltr). GPU-accelerated → smooth on mobile, no per-frame JS.
function CaptainRow({ list, dir, tint }) {
  const items = [...list, ...list, ...list];
  return (
    <div className="captains-rail">
      <div className={`captains-track captains-track--${dir}`}>
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
