import { defineField, defineType } from 'sanity';

// Reusable bottom call-to-action banner (mirrors the <CtaBanner/> props).
export default defineType({
  name: 'ctaBanner',
  title: 'CTA banner',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'buttonText', title: 'Button text', type: 'string' }),
  ],
});
