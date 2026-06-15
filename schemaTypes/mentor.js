import { defineField, defineType } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';

// Mirrors the MENTORS array in src/components/common/MentorsRail.jsx.
export default defineType({
  name: 'mentor',
  title: 'Mentor',
  type: 'document',
  fields: [
    orderRankField({ type: 'mentor' }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
