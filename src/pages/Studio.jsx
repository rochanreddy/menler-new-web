import { Studio } from 'sanity';
import config from '../../sanity.config';
import Seo from '../components/common/Seo';

// Embedded Sanity Studio. Lazy-loaded via the /studio/* route so its heavy
// bundle never loads on normal pages. Renders full-screen (Navbar hides itself
// on /studio, and there is no Footer here).
export default function StudioPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <Seo noindex />
      <Studio config={config} />
    </div>
  );
}
