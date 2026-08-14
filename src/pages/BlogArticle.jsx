import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Thumb from '../components/common/Thumb';
import PostCard from '../components/blog/PostCard';
import BlogPostingSchema from '../components/blog/BlogPostingSchema';
import { getPostBySlug, getRelatedPosts, formatPostDate } from '../data/blogData';
import { usePosts } from '../lib/usePosts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/** Anything that isn't a site-relative path leaves the site, and says so. */
const outbound = (href) => (String(href || '').startsWith('/')
  ? {}
  : { target: '_blank', rel: 'noopener noreferrer' });

/* A picture with its words. The caption is optional decoration; for an
 * infographic the summary is not — everything the graphic says in pixels is
 * unreadable to a screen reader and to a crawler unless it also exists as
 * text, so it's rendered plainly rather than hidden away in an attribute. */
function Figure({ block }) {
  if (!block.src) return null;
  const info = block.type === 'infographic';
  return (
    <figure className={`article-fig${info ? ' article-fig--info' : ''}`}>
      <img src={block.src} alt={block.alt || ''} loading="lazy" decoding="async" />
      {(block.summary || block.caption) && (
        <figcaption>
          {info && block.summary && <span className="article-fig-sum">{block.summary}</span>}
          {block.caption && <span className="article-fig-cap">{block.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// One body block → one semantic element. Content arrives as structured blocks
// (see blogData.js), so headings are real <h2>/<h3>, never styled <p>s.
function Block({ block }) {
  switch (block.type) {
    case 'h2': return <h2>{block.text}</h2>;
    case 'h3': return <h3>{block.text}</h3>;
    case 'quote': return <blockquote className="pullquote">{block.text}</blockquote>;
    case 'ul': return <ul>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;

    case 'image':
    case 'infographic':
      return <Figure block={block} />;

    // A callout, not another paragraph — it has to read as an offer, and it
    // has to be skippable by anyone who's here to read the article.
    case 'cta':
      return block.href && block.buttonLabel ? (
        <aside className="article-cta">
          <p className="article-cta-text">{block.text}</p>
          <a className="btn-primary article-cta-btn" href={block.href} {...outbound(block.href)}>
            {block.buttonLabel}
          </a>
        </aside>
      ) : null;

    // A standalone reference, deliberately visually separate from the inline
    // links that live inside a paragraph.
    case 'resource':
      return block.href ? (
        <aside className="article-res">
          <span className="article-res-label">Further reading</span>
          <a className="article-res-link" href={block.href} {...outbound(block.href)}>{block.text || block.href}</a>
          {block.description && <p className="article-res-desc">{block.description}</p>}
        </aside>
      ) : null;

    default: return <p>{block.text}</p>;
  }
}

/* The article, either as the public page (by slug) or behind a shareable
 * preview token. Preview reads one extra endpoint and renders the identical
 * markup — the whole point is that what the author checks is what ships. */
export default function BlogArticle({ preview = false }) {
  const { slug, token } = useParams();
  const { posts } = usePosts();
  const [previewState, setPreviewState] = useState({ post: null, error: '', loading: preview });

  useEffect(() => {
    if (!preview) return undefined;
    let alive = true;
    fetch(`${API_URL}/posts/preview/${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok) throw new Error(d?.error || 'This preview link is no longer valid.');
        return d.post;
      })
      .then((p) => { if (alive) setPreviewState({ post: p, error: '', loading: false }); })
      .catch((e) => { if (alive) setPreviewState({ post: null, error: e.message, loading: false }); });
    return () => { alive = false; };
  }, [preview, token]);

  if (preview && previewState.loading) {
    return (
      <>
        <Seo title="Preview | Menler" noindex />
        <div className="empty-state" style={{ padding: '110px 24px' }}>
          <p className="es-icon" aria-hidden="true">◐</p>
          <h3>Loading the preview…</h3>
        </div>
      </>
    );
  }

  const post = preview ? previewState.post : getPostBySlug(slug, posts);

  if (!post) {
    return (
      <>
        <Seo title={preview ? 'Preview | Menler' : 'Story not found | Menler'}
          path={preview ? undefined : `/blog/${slug}`} noindex />
        <div className="empty-state" style={{ padding: '110px 24px' }}>
          <p className="es-icon" aria-hidden="true">◐</p>
          <h3>{preview ? 'This preview link no longer works' : "We couldn't find that story"}</h3>
          <p>
            {preview
              ? (previewState.error || 'It may have been regenerated since it was shared with you. Ask for a fresh link.')
              : 'It may have moved, or the link might be off by a character.'}
          </p>
          <div style={{ marginTop: 18 }}>
            <Link className="btn-primary" to="/blog">Browse All Stories</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const related = getRelatedPosts(post, 3, posts);

  return (
    <>
      <Seo
        title={`${post.title} | Menler`}
        description={post.excerpt}
        keywords={post.tag}
        path={preview ? undefined : `/blog/${post.slug}`}
        image={post.cover || undefined}
        type="article"
        noindex={preview}
      />
      {/* A preview is a private copy of a page that may not be published yet —
          it gets no structured data, so it can never be picked up as the real
          article by anything that follows the link. */}
      {!preview && <BlogPostingSchema post={post} />}

      {preview && (
        <div className="article-previewbar">
          <b>Preview</b>
          <span>
            {post.status === 'published'
              ? 'This post is live. Anyone with this link can read it.'
              : 'This is an unpublished draft. Anyone with this link can read it — it is not on the blog and search engines are told to ignore it.'}
          </span>
        </div>
      )}

      <article className="article-shell">
        <header className="article-hero">
          {post.tag && <p className="article-cat">{post.tag}</p>}
          <h1 className="article-h1">{post.title}</h1>
          <p className="article-dek">{post.excerpt}</p>
          <div className="article-byline">
            <div className="ava" aria-hidden="true">{post.author.initials}</div>
            <div>
              <p className="article-author">{post.author.name}</p>
              <p className="article-meta">
                <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time> · {post.readTime}
              </p>
            </div>
          </div>
        </header>

        <div className="article-cover">
          {post.cover
            ? <img src={post.cover} alt="" width="1200" height="675" fetchPriority="high" decoding="async" />
            : <Thumb variant={post.thumb || 'default'} />}
        </div>

        {post.body ? (
          <div className="article-body">
            {post.body.map((block, i) => <Block key={i} block={block} />)}
          </div>
        ) : (
          <div className="article-coming">
            <p>This story is on its way — we're giving it the edit it deserves.</p>
            <p>Subscribe below or check back soon; in the meantime, the stories under this one are ready to read.</p>
          </div>
        )}

        {/* Author bio + one CTA — after the content, never injected mid-read. */}
        <footer className="article-bio">
          <div className="ava" aria-hidden="true">{post.author.initials}</div>
          <div>
            <p className="article-bio-name">{post.author.name}</p>
            <p className="article-bio-text">
              {post.author.role} — writing about AI-native learning: what actually helps people
              finish, retain, and use what they learn.
            </p>
            <Link className="btn-primary" to="/aptitude" style={{ marginTop: 14 }}>Take the Free AI Aptitude Test</Link>
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <aside className="related" aria-label="Related stories">
          <h2 className="related-h">Keep reading</h2>
          <div className="related-grid">
            {related.map((p, i) => <PostCard key={p.slug} post={p} delay={i * 60} />)}
          </div>
        </aside>
      )}

      <Footer />
    </>
  );
}
