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
            {/* toolbar=0 hides the viewer's download/print bar; navpanes=0 hides
                the left thumbnail/outline panel — show the PDF content only.
                Hovering the document scrolls the document itself. */}
            <iframe src={`${policy.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title={policy.title} scrolling="yes" />
          </div>
          {/* Mobile browsers often can't scroll a PDF embedded in an iframe — give
              them a reliable full-screen view where native scrolling always works. */}
          <a className="policy-open-mobile" href={policy.pdf} target="_blank" rel="noopener noreferrer">
            Open in full screen ↗
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
