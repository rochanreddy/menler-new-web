import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'engineeringPage',
  title: 'Engineering Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroBlock' }),
    defineField({ name: 'pricing', title: 'Pricing card', type: 'pricingCard' }),
    defineField({ name: 'ctaBanner', title: 'CTA banner', type: 'ctaBanner' }),
  ],
  preview: { prepare: () => ({ title: 'Engineering Page' }) },
});
