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
        <div className="notfound-inner notfound-card">
          <p className="notfound-tag">✦ Registrations closed</p>
          <h1 className="notfound-h1">This masterclass is <em>no longer open.</em></h1>
          <p className="notfound-sub">
            {title ? <>Registrations for <b>{title}</b> have closed. </> : 'Registrations for this masterclass have closed. '}
            Head to our events page to see what&rsquo;s coming up next and grab the free resources from past sessions.
          </p>
          <div className="notfound-actions">
            <button className="btn-primary" onClick={() => navigate('/events')}>See all events</button>
            <a className="btn-primary notfound-wa" href={MENLER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Get notified on WhatsApp</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
