import { useState, useEffect } from 'react';
import { PROGRAM_PRICES, formatINR } from '../../data/pricing';
import { createEnrolOrder, getPaymentStatus } from '../../services/paymentService';
import { runCashfreePayment, isOrderPaid } from '../../lib/cashfree';
import PaymentRecovery from './PaymentRecovery';
import BackgroundField from '../forms/BackgroundField';

/**
 * Enrolment payment modal. Collects name/email/phone, creates a Cashfree order
 * on our server (which sets the price — the client never sends the amount),
 * opens the Cashfree checkout, then confirms the result with our server.
 *
 * Props: program ('kickstarter' | 'generalist'), onClose().
 */
export default function PayModal({ program, onClose }) {
  const price = PROGRAM_PRICES[program];
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', background: '', track: '', college: '', graduation_year: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  // A payment that did not complete: { outcome, orderId } for PaymentRecovery.
  const [recover, setRecover] = useState(null);
  const [checked, setChecked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  // BackgroundField asks a student their college and a graduate their year.
  // Those ride in their own fields, not in the background string, so spread
  // the reported object — it always carries both keys, which is what clears
  // the stale one when someone switches group.
  const setDetail = (d) => setForm((f) => ({ ...f, ...d }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!price) return null;

  // `method: 'upi'` is the "Pay with UPI instead" retry: a UPI-only checkout.
  const pay = async (e, method) => {
    e?.preventDefault();
    setErr(''); setRecover(null); setChecked(false); setBusy(true);
    try {
      const order = await createEnrolOrder({ program, ...form, method });
      const r = await runCashfreePayment(order, getPaymentStatus, () => setConfirming(true));
      if (r.outcome === 'paid') setDone(true);
      else setRecover(r);
    } catch (e2) {
      setErr(e2.message || 'Could not process the payment.');
    } finally {
      setBusy(false); setConfirming(false);
    }
  };

  const checkAgain = async () => {
    if (!recover) return;
    setBusy(true);
    const paid = await isOrderPaid(recover.orderId, getPaymentStatus);
    setBusy(false); setChecked(true);
    if (paid) { setRecover(null); setDone(true); }
  };

  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <div className="pay-modal" role="dialog" aria-modal="true" aria-label={`Enrol — ${price.label}`} onClick={(e) => e.stopPropagation()}>
        <button className="pay-modal-close" onClick={onClose} aria-label="Close">×</button>

        {done ? (
          <div className="pay-modal-done">
            <div className="pay-done-icon">✓</div>
            <h3 className="pay-modal-title">Payment successful</h3>
            <p className="pay-modal-sub">
              You're enrolled in <b>{price.label}</b>. We've emailed your next steps
              {form.email ? <> to <b>{form.email}</b></> : null}.
            </p>
            <button className="pay-modal-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="pay-modal-eyebrow">Enrol · {price.label}</p>
            <h3 className="pay-modal-title">{formatINR(price.amount)}</h3>
            <p className="pay-modal-sub">Enter your details to continue to secure payment.</p>
            <form onSubmit={pay}>
              <input className="pay-input" required placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
              <input className="pay-input" required type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
              <input className="pay-input" required type="tel" placeholder="Phone (10 digits)" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
              <input className="pay-input" required type="text" placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" />
              <BackgroundField className="pay-input" label="Your background" onChange={(v) => set('background', v)} onDetail={setDetail} />
              {/* Domain track is only asked on the Generalist enrolment. */}
              {String(program).startsWith('generalist') && (
                <select className="pay-input" required value={form.track} onChange={(e) => set('track', e.target.value)}>
                  <option value="" disabled>Domain track</option>
                  <option>Analyst</option>
                  <option>Engineering</option>
                  <option>Finance</option>
                  <option>Founder&apos;s Office</option>
                  <option>Human Resources (HR)</option>
                  <option>Marketing &amp; Sales</option>
                  <option>Product Management</option>
                  <option>Program Management</option>
                  <option>Strategy &amp; Consulting</option>
                  <option>Not sure yet</option>
                </select>
              )}
              {err && <p className="pay-modal-err">{err}</p>}
              {recover ? (
                <PaymentRecovery
                  outcome={recover.outcome}
                  orderId={recover.orderId}
                  busy={busy}
                  checked={checked}
                  onRetry={() => pay(null)}
                  onUpi={() => pay(null, 'upi')}
                  onCheck={checkAgain}
                />
              ) : (
              <button className="pay-modal-btn" type="submit" disabled={busy}>
                {confirming ? 'Confirming your payment…' : busy ? 'Processing…' : `Pay ${formatINR(price.amount)}`}
              </button>
              )}
              <p className="pay-modal-fine">Secured by Cashfree · UPI · Cards · Netbanking</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
