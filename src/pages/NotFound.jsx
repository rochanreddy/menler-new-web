import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const LINKS = [
  { label: 'Programs', path: '/programs' },
  { label: 'Outcomes', path: '/outcomes' },
  { label: 'AI Aptitude Test', path: '/aptitude' },
  { label: 'Resources', path: '/resources' },
  { label: 'Blog', path: '/blog' },
];

export default function NotFound() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  return (
    <>
      <section className="notfound">
        <div className="notfound-rings" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="notfound-inner">
          <p className="notfound-code">404</p>
          <h1 className="notfound-h1">This page is <em>off the meridian.</em></h1>
          <p className="notfound-sub">The link you followed doesn't exist — but everything that matters is one tap away.</p>
          <div className="notfound-actions">
            <button className="btn-primary" onClick={() => go('/')}>Back to home</button>
            <button className="btn-ghost" onClick={() => go('/programs')}>Explore programs</button>
          </div>
          <nav className="notfound-links" aria-label="Popular pages">
            {LINKS.map(l => (
              <button key={l.path} className="notfound-link" onClick={() => go(l.path)}>{l.label}</button>
            ))}
          </nav>
        </div>
      </section>
      <Footer />
    </>
  );
}
