import { useLocation } from 'react-router-dom';
import { ThankYou } from '../components/campaign/CampaignApply';
import '../styles/campaign-landing.css';

/**
 * /campaign/ai-claude-generalist/thank-you
 *
 * The confirmation used to render in place, swapped in over the campaign page
 * without the URL moving. That works for a reader and not at all for ad
 * tracking: a Google or Meta conversion fires on a destination URL, and there
 * wasn't one — every applicant stayed on /campaign/ai-claude-generalist, so an
 * application and a bounce looked identical to the ad platform.
 *
 * Hence a route of its own. Nothing is tracked here; the point is only that
 * this URL exists and is reached exactly once per completed application, which
 * is what a conversion action needs to point at.
 */
export default function GeneralistCampaignThanks() {
  const { state } = useLocation();
  // Reached directly — a refresh, a bookmark, or the ad platform's own crawler —
  // there is no applicant to greet. The page still has to render: a conversion
  // URL that white-screens for anyone arriving cold is worse than a generic one.
  const applicant = (state && state.applicant) || {};

  return (
    <ThankYou
      applicant={applicant}
      programTitle="Claude AI Generalist Fellowship"
      followUp="walk you through the six weeks"
    />
  );
}
