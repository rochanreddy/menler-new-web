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

// Menler community links — set the real Discord / WhatsApp / Facebook URLs here.
const COMMUNITY_LINKS = { discord: '#', whatsapp: '#', facebook: '#' };

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
        cta_label: `Checkout: ${workshopTitle}`,
        section: `Checkout · ${workshopTitle}`,
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
          <h1 className="cox-confirm-h">Thanks for registering!</h1>
          <p className="cox-confirm-p">
            You're all set for <b>{workshopTitle}</b>. We've sent the joining details
            {reg.email ? <> to <b>{reg.email}</b></> : null}
            {addedItems.length ? <>, with your {addedItems.length} playbook{addedItems.length > 1 ? 's' : ''}.</> : '.'}
          </p>
          <div className="cox-confirm-actions">
            <div className="mini-lead lp2-wa-card" style={{ marginTop: 16, width: '100%', maxWidth: '440px', textAlign: 'left', border: '1px solid rgba(38,33,92,0.12)' }}>
              <div className="mini-lead-inner" style={{ padding: '4px 0', gap: '16px' }}>
                <div className="mini-lead-copy">
                  <h3 style={{ whiteSpace: 'normal', fontSize: '18px', marginBottom: '4px' }}>Join our Menler<br /><em>community.</em></h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{reg.whatsappText || reg.communityText || 'Updates, resources & support across all our channels.'}</p>
                </div>
                <a className="lp2-wa-join" href={reg.whatsappUrl || COMMUNITY_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  Join on WhatsApp
                </a>
              </div>
            </div>
            <button className="cox-complete cox-complete--inline" onClick={() => navigate('/')}>Back to home</button>
          </div>
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
          <button className="cox-back-btn cox-back-btn--top" onClick={() => navigate(-1)}>← Back</button>

          <h3 className="cox-h3" style={{ marginTop: 0 }}>Contact information</h3>
          <div className="cox-info">
            <div className="cox-info-row"><span>Name</span><b>{reg.name || '—'}</b></div>
            <div className="cox-info-row"><span>Email</span><b>{reg.email || '—'}</b></div>
            <div className="cox-info-row"><span>Phone</span><b>{reg.phone || '—'}</b></div>
          </div>

          <div className="cox-addons-head">
            <div className="cox-addons-head-text">
              <h3 className="cox-h3">Add playbooks &amp; catalogs</h3>
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
          <div className="cox-total"><span>Total</span><span>₹{total}</span></div>

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
