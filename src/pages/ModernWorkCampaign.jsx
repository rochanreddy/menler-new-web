import PaidCampaignLayout from './campaign/PaidCampaignLayout';
import { MODERN_WORK_CONTENT } from '../data/campaigns/modern-work';

// /campaign/ai-for-modern-work-and-careers — the 199 masterclass. Same design
// as the other paid campaign; only the content differs.
export default function ModernWorkCampaign() {
  return <PaidCampaignLayout content={MODERN_WORK_CONTENT} />;
}
