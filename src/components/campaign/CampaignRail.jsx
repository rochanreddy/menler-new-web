import { useEffect, useRef, useState } from 'react';
import { visibleRaf } from '../../lib/visibleRaf';

// Each card gets one screen; the first screen is the pin itself, so the
// section reserves 100vh + one TRAVEL_VH block per hand-off after it.
const TRAVEL_VH = 70;

/**
 * Syllabus rail — the cards sit side by side and the page's VERTICAL scroll
 * drives them HORIZONTALLY: the section pins while the track slides left, so a
 * whole syllabus costs far less page height than the same cards stacked.
 *
 * Reduced-motion (and any browser where the pin can't run) falls back to a
 * plain swipeable, scroll-snapping row — same content, no hijacked scrolling.
 *
 * Shared by the campaign landing pages; `cards` carries whatever that
 * programme calls its units (weeks for the Fellowship, modules for the
 * Kickstarter), so only the content differs between them.
 */
export default function CampaignRail({ eyebrow, title, cards, label = 'The curriculum' }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const n = cards.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPinned(true);
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let last = -1;
    return visibleRaf(wrap, () => {
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      // 0 → first card fully in view, 1 → last card fully in view.
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      track.style.transform = `translate3d(-${(p * (n - 1) * 100) / n}%, 0, 0)`;
      setActive(Math.round(p * (n - 1)));
    });
  }, [n]);

  return (
    <section
      className={`gcamp-curric${pinned ? ' is-pinned' : ''}`}
      ref={wrapRef}
      style={pinned ? { height: `calc(100vh + ${(n - 1) * TRAVEL_VH}vh)` } : undefined}
      aria-label={label}
    >
      <div className="gcamp-curric-sticky">
        <div className="gcamp-curric-head">
          <p className="gcamp-eyebrow">{eyebrow}</p>
          <h2 className="gcamp-h2">{title}</h2>
          <p className="gcamp-curric-count">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </p>
        </div>

        <div className="gcamp-curric-track" ref={trackRef} style={{ width: `${n * 100}%` }}>
          {cards.map((c) => (
            <article className="gcamp-wcard" key={c.n} style={{ width: `${100 / n}%` }}>
              <div className="gcamp-wcard-in">
                <div className="gcamp-wcard-top">
                  <span className="gcamp-wcard-n">{c.n}</span>
                  <span className="gcamp-wcard-phase">{c.phase}</span>
                </div>
                <h3 className="gcamp-wcard-t">{c.t}</h3>

                <p className="gcamp-wcard-h">Lesson plan</p>
                <ul className="gcamp-wcard-list">
                  {c.lessons.map((l) => <li key={l}>{l}</li>)}
                </ul>

                {c.projects && (
                  <>
                    <p className="gcamp-wcard-h">
                      {c.projects.length > 1 ? "Projects you'll build" : "Project you'll build"}
                    </p>
                    <ul className="gcamp-wcard-list gcamp-wcard-list--proj">
                      {c.projects.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="gcamp-curric-dots" aria-hidden="true">
          {cards.map((c, i) => (
            <span className={`gcamp-dot${i === active ? ' is-on' : ''}`} key={c.n} />
          ))}
        </div>
      </div>
    </section>
  );
}
