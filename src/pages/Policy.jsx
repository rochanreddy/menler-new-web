import { useParams, useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import { POLICIES } from '../data/policyContent';

// Renders one content block: paragraph, sub-heading, or bullet list.
function Block({ block }) {
  if (block.sub) return <p className="policy-sub">{block.sub}</p>;
  if (block.ul) return <ul className="policy-list">{block.ul.map((li, i) => <li key={i}>{li}</li>)}</ul>;
  return <p className="policy-para">{block.p}</p>;
}

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
      <Seo title={`${policy.title} | Menler`} description={`${policy.title} for Menler — ${policy.intro.slice(0, 150)}`} path={`/policy/${slug}`} />
      <section className="policy-page">
        <div className="policy-shell policy-shell--text">
          <header className="policy-header">
            <p className="section-label">Menler · Legal</p>
            <h1 className="policy-title">{policy.title}</h1>
            {policy.updated && <p className="policy-updated">{policy.updated}</p>}
          </header>

          <article className="policy-paper">
            <p className="policy-intro">{policy.intro}</p>

            {policy.sections.map((sec, i) => (
              <div className="policy-section" key={i}>
                <h2 className="policy-h2">{sec.h}</h2>
                {sec.body.map((block, j) => <Block key={j} block={block} />)}
              </div>
            ))}

            <p className="policy-footnote">© 2026 Menler Learning Systems Private Limited · menler.in · support@menler.in</p>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
