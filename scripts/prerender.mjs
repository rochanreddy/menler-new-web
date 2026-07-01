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

const SITE = 'https://menler.in';
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
    title: 'AI Aptitude Test — Free AI Readiness Assessment | Menler',
    description: 'Take the free AI Aptitude Test — a 15-question AI readiness assessment. Get a personalised score, learning roadmap and a downloadable question bank. No signup to start.',
    keywords: 'AI aptitude test, AI readiness test, AI test, AI assessment, free AI test, AI generalist mock test, AI engineering mock test, AI workflow aptitude test, AI beginner assessment test, Claude API engineering test, agentic AI engineering test, AI skills assessment, AI career test',
    h1: 'AI Aptitude Test',
    intro: 'A free 15-question AI readiness assessment — get a personalised score, a learning roadmap, and a downloadable question bank. No signup to start.',
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
    title: 'Menler Blog — AI Build Logs, Workflows & Careers | India',
    description: "The Menler blog: real Claude build logs, agentic AI workflows, AI career guides, and AI-native ways of working — written by operators, for India's AI-native workforce.",
    keywords: 'AI blog India, AI learning blog, agentic AI explained, agentic AI workflows, AI build logs, AI careers India, AI jobs future, AI workflows',
    h1: 'The Menler blog',
    intro: "Real Claude build logs, agentic AI workflows, AI career guides, and AI-native ways of working — written by operators, for India's AI-native workforce.",
    jsonLd: [crumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])],
  },
  {
    path: '/blog/earnings-agent', file: 'blog/earnings-agent.html', nav: 'Earnings agent build log', type: 'article',
    title: 'How we shipped a Claude-native earnings agent in six days | Menler',
    description: "Full prompt, full MCP map, full failure log — the Claude-native earnings agent build that shaped Menler's Finance track. Agentic AI workflows explained by operators.",
    keywords: 'agentic AI explained, agentic AI workflows, Claude earnings agent, MCP, AI build log, AI blog India, enterprise AI use cases',
    h1: 'How we shipped a Claude-native earnings agent in six days',
    intro: "Full prompt, full MCP map, full failure log — the Claude-native earnings agent build that shaped Menler's Finance track.",
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: 'How we shipped a Claude-native earnings agent in six days', description: "Full prompt, full MCP map, full failure log — the Claude-native earnings agent build that shaped Menler's Finance track.", author: ORG, publisher: ORG, mainEntityOfPage: `${SITE}/blog/earnings-agent`, inLanguage: 'en' },
      crumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Earnings agent', path: '/blog/earnings-agent' }]),
    ],
  },
];

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

const ROUTES = [...STATIC_ROUTES, ...PROJECT_ROUTES, ...POLICY_ROUTES];

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
  const extra = route.extra ? `<p>${escText(route.extra)}</p>` : '';
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
  writeFileSync(out, render(template, route), 'utf8');
}
console.log(`✓ Prerendered ${ROUTES.length} routes (${STATIC_ROUTES.length} static + ${PROJECT_ROUTES.length} projects + ${POLICY_ROUTES.length} policies) with baked-in SEO + structured data.`);
