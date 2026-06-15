import { defineField, defineType } from 'sanity';

// Reusable hero block (eyebrow + heading + sub + stat tiles) used by every page.
export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2 }),
    defineField({ name: 'sub', title: 'Subheading', type: 'text', rows: 3 }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),
  ],
});
