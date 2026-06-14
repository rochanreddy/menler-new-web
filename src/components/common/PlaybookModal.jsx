import { useEffect, useState } from 'react';
import { submitLead } from '../../services/leadService';

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
  const [pdfReady, setPdfReady] = useState(null); // null = checking, true/false
  const [formOpen, setFormOpen] = useState(false); // mobile: reveal form after tapping Download

  useEffect(() => {
    if (!item) return;
    setForm({ name: '', email: '', phone: '' });
    setDone(false);
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

  const triggerDownload = () => {
    if (!item.pdf) return;
    const a = document.createElement('a');
    a.href = item.pdf;
    a.download = item.pdf.split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try { await submitLead({ ...form, resource: item.title, source: 'playbook-download' }); } catch {}
    setSubmitting(false);
    setDone(true);
    triggerDownload();
  };

  return (
    <div className="pb-modal-overlay" onClick={onClose}>
      <div className="pb-modal pb-modal--split" role="dialog" aria-modal="true" aria-label={item.title} onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>

        {/* ── LEFT: preview ── */}
        <div className="pb-modal-left">
          {pdfReady === true ? (
            <iframe className="pb-modal-frame" src={`${item.pdf}#toolbar=0&navpanes=0&view=FitH`} title={`${item.title} preview`} />
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
              <h3 className="pb-modal-title">Your download is ready</h3>
              <p className="pb-modal-sub">If it didn’t start automatically, use the button below.</p>
              <button className="pb-modal-btn" onClick={triggerDownload}>Download again</button>
            </div>
          ) : (
            <>
              <span className="pb-modal-badge">{item.badge}</span>
              <h3 className="pb-modal-title">{item.title}</h3>
              <p className="pb-modal-sub">{item.desc}</p>
              {!formOpen && (
                <button type="button" className="pb-modal-btn pb-gate-btn" onClick={() => setFormOpen(true)} disabled={!item.pdf}>
                  {item.pdf ? 'Download PDF' : 'Coming soon'}
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
                <button className="pb-modal-btn" type="submit" disabled={submitting || !item.pdf}>{submitting ? 'Submitting…' : item.pdf ? 'Download PDF' : 'Coming soon'}</button>
                <p className="lf-fineprint">We’ll email you the resource and occasional Menler updates. Unsubscribe anytime.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
