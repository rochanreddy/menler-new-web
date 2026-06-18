import { defineCliConfig } from 'sanity/cli';

// Used by the Sanity CLI (`npx sanity deploy`, `npx sanity schema deploy`).
// studioHost sets the hosted URL: menler.sanity.studio
export default defineCliConfig({
  api: { projectId: 'f3b732bt', dataset: 'production' },
  studioHost: 'menler',
  deployment: {
    appId: 'w8hs0mw3to1it5j4g0xq6ywe',
  },
});
