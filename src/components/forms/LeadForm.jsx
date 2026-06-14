import { useState } from 'react';
import { submitLead } from '../../services/leadService';
import { useToast } from '../common/Toast';

export default function LeadForm({ defaultProgram = '' }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    background: '', backgroundOther: '', program: defaultProgram, track: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

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
          <option>Founder</option>
          <option>Business Owner</option>
          <option>Analyst</option>
          <option>Engineering</option>
          <option>Finance</option>
          <option>Founder's Office</option>
          <option>Human Resources (HR)</option>
          <option>Operations</option>
          <option>Marketing &amp; Sales</option>
          <option>Product Management</option>
          <option>Program Management</option>
          <option>Strategy &amp; Consulting</option>
          <option>Other</option>
        </select>
        {form.background === 'Other' && (
          <input style={{ marginTop: 8 }} placeholder="Tell us your background" value={form.backgroundOther} onChange={e => set('backgroundOther', e.target.value)} />
        )}
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

      <label className="lf-consent">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span>I consent to being contacted by Menler regarding admissions, program updates, and important fellowship information.</span>
      </label>

      <button className="lf-submit" type="submit" disabled={loading || !consent}>
        {loading ? 'Submitting…' : 'Express interest'}
      </button>
    </form>
  );
}
