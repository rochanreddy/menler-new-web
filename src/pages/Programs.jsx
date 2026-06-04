import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import { useApply } from '../components/common/ApplyContext';
import MentorsRail from '../components/common/MentorsRail';
import { submitLead } from '../services/leadService';

const PLANS = [
  {
    key: 'gen', label: 'Claude AI Generalist', name: 'Core Track', path: '/generalist',
    for: '12 weeks. No coding required. Domain portfolio + Claude Specialist credential.',
    price: '₹49,999', emi: 'EMI from ₹4,500/month',
    features: ['80+ hours live over 12 weeks', '1:1 mentor sessions', 'Domain capstone project', 'Claude Specialist credential', 'Job board & alumni network'],
    cta: 'Apply — Generalist', featured: false,
  },
  {
    key: 'eng', label: 'Claude AI Engineering', name: 'Core Track', path: '/engineering',
    for: '12 weeks. Python/JS required. Production builds + Claude Engineer credential.',
    price: '₹59,999', emi: 'EMI from ₹5,400/month',
    features: ['80+ hours live over 12 weeks', '1:1 mentor sessions', '3 production builds (API, RAG, MCP)', 'Claude Engineer credential', 'Job board & alumni network'],
    cta: 'Apply — Engineering', featured: false,
  },
  {
    key: 'ccaf', label: 'Fellowship + CCA-F', name: 'CCAF + Interview Track', path: '/programs',
    for: 'Generalist or Engineering, plus CCA-F certification prep and structured interview assistance.',
    price: '₹89,999', emi: 'EMI from ₹8,100/month',
    features: ['Everything in Core Track', 'Choose Generalist or Engineering', 'Module 11 — CCA-F Prep Track', 'Anthropic Academy CPN learning path', 'Mock exams, CCA-F format', 'Structured interview prep', 'Founding Fellow co-branded certificate'],
    cta: 'Apply — CCAF Track', featured: true,
  },
];

export default function Programs() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const openApply = useApply();

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
      <section className="hero" style={{ padding: '72px 40px 48px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Programs · India · Cohort 01 enrolling</p>
          <h1 className="hero-h1">Three programs.<br /><em>One outcome — AI-native you.</em></h1>
          <p className="hero-sub">Pick your path: a 14-day fluency sprint, a 12-week no-code Specialist track, or a 12-week production engineering fellowship. All three end in a real credential, real builds, and real placement support.</p>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="section" style={{ background: 'white', padding: '32px 40px 72px' }}>
        <div className="pricing-grid">
          {PLANS.map(pl => (
            <div className={`pricing-card pricing-card--${pl.key}${pl.featured ? ' featured' : ''}`} key={pl.key}>
              <p className="pricing-eyebrow">{pl.label}</p>
              <p className="pricing-name">{pl.name}</p>
              <p className="pricing-for">{pl.for}</p>
              <p className="pricing-price">{pl.price}</p>
              <p className="pricing-emi">{pl.emi}</p>
              <ul className="pricing-feats">
                {pl.features.map(f => (
                  <li key={f}><span className="pricing-check">✓</span>{f}</li>
                ))}
              </ul>
              <button className="pricing-btn" onClick={() => go(pl.path)}>{pl.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOT SURE ── */}
      <section className="section" style={{ background: 'var(--cloud)', padding: '48px 40px', textAlign: 'center' }}>
        <p className="section-label">Not sure which fits?</p>
        <h2 className="section-h2" style={{ fontSize: 32 }}>Take the AI Aptitude Test.<br /><em>Get a personal recommendation.</em></h2>
        <p className="section-sub" style={{ maxWidth: 540, margin: '14px auto 22px' }}>12 minutes. Free. You'll leave with a score, a recommended program, and a 10-day learning roadmap.</p>
        <button className="btn-primary" onClick={() => go('/aptitude')}>Take the Aptitude Test</button>
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
              <button type="submit">Send me the comparison</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail />

      {/* ── CTA ── */}
      <CtaBanner
        badge="Applications open · Cohort 01 · Limited seats"
        title="Ready to commit?"
        subtitle="Skip ahead. Apply for a scholarship and we'll match you to the right program."
        buttonText="Sign up"
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
