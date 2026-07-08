import { defineField, defineType } from 'sanity';

// Editable content for the campaign landing page (/ai-kickstarter).
// A singleton — the client edits this one doc and reuses the page for whatever
// campaign/workshop is currently running (swap the mentor, title, date, etc.).
export default defineType({
  name: 'campaignPage',
  title: 'Campaign Landing Page',
  type: 'document',
  groups: [
    { name: 'setup', title: 'Setup' },
    { name: 'theme', title: 'Colours / Theme' },
    { name: 'banner', title: 'Banner / Hero' },
    { name: 'schedule', title: 'Schedule & Price' },
    { name: 'mentor', title: 'Mentor' },
    { name: 'sections', title: 'Sections' },
    { name: 'certificate', title: 'Certificate' },
  ],
  fields: [
    // ── Setup: internal title + the page URL ──
    defineField({ name: 'title', title: 'Campaign title (internal — shown in this list)', type: 'string', group: 'setup', validation: (r) => r.required() }),
    defineField({
      name: 'slug', title: 'Page URL', type: 'slug', group: 'setup',
      description: 'This becomes the page address: menler.in/campaign/<slug>',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),

    // ── Theme colours (hex codes; leave blank to keep the default amber theme) ──
    defineField({ name: 'themeAccent', title: 'Accent colour — buttons & links', type: 'string', group: 'theme', description: 'Hex code, e.g. #BA7517. Leave blank for default.' }),
    defineField({ name: 'themeAccentDark', title: 'Accent colour — dark (labels)', type: 'string', group: 'theme', description: 'Hex code, e.g. #854F0B' }),
    defineField({ name: 'bannerFrom', title: 'Banner gradient — start (top-left)', type: 'string', group: 'theme', description: 'Hex code, e.g. #FFF1CC. Also tints pills/cards.' }),
    defineField({ name: 'bannerTo', title: 'Banner gradient — end (bottom-right)', type: 'string', group: 'theme', description: 'Hex code, e.g. #F6D77E' }),
    defineField({ name: 'highlightBg', title: 'Title highlight — background', type: 'string', group: 'theme', description: 'Hex code, e.g. #C7F24D (the boxes behind the big title)' }),
    defineField({ name: 'highlightText', title: 'Title highlight — text', type: 'string', group: 'theme', description: 'Hex code, e.g. #1C2400' }),

    // ── Banner / hero ──
    defineField({ name: 'bannerBadge', title: 'Badge text', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerLine1', title: 'Title — line 1 (highlighted)', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerLine2', title: 'Title — line 2 (highlighted)', type: 'string', group: 'banner' }),
    defineField({ name: 'showClaudeLogo', title: 'Show Claude logo next to the title', type: 'boolean', group: 'banner', initialValue: false }),
    defineField({ name: 'showTrustBar', title: 'Show trust bar (McKinsey · MIT · UT Austin) under the form', type: 'boolean', group: 'banner', initialValue: false }),
    defineField({ name: 'bannerTagline', title: 'Tagline (under title)', type: 'string', group: 'banner' }),
    defineField({ name: 'subtitle', title: 'Intro paragraph (below banner)', type: 'text', rows: 3, group: 'banner' }),

    // ── Schedule & price ──
    defineField({ name: 'date', title: 'Date', type: 'string', group: 'schedule' }),
    defineField({ name: 'time', title: 'Time', type: 'string', group: 'schedule' }),
    defineField({ name: 'eventStart', title: 'Event start (for "Add to calendar")', type: 'datetime', group: 'schedule', description: 'Actual start date & time. Powers the Add-to-Calendar button on the confirmation page.' }),
    defineField({ name: 'eventEnd', title: 'Event end (for "Add to calendar")', type: 'datetime', group: 'schedule', description: 'Actual end date & time. Defaults to 1 hour after start if blank.' }),
    defineField({ name: 'format', title: 'Format', type: 'string', group: 'schedule' }),
    defineField({ name: 'price', title: 'Price (₹) — shown big', type: 'string', group: 'schedule' }),
    defineField({ name: 'origPrice', title: 'Original price (₹) — struck through', type: 'string', group: 'schedule' }),
    defineField({ name: 'seatsNote', title: 'Seats note (mobile bar)', type: 'string', group: 'schedule' }),

    // ── Mentor ──
    defineField({ name: 'mentorName', title: 'Mentor name', type: 'string', group: 'mentor' }),
    defineField({ name: 'mentorRole', title: 'Mentor role / title', type: 'string', group: 'mentor' }),
    defineField({ name: 'mentorPhoto', title: 'Mentor photo', type: 'image', options: { hotspot: true }, group: 'mentor' }),
    defineField({ name: 'mentorBio', title: 'Mentor bio', type: 'text', rows: 4, group: 'mentor' }),
    defineField({ name: 'mentorCreds', title: 'Mentor credentials (bullet list)', type: 'array', of: [{ type: 'string' }], group: 'mentor' }),

    // ── Sections ──
    defineField({
      name: 'learn', title: "What you'll learn & build", group: 'sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'detail', title: 'Detail', type: 'text', rows: 2 },
        ],
        preview: { select: { title: 'title', subtitle: 'detail' } },
      }],
    }),
    defineField({ name: 'forYou', title: "Who it's for (bullet list)", type: 'array', of: [{ type: 'string' }], group: 'sections' }),
    defineField({
      name: 'get', title: 'What you get', group: 'sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'detail', title: 'Detail', type: 'string' },
        ],
        preview: { select: { title: 'title', subtitle: 'detail' } },
      }],
    }),

    // ── Sample certificate ──
    // The default mock-up shows two signatures: the mentor (left) and the
    // founder (right). These names also drive the mock-up below.
    defineField({ name: 'certificateImage', title: 'Sample certificate image', type: 'image', options: { hotspot: true }, group: 'certificate', description: 'Upload a sample certificate. If empty, a default certificate mock-up is shown.' }),
    defineField({ name: 'founderName', title: 'Founder name (signature — bottom right)', type: 'string', group: 'certificate', description: 'Shown on the default mock-up. Leave blank to hide the founder signature.' }),
    defineField({ name: 'founderRole', title: 'Founder role / title', type: 'string', group: 'certificate', description: 'e.g. Founder, Menler' }),
    defineField({ name: 'certificateNote', title: 'Certificate caption', type: 'string', group: 'certificate' }),

    // ── WhatsApp community ──
    defineField({ name: 'whatsappUrl', title: 'WhatsApp community invite link', type: 'url', group: 'sections', description: 'The WhatsApp group/community join link.' }),
    defineField({ name: 'whatsappText', title: 'WhatsApp bar text', type: 'string', group: 'sections' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
