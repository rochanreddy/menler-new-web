import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroBlock' }),
    defineField({ name: 'ctaBanner', title: 'CTA banner', type: 'ctaBanner' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
});
