import { useEffect, useState } from 'react';
import { submitLead } from '../../services/leadService';
import { verifyEmailOtp } from '../../lib/amplifeedOtp';
import { getVerifiedLead, saveVerifiedLead } from '../../lib/verifiedSession';
import { downloadFile } from '../../lib/download';
import PdfView from './PdfView';

/**
 * Claude Playbook resource popup — split layout:
 *   left  → in-modal PDF preview
 *   right → lead-capture form with the download button underneath
 * On submit the lead is stored and the PDF download triggers.
 * Pass the clicked playbook item (or null) and an onClose handler.
 */
export default function PlaybookModal({ item, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [pdfReady, setPdfReady] = useState(null); // null = checking, true/false
  const [formOpen, setFormOpen] = useState(false); // mobile: reveal form after tapping Download

  useEffect(() => {
    if (!item) return;
    setForm({ name: '', email: '', phone: '' });
    setDone(false);
    setErr(false);
    setFormOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [item, onClose]);

  // Verify the PDF actually exists (a missing file falls back to index.html on
  // the SPA, which would otherwise render the website inside the preview frame).
  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    setPdfReady(null);
    if (!item.pdf) {
      setPdfReady(false);
      return undefined;
    }
    fetch(item.pdf, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || '';
        if (!cancelled) setPdfReady(res.ok && type.includes('pdf'));
      })
      .catch(() => { if (!cancelled) setPdfReady(false); });
    return () => { cancelled = true; };
  }, [item]);

  if (!item) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Already verified earlier this session → skip the form + OTP entirely.
  const verified = getVerifiedLead();

  const recordAndDownload = (lead) => {
    downloadFile(item.pdf, `${item.title}.pdf`);
    submitLead({ ...lead, resource: item.title, pdf: item.pdf, source: item.source || 'playbook-download', cta_label: `Download: ${item.title}`, section: item.section || item.badge || item.cat || 'Playbook' }).catch(() => {});
  };

  // Verify the email via OTP, then download the PDF on-site. The lead is
  // recorded in the background so the download always happens once verified.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(false);
    setSubmitting(true);
    try {
      const otp = await verifyEmailOtp(form.email.trim());
      // Remember the verified visitor so later PDFs skip verification.
      saveVerifiedLead({ name: form.name, email: form.email.trim(), phone: form.phone });
      recordAndDownload({ ...form, ...otp });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setSubmitting(false);
    }
  };

  // One-click download for an already-verified visitor (no form, no OTP).
  const directDownload = () => {
    setSubmitting(true);
    recordAndDownload({
      name: verified?.name || '',
      email: verified?.email || '',
      phone: verified?.phone || '',
      otp_token: verified?.otp_token,
      otp_channel: verified?.otp_channel || 'email',
      otp_identifier: verified?.otp_identifier || verified?.email || '',
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="pb-modal-overlay" onClick={onClose}>
      <div className="pb-modal pb-modal--split" role="dialog" aria-modal="true" aria-label={item.title} onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>

        {/* ── LEFT: preview ── */}
        <div className="pb-modal-left">
          {pdfReady === true ? (
            <div className="pb-modal-frame"><PdfView url={item.pdf} /></div>
          ) : (
            <div className="pb-modal-placeholder">
              <span className="pb-ph-icon" aria-hidden="true">📄</span>
              <p className="pb-ph-title">{pdfReady === null ? 'Loading preview…' : 'Preview coming soon'}</p>
              <p className="pb-ph-sub">{pdfReady === null ? 'Checking the document.' : 'The PDF for this resource will be available here shortly.'}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT: form + download ── */}
        <div className="pb-modal-right">
          {done ? (
            <div className="pb-modal-done">
              <div className="pb-done-icon">✓</div>
              <h3 className="pb-modal-title">Your download has started</h3>
              <p className="pb-modal-sub"><b>{item.title}</b> is downloading. Didn’t start?{' '}
                <button type="button" onClick={() => downloadFile(item.pdf, `${item.title}.pdf`)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--specialist, #5a3fd6)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Download Again</button>.
              </p>
            </div>
          ) : verified ? (
            <>
              <span className="pb-modal-badge">{item.badge}</span>
              <h3 className="pb-modal-title">{item.title}</h3>
              <p className="pb-modal-sub">{item.desc}</p>
              <button type="button" className="pb-modal-btn" onClick={directDownload} disabled={submitting || !item.pdf}>
                {submitting ? 'Downloading…' : item.pdf ? 'Download' : 'Coming soon'}
              </button>
              <p className="lf-fineprint">You're already verified — your download starts instantly.</p>
            </>
          ) : (
            <>
              <span className="pb-modal-badge">{item.badge}</span>
              <h3 className="pb-modal-title">{item.title}</h3>
              <p className="pb-modal-sub">{item.desc}</p>
              {!formOpen && (
                <button type="button" className="pb-modal-btn pb-gate-btn" onClick={() => setFormOpen(true)} disabled={!item.pdf}>
                  {item.pdf ? 'Get the PDF' : 'Coming soon'}
                </button>
              )}
              <form className={`pb-form${formOpen ? ' open' : ''}`} onSubmit={handleSubmit}>
                <div className="lf-field full">
                  <label>Full name</label>
                  <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" autoComplete="name" />
                </div>
                <div className="lf-field full">
                  <label>Email</label>
                  <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@domain.com" autoComplete="email" />
                </div>
                <div className="lf-field full">
                  <label>Phone</label>
                  <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
                <button className="pb-modal-btn" type="submit" disabled={submitting || !item.pdf}>{submitting ? 'Verifying…' : item.pdf ? 'Verify & Download' : 'Coming soon'}</button>
                {err && <p className="lf-fineprint" style={{ color: '#c0392b' }}>Couldn’t verify — please check your connection and try again.</p>}
                <p className="lf-fineprint">Verify your email and the PDF downloads here. We may send occasional Menler updates — unsubscribe anytime.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
