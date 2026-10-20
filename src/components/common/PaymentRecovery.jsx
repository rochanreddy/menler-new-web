/* What a buyer sees when a payment does not complete, instead of a dead end.
   One panel for every checkout (campaign checkout, fellowship enrolment,
   library purchases), driven by runCashfreePayment's outcome:

     cancelled / failed — nothing was charged: try again, or pay by UPI
     pending            — not confirmed yet: check again before paying twice

   The order id is shown so a buyer who writes in can be found at once. */

const COPY = {
  cancelled: {
    title: 'Payment not completed',
    body: 'The payment window was closed, so nothing was charged. Your details are saved. Pick up where you left off.',
  },
  failed: {
    title: 'Payment didn’t go through',
    body: 'Your bank or card declined it, and nothing was charged. Try again, or pay with UPI. It usually works when a card doesn’t.',
  },
  pending: {
    title: 'We’re still confirming your payment',
    body: 'If money left your account, it usually confirms within a few minutes. Check again before paying a second time.',
  },
};

export default function PaymentRecovery({ outcome, orderId, busy, checked, onRetry, onUpi, onCheck }) {
  const copy = COPY[outcome] || COPY.failed;
  const pending = outcome === 'pending';
  return (
    <div className={`pay-recover pay-recover--${pending ? 'pending' : 'retry'}`} role="alert">
      <p className="pay-recover-title">{copy.title}</p>
      <p className="pay-recover-body">{copy.body}</p>
      {pending && checked && !busy && (
        <p className="pay-recover-body pay-recover-note">Not confirmed yet. Give it a minute and check again.</p>
      )}
      <div className="pay-recover-actions">
        {pending ? (
          <>
            <button type="button" className="pay-recover-btn" onClick={onCheck} disabled={busy}>
              {busy ? 'Checking…' : 'Check again'}
            </button>
            <button type="button" className="pay-recover-btn pay-recover-btn--ghost" onClick={onRetry} disabled={busy}>
              It failed, pay again
            </button>
          </>
        ) : (
          <>
            <button type="button" className="pay-recover-btn" onClick={onRetry} disabled={busy}>
              {busy ? 'Opening…' : 'Try again'}
            </button>
            <button type="button" className="pay-recover-btn pay-recover-btn--ghost" onClick={onUpi} disabled={busy}>
              Pay with UPI instead
            </button>
          </>
        )}
      </div>
      <p className="pay-recover-help">
        Need help? Email <a href={`mailto:support@menler.in?subject=${encodeURIComponent(`Payment help · ${orderId || ''}`)}`}>support@menler.in</a>
        {orderId ? <> with order <b>{orderId}</b></> : null}.
      </p>
    </div>
  );
}
