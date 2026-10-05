import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader';
import { useContentState } from '../lib/useContent';
import { CANCELLED_CAMPAIGNS, campaignIsClosed } from '../lib/campaignStatus';
import KickstarterLanding from './KickstarterLanding';
import CampaignClosed from './campaign/CampaignClosed';

const SanityPaidCampaign = lazy(() => import('./campaign/SanityPaidCampaign'));

/* Which design a campaign gets, decided by its own document.
 *
 * Only the switch is read here — one small query — so the classic path is
 * exactly what it always was, and the paid path loads its own chunk and its
 * own fuller query. A campaign that says nothing gets the classic page, which
 * is what every existing campaign says.
 *
 * The same query carries the session's date, because a campaign whose session
 * has already run gets neither design: it shows the closed notice instead of a
 * registration form (see CampaignClosed).
 */
const DESIGN_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{
  design, title, bannerLine1, bannerLine2, date, time
}`;

export default function CampaignBySlug() {
  const { slug } = useParams();
  const { data, loading } = useContentState(DESIGN_QUERY, null, { slug });

  // A called-off campaign is closed whatever its document says, so it needn't
  // wait for one.
  if (CANCELLED_CAMPAIGNS.has(slug)) return <CampaignClosed title={data?.title} />;

  // Hold the frame rather than paint the classic page and swap it — a visitor
  // seeing one design flash into another reads as a broken page.
  if (loading && !data) return <PageLoader />;

  if (campaignIsClosed(slug, data)) {
    const title = [data?.bannerLine1, data?.bannerLine2].filter(Boolean).join(' ') || data?.title;
    return <CampaignClosed title={title} />;
  }

  if (data?.design === 'paid') {
    return (
      <Suspense fallback={<PageLoader />}>
        <SanityPaidCampaign />
      </Suspense>
    );
  }
  return <KickstarterLanding />;
}
