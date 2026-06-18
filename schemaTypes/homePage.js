import { defineField, defineType } from 'sanity';

// Editable copy for the Home page. Every field is optional — anything left blank
// falls back to the built-in default on the site, so the page never breaks.
const sectionHeading = (name, title) =>
  defineField({
    name, title, type: 'object', group: 'sections',
    fields: [
      { name: 'label', title: 'Eyebrow label', type: 'string' },
      { name: 'heading', title: 'Heading (first part)', type: 'string' },
      { name: 'headingEm', title: 'Heading (italic / highlighted part)', type: 'string' },
      { name: 'sub', title: 'Sub-text', type: 'text', rows: 2 },
    ],
  });

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'sections', title: 'Sections' },
    { name: 'cta', title: 'CTA banner' },
  ],
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroBlock', group: 'hero' }),
    sectionHeading('programs', 'Programs section'),
    sectionHeading('projects', 'Projects section ("What you build")'),
    defineField({
      name: 'toolstack', title: 'Toolstack section', type: 'object', group: 'sections',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'sub', title: 'Sub-text', type: 'text', rows: 2 },
      ],
    }),
    defineField({ name: 'ctaBanner', title: 'CTA banner', type: 'ctaBanner', group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
});
