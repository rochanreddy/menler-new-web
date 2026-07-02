import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import AddToCalendar from '../components/common/AddToCalendar';
import { parseEventDateTime } from '../lib/calendar';
import { submitLead, deliverResources, completeCheckout } from '../services/leadService';
import { CHECKOUT_CATALOG } from '../data/resourceCatalog';

import { MENLER_WHATSAPP_URL } from '../data/communityLinks';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reg = state || {};
  const workshopTitle = reg.workshop || 'Menler Masterclass';

  const catalog = CHECKOUT_CATALOG;

  const [cart, setCart] = useState(() => new Set());
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [err, setErr] = useState(false);

  // Guard: /checkout is only valid after registering on a campaign, which passes
  // the verified registrant in router state. A direct URL visit has no state, so
  // send them home instead of exposing an empty checkout that skips OTP.
  useEffect(() => {
    if (!reg.email) navigate('/', { replace: true });
  }, [reg.email, navigate]);
  if (!reg.email) return null;

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
      const order = {
        section: `Checkout · ${workshopTitle}`,
        cta_label: `Checkout: ${workshopTitle}`,
        items: ['Workshop: ' + workshopTitle, ...addedItems.map((i) => i.title)].join(' | '),
        amount: total,
      };
      if (reg.leadId) {
        // Update the same registration lead → one lead per registrant, flagged done.
        await completeCheckout(reg.leadId, order);
      } else {
        // Fallback (no registration id in state): create a checked-out lead,
        // carrying the background so it's still captured.
        await submitLead({
          name: reg.name, email: reg.email, phone: reg.phone,
          background: reg.background,
          source: 'checkout-order', campaign: reg.campaign, workshop: workshopTitle,
          checkout_completed: true,
          ...order,
        });
      }
      if (addedItems.length && reg.email) {
        await deliverResources({
          leadId: reg.leadId, // attach to the SAME registration lead (no duplicate row)
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          source: 'checkout-resources', // only used if there's no leadId (standalone batch)
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
            <div className="cox-confirm-tick"><span className="cox-confirm-check">✓</span></div>
          </div>

          <h1 className="cox-confirm-h">You're registered!</h1>
          <p className="cox-confirm-p">
            You're all set for <b>{workshopTitle}</b>. We've sent the joining details
            {reg.email ? <> to <b>{reg.email}</b></> : null}
            {addedItems.length ? <>, along with your {addedItems.length} resource{addedItems.length > 1 ? 's' : ''} attached to your email.</> : '.'}
          </p>

          {(() => {
            // Prefer the explicit Sanity Event start/end; otherwise derive it
            // from the same date/time shown on the campaign page, so the calendar
            // always matches the banner.
            const ev = reg.eventStart
              ? { start: reg.eventStart, end: reg.eventEnd }
              : parseEventDateTime(reg.eventDate, reg.eventTime);
            if (!ev || !ev.start) return null;
            return (
              <AddToCalendar
                className="cox-confirm-cal"
                event={{
                  title: workshopTitle,
                  start: ev.start,
                  end: ev.end,
                  details: `You're registered for ${workshopTitle}. Joining details were sent to your email${reg.eventDate ? `.\n\nWhen: ${reg.eventDate}${reg.eventTime ? ` · ${reg.eventTime}` : ''}` : '.'}`,
                  location: 'Live online',
                }}
              />
            );
          })()}

          <MenlerCommunitySection
            className="menler-community--confirm"
            whatsappUrl={reg.whatsappUrl || MENLER_WHATSAPP_URL}
            communityText={reg.whatsappText || reg.communityText}
          />

          <button type="button" className="cox-confirm-back" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cox">
      <Seo title="Checkout | Menler" noindex />

      {/* Mobile-only topbar: back button + wordmark, pinned to the top. */}
      <div className="cox-mtop">
        <button className="cox-back-mobile" onClick={() => navigate(-1)}>← Back</button>
        <MenlerWordmark size={22} theme="dark" />
      </div>

      {/* ── LEFT: blue — contact (read-only) + add-ons ── */}
      <div className="cox-form">
        <div className="cox-form-inner">
          <button className="cox-back-btn cox-back-btn--top" onClick={() => navigate(-1)}>Back</button>

          <div className="cox-contact">
          <h3 className="cox-h3" style={{ marginTop: 0 }}>Contact information</h3>
          <div className="cox-info">
            <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
            <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
            <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
          </div>
          </div>

          <div className="cox-resources">
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
      </div>

      {/* ── RIGHT: white — order summary + complete ── */}
      <div className="cox-order">
        <div className="cox-order-inner">
          <div className="cox-brand"><MenlerWordmark size={26} theme="light" /></div>
          <div className="cox-order-head">
            <div className="cox-order-head-main">
              <p className="cox-eyebrow">Register for</p>
              <p className="cox-name">{workshopTitle}</p>
              <p className="cox-price">₹{total}<span> · free seat</span></p>
            </div>
            {/* Mobile-only: contact details tucked into the header (top-right). */}
            <div className="cox-order-contact">
              <p className="cox-oc-label">Contact</p>
              <div className="cox-info">
                <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
                <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
                <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
              </div>
            </div>
          </div>

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
