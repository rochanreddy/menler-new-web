import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import { submitLead, deliverResources } from '../services/leadService';
import { CHECKOUT_CATALOG } from '../data/resourceCatalog';

import { MENLER_WHATSAPP_URL } from '../data/communityLinks';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reg = state || {};
  const workshopTitle = reg.workshop || 'Menler Masterclass';

  const catalog = CHECKOUT_CATALOG;
  const goTo = (p) => { navigate(p); window.scrollTo(0, 0); };

  const [cart, setCart] = useState(() => new Set());
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [err, setErr] = useState(false);

  const toggle = (id) => setCart((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const addedItems = catalog.filter((i) => cart.has(i.id));
  const total = 0; // launch offer — everything free

  const pay = async () => {
    setErr(false); setPlacing(true);
    try {
      await submitLead({
        name: reg.name, email: reg.email, phone: reg.phone,
        source: 'checkout-order',
        cta_label: `Checkout: ${workshopTitle}`,
        section: `Checkout · ${workshopTitle}`,
        campaign: reg.campaign,
        workshop: workshopTitle,
        items: ['Workshop: ' + workshopTitle, ...addedItems.map((i) => i.title)].join(' | '),
        amount: total,
      });
      if (addedItems.length && reg.email) {
        await deliverResources({
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          source: 'checkout-resources',
          section: `Checkout · ${workshopTitle}`,
          resources: addedItems.map((i) => ({ title: i.title, pdf: i.pdf, resource: i.title })),
        });
      }
      setPlaced(true);
      window.scrollTo(0, 0);
    } catch {
      setErr(true);
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="cox cox--confirm">
        <div className="cox-confirm">
          <div className="cox-confirm-badge">
            <div className="cox-confirm-tick">✓</div>
          </div>

          <h1 className="cox-confirm-h">You're registered!</h1>
          <p className="cox-confirm-p">
            You're all set for <b>{workshopTitle}</b>. We've sent the joining details
            {reg.email ? <> to <b>{reg.email}</b></> : null}
            {addedItems.length ? <>, along with your {addedItems.length} resource{addedItems.length > 1 ? 's' : ''} attached to your email.</> : '.'}
          </p>

          <MenlerCommunitySection
            className="menler-community--confirm"
            whatsappUrl={reg.whatsappUrl || MENLER_WHATSAPP_URL}
            communityText={reg.whatsappText || reg.communityText}
          />

          {/* Explore more programs (moved here from the campaign page) */}
          <section className="cox-explore">
            <h2 className="lp2-h2">Explore <em>More</em></h2>
            <div className="lp2-explore">
              <div className="cluster-card cluster-card--kick">
                <p className="cluster-num">For beginners</p>
                <p className="cluster-name">Menler Gen AI Kickstarter</p>
                <p className="cluster-sets">AI fundamentals + your first portfolio in 14 days.</p>
                <button className="cluster-btn" onClick={() => goTo('/kickstarter')}>Explore Kickstarter</button>
              </div>
              <div className="cluster-card cluster-card--gen">
                <p className="cluster-num">Students &amp; professionals</p>
                <p className="cluster-name">Menler Claude AI Generalist Fellowship</p>
                <p className="cluster-sets">Apply AI across business — 10-week fellowship.</p>
                <button className="cluster-btn" onClick={() => goTo('/generalist')}>Explore Fellowship</button>
              </div>
            </div>
          </section>

          {/* AI Aptitude Test promo (moved here from the campaign page) */}
          <div className="lp2-apt-card cox-apt-card">
            <p className="lp2-apt-eyebrow">Not sure where to start?</p>
            <p className="lp2-apt-title">Check out our AI Aptitude Test</p>
            <p className="lp2-apt-desc">Find your AI fluency in 15 minutes for free.<br />15 questions, One AI pathway and no sign-up</p>
            <button className="lp2-apt-btn" onClick={() => goTo('/aptitude')}>Take the Aptitude Test →</button>
          </div>

          <button type="button" className="cox-confirm-back" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cox">
      <Seo title="Checkout | Menler" noindex />

      {/* ── LEFT: blue — contact (read-only) + add-ons ── */}
      <div className="cox-form">
        <div className="cox-form-inner">
          <button className="cox-back-btn cox-back-btn--top" onClick={() => navigate(-1)}>Back</button>

          <h3 className="cox-h3" style={{ marginTop: 0 }}>Contact information</h3>
          <div className="cox-info">
            <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
            <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
            <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
          </div>

          <div className="cox-addons-head">
            <div className="cox-addons-head-text">
              <h3 className="cox-h3">Add resources</h3>
              <p className="cox-addons-sub">Optional — handpicked resources, free during launch.</p>
            </div>
            <div className={`cox-cart${cart.size ? ' cox-cart--active' : ''}`} aria-label={`${cart.size} item${cart.size === 1 ? '' : 's'} added`} title={`${cart.size} added`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cox-cart-count">{cart.size}</span>
            </div>
          </div>
          <div className="cox-addons">
            {catalog.map((i) => {
              const added = cart.has(i.id);
              return (
                <button type="button" key={i.id} className={`cox-addon${added ? ' cox-addon--on' : ''}`} onClick={() => toggle(i.id)}>
                  <span className="cox-addon-check">{added ? '✓' : '+'}</span>
                  <span className="cox-addon-info">
                    <span className="cox-addon-t">{i.title}</span>
                    <span className="cox-addon-d">{i.desc}</span>
                  </span>
                  <span className="cox-addon-right">
                    <span className="cox-addon-price"><s>₹{i.price}</s> Free</span>
                    <span className="cox-addon-action">{added ? '✓ Added' : '+ Add'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: white — order summary + complete ── */}
      <div className="cox-order">
        <div className="cox-order-inner">
          <div className="cox-brand"><MenlerWordmark size={26} theme="light" /></div>
          <p className="cox-eyebrow">Register for</p>
          <p className="cox-name">{workshopTitle}</p>
          <p className="cox-price">₹{total}<span> · free seat</span></p>

          <div className="cox-items">
            <div className="cox-row">
              <div><p className="cox-row-t">{workshopTitle}</p><p className="cox-row-d">Live masterclass seat</p></div>
              <span className="cox-row-amt">Free</span>
            </div>
            {addedItems.map((i) => (
              <div className="cox-row" key={i.id}>
                <div><p className="cox-row-t">{i.title}</p><p className="cox-row-d">Resource pack</p></div>
                <span className="cox-row-amt"><s>₹{i.price}</s> Free</span>
              </div>
            ))}
          </div>

          <div className="cox-sub-line"><span>Subtotal</span><span>₹{total}</span></div>
          <div className="cox-sub-line cox-sub-line--muted"><span>Taxes</span><span>₹0</span></div>
          <div className="cox-total"><span>Total</span><span>₹{total}</span></div>

          <button className="cox-complete" onClick={pay} disabled={placing}>
            {placing ? 'Processing…' : 'Complete Registration'}
          </button>
          {err && <p className="cox-err">Something went wrong — please try again.</p>}
        </div>
      </div>
    </div>
  );
}
