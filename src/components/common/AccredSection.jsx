import { BrandLogo } from './PartnersMarquee';
import msmeLogo from '../../assets/logos/msme.webp';
import googleEduLogo from '../../assets/logos/google-education.webp';
import anthropicLogo from '../../assets/logos/anthropic.webp';

const ACCREDITORS = [
  { name: 'Startup India', domain: 'startupindia.gov.in', logo: '/logos/startup-india-removebg-preview.png' },
  { name: 'MSME India', domain: 'msme.gov.in', logo: msmeLogo },
  { name: 'Google for Education', domain: 'edu.google.com', logo: googleEduLogo },
  { name: 'Anthropic', domain: 'anthropic.com', logo: anthropicLogo },
];

export default function AccredSection() {
  return (
    <section className="accred-section">
      <div className="accred-inner">
        <div className="accred-by accred-by--only">
          <p className="accred-by-label">We are accredited by</p>
          <div className="accred-by-row">
            {ACCREDITORS.map(a => (
              <BrandLogo key={a.name} name={a.name} domain={a.domain} logo={a.logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
