import PaidCampaignLayout from './campaign/PaidCampaignLayout';
import { FDE_CONTENT } from '../data/campaigns/fde';

// /campaign/build-like-an-ai-fde — the 199 AI Forward Deployed Engineering
// masterclass. The design is shared; only the content is this campaign's.
export default function AgentsWorkshopCampaign() {
  return <PaidCampaignLayout content={FDE_CONTENT} />;
}
