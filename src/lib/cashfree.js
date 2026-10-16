// Cashfree JS SDK v3 loader + checkout launcher.
// Docs: https://www.cashfree.com/docs/payments/online/web/checkout
// The SDK is loaded on demand (like the OTP widget) so it doesn't bloat the
// initial bundle. Mode (sandbox/production) comes from VITE_CASHFREE_MODE.

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
const MODE = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';

let loadPromise;
function loadSdk() {
  if (typeof window !== 'undefined' && window.Cashfree) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load the payment service. Please try again.'));
    document.body.appendChild(s);
  });
  return loadPromise;
}

// Open the Cashfree checkout for a payment session. Modal mode keeps the user
// on-page; the returned promise resolves when the flow closes (result may carry
// `error` or `paymentDetails`). Confirm the real status via the server after.
export async function openCashfreeCheckout(paymentSessionId, mode) {
  await loadSdk();
  const cashfree = window.Cashfree({ mode: mode || MODE });
  return cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Open the checkout for `order`, then find out what really happened.
 *
 * The modal's own result is not the truth: UPI payments often close the
 * window while the bank is still confirming, and a "cancelled" close can
 * follow money that did leave the account. So this always asks our server
 * (which asks Cashfree). After a normal close it keeps asking for up to
 * 45 seconds, which covers most UPI confirmations.
 *
 * Resolves { outcome, orderId } where outcome is:
 *   'paid'      — confirmed; go ahead
 *   'cancelled' — they closed the window; nothing was charged
 *   'failed'    — the bank or card declined it; nothing was charged
 *   'pending'   — not confirmed yet; it may still land, so offer a re-check
 *                 before a second payment
 */
export async function runCashfreePayment(order, getStatus, onConfirming) {
  const result = await openCashfreeCheckout(order.payment_session_id, order.mode);
  // The window has closed; say so while we wait for the bank's answer.
  if (onConfirming) onConfirming();
  const closedWithError = Boolean(result && result.error);
  const deadline = Date.now() + (closedWithError ? 0 : 45000);
  for (;;) {
    try {
      const s = await getStatus(order.order_id);
      if (s && s.status === 'PAID') return { outcome: 'paid', orderId: order.order_id };
    } catch { /* a failed check is not a failed payment — keep asking */ }
    if (Date.now() >= deadline) break;
    await wait(3000);
  }
  if (closedWithError) {
    const msg = String(result.error.message || '');
    return { outcome: /cancel|close|drop|abort/i.test(msg) ? 'cancelled' : 'failed', orderId: order.order_id };
  }
  return { outcome: 'pending', orderId: order.order_id };
}

/** "Check again" for a payment that was still pending: true once it is PAID. */
export async function isOrderPaid(orderId, getStatus) {
  try {
    const s = await getStatus(orderId);
    return Boolean(s && s.status === 'PAID');
  } catch {
    return false;
  }
}
