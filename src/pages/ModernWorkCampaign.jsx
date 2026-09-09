import { useMemo } from 'react';
import PaidCampaignLayout from './campaign/PaidCampaignLayout';
import { MODERN_WORK_CONTENT } from '../data/campaigns/modern-work';
import { useContentState } from '../lib/useContent';
import { sessionFrom } from '../data/campaigns/session';

// /campaign/ai-for-modern-work-and-careers — the 199 masterclass. Same design
// as the other paid campaign; only the content differs.
//
// The copy is a module rather than a Sanity document because this page carries
// more than the schema holds — capsules, stats, the agenda timings, the FAQ
// list. The DATE is the exception: a masterclass gets moved, and moving it
// should not need a deploy. So the schedule alone is read from the campaign's
// Sanity document, and everything else stays here.
//
// The module's own date is the fallback, not a placeholder — keep it current,
// because it is what renders when Sanity is unreachable or unconfigured, and
// what a first-time visitor sees for the moment before the fetch lands.
const SCHEDULE_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{ date, time }`;

export default function ModernWorkCampaign() {
  const { data } = useContentState(SCHEDULE_QUERY, null, { slug: MODERN_WORK_CONTENT.SLUG });

  const content = useMemo(() => {
    const session = sessionFrom(data, MODERN_WORK_CONTENT.SESSION);
    // Same object back when Sanity said nothing, so the layout is not handed a
    // new content object on every render for no reason.
    return session === MODERN_WORK_CONTENT.SESSION
      ? MODERN_WORK_CONTENT
      : { ...MODERN_WORK_CONTENT, SESSION: session };
  }, [data]);

  return <PaidCampaignLayout content={content} />;
}
