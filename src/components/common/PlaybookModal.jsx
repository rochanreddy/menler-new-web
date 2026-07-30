import { useEffect, useState } from 'react';
import { submitLead, deliverLibraryResource } from '../../services/leadService';
import { verifyEmailOtp } from '../../lib/amplifeedOtp';
import { getVerifiedLead, saveVerifiedLead } from '../../lib/verifiedSession';
import { downloadFile } from '../../lib/download';
import { createEnrolOrder, getPaymentStatus } from '../../services/paymentService';
import { openCashfreeCheckout } from '../../lib/cashfree';
import PdfView from './PdfView';

/**
 * Resource popup — split layout:
 *   left  → in-modal PDF preview (or a locked teaser for paid items)
 *   right → lead-capture form with the download button underneath
 *
 * Two modes, chosen by whether the item carries a `price`:
 *   • FREE  → email-OTP verify, then the PDF downloads.
 *   • PAID  → ₹<price> via Cashfree; the preview is locked and the PDF only
 *             downloads after the payment is confirmed PAID. (Used by the Library.)
 * Pass the clicked item (or null) and an onClose handler.
 */
export default function PlaybookModal({ item, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false); // false | true | string
  const [pdfReady, setPdfReady] = useState(null); // null = checking, true/false
  const [formOpen, setFormOpen] = useState(false); // mobile: reveal form after tapping Download

  const isPaid = Boolean(item?.price);

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

  // Verify the PDF exists — but never preview a PAID item (that would give the
  // paid PDF away for free), so only HEAD-check free ones.
  useEffect(() => {
    if (!item || isPaid) return;
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
  }, [item, isPaid]);

  if (!item) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Already verified earlier this session → skip the form + OTP entirely.
  // Never applies to paid items — each paid download is its own ₹price payment.
  const verified = !isPaid && getVerifiedLead();

  const recordAndDownload = (lead) => {
    downloadFile(item.pdf, `${item.title}.pdf`);
    submitLead({ ...lead, resource: item.title, pdf: item.pdf, source: item.source || 'playbook-download', cta_label: `Download: ${item.title}`, section: item.section || item.badge || item.cat || 'Playbook' }).catch(() => {});
  };

  // FREE flow: verify the email via OTP, then download the PDF on-site.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(false);
    setSubmitting(true);
    try {
      const otp = await verifyEmailOtp(form.email.trim());
      saveVerifiedLead({ name: form.name, email: form.email.trim(), phone: form.phone });
      recordAndDownload({ ...form, ...otp });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setSubmitting(false);
    }
  };

  // PAID flow: charge ₹price via Cashfree, then download only once confirmed PAID.
  const handlePaidSubmit = async (e) => {
    e.preventDefault();
    setErr(false);
    const phoneDigits = String(form.phone || '').replace(/\D/g, '').slice(-10);
    if (!form.name.trim() || !form.email.trim() || phoneDigits.length !== 10) {
      setErr('Enter your name, email and a 10-digit phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createEnrolOrder({ program: 'library', name: form.name.trim(), email: form.email.trim(), phone: phoneDigits });
      const result = await openCashfreeCheckout(order.payment_session_id, order.mode);
      if (result && result.error) {
        setErr(result.error.message || 'Payment was cancelled.');
        return;
      }
      const status = await getPaymentStatus(order.order_id);
      if (status.status !== 'PAID') {
        setErr('Payment not completed. If you were charged, it will confirm shortly — check your email or contact us.');
        return;
      }
      // Email the PDF to the buyer (per-resource template) — the primary delivery.
      deliverLibraryResource({ orderId: order.order_id, pdf: item.pdf, name: form.name.trim(), email: form.email.trim() }).catch(() => {});
      // And download on-site for instant access.
      downloadFile(item.pdf, `${item.title}.pdf`);
      setDone(true);
    } catch (e2) {
      setErr(e2?.message || 'Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // One-click download for an already-verified visitor (free items only).
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

  const errText = typeof err === 'string' ? err : "Couldn’t verify — please check your connection and try again.";

  return (
    <div className="pb-modal-overlay" onClick={onClose}>
      <div className="pb-modal pb-modal--split" role="dialog" aria-modal="true" aria-label={item.title} onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>

        {/* ── LEFT: preview (free) or locked teaser (paid) ── */}
        <div className="pb-modal-left">
          {isPaid ? (
            <div className="pb-modal-frame pb-cover-frame">
              <PdfView url={item.pdf} coverOnly />
              <span className="pb-cover-lock" aria-hidden="true">🔒 Cover preview — full playbook unlocks after payment</span>
            </div>
          ) : pdfReady === true ? (
            <div className="pb-modal-frame"><PdfView url={item.pdf} /></div>
          ) : (
            <div className="pb-modal-placeholder">
              <span className="pb-ph-icon" aria-hidden="true">📄</span>
              <p className="pb-ph-title">{pdfReady === null ? 'Loading preview…' : 'Preview coming soon'}</p>
              <p className="pb-ph-sub">{pdfReady === null ? 'Checking the document.' : 'The PDF for this resource will be available here shortly.'}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT: form + download / pay ── */}
        <div className="pb-modal-right">
          {done ? (
            <div className="pb-modal-done">
              <div className="pb-done-icon">✓</div>
              <h3 className="pb-modal-title">{isPaid ? 'Payment successful' : 'Your download has started'}</h3>
              <p className="pb-modal-sub"><b>{item.title}</b> {isPaid ? 'is downloading — and we’ve emailed it to you too.' : 'has been downloaded.'} Didn’t start?{' '}
                <button type="button" onClick={() => downloadFile(item.pdf, `${item.title}.pdf`)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--specialist, #5a3fd6)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Download Again</button>.
              </p>
            </div>
          ) : isPaid ? (
            <>
              <span className="pb-modal-badge">{item.badge || 'Menler Library'}</span>
              <h3 className="pb-modal-title">{item.title}</h3>
              <p className="pb-modal-sub">{item.desc}</p>
              <p className="pb-modal-price">₹{item.price} <span>one-time</span></p>
              <form className="pb-form open" onSubmit={handlePaidSubmit}>
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
                <button className="pb-modal-btn" type="submit" disabled={submitting || !item.pdf}>{submitting ? 'Processing…' : item.pdf ? `Pay ₹${item.price} & Download` : 'Coming soon'}</button>
                {err && <p className="lf-fineprint" style={{ color: '#c0392b' }}>{errText}</p>}
                <p className="lf-fineprint">Secured by Cashfree · UPI · Cards · Netbanking. The moment your payment is confirmed, the PDF is emailed to you — and downloads here too.</p>
              </form>
            </>
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
                {err && <p className="lf-fineprint" style={{ color: '#c0392b' }}>{errText}</p>}
                <p className="lf-fineprint">Verify your email and the PDF downloads here. We may send occasional Menler updates — unsubscribe anytime.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
