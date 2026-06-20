import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import { submitLead } from '../services/leadService';
import { useContent } from '../lib/useContent';

// Optional add-ons. Priced for show; FREE during launch (total ₹0). When a
// payment gateway (Razorpay) is added, charge `total` and flip these to paid.
// These are the fallback; the client edits the live list in Sanity (Playbooks / Catalogs).
const CATALOG = [
  { id: 'prompts', title: '100+ AI Prompts Playbook', desc: 'Tested prompts across business, engineering & beginner tracks.', price: 499 },
  { id: 'agents', title: 'AI Agent Build Templates', desc: 'Ready-to-use agent blueprints, MCP recipes & workflows.', price: 799 },
  { id: 'domain', title: 'Domain Track Playbooks (×9)', desc: 'One deep-dive playbook per Generalist domain track.', price: 999 },
  { id: 'tools', title: 'GenAI Toolstack Starter Kit', desc: 'Setup guides & cheat-sheets for the full Menler toolstack.', price: 399 },
];

// Active playbooks/catalogs from Sanity, ordered; falls back to CATALOG above.
const CATALOG_QUERY = `*[_type=="playbook" && active != false]|order(orderRank){"id":_id, title, desc, price}`;

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reg = state || {};
  const workshopTitle = reg.workshop || 'Menler Workshop';

  const catalog = useContent(CATALOG_QUERY, CATALOG);

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
      <div className="cox cox--confirm">
        <div className="cox-confirm">
          <div className="cox-confirm-tick">✓</div>
          <h1 className="cox-confirm-h">Order confirmed!</h1>
          <p className="cox-confirm-p">
            You're all set for <b>{workshopTitle}</b>. We've sent the joining details
            {reg.email ? <> to <b>{reg.email}</b></> : null}
            {addedItems.length ? <>, with your {addedItems.length} playbook{addedItems.length > 1 ? 's' : ''}.</> : '.'}
          </p>
          <button className="cox-complete cox-complete--inline" onClick={() => navigate('/')}>Back to home</button>
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
          <button className="cox-back" onClick={() => navigate(-1)} aria-label="Back">←</button>

          <h3 className="cox-h3" style={{ marginTop: 0 }}>Contact information</h3>
          <div className="cox-info">
            <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
            <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
            <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
          </div>

          <h3 className="cox-h3">Add playbooks &amp; catalogs</h3>
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
                  <span className="cox-addon-price"><s>₹{i.price}</s> Free</span>
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
              <div><p className="cox-row-t">{workshopTitle}</p><p className="cox-row-d">Live workshop seat</p></div>
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
          <div className="cox-total"><span>Total due today</span><span>₹{total}</span></div>

          <button className="cox-complete" onClick={pay} disabled={placing}>
            {placing ? 'Processing…' : 'Complete registration · ₹0'}
          </button>
          {err && <p className="cox-err">Something went wrong — please try again.</p>}
          <p className="cox-note">🔒 No payment needed — your seat is free during launch. Card payments coming soon.</p>
        </div>
      </div>
    </div>
  );
}
