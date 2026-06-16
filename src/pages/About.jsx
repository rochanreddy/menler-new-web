import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import { useApply } from '../components/common/ApplyContext';

const VALUES = [
  { title: 'Depth over breadth', desc: 'Master one AI ecosystem deeply instead of skimming dozens of tools.' },
  { title: 'Outcomes over completion', desc: 'Learning only matters when it translates into real career outcomes.' },
  { title: 'Specificity over vagueness', desc: 'We teach practical AI skills, not generic AI buzzwords.' },
  { title: 'Domain-first thinking', desc: 'AI creates value only when paired with deep domain expertise.' },
  { title: 'Fellows, not students', desc: 'Builders contribute, collaborate, and raise the bar together.' },
  { title: 'The era is now', desc: 'The best time to become AI-native is today, not someday.' },
];

export default function About() {
  const openApply = useApply();
  const location = useLocation();

  // Footer "Hire from us" / "Partner with us" link here with #working-with-us;
  // scroll to that section once the page lands (after the global scroll-to-top).
  useEffect(() => {
    if (location.hash !== '#working-with-us') return;
    const el = document.getElementById('working-with-us');
    if (!el) return;
    const t = setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 140);
    return () => clearTimeout(t);
  }, [location.hash, location.key]);

  return (
    <>
      <Seo
        title="About Menler — AI Learning Company India"
        description="Menler is India's Claude-native AI learning company. Our vision: depth over breadth, outcomes over completion — turning learners into AI-native specialists."
        keywords="About Menler, About Menler AI, AI learning company India, Menler AI, AI-native workforce, AI fellowship India"
        path="/about"
      />
      {/* ── HERO ── */}
      <section className="about-hero hero hero-centered" style={{ padding: '64px clamp(22px, 6vw, 40px) 56px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring rl1" />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: 'var(--lavender)' }}>About Menler</p>
          <h1 className="hero-h1">AI learning, built for<br /><em>the people doing the work.</em></h1>
          <p className="hero-sub about-hero-sub" style={{ maxWidth: 570 }}>Menler helps students and professionals become AI-native through<br />hands-on learning, shipped projects, and a builder-first community.<br />The true measure of learning is what you can build on Monday morning.</p>
        </div>
      </section>
      
      {/* ── OUR STORY ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Our story</p>
        <h2 className="section-h2">Why we built<br /><em>Menler.</em></h2>
        <div className="about-grid">
          <div className="about-card" style={{ background: 'var(--ink)', color: '#EEEDFE', padding: 28, borderRadius: 14 }}>
            <p className="about-card-label" style={{ color: 'var(--lavender)' }}>Vision</p>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19.5, lineHeight: 1.4, color: '#EEEDFE', fontStyle: 'italic' }}>To build the AI-native professionals powering India's next decade of growth.</p>
          </div>
          <div className="about-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--cloud)', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--specialist)', marginBottom: 4 }}>Pedagogy</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>Menler starts with the realities of the modern workplace—not the classroom. Every program is built backwards from the skills, workflows, and outcomes required to create value with AI.</p>
            </div>
            <div style={{ background: '#E1F5EE', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--forest)', marginBottom: 4 }}>Opportunity</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>Learning is measured by performance, not participation. Every Menler program is built backwards from the capabilities required to create value with AI in workplace.</p>
            </div>
            <div style={{ background: '#FAEEDA', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#854F0B', marginBottom: 4 }}>Specialisation</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>The measure of learning isn't course completion. It's workplace performance. Menler is built around that belief.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">What we stand for</p>
        <h2 className="section-h2">Six values that<br /><em>run Menler.</em></h2>
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="value">
              <p className="value-title">{v.title}</p>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">The team</p>
        <h2 className="section-h2">Built by <em>practitioners.</em></h2>
        <div style={{ marginTop: 40 }}>
          <MentorsRail bare rows={1} />
        </div>
      </section>

      {/* ── WORKING WITH US ── */}
      <section id="working-with-us" className="section" style={{ background: 'white' }}>
        <p className="section-label">Working with us</p>
        <h2 className="section-h2">Three ways to<br /><em>work with Menler.</em></h2>
        <div className="qualify-grid">
          <div className="qualify-card">
            <p className="qualify-title">Hire from Menler</p>
            <p className="qualify-desc">Access AI-native talent trained to drive impact across business and technology functions.</p>
            <a className="qualify-cta" href="mailto:team@menler.in"><svg className="qualify-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>team@menler.in</a>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Menler Teams <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}></span></p>
            <p className="qualify-desc">Equip operator-led AI enablement designed around your workflows, teams, and business goals.</p>
            <a className="qualify-cta" href="mailto:team@menler.in"><svg className="qualify-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>team@menler.in</a>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Careers at Menler</p>
            <p className="qualify-desc">Join us in building India's AI-native workforce alongside builders, operators, and educators.</p>
            <a className="qualify-cta" href="mailto:team@menler.in"><svg className="qualify-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>team@menler.in</a>
          </div>
        </div>
      </section>

      <CtaBanner
        badge="Applications open · Limited seats per program "
        title="This is your turning point."
        subtitle="AI learning, built for the people doing the work."
        buttonText="Apply Now"
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
