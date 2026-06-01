import { useNavigate } from 'react-router-dom';
import MenlerLogo from '../common/MenlerLogo';

export default function Footer() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  return (
    <footer className="footer-5">
      <div className="footer-5-inner">
        <div className="footer-5-brand">
          <MenlerLogo color="#AFA9EC" />
          <p className="footer-brand-name">Menler</p>
          <p className="footer-brand-desc">AI learning, built for the people doing the work. Your turning point in the AI era.</p>
        </div>
        <div>
          <p className="footer-col-title">Programs</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/kickstarter')}>Gen AI Kickstarter</a></li>
            <li><a onClick={() => go('/generalist')}>Claude AI Generalist</a></li>
            <li><a onClick={() => go('/engineering')}>Claude AI Engineering</a></li>
            <li><a onClick={() => go('/programs')}>Compare programs</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For learners</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/aptitude')}>AI Aptitude Test</a></li>
            <li><a onClick={() => go('/resources')}>Resources</a></li>
            <li><a onClick={() => go('/blog')}>Blog</a></li>
            <li><a onClick={() => go('/scholarship')}>Scholarships</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For partners</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/outcomes')}>Hire from us</a></li>
            <li><a onClick={() => go('/about')}>Menler Teams (B2B)</a></li>
            <li><a onClick={() => go('/about')}>Partner with us</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/about')}>About</a></li>
            <li><a onClick={() => go('/about')}>Careers</a></li>
            <li><a onClick={() => go('/blog')}>Press</a></li>
            <li><a onClick={() => go('/about')}>Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-5-trust">
        <p>25+ hiring associations  ·  90% interview pipeline target  ·  Applications open</p>
        <p>© 2026 Menler. India's AI learning brand.</p>
      </div>
    </footer>
  );
}
