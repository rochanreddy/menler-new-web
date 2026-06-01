import { useState } from 'react';

// Logos load from a public logo CDN by domain, with a text fallback.
// Replace with official logo files (src/assets) for production, and only list
// companies that are genuine hiring partners.
const PARTNERS = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'Stripe', domain: 'stripe.com' },
  { name: 'Uber', domain: 'uber.com' },
  { name: 'Airbnb', domain: 'airbnb.com' },
  { name: 'Spotify', domain: 'spotify.com' },
  { name: 'Adobe', domain: 'adobe.com' },
  { name: 'Atlassian', domain: 'atlassian.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
];

// Reusable logo chip — tries several internet logo sources, then the name.
export function BrandLogo({ name, domain }) {
  const srcs = [
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
  const [i, setI] = useState(0);
  return (
    <span className="partner-chip">
      {i < srcs.length
        ? <img className="partner-logo-img" src={srcs[i]} alt={name} loading="lazy" onError={() => setI(i + 1)} />
        : <span className="partner-name">{name}</span>}
    </span>
  );
}

export default function PartnersMarquee() {
  return (
    <div className="partners-marquee">
      <div className="partners-track">
        {[...PARTNERS, ...PARTNERS].map((p, i) => <BrandLogo key={i} name={p.name} domain={p.domain} />)}
      </div>
    </div>
  );
}
