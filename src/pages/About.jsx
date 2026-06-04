import { useNavigate } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
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
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const openApply = useApply();

  return (
    <>
      {/* ── HERO ── */}
      <section className="about-hero hero hero-centered" style={{ padding: '64px 40px 56px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: 'var(--lavender)' }}>About Menler · India</p>
          <h1 className="hero-h1">AI learning, built for<br /><em>the people doing the work.</em></h1>
          <p className="hero-sub">Menler is India's first Claude AI school. We run four products: <strong style={{ color: '#EEEDFE', fontWeight: 500 }}>Fellowship</strong> (our 12-week certification program), <strong style={{ color: '#EEEDFE', fontWeight: 500 }}>Teams</strong> (custom AI training for companies), <strong style={{ color: '#EEEDFE', fontWeight: 500 }}>Open</strong> (free resources, the Aptitude Test, and the Question Bank), and <strong style={{ color: '#EEEDFE', fontWeight: 500 }}>Labs</strong> (student-built products and alumni research). Everything we make is designed for one type of person: the Indian professional who is serious about building with Claude.</p>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Our story</p>
        <h2 className="section-h2">Why we built<br /><em>Menler.</em></h2>
        <div className="about-grid">
          <div className="about-card" style={{ background: 'var(--ink)', color: '#EEEDFE', padding: 28, borderRadius: 14 }}>
            <p className="about-card-label" style={{ color: 'var(--lavender)' }}>Vision</p>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, lineHeight: 1.4, color: '#EEEDFE', fontStyle: 'italic' }}>Help people redefine how they perceive work in the AI era.</p>
          </div>
          <div className="about-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--cloud)', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--specialist)', marginBottom: 4 }}>Pedagogy</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>Every Menler program is built backwards from a real job outcome. What does a placed Generalist do on day one at work? What does a Claude Engineer ship in their first sprint? We design backward from the answer.</p>
            </div>
            <div style={{ background: '#E1F5EE', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--forest)', marginBottom: 4 }}>Opportunity</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>India has 500M+ working people and one of the fastest-growing AI hiring markets on earth. The gap between where Indian professionals are on AI and where the market wants them to be is enormous. That's the opportunity we're building into.</p>
            </div>
            <div style={{ background: '#FAEEDA', borderRadius: 10, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#854F0B', marginBottom: 4 }}>Specialisation</p>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>We chose Claude because it's the most capable, safest, and most operator-friendly model in the world for professional use. We go deep on one thing rather than broad on many.</p>
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
        <div className="team-note" style={{ maxWidth: 680, margin: '0 auto', background: 'white', borderRadius: 14, padding: '28px 32px', border: '0.5px solid rgba(175,169,236,0.2)' }}>
          <p style={{ fontSize: 15, color: 'var(--ink)', fontStyle: 'italic', fontFamily: "'DM Serif Display',serif", fontSize: 20, lineHeight: 1.4, marginBottom: 12 }}>Cohort 01 team bios coming soon.</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>We'll be sharing the full Menler team — instructors, mentors, curriculum designers, and placement leads — when Cohort 01 goes live. For now: every person involved in the program is actively using Claude in their professional work. No exceptions.</p>
        </div>
      </section>

      {/* ── WORKING WITH US ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Working with us</p>
        <h2 className="section-h2">Three ways to<br /><em>work with Menler.</em></h2>
        <div className="qualify-grid">
          <div className="qualify-card" style={{ cursor: 'pointer' }} onClick={() => go('/outcomes')}>
            <p className="qualify-title">Hire from us</p>
            <p className="qualify-desc">Access the Menler hiring pipeline. Certified Claude Specialists across seven domain tracks — Finance, Marketing, VC, Operations, Technology, Engineering, and Founder's Office.</p>
            <p style={{ fontSize: 12, color: 'var(--specialist)', fontWeight: 500, marginTop: 8 }}>See outcomes</p>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Menler Teams <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>· B2B</span></p>
            <p className="qualify-desc">Custom AI training for your team, designed around your tools, your workflows, and your domain. From a single sprint to a full company transformation. Email us at <strong>teams@meridianai.in</strong></p>
          </div>
          <div className="qualify-card">
            <p className="qualify-title">Careers at Menler</p>
            <p className="qualify-desc">We're a small team. We hire slowly and specifically. Currently looking for: instructor (Generalist Engineering track), mentor (Finance or VC), curriculum designer, partnerships lead. Email <strong>careers@meridianai.in</strong></p>
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
