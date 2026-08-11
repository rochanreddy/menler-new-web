import { Link } from 'react-router-dom';
import Thumb from '../common/Thumb';
import Reveal from '../common/Reveal';
import { formatPostDate } from '../../data/blogData';

/**
 * One blog card — used by the listing grid and the related-posts rail so both
 * always look identical. Renders a real <a> (crawlable, unlike an onClick
 * button) inside an <article>. `large` makes it the 2×2 lead card in the grid.
 */
export default function PostCard({ post, delay = 0, large = false }) {
  return (
    <Reveal as="article" delay={delay} className={`mag-card${large ? ' large' : ''}`}>
      <Link className="mag-card-link" to={`/blog/${post.slug}`}>
        <span className="mag-card-img">
          {post.cover
            ? <img src={post.cover} alt="" width="400" height="300" loading="lazy" decoding="async" />
            : <Thumb variant={post.thumb || 'default'} />}
        </span>
        {post.tag && <span className="mag-card-tag">{post.tag}</span>}
        <h3 className="mag-card-h">{post.title}</h3>
        {post.excerpt && <p className="mag-card-ex">{post.excerpt}</p>}
        <span className="mag-card-meta">
          <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
          {post.readTime && <> · {post.readTime}</>}
        </span>
      </Link>
    </Reveal>
  );
}
