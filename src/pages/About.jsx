import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import { useApply } from '../components/common/ApplyContext';

const VALUES = [
  { title: 'Depth over breadth', desc: 'We go deep on Claude — not a tour of 40 AI tools. One model, mastered. Across real professional domains.' },
  { title: 'Outcomes over completion', desc: 'A certificate without a job is just paper. Every design decision in the program — projects, mentors, placement pipeline — is oriented around what comes after demo day.' },
  { title: 'Specificity over vagueness', desc: 'MCP. Claude Code. RAGAS. We use the right words for things. No "the power of AI" — just what Claude can actually do for a finance analyst or a founding engineer.' },
  { title: 'Domain-first thinking', desc: 'Claude mastery means nothing without domain context. The Generalist program is a Claude program. It\'s also a Finance program, a Marketing program, a VC program.' },
  { title: 'Fellows, not students', desc: 'The program is a partnership. Fellows ship work, share it publicly, and contribute to the cohort\'s collective intelligence. We hold the bar high on both sides.' },
  { title: 'The era is now', desc: "We don't prepare people for a future that might come. The AI era is already here. The question is whether you're building in it or watching it from outside." },
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
        keywords="About Menler, AI learning company India, Menler AI, AI fellowship India"
        path="/about"
      />
      {/* ── HERO ── */}
      <section className="about-hero hero hero-centered" style={{ padding: '64px clamp(22px, 6vw, 40px) 56px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring rl1" />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: 'var(--lavender)' }}>About Menler · India</p>
          <h1 className="hero-h1">AI learning, built for<br /><em>the people doing the work.</em></h1>
          <p className="hero-sub" style={{ maxWidth: 650 }}>Menler is India's operator-led AI learning brand helping students & ambitious professionals become AI-native through practical learning, shipped projects, and a community of builders. The measure of learning isn't what you know , it's what you can build on Monday morning.</p>
        </div>
      </section>
      
      {/* ── OUR STORY ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Our story</p>
        <h2 className="section-h2">Why we built<br /><em>Menler.</em></h2>
        <div className="about-grid">
          <div className="about-card" style={{ background: 'var(--ink)', color: '#EEEDFE', padding: 28, borderRadius: 14 }}>
            <p className="about-card-label" style={{ color: 'var(--lavender)' }}>Vision</p>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, lineHeight: 1.4, color: '#EEEDFE', fontStyle: 'italic' }}>To build the AI-native workforce powering India's next decade of growth</p>
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
            <p className="qualify-desc">Access a pipeline of AI-native professionals trained to apply AI inside real business functions—from operations and finance to growth, product, and engineering.</p>
            <a className="qualify-cta" href="mailto:team@menler.in">Email at team@menler.in</a>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Menler Teams <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>· B2B</span></p>
            <p className="qualify-desc">Operator-led AI enablement for teams adopting AI at work. Designed around your workflows, use cases, and business goals—not generic training.</p>
            <a className="qualify-cta" href="mailto:team@menler.in">Email at team@menler.in</a>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Careers at Menler</p>
            <p className="qualify-desc">Join us in building India's AI-native workforce. We're looking for ambitious operators, educators, builders, and problem-solvers who want to shape the future of AI learning.</p>
            <a className="qualify-cta" href="mailto:team@menler.in">Email at team@menler.in</a>
          </div>
        </div>
      </section>

      <CtaBanner
        badge="Cohort 01 open now"
        title="This is your turning point."
        subtitle="12 weeks. Claude-native. Domain-specialist. Placed."
        buttonText="Sign up"
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
