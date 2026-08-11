import { useEffect, useState } from 'react';
import Thumb from '../common/Thumb';
import { formatPostDate } from '../../data/blogData';

const CYCLE_MS = 3500;

/**
 * Blog hero visual — a deck of real story cards stacked one behind another.
 * The front card recedes and the next comes forward on a timer; clicking the
 * deck advances it immediately (hover pauses the timer). Slot positions live
 * in CSS (.bhs-slot--N) and transition smoothly as slots reassign. Decorative
 * (inside the aria-hidden hero-visual); auto-cycling stops for reduced motion.
 */
export default function BlogHeroArt({ posts = [] }) {
  const deck = posts.slice(0, 3);
  const n = deck.length;
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setFront((f) => (f + 1) % n), CYCLE_MS);
    return () => clearInterval(id);
  }, [n, paused]);

  return (
    <div
      className="blog-hero-art"
      onClick={() => n > 1 && setFront((f) => (f + 1) % n)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bhs-ring bhs-ring--1" />
      <div className="bhs-ring bhs-ring--2" />
      {deck.map((p, i) => (
        <div key={p.slug} className={`bhs-pos bhs-slot--${(i - front + n) % n}`}>
          <div className="bhs-float" style={{ animationDelay: `${i * -2.7}s` }}>
            <div className="bhs-card">
              <span className="bhs-img"><Thumb variant={p.thumb || 'default'} /></span>
              {p.tag && <span className="mag-card-tag">{p.tag}</span>}
              <span className="bhs-title">{p.title}</span>
              <span className="bhs-meta">{formatPostDate(p.datePublished)} · {p.readTime}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
