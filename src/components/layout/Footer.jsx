import { useNavigate } from 'react-router-dom';
import MenlerWordmark from '../common/MenlerWordmark';
import { useApply } from '../common/ApplyContext';
import { SOCIAL_LINKS, SUPPORT_MAIL_HREF } from '../../data/socialLinks';

/* A real link: crawlers follow the href (they cannot follow an onClick), and a
   plain click still navigates inside the app. Cmd/Ctrl/Shift/middle-click keep
   their usual open-in-new-tab behaviour. */
function FooterLink({ to, children }) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
        window.scrollTo(0, 0);
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
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
            <li><FooterLink to="/kickstarter">Gen AI Kickstarter</FooterLink></li>
            <li><FooterLink to="/generalist">AI Generalist Fellowship</FooterLink></li>
            <li><FooterLink to="/engineering">AI Engineering Fellowship</FooterLink></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For learners</p>
          <ul className="footer-links">
            <li><FooterLink to="/aptitude">AI Aptitude Test</FooterLink></li>
            <li><FooterLink to="/resources">Library</FooterLink></li>
            <li><FooterLink to="/events">Events</FooterLink></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">For partners</p>
          <ul className="footer-links">
            <li><FooterLink to="/about#working-with-us">Hire from us</FooterLink></li>
            <li><FooterLink to="/about#working-with-us">Partner with us</FooterLink></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            <li><FooterLink to="/about">About</FooterLink></li>
            <li><FooterLink to="/about">Contact</FooterLink></li>
            <li><FooterLink to="/policy/privacy">Privacy Policy</FooterLink></li>
            <li><FooterLink to="/policy/refund">Refund Policy</FooterLink></li>
            <li><FooterLink to="/policy/terms">Terms &amp; Conditions</FooterLink></li>
          </ul>
        </div>
      </div>
      <div className="footer-5-trust footer-5-trust--left">
        <p>© 2026 Menler Learning Systems pvt ltd</p>
      </div>
    </footer>
  );
}
