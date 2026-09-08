import { useParams } from 'react-router-dom';
import PageLoader from '../../components/common/PageLoader';
import { useContentState } from '../../lib/useContent';
import contentFromSanity from '../../data/campaigns/fromSanity';
import KickstarterLanding from '../KickstarterLanding';
import PaidCampaignLayout from './PaidCampaignLayout';

/* A campaign whose document asks for the paid design.
 *
 * Everything the design needs, in one query. Fields the classic page also uses
 * are read the same way there; the five that only this design uses (capsules,
 * stats, bundle prices, agenda timings, faqs) were added to the schema for it.
 */
const PAID_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{
  "slug": slug.current, title, design,
  bannerBadge, bannerLine1, bannerLine2, bannerTagline, subtitle, capsules,
  stats[]{ value, label },
  date, time, format, price, origPrice, seatsNote,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url,
  credLogos[]{ name, logoPath, "image": image.asset->url },
  learn[]{ title, detail, start, end, keep, badge },
  get[]{ title, detail, price },
  forYou,
  faqs[]{ q, a },
  "eventImage": eventImage.asset->url,
  whatsappUrl, whatsappText
}`;

export default function SanityPaidCampaign() {
  const { slug } = useParams();
  const { data, loading } = useContentState(PAID_QUERY, null, { slug });

  if (loading && !data) return <PageLoader />;
  const content = contentFromSanity(data);
  // A campaign marked paid but missing its price cannot render a seat page —
  // it would show ₹0. Fall back to the classic design rather than leaving a
  // blank screen: a page with the wrong layout still sells; nothing does not.
  if (!content || !content.PRICE.now) return <KickstarterLanding />;
  return <PaidCampaignLayout content={content} />;
}
