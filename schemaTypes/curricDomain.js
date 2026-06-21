import { defineField, defineType } from 'sanity';

// A domain specialisation track (Phase 3 of the Generalist curriculum).
export default defineType({
  name: 'curricDomain',
  title: 'Domain track',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Track name', type: 'string' }),
    defineField({ name: 'weeks', title: 'Weeks', type: 'array', of: [{ type: 'curricWeek' }] }),
    defineField({ name: 'tools', title: 'Tool stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'projects', title: 'Projects', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'name' } },
});
