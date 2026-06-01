import { useState } from 'react';
import { submitLead } from '../../services/leadService';
import { useToast } from '../common/Toast';

export default function LeadForm({ defaultProgram = '' }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    background: '', program: defaultProgram, track: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({ ...form, source: 'lead-form' });
      setSubmitted(true);
      toast.success("Application received — we'll be in touch within 48 hours.");
    } catch {
      toast.error("Something went wrong sending your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="lf-success">
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Thank you.</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Your interest is in. The Menler admissions team will reach out within 48 hours with your personalised next step.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <span className="lead-form-label">Express interest</span>
      <p className="lead-form-title">Start your Menler journey.</p>

      <div className="lf-field">
        <label>Full name</label>
        <input required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
      </div>

      <div className="lf-row">
        <div className="lf-field">
          <label>Email</label>
          <input required type="email" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
        </div>
        <div className="lf-field">
          <label>Phone / WhatsApp</label>
          <input type="tel" placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" />
        </div>
      </div>

      <div className="lf-field">
        <label>Background</label>
        <select value={form.background} onChange={e => set('background', e.target.value)}>
          <option value="">Select…</option>
          <option>Student</option>
          <option>Working professional — non-tech</option>
          <option>Working professional — tech</option>
          <option>Software engineer / data scientist</option>
          <option>Business owner</option>
          <option>Founder</option>
          <option>Career switcher</option>
        </select>
      </div>

      <div className="lf-field">
        <label>Program</label>
        <select value={form.program} onChange={e => set('program', e.target.value)}>
          <option value="">Select…</option>
          <option>Claude AI Generalist</option>
          <option>Claude AI Engineering</option>
          <option>Not sure yet — help me decide</option>
        </select>
      </div>

      <div className="lf-field">
        <label>Track (optional)</label>
        <select value={form.track} onChange={e => set('track', e.target.value)}>
          <option value="">Select a track…</option>
          <option>Founder's Office</option>
          <option>Venture Capital</option>
          <option>Marketing</option>
          <option>Analyst</option>
          <option>Finance</option>
          <option>Operations</option>
          <option>Technology</option>
          <option>Engineering — full Claude stack</option>
        </select>
      </div>

      <button className="lf-submit" type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Express interest →'}
      </button>
      <p className="lf-fineprint">By submitting, you agree to be contacted by the Menler admissions team. We don't spam — only genuine, useful updates about the fellowship.</p>
    </form>
  );
}
