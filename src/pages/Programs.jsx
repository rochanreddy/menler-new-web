import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import { submitLead } from '../services/leadService';

const COMPARE_ROWS = [
  { label: 'Length', kick: '14 days', gen: '12 weeks', eng: '12 weeks', kickCls: 'kick-col', genCls: 'gen-col', engCls: 'eng-col' },
  { label: 'Prerequisites', kick: 'None', gen: 'None — any domain', eng: 'Python or JS', kickCls: '', genCls: '', engCls: '' },
  { label: 'Format', kick: 'Daily 90-min live + practice', gen: '3 evenings + Saturday', eng: '3 evenings + Saturday', kickCls: '', genCls: '', engCls: '' },
  { label: 'Projects shipped', kick: '5 mini + 1 capstone', gen: '8 incl. domain capstone', eng: '5 production-grade', kickCls: '', genCls: '', engCls: '' },
  { label: 'Mentors', kick: '2–3 instructors', gen: '4 domain operators', eng: '4 senior Claude engineers', kickCls: '', genCls: '', engCls: '' },
  { label: 'Certification', kick: 'AI Fluency cert', gen: 'Claude Specialist — [Domain]', eng: 'Claude Engineer — [Specialty]', kickCls: '', genCls: '', engCls: '' },
  { label: 'Placement support', kick: 'Discord + scholarship to Fellowship', gen: '25+ partners · Demo Day', eng: '25+ partners · Demo Day · Code review', kickCls: '', genCls: '', engCls: '' },
  { label: 'Investment', kick: 'Entry tier ₹', gen: 'Specialist tier ₹₹', eng: 'Engineer tier ₹₹₹', kickCls: 'kick-col', genCls: 'gen-col', engCls: 'eng-col' },
  { label: 'Scholarships', kick: 'Up to 30%', gen: 'Up to 50%', eng: 'Up to 50%', kickCls: '', genCls: '', engCls: '' },
];

export default function Programs() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '' });
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, source: 'programs-hub' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero-centered" style={{ padding: '72px 40px 48px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Programs · India · Cohort 01 enrolling</p>
          <h1 className="hero-h1">Three programs.<br /><em>One outcome — AI-native you.</em></h1>
          <p className="hero-sub">Pick your path: a 14-day fluency sprint, a 12-week no-code Specialist track, or a 12-week production engineering fellowship. All three end in a real credential, real builds, and real placement support.</p>
        </div>
      </section>

      {/* ── LADDER ── */}
      <section className="section" style={{ background: 'white', padding: '32px 40px 72px' }}>
        <div className="ladder">
          <div className="ladder-card kick" onClick={() => go('/kickstarter')}>
            <p className="ladder-tier">Tier 1 · Entry</p>
            <p className="ladder-name">Gen AI Kickstarter</p>
            <p className="ladder-tag">School + college students, Gen AI aspirants</p>
            <div className="ladder-stats">
              <div><p>Length</p><p>14 days</p></div>
              <div><p>Format</p><p>Live evening</p></div>
              <div><p>Builds</p><p>5 + capstone</p></div>
              <div><p>Outcome</p><p>AI fluency cert</p></div>
            </div>
            <div className="ladder-fee"><p className="ladder-fee-amt">₹</p><p className="ladder-fee-cta">Explore Kickstarter →</p></div>
          </div>
          <div className="ladder-card gen" onClick={() => go('/generalist')}>
            <p className="ladder-tier">Tier 2 · Specialist</p>
            <p className="ladder-name">Claude AI Generalist</p>
            <p className="ladder-tag">Professionals, founders, switchers — no code</p>
            <div className="ladder-stats">
              <div><p>Length</p><p>12 weeks</p></div>
              <div><p>Format</p><p>Cohort, hybrid</p></div>
              <div><p>Builds</p><p>8 projects</p></div>
              <div><p>Outcome</p><p>Specialist + placement</p></div>
            </div>
            <div className="ladder-fee"><p className="ladder-fee-amt">₹₹</p><p className="ladder-fee-cta">Explore Generalist →</p></div>
          </div>
          <div className="ladder-card eng" onClick={() => go('/engineering')}>
            <p className="ladder-tier">Tier 3 · Engineer</p>
            <p className="ladder-name">Claude AI Engineering</p>
            <p className="ladder-tag">SDEs, DS, ML, IT — Python required</p>
            <div className="ladder-stats">
              <div><p>Length</p><p>12 weeks</p></div>
              <div><p>Format</p><p>Cohort, intensive</p></div>
              <div><p>Builds</p><p>5 production</p></div>
              <div><p>Outcome</p><p>Engineer + placement</p></div>
            </div>
            <div className="ladder-fee"><p className="ladder-fee-amt">₹₹₹</p><p className="ladder-fee-cta">Explore Engineering →</p></div>
          </div>
        </div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section className="compare-section">
        <p className="section-label" style={{ textAlign: 'center' }}>Side-by-side</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Compare programs<br /><em>at a glance.</em></h2>
        <div className="compare-table">
          <div className="compare-row head">
            <div className="compare-cell">Feature</div>
            <div className="compare-cell">Kickstarter</div>
            <div className="compare-cell">Generalist</div>
            <div className="compare-cell">Engineering</div>
          </div>
          {COMPARE_ROWS.map((r, i) => (
            <div key={i} className="compare-row">
              <div className="compare-cell">{r.label}</div>
              <div className={`compare-cell ${r.kickCls}`}>{r.kick}</div>
              <div className={`compare-cell ${r.genCls}`}>{r.gen}</div>
              <div className={`compare-cell ${r.engCls}`}>{r.eng}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOT SURE ── */}
      <section className="section" style={{ background: 'var(--cloud)', padding: '48px 40px', textAlign: 'center' }}>
        <p className="section-label">Not sure which fits?</p>
        <h2 className="section-h2" style={{ fontSize: 32 }}>Take the AI Aptitude Test.<br /><em>Get a personal recommendation.</em></h2>
        <p className="section-sub" style={{ maxWidth: 540, margin: '14px auto 22px' }}>12 minutes. Free. You'll leave with a score, a recommended program, and a 10-day learning roadmap.</p>
        <button className="btn-primary" onClick={() => go('/aptitude')}>Take the Aptitude Test →</button>
      </section>

      {/* ── PROG LEAD ── */}
      <section className="prog-lead">
        <div className="prog-lead-inner">
          <div className="prog-lead-copy">
            <h3>Get the <em>full programs comparison</em>.</h3>
            <p>Detailed syllabus, mentor list, fee structure, scholarships, and Cohort 01 timeline — all three programs side-by-side. Sent to your inbox in under a minute.</p>
          </div>
          {done ? (
            <p style={{ color: 'var(--placed)', fontWeight: 500 }}>✓ Comparison on its way.</p>
          ) : (
            <form className="prog-lead-form" onSubmit={handleSubmit}>
              <label>Full name</label>
              <input type="text" required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
              <div className="row2">
                <div><label>Email</label><input type="email" required placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></div>
                <div><label>WhatsApp</label><input type="tel" required placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" /></div>
              </div>
              <label>Which program speaks to you?</label>
              <select required value={form.program} onChange={e => set('program', e.target.value)}>
                <option value="">Help me decide</option>
                <option>Gen AI Kickstarter</option>
                <option>Claude AI Generalist</option>
                <option>Claude AI Engineering</option>
                <option>Not sure — recommend based on Aptitude Test</option>
              </select>
              <button type="submit">Send me the comparison →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        badge="Applications open · Cohort 01 · Limited seats"
        title="Ready to commit?"
        subtitle="Skip ahead. Apply for a scholarship and we'll match you to the right program."
        buttonText="Sign up"
        onButtonClick={() => go('/scholarship')}
      />

      <Footer />
    </>
  );
}
