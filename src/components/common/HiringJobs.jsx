import HiringRail from './HiringRail';

const GEN_ROLES = [
  { name: 'AI Specialist', band: '₹12–22L · Domain teams' },
  { name: 'AI Strategist', band: '₹15–28L · Consulting & in-house' },
  { name: "Founder's Office Associate", band: '₹14–24L · Startups & funds' },
  { name: 'Marketing AI Lead', band: '₹14–25L · Brand & growth teams' },
  { name: 'Operations AI Analyst', band: '₹10–18L · Ops & finance' },
  { name: 'Domain AI Consultant', band: '₹15–30L · Boutique consulting' },
  { name: 'AI Product Manager', band: '₹16–30L · SaaS & platforms' },
  { name: 'Finance AI Analyst', band: '₹12–22L · BFSI & fintech' },
  { name: 'Customer Experience AI Lead', band: '₹12–20L · Support & success' },
  { name: 'Sales AI Specialist', band: '₹12–24L · Revenue & GTM teams' },
];

const ENG_ROLES = [
  { name: 'Claude Solutions Engineer', band: '₹22–45L · AI-native startups' },
  { name: 'AI Engineer / Applied AI', band: '₹20–40L · Product teams' },
  { name: 'RAG / Agent Engineer', band: '₹22–40L · Platform teams' },
  { name: 'MCP Platform Engineer', band: '₹25–48L · Infra & enterprise AI' },
  { name: 'LLMOps Engineer', band: '₹22–42L · Production AI' },
  { name: 'AI Research Engineer', band: '₹25–55L · Frontier teams' },
  { name: 'Agentic Systems Engineer', band: '₹28–55L · AI-first startups' },
  { name: 'Applied AI Scientist', band: '₹30–60L · Research teams' },
  { name: 'AI Infrastructure Engineer', band: '₹24–46L · Platform & infra' },
  { name: 'Evals & Safety Engineer', band: '₹24–48L · Trust & reliability' },
];

const HIRING_COMPANIES = [
  { name: 'Ringg AI', domain: 'ringg.ai' },
  { name: 'MyGate', domain: 'mygate.com' },
  { name: 'Zolve', domain: 'zolve.com' },
  { name: 'Instawork', domain: 'instawork.com' },
  { name: 'Lyzr', domain: 'lyzr.ai' },
  { name: 'Emergent', domain: 'emergent.sh' },
  { name: 'Gushwork', domain: 'gushwork.ai' },
  { name: 'Cars24', domain: 'cars24.com' },
  { name: 'Matters', domain: 'matters.ai' },
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'Figr', domain: 'figr.design' },
  { name: 'Mercor', domain: 'mercor.com' },
  { name: 'Adobe', domain: 'adobe.com' },
  { name: 'OpenAI', domain: 'openai.com' },
  { name: 'Anthropic', domain: 'anthropic.com' },
  { name: 'PwC', domain: 'pwc.com' },
  { name: 'Cognizant', domain: 'cognizant.com' },
  { name: 'Accenture', domain: 'accenture.com' },
  { name: 'Flipkart', domain: 'flipkart.com' },
  { name: 'Autodesk', domain: 'autodesk.com' },
  { name: 'AnyDesk', domain: 'anydesk.com' },
  { name: 'MathCo', domain: 'themathcompany.com' },
  { name: 'Masai', domain: 'masaischool.com' },
  { name: 'Scaler', domain: 'scaler.com' },
  { name: 'PhysicsWallah', domain: 'pw.live' },
];

export default function HiringJobs() {
  return (
    <section className="section jobs-section">
      <p className="section-label">Hiring associations &amp; roles</p>
      <h2 className="section-h2">The jobs<br /><em>AI specialists are landing.</em></h2>
      <p className="section-sub">India's AI hiring market is splitting in two: companies buying generic AI and companies hiring people who can actually deploy Claude inside a domain. Menler fellows are built for the second list.</p>
      <div className="jobs-roles">
        <div className="role-card gen-side">
          <p className="role-card-program">Claude AI Generalist · Open roles</p>
          <div className="role-list">
            {GEN_ROLES.map(r => (
              <div key={r.name} className="role-row"><p className="role-name">{r.name}</p><p className="role-band">{r.band}</p></div>
            ))}
          </div>
        </div>
        <div className="role-card eng-side">
          <p className="role-card-program">Claude AI Engineering · Placement roles</p>
          <div className="role-list">
            {ENG_ROLES.map(r => (
              <div key={r.name} className="role-row"><p className="role-name">{r.name}</p><p className="role-band">{r.band}</p></div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
      <div className="partners-strip">
        <p className="partners-label">Hiring associations · India · 25+ companies</p>
        <HiringRail companies={HIRING_COMPANIES} />
      </div>
    </section>
  );
}
