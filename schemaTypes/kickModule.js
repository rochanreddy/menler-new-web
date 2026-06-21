import { defineField, defineType } from 'sanity';

// One course module in the Kickstarter modules accordion.
export default defineType({
  name: 'kickModule',
  title: 'Module',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Module 1"' }),
    defineField({ name: 'span', title: 'Span (optional)', type: 'string', description: 'Shown next to the label, e.g. "Weekend 1"' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'desc', title: 'Description (optional)', type: 'text', rows: 2 }),
    defineField({ name: 'lessons', title: 'Lesson plan', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'tools', title: 'Tool stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'project', title: "Project you'll build", type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'label' } },
});
