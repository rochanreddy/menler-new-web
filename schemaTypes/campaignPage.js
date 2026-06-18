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
    { name: 'banner', title: 'Banner / Hero' },
    { name: 'schedule', title: 'Schedule & Price' },
    { name: 'mentor', title: 'Mentor' },
    { name: 'sections', title: 'Sections' },
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

    // ── Banner / hero ──
    defineField({ name: 'bannerBadge', title: 'Badge text', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerLine1', title: 'Title — line 1 (highlighted)', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerLine2', title: 'Title — line 2 (highlighted)', type: 'string', group: 'banner' }),
    defineField({ name: 'bannerTagline', title: 'Tagline (under title)', type: 'string', group: 'banner' }),
    defineField({ name: 'subtitle', title: 'Intro paragraph (below banner)', type: 'text', rows: 3, group: 'banner' }),

    // ── Schedule & price ──
    defineField({ name: 'date', title: 'Date', type: 'string', group: 'schedule' }),
    defineField({ name: 'time', title: 'Time', type: 'string', group: 'schedule' }),
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
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
