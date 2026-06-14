import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Reveal from '../components/common/Reveal';
import Thumb from '../components/common/Thumb';
import { useToast } from '../components/common/Toast';
import { submitLead } from '../services/leadService';
import { BLOG_ARTICLES, BLOG_FILTERS } from '../data/blogData';

export default function Blog() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const featured = BLOG_ARTICLES.find(a => a.featured);
  const rest = BLOG_ARTICLES.filter(a => !a.featured);
  const filtered = filter === 'all' ? rest : rest.filter(a => a.filterGroup === filter);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ email, source: 'blog-newsletter' });
      setDone(true);
      toast.success("Subscribed — first issue lands Friday.");
    } catch {
      toast.error("Couldn't subscribe just now. Please try again.");
    }
  };

  return (
    <>
      <Seo
        title="Menler Blog — AI Build Logs, Workflows & Careers | India"
        description="The Menler blog: real Claude build logs, agentic AI workflows, AI career guides, and AI-native ways of working — written by operators, for India's AI-native workforce."
        keywords="AI blog India, AI learning blog, agentic AI explained, agentic AI workflows, AI build logs, AI careers India, AI jobs future, AI workflows"
        path="/blog"
      />
      {/* ── FEATURED HERO ── */}
      <section className="mag-hero">
        <div className="mag-hero-inner">
          <div className="mag-feat-img"><Thumb variant={featured.imgClass || 'default'} /></div>
          <div>
            <p className="mag-feat-cat">{featured.category}</p>
            <h1 className="mag-feat-h">{featured.title}</h1>
            <p className="mag-feat-dek">{featured.dek}</p>
            <div className="mag-feat-author">
              <span className="ava">{featured.authorInitial}</span>
              <span>{featured.author} · {featured.date} · {featured.readTime}</span>
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn-primary" onClick={() => go('/blog/earnings-agent')}>Read story</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER CHIPS ── */}
      <div className="mag-filters">
        <div className="mag-filters-inner">
          {BLOG_FILTERS.map(f => (
            <button key={f.value} className={`filter-chip${filter === f.value ? ' on' : ''}`} onClick={() => setFilter(f.value)}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* ── ARTICLE GRID ── */}
      <section className="mag-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="es-icon" aria-hidden="true">◐</p>
            <h3>No stories here yet</h3>
            <p>We haven't published in this category yet — check back soon, or browse all stories.</p>
            <div style={{ marginTop: 18 }}>
              <button className="btn-primary" onClick={() => setFilter('all')}>View all stories</button>
            </div>
          </div>
        ) : (
          <div className="mag-grid-inner">
            {filtered.map((a, i) => (
              <Reveal
                as="button"
                key={`${a.id}-${filter}`}
                delay={Math.min(i, 6) * 60}
                className={`mag-card${i === 0 && filter === 'all' ? ' large' : ''}`}
                onClick={() => a.slug && go(`/blog/${a.slug}`)}
              >
                <span className={`mag-card-img${a.imgClass ? ` ${a.imgClass}` : ''}`}><Thumb variant={a.imgClass || 'default'} /></span>
                <span className="mag-card-cat">{a.category}</span>
                <span className="mag-card-h">{a.title}</span>
                <span className="mag-card-meta">{a.author} · {a.date} · {a.readTime}</span>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="mini-lead">
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
              <button type="submit">Get Friday issues</button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
