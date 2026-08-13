// Build-time SEO prerender.
//
// The site is a client-rendered SPA, so per-page <Seo> tags are injected by JS
// and are invisible to non-JS crawlers / AI tools (ChatGPT, Bing, social
// scrapers). This runs AFTER `vite build` and, for every indexable route, clones
// the built dist/index.html and bakes in that route's real SEO — title,
// description, keywords, canonical, OG/Twitter, and rich structured data
// (Course / Quiz / FAQPage / BreadcrumbList / CreativeWork / BlogPosting) — plus
// a text fallback. React still boots and renders the full app over the fallback.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { PROJECTS } from '../src/data/projectsData.js';
import { HOME_FAQS, GENERALIST_FAQS, ENGINEERING_FAQS, KICKSTARTER_FAQS } from '../src/data/faqData.js';
import { POLICIES } from '../src/data/policyContent.js';
import { BLOG_POSTS as FILE_POSTS } from '../src/data/blogData.js';

const SITE = 'https://menler.in';

/* Posts live in the database and are written in the admin, so the build asks
 * the API for them. Without this a published post would render only after the
 * browser fetched it — which is fine for a reader and useless for a crawler,
 * and search traffic is most of what a blog is for.
 *
 * If the API can't be reached the build still succeeds using the bundled file,
 * because a deploy blocked by a sleeping backend helps nobody. */
const POSTS_API = process.env.POSTS_API_URL || process.env.VITE_API_URL || 'https://go.menler.in';

async function loadPosts() {
  try {
    const res = await fetch(`${POSTS_API}/posts`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { posts } = await res.json();
    if (Array.isArray(posts) && posts.length) {
      console.log(`✓ Loaded ${posts.length} published posts from ${POSTS_API}`);
      return posts;
    }
    throw new Error('no posts returned');
  } catch (err) {
    console.warn(`! Could not load posts from ${POSTS_API} (${err.message}) — using the bundled file.`);
    return FILE_POSTS;
  }
}

const BLOG_POSTS = await loadPosts();
const DIST = 'dist';
const SOCIAL = [
  'https://www.linkedin.com/company/menler/',
  'https://www.instagram.com/menler.in',
  'https://www.facebook.com/profile.php?id=61589670181082',
];
// Compact org reference used as a course `provider`.
const ORG = { '@type': 'Organization', name: 'Menler', url: SITE };

// Full standalone brand entity (emitted on the homepage).
const ORG_FULL = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Menler',
  alternateName: 'Menler Learning Systems',
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/og-image.png`,
  description: "India's Claude-native AI learning company — AI courses and fellowships (Generalist, Engineering and the Gen AI Kickstarter) with real projects and placement support.",
  sameAs: SOCIAL,
};

// Schema helpers ------------------------------------------------------------
const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.path })),
});

const course = (name, description, workload, urlPath, price) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  provider: ORG,
  url: SITE + urlPath,
  inLanguage: 'en',
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: workload },
  ...(price
    ? { offers: { '@type': 'Offer', price: String(price).replace(/[^\d.]/g, ''), priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: SITE + urlPath } }
    : {}),
});

const faqOf = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// Routes --------------------------------------------------------------------
const STATIC_ROUTES = [
  {
    path: '/', file: 'index.html', nav: 'Home',
    title: 'Menler — AI Learning India · Claude AI Fellowship & Courses',
    description: "India's Claude-native AI learning. AI courses & fellowships — Generalist (no-code), Engineering, and the Gen AI Kickstarter. Real projects.",
    keywords: 'top AI courses, best AI course India, best AI courses in India, top Claude AI courses, best Claude AI course, Claude AI course, Claude AI training, online AI course India, AI certification India, AI learning India, AI courses India, AI fellowship India, Claude AI fellowship, AI upskilling India, AI skills training, AI-native work, AI-native workforce, AI careers India, AI bootcamp India, learn AI India',
    h1: "Menler — India's Claude-native AI learning",
    intro: 'AI courses and fellowships: the no-code Claude AI Generalist, the Claude AI Engineering fellowship, and the 14-day Gen AI Kickstarter. Learn AI, build real projects, and get placement support.',
    jsonLd: [ORG_FULL, faqOf(HOME_FAQS)],
  },
  {
    path: '/generalist', file: 'generalist.html', nav: 'Generalist Fellowship',
    title: 'Claude AI Generalist Fellowship — No-Code AI Course India | Menler',
    description: 'A 10-week no-code Claude AI fellowship for non-tech professionals and students. Master AI workflows across marketing, finance, product, HR & ops — with placement support.',
    keywords: 'best Claude AI course, top AI course for professionals, best no-code AI course, Claude AI Generalist course, no-code AI fellowship, AI generalist program India, AI fellowship for non-tech, best AI course India, AI course for professionals, AI workflows, AI-native work, AI upskilling India, AI course India',
    h1: 'Claude AI Generalist Fellowship',
    intro: 'A 10-week no-code Claude AI fellowship for non-technical professionals and students — master AI workflows across marketing, finance, product, HR and operations, with real projects and placement support.',
    jsonLd: [
      course('Claude AI Generalist Fellowship', '10-week no-code Claude AI fellowship for non-technical professionals — domain AI workflows, real projects and placement support.', '10 weeks', '/generalist', '59999'),
      faqOf(GENERALIST_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'Generalist Fellowship', path: '/generalist' }]),
    ],
  },
  {
    path: '/engineering', file: 'engineering.html', nav: 'Engineering Fellowship',
    title: 'Claude AI Engineering Fellowship — AI Specialist Program India | Menler',
    description: 'A 12-week Claude AI engineering fellowship for developers. Build production AI systems — API, RAG, MCP, agents, evals & LLMOps — with placement support.',
    keywords: 'best AI engineering course, top Claude AI course for developers, best Claude AI course, Claude AI engineering fellowship, AI engineering course India, agentic AI engineering, AI engineering roadmap, AI systems engineering, Claude API engineering, RAG engineering, MCP, agentic AI workflows, AI specialist program India',
    h1: 'Claude AI Engineering Fellowship',
    intro: 'A 12-week Claude AI engineering fellowship for developers — build production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.',
    jsonLd: [
      course('Claude AI Engineering Fellowship', '12-week Claude AI engineering fellowship — production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.', '12 weeks', '/engineering'),
      faqOf(ENGINEERING_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'Engineering Fellowship', path: '/engineering' }]),
    ],
  },
  {
    path: '/kickstarter', file: 'kickstarter.html', nav: 'Gen AI Kickstarter',
    title: 'Gen AI Kickstarter — AI Bootcamp India for Beginners | Menler',
    description: 'A 14-day beginner AI bootcamp. Get hands-on with 10+ AI tools, build your first AI projects, and become AI-fluent — no prerequisites.',
    keywords: 'best beginner AI course, top AI bootcamp India, best AI course for beginners, AI bootcamp India, beginner AI course, Gen AI Kickstarter, learn AI India, AI tools onboarding, AI upskilling, best AI course India',
    h1: 'Gen AI Kickstarter',
    intro: 'A 14-day beginner AI bootcamp — get hands-on with 10+ AI tools, build your first AI projects, and become AI-fluent with no prerequisites.',
    jsonLd: [
      course('Gen AI Kickstarter', '14-day beginner AI bootcamp — hands-on with 10+ AI tools and first real AI projects, no prerequisites.', '14 days', '/kickstarter', '4999'),
      faqOf(KICKSTARTER_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'Gen AI Kickstarter', path: '/kickstarter' }]),
    ],
  },
  {
    path: '/aptitude', file: 'aptitude.html', nav: 'AI Aptitude Test',
    title: 'Menler AI Aptitude Test — Free AI Readiness Assessment',
    description: 'The Menler AI Aptitude Test is a free AI readiness assessment — answer a short set of questions and get a personalised score, a learning roadmap, and program recommendations. No signup to start.',
    keywords: 'menler aptitude, menler aptitude test, menler AI aptitude test, menler.in aptitude, menler AI test, AI aptitude test, AI readiness test, AI test, AI assessment, free AI test, AI generalist mock test, AI engineering mock test, AI workflow aptitude test, AI beginner assessment test, Claude API engineering test, agentic AI engineering test, AI skills assessment, AI career test',
    h1: 'Menler AI Aptitude Test',
    intro: 'The Menler AI Aptitude Test is a free AI readiness assessment — get a personalised score, a learning roadmap, and program recommendations. No signup to start.',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Quiz', name: 'AI Aptitude Test', about: 'AI readiness assessment', educationalLevel: 'Beginner to Advanced', provider: ORG },
      crumbs([{ name: 'Home', path: '/' }, { name: 'AI Aptitude Test', path: '/aptitude' }]),
    ],
  },
  {
    path: '/resources', file: 'resources.html', nav: 'Resources',
    title: 'AI Learning Resources — Prompts, Templates & Guides | Menler',
    description: 'Free AI learning resources: a Claude prompt library, AI stack map, templates, cheat sheets and an AI glossary. The knowledge layer for the AI-native workforce.',
    keywords: 'AI learning resources, free AI resources, AI question bank, AI prompts library, Claude prompts, AI project ideas, AI capstone projects, AI tool setup guide, AI tools ecosystem, AI stack map, AI cheat sheets, AI templates, AI glossary, AI terms explained, agentic AI explained, agentic AI workflows, AI careers India',
    h1: 'The Menler library — free AI learning resources',
    intro: 'Free AI learning resources: a Claude prompt library, an AI stack map, templates, cheat sheets and an AI glossary — the knowledge layer for the AI-native workforce.',
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }])],
  },
  {
    path: '/events', file: 'events.html', nav: 'Events',
    title: 'Free AI Masterclasses & Live Workshops India | Menler Events',
    description: 'Free live AI masterclasses from Menler — hands-on sessions on Claude, AI careers and building real projects, led by people shipping AI work. Past sessions include downloadable resources.',
    keywords: 'free AI workshop India, AI masterclass India, live AI classes, Claude workshop, AI webinar India, free AI training online, AI career session, Claude masterclass, online AI workshop, AI events India',
    h1: 'Expert AI masterclasses on Claude, careers and building',
    intro: 'Live, hands-on AI sessions with people shipping real AI work — practical skills, portfolio-worthy builds and honest answers. Attend the next one free, or download the resources from past sessions.',
    extra: 'Menler runs free live AI masterclasses for students and working professionals across India. Each session is hands-on: you build something during the class rather than watching slides. Sessions cover Claude for everyday work, AI for analysts and operations, building a portfolio recruiters notice, and AI career positioning. Every past session leaves behind downloadable resources — prompt libraries, templates and playbooks — free to anyone who missed it. Upcoming sessions are announced on the Menler WhatsApp community.',
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'Events', path: '/events' }])],
  },
  {
    path: '/community', file: 'community.html', nav: 'Community',
    title: 'Community | Menler',
    description: 'Join the Menler community — updates, free resources, peer support and mentor tips for your AI journey. Connect with us on WhatsApp.',
    keywords: 'Menler community, AI community India, AI learning community, WhatsApp AI group, Claude AI community',
    h1: 'Join the Menler community',
    intro: 'A space for learners, professionals and builders growing their AI skills together — updates, resources and support across all our channels.',
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'Community', path: '/community' }])],
  },
  {
    path: '/outcomes', file: 'outcomes.html', nav: 'Outcomes', noindex: true,
    title: 'AI Placement & Outcomes — AI Jobs After the Fellowship | Menler',
    description: 'Placement outcomes from the Menler AI fellowship — salary bands, hiring partners, fellow portfolios and AI jobs after the program.',
    keywords: 'AI placement programs, AI jobs after AI course, AI career outcomes India, AI fellowship placement, AI salaries India',
    h1: 'AI placement & outcomes',
    intro: 'Placement outcomes from the Menler AI fellowship — salary bands, hiring partners, fellow portfolios, and the AI jobs our fellows land after the program.',
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'Outcomes', path: '/outcomes' }])],
  },
  {
    path: '/about', file: 'about.html', nav: 'About',
    title: 'About Menler — AI Learning Company India',
    description: "Menler is India's Claude-native AI learning company. Our vision: depth over breadth, outcomes over completion — turning learners into AI-native specialists.",
    keywords: 'About Menler, About Menler AI, AI learning company India, Menler AI, AI-native workforce, AI fellowship India',
    h1: 'About Menler',
    intro: "Menler is India's Claude-native AI learning company. Our vision: depth over breadth, outcomes over completion — turning learners into AI-native specialists.",
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  },
  {
    path: '/blog', file: 'blog.html', nav: 'Blog',
    title: 'Menler Blog — AI in Education, Learning & Careers | India',
    description: 'The Menler blog: how AI is changing learning — completion, personalization, choosing an LMS — plus AI careers and AI-native ways of working, written by operators.',
    keywords: 'AI blog India, AI in education, AI learning blog, online course completion, personalized learning, LMS guide, AI careers India',
    h1: 'Notes on AI-native learning. From the people building it.',
    intro: 'The Menler blog — how AI is changing the way people learn and work: build logs, guides, and honest takes, written by operators.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'The Menler Blog',
        url: `${SITE}/blog`,
        publisher: ORG,
        inLanguage: 'en',
        blogPost: BLOG_POSTS.filter((p) => p.body).map((p) => ({
          '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}`, datePublished: p.datePublished,
        })),
      },
      crumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
    ],
  },
];

// Blog posts — generated from the SAME data the pages render, so SEO can never
// drift from the content. Stub posts (no body yet) are skipped: they'd be thin
// pages, so they stay out of the prerender + sitemap until they're written.
const blogPosting = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.title,
  description: p.excerpt,
  image: p.cover || `${SITE}/og-image.png`,
  author: { '@type': p.author?.type || 'Organization', name: p.author?.name || 'Menler', url: SITE },
  publisher: { '@type': 'Organization', name: 'Menler', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png` } },
  datePublished: p.datePublished,
  dateModified: p.dateModified || p.datePublished,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${p.slug}` },
  url: `${SITE}/blog/${p.slug}`,
  ...(p.tag ? { articleSection: p.tag, keywords: p.tag } : {}),
  inLanguage: 'en',
});

// Full article text (with real heading structure) for the crawler fallback —
// this is what AI answer engines lift answers from. (Local escape helper:
// escText below is declared after this module-level code runs.)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blogBodyHtml = (p) =>
  (p.body || [])
    .map((b) => {
      if (b.type === 'h2' || b.type === 'h3') return `<${b.type}>${esc(b.text)}</${b.type}>`;
      if (b.type === 'ul') return `<ul>${b.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul>`;
      if (b.type === 'quote') return `<blockquote>${esc(b.text)}</blockquote>`;
      return `<p>${esc(b.text)}</p>`;
    })
    .join('');

const BLOG_ROUTES = BLOG_POSTS.filter((p) => p.body).map((p) => ({
  path: `/blog/${p.slug}`,
  file: `blog/${p.slug}.html`,
  nav: p.title,
  type: 'article',
  title: `${p.title} | Menler`,
  description: p.excerpt,
  keywords: p.tag,
  h1: p.title,
  intro: p.excerpt,
  extraHtml: blogBodyHtml(p),
  jsonLd: [
    blogPosting(p),
    crumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]),
  ],
}));

// Project detail pages (in the sitemap, but were invisible to crawlers).
const PROJECT_ROUTES = PROJECTS.map((p) => ({
  path: `/projects/${p.slug}`,
  file: `projects/${p.slug}.html`,
  nav: p.title,
  title: `${p.title} — Menler AI Project`,
  description: p.desc,
  keywords: `${p.tag}, AI project, Claude AI, ${(p.stack || []).join(', ')}, agentic AI workflow`,
  h1: p.title,
  intro: p.desc,
  extra: `${p.tag ? p.tag + ' · ' : ''}${(p.stack || []).length ? 'Stack: ' + p.stack.join(', ') + '. ' : ''}${p.outcome ? 'Outcome: ' + p.outcome : ''}`,
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.desc, about: p.tag, creator: ORG, url: `${SITE}/projects/${p.slug}`, inLanguage: 'en' },
    crumbs([{ name: 'Home', path: '/' }, { name: p.title, path: `/projects/${p.slug}` }]),
  ],
}));

// Policy pages.
const POLICY_ROUTES = Object.entries(POLICIES).map(([slug, p]) => ({
  path: `/policy/${slug}`,
  file: `policy/${slug}.html`,
  nav: p.title,
  title: `${p.title} | Menler`,
  description: `${p.title} for Menler Learning Systems Private Limited — how we operate, your rights, and the terms of using Menler's programs and services.`,
  h1: p.title,
  intro: `${p.title} for Menler Learning Systems Private Limited.`,
}));

const ROUTES = [...STATIC_ROUTES, ...BLOG_ROUTES, ...PROJECT_ROUTES, ...POLICY_ROUTES];

// Rendering -----------------------------------------------------------------
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function swap(html, re, value, insertIfMissing) {
  if (re.test(html)) return html.replace(re, (_m, p1, p2) => p1 + value + p2);
  return insertIfMissing ? html.replace('</head>', `    ${insertIfMissing(value)}\n  </head>`) : html;
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`, 'i');
  return swap(html, re, escAttr(value), (v) => `<meta ${attr}="${key}" content="${v}" />`);
}

function fallback(route) {
  const links = STATIC_ROUTES
    .filter((r) => r.path !== route.path)
    .map((r) => `<a href="${r.path}">${escText(r.nav)}</a>`)
    .join(' · ');
  const extra =
    (route.extra ? `<p>${escText(route.extra)}</p>` : '') +
    (route.extraHtml || ''); // pre-escaped structured HTML (e.g. full blog body)
  // Visually hidden (sr-only): present in the HTML for non-JS crawlers/AI, but
  // never shown to users — so there's no flash of fallback text before React
  // boots and replaces #root.
  const srOnly = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  return (
    `<main style="${srOnly}">` +
    `<h1>${escText(route.h1)}</h1><p>${escText(route.intro)}</p>${extra}` +
    `<nav aria-label="Menler pages">${links}</nav></main>`
  );
}

function render(template, route) {
  let html = template;
  const canonical = SITE + route.path;

  html = swap(html, /(<title>)[\s\S]*?(<\/title>)/i, escText(route.title));
  // Keep hidden pages out of search: bake noindex into the static HTML so
  // crawlers see it before React runs (also excluded from the sitemap).
  if (route.noindex) html = setMeta(html, 'name', 'robots', 'noindex, nofollow');
  html = setMeta(html, 'name', 'description', route.description);
  if (route.keywords) html = setMeta(html, 'name', 'keywords', route.keywords);
  html = swap(html, /(<link rel="canonical" href=")[^"]*(")/i, escAttr(canonical),
    (v) => `<link rel="canonical" href="${v}" />`);

  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:type', route.type || 'website');
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);

  const lds = route.jsonLd ? (Array.isArray(route.jsonLd) ? route.jsonLd : [route.jsonLd]) : [];
  for (const ld of lds) {
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
  }

  html = html.replace('<div id="root"></div>', `<div id="root">${fallback(route)}</div>`);
  return html;
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
for (const route of ROUTES) {
  // Directory-index form (e.g. /generalist -> generalist/index.html) so Vercel
  // serves it at the clean path WITHOUT cleanUrls — which keeps the catch-all
  // SPA-fallback rewrite working for non-prerendered routes (e.g. /admin).
  const rel = route.path === '/' ? 'index.html' : `${route.path.replace(/^\/+/, '')}/index.html`;
  const out = join(DIST, rel);
  mkdirSync(dirname(out), { recursive: true });

  let html = render(template, route);
  // Hand the blog pages their posts inline, so the first paint shows real
  // articles instead of a flash of the bundled fallback while the API answers.
  if (route.path === '/blog' || route.path.startsWith('/blog/')) {
    const json = JSON.stringify(BLOG_POSTS).replace(/</g, '\\u003c');
    html = html.replace('</head>', `    <script>window.__POSTS__=${json}</script>\n  </head>`);
  }
  writeFileSync(out, html, 'utf8');
}
console.log(`✓ Prerendered ${ROUTES.length} routes (${STATIC_ROUTES.length} static + ${BLOG_ROUTES.length} blog posts + ${PROJECT_ROUTES.length} projects + ${POLICY_ROUTES.length} policies) with baked-in SEO + structured data.`);

// Sitemap ------------------------------------------------------------------
// Auto-generated from the SAME ROUTES list, so every prerendered indexable page
// is always listed — no hand-maintained sitemap to drift out of sync. noindex
// routes (e.g. /outcomes) are excluded; lastmod is the build date (always fresh).
const today = new Date().toISOString().slice(0, 10);
const sitemapMeta = (path) => {
  if (path === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (['/generalist', '/engineering', '/kickstarter'].includes(path)) return { priority: '0.9', changefreq: 'weekly' };
  if (['/aptitude', '/resources'].includes(path)) return { priority: '0.8', changefreq: 'weekly' };
  if (path === '/blog') return { priority: '0.6', changefreq: 'weekly' };
  if (path.startsWith('/blog/')) return { priority: '0.5', changefreq: 'monthly' };
  if (path.startsWith('/projects/')) return { priority: '0.6', changefreq: 'monthly' };
  if (path.startsWith('/policy/')) return { priority: '0.3', changefreq: 'yearly' };
  return { priority: '0.6', changefreq: 'monthly' }; // community, about, …
};
const sitemapUrls = ROUTES
  .filter((r) => !r.noindex)
  .map((r) => {
    const { priority, changefreq } = sitemapMeta(r.path);
    return `  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  });
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log(`✓ Generated sitemap.xml with ${sitemapUrls.length} indexable URLs (auto-synced with prerender).`);

/* ── llms.txt / llms-full.txt ────────────────────────────────────────────────
 * Answer engines read a site rather than rank it, and they don't run
 * JavaScript. These two files hand them the site as plain prose, generated from
 * the same routes, posts and FAQs everything else uses — a hand-written llms.txt
 * drifts the moment a price or a batch date changes, which is precisely the
 * detail a model will then quote back at somebody for months.
 *
 *   llms.txt       a map: what Menler is, and every page worth reading
 *   llms-full.txt  the answers themselves, so a model can cite us without
 *                  having to fetch and parse ten separate pages
 */
const PROGRAM_FACTS = [
  ['Claude AI Generalist Fellowship', '/generalist',
    'A 10-week, no-code fellowship for non-technical professionals and students. Covers AI workflows across marketing, finance, product, HR and operations. ₹59,999. Includes real projects and placement support. Next batch starts September 2026.'],
  ['Claude AI Generalist — 6 weeks', '/generalist',
    'A shorter 6-week version of the Generalist fellowship. ₹35,000.'],
  ['Claude AI Engineering Fellowship', '/engineering',
    'A 12-week fellowship for developers. Build production AI systems — Claude API, RAG, MCP, agents, evaluations and LLMOps. ₹59,999. Includes placement support. Next batch starts October 2026.'],
  ['Gen AI Kickstarter', '/kickstarter',
    'A 14-day beginner bootcamp — 4 live sessions across 2 weekends. Hands-on with 10+ AI tools, 4 portfolio projects and a certificate. No prerequisites. ₹4,999. Next batch starts 30 August 2026.'],
];

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

const llmsHead = `# Menler

> Menler is an India-based, Claude-native AI learning company. It runs live, cohort-based AI courses and fellowships that teach professionals, students and engineers to build real work with Claude and other AI tools — with real projects, a portfolio, and placement support.

Menler focuses on depth over breadth and outcomes over completion: learners ship real AI assets (workflows, agents, RAG apps) rather than only watching lectures. Every programme is live, cohort-based and delivered online from India.
`;

const llmsTxt = `${llmsHead}
## Programs
${PROGRAM_FACTS.map(([name, path, desc]) => `- [${name}](${SITE}${path}): ${desc}`).join('\n')}

## Free tools & resources
- [AI Aptitude Test](${SITE}/aptitude): A free 15-question AI-readiness assessment with a personalised score and learning roadmap. No signup to start.
- [Library / Resources](${SITE}/resources): Free AI learning resources — a Claude prompt library, AI tool guides, templates, cheat sheets and an AI glossary.
- [Community](${SITE}/community): The Menler community on WhatsApp — updates, resources and support.
- [Events](${SITE}/events): Live workshops and sessions, with recordings and downloadable resources.

## About
- [About Menler](${SITE}/about): Menler's vision, approach and team.
- [What learners build](${SITE}/projects): Real projects shipped by Menler learners across domains.

## Blog
${BLOG_POSTS.filter((p) => p.body).map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${clean(p.excerpt)}`).join('\n') || `- [Menler blog](${SITE}/blog): AI build logs, workflows and career guidance.`}

## Contact
- Website: ${SITE}
- Email: support@menler.in
- LinkedIn: https://www.linkedin.com/company/menler/
- Instagram: https://www.instagram.com/menler.in

## Optional
- [Privacy policy](${SITE}/policy/privacy)
- [Refund policy](${SITE}/policy/refund)
- [Terms](${SITE}/policy/terms)
`;
writeFileSync(join(DIST, 'llms.txt'), llmsTxt, 'utf8');

// The long form: every FAQ answered inline, plus each page's own summary. This
// is the file that lets an answer engine quote Menler accurately instead of
// paraphrasing a nav bar.
const faqSection = (heading, faqs) =>
  `### ${heading}\n\n${faqs.map((f) => `**${clean(f.q)}**\n\n${clean(f.a)}\n`).join('\n')}`;

const postSection = (p) => {
  const body = (p.body || []).map((b) => {
    if (b.type === 'h2') return `### ${clean(b.text)}`;
    if (b.type === 'h3') return `#### ${clean(b.text)}`;
    if (b.type === 'quote') return `> ${clean(b.text)}`;
    if (b.type === 'ul') return (b.items || []).map((i) => `- ${clean(i)}`).join('\n');
    return clean(b.text);
  }).join('\n\n');
  return `### ${clean(p.title)}\n\n${SITE}/blog/${p.slug} · published ${p.datePublished}\n\n${clean(p.excerpt)}\n\n${body}\n`;
};

const llmsFull = `${llmsHead}
This file contains Menler's public information in full, so it can be read and
cited without fetching each page separately. Last built ${today}.

## Programs
${PROGRAM_FACTS.map(([name, path, desc]) => `### ${name}\n\n${SITE}${path}\n\n${desc}\n`).join('\n')}

## Pages
${STATIC_ROUTES.filter((r) => !r.noindex).map((r) => `- **${r.nav}** (${SITE}${r.path}) — ${clean(r.intro || r.description)}`).join('\n')}

## Frequently asked questions

${faqSection('About Menler', HOME_FAQS)}

${faqSection('Claude AI Generalist Fellowship', GENERALIST_FAQS)}

${faqSection('Claude AI Engineering Fellowship', ENGINEERING_FAQS)}

${faqSection('Gen AI Kickstarter', KICKSTARTER_FAQS)}

## Articles
${BLOG_POSTS.filter((p) => p.body).map(postSection).join('\n') || '(no published articles yet)'}

## Contact
Website ${SITE} · Email support@menler.in · LinkedIn https://www.linkedin.com/company/menler/ · Instagram https://www.instagram.com/menler.in
`;
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull, 'utf8');

const faqCount = [HOME_FAQS, GENERALIST_FAQS, ENGINEERING_FAQS, KICKSTARTER_FAQS].reduce((n, f) => n + f.length, 0);
console.log(`✓ Generated llms.txt and llms-full.txt (${PROGRAM_FACTS.length} programmes, ${faqCount} FAQs, ${BLOG_POSTS.filter((p) => p.body).length} articles).`);
