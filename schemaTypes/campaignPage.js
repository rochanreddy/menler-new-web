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
    { name: 'visibility', title: 'Show / hide sections' },
    { name: 'certificate', title: 'Certificate' },
    { name: 'events', title: 'Events page' },
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
    defineField({
      name: 'bannerTitleSize', title: 'Title size (desktop, px)', type: 'number', group: 'banner',
      description: 'Max size of the big title on desktop. Default is 40. Lower it (e.g. 36 or 32) if the title wraps onto too many lines. It still scales down automatically on smaller screens.',
      validation: (r) => r.min(24).max(64),
    }),
    defineField({ name: 'showClaudeLogo', title: 'Show Claude logo next to the title', type: 'boolean', group: 'banner', initialValue: false }),
    defineField({ name: 'showTrustBar', title: 'Show trust bar (McKinsey · MIT · UT Austin) under the form', type: 'boolean', group: 'banner', initialValue: false }),
    defineField({
      name: 'credLogos',
      title: 'Credential logos (under registration form)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name (alt text)', type: 'string', validation: (r) => r.required() },
          { name: 'image', title: 'Logo image (upload)', type: 'image', description: 'Upload the logo — a transparent PNG or SVG works best, trimmed close to the logo edges. All logos are shown at the same height, so trimmed transparent logos line up cleanly.' },
          { name: 'logoPath', title: '…or logo file path (optional)', type: 'string', description: 'Only if the logo already lives under public/, e.g. /logos/microsoft.png. Leave blank when you upload an image above.' },
        ],
        preview: { select: { title: 'name', subtitle: 'logoPath', media: 'image' } },
      }],
      group: 'banner',
      description: 'Company / institution logos shown under the mentor credit / registration form — e.g. Microsoft, IIT-G, ISB. Upload the images and they render at a uniform size.',
    }),
    defineField({
      name: 'showCredLogosInBanner',
      title: 'Also show credential logos in the banner',
      type: 'boolean',
      group: 'banner',
      initialValue: false,
      description: 'When on, the same credential logos also appear under the mentor credit in the hero banner.',
    }),
    defineField({
      name: 'credLogoSize',
      title: 'Logo size (px)',
      type: 'number',
      group: 'banner',
      description: 'Height of the credential logos. Leave blank for the default (26). Increase to make all the logos bigger, decrease to make them smaller — they scale together in both the banner and the under-form strip.',
      validation: (r) => r.min(12).max(64),
    }),
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
    defineField({ name: 'certificateTitle', title: 'Course name on the certificate', type: 'string', group: 'certificate', description: 'Shown after "for successfully completing". Leave blank to reuse the banner headline.' }),
    defineField({ name: 'certificateNote', title: 'Certificate caption', type: 'string', group: 'certificate' }),

    // ── Events page ──
    // The /events page is built FROM these campaigns:
    //   • PAST events  — every campaign appears here automatically.
    //   • LIVE events  — only campaigns with "Show as a Live event" turned on.
    // So you only ever manage the Live section; Past fills itself.
    defineField({
      name: 'isLiveEvent', title: 'Show as a Live event', type: 'boolean', group: 'events', initialValue: false,
      description: 'On = shown in the LIVE events section (with a Join button). Off = it sits in Past events with everything else. Turn it off once the class is over.',
    }),
    defineField({
      name: 'hideFromEvents', title: 'Hide from the Events page', type: 'boolean', group: 'events', initialValue: false,
      description: 'Escape hatch: keep this campaign OUT of the Events page entirely (e.g. a test or internal campaign).',
    }),
    defineField({
      name: 'eventImage', title: 'Event card image (landing-page banner)', type: 'image', options: { hotspot: true }, group: 'events',
      description: 'A capture of this campaign’s landing-page banner — shown as the card art on /events. Upload at EXACTLY 16:9 (e.g. 1408×792) so it fills the card with no bars or cropping. Leave blank and the card is drawn automatically from the title, mentor photo and a Menler brand colour.',
    }),
    defineField({
      name: 'eventTags', title: 'Event card tags (pills)', type: 'array', of: [{ type: 'string' }], group: 'events',
      options: { layout: 'tags' }, description: 'Optional. Small pills on the card, e.g. "Portfolio Projects".',
    }),
    defineField({ name: 'eventAttendees', title: 'Attendees (past events, e.g. "500+")', type: 'string', group: 'events' }),
    defineField({
      name: 'eventOrder', title: 'Order on the Events page', type: 'number', group: 'events', initialValue: 0,
      description: 'Lower shows first within its section.',
    }),
    defineField({
      name: 'eventResources', title: 'Downloadable resources (past events)', type: 'array', group: 'events',
      description: 'Offered via the "Download resources" button (name/email gate). Upload the PDF here — no code needed.',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
          { name: 'file', title: 'PDF file (upload)', type: 'file', options: { accept: '.pdf,application/pdf' } },
          { name: 'pdfPath', title: '…or PDF path already in the site (e.g. /pdfs/Name.pdf)', type: 'string', description: 'Only if you prefer to link a PDF already deployed under /pdfs/. Leave blank when you upload a file above.' },
        ],
        preview: { select: { title: 'title', file: 'file.asset.originalFilename', path: 'pdfPath' }, prepare: ({ title, file, path }) => ({ title, subtitle: file || path || 'no file yet' }) },
      }],
    }),

    // ── Community section ──
    defineField({
      name: 'communityPlatform', title: 'Community button', type: 'string', group: 'sections',
      options: { list: [{ title: 'WhatsApp — “Join on WhatsApp”', value: 'whatsapp' }, { title: 'Instagram — “Follow on Instagram”', value: 'instagram' }], layout: 'radio' },
      initialValue: 'whatsapp',
      description: 'Which button the “Join our Menler community” section shows. (Turn the section on with “Show community section”.)',
    }),
    defineField({ name: 'whatsappUrl', title: 'WhatsApp community invite link', type: 'url', group: 'sections', description: 'Used when the button is WhatsApp.' }),
    defineField({ name: 'instagramUrl', title: 'Instagram link', type: 'url', group: 'sections', description: 'Used when the button is Instagram. Leave blank to use the default Menler Instagram.' }),
    defineField({ name: 'whatsappText', title: 'Community text (under the heading)', type: 'string', group: 'sections' }),

    // ── Section visibility ──
    // Turn a whole block off for this campaign. Everything is on by default
    // except the community block, which is opt-in.
    defineField({ name: 'showLearn', title: "Show “What you'll learn & build”", type: 'boolean', group: 'visibility', initialValue: true }),
    defineField({ name: 'showGet', title: 'Show “What you get”', type: 'boolean', group: 'visibility', initialValue: true }),
    defineField({ name: 'showCertificate', title: 'Show “Sample certificate”', type: 'boolean', group: 'visibility', initialValue: true }),
    defineField({ name: 'showMentor', title: 'Show “About your mentor”', type: 'boolean', group: 'visibility', initialValue: true }),
    defineField({
      name: 'showCommunity', title: 'Show community section', type: 'boolean', group: 'visibility', initialValue: false,
      description: 'The “Join our Menler community” block — appears on the landing page and the checkout confirmation. Off by default.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
