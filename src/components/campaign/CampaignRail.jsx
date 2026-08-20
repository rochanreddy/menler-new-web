import { useEffect, useRef, useState } from 'react';

/**
 * Syllabus rail — the cards sit side by side in a row the reader SWIPES. It
 * used to pin the section and drive the track sideways off the page's vertical
 * scroll; that took the scroll away from the reader for six screens and gave
 * no way to go back a card without scrolling up. Now it is an ordinary
 * scroll-snapping row: swipe (or trackpad-scroll) to move, at whatever pace
 * and in whichever direction you like, and the page scrolls as a page again.
 *
 * The counter and dots follow the track's own scroll position.
 *
 * Shared by the campaign landing pages; `cards` carries whatever that
 * programme calls its units (weeks for the Fellowship, modules for the
 * Kickstarter), so only the content differs between them.
 */
export default function CampaignRail({ eyebrow, title, cards, label = 'The curriculum' }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const n = cards.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Which card is under the snap point, from the scroll offset — one card is
    // one card-width of travel, so the index is the offset over that width.
    const onScroll = () => {
      const step = track.firstElementChild?.offsetWidth;
      if (!step) return;
      setActive(Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / step))));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [n]);

  // The dots double as the control for anyone who can't swipe — a mouse with
  // a plain wheel has no way to move a horizontal scroller.
  const goTo = (i) => {
    const track = trackRef.current;
    const step = track?.firstElementChild?.offsetWidth;
    if (!step) return;
    track.scrollTo({ left: i * step, behavior: 'smooth' });
  };

  return (
    <section className="gcamp-curric" aria-label={label}>
      <div className="gcamp-curric-sticky">
        <div className="gcamp-curric-head">
          <p className="gcamp-eyebrow">{eyebrow}</p>
          <h2 className="gcamp-h2">{title}</h2>
          <p className="gcamp-curric-count">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </p>
        </div>

        <div className="gcamp-curric-track" ref={trackRef}>
          {cards.map((c) => (
            <article className="gcamp-wcard" key={c.n}>
              <div className="gcamp-wcard-in">
                <div className="gcamp-wcard-top">
                  <span className="gcamp-wcard-n">{c.n}</span>
                  {c.phase && <span className="gcamp-wcard-phase">{c.phase}</span>}
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

        <div className="gcamp-curric-dots">
          {cards.map((c, i) => (
            <button
              type="button"
              className={`gcamp-dot${i === active ? ' is-on' : ''}`}
              key={c.n}
              aria-label={c.n}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
