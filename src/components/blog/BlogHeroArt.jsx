import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Thumb from '../common/Thumb';
import { formatPostDate } from '../../data/blogData';

const CYCLE_MS = 3500;

/** The face of one card — identical whether it's a link or a deck control. */
function Face({ post }) {
  return (
    <>
      <span className="bhs-img"><Thumb variant={post.thumb || 'default'} /></span>
      {post.tag && <span className="mag-card-tag">{post.tag}</span>}
      <span className="bhs-title">{post.title}</span>
      <span className="bhs-meta">{formatPostDate(post.datePublished)} · {post.readTime}</span>
    </>
  );
}

/**
 * Blog hero visual — a deck of real story cards stacked one behind another.
 * The front card recedes and the next comes forward on a timer; hover or
 * keyboard focus pauses it. Slot positions live in CSS (.bhs-slot--N) and
 * transition smoothly as slots reassign; auto-cycling stops for reduced motion.
 *
 * The cards are the stories, so they behave like them: the front one is a real
 * link to its post, and the ones behind bring themselves forward when clicked.
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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="bhs-ring bhs-ring--1" aria-hidden="true" />
      <div className="bhs-ring bhs-ring--2" aria-hidden="true" />
      {deck.map((p, i) => {
        const slot = (i - front + n) % n;
        return (
          <div key={p.slug} className={`bhs-pos bhs-slot--${slot}`}>
            <div className="bhs-float" style={{ animationDelay: `${i * -2.7}s` }}>
              {slot === 0 ? (
                <Link className="bhs-card" to={`/blog/${p.slug}`}>
                  <Face post={p} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="bhs-card bhs-card--back"
                  onClick={() => setFront(i)}
                  aria-label={`Bring “${p.title}” to the front of the deck`}
                >
                  <Face post={p} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
