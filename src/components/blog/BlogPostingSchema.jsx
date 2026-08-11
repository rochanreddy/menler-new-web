import { SITE_URL, SITE_NAME } from '../common/Seo';

/**
 * JSON-LD BlogPosting structured data for one post. Renders only the
 * <script type="application/ld+json"> tag — nothing visible. Takes the full
 * post object from blogData, so it works unchanged once real data is wired in.
 * (The build-time prerender bakes the same schema into the static HTML for
 * non-JS crawlers; this keeps the client-rendered DOM equivalent.)
 */
export default function BlogPostingSchema({ post }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover || `${SITE_URL}/og-image.png`,
    author: { '@type': post.author?.type || 'Organization', name: post.author?.name || SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...(post.tag ? { articleSection: post.tag, keywords: post.tag } : {}),
    inLanguage: 'en',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
