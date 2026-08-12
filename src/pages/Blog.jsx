import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Thumb from '../components/common/Thumb';
import PostCard from '../components/blog/PostCard';
import BlogHeroArt from '../components/blog/BlogHeroArt';
import { useToast } from '../components/common/Toast';
import { submitLead } from '../services/leadService';
import { sortedPosts, getFeaturedPost, getAllTags, formatPostDate } from '../data/blogData';
import { usePosts } from '../lib/usePosts';

const PAGE_SIZE = 6;

export default function Blog() {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const { posts } = usePosts();
  const featured = getFeaturedPost(posts);
  const tags = getAllTags(posts);
  const rest = sortedPosts(posts).filter((p) => p.slug !== featured?.slug);
  const filtered = filter === 'all' ? rest : rest.filter((p) => p.tag === filter);
  const shown = filtered.slice(0, visible);

  const pickFilter = (tag) => { setFilter(tag); setVisible(PAGE_SIZE); };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ email, source: 'blog-newsletter', cta_label: 'Blog newsletter', section: 'Blog' });
      setDone(true);
      toast.success("Subscribed — first issue lands Friday.");
    } catch {
      toast.error("Couldn't subscribe just now. Please try again.");
    }
  };

  return (
    <>
      <Seo
        title="Menler Blog — AI in Education, Learning & Careers | India"
        description="The Menler blog: how AI is changing learning — completion, personalization, choosing an LMS — plus AI careers and AI-native ways of working, written by operators."
        keywords="AI blog India, AI in education, AI learning blog, online course completion, personalized learning, LMS guide, AI careers India"
        path="/blog"
      />

      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero — The Menler Blog">
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring r3" />
        <div className="hero-grid" style={{ minHeight: 'min(480px, calc(100dvh - 130px))' }}>
          <div className="hero-visual" aria-hidden="true">
            <BlogHeroArt posts={[featured, ...rest].filter(Boolean)} />
          </div>
          <div className="hero-inner">
            <p className="hero-eyebrow">The Menler Blog</p>
            <h1 className="hero-h1">Notes on AI-native<br />learning. <em>From the<br />people building it.</em></h1>
            <p className="hero-sub">How AI is changing the way people learn and work — build logs, guides, and honest takes, written by operators.</p>
            <div className="hero-actions">
              {featured && <Link className="btn-primary" to={`/blog/${featured.slug}`}>Read the Latest Story</Link>}
              <a className="btn-outline" href="#newsletter">Get Friday Issues</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED STORY ── */}
      <section className="mag-hero" aria-label="Featured story">
        <p className="mag-feat-label">Featured story</p>
        {featured && (
          <article className="mag-hero-inner">
            <Link to={`/blog/${featured.slug}`} className="mag-feat-img" aria-hidden="true" tabIndex={-1}>
              {featured.cover
                ? <img src={featured.cover} alt="" width="1200" height="750" fetchPriority="high" />
                : <Thumb variant={featured.thumb || 'default'} />}
            </Link>
            <div>
              {featured.tag && <p className="mag-feat-cat">{featured.tag}</p>}
              <h2 className="mag-feat-h">
                <Link to={`/blog/${featured.slug}`} className="mag-feat-link">{featured.title}</Link>
              </h2>
              <p className="mag-feat-dek">{featured.excerpt}</p>
              <div className="mag-feat-author">
                <span className="ava" aria-hidden="true">{featured.author.initials}</span>
                <span>
                  {featured.author.name} · <time dateTime={featured.datePublished}>{formatPostDate(featured.datePublished)}</time> · {featured.readTime}
                </span>
              </div>
              <div style={{ marginTop: 20 }}>
                <Link className="btn-primary" to={`/blog/${featured.slug}`}>Read Story</Link>
              </div>
            </div>
          </article>
        )}
      </section>

      {/* ── TAG FILTERS ── */}
      {tags.length > 0 && (
        <div className="mag-filters">
          <div className="mag-filters-inner" role="group" aria-label="Filter stories by topic">
            <button className={`filter-chip${filter === 'all' ? ' on' : ''}`} onClick={() => pickFilter('all')} aria-pressed={filter === 'all'}>All</button>
            {tags.map((t) => (
              <button key={t} className={`filter-chip${filter === t ? ' on' : ''}`} onClick={() => pickFilter(t)} aria-pressed={filter === t}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── STORY GRID ── */}
      <section className="mag-grid" aria-label="All stories">
        {shown.length === 0 ? (
          <div className="empty-state">
            <p className="es-icon" aria-hidden="true">◐</p>
            <h3>No stories here yet</h3>
            <p>We haven't published in this topic yet — check back soon, or browse all stories.</p>
            <div style={{ marginTop: 18 }}>
              <button className="btn-primary" onClick={() => pickFilter('all')}>View All Stories</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mag-grid-inner">
              {shown.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={Math.min(i, 6) * 60} />
              ))}
            </div>
            {filtered.length > visible && (
              <div className="blog-loadmore">
                <button onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more stories ({filtered.length - visible} more)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="mini-lead" id="newsletter">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Subscribe to the<br /><em>Menler newsletter.</em></h3>
            <p>One issue every Friday morning. Best build log of the week, one career-shaping data point, one prompt to try over the weekend.</p>
          </div>
          {done ? (
            <p style={{ color: 'var(--placed)', fontWeight: 500 }}>✓ You're subscribed. See you Friday.</p>
          ) : (
            <form className="mini-lead-form" onSubmit={handleNewsletter}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <button type="submit">Get Friday Issues</button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
