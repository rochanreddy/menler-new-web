import { defineField, defineType } from 'sanity';

// A single week with its lesson bullets. Used by both phase modules and
// domain-track weeks on the Generalist curriculum.
export default defineType({
  name: 'curricWeek',
  title: 'Week',
  type: 'object',
  fields: [
    defineField({ name: 'w', title: 'Week title', type: 'string', description: 'e.g. "Week 1 — Understand AI: See the Landscape Clearly"' }),
    defineField({ name: 'lessons', title: 'Lessons', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'w' } },
});
