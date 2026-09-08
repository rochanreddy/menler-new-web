import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader';
import { useContentState } from '../lib/useContent';
import KickstarterLanding from './KickstarterLanding';

const SanityPaidCampaign = lazy(() => import('./campaign/SanityPaidCampaign'));

/* Which design a campaign gets, decided by its own document.
 *
 * Only the switch is read here — one small query — so the classic path is
 * exactly what it always was, and the paid path loads its own chunk and its
 * own fuller query. A campaign that says nothing gets the classic page, which
 * is what every existing campaign says.
 */
const DESIGN_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{ design }`;

export default function CampaignBySlug() {
  const { slug } = useParams();
  const { data, loading } = useContentState(DESIGN_QUERY, null, { slug });

  // Hold the frame rather than paint the classic page and swap it — a visitor
  // seeing one design flash into another reads as a broken page.
  if (loading && !data) return <PageLoader />;

  if (data?.design === 'paid') {
    return (
      <Suspense fallback={<PageLoader />}>
        <SanityPaidCampaign />
      </Suspense>
    );
  }
  return <KickstarterLanding />;
}
