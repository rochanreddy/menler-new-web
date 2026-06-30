import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../common/MenlerWordmark';
import { useApply } from '../common/ApplyContext';
import { supabase } from '../../lib/supabase';

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

  // Apply Now → open the popup (and close any open menus first). On the
  // Kickstarter page, open the same simplified form as its "Book a call" CTA
  // (no Program field, Kickstarter-specific background options).
  const apply = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
    if (location.pathname === '/kickstarter') {
      openApply({
        showProgram: false,
        backgroundOptions: ['School student', 'College student', 'Graduate', 'Fresher'],
      });
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

  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // The admin panel, Sanity Studio, and campaign landing pages are standalone,
  // chrome-free areas — no public navbar.
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/studio') ||
    location.pathname.startsWith('/ai-kickstarter') ||
    location.pathname.startsWith('/campaign/') ||
    location.pathname.startsWith('/checkout')
  ) return null;

  return (
    <>
    <nav className="nav" ref={navRef}>
      <button className="nav-logo" onClick={() => go('/')} aria-label="menler — home">
        <MenlerWordmark size={26} theme="light" />
      </button>

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
            <button className="dd-item dd-gen" role="menuitem" onClick={() => go('/generalist')}>
              <span className="dd-badge">10 weeks · No code</span>
              <span className="dd-title">Claude AI Generalist</span>
              <span className="dd-desc">For students, professionals, and business owners. Master Claude. Become a domain Specialist.</span>
            </button>
            <div className="dd-divider" />
            <button className="dd-item dd-eng" role="menuitem" onClick={() => go('/engineering')}>
              <span className="dd-badge" style={{ background: '#E1F5EE', color: '#085041' }}>12 weeks · Code</span>
              <span className="dd-title">Claude AI Engineering</span>
              <span className="dd-desc">For software engineers, DS, ML, IT. Build production Claude systems — API, RAG, MCP, agents.</span>
            </button>
          </div>
        </div>
        <button className={`nav-link${isActive('/kickstarter') ? ' active' : ''}`} onClick={() => go('/kickstarter')}>AI Kickstarter</button>

        
        

        <button className={`nav-link${isActive('/aptitude') ? ' active' : ''}`} onClick={() => go('/aptitude')}>AI Aptitude Test</button>
        <button className={`nav-link${isActive('/resources') ? ' active' : ''}`} onClick={() => go('/resources')}>Library</button>
        <button className={`nav-link${isActive('/about') ? ' active' : ''}`} onClick={() => go('/about')}>About</button>
        {session ? (
          <>
            <button
              className="nav-profile"
              onClick={() => go('/profile')}
              aria-label="My Profile"
              title="My Profile"
              style={{ background: isActive('/profile') ? 'var(--lavender)' : undefined }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="nav-cta" onClick={apply}>Apply Now</button>
          </>
        ) : (
          <button className="nav-cta" onClick={apply}>Apply Now</button>
        )}
      </div>
    </nav>

      {/* ── MOBILE DRAWER (outside <nav> so position:fixed tracks the viewport,
          not the navbar's backdrop-filter containing block) ── */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mm-section-label">Fellowship</div>
        <button className="mm-link" onClick={() => go('/generalist')}>Claude AI Generalist</button>
        <button className="mm-link" onClick={() => go('/engineering')}>Claude AI Engineering</button>
        <div className="mm-divider" />
        <button className="mm-link" onClick={() => go('/kickstarter')}>AI Kickstarter</button>
        <div className="mm-divider" />
        <button className={`mm-link${isActive('/aptitude') ? ' active' : ''}`} onClick={() => go('/aptitude')}>AI Aptitude Test</button>
        <button className={`mm-link${isActive('/resources') ? ' active' : ''}`} onClick={() => go('/resources')}>Library</button>
        <button className={`mm-link${isActive('/about') ? ' active' : ''}`} onClick={() => go('/about')}>About</button>
        <div className="mm-divider" />
        {session ? (
          <>
            <button className="mm-link" onClick={() => go('/profile')}>My Profile</button>
            <button className="mm-cta" onClick={apply}>Apply Now</button>
          </>
        ) : (
          <button className="mm-cta" onClick={apply}>Apply Now</button>
        )}
      </div>
      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
    </>
  );
}
