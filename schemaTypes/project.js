import { defineField, defineType } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';

// Mirrors the PROJECTS array in src/data/projectsData.js (incl. the nested `doc`).
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    orderRankField({ type: 'project' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Card image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'tag', title: 'Domain tag', type: 'string' }),
    defineField({ name: 'tagCls', title: 'Tag CSS class', type: 'string', description: 'e.g. t-pm, t-finance, t-founder' }),
    defineField({ name: 'desc', title: 'Short description', type: 'text', rows: 2 }),
    defineField({ name: 'stack', title: 'Stack', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'outcome', title: 'Outcome', type: 'string' }),
    defineField({ name: 'deck', title: 'Slide deck (PDF)', type: 'file', options: { accept: '.pdf' } }),
    defineField({
      name: 'doc',
      title: 'Detail document',
      type: 'object',
      fields: [
        { name: 'overview', title: 'Overview', type: 'text', rows: 3 },
        { name: 'problem', title: 'The problem', type: 'text', rows: 3 },
        { name: 'howItWorks', title: 'How it works', type: 'array', of: [{ type: 'string' }] },
        { name: 'features', title: 'Key features', type: 'array', of: [{ type: 'string' }] },
        { name: 'architecture', title: 'Architecture', type: 'text', rows: 3 },
        { name: 'results', title: 'Results & impact', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'tag', media: 'image' } },
});
