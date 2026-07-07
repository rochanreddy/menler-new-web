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
