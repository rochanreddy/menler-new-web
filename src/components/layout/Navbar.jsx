import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../common/MenlerWordmark';
import { useApply } from '../common/ApplyContext';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const openApply = useApply();

  const go = (path) => {
    navigate(path);
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  /* Real links, not buttons: a crawler follows an href and cannot follow an
     onClick, so the main nav — the strongest internal links a site has — was
     invisible to search engines. A plain click still navigates inside the app;
     Cmd/Ctrl/Shift/middle-click open a new tab as links should. */
  const link = (path) => ({
    href: path,
    onClick: (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go(path);
    },
  });

  // Apply Now → open the popup (and close any open menus first). On the
  // Kickstarter page, open the same simplified form as its "Book a call" CTA
  // (no Program field, Kickstarter-specific background options).
  const apply = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
    if (location.pathname === '/kickstarter') {
      openApply({ showProgram: false });
    } else {
      openApply();
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  // The admin panel, the blog portal, Sanity Studio, and campaign landing pages
  // are standalone, chrome-free areas — no public navbar.
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/blog-portal') ||
    location.pathname.startsWith('/studio') ||
    location.pathname.startsWith('/ai-kickstarter') ||
    location.pathname.startsWith('/campaign/') ||
    location.pathname.startsWith('/checkout')
  ) return null;

  return (
    <>
    <nav className="nav" ref={navRef}>
      <a className="nav-logo" {...link('/')} aria-label="menler — home">
        <MenlerWordmark size={26} theme="light" />
      </a>

      <button
        className={`nav-burger${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(o => !o)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span /><span /><span />
      </button>

      <div className="nav-links">
        {/* Fellowship dropdown */}
        <div className={`nav-item${openDropdown === 'fellowship' ? ' open' : ''}`}>
          <button className="nav-link" onClick={() => toggleDropdown('fellowship')}>
            Fellowship
            <svg className="nav-chevron" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="#888780" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="dropdown dropdown-mega" role="menu">
            <a className="dd-item dd-gen" role="menuitem" {...link('/generalist')}>
              <span className="dd-badge">10 weeks · No code</span>
              <span className="dd-title">Claude AI Generalist</span>
              <span className="dd-desc">For students, professionals, and business owners. Master Claude. Become a domain Specialist.</span>
            </a>
            <div className="dd-divider" />
            <a className="dd-item dd-eng" role="menuitem" {...link('/engineering')}>
              <span className="dd-badge" style={{ background: '#E1F5EE', color: '#085041' }}>12 weeks · Code</span>
              <span className="dd-title">Claude AI Engineering</span>
              <span className="dd-desc">For software engineers, DS, ML, IT. Build production Claude systems — API, RAG, MCP, agents.</span>
            </a>
          </div>
        </div>
        <a className={`nav-link${isActive('/kickstarter') ? ' active' : ''}`} {...link('/kickstarter')}>AI Kickstarter</a>

        
        

        <a className={`nav-link${isActive('/aptitude') ? ' active' : ''}`} {...link('/aptitude')}>AI Aptitude Test</a>
        <a className={`nav-link${isActive('/events') ? ' active' : ''}`} {...link('/events')}>Events</a>
        <a className={`nav-link${isActive('/resources') ? ' active' : ''}`} {...link('/resources')}>Library</a>
        <a className={`nav-link${isActive('/about') ? ' active' : ''}`} {...link('/about')}>About</a>
        <button className="nav-cta" onClick={apply}>Apply Now</button>
      </div>
    </nav>

      {/* ── MOBILE DRAWER (outside <nav> so position:fixed tracks the viewport,
          not the navbar's backdrop-filter containing block) ── */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mm-section-label">Fellowship</div>
        <a className="mm-link" {...link('/generalist')}>Claude AI Generalist</a>
        <a className="mm-link" {...link('/engineering')}>Claude AI Engineering</a>
        <div className="mm-divider" />
        <a className="mm-link" {...link('/kickstarter')}>AI Kickstarter</a>
        <div className="mm-divider" />
        <a className={`mm-link${isActive('/aptitude') ? ' active' : ''}`} {...link('/aptitude')}>AI Aptitude Test</a>
        <a className={`mm-link${isActive('/events') ? ' active' : ''}`} {...link('/events')}>Events</a>
        <a className={`mm-link${isActive('/resources') ? ' active' : ''}`} {...link('/resources')}>Library</a>
        <a className={`mm-link${isActive('/about') ? ' active' : ''}`} {...link('/about')}>About</a>
        <div className="mm-divider" />
        <button className="mm-cta" onClick={apply}>Apply Now</button>
      </div>
      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
    </>
  );
}
