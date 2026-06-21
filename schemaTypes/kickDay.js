import { defineField, defineType } from 'sanity';

// One day card in the Kickstarter 14-day timeline.
export default defineType({
  name: 'kickDay',
  title: 'Day',
  type: 'object',
  fields: [
    defineField({ name: 'num', title: 'Day number', type: 'string', description: 'e.g. "01"' }),
    defineField({ name: 'topic', title: 'Topic', type: 'string' }),
    defineField({ name: 'tool', title: 'Tools', type: 'string' }),
    defineField({ name: 'cap', title: 'Highlight (capstone)', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'topic', subtitle: 'num' } },
});
