import HiringRail from './HiringRail';

const DEFAULT_GEN_ROLES = [
  { name: 'AI Research intern', band: '₹10k–25k/month · Research & Strategy teams' },
  { name: 'Founders Office intern ', band: '₹10K–25K/month · Startups & venture-backed companies' },
  { name: "Marketing AI Intern", band: '₹8K–20K/month · Brand & growth teams' },
  { name: 'Business Operations Intern', band: '₹10K–18K/month · Operations & process teams' },
  { name: 'AI Content Intern', band: '₹8K–18K/month · Content & media companies' },
  { name: 'Customer Success Intern', band: '₹8K–15K/month · SaaS & support teams' },
];

const DEFAULT_ENG_ROLES = [
  { name: 'Prompt Engineering Intern', band: '₹10K–25K/month · AI-first startups' },
  { name: 'AI Automation Intern', band: '₹12K–25K/month · No-code & operations teams' },
  { name: 'AI Workflow Intern', band: '₹10K–20K/month · Internal automation teams' },
  { name: 'Agent Building Intern', band: '₹15K–30K/month · Emerging AI companies' },
  { name: 'AI Product Operations Intern', band: '₹12K–25K/month · Product teams' },
  { name: 'Claude / GPT Implementation Intern', band: '₹25–55L · Frontier teams' },
];

const DEFAULT_COMPANIES = [
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

// All content is prop-driven (defaults below), so each page can pass its own
// roles, companies and headings without affecting the others.
export default function HiringJobs({
  label = 'Hiring associations & roles',
  title = 'The jobs',
  titleEm = 'AI fluent are landing.',
  sub = 'AI is becoming part of every role. Menler Kickstarter prepares learners to contribute from day one.',
  genLabel = 'non tech',
  engLabel = 'tech',
  genRoles = DEFAULT_GEN_ROLES,
  engRoles = DEFAULT_ENG_ROLES,
  companies = DEFAULT_COMPANIES,
  partnersLabel = 'Hiring associations · India · 25+ companies',
  sectionStyle = {},
} = {}) {
  return (
    <section className="section jobs-section" style={sectionStyle}>
      <p className="section-label">{label}</p>
      <h2 className="section-h2">{title}<br /><em>{titleEm}</em></h2>
      <p className="section-sub">{sub}</p>
      <div className="jobs-roles">
        <div className="role-card gen-side">
          <p className="role-card-program">{genLabel}</p>
          <div className="role-list">
            {genRoles.map(r => (
              <div key={r.name} className="role-row"><p className="role-name">{r.name}</p><p className="role-band">{r.band}</p></div>
            ))}
          </div>
        </div>
        <div className="role-card eng-side">
          <p className="role-card-program">{engLabel}</p>
          <div className="role-list">
            {engRoles.map(r => (
              <div key={r.name} className="role-row"><p className="role-name">{r.name}</p><p className="role-band">{r.band}</p></div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
      <div className="partners-strip">
        <p className="partners-label">{partnersLabel}</p>
        <HiringRail companies={companies} />
      </div>
    </section>
  );
}
