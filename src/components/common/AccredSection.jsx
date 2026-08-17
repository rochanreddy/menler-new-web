import { BrandLogo } from './PartnersMarquee';
import HiringRail from './HiringRail';
import msmeLogo from '../../assets/logos/msme.webp';
import googleEduLogo from '../../assets/logos/google-education.webp';
import anthropicLogo from '../../assets/logos/anthropic.webp';

const ACCREDITORS = [
  { name: 'Startup India', domain: 'startupindia.gov.in', logo: '/logos/startup-india-removebg-preview.png' },
  { name: 'MSME India', domain: 'msme.gov.in', logo: msmeLogo },
  { name: 'Google for Education', domain: 'edu.google.com', logo: googleEduLogo },
  { name: 'Anthropic', domain: 'anthropic.com', logo: anthropicLogo },
];

/**
 * `marquee` runs the four logos as one continuously scrolling row instead of a
 * static grid, reusing the same rail the hiring logos use rather than adding a
 * second implementation of the same thing. Opt-in, because the home page's
 * grid is deliberate there — the landing page wants the row to keep moving.
 */
export default function AccredSection({ marquee = false }) {
  return (
    <section className={`accred-section${marquee ? ' accred-section--rail' : ''}`}>
      <div className="accred-inner">
        <div className="accred-by accred-by--only">
          <p className="accred-by-label">We are accredited by</p>
          {marquee ? (
            <HiringRail companies={ACCREDITORS} rows={1} />
          ) : (
            <div className="accred-by-row">
              {ACCREDITORS.map(a => (
                <BrandLogo key={a.name} name={a.name} domain={a.domain} logo={a.logo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
