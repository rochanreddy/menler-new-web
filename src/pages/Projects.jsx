import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import CtaBanner from '../components/common/CtaBanner';
import { PROJECTS } from '../data/projectsData';

export default function Projects() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const project = PROJECTS.find(p => p.slug === slug);

  if (!project) {
    return (
      <>
        <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center', minHeight: '50vh' }}>
          <h2 className="section-h2">Project not found</h2>
          <p className="section-sub">That project doesn’t exist or has moved.</p>
          <div style={{ marginTop: 24 }}>
            <button className="btn-primary" onClick={() => go('/')}>Back to home</button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { doc } = project;

  return (
    <>
      {/* ── PROJECT PREVIEW HERO ── */}
      <section className="proj-detail-hero">
        <div className="proj-detail-inner">
          <button className="proj-detail-back" onClick={() => navigate(-1)}>Back</button>
          <span className={`proj-domain-tag ${project.tagCls}`}>{project.tag}</span>
          <h1 className="proj-detail-title">{project.title}</h1>
          <p className="proj-detail-desc">{project.desc}</p>
          <div className="proj-stack" style={{ marginTop: 18 }}>{project.stack.map(s => <span key={s}>{s}</span>)}</div>
          <p className="proj-outcome" style={{ marginTop: 16 }}>{project.outcome}</p>
        </div>
      </section>

      {/* ── DESCRIPTION & PROBLEM STATEMENT ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="proj-doc proj-doc--page">
          <p className="proj-doc-lead">{doc.overview}</p>

          <h4 className="proj-doc-h">The problem</h4>
          <p className="proj-doc-p">{doc.problem}</p>

          <h4 className="proj-doc-h">How it works</h4>
          <ol className="proj-doc-steps">
            {doc.howItWorks.map((s, j) => <li key={j}>{s}</li>)}
          </ol>

          <h4 className="proj-doc-h">Key features</h4>
          <ul className="proj-doc-list">
            {doc.features.map((f, j) => <li key={j}>{f}</li>)}
          </ul>

          <h4 className="proj-doc-h">Architecture</h4>
          <p className="proj-doc-p">{doc.architecture}</p>
          <div className="proj-stack" style={{ marginTop: 10 }}>{project.stack.map(s => <span key={s}>{s}</span>)}</div>

          <h4 className="proj-doc-h">Results &amp; impact</h4>
          <ul className="proj-doc-list">
            {doc.results.map((r, j) => <li key={j}>{r}</li>)}
          </ul>
          <p className="proj-outcome" style={{ marginTop: 12 }}>{project.outcome}</p>

          <div style={{ marginTop: 36 }}>
            <button className="btn-primary" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>
      </section>

      <CtaBanner
        badge="Applications open · Limited seats per program"
        title="Want to build this?"
        subtitle="Menler fellows ship systems like this in 12 weeks."
        buttonText="Explore the programs"
        onButtonClick={() => go('/programs')}
      />

      <Footer />
    </>
  );
}
