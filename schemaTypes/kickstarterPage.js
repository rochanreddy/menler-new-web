import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'kickstarterPage',
  title: 'Kickstarter Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroBlock' }),
    defineField({ name: 'pricing', title: 'Pricing card', type: 'pricingCard' }),
    defineField({ name: 'days', title: 'Timeline days (14)', type: 'array', of: [{ type: 'kickDay' }] }),
    defineField({ name: 'modules', title: 'Course modules', type: 'array', of: [{ type: 'kickModule' }] }),
    defineField({ name: 'ctaBanner', title: 'CTA banner', type: 'ctaBanner' }),
  ],
  preview: { prepare: () => ({ title: 'Kickstarter Page' }) },
});
