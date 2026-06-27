import { useEffect, useState } from 'react';
import { requestResource } from '../../services/leadService';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(false);
    setSubmitting(true);
    try {
      await requestResource({ ...form, resource: item.title, pdf: item.pdf, source: 'playbook-download', cta_label: `Download: ${item.title}`, section: item.badge || item.cat || 'Playbook' });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setSubmitting(false);
    }
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
              <h3 className="pb-modal-title">Check your inbox</h3>
              <p className="pb-modal-sub">We’ve emailed <b>{item.title}</b> as a PDF attachment to <b>{form.email}</b>. Check your inbox (and spam folder).</p>
            </div>
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
                <button className="pb-modal-btn" type="submit" disabled={submitting || !item.pdf}>{submitting ? 'Sending…' : item.pdf ? 'Email me the PDF' : 'Coming soon'}</button>
                {err && <p className="lf-fineprint" style={{ color: '#c0392b' }}>Couldn’t send — please check your connection and try again.</p>}
                <p className="lf-fineprint">We’ll email the PDF to you directly and occasional Menler updates. Unsubscribe anytime.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
