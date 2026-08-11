import { Link, useParams } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Thumb from '../components/common/Thumb';
import PostCard from '../components/blog/PostCard';
import BlogPostingSchema from '../components/blog/BlogPostingSchema';
import { getPostBySlug, getRelatedPosts, formatPostDate } from '../data/blogData';

// One body block → one semantic element. Content arrives as structured blocks
// (see blogData.js), so headings are real <h2>/<h3>, never styled <p>s.
function Block({ block }) {
  switch (block.type) {
    case 'h2': return <h2>{block.text}</h2>;
    case 'h3': return <h3>{block.text}</h3>;
    case 'quote': return <blockquote className="pullquote">{block.text}</blockquote>;
    case 'ul': return <ul>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    default: return <p>{block.text}</p>;
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <Seo title="Story not found | Menler" path={`/blog/${slug}`} noindex />
        <div className="empty-state" style={{ padding: '110px 24px' }}>
          <p className="es-icon" aria-hidden="true">◐</p>
          <h3>We couldn't find that story</h3>
          <p>It may have moved, or the link might be off by a character.</p>
          <div style={{ marginTop: 18 }}>
            <Link className="btn-primary" to="/blog">Browse All Stories</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const related = getRelatedPosts(post, 3);

  return (
    <>
      <Seo
        title={`${post.title} | Menler`}
        description={post.excerpt}
        keywords={post.tag}
        path={`/blog/${post.slug}`}
        image={post.cover || undefined}
        type="article"
      />
      <BlogPostingSchema post={post} />

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
