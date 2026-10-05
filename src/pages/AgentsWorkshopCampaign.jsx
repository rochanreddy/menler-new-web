import PaidCampaignLayout from './campaign/PaidCampaignLayout';
import CampaignClosed from './campaign/CampaignClosed';
import { FDE_CONTENT } from '../data/campaigns/fde';
import { campaignIsClosed } from '../lib/campaignStatus';

// /campaign/build-like-an-ai-fde — the 199 AI Forward Deployed Engineering
// masterclass. The design is shared; only the content is this campaign's.
// Once the session date in fde.js has passed, the page closes itself.
export default function AgentsWorkshopCampaign() {
  if (campaignIsClosed(FDE_CONTENT.SLUG, FDE_CONTENT.SESSION)) {
    return <CampaignClosed title={FDE_CONTENT.TITLE} />;
  }
  return <PaidCampaignLayout content={FDE_CONTENT} />;
}
