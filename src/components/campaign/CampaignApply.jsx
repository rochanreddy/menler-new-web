import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenlerWordmark from '../common/MenlerWordmark';
import Seo from '../common/Seo';
import { useToast } from '../common/Toast';
import { verifySmsOtp, verifyEmailOtp } from '../../lib/amplifeedOtp';
import { COUNTRY_CODES } from '../../data/countryCodes';
import { submitLead } from '../../services/leadService';
import BackgroundField from '../forms/BackgroundField';

/* The confirmation, as its own screen.
 *
 * It replaces the landing page rather than sitting inside the dialog that
 * opened the form, which is how the workshop checkout ends too: the page you
 * applied from is no longer the page you want, and a panel inside a dialog
 * leaves the whole advert still sitting behind it. */
export function ThankYou({ applicant, programTitle, followUp, theme = '' }) {
  const navigate = useNavigate();

  // The page under this one is where the reader had scrolled to. Start at the
  // top, or the confirmation appears already scrolled past.
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`gcamp gcamp-thanks${theme ? ` ${theme}` : ''}`}>
      <Seo title="You're registered | Menler" noindex />
      <header className="gcamp-top">
        <MenlerWordmark />
        <span className="gcamp-top-tag">
          <span className="gcamp-top-dot" aria-hidden="true" />
          Admissions open
        </span>
      </header>

      <div className="gcamp-thanks-inner">
        {/* The ring pops, then the check draws itself. An SVG path rather than
            a "✓" character because a stroke can be drawn; a glyph can only
            appear. */}
        <span className="gcamp-done-tick" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle className="gcamp-tick-ring" cx="26" cy="26" r="24" />
            <path className="gcamp-tick-path" d="M15.5 26.5 L23 34 L37 19" />
          </svg>
        </span>

        <h1 className="gcamp-thanks-h">You're registered!</h1>
        <p className="gcamp-thanks-p">
          {applicant.name ? `Thanks, ${applicant.name.split(/\s+/)[0]} — you're` : "You're"} all set for the{' '}
          <b>{programTitle}</b>. Admissions will call you on{' '}
          <b>{applicant.phone}</b> within 24 hours to {followUp} and confirm
          your seat.
        </p>

        <p className="gcamp-thanks-label">Open to you already</p>
        <div className="gcamp-thanks-links">
          <Link className="gcamp-cta" to="/events">Upcoming events</Link>
          <Link className="gcamp-cta gcamp-cta--light" to="/resources">Resource library</Link>
        </div>

        <button type="button" className="gcamp-thanks-back" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

/* Admissions form → one-time code → thank-you.
 *
 * The code goes by SMS to Indian numbers and by email to everyone else. That
 * split is not a preference: the SMS gateway only delivers to +91, so an
 * international applicant sending themselves an SMS code would wait for one
 * that never arrives. Email reaches all of them, which is why the address is
 * required rather than optional. */
function ApplyForm({ onDone, program, source, section, noteProgram }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', background: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const indian = form.countryCode === '+91';
  const minLen = indian ? 10 : 8;

  const onPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, indian ? 10 : 15);
    set('phone', digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.phone.length < minLen) {
      setErr(`Enter a valid ${indian ? '10-digit ' : ''}phone number.`);
      return;
    }
    setLoading(true);
    try {
      const digits = `${form.countryCode}${form.phone}`.replace(/\D/g, '');
      const otp = indian
        ? await verifySmsOtp(digits)
        : await verifyEmailOtp(form.email.trim());
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: `${form.countryCode} ${form.phone}`,
        background: form.background,
        program,
        ...otp,
        source,
        cta_label: 'Apply Now',
        section: section || program || 'Campaign apply',
      });
      // Hands the page the confirmed details and steps aside — the thank-you
      // is a page of its own, not a panel inside the dialog that opened it.
      onDone({ name: form.name.trim(), phone: `${form.countryCode} ${form.phone}` });
      toast.success("You're verified — our admissions team will call you shortly.");
    } catch (e2) {
      setErr(e2?.message || "Couldn't verify that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="gcamp-formcard-t">Request a callback</p>
      <p className="gcamp-formcard-d">Takes under a minute.</p>
      <form className="gcamp-applyform" onSubmit={handleSubmit}>
        <input
          required
          type="text"
          aria-label="Full name"
          placeholder="Full name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          disabled={loading}
        />
        <input
          required
          type="email"
          aria-label="Email address"
          placeholder="Email address"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          disabled={loading}
        />
        <div className="gcamp-phonerow">
          <select
            className="gcamp-dial"
            aria-label="Country code"
            value={form.countryCode}
            onChange={(e) => { set('countryCode', e.target.value); set('phone', ''); }}
            disabled={loading}
          >
            {COUNTRY_CODES.map(({ code, label }) => (
              <option key={label} value={code}>{label}</option>
            ))}
          </select>
          <input
            required
            type="tel"
            inputMode="numeric"
            aria-label="Phone number"
            placeholder={indian ? '10-digit mobile' : 'Phone number'}
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => onPhone(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Who they are, asked the same two-step way as every other form on
            the site so admissions reads one vocabulary, not a per-page one. */}
        <BackgroundField
          label="Your background"
          mutedColor="rgba(175, 169, 236, 0.7)"
          disabled={loading}
          onChange={(v) => set('background', v)}
        />
        {/* Said before they submit, not after — someone abroad who expects an
            SMS will otherwise sit waiting for one that cannot arrive. */}
        <p className="gcamp-formnote gcamp-formnote--tight">
          {indian
            ? "We'll text a one-time code to this number."
            : "We'll email your one-time code — SMS only works for Indian numbers."}
        </p>
        {err && <p className="gcamp-formerr">{err}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying…' : 'Apply Now'}
        </button>
      </form>
      <p className="gcamp-formnote">
        We'll only contact you about this {noteProgram}. No spam, ever.
      </p>
    </>
  );
}

/* The form, in a dialog over the page.
 *
 * Escape and a click on the backdrop close it, and the page behind stays put
 * while it is open. body{overflow:hidden} alone is not enough on this site —
 * Lenis drives scrolling from wheel events and keeps going regardless, so it
 * has to be stopped explicitly, and the panel carries data-lenis-prevent so
 * the wheel still reaches its own scrollbar. */
export default function ApplyModal({ onClose, onDone, program, section, source, label, noteProgram = 'programme' }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <div className="gcamp-modal-back" onClick={onClose} role="presentation" data-lenis-prevent>
      <div
        className="gcamp-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button type="button" className="gcamp-modal-x" onClick={onClose} aria-label="Close">×</button>
        <ApplyForm onDone={onDone} program={program} source={source} section={section} noteProgram={noteProgram} />
      </div>
    </div>
  );
}
