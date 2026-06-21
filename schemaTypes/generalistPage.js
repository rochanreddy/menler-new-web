import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'generalistPage',
  title: 'Generalist Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroBlock' }),
    defineField({ name: 'pricing', title: 'Pricing card', type: 'pricingCard' }),
    defineField({ name: 'curriculum', title: 'Curriculum (phases)', type: 'array', of: [{ type: 'curricPhase' }], description: 'Phases 1–2 use Weeks (modules); Phase 3 uses Domain tracks.' }),
    defineField({ name: 'ctaBanner', title: 'CTA banner', type: 'ctaBanner' }),
  ],
  preview: { prepare: () => ({ title: 'Generalist Page' }) },
});
