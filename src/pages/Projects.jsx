import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import CtaBanner from '../components/common/CtaBanner';
import PdfView from '../components/common/PdfView';
import Seo, { SITE_URL } from '../components/common/Seo';
import { PROJECTS, PROJECTS_QUERY, tagClassFor } from '../data/projectsData';
import { useContent } from '../lib/useContent';

// Per-project slide deck (PPTX in /public/project_decks), shown on the detail page.
const DECKS = {
  'ceo-decision-intelligence-agent': '/project_decks/CEO_Decision_Intelligence_Agent.pdf',
  'deal-flow-triage-agent': '/project_decks/Deal_Flow_Triage_Agent.pdf',
  'insights-to-prd-pipeline': '/project_decks/Insights_to_PRD_Pipeline.pdf',
  'pmo-status-agent': '/project_decks/PMO_Status_Agent.pdf',
  'production-rag-pipeline-custom-mcp': '/project_decks/Production_RAG_Pipeline.pdf',
  'research-synthesis-insight-engine': '/project_decks/Research_Synthesis_Engine.pdf',
  'sop-automation-suite': '/project_decks/SOP_Automation_Suite.pdf',
  'always-on-content-outreach-engine': '/project_decks/Content_Outreach_Engine.pdf',
  'retail-support-rag-service': '/project_decks/Retail_Support_RAG.pdf',
  'api-doc-summariser-agent': '/project_decks/API_Doc_Summariser.pdf',
  'internal-engineering-copilot': '/project_decks/Internal_Engineering_Copilot.pdf',
  'quote-to-order-automation-engine': '/project_decks/Quote_to_Order_Engine.pdf',
  'requirement-to-dashboard-pipeline': '/project_decks/Requirement_to_Dashboard.pdf',
  'incident-management-auto-sync': '/project_decks/Incident_Management_Auto_Sync.pdf',
  'ai-job-matching-workflow': '/project_decks/AI_Job_Matching_Workflow.pdf',
  'account-research-solutioning-agent': '/project_decks/Account_Research_Agent.pdf',
  'crm-hygiene-autopilot': '/project_decks/CRM_Hygiene_Autopilot.pdf',
  'end-to-end-seo-content-agent': '/project_decks/SEO_Content_Agent.pdf',
  'inbound-email-triage-agent': '/project_decks/Inbound_Email_Triage_Agent.pdf',
  'insight-on-demand-data-agent': '/project_decks/Insight_on_Demand_Agent.pdf',
};

export default function Projects() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const projects = useContent(PROJECTS_QUERY, PROJECTS);
  const project = projects.find(p => p.slug === slug);
  const deck = DECKS[slug];
  const [deckOpen, setDeckOpen] = useState(false); // mobile full-screen deck

  if (!project) {
    return (
      <>
        <Seo title="Project not found — Menler" path={`/projects/${slug}`} noindex />
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
  const ogImage = project.image ? (project.image.startsWith('http') ? project.image : SITE_URL + project.image) : undefined;

  return (
    <>
      <Seo
        title={`${project.title} — Menler Project`}
        description={project.desc}
        keywords={`${project.title}, ${project.tag}, AI project, ${(project.stack || []).join(', ')}, Menler`}
        path={`/projects/${slug}`}
        image={ogImage}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.desc,
          ...(ogImage ? { image: ogImage } : {}),
          url: `${SITE_URL}/projects/${slug}`,
          keywords: (project.stack || []).join(', '),
          isPartOf: { '@type': 'WebSite', name: 'Menler', url: SITE_URL },
        }}
      />
      {/* ── PROJECT PREVIEW HERO ── */}
      <section className="proj-detail-hero">
        <div className="proj-detail-inner">
          <span className={`proj-domain-tag ${tagClassFor(project)}`}>{project.tag}</span>
          <h1 className="proj-detail-title">{project.title}</h1>
          <p className="proj-detail-desc">{project.desc}</p>
          <div className="proj-stack" style={{ marginTop: 18 }}>{project.stack.map(s => <span key={s}>{s}</span>)}</div>
          <p className="proj-outcome" style={{ marginTop: 16 }}>{project.outcome}</p>
        </div>
      </section>

      {/* ── PROJECT DECK ── */}
      {deck && (
        <section className="section" style={{ background: 'var(--parchment)', paddingTop: 36, paddingBottom: 36 }}>
          <div className="proj-doc proj-doc--page">
            <h4 className="proj-doc-h" style={{ marginTop: 0 }}>Project deck</h4>
            <div className="proj-deck">
              <PdfView url={deck} />
              {/* Mobile only: tap the deck to open it full-screen (like the playbook). */}
              <button type="button" className="proj-deck-fsbtn" onClick={() => setDeckOpen(true)} aria-label="Open deck full screen">
                <span>Tap to open full screen ⤢</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Full-screen deck overlay (opened from the mobile tap target above). */}
      {deck && deckOpen && (
        <div className="deck-fs" role="dialog" aria-modal="true" aria-label="Project deck">
          <div className="deck-fs-bar">
            <span className="deck-fs-title">{project.title} · deck</span>
            <button type="button" className="deck-fs-close" onClick={() => setDeckOpen(false)} aria-label="Close deck">✕</button>
          </div>
          <div className="deck-fs-body"><PdfView url={deck} /></div>
        </div>
      )}

      {/* ── DESCRIPTION & PROBLEM STATEMENT ── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="proj-doc proj-doc--page">
          {doc ? (
            <>
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
            </>
          ) : (
            <>
              <p className="proj-doc-lead">{project.desc}</p>

              <h4 className="proj-doc-h">Tools &amp; stack</h4>
              <div className="proj-stack" style={{ marginTop: 10 }}>{project.stack.map(s => <span key={s}>{s}</span>)}</div>

              <h4 className="proj-doc-h">Outcome</h4>
              <p className="proj-outcome" style={{ marginTop: 4 }}>{project.outcome}</p>

              <p className="proj-doc-p" style={{ marginTop: 24, color: 'var(--text-muted)' }}>
                A full build doc for this project is on the way. It's drawn from a real respondent in the AI-at-Work survey — the project type, tools, and domain reflect what they described building.
              </p>
            </>
          )}

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
        onButtonClick={() => go('/#programs')}
      />

      <Footer />
    </>
  );
}
