import { useNavigate } from 'react-router-dom';
import MenlerWordmark from '../common/MenlerWordmark';
import { useApply } from '../common/ApplyContext';
import { SOCIAL_LINKS, SUPPORT_MAIL_HREF } from '../../data/socialLinks';

export default function Footer() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const openApply = useApply();

  return (
    <footer className="footer-5">
      <div className="footer-5-inner">
        <div className="footer-5-brand">
          <MenlerWordmark size={34} theme="dark" />
          <p style={{ marginTop: 6, fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 13.5, color: 'var(--lavender)' }}>Your turning point in the AI Era.</p>
          <p className="footer-brand-desc" style={{ marginTop: 12 }}>AI learning, built for the people doing the work.</p>
          <div className="footer-social">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                className="footer-social-link"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Menler on ${s.label}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <a
            className="footer-support"
            href={SUPPORT_MAIL_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="footer-support-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
            </svg>
            support@menler.in
          </a>
        </div>
        <div>
          <p className="footer-col-title">Programs</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/kickstarter')}>Gen AI Kickstarter</a></li>
            <li><a onClick={() => go('/generalist')}>Claude AI Generalist</a></li>
            <li><a onClick={() => go('/engineering')}>Claude AI Engineering</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For learners</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/aptitude')}>AI Aptitude Test</a></li>
            <li><a onClick={() => go('/resources')}>Library</a></li>
            <li><a onClick={() => go('/events')}>Events</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For partners</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/about#working-with-us')}>Hire from us</a></li>
            <li><a onClick={() => go('/about#working-with-us')}>Partner with us</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            <li><a onClick={() => go('/about')}>About</a></li>
            <li><a onClick={() => go('/about')}>Contact</a></li>
            <li><a onClick={() => go('/policy/privacy')}>Privacy Policy</a></li>
            <li><a onClick={() => go('/policy/refund')}>Refund Policy</a></li>
            <li><a onClick={() => go('/policy/terms')}>Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-5-trust footer-5-trust--left">
        <p>© 2026 Menler Learning Systems pvt ltd</p>
      </div>
    </footer>
  );
}
