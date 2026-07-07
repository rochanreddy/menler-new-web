import { useState } from 'react';
import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import PayModal from '../components/common/PayModal';
import { formatINR, PROGRAM_PRICES } from '../data/pricing';

/**
 * Internal, unlisted page to verify the LIVE Cashfree payment gateway with a
 * real ₹5 charge. Not in the nav or sitemap; noindex. Reuses the production
 * pay modal + backend order flow (server sets the ₹5 amount from the "test"
 * program). Refund the ₹5 from the Cashfree dashboard after testing.
 */
export default function PayTest() {
  const [pay, setPay] = useState(false);
  const price = PROGRAM_PRICES.test;

  return (
    <>
      <Seo title="Payment Gateway Test | Menler" noindex />
      <section style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 20px', background: 'var(--parchment)' }}>
        <div style={{ maxWidth: 460, width: '100%', background: 'var(--white)', borderRadius: 18, padding: '36px 30px', boxShadow: '0 30px 80px -40px rgba(38,33,92,0.5)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--lavender)', margin: '0 0 8px' }}>Internal · Live gateway test</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--ink)', margin: '0 0 10px' }}>Payment Gateway Test</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 22px' }}>
            A <b>real {formatINR(price.amount)}</b> charge through the production Cashfree gateway to confirm end-to-end payment, webhook, and settlement.
          </p>
          <button
            className="pay-modal-btn"
            style={{ maxWidth: 260, margin: '0 auto' }}
            onClick={() => setPay(true)}
          >
            Pay {formatINR(price.amount)}
          </button>
        </div>
      </section>
      <Footer />
      {pay && <PayModal program="test" onClose={() => setPay(false)} />}
    </>
  );
}
