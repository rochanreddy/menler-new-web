import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import Seo from '../../components/common/Seo';
import { MENLER_WHATSAPP_URL } from '../../data/communityLinks';

/* What a campaign URL shows once its masterclass is over.
 *
 * Old campaign links stay in circulation long after the session — in ads,
 * WhatsApp forwards, bookmarks — and the page behind them kept taking
 * registrations for a class that had already run. This replaces the form with
 * a notice and a way on to /events. A notice rather than a silent redirect, so
 * someone who followed a link for a specific masterclass is told why they are
 * not looking at it.
 */
export default function CampaignClosed({ title }) {
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Registrations closed | Menler Masterclass" noindex />
      <section className="notfound">
        <div className="notfound-rings" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="notfound-inner cc-card">
          <span className="cc-pill"><span className="cc-pill-dot" aria-hidden="true" />Registrations closed</span>
          <h1 className="cc-h1">This masterclass is <em>no longer open</em></h1>

          {/* The masterclass they came for, named as its own row rather than
              buried mid-sentence. */}
          {title && (
            <div className="cc-event">
              <span className="cc-event-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
              </span>
              <span className="cc-event-text">
                <span className="cc-event-label">Masterclass</span>
                <span className="cc-event-title">{title}</span>
              </span>
              <span className="cc-event-status">Closed</span>
            </div>
          )}

          <p className="cc-sub">
            See what&rsquo;s coming up next and get the free resources from past sessions on our events page.
          </p>

          <div className="cc-actions">
            <button className="cc-btn cc-btn--primary" onClick={() => navigate('/events')}>
              Check all events<span aria-hidden="true">→</span>
            </button>
            <a className="cc-btn cc-btn--wa" href={MENLER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.5.4.1.2.1.9-.1 1.5Z" /></svg>
              Get notified on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
