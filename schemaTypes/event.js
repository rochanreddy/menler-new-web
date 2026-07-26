import { defineField, defineType } from 'sanity';

// A masterclass / event shown on the /events page. Set Status to "Live" for the
// upcoming class and "Past" once it's over — that's the only switch needed each
// week. The card art is built automatically from the fields below (title +
// mentor + accent), so no thumbnail design work is required; upload a custom
// image only if you want to override it.
export default defineType({
  name: 'event',
  title: 'Event / Masterclass',
  type: 'document',
  groups: [
    { name: 'main', title: 'Details' },
    { name: 'card', title: 'Card look' },
    { name: 'mentor', title: 'Host' },
    { name: 'past', title: 'Past-event extras' },
  ],
  fields: [
    defineField({
      name: 'status', title: 'Status', type: 'string', group: 'main',
      options: { list: [{ title: 'Live / Upcoming', value: 'live' }, { title: 'Past', value: 'past' }], layout: 'radio' },
      initialValue: 'live',
      description: 'Live = shows in the Live section (with a Join button). Past = shows in Past events (with a Download button).',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'main', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'One-line description', type: 'text', rows: 2, group: 'main' }),
    defineField({ name: 'tags', title: 'Tags (pills)', type: 'array', of: [{ type: 'string' }], group: 'main', options: { layout: 'tags' } }),
    defineField({ name: 'date', title: 'Date (display, e.g. "25th Jul, 2026")', type: 'string', group: 'main' }),
    defineField({ name: 'time', title: 'Time (display, e.g. "2:00 – 3:30 PM IST")', type: 'string', group: 'main' }),

    // Where "Join masterclass" goes. A campaign slug points at the registration
    // page; a direct link (Zoom/Luma) overrides it if set.
    defineField({
      name: 'campaignSlug', title: 'Campaign slug (for the Join button)', type: 'string', group: 'main',
      description: 'The campaign this event registers for, e.g. build-your-portfolio-with-claude. The Join button opens /campaign/<slug>.',
    }),
    defineField({
      name: 'joinUrl', title: 'Direct join link (optional)', type: 'url', group: 'main',
      description: 'A Zoom/Luma link. If set, it overrides the campaign slug for the Join button.',
    }),

    // Card look. Accent tints the auto-generated card; a custom image overrides it.
    defineField({
      name: 'accent', title: 'Card accent colour', type: 'string', group: 'card',
      description: 'Hex, e.g. #534AB7. Tints the auto-generated card art. Leave blank for the Menler purple.',
    }),
    defineField({
      name: 'thumbnail', title: 'Custom card image (optional)', type: 'image', options: { hotspot: true }, group: 'card',
      description: 'Only needed to override the auto-generated card art.',
    }),

    // Host / mentor.
    defineField({ name: 'mentorName', title: 'Host name', type: 'string', group: 'mentor' }),
    defineField({ name: 'mentorRole', title: 'Host role', type: 'string', group: 'mentor' }),
    defineField({ name: 'mentorPhoto', title: 'Host photo', type: 'image', options: { hotspot: true }, group: 'mentor' }),

    // Past-event extras.
    defineField({ name: 'attendees', title: 'Attendees (e.g. "500+")', type: 'string', group: 'past' }),
    defineField({
      name: 'resources', title: 'Downloadable resources', type: 'array', group: 'past',
      description: 'PDFs offered via "Download resources" (name/email gate). Add the PDF under /pdfs/ in the repo, then reference its path.',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'pdf', title: 'PDF path (e.g. /pdfs/Name.pdf)', type: 'string' },
        ],
        preview: { select: { title: 'title', subtitle: 'pdf' } },
      }],
    }),

    // Ordering within a section (lower = first).
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', group: 'main', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Sort order', name: 'sortAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', status: 'status', media: 'thumbnail' },
    prepare: ({ title, status, media }) => ({ title, subtitle: status === 'past' ? 'Past' : 'Live', media }),
  },
});
