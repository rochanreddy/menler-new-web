import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';

/* Edit a Paid users row, and record later instalments on it instead of
   adding a new row per payment (server: PATCH /admin/paid-users/:id and
   /admin/paid-users/:id/instalments).

   Amounts follow the panel's rule: what Cashfree confirmed is never
   overwritten by a typed number. So a verified row's amount, date and
   payment id are read-only here; only an unverified row can have them
   corrected. Further payments go in as instalments, each one checked
   against Cashfree by its Order ID or recorded unverified with a
   transaction ID. */

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
// YYYY-MM-DD in the browser's own day (en-CA formats that way), not UTC's —
// otherwise anything after midnight IST shows as yesterday.
const day = (d) => (d ? new Date(d).toLocaleDateString('en-CA') : '');
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

/** The row's payments, with the row itself as payment 1 until instalments exist. */
function instalmentsOf(r) {
  const list = r.extra?.instalments;
  if (Array.isArray(list) && list.length) return list;
  return [{
    cycle: Number(r.extra?.payment_cycle) || 1,
    amount: r.amount,
    paid_at: r.paid_at || r.createdAt,
    verified: !r.extra?.manual || Boolean(r.extra?.verified),
    cf_payment_id: r.extra?.cf_payment_id,
    txn_id: r.extra?.txn_id,
  }];
}

export default function EditPaymentModal({ row: initial, courseOptions = [], onClose, onSaved }) {
  const [row, setRow] = useState(initial);
  const locked = !row.extra?.manual || Boolean(row.extra?.verified);
  const list = instalmentsOf(row);
  const multi = Array.isArray(row.extra?.instalments) && row.extra.instalments.length > 1;

  const [f, setF] = useState({
    name: row.customer_name || '',
    email: row.customer_email || '',
    phone: row.customer_phone || '',
    program: row.program || '',
    batch: row.extra?.batch || '',
    actual_price: row.extra?.actual_price ?? '',
    sold_price: row.extra?.sold_price ?? '',
    note: row.extra?.note || '',
    amount: String(row.amount ?? ''),
    paid_at: day(row.paid_at || row.createdAt),
    txn_id: row.extra?.txn_id || '',
  });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  // The next instalment.
  const [adding, setAdding] = useState(false);
  const [inst, setInst] = useState({ reference: '', unverified: false, amount: '', txn_id: '', paid_at: day(new Date()), note: '' });
  const setI = (k, v) => setInst((x) => ({ ...x, [k]: v }));

  const sold = Number(f.sold_price) || Number(row.extra?.sold_price) || 0;
  const paid = list.reduce((t, i) => t + Number(i.amount || 0), 0);
  const nextCycle = Math.max(...list.map((i) => Number(i.cycle) || 0)) + 1;

  const saveDetails = async () => {
    setBusy(true); setErr(''); setMsg('');
    try {
      const body = {
        name: f.name, email: f.email, phone: f.phone, program: f.program, batch: f.batch, note: f.note,
        actual_price: f.actual_price === '' ? '' : Number(f.actual_price),
        sold_price: f.sold_price === '' ? '' : Number(f.sold_price),
        ...(!locked && !multi ? { amount: Number(f.amount), paid_at: f.paid_at, txn_id: f.txn_id } : {}),
      };
      const res = await adminApi.editPaidUser(row._id, body);
      if (res.row) setRow(res.row);
      setMsg(res.changed?.length ? `Saved: ${res.changed.join(', ')}.` : 'Nothing changed.');
      onSaved?.();
    } catch (e) {
      setErr(e.message || 'Could not save the changes.');
    } finally {
      setBusy(false);
    }
  };

  const addInstalment = async () => {
    setBusy(true); setErr(''); setMsg('');
    try {
      const body = inst.unverified
        ? { unverified: true, amount: Number(inst.amount), txn_id: inst.txn_id.trim(), paid_at: inst.paid_at, note: inst.note }
        : { reference: inst.reference.trim(), paid_at: inst.paid_at, note: inst.note };
      const res = await adminApi.addInstalment(row._id, body);
      setRow(res.row);
      setAdding(false);
      setInst({ reference: '', unverified: false, amount: '', txn_id: '', paid_at: day(new Date()), note: '' });
      const last = res.row.extra.instalments[res.row.extra.instalments.length - 1];
      setMsg(`Payment ${last.cycle} of ${inr(last.amount)} added. Total paid is now ${inr(res.row.amount)}.`);
      onSaved?.();
    } catch (e) {
      setErr(e.message || 'Could not add the instalment.');
    } finally {
      setBusy(false);
    }
  };

  const removeLast = async (i) => {
    if (!window.confirm(`Remove payment ${i.cycle} of ${inr(i.amount)} from this row?`)) return;
    setBusy(true); setErr(''); setMsg('');
    try {
      const res = await adminApi.removeInstalment(row._id, i.cycle);
      setRow(res.row);
      setMsg(`Payment ${i.cycle} removed. Total paid is now ${inr(res.row.amount)}.`);
      onSaved?.();
    } catch (e) {
      setErr(e.message || 'Could not remove the instalment.');
    } finally {
      setBusy(false);
    }
  };

  const canAddInstalment = inst.unverified
    ? Number(inst.amount) > 0 && inst.txn_id.trim()
    : inst.reference.trim().length > 3;
  const refunded = Boolean(row.extra?.refund?.refund_id) && row.extra.refund.status !== 'FAILED';
  const knownCourse = courseOptions.some((c) => c.key === f.program);

  return (
    <div className="admin-modal-backdrop" onClick={() => !busy && onClose()} role="presentation" data-lenis-prevent>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-pay-title">
        <div className="admin-modal-head">
          <div>
            <h2 id="edit-pay-title">Edit payment</h2>
            <p>{row.customer_name || row.customer_email || 'This buyer'} · {inr(row.amount)} paid · {row.program}</p>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close" disabled={busy}>×</button>
        </div>

        <div className="admin-modal-body admin-addpay">
          {/* ── Payments on this row ── */}
          <p className="admin-card-title">Payments</p>
          <div className="admin-inst">
            {list.map((i, idx) => (
              <div className="admin-inst-row" key={`${i.cycle}-${idx}`}>
                <span className="admin-inst-cycle">Payment {i.cycle}</span>
                <span className="admin-inst-amt">{inr(i.amount)}</span>
                <span className="admin-muted">{fmt(i.paid_at)}</span>
                <span className={`admin-badge ${i.verified ? 'admin-badge--ok' : 'admin-badge--warn'}`}>{i.verified ? 'Verified' : 'Unverified'}</span>
                <span className="admin-muted admin-mono-input">{i.cf_payment_id || i.txn_id || ''}</span>
                {multi && idx === list.length - 1 && idx > 0 && (
                  <button type="button" className="admin-linkbtn" disabled={busy} onClick={() => removeLast(i)}>Remove</button>
                )}
              </div>
            ))}
            <div className="admin-inst-total">
              <span>Total paid <b>{inr(paid)}</b></span>
              {sold > 0 && (
                <span className={paid >= sold ? 'admin-inst-done' : 'admin-inst-due'}>
                  {paid >= sold ? 'Fully paid' : `${inr(sold - paid)} still due of ${inr(sold)}`}
                </span>
              )}
            </div>
          </div>

          {refunded ? (
            <p className="admin-addpay-help">This payment has a refund on it, so no more instalments can be added.</p>
          ) : !adding ? (
            <button type="button" className="admin-btn" onClick={() => { setAdding(true); setErr(''); setMsg(''); }} disabled={busy}>
              + Add payment {nextCycle}
            </button>
          ) : (
            <div className="admin-inst-add">
              <p className="admin-card-title" style={{ marginBottom: 6 }}>Payment {nextCycle}</p>
              {!inst.unverified ? (
                <>
                  <label className="admin-field"><span>Cashfree Order ID</span>
                    <input className="admin-search admin-mono-input" placeholder="Paste the Order ID of this payment" autoFocus
                      value={inst.reference} onChange={(e) => setI('reference', e.target.value)} />
                    <em className="admin-field-hint">
                      Cashfree dashboard → Payments → open the payment → copy the Order ID. The amount comes from Cashfree.{' '}
                      <button type="button" className="admin-linkbtn" onClick={() => setI('unverified', true)}>No Order ID? Record it unverified</button>
                    </em>
                  </label>
                </>
              ) : (
                <>
                  <div className="admin-grid2">
                    <label className="admin-field"><span>Amount (₹) *</span>
                      <input className="admin-search" type="number" min="1" autoFocus value={inst.amount} onChange={(e) => setI('amount', e.target.value)} />
                    </label>
                    <label className="admin-field"><span>Transaction ID *</span>
                      <input className="admin-search admin-mono-input" placeholder="e.g. 5114772211" value={inst.txn_id} onChange={(e) => setI('txn_id', e.target.value)} />
                    </label>
                  </div>
                  <em className="admin-field-hint">
                    Shown as <b>Unverified</b> so everyone can see the amount was typed in.{' '}
                    <button type="button" className="admin-linkbtn" onClick={() => setI('unverified', false)}>Verify with an Order ID instead</button>
                  </em>
                </>
              )}
              <div className="admin-grid2">
                <label className="admin-field"><span>Paid on</span>
                  <input className="admin-search" type="date" value={inst.paid_at} onChange={(e) => setI('paid_at', e.target.value)} />
                </label>
                <label className="admin-field"><span>Note</span>
                  <input className="admin-search" maxLength={200} placeholder="optional" value={inst.note} onChange={(e) => setI('note', e.target.value)} />
                </label>
              </div>
              <div className="admin-modal-foot" style={{ marginTop: 6 }}>
                <button type="button" className="admin-btn" onClick={() => setAdding(false)} disabled={busy}>Cancel</button>
                <button type="button" className="admin-btn admin-btn--primary" onClick={addInstalment} disabled={busy || !canAddInstalment}>
                  {busy ? 'Saving…' : `Add payment ${nextCycle}`}
                </button>
              </div>
            </div>
          )}

          {/* ── Details ── */}
          <p className="admin-card-title" style={{ marginTop: 22 }}>Details</p>
          <div className="admin-grid2">
            <label className="admin-field"><span>Full name *</span>
              <input className="admin-search" value={f.name} onChange={(e) => set('name', e.target.value)} />
            </label>
            <label className="admin-field"><span>Email</span>
              <input className="admin-search" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
            </label>
            <label className="admin-field"><span>Phone</span>
              <input className="admin-search" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
            </label>
            <label className="admin-field"><span>Batch month</span>
              <input className="admin-search" type="month" value={f.batch} onChange={(e) => set('batch', e.target.value)} />
            </label>
          </div>
          <label className="admin-field"><span>Course / what they paid for *</span>
            <select className="admin-search" value={f.program} onChange={(e) => set('program', e.target.value)}>
              {!knownCourse && f.program && <option value={f.program}>{f.program}</option>}
              {courseOptions.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </label>
          <div className="admin-grid2">
            <label className="admin-field"><span>Actual price (₹)</span>
              <input className="admin-search" type="number" min="1" placeholder="Course list price" value={f.actual_price} onChange={(e) => set('actual_price', e.target.value)} />
            </label>
            <label className="admin-field"><span>Sold price (₹)</span>
              <input className="admin-search" type="number" min="1" placeholder="Total they agreed to pay" value={f.sold_price} onChange={(e) => set('sold_price', e.target.value)} />
            </label>
          </div>

          {locked || multi ? (
            <p className="admin-addpay-help">
              {locked
                ? 'Amount, date and transaction ID came from Cashfree, so they can’t be edited here. To record more money, add a payment above.'
                : 'This row has several payments, so its amount is their total. Change it by adding or removing a payment above.'}
            </p>
          ) : (
            <div className="admin-grid3">
              <label className="admin-field"><span>Amount (₹)</span>
                <input className="admin-search" type="number" min="1" value={f.amount} onChange={(e) => set('amount', e.target.value)} />
              </label>
              <label className="admin-field"><span>Paid on</span>
                <input className="admin-search" type="date" value={f.paid_at} onChange={(e) => set('paid_at', e.target.value)} />
              </label>
              <label className="admin-field"><span>Transaction ID</span>
                <input className="admin-search admin-mono-input" value={f.txn_id} onChange={(e) => set('txn_id', e.target.value)} />
              </label>
            </div>
          )}

          <label className="admin-field"><span>Note</span>
            <input className="admin-search" maxLength={300} value={f.note} onChange={(e) => set('note', e.target.value)} />
          </label>

          {err && <div className="admin-note admin-note--bad">{err}</div>}
          {msg && !err && <div className="admin-note admin-note--ok">{msg}</div>}

          {Array.isArray(row.extra?.edit_log) && row.extra.edit_log.length > 0 && (
            <details className="admin-editlog">
              <summary>Change history ({row.extra.edit_log.length})</summary>
              <ul>
                {[...row.extra.edit_log].reverse().slice(0, 20).map((l, i) => (
                  <li key={i}><span className="admin-muted">{fmt(l.at)}</span> {l.what}</li>
                ))}
              </ul>
            </details>
          )}

          <div className="admin-modal-foot">
            <button className="admin-btn" type="button" onClick={onClose} disabled={busy}>Close</button>
            <button className="admin-btn admin-btn--primary" type="button" onClick={saveDetails} disabled={busy || !f.name.trim() || !f.program}>
              {busy ? 'Saving…' : 'Save details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
