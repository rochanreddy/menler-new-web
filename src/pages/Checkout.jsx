import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import { submitLead } from '../services/leadService';

// Optional add-ons the user can add to the order. Priced for show; everything is
// FREE during the launch (total ₹0). When Razorpay is wired in, charge `total`.
const CATALOG = [
  { id: 'prompts', title: '100+ AI Prompts Playbook', desc: 'Tested prompts across business, engineering & beginner tracks.', price: 499 },
  { id: 'agents', title: 'AI Agent Build Templates', desc: 'Ready-to-use agent blueprints, MCP recipes & workflows.', price: 799 },
  { id: 'domain', title: 'Domain Track Playbooks (×9)', desc: 'One deep-dive playbook per Generalist domain track.', price: 999 },
  { id: 'tools', title: 'GenAI Toolstack Starter Kit', desc: 'Setup guides & cheat-sheets for the full Menler toolstack.', price: 399 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reg = state || {};
  const workshopTitle = reg.workshop || 'Menler Workshop';

  const [cart, setCart] = useState(() => new Set());
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [err, setErr] = useState(false);

  const toggle = (id) => setCart((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const addedItems = CATALOG.filter((i) => cart.has(i.id));
  const total = 0; // launch offer — everything free (Razorpay later for paid items)

  const pay = async () => {
    setErr(false); setPlacing(true);
    try {
      // Record the order as a lead (shows in admin + CRM). Razorpay goes here later.
      await submitLead({
        name: reg.name, email: reg.email, phone: reg.phone,
        source: 'checkout-order',
        campaign: reg.campaign,
        workshop: workshopTitle,
        items: ['Workshop: ' + workshopTitle, ...addedItems.map((i) => i.title)].join(' | '),
        amount: total,
      });
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
      <div className="co">
        <header className="co-top">
          <button className="co-back" onClick={() => navigate('/')}>← Home</button>
          <MenlerWordmark size={24} theme="light" />
          <span className="co-top-spacer" />
        </header>
        <div className="co-confirm">
          <div className="co-confirm-tick">✓</div>
          <h1 className="co-confirm-h">Order confirmed!</h1>
          <p className="co-confirm-p">
            You're all set for <b>{workshopTitle}</b>. We've sent the joining details
            {reg.email ? <> to <b>{reg.email}</b></> : null}
            {addedItems.length ? <>, along with your {addedItems.length} playbook{addedItems.length > 1 ? 's' : ''}.</> : '.'}
          </p>
          <button className="co-pay co-pay--light" onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="co">
      <Seo title="Checkout | Menler" noindex />
      <header className="co-top">
        <button className="co-back" onClick={() => navigate(-1)}>← Back</button>
        <MenlerWordmark size={24} theme="light" />
        <span className="co-top-spacer" />
      </header>

      <div className="co-grid">
        {/* ── LEFT: order + add-ons ── */}
        <div className="co-main">
          <h1 className="co-h1">Checkout</h1>

          <div className="co-reg">
            <div>
              <p className="co-reg-label">Your registration</p>
              <p className="co-reg-title">{workshopTitle}</p>
              {(reg.name || reg.email) && <p className="co-reg-sub">{[reg.name, reg.email].filter(Boolean).join(' · ')}</p>}
            </div>
            <span className="co-free">Free</span>
          </div>

          <h2 className="co-h2">Add playbooks &amp; catalogs</h2>
          <p className="co-h2-sub">Boost your workshop — add resource packs to your order. Free during launch.</p>
          <div className="co-catalog">
            {CATALOG.map((i) => {
              const added = cart.has(i.id);
              return (
                <div key={i.id} className={`co-item${added ? ' co-item--added' : ''}`}>
                  <div className="co-item-info">
                    <p className="co-item-title">{i.title}</p>
                    <p className="co-item-desc">{i.desc}</p>
                  </div>
                  <div className="co-item-right">
                    <span className="co-item-price"><s>₹{i.price}</s> <b>Free</b></span>
                    <button type="button" className={`co-add${added ? ' co-add--on' : ''}`} onClick={() => toggle(i.id)}>
                      {added ? '✓ Added' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: sticky summary ── */}
        <aside className="co-aside">
          <div className="co-summary">
            <p className="co-summary-h">Order summary</p>
            <div className="co-line"><span>{workshopTitle}</span><span>Free</span></div>
            {addedItems.map((i) => (
              <div key={i.id} className="co-line"><span>{i.title}</span><span>Free</span></div>
            ))}
            <div className="co-divider" />
            <div className="co-total"><span>Total</span><span>₹{total}</span></div>
            <p className="co-launch">🎉 Launch offer — everything free</p>
            <button className="co-pay" onClick={pay} disabled={placing}>
              {placing ? 'Processing…' : `Pay now · ₹${total}`}
            </button>
            {err && <p className="co-err">Something went wrong — please try again.</p>}
            <p className="co-secure">🔒 Secure checkout · card payments coming soon</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
