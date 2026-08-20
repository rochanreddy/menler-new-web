import { useState } from 'react';
import HiringRail from './HiringRail';

const DEFAULT_GEN_ROLES = [
  { name: 'AI Research', band: '₹10k–25k/month · Research & Strategy teams' },
  { name: 'Founders Office ', band: '₹10K–25K/month · Startups & venture-backed companies' },
  { name: "Marketing AI", band: '₹8K–20K/month · Brand & growth teams' },
  { name: 'Business Operations', band: '₹10K–18K/month · Operations & process teams' },
  { name: 'AI Content', band: '₹8K–18K/month · Content & media companies' },
  { name: 'Customer Success', band: '₹8K–15K/month · SaaS & support teams' },
];

const DEFAULT_ENG_ROLES = [
  { name: 'Prompt Engineering', band: '₹10K–25K/month · AI-first startups' },
  { name: 'AI Automation', band: '₹12K–25K/month · No-code & operations teams' },
  { name: 'AI Workflow', band: '₹10K–20K/month · Internal automation teams' },
  { name: 'Agent Building', band: '₹15K–30K/month · Emerging AI companies' },
  { name: 'AI Product Operations', band: '₹12K–25K/month · Product teams' },
  { name: 'Claude / GPT Implementation', band: '₹25–55L · Frontier teams' },
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

// One side's role list. When `preview` is set and shorter than the full
// list, it starts collapsed to that many roles with a clickable "+N more"
// tile filling the grid's last cell; clicking it reveals the rest in place
// (and turns into a "Show fewer" tile so it can be collapsed again).
function RoleList({ roles, preview, open: openProp }) {
  const [openLocal, setOpenLocal] = useState(false);
  // Controlled when a parent passes `open` — the single-box variant drives
  // both lists from one toggle instead of each keeping its own.
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openLocal;
  const truncated = preview && preview < roles.length;
  const shown = truncated && !open ? roles.slice(0, preview) : roles;
  const hiddenCount = roles.length - preview;
  return (
    <div className="role-list">
      {shown.map(r => (
        <div key={r.name} className="role-row"><p className="role-name">{r.name}</p><p className="role-band">{r.band}</p></div>
      ))}
      {truncated && !controlled && (
        <button type="button" className="role-row role-row--more" onClick={() => setOpenLocal(o => !o)}>
          <p className="role-more-n">{open ? 'Show fewer' : `+${hiddenCount} more`}</p>
          <p className="role-band">{open ? 'Back to the shortlist' : 'Across every domain track'}</p>
        </button>
      )}
    </div>
  );
}

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
  // Optional: collapse each side to this many roles with a "+N more" tile
  // that expands in place on click. Omitted (default) shows every role, same
  // as before.
  genPreview,
  engPreview,
  // One box holding both role groups, closed by a single "& many more"
  // instead of a "+N more" tile per group. Default keeps the two cards.
  singleBox = false,
  companies = DEFAULT_COMPANIES,
  partnersLabel = 'Hiring associations · India · 25+ companies',
  // Where the pay figures come from. A prop because it is not always salary
  // and not always the fellowship — the Kickstarter lists internship stipends.
  footnote = 'Salary bands sourced from fellowship partner intake. Updated quarterly.',
  // Some pages already show a hiring-associations logo strip elsewhere and
  // don't need this section's own copy of it.
  showPartners = true,
  sectionStyle = {},
  labelStyle = {},
  titleStyle = {},
  titleEmStyle = {},
  subStyle = {},
} = {}) {
  const [allOpen, setAllOpen] = useState(false);
  const anyHidden = (genPreview && genPreview < genRoles.length) || (engPreview && engPreview < engRoles.length);
  return (
    <section className="section jobs-section" style={sectionStyle}>
      <p className="section-label" style={labelStyle}>{label}</p>
      <h2 className="section-h2" style={titleStyle}>{title}<br /><em style={titleEmStyle}>{titleEm}</em></h2>
      <p className="section-sub section-sub--1line" style={subStyle}>{sub}</p>
      {singleBox ? (
        <div className="jobs-roles jobs-roles--single">
          <div className="role-card role-card--single">
            <div className="role-group role-group--gen">
              <p className="role-card-program">{genLabel}</p>
              <RoleList roles={genRoles} preview={genPreview} open={allOpen} />
            </div>
            <div className="role-group role-group--eng">
              <p className="role-card-program">{engLabel}</p>
              <RoleList roles={engRoles} preview={engPreview} open={allOpen} />
            </div>
            {anyHidden && (
              <button type="button" className="role-more-all" onClick={() => setAllOpen(o => !o)}>
                {allOpen ? 'Show fewer' : '& many more'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="jobs-roles">
          <div className="role-card gen-side">
            <p className="role-card-program">{genLabel}</p>
            <RoleList roles={genRoles} preview={genPreview} />
          </div>
          <div className="role-card eng-side">
            <p className="role-card-program">{engLabel}</p>
            <RoleList roles={engRoles} preview={engPreview} />
          </div>
        </div>
      )}
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>{footnote}</p>
      {showPartners && (
        <div className="partners-strip">
          <p className="partners-label">{partnersLabel}</p>
          <HiringRail companies={companies} />
        </div>
      )}
    </section>
  );
}
