// Build-time SEO prerender.
//
// The site is a client-rendered SPA, so the per-page <Seo> tags are injected by
// JavaScript and are invisible to non-JS crawlers / AI tools (ChatGPT, Bing,
// social scrapers). This script runs AFTER `vite build` and, for each known
// route, clones the built dist/index.html and bakes that route's real SEO
// (title, description, keywords, canonical, OG/Twitter, JSON-LD) plus a text
// fallback into the HTML — so bots see full SEO + content without running JS.
// React still boots and renders the full interactive app over the fallback.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const SITE = 'https://menler.in';
const DIST = 'dist';

const ORG = { '@type': 'Organization', name: 'Menler', sameAs: 'https://menler.in' };

const ROUTES = [
  {
    path: '/', file: 'index.html', nav: 'Home',
    title: 'Menler — AI Learning India · Claude AI Fellowship & Courses',
    description: "India's Claude-native AI learning. AI courses & fellowships — Generalist (no-code), Engineering, and the Gen AI Kickstarter. Real projects.",
    keywords: 'AI learning India, AI courses India, AI fellowship India, Claude AI fellowship, AI upskilling India, AI skills training, AI-native work, AI-native workforce, AI careers India, AI jobs future, AI workflows, AI automation workflows, best AI tools, AI productivity tools, large language models explained, enterprise AI transformation, AI adoption, AI bootcamp India',
    h1: "Menler — India's Claude-native AI learning",
    intro: 'AI courses and fellowships: the no-code Claude AI Generalist, the Claude AI Engineering fellowship, and the 14-day Gen AI Kickstarter. Learn AI, build real projects, and get placement support.',
  },
  {
    path: '/generalist', file: 'generalist.html', nav: 'Generalist Fellowship',
    title: 'Claude AI Generalist Fellowship — No-Code AI Course India | Menler',
    description: 'A 10-week no-code Claude AI fellowship for non-tech professionals and students. Master AI workflows across marketing, finance, product, HR & ops — with placement support.',
    keywords: 'Claude AI Generalist course, no-code AI fellowship, AI generalist program India, AI fellowship for non-tech, AI workflows, AI-native work, AI upskilling India, AI course India',
    h1: 'Claude AI Generalist Fellowship',
    intro: 'A 10-week no-code Claude AI fellowship for non-technical professionals and students — master AI workflows across marketing, finance, product, HR and operations, with real projects and placement support.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Course', name: 'Claude AI Generalist Fellowship', description: '10-week no-code Claude AI fellowship for non-technical professionals — domain AI workflows, real projects and placement support.', provider: ORG },
  },
  {
    path: '/engineering', file: 'engineering.html', nav: 'Engineering Fellowship',
    title: 'Claude AI Engineering Fellowship — AI Specialist Program India | Menler',
    description: 'A 12-week Claude AI engineering fellowship for developers. Build production AI systems — API, RAG, MCP, agents, evals & LLMOps — with placement support.',
    keywords: 'Claude AI engineering fellowship, AI engineering course India, agentic AI engineering, AI engineering roadmap, AI systems engineering, Claude API engineering, RAG engineering, MCP, agentic AI workflows, AI specialist program India',
    h1: 'Claude AI Engineering Fellowship',
    intro: 'A 12-week Claude AI engineering fellowship for developers — build production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Course', name: 'Claude AI Engineering Fellowship', description: '12-week Claude AI engineering fellowship — production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.', provider: ORG },
  },
  {
    path: '/kickstarter', file: 'kickstarter.html', nav: 'Gen AI Kickstarter',
    title: 'Gen AI Kickstarter — AI Bootcamp India for Beginners | Menler',
    description: 'A 14-day beginner AI bootcamp. Get hands-on with 10+ AI tools, build your first AI projects, and become AI-fluent — no prerequisites.',
    keywords: 'AI bootcamp India, beginner AI course, Gen AI Kickstarter, AI tools onboarding, AI upskilling, learn AI India',
    h1: 'Gen AI Kickstarter',
    intro: 'A 14-day beginner AI bootcamp — get hands-on with 10+ AI tools, build your first AI projects, and become AI-fluent with no prerequisites.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Course', name: 'Gen AI Kickstarter', description: '14-day beginner AI bootcamp — hands-on with 10+ AI tools and first real AI projects, no prerequisites.', provider: ORG },
  },
  {
    path: '/aptitude', file: 'aptitude.html', nav: 'AI Aptitude Test',
    title: 'AI Aptitude Test — Free AI Readiness Assessment | Menler',
    description: 'Take the free AI Aptitude Test — a 15-question AI readiness assessment. Get a personalised score, learning roadmap and a downloadable question bank. No signup to start.',
    keywords: 'AI aptitude test, AI readiness test, AI test, AI assessment, free AI test, AI generalist mock test, AI engineering mock test, AI workflow aptitude test, AI beginner assessment test, Claude API engineering test, agentic AI engineering test, AI skills assessment, AI career test',
    h1: 'AI Aptitude Test',
    intro: 'A free 15-question AI readiness assessment — get a personalised score, a learning roadmap, and a downloadable question bank. No signup to start.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Quiz', name: 'AI Aptitude Test', about: 'AI readiness assessment', educationalLevel: 'Beginner to Advanced', provider: ORG },
  },
  {
    path: '/resources', file: 'resources.html', nav: 'Resources',
    title: 'AI Learning Resources — Prompts, Templates & Guides | Menler',
    description: 'Free AI learning resources: a Claude prompt library, AI stack map, templates, cheat sheets and an AI glossary. The knowledge layer for the AI-native workforce.',
    keywords: 'AI learning resources, free AI resources, AI question bank, AI prompts library, Claude prompts, AI project ideas, AI capstone projects, AI tool setup guide, AI tools ecosystem, AI stack map, AI cheat sheets, AI templates, AI glossary, AI terms explained, agentic AI explained, agentic AI workflows, AI careers India',
    h1: 'The Menler library — free AI learning resources',
    intro: 'Free AI learning resources: a Claude prompt library, an AI stack map, templates, cheat sheets and an AI glossary — the knowledge layer for the AI-native workforce.',
  },
  {
    path: '/outcomes', file: 'outcomes.html', nav: 'Outcomes',
    title: 'AI Placement & Outcomes — AI Jobs After the Fellowship | Menler',
    description: 'Placement outcomes from the Menler AI fellowship — salary bands, hiring partners, fellow portfolios and AI jobs after the program.',
    keywords: 'AI placement programs, AI jobs after AI course, AI career outcomes India, AI fellowship placement, AI salaries India',
    h1: 'AI placement & outcomes',
    intro: 'Placement outcomes from the Menler AI fellowship — salary bands, hiring partners, fellow portfolios, and the AI jobs our fellows land after the program.',
  },
  {
    path: '/about', file: 'about.html', nav: 'About',
    title: 'About Menler — AI Learning Company India',
    description: "Menler is India's Claude-native AI learning company. Our vision: depth over breadth, outcomes over completion — turning learners into AI-native specialists.",
    keywords: 'About Menler, About Menler AI, AI learning company India, Menler AI, AI-native workforce, AI fellowship India',
    h1: 'About Menler',
    intro: "Menler is India's Claude-native AI learning company. Our vision: depth over breadth, outcomes over completion — turning learners into AI-native specialists.",
  },
  {
    path: '/blog', file: 'blog.html', nav: 'Blog',
    title: 'Menler Blog — AI Build Logs, Workflows & Careers | India',
    description: 'The Menler blog: real Claude build logs, agentic AI workflows, AI career guides, and AI-native ways of working — written by operators, for India\'s AI-native workforce.',
    keywords: 'AI blog India, AI learning blog, agentic AI explained, agentic AI workflows, AI build logs, AI careers India, AI jobs future, AI workflows',
    h1: 'The Menler blog',
    intro: 'Real Claude build logs, agentic AI workflows, AI career guides, and AI-native ways of working — written by operators, for India\'s AI-native workforce.',
  },
];

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

// Replace the inner content of a matched (open)(inner)(close) pattern, or insert
// the tag before </head> if it isn't already present.
function swap(html, re, value, insertIfMissing) {
  if (re.test(html)) return html.replace(re, (_m, p1, p2) => p1 + value + p2);
  return insertIfMissing ? html.replace('</head>', `    ${insertIfMissing(value)}\n  </head>`) : html;
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`, 'i');
  return swap(html, re, escAttr(value), (v) => `<meta ${attr}="${key}" content="${v}" />`);
}

function fallback(route) {
  const links = ROUTES
    .filter((r) => r.path !== route.path)
    .map((r) => `<a href="${r.path}">${escText(r.nav)}</a>`)
    .join(' · ');
  return (
    `<main style="max-width:880px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;line-height:1.6;color:#26215c">` +
    `<h1>${escText(route.h1)}</h1><p>${escText(route.intro)}</p>` +
    `<nav aria-label="Menler pages">${links}</nav></main>`
  );
}

function render(template, route) {
  let html = template;
  const canonical = SITE + route.path;

  html = swap(html, /(<title>)[\s\S]*?(<\/title>)/i, escText(route.title));
  html = setMeta(html, 'name', 'description', route.description);
  if (route.keywords) html = setMeta(html, 'name', 'keywords', route.keywords);
  html = swap(html, /(<link rel="canonical" href=")[^"]*(")/i, escAttr(canonical),
    (v) => `<link rel="canonical" href="${v}" />`);

  // Open Graph + Twitter
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);

  // Page-specific JSON-LD (Course / Quiz) — appended alongside the site-wide org schema.
  if (route.jsonLd) {
    html = html.replace('</head>',
      `  <script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>\n</head>`);
  }

  // Content fallback inside #root (replaced by React on load; visible to no-JS bots).
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback(route)}</div>`);
  return html;
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
let count = 0;
for (const route of ROUTES) {
  const out = join(DIST, route.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(template, route), 'utf8');
  count++;
  console.log(`  prerendered ${route.path.padEnd(14)} -> ${route.file}`);
}
console.log(`\n✓ Prerendered ${count} routes with baked-in SEO.`);
