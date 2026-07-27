import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import AddToCalendar from '../components/common/AddToCalendar';
import { parseEventDateTime } from '../lib/calendar';
import { submitLead, deliverResources, completeCheckout } from '../services/leadService';
import { CHECKOUT_CATALOG, resourcePackFor } from '../data/resourceCatalog';
import { PROGRAM_PRICES, formatINR } from '../data/pricing';
import { createEnrolOrder, getPaymentStatus } from '../services/paymentService';
import { openCashfreeCheckout } from '../lib/cashfree';

import { MENLER_WHATSAPP_URL } from '../data/communityLinks';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reg = state || {};
  const workshopTitle = reg.workshop || 'Menler Masterclass';

  const catalog = CHECKOUT_CATALOG;
  // Some campaigns sell all their resources as a single paid PACK instead of the
  // free individual add-ons. When a pack exists, registration is free and the
  // pack is an optional paid upsell (Cashfree only opens once it's selected).
  const pack = resourcePackFor(reg.campaign);

  const [cart, setCart] = useState(() => new Set()); // add-on mode: per-item selection
  const [packOn, setPackOn] = useState(false);       // pack mode: is the pack selected
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [err, setErr] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false); // "Leave checkout?" guard

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
  // Resources being taken: the whole pack (if selected) in pack mode, otherwise
  // the individually-ticked add-ons.
  const addedItems = pack ? (packOn ? pack.items : []) : catalog.filter((i) => cart.has(i.id));
  // Registration seat fee (0 = free). Campaigns with a resource pack have no
  // seat fee — the only charge is the optional pack.
  const campaignPrice = reg.campaign ? PROGRAM_PRICES[reg.campaign] : null;
  const workshopFee = campaignPrice?.amount ?? 0;
  const packFee = pack && packOn ? pack.price : 0;
  const total = workshopFee + packFee;
  const isPaid = total > 0;

  const finishRegistration = async () => {
    const order = {
      section: `Checkout · ${workshopTitle}`,
      cta_label: `Checkout: ${workshopTitle}`,
      items: ['Workshop: ' + workshopTitle, ...addedItems.map((i) => i.title)].join(' | '),
      amount: total,
    };
    if (reg.leadId) {
      await completeCheckout(reg.leadId, order);
    } else {
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
        leadId: reg.leadId,
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
  };

  const pay = async () => {
    setErr(''); setPlacing(true);
    try {
      if (isPaid) {
        const phoneDigits = String(reg.phone || '').replace(/\D/g, '').slice(-10);
        const order = await createEnrolOrder({
          program: reg.campaign,
          leadId: reg.leadId,
          name: reg.name,
          email: reg.email,
          phone: phoneDigits,
          city: reg.city,
          background: reg.background,
        });
        const result = await openCashfreeCheckout(order.payment_session_id, order.mode);
        if (result && result.error) {
          setErr(result.error.message || 'Payment was cancelled.');
          return;
        }
        const status = await getPaymentStatus(order.order_id);
        if (status.status !== 'PAID') {
          setErr('Payment not completed. If you were charged, it will confirm shortly — check your email.');
          return;
        }
      }
      await finishRegistration();
    } catch (e) {
      setErr(e?.message || 'Something went wrong — please try again.');
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

          {/* Follows the campaign's "Show community section" toggle in Sanity. */}
          {reg.showCommunity && (
            <MenlerCommunitySection
              className="menler-community--confirm"
              whatsappUrl={reg.whatsappUrl || MENLER_WHATSAPP_URL}
              communityText={reg.whatsappText || reg.communityText}
            />
          )}

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
        <button className="cox-back-mobile" onClick={() => setConfirmLeave(true)}>← Back</button>
        <MenlerWordmark size={22} theme="dark" />
      </div>

      {/* ── LEFT: blue — contact (read-only) + add-ons ── */}
      <div className="cox-form">
        <div className="cox-form-inner">
          <button className="cox-back-btn cox-back-btn--top" onClick={() => setConfirmLeave(true)}>Back</button>

          <div className="cox-contact">
          <h3 className="cox-h3" style={{ marginTop: 0 }}>Contact information</h3>
          <div className="cox-info">
            <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
            <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
            <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
          </div>
          </div>

          {pack ? (
          <div className="cox-resources">
          <div className="cox-addons-head">
            <div className="cox-addons-head-text">
              <h3 className="cox-h3">Add the resource pack</h3>
              <p className="cox-addons-sub">Optional — get every playbook in one bundle, emailed to you.</p>
            </div>
          </div>
          <button
            type="button"
            className={`cox-pack${packOn ? ' cox-pack--on' : ''}`}
            onClick={() => setPackOn((v) => !v)}
            aria-pressed={packOn}
          >
            <span className="cox-pack-check">{packOn ? '✓' : '+'}</span>
            <span className="cox-pack-info">
              <span className="cox-pack-t">{pack.title}</span>
              <span className="cox-pack-d">{pack.desc}</span>
              <span className="cox-pack-list">
                {pack.items.map((i) => <span key={i.id} className="cox-pack-chip">{i.title}</span>)}
              </span>
            </span>
            <span className="cox-pack-right">
              <span className="cox-pack-price">₹{pack.price}</span>
              <span className="cox-pack-action">{packOn ? '✓ Added' : '+ Add pack'}</span>
            </span>
          </button>
          </div>
          ) : (
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
          )}
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
              <p className="cox-price">{total > 0 ? formatINR(total) : <>Free<span> · free seat</span></>}</p>
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
              <span className="cox-row-amt">{workshopFee > 0 ? formatINR(workshopFee) : 'Free'}</span>
            </div>
            {pack ? (
              packOn && (
                <div className="cox-row">
                  <div><p className="cox-row-t">{pack.title}</p><p className="cox-row-d">{pack.items.length} playbooks · emailed to you</p></div>
                  <span className="cox-row-amt">{formatINR(pack.price)}</span>
                </div>
              )
            ) : (
              addedItems.map((i) => (
                <div className="cox-row" key={i.id}>
                  <div><p className="cox-row-t">{i.title}</p><p className="cox-row-d">Resource pack</p></div>
                  <span className="cox-row-amt"><s>₹{i.price}</s> Free</span>
                </div>
              ))
            )}
          </div>

          <div className="cox-sub-line"><span>Subtotal</span><span>{formatINR(total)}</span></div>
          <div className="cox-sub-line cox-sub-line--muted"><span>Taxes</span><span>₹0</span></div>
          <div className="cox-total"><span>Total</span><span>{formatINR(total)}</span></div>

          <button className="cox-complete" onClick={pay} disabled={placing}>
            {placing ? 'Processing…' : isPaid ? `Pay ${formatINR(total)} & Register` : 'Complete Registration'}
          </button>
          {err && <p className="cox-err">{err}</p>}
          {isPaid && <p className="cox-pay-fine">Secured by Cashfree · UPI · Cards · Netbanking</p>}
        </div>
      </div>

      {/* Guard against accidentally leaving mid-registration. */}
      {confirmLeave && (
        <div className="cox-leave-overlay" onClick={() => setConfirmLeave(false)}>
          <div className="cox-leave" role="dialog" aria-modal="true" aria-label="Leave checkout?" onClick={(e) => e.stopPropagation()}>
            <h3 className="cox-leave-h">Leave checkout?</h3>
            <p className="cox-leave-p">You're almost done — your registration isn't complete yet. Are you sure you want to go back?</p>
            <div className="cox-leave-actions">
              <button type="button" className="cox-leave-stay" onClick={() => setConfirmLeave(false)}>Stay on checkout</button>
              <button type="button" className="cox-leave-go" onClick={() => { setConfirmLeave(false); navigate(-1); }}>Yes, go back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
