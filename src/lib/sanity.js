import { createClient } from '@sanity/client';

// Read-only client for the public marketing dataset. If the project isn't
// configured yet (no env), `isSanityConfigured` is false and the app simply
// keeps using its hardcoded fallback content (see useContent).
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01';

export const isSanityConfigured = !!projectId;

export const sanityClient = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
