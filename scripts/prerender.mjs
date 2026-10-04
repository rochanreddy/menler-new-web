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
import { DOMAIN_TRACKS, GENERALIST_WEEKS, KICKSTARTER_DAYS, KICKSTARTER_MODULES } from '../src/data/curriculumData.js';
import { RESOURCE_PACKS } from '../src/data/resourceCatalog.js';
import { HIRING_COMPANIES } from '../src/data/hiringCompanies.js';
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
// The organisation is one entity with one @id — the same one index.html
// declares — so a course's `provider` and the homepage's brand block resolve to
// a single node instead of three look-alikes a crawler has to guess are related.
const ORG_ID = `${SITE}/#organization`;
// Compact org reference used as a course `provider`.
const ORG = { '@type': 'Organization', '@id': ORG_ID, name: 'Menler', url: SITE, sameAs: SOCIAL };

// Full standalone brand entity (emitted on the homepage).
const ORG_FULL = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': ORG_ID,
  name: 'Menler',
  alternateName: ['Menler Learning Systems', 'Menler AI'],
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/og-image.png`,
  description: "India's Claude-native AI learning company — the AI Generalist Fellowship (no-code), the AI Engineering Fellowship and the Gen AI Kickstarter for beginners, with real projects and placement support.",
  knowsAbout: ['AI generalist skills', 'Generative AI', 'Claude', 'AI automation', 'No-code AI', 'AI engineering', 'Prompt engineering'],
  sameAs: SOCIAL,
};

// Schema helpers ------------------------------------------------------------
const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.path })),
});

/* A Course, in the shape Google's course results require: an offer with a
 * category, and an instance with a mode and a schedule. The old `courseWorkload:
 * '10 weeks'` was not a valid duration, so the block read as a course with no
 * usable instance. `weeks` x `hoursPerWeek` is the schedule the page itself
 * states. */
const course = ({ name, alternateName, description, path, price, weeks, hoursPerWeek, level, prerequisites, credential, teaches }) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': `${SITE}${path}#course`,
  name,
  ...(alternateName ? { alternateName } : {}),
  description,
  provider: ORG,
  url: SITE + path,
  image: `${SITE}/og-image.png`,
  inLanguage: 'en',
  ...(level ? { educationalLevel: level } : {}),
  ...(prerequisites ? { coursePrerequisites: prerequisites } : {}),
  ...(credential ? { educationalCredentialAwarded: credential } : {}),
  ...(teaches ? { teaches } : {}),
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    courseSchedule: { '@type': 'Schedule', repeatFrequency: 'Weekly', repeatCount: weeks, duration: `PT${hoursPerWeek}H` },
  },
  offers: {
    '@type': 'Offer',
    category: 'Paid',
    ...(price ? { price: String(price), priceCurrency: 'INR' } : {}),
    availability: 'https://schema.org/InStock',
    url: SITE + path,
  },
});

const faqOf = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

/* The programmes, one line each. Used by llms.txt and by the homepage's
 * crawlable text, so both describe a programme in the same words. */
const PROGRAM_FACTS = [
  /* Batch dates are deliberately absent: a date here outlives the batch, and an
     answer engine then repeats a start date that has already passed. The
     programme pages carry the live dates. */
  ['AI Generalist Fellowship (Claude AI Generalist)', '/generalist',
    'A 10-week, no-code AI generalist course and fellowship for non-technical professionals and students — how to become an AI generalist. Covers Claude and 35+ AI tools for research, writing, automation (n8n, Make, Zapier) and no-code building, applied across marketing, finance, product, HR and operations. ₹59,999. Includes real projects and placement support.'],
  ['AI Generalist Fellowship — 6 weeks', '/generalist',
    'A shorter 6-week version of the AI Generalist Fellowship. ₹35,000.'],
  ['AI Engineering Fellowship (Claude AI Engineering)', '/engineering',
    'A 12-week fellowship for developers. Build production AI systems — Claude API, RAG, MCP, agents, evaluations and LLMOps. ₹59,999. Includes placement support.'],
  ['Gen AI Kickstarter (AI Kickstarter)', '/kickstarter',
    'A 14-day AI course for complete beginners — 4 live sessions across 2 weekends. Hands-on with 10+ AI tools, 4 portfolio projects and a certificate. No prerequisites. ₹4,999.'],
];

// The three programmes as a list, for the homepage: it tells a crawler these
// are the site's main entities, not three pages among thirty.
const PROGRAM_LIST = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Menler AI programs',
  itemListElement: [
    ['AI Generalist Fellowship', '/generalist'],
    ['Gen AI Kickstarter', '/kickstarter'],
    ['AI Engineering Fellowship', '/engineering'],
  ].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, url: SITE + path })),
};

// Routes --------------------------------------------------------------------
const STATIC_ROUTES = [
  {
    path: '/', file: 'index.html', nav: 'Home',
    title: "Menler — AI Courses India · AI Generalist Fellowship & Gen AI Kickstarter",
    description: "Menler is India's Claude-native AI learning company. Become an AI generalist with the no-code AI Generalist Fellowship, start with the 14-day Gen AI Kickstarter, or build AI systems in the Engineering Fellowship.",
    keywords: "Menler, Menler AI, AI courses India, best AI course India, AI generalist, AI generalist course, AI generalist fellowship, AI kickstarter, Gen AI Kickstarter, AI course for beginners, AI engineering fellowship, AI fellowship India, AI bootcamp India, no-code AI course, Claude AI course, learn AI India, AI upskilling India, AI certification India, AI careers India, top AI courses, best AI courses in India, Claude AI training, online AI course India",
    h1: "Menler — AI courses India: AI Generalist Fellowship & Gen AI Kickstarter",
    intro: 'AI courses and fellowships: the no-code AI Generalist Fellowship (Claude AI Generalist), the AI Engineering Fellowship, and the 14-day Gen AI Kickstarter for beginners. Learn AI, build real projects, and get placement support.',
    jsonLd: [ORG_FULL, PROGRAM_LIST, faqOf(HOME_FAQS)],
    programs: PROGRAM_FACTS,
    faqs: HOME_FAQS,
    hiring: HIRING_COMPANIES,
  },
  {
    path: '/generalist', file: 'generalist.html', nav: 'AI Generalist Fellowship',
    title: "AI Generalist Course & Fellowship — No-Code, Claude AI | Menler",
    description: "Menler's AI Generalist Fellowship: a 10-week no-code AI generalist course for professionals and students in India. Learn Claude, ChatGPT and AI automation for marketing, finance, product, HR & ops — with placement support.",
    keywords: "AI generalist, AI generalist course, AI generalist program, AI generalist fellowship, AI generalist course India, generalist AI course, generalist program, generalist fellowship, Menler generalist, become an AI generalist, what is an AI generalist, no-code AI course, AI course for non-tech professionals, AI course for professionals, AI workflows course, AI automation course, Claude AI Generalist, Claude AI course, best AI course India",
    h1: 'AI Generalist Course & Fellowship — Claude AI Generalist',
    intro: 'The Menler AI Generalist Fellowship is a 10-week no-code AI generalist course for professionals and students — learn Claude and the wider AI stack, and apply AI workflows across marketing, finance, product, HR and operations, with real projects and placement support.',
    extra: 'An AI generalist uses AI across everyday work — research, writing, analysis, presentations, automation and building simple tools — without needing to code. The Menler AI Generalist Fellowship trains this role over 10 weeks: prompting and context, AI research, AI for documents, creative and media tools, automation with n8n, Make and Zapier, voice AI, and no-code building with Lovable and Claude Code, applied in domain tracks for marketing, finance, product, HR, operations and more. The Menler Generalist program runs live online as 20 sessions and 50 hours of instruction, costs ₹59,999, and ends with a project portfolio, a Claude Specialist certificate and placement support.',
    jsonLd: [
      course({
        name: 'AI Generalist Fellowship',
        alternateName: ['Claude AI Generalist Fellowship', 'AI Generalist Course', 'Menler Generalist', 'Generalist AI Program'],
        description: '10-week no-code AI generalist course and fellowship — Claude and the wider AI stack applied to real work, with domain projects and placement support.',
        path: '/generalist', price: 59999, weeks: 10, hoursPerWeek: 10,
        level: 'Beginner', prerequisites: 'None — no coding experience required.',
        credential: 'Claude Specialist certificate',
        teaches: ['Prompting and context', 'AI research and writing', 'AI for documents and presentations', 'AI automation with n8n, Make and Zapier', 'No-code building with Lovable and Claude Code'],
      }),
      faqOf(GENERALIST_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'AI Generalist Fellowship', path: '/generalist' }]),
    ],
    faqs: GENERALIST_FAQS,
    weeks: GENERALIST_WEEKS,
    tracks: DOMAIN_TRACKS,
  },
  {
    path: '/engineering', file: 'engineering.html', nav: 'Engineering Fellowship',
    title: 'Claude AI Engineering Fellowship — AI Specialist Program India | Menler',
    description: 'A 12-week Claude AI engineering fellowship for developers. Build production AI systems — API, RAG, MCP, agents, evals & LLMOps — with placement support.',
    keywords: 'best AI engineering course, top Claude AI course for developers, best Claude AI course, Claude AI engineering fellowship, AI engineering course India, agentic AI engineering, AI engineering roadmap, AI systems engineering, Claude API engineering, RAG engineering, MCP, agentic AI workflows, AI specialist program India',
    h1: 'Claude AI Engineering Fellowship',
    intro: 'A 12-week Claude AI engineering fellowship for developers — build production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.',
    jsonLd: [
      course({
        name: 'Claude AI Engineering Fellowship',
        alternateName: ['AI Engineering Fellowship', 'Menler Engineering'],
        description: '12-week Claude AI engineering fellowship — production AI systems: API, RAG, MCP, agents, evals and LLMOps, with placement support.',
        path: '/engineering', weeks: 12, hoursPerWeek: 12,
        prerequisites: 'Working knowledge of Python or JavaScript.',
      }),
      faqOf(ENGINEERING_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'Engineering Fellowship', path: '/engineering' }]),
    ],
    faqs: ENGINEERING_FAQS,
  },
  {
    path: '/kickstarter', file: 'kickstarter.html', nav: 'Gen AI Kickstarter',
    title: "Gen AI Kickstarter — 14-Day AI Course for Beginners | Menler",
    description: "Menler's Gen AI Kickstarter is a 14-day AI course for complete beginners in India. Get hands-on with 10+ AI tools, ship 4 mini-builds and earn a certificate — no prerequisites, ₹4,999.",
    keywords: "AI Kickstarter, Gen AI Kickstarter, AI kickstarter course, kickstarter AI course, Menler kickstarter, generative AI course for beginners, AI course for beginners, beginner AI course India, AI bootcamp India, 14 day AI course, short AI course, learn AI from scratch, AI tools course, AI certificate course, best AI course for beginners",
    h1: 'Gen AI Kickstarter — AI Kickstarter Course for Beginners',
    intro: "Menler's Gen AI Kickstarter is a 14-day AI course for complete beginners — get hands-on with 10+ AI tools, ship 4 mini-builds and earn a fluency certificate, with no prerequisites.",
    jsonLd: [
      course({
        name: 'Gen AI Kickstarter',
        alternateName: ['AI Kickstarter', 'Menler Kickstarter', 'Menler AI Kickstarter', 'AI Kickstarter Course'],
        description: '14-day generative AI course for complete beginners — hands-on with 10+ AI tools, 4 mini-builds and a certificate, no prerequisites.',
        path: '/kickstarter', price: 4999, weeks: 2, hoursPerWeek: 4,
        level: 'Beginner', prerequisites: 'None.',
        credential: 'Menler AI Kickstarter Certificate',
        teaches: KICKSTARTER_MODULES.map((m) => m.title),
      }),
      faqOf(KICKSTARTER_FAQS),
      crumbs([{ name: 'Home', path: '/' }, { name: 'Gen AI Kickstarter', path: '/kickstarter' }]),
    ],
    extra: 'The Menler Kickstarter — also called the AI Kickstarter — is the entry programme: 4 live sessions across 2 weekends, 8 live hours in all, for ₹4,999. You build a personal AI operating system on Claude, a research system and an automation, then ship a capstone on Demo Day and earn the Menler AI Kickstarter Certificate. Kickstarter alumni get a 30% scholarship to the AI Generalist Fellowship or the AI Engineering Fellowship.',
    days: KICKSTARTER_DAYS,
    modules: KICKSTARTER_MODULES,
    faqs: KICKSTARTER_FAQS,
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
    path: '/projects', file: 'projects.html', nav: 'What learners build',
    title: 'AI Projects Built With Claude — What Menler Learners Ship | Menler',
    description: 'Twenty real AI projects built by Menler learners — agents, RAG pipelines, automations and internal tools across product, finance, sales, HR and engineering.',
    keywords: 'AI projects, Claude AI projects, AI portfolio projects, real AI projects India, AI agent projects, RAG project examples, AI automation examples, AI portfolio for jobs, what to build with Claude',
    h1: 'What Menler learners build',
    intro: 'Twenty real projects shipped during Menler fellowships — AI agents, RAG pipelines, automations and internal tools built with Claude across product, finance, sales, operations, HR and engineering.',
    projectList: PROJECTS,
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'ItemList',
        name: 'AI projects built by Menler learners',
        description: 'Real AI projects shipped during Menler fellowships.',
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.title,
          description: p.desc, url: `${SITE}/projects/${p.slug}`,
        })),
      },
      crumbs([{ name: 'Home', path: '/' }, { name: 'What learners build', path: '/projects' }]),
    ],
  },
  {
    path: '/resources', file: 'resources.html', nav: 'Resources',
    title: 'AI Learning Resources — Prompts, Templates & Guides | Menler',
    description: 'Free AI learning resources: a Claude prompt library, AI stack map, templates, cheat sheets and an AI glossary. The knowledge layer for the AI-native workforce.',
    keywords: 'AI learning resources, free AI resources, AI question bank, AI prompts library, Claude prompts, AI project ideas, AI capstone projects, AI tool setup guide, AI tools ecosystem, AI stack map, AI cheat sheets, AI templates, AI glossary, AI terms explained, agentic AI explained, agentic AI workflows, AI careers India',
    h1: 'The Menler library — free AI learning resources',
    intro: 'Free AI learning resources: a Claude prompt library, an AI stack map, templates, cheat sheets and an AI glossary — the knowledge layer for the AI-native workforce.',
    packs: RESOURCE_PACKS,
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
    // Held back from search while the blog is still being trialled. noindex
    // rather than a robots.txt block: Google has to fetch a page to see that
    // it should drop it, so disallowing crawling would freeze whatever is
    // already indexed instead of removing it.
    path: '/blog', file: 'blog.html', nav: 'Blog', noindex: true,
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
const escA = (s) => esc(s).replace(/"/g, '&quot;');
const blogBodyHtml = (p) =>
  (p.body || [])
    .map((b) => {
      if (b.type === 'h2' || b.type === 'h3') return `<${b.type}>${esc(b.text)}</${b.type}>`;
      if (b.type === 'ul') return `<ul>${b.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul>`;
      if (b.type === 'quote') return `<blockquote>${esc(b.text)}</blockquote>`;
      if (b.type === 'image' || b.type === 'infographic') {
        if (!b.src) return '';
        // The alt text and — for an infographic — the summary are the whole
        // reason these fields are mandatory: this fallback is what an answer
        // engine reads, and it can't see the picture either.
        const words = [b.type === 'infographic' ? b.summary : '', b.caption].filter(Boolean);
        return `<figure><img src="${escA(b.src)}" alt="${escA(b.alt || '')}" />`
          + (words.length ? `<figcaption>${words.map((w) => `<p>${esc(w)}</p>`).join('')}</figcaption>` : '')
          + '</figure>';
      }
      if (b.type === 'cta') {
        if (!b.href || !b.buttonLabel) return '';
        return `<p>${esc(b.text)} <a href="${escA(b.href)}">${esc(b.buttonLabel)}</a></p>`;
      }
      if (b.type === 'resource') {
        if (!b.href) return '';
        return `<p>Further reading: <a href="${escA(b.href)}">${esc(b.text || b.href)}</a>`
          + (b.description ? ` — ${esc(b.description)}` : '') + '</p>';
      }
      return `<p>${esc(b.text)}</p>`;
    })
    .join('');

const BLOG_ROUTES = BLOG_POSTS.filter((p) => p.body).map((p) => ({
  noindex: true,          // held back from search while the blog is trialled
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

/**
 * A project's case study, as readable text.
 *
 * Each project already carries a structured `doc` — overview, problem, how it
 * works, features, architecture, results — and it was rendered by React and by
 * nothing else. These twenty pages are the site's proof: they are the answer to
 * "what do people actually build", which is the question an answer engine is
 * most likely to want Menler for. Leaving them at a title and one line of
 * description made them the thinnest pages on the site and the least quotable.
 *
 * Real headings rather than one paragraph, because a crawler reading h2/h3 can
 * quote a section; reading a wall it can only summarise the lot.
 */
function projectDoc(doc) {
  // esc, not escText: this runs while PROJECT_ROUTES is built at module level,
  // before escText is initialised. Same reason blogBodyHtml uses it.
  if (!doc) return '';
  const para = (h, t) => (t ? `<h2>${esc(h)}</h2><p>${esc(t)}</p>` : '');
  const list = (h, items) =>
    Array.isArray(items) && items.length
      ? `<h2>${esc(h)}</h2><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
      : '';
  return (
    para('Overview', doc.overview) +
    para('The problem', doc.problem) +
    list('How it works', doc.howItWorks) +
    list('What it does', doc.features) +
    para('Architecture', doc.architecture) +
    list('Results', doc.results)
  );
}

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
  extraHtml: projectDoc(p.doc),
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.desc, about: p.tag, creator: ORG, url: `${SITE}/projects/${p.slug}`, inLanguage: 'en' },
    crumbs([{ name: 'Home', path: '/' }, { name: p.title, path: `/projects/${p.slug}` }]),
  ],
}));

// Policy pages.
const POLICY_ROUTES = Object.entries(POLICIES).map(([slug, p]) => ({
  policy: p,   // the sections themselves, rendered into the fallback
  path: `/policy/${slug}`,
  file: `policy/${slug}.html`,
  nav: p.title,
  title: `${p.title} | Menler`,
  description: `${p.title} for Menler Learning Systems Private Limited — how we operate, your rights, and the terms of using Menler's programs and services.`,
  h1: p.title,
  intro: `${p.title} for Menler Learning Systems Private Limited.`,
}));

const ROUTES = [...STATIC_ROUTES, ...BLOG_ROUTES, ...PROJECT_ROUTES, ...POLICY_ROUTES];

/* Whether the blog is advertised to answer engines. Derived from the routes so
 * it can't disagree with them: a blog held back from search shouldn't be
 * offered up in llms.txt either. */
const BLOG_PUBLIC = BLOG_ROUTES.some((r) => !r.noindex);

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

/**
 * The FAQ, as readable text rather than only as structured data.
 *
 * Every route with an FAQPage in its JSON-LD already carries this copy — it was
 * being handed to search engines as markup and withheld from the page itself.
 * That is the wrong way round for the crawlers that matter most here: GPTBot,
 * ClaudeBot and PerplexityBot do not execute JavaScript and do not read
 * JSON-LD as prose, so they were getting a heading and one sentence off pages
 * meant to answer exactly the questions these FAQs answer.
 *
 * It is the same words in both places on purpose. An FAQ that says one thing in
 * the markup and another in the text is worse than either alone.
 */
function faqHtml(faqs) {
  if (!Array.isArray(faqs) || !faqs.length) return '';
  return (
    '<section><h2>Frequently asked questions</h2>' +
    faqs.map((f) => `<h3>${escText(f.q)}</h3><p>${escText(f.a)}</p>`).join('') +
    '</section>'
  );
}

/**
 * The index of what learners build.
 *
 * Two jobs. It is the page llms.txt already points answer engines at for "what
 * do Menler learners build" — which until now served the homepage, canonical
 * and all. And it is the only internal link to the twenty project pages that a
 * crawler without JavaScript can follow: they were in the sitemap and linked
 * from nowhere, which is discovery without any signal that they matter.
 */
function projectListHtml(projects) {
  if (!Array.isArray(projects) || !projects.length) return '';
  return '<section><h2>Projects</h2><ul>' + projects.map((p) =>
    `<li><a href="/projects/${escAttr(p.slug)}">${escText(p.title)}</a>` +
    (p.tag ? ` — ${escText(p.tag)}` : '') +
    (p.desc ? `. ${escText(p.desc)}` : '') +
    (p.outcome ? ` Outcome: ${escText(p.outcome)}` : '') +
    '</li>'
  ).join('') + '</ul></section>';
}

/**
 * The resource library, itemised.
 *
 * A page called "resources" that does not name a single resource cannot be the
 * answer to "free Claude prompt library" or "AI templates" — the two hundred
 * things it actually contains were a React render away. Each pack lists what
 * is in it, which is the level of detail those searches are written at.
 */
function packsHtml(packs) {
  if (!packs) return '';
  const entries = Array.isArray(packs) ? packs : Object.values(packs);
  if (!entries.length) return '';
  return '<section><h2>Resource packs</h2>' + entries.map((p) =>
    `<h3>${escText(p.title || '')}</h3>` +
    (p.desc ? `<p>${escText(p.desc)}</p>` : '') +
    (p.items?.length
      ? `<ul>${p.items.map((i) =>
          `<li>${escText(i.title || '')}${i.desc ? ' — ' + escText(i.desc) : ''}</li>`).join('')}</ul>`
      : '')
  ).join('') + '</section>';
}

/**
 * Who hires from here, by name.
 *
 * "Placement support" is a claim; twenty-five named companies is evidence, and
 * it is the evidence someone asking "is this course worth it" is looking for.
 * The logos were already on the page — the names were not in the HTML.
 */
function hiringHtml(companies) {
  if (!Array.isArray(companies) || !companies.length) return '';
  return '<section><h2>Where our learners are hired</h2><ul>' +
    companies.map((c) => `<li>${escText(c.name)}</li>`).join('') +
    '</ul></section>';
}

/**
 * The syllabus, as text.
 *
 * "What will I actually learn" is the question a course page exists to answer,
 * and the answer was rendered by React alone. It is also the shape of query an
 * answer engine gets asked constantly — what a course covers, in what order,
 * with which tools — and it could only ever have replied from the one-line
 * description.
 *
 * Weeks first, then the domain tracks, because that is the order someone reads
 * them in: what everyone does, then the part that is specific to their job.
 */
function curriculumHtml(weeks, tracks) {
  let out = '';
  if (Array.isArray(weeks) && weeks.length) {
    out += '<section><h2>Week by week</h2>' + weeks.map((w) =>
      `<h3>${escText(w.wk)} — ${escText(w.title)}</h3>` +
      (w.stage ? `<p>${escText(w.stage)}</p>` : '') +
      (w.topics?.length ? `<ul>${w.topics.map((t) => `<li>${escText(t)}</li>`).join('')}</ul>` : '') +
      (w.tools?.length ? `<p>Tools: ${escText(w.tools.join(', '))}</p>` : '')
    ).join('') + '</section>';
  }
  /* The tracks in full, not just their names and objectives.
     That was 15% of what the data holds, and the 85% left out was the part
     that answers the questions people actually type: what Claude does for a
     product manager, for a marketer, for someone in finance. aiLayer names the
     Claude setup per week, liveBuild names the real company the work is done
     against, and outcome says what the learner ends up with. A page that
     teaches Claude for six jobs should be findable for six jobs. */
  if (Array.isArray(tracks) && tracks.length) {
    out += '<section><h2>Domain tracks</h2>' + tracks.map((t) =>
      `<h3>${escText(t.name)}</h3>` +
      (t.weeks || []).map((w) =>
        `<h4>${escText(t.name)} — ${escText(w.wk)}</h4>` +
        (w.objective ? `<p>${escText(w.objective)}</p>` : '') +
        (w.domainSense?.length ? `<ul>${w.domainSense.map((d) => `<li>${escText(d)}</li>`).join('')}</ul>` : '') +
        (w.aiLayer ? `<p>With Claude: ${escText(w.aiLayer)}</p>` : '') +
        (w.liveBuild ? `<p>Live build: ${escText(w.liveBuild)}</p>` : '') +
        (w.tools?.length ? `<p>Tools: ${escText(w.tools.join(', '))}</p>` : '') +
        (w.project ? `<p>Project: ${escText(w.project)}</p>` : '') +
        (w.outcome ? `<p>Outcome: ${escText(w.outcome)}</p>` : '')
      ).join('')
    ).join('') + '</section>';
  }
  return out;
}

/**
 * The Kickstarter syllabus, as text.
 *
 * The generalist page has had its curriculum in the HTML for a while; this page
 * had a heading, a sentence and the FAQ. Everything that says what the fourteen
 * days contain — the modules, the lessons, the tools, the builds — was a React
 * render away, which the crawlers behind ChatGPT, Claude and Perplexity never
 * perform.
 */
function kickstarterHtml(days, modules) {
  let out = '';
  if (Array.isArray(modules) && modules.length) {
    out += '<section><h2>What you learn in the Gen AI Kickstarter</h2>' + modules.map((m) =>
      `<h3>${escText(m.label)} — ${escText(m.title)}</h3>` +
      (m.lessons?.length ? `<ul>${m.lessons.map((l) => `<li>${escText(l)}</li>`).join('')}</ul>` : '') +
      (m.tools?.length ? `<p>Tools: ${escText(m.tools.join(', '))}</p>` : '') +
      (m.project ? `<p>Project: ${escText(m.project)}</p>` : '')
    ).join('') + '</section>';
  }
  if (Array.isArray(days) && days.length) {
    const tools = (t) => String(t || '').split(',').map((x) => x.trim()).filter(Boolean).join(', ');
    out += '<section><h2>Day by day</h2><ol>' + days.map((d) =>
      `<li>Day ${escText(d.num)} — ${escText(d.topic)}${tools(d.tool) ? ` (${escText(tools(d.tool))})` : ''}</li>`
    ).join('') + '</ol></section>';
  }
  return out;
}

/**
 * The programmes, linked by name.
 *
 * The homepage is the page with the most authority, and it reached the
 * programme pages only through buttons, which have no href. This is the link a
 * crawler can follow, with the programme's name as its anchor text — the
 * plainest statement a site can make about what a page is.
 */
function programsHtml(programs) {
  if (!Array.isArray(programs) || !programs.length) return '';
  return '<section><h2>Programs</h2><ul>' + programs.map(([name, path, desc]) =>
    `<li><a href="${escAttr(path)}">${escText(name)}</a>: ${escText(desc)}</li>`
  ).join('') + '</ul></section>';
}

/**
 * The policy text itself.
 *
 * A privacy policy that is 700 words in a data file and 38 words in the HTML
 * is not a published policy — it is a page that says a policy exists. These
 * are read by people deciding whether to hand over a phone number, and by
 * anything assessing whether the site is a real company.
 */
function policyHtml(policy) {
  if (!policy?.sections?.length) return '';
  return policy.sections.map((s) =>
    `<h2>${escText(s.h)}</h2>` +
    (s.body || []).map((b) => {
      if (b.sub) return `<h3>${escText(b.sub)}</h3>`;
      if (b.ul) return `<ul>${b.ul.map((i) => `<li>${escText(i)}</li>`).join('')}</ul>`;
      if (b.p) return `<p>${escText(b.p)}</p>`;
      return typeof b === 'string' ? `<p>${escText(b)}</p>` : '';
    }).join('')
  ).join('');
}

function fallback(route) {
  const links = STATIC_ROUTES
    // A page held back from search should not be linked from the crawlable
    // HTML either. noindex tells a crawler not to list it; an internal link
    // from every other page tells it the opposite, and the two together just
    // spend crawl budget arguing. llms.txt and the sitemap already exclude
    // these — the nav was the one place that did not.
    .filter((r) => !r.noindex)
    .filter((r) => r.path !== route.path)
    .map((r) => `<a href="${r.path}">${escText(r.nav)}</a>`)
    .join(' · ');
  const extra =
    (route.extra ? `<p>${escText(route.extra)}</p>` : '') +
    (route.extraHtml || '') + // pre-escaped structured HTML (e.g. full blog body)
    programsHtml(route.programs) +
    curriculumHtml(route.weeks, route.tracks) +
    kickstarterHtml(route.days, route.modules) +
    policyHtml(route.policy) +
    packsHtml(route.packs) +
    hiringHtml(route.hiring) +
    projectListHtml(route.projectList) +
    faqHtml(route.faqs);
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
  // hreflang has to name the page it sits on. The template's two alternates
  // point at the homepage, and every route inherited them — so /generalist was
  // telling search engines its Indian-English version is the homepage.
  html = html.replace(/(<link rel="alternate" hreflang="[^"]*" href=")[^"]*(")/gi,
    (_m, p1, p2) => p1 + escAttr(canonical) + p2);

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
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

const llmsHead = `# Menler

> Menler is an India-based, Claude-native AI learning company. It runs live, cohort-based AI courses and fellowships that teach professionals, students and engineers to build real work with Claude and other AI tools — with real projects, a portfolio, and placement support.

Its programmes: the AI Generalist Fellowship — a no-code course for becoming an AI generalist, also called the Menler Generalist program; the Gen AI Kickstarter — a 14-day AI course for beginners, also called the Menler Kickstarter or AI Kickstarter; and the AI Engineering Fellowship for developers.

The Gen AI Kickstarter is an AI course. It is not connected to Kickstarter, the crowdfunding platform.

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

${BLOG_PUBLIC ? `## Blog
${BLOG_POSTS.filter((p) => p.body).map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${clean(p.excerpt)}`).join('\n')}
` : ''}
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

${faqSection('AI Generalist Fellowship (Claude AI Generalist)', GENERALIST_FAQS)}

${faqSection('AI Engineering Fellowship (Claude AI Engineering)', ENGINEERING_FAQS)}

${faqSection('Gen AI Kickstarter (AI Kickstarter)', KICKSTARTER_FAQS)}

${BLOG_PUBLIC ? `## Articles
${BLOG_POSTS.filter((p) => p.body).map(postSection).join('\n')}
` : ''}
## Contact
Website ${SITE} · Email support@menler.in · LinkedIn https://www.linkedin.com/company/menler/ · Instagram https://www.instagram.com/menler.in
`;
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull, 'utf8');

const faqCount = [HOME_FAQS, GENERALIST_FAQS, ENGINEERING_FAQS, KICKSTARTER_FAQS].reduce((n, f) => n + f.length, 0);
console.log(`✓ Generated llms.txt and llms-full.txt (${PROGRAM_FACTS.length} programmes, ${faqCount} FAQs, ${BLOG_PUBLIC ? BLOG_POSTS.filter((p) => p.body).length : 0} articles).`);

/* ── IndexNow ────────────────────────────────────────────────────────────────
 * Tells Bing — and the answer engines that search through its index, ChatGPT
 * and Copilot among them — which URLs changed, instead of waiting weeks for a
 * recrawl. Google does not take part; it is asked through Search Console.
 *
 * Production builds only, so a preview deploy never announces anything. The key
 * is public by design: it is proved by the matching file in /public. A failure
 * here is logged and ignored — a deploy must not fail because a ping did.
 */
const INDEXNOW_KEY = '5afc3731e525c2886043b407e584aa7f';
if (process.env.VERCEL_ENV === 'production') {
  const urlList = ROUTES.filter((r) => !r.noindex).map((r) => SITE + r.path);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(10000),
    });
    console.log(`✓ IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status}).`);
  } catch (err) {
    console.warn(`! IndexNow ping failed (${err.message}) — skipped.`);
  }
}
