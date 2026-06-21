import { defineField, defineType } from 'sanity';

// A curriculum phase on the Generalist page. Phases 1–2 use "modules" (weeks);
// Phase 3 uses "domains" (specialisation tracks). Fill whichever applies.
export default defineType({
  name: 'curricPhase',
  title: 'Phase',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Phase 1"' }),
    defineField({ name: 'weeks', title: 'Weeks range', type: 'string', description: 'e.g. "Weeks 1–3"' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'modules', title: 'Weeks (modules)', type: 'array', of: [{ type: 'curricWeek' }], description: 'Leave empty for a phase that uses domain tracks instead.' }),
    defineField({ name: 'tools', title: 'Tool stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'projects', title: 'Projects', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'domains', title: 'Domain tracks (Phase 3 only)', type: 'array', of: [{ type: 'curricDomain' }], description: 'Only for the specialisation phase. Leave empty for normal phases.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'label' } },
});
