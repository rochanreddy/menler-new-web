// Blog content layer — placeholder data shaped like the real thing.
//
// Every post follows the same shape so wiring a CMS (Sanity) later is a pure
// data swap — the pages/components never reach around this contract:
//   slug          URL segment ('/blog/<slug>')
//   title         plain text, becomes the post's single <h1>
//   excerpt       1–2 sentences; card excerpt + meta description + JSON-LD description
//   tag           single category label (drives the listing filter pills)
//   author        { name, role, initials, type } — type is the schema.org
//                 author @type: 'Person' or 'Organization'
//   datePublished / dateModified   ISO dates (feed <time datetime> + JSON-LD)
//   readTime      display string, e.g. '3 min read'
//   cover         absolute URL of a real cover image, or null → brand Thumb
//   thumb         Thumb variant used while cover is null
//   featured      the listing hero (most recent featured wins)
//   body          array of blocks. null = stub (card only, article page shows
//                 a graceful "coming soon"). The block types, and the fields
//                 each one uses (see server/models/Post.js for the stored shape
//                 and BlogArticle.jsx for how each renders):
//                   p | h2 | h3 | quote   text
//                   ul                    items: []
//                   image                 src, alt (required), caption
//                   infographic           src, alt + summary (both required),
//                                         caption — the summary exists because
//                                         words drawn inside a picture are
//                                         invisible to screen readers and to
//                                         crawlers
//                   cta                   text, buttonLabel, href
//                   resource              text (title), href, description

export const BLOG_POSTS = [
  {
    slug: 'why-online-courses-have-a-completion-problem',
    title: 'Why Online Courses Have a Completion Problem — And What Actually Fixes It',
    excerpt: "Most online courses lose the majority of learners before they finish. Here's why that keeps happening, and what actually changes it.",
    tag: 'AI in Education',
    author: { name: 'The Menler Team', role: 'Menler Editorial', initials: 'M', type: 'Organization' },
    datePublished: '2026-08-04',
    dateModified: '2026-08-04',
    readTime: '3 min read',
    cover: null,
    thumb: 'alumni',
    featured: true,
    body: [
      { type: 'p', text: "Online learning promised to make education more accessible. In practice, it's also made it easier to quietly disappear. Most course platforms report that only a small fraction of learners who start a course actually finish it — and that number has stayed stubbornly low for years, regardless of how polished the content gets." },
      { type: 'h2', text: 'Why Do Students Drop Out of Online Courses?' },
      { type: 'p', text: "Rarely because the material is too hard. Most dropout happens in the first week, often right after the first bit of friction — a confusing next step, a quiz that doesn't match what was taught, a pace that doesn't fit the learner's actual level. Generic courses are built for an average learner who doesn't really exist." },
      {
        type: 'infographic',
        src: '/blog/where-courses-lose-people.svg',
        alt: 'A course timeline marked with four moments of friction — a confusing next step, a mismatched quiz, a pace built for an average learner, and nobody noticing — above a panel describing what a responsive course does instead.',
        summary: 'Four moments account for most early dropout, and none of them are about difficulty. First, a confusing next step: the learner finishes something and cannot tell what comes next. Second, a quiz that tests what the course never taught, which reads as "this isn\'t for me". Third, a pace built for an average learner who does not exist — too slow for some, too fast for others. Fourth, nobody notices: the platform logs that someone stopped and nothing changes. A responsive course adjusts difficulty while the learner is still in the lesson, surfaces the explanation that fits this learner rather than the next one in the script, and treats disengagement as a signal to act on in the first week.',
        caption: 'The four moments where courses lose people — all of them in the first week, none of them about difficulty.',
      },
      { type: 'h2', text: 'What Traditional LMS Platforms Get Wrong' },
      { type: 'p', text: 'Most platforms treat content delivery and content design as the same problem. They\'re built to host videos and track completion, not to notice when a learner is stuck, bored, or moving faster than the course expects. The platform sees "watched 40% of video 3" — not why the learner stopped there.' },
      {
        type: 'image',
        src: '/blog/platform-sees-vs-learner.svg',
        alt: 'Two panels side by side. The left lists the six data points an LMS records about a learner, ending in "status: in progress". The right lists what actually happened to that learner: an unexplained term in video 3, two rewinds, an answer written for engineers, and a decision that the course was pitched above them.',
        caption: 'Same learner, same lesson. The left is everything the platform knows about it.',
      },
      { type: 'h2', text: 'How Does AI Actually Improve Completion?' },
      { type: 'p', text: 'By closing the gap between what a learner needs right now and what the course assumes they need — adjusting difficulty in real time, surfacing the right explanation instead of just the next scripted one, and catching disengagement early enough to actually do something about it.' },
      { type: 'h2', text: 'What This Looks Like in Practice' },
      { type: 'p', text: "Fewer flat video-and-quiz sequences, more courses that respond to how someone is actually doing. The real measure of a good AI-native LMS isn't the AI itself — it's whether more learners make it to the end, and retain what they came for." },
      {
        type: 'resource',
        text: 'Choosing an LMS in 2026: A Practical Checklist',
        href: '/blog/choosing-an-lms-in-2026-a-practical-checklist',
        description: 'The features worth evaluating a platform on, and the ones that are just noise.',
      },
      {
        type: 'cta',
        text: 'Not sure where you sit on the AI curve? Find out in ten minutes.',
        buttonLabel: 'Take the free AI aptitude test',
        href: '/aptitude',
      },
    ],
  },
  {
    slug: 'choosing-an-lms-in-2026-a-practical-checklist',
    title: 'Choosing an LMS in 2026: A Practical Checklist',
    excerpt: 'The features that actually matter when evaluating a learning platform, and the ones that are just noise.',
    tag: 'LMS Guides',
    author: { name: 'The Menler Team', role: 'Menler Editorial', initials: 'M', type: 'Organization' },
    datePublished: '2026-07-28',
    dateModified: '2026-07-28',
    readTime: '6 min read',
    cover: null,
    thumb: 'finance',
    featured: false,
    body: null,
  },
  {
    slug: 'what-personalized-learning-actually-means',
    title: 'What "Personalized Learning" Actually Means',
    excerpt: "The term gets used constantly. Here's what it looks like when it's done right.",
    tag: 'AI in Education',
    author: { name: 'The Menler Team', role: 'Menler Editorial', initials: 'M', type: 'Organization' },
    datePublished: '2026-07-21',
    dateModified: '2026-07-21',
    readTime: '5 min read',
    cover: null,
    thumb: 'marketing',
    featured: false,
    body: null,
  },
  {
    slug: '5-signs-your-team-has-outgrown-a-generic-lms',
    title: '5 Signs Your Team Has Outgrown a Generic LMS',
    excerpt: "If more than one of these sounds familiar, it's probably time to look elsewhere.",
    tag: 'LMS Guides',
    author: { name: 'The Menler Team', role: 'Menler Editorial', initials: 'M', type: 'Organization' },
    datePublished: '2026-07-14',
    dateModified: '2026-07-14',
    readTime: '4 min read',
    cover: null,
    thumb: 'eng',
    featured: false,
    body: null,
  },
];

// Newest-first (the array above is already sorted, but don't rely on it).
export const sortedPosts = (list = BLOG_POSTS) =>
  [...list].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export const getFeaturedPost = (list = BLOG_POSTS) =>
  sortedPosts(list).find((p) => p.featured) || sortedPosts(list)[0];

export const getPostBySlug = (slug, list = BLOG_POSTS) => list.find((p) => p.slug === slug);

export const getRelatedPosts = (post, count = 3, list = BLOG_POSTS) =>
  sortedPosts(list)
    .filter((p) => p.slug !== post.slug)
    // same-tag posts first, then everything else newest-first
    .sort((a, b) => (b.tag === post.tag) - (a.tag === post.tag))
    .slice(0, count);

// Distinct tags in listing order — the filter pills render from this, so a
// dataset with no tags simply renders no pills.
export const getAllTags = (list = BLOG_POSTS) =>
  [...new Set(list.map((p) => p.tag).filter(Boolean))];

export const formatPostDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
