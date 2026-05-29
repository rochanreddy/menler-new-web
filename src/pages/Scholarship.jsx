import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '../services/leadService';
import { useToast } from '../components/common/Toast';
import Footer from '../components/layout/Footer';

const QUALIFY_PATHS = [
  { title: 'Need-based', sub: '50% off', desc: 'Family income under ₹8L p.a. Documented. Up to 50% off.' },
  { title: 'Aptitude Test top scorers', sub: '30% off', desc: 'Top 10% scorers on the Meridian AI Aptitude Test. Up to 30% off.' },
  { title: 'Women in AI', sub: '15% off', desc: '15% off, stackable with other paths.' },
  { title: 'Tier-2 / Tier-3 cities', sub: '15% off', desc: 'Candidates outside the top 8 metros. 15% off, stackable.' },
  { title: 'First-generation learners', sub: '15% off', desc: 'First in your family to attend a paid post-college program. 15% off, stackable.' },
  { title: 'Kickstarter alumni', sub: '30% off', desc: 'Completed the 14-day Kickstarter? 30% scholarship to Generalist or Engineering Fellowship.', isAlumni: true },
];

export default function Scholarship() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', age: '', program: '', paths: [], why: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togglePath = (p) => setForm(f => {
    const paths = f.paths.includes(p) ? f.paths.filter(x => x !== p) : [...f.paths, p];
    return { ...f, paths };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({ ...form, paths: form.paths.join(', '), type: 'scholarship', source: 'scholarship-page' });
      setDone(true);
      toast.success('Application received — decision within 7 days.');
    } catch {
      toast.error("Couldn't submit your application just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="scholar-hero" style={{ textAlign: 'center', padding: '64px 40px 40px' }}>
        <p className="section-label" style={{ justifyContent: 'center' }}>Scholarships · Up to 50% off</p>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(30px,5vw,48px)', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16, maxWidth: 640, margin: '0 auto 16px' }}>
          The Meridian Scholarship.<br /><em>Because money can't be the reason.</em>
        </h1>
        <p className="section-sub" style={{ maxWidth: 580, margin: '0 auto 32px', textAlign: 'center' }}>
          We will not let fees be the wall between you and the AI era. Multiple scholarship paths, all stackable, decided fast. One application. One review committee. Decisions in 7 days.
        </p>
        <div className="scholar-stats" style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <div><p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: 'var(--specialist)', lineHeight: 1 }}>50%</p><p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>Max scholarship</p></div>
          <div><p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: 'var(--specialist)', lineHeight: 1 }}>7-day</p><p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>Decision window</p></div>
          <div><p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: 'var(--specialist)', lineHeight: 1 }}>5+</p><p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>Eligibility paths</p></div>
        </div>
      </section>

      {/* ── WHO QUALIFIES ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Who qualifies</p>
        <h2 className="section-h2">Six paths to<br /><em>a Meridian scholarship.</em></h2>
        <p className="section-sub">Paths are stackable. A Tier-3 city woman with demonstrated need can qualify for up to 80% off. Apply and we'll calculate your maximum eligible reduction.</p>
        <div className="qualify-grid">
          {QUALIFY_PATHS.map((q, i) => (
            <div key={i} className={`qualify-card${q.isAlumni ? ' cloud' : ''}`} style={q.isAlumni ? { background: 'var(--cloud)', borderColor: 'rgba(83,74,183,0.2)' } : {}}>
              <p className="qualify-title">{q.title}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: q.isAlumni ? 'var(--specialist)' : 'var(--placed)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{q.sub}</p>
              <p className="qualify-desc">{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>Apply</p>
          <h2 className="section-h2" style={{ textAlign: 'center' }}>One application.<br /><em>We do the rest.</em></h2>
          <p className="section-sub" style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 28px' }}>Fill this in honestly. Our committee reviews every application individually. We'll confirm receipt and respond with a decision in 7 days.</p>
          {done ? (
            <div style={{ padding: '32px 24px', background: '#E1F5EE', borderRadius: 14, border: '0.5px solid rgba(29,158,117,0.3)' }}>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: 'var(--forest)', marginBottom: 8 }}>Application received.</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>We'll review it and reach out within 7 days. Check your inbox — and spam folder.</p>
            </div>
          ) : (
            <form className="prog-lead-form" style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
              <label>Full name</label>
              <input type="text" required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
              <div className="row2">
                <div><label>Email</label><input type="email" required placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></div>
                <div><label>Phone / WhatsApp</label><input type="tel" required placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" /></div>
              </div>
              <div className="row2">
                <div><label>City</label><input type="text" required placeholder="e.g. Hyderabad" value={form.city} onChange={e => set('city', e.target.value)} /></div>
                <div><label>Age</label><input type="number" required min="14" placeholder="Your age" value={form.age} onChange={e => set('age', e.target.value)} /></div>
              </div>
              <label>Program applying for</label>
              <select required value={form.program} onChange={e => set('program', e.target.value)}>
                <option value="">Choose a program</option>
                <option>Gen AI Kickstarter (14 days)</option>
                <option>Claude AI Generalist Fellowship (12 weeks)</option>
                <option>Claude AI Engineering Fellowship (12 weeks)</option>
                <option>Not sure yet</option>
              </select>
              <label>Which scholarship paths apply to you? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select all that apply)</span></label>
              <div className="checkbox-list">
                {['Need-based (family income under ₹8L p.a.)', 'Aptitude Test top 10%', 'Women in AI', 'Tier-2 / Tier-3 city', 'First-generation learner', 'Kickstarter alumni (30% off Fellowship)'].map(p => (
                  <label key={p}>
                    <input type="checkbox" checked={form.paths.includes(p)} onChange={() => togglePath(p)} />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
              <label>Tell us about yourself and why you're applying</label>
              <textarea required placeholder="A few sentences on where you are, what you want to build, and why Meridian matters to you right now." value={form.why} onChange={e => set('why', e.target.value)} style={{ minHeight: 100 }} />
              <button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit scholarship application →'}</button>
            </form>
          )}
        </div>
      </section>

      {/* ── SCHOLAR STORIES ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">From past scholars</p>
        <h2 className="section-h2">They almost<br /><em>didn't apply.</em></h2>
        <div className="placement-stories">
          <article className="placement-card">
            <span className="placement-arch">Need-based · 50% off</span>
            <p className="placement-quote">"I would not have applied otherwise. The scholarship page convinced me it wasn't just marketing. Three months later I was Founding AI Engineer at Loomwise with a YC offer letter."</p>
            <p className="placement-meta"><strong>Karan I.</strong> · Engineering Cohort 01 · Scholarship amount: 50% off ₹79,000</p>
          </article>
          <article className="placement-card">
            <span className="placement-arch">Tier-3 city + Aptitude top 10% · 35% off</span>
            <p className="placement-quote">"I came in from a small Andhra town with no network in Bengaluru. The scholarship covered what I couldn't. The program gave me the credential. I had three interviews in week nine."</p>
            <p className="placement-meta"><strong>Sruthi P.</strong> · Generalist Cohort 01 · Finance track · Scholarship amount: 35% off ₹49,000</p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
