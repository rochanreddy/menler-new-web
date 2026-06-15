import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { schemaTypes } from './schemaTypes';

// Embedded at /studio (see src/pages/Studio.jsx + the route in src/App.jsx).
// projectId/dataset come from Vite env; set them in .env after creating the
// Sanity project. A harmless placeholder keeps the build green before then.
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

// Pages that should exist as a single editable document (not a creatable list).
const SINGLETONS = [
  { id: 'homePage', title: 'Home Page' },
  { id: 'kickstarterPage', title: 'Kickstarter Page' },
  { id: 'generalistPage', title: 'Generalist Page' },
  { id: 'engineeringPage', title: 'Engineering Page' },
];
const singletonIds = SINGLETONS.map((s) => s.id);

export default defineConfig({
  name: 'default',
  title: 'Menler',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            ...SINGLETONS.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .child(S.document().schemaType(s.id).documentId(s.id)),
            ),
            S.divider(),
            orderableDocumentListDeskItem({ type: 'mentor', title: 'Mentors', S, context }),
            orderableDocumentListDeskItem({ type: 'project', title: 'Projects', S, context }),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Don't offer "create" templates for the singletons.
    templates: (prev) => prev.filter((t) => !singletonIds.includes(t.schemaType)),
  },
  document: {
    // Singletons: keep only publish/discard/restore (no delete/duplicate/create).
    actions: (input, { schemaType }) =>
      singletonIds.includes(schemaType)
        ? input.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
});
