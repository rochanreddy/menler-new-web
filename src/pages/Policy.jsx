import { useParams, useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';

// Policy documents shown in-site (PDF embedded), reached from the footer.
const POLICIES = {
  privacy: { title: 'Privacy Policy', pdf: '/policy/Menler_Privacy_Policy.pdf' },
  refund: { title: 'Refund Policy', pdf: '/policy/Menler_Refund_Policy.pdf' },
  terms: { title: 'Terms & Conditions', pdf: '/policy/Menler_Terms_Conditions.pdf' },
};

export default function Policy() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const policy = POLICIES[slug];

  if (!policy) {
    return (
      <section className="policy-page">
        <div className="policy-shell">
          <h1 className="policy-title">Policy not found</h1>
          <button className="policy-back" onClick={() => navigate('/')}>← Back to home</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title={`${policy.title} | Menler`} description={`${policy.title} for Menler.`} path={`/policy/${slug}`} />
      <section className="policy-page">
        <div className="policy-shell">
          <p className="section-label">Menler</p>
          <h1 className="policy-title">{policy.title}</h1>
          <div className="policy-doc">
            <iframe src={`${policy.pdf}#view=FitH`} title={policy.title} />
          </div>
          <a className="policy-download" href={policy.pdf} target="_blank" rel="noopener noreferrer">
            Download PDF ↓
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
