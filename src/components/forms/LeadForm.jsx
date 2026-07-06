import { useState } from 'react';
import { submitLead } from '../../services/leadService';
import { verifyEmailOtp } from '../../lib/amplifeedOtp';
import { suggestEmail } from '../../lib/emailHints';
import { useToast } from '../common/Toast';

// Default background options (full role list). Callers can pass their own via
// the `backgroundOptions` prop, and hide the Program field with showProgram={false}.
const DEFAULT_BACKGROUNDS = [
  'Student', 'Founder', 'Business Owner', 'Analyst', 'Engineering', 'Finance',
  "Founder's Office", 'Human Resources (HR)', 'Operations', 'Marketing & Sales',
  'Product Management', 'Program Management', 'Strategy & Consulting', 'Other',
];

export default function LeadForm({ defaultProgram = '', showProgram = true, backgroundOptions, ctaLabel = 'Express interest', source = 'lead-form', section }) {
  const bgOptions = backgroundOptions && backgroundOptions.length ? backgroundOptions : DEFAULT_BACKGROUNDS;
  const toast = useToast();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    background: '', backgroundOther: '', program: defaultProgram, track: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(''); // honeypot — real users never fill this
  const [emailHint, setEmailHint] = useState(null); // "did you mean …?" suggestion

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify the email via OTP before capturing the lead.
      const otp = await verifyEmailOtp(form.email.trim());
      await submitLead({ ...form, ...otp, source, hp_field: hp, cta_label: ctaLabel, section: section || form.program || ctaLabel });
      setSubmitted(true);
      toast.success("Application received — we'll be in touch within 48 hours.");
    } catch (err) {
      toast.error(err?.message || "Something went wrong sending your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="lf-success">
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Application Received</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>You're one step closer to becoming AI-native. Expect a call from our admission team within 48 hours to discuss your aspirations and the next steps.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from humans; bots fill it and get silently dropped. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={e => setHp(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      <span className="lead-form-label">Express interest</span>
      <p className="lead-form-title">Start your Menler journey.</p>

      <div className="lf-field">
        <label>Full name</label>
        <input required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
      </div>

      <div className="lf-row">
        <div className="lf-field">
          <label>Email</label>
          <input
            required
            type="email"
            placeholder="you@domain.com"
            value={form.email}
            onChange={e => { set('email', e.target.value); if (emailHint) setEmailHint(null); }}
            onBlur={e => setEmailHint(suggestEmail(e.target.value))}
            autoComplete="email"
          />
          {emailHint && (
            <p className="lf-email-hint" style={{ fontSize: 12, marginTop: 6, color: 'var(--text-muted)' }}>
              Did you mean{' '}
              <button
                type="button"
                onClick={() => { set('email', emailHint); setEmailHint(null); }}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--specialist, #5a3fd6)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {emailHint}
              </button>
              ?
            </p>
          )}
        </div>
        <div className="lf-field">
          <label>Phone / WhatsApp</label>
          <input required type="tel" placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" />
        </div>
      </div>

      <div className="lf-field">
        <label>Background</label>
        <select required value={form.background} onChange={e => set('background', e.target.value)}>
          <option value="">Select…</option>
          {bgOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        {form.background === 'Other' && (
          <input required style={{ marginTop: 8 }} placeholder="Tell us your background" value={form.backgroundOther} onChange={e => set('backgroundOther', e.target.value)} />
        )}
      </div>

      {showProgram && (
        <div className="lf-field">
          <label>Program</label>
          <select required value={form.program} onChange={e => set('program', e.target.value)}>
            <option value="">Select…</option>
            <option>Claude AI Generalist</option>
            <option>Claude AI Engineering</option>
            <option>Not sure yet — help me decide</option>
          </select>
        </div>
      )}

      <label className="lf-consent">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span>I consent to being contacted by Menler regarding admissions, program updates, and important fellowship information.</span>
      </label>

      <button className="lf-submit" type="submit" disabled={loading || !consent}>
        {loading ? 'Submitting…' : 'Express Interest'}
      </button>
    </form>
  );
}
