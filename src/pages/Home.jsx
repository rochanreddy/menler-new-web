import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AccredSection from '../components/common/AccredSection';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import LeadForm from '../components/forms/LeadForm';
import Footer from '../components/layout/Footer';
import Reveal from '../components/common/Reveal';
import { useToast } from '../components/common/Toast';
import { HOME_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const PROJECTS = [
  { tag: "Founder's Office", tagCls: 't-founder', title: 'CEO decision-intelligence agent', desc: "Pulls from Slack, Asana, GitHub, finance docs & reports — synthesises a Monday-morning briefing on what changed, what's at risk, and what to decide.", stack: ['MCP', 'Cowork', 'Tool use'], outcome: '15-min briefing replaces 90-min catch-up' },
  { tag: 'VC', tagCls: 't-vc', title: 'Deal-flow triage agent', desc: 'Ingests pitch decks, founder emails, and public data — outputs a partner-ready memo on fit, market, traction, and follow-up questions.', stack: ['Claude API', 'Tool use', 'RAG'], outcome: 'Cuts initial screening time by 70%' },
  { tag: 'Product Management', tagCls: 't-pm', title: 'Insights-to-PRD pipeline', desc: 'Synthesises user interviews, support tickets, NPS comments, and sales notes into structured product requirement docs and themed opportunity stacks.', stack: ['Claude Projects', 'Multimodal', 'Cowork'], outcome: '5× faster discovery → PRD turnaround' },
  { tag: 'Project Management', tagCls: 't-pjm', title: 'PMO status agent', desc: 'Reads sprint boards, code commits, and stand-up notes — drafts the weekly leadership update with risks, slippage, and the asks for next week.', stack: ['MCP', 'Cowork', 'Skills'], outcome: 'Saves 6+ hrs/PM/week of status writing' },
  { tag: 'Engineering', tagCls: 't-eng', title: 'Production RAG pipeline + custom MCP', desc: 'Document ingestion → vector DB → grounded Claude service, with caching, RAGAS evals and a remote MCP exposing internal tools to Claude Desktop.', stack: ['Python', 'MCP SDK', 'Claude API'], outcome: '<800ms p95, ship-ready to enterprise' },
  { tag: 'Data & Business Analysts', tagCls: 't-analyst', title: 'Research synthesis & insight engine', desc: 'Multi-source agent across PDFs, web data, and internal reports — produces a competitive landscape with citations and contradictions flagged for review.', stack: ['Claude API', 'Web search', 'Citations'], outcome: 'Days → hours per research cycle' },
  { tag: 'Strategists & Operations', tagCls: 't-ops', title: 'SOP automation suite', desc: 'Replaces six manual checklists with a single audit-ready agent that intakes, triages, and escalates exceptions across customer support and ops.', stack: ['Agentic design', 'Cowork', 'MCP'], outcome: 'Reclaims 8–12 hrs/manager/week' },
  { tag: 'Marketing & Sales', tagCls: 't-marketing', title: 'Always-on content & outreach engine', desc: 'Turns one strategic brief into a coordinated multichannel campaign — blog, email, LinkedIn, ads, and sales sequences — with brand voice enforced.', stack: ['Prompt patterns', 'Skills', 'MCP'], outcome: '3× output velocity, single-author voice' },
];

const STORIES = [
  { quote: '"I came in as an ex-banker. By Week 8 I had a Claude-powered earnings analyst running for real companies. By Week 12 I had three offers in finance AI roles."', initials: 'AS', name: 'Beta fellow — Finance track', trans: 'Banker → Claude Specialist, Finance', cls: '' },
  { quote: '"Most AI courses teach you ChatGPT. Meridian teaches you how to actually deploy Claude inside a real workflow. That\'s the skill we hire for."', initials: 'RV', name: 'Hiring partner — Founder\'s Office', trans: 'Series-B SaaS, Bengaluru', cls: 'dark' },
  { quote: '"I\'d written Python for 5 years but never built with Claude. The Engineering track took me from API basics to a deployed RAG + MCP system in 12 weeks."', initials: 'KP', name: 'Beta fellow — Engineering', trans: 'Backend dev → Claude Solutions Engineer', cls: 'green' },
  { quote: '"The domain track design is the magic. I learned Claude through the lens of marketing, not in the abstract. Everything I built was usable on Day 1 of my new job."', initials: 'SN', name: 'Beta fellow — Marketing track', trans: 'Brand manager → AI Marketing Lead', cls: '', avatarStyle: { background: '#FAEEDA', color: '#854F0B' } },
  { quote: '"India needs a credible Claude credential. Meridian is the first program that\'s serious about it — exam, capstone, placement. That combination is rare."', initials: 'JM', name: 'Curriculum advisor', trans: 'Ex-AI lead, Indian unicorn', cls: 'dark' },
  { quote: '"The placement cell wasn\'t an afterthought. They knew which startups were hiring, prepped me for the right interviews, and brought offers to Demo Day."', initials: 'PT', name: 'Beta fellow — VC track', trans: 'MBA → Investment associate', cls: 'green' },
];

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const interestRef = useRef(null);
  const scrollToInterest = () => interestRef.current?.scrollIntoView({ behavior: 'smooth' });

  const [miniEmail, setMiniEmail] = useState('');
  const [miniProgram, setMiniProgram] = useState('');
  const [miniDone, setMiniDone] = useState(false);
  const handleMiniLead = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ email: miniEmail, program: miniProgram, source: 'mini-lead' });
      setMiniDone(true);
      toast.success('Brochure on its way — check your inbox.');
    } catch {
      toast.error("Couldn't send the brochure just now. Please try again.");
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero — Meridian Fellowship">
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring r3" />
        <div className="hero-grid">
        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="meridianGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#AFA9EC" stopOpacity="0.55"/>
                <stop offset="60%" stopColor="#534AB7" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#26215C" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="meridianArc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EEEDFE"/>
                <stop offset="100%" stopColor="#AFA9EC"/>
              </linearGradient>
            </defs>
            <circle className="hero-glow" cx="240" cy="240" r="220" fill="url(#meridianGlow)"/>
            <circle cx="240" cy="240" r="180" stroke="rgba(238,237,254,0.22)" strokeWidth="0.8" fill="none"/>
            <circle cx="240" cy="240" r="135" stroke="rgba(238,237,254,0.32)" strokeWidth="0.8" fill="none"/>
            <circle cx="240" cy="240" r="92" stroke="rgba(238,237,254,0.46)" strokeWidth="1" fill="none"/>
            <g className="hero-moon">
              <path d="M240 148 a92 92 0 0 1 0 184" fill="rgba(38,33,92,0.78)" />
              <path d="M240 148 a92 92 0 0 0 0 184" fill="rgba(175,169,236,0.95)" />
            </g>
            <circle cx="240" cy="240" r="92" stroke="url(#meridianArc)" strokeWidth="1.5" fill="none"/>
            <g className="hero-orbit-dots" stroke="#EEEDFE" strokeWidth="0.6" fill="#EEEDFE">
              <circle cx="240" cy="60" r="3.4"/>
              <circle cx="420" cy="240" r="3.4"/>
              <circle cx="240" cy="420" r="3.4"/>
              <circle cx="60"  cy="240" r="3.4"/>
              <circle cx="367" cy="113" r="2.8" opacity="0.75"/>
              <circle cx="367" cy="367" r="2.8" opacity="0.75"/>
              <circle cx="113" cy="113" r="2.8" opacity="0.75"/>
              <circle cx="113" cy="367" r="2.8" opacity="0.75"/>
            </g>
            <g className="hero-labels" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="rgba(238,237,254,0.7)" letterSpacing="1.2">
              <text className="hero-label" x="240" y="46" textAnchor="middle">FOUNDER&apos;S OFFICE</text>
              <text className="hero-label" x="437" y="244" textAnchor="end">VC</text>
              <text className="hero-label" x="240" y="448" textAnchor="middle">ENGINEERING</text>
              <text className="hero-label" x="42"  y="244" textAnchor="start">MARKETING</text>
            </g>
          </svg>
        </div>
        <div className="hero-inner">
          <p className="hero-eyebrow">Meridian Fellowship · India</p>
          <h1 className="hero-h1">Your turning point<br /><em>in the AI era.</em></h1>
          <p className="hero-sub">India's first Claude AI specialist fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 500 }}><br />20+ AI Specialists. 12 weeks of intensive fellowship. Real outcomes.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToInterest}>Apply to the Fellowship →</button>
            <button className="btn-ghost" onClick={() => go('/aptitude')}>Take the AI Aptitude Test →</button>
          </div>
          <p className="hero-metrics-label">The Meridian Fellowship · at a glance</p>
          <div className="hero-stats">
            <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />associations</span></div>
            <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Specialists<br />graduated &amp; placed</span></div>
            <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num">7+</span><span className="hero-stat-lbl">Domain<br />tracks</span></div>
          </div>
        </div>
        </div>
      </section>

      {/* ── ACCREDITATION ── */}
      <AccredSection />

      {/* ── PROGRAMS ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Choose your program</p>
        <h2 className="section-h2">Two Paths, One Outcome —<br /><em>AI Native You!</em></h2>
        <p className="section-sub">Both fellowships lead to a recognised AI Specialist credential and active placement support. Pick the one that fits your background — or talk to an AI Specialist and let us help you decide.</p>
        <div className="prog-compare">
          <div className="prog-card gen">
            <span className="prog-card-badge">No coding required</span>
            <p className="prog-card-title">Claude AI Generalist</p>
            <p className="prog-card-sub">India's first no-code Claude AI specialist program. Master Claude across your domain — Founder's Office, VC, Marketing, Analyst, Finance, Operations, Technology — and graduate as a certified AI Specialist with a domain portfolio.</p>
            <p className="prog-card-for">Built for</p>
            <ul className="prog-card-list">
              <li>Students from any discipline</li>
              <li>Working professionals — tech &amp; non-tech</li>
              <li>Business owners &amp; founders</li>
              <li>Career switchers entering AI roles</li>
              <li>Zero coding experience needed</li>
            </ul>
            <div className="next-batch">
              <p className="nb-label">Next batch</p>
              <p className="nb-when"><strong>August 2026</strong>  ·  12 weeks  ·  Hybrid</p>
              <p className="nb-deadline">Applications close 15 July 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/generalist')}>Explore Generalist →</button>
          </div>
          <div className="prog-card eng">
            <span className="prog-card-badge">Coding experience required</span>
            <p className="prog-card-title">Claude AI Engineering</p>
            <p className="prog-card-sub">India's most rigorous Claude AI engineering certification. Build the full Claude stack — API, RAG, MCP, multi-agent systems, computer use, evals, and deployed AI apps — and earn the AI Engineer credential.</p>
            <p className="prog-card-for">Built for</p>
            <ul className="prog-card-list">
              <li>Software engineers &amp; developers</li>
              <li>Data scientists &amp; ML practitioners</li>
              <li>IT engineers &amp; DevOps</li>
              <li>Deep tech &amp; systems professionals</li>
              <li>Python / JS experience required</li>
            </ul>
            <div className="next-batch">
              <p className="nb-label">Next batch</p>
              <p className="nb-when"><strong>September 2026</strong>  ·  12 weeks  ·  Intensive</p>
              <p className="nb-deadline">Applications close 10 August 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/engineering')}>Explore Engineering →</button>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'rgba(38,33,92,0.7)' }}>
          <button className="btn-link" onClick={scrollToInterest} style={{ color: 'var(--specialist)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Talk to an AI Specialist →</button>
        </p>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">What you build</p>
        <h2 className="section-h2">Real Projects.<br /><em>Across Every Domain.</em></h2>
        <p className="section-sub">Every Meridian fellow ships a portfolio of domain-specific projects.<br />Not toy demos — actual systems built for real use cases. A snapshot of the work.</p>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <Reveal as="article" key={i} delay={Math.min(i, 5) * 60} className="proj-card">
              <span className={`proj-domain-tag ${p.tagCls}`}>{p.tag}</span>
              <h3 className="proj-card-title">{p.title}</h3>
              <p className="proj-card-desc">{p.desc}</p>
              <div className="proj-stack">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
              <p className="proj-outcome">{p.outcome}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">What you leave with</p>
        <h2 className="section-h2">Every fellow graduates<br /><em>with all five.</em></h2>
        <div className="outcomes-grid">
          <div className="outcome dark">
            <span className="outcome-num">01</span>
            <p className="outcome-title">Claude Specialist certification</p>
            <p className="outcome-desc">Domain-specific badge.<br />The first Claude-native career credential in the market.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">02</span>
            <p className="outcome-title">Domain project portfolio</p>
            <p className="outcome-desc">Real projects — published, documented, and demo-ready by Week 12.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">03</span>
            <p className="outcome-title">Placed role in your domain</p>
            <p className="outcome-desc">Matched to employers in your track. Demo Day puts you in front of decision-makers.</p>
          </div>
          <div className="outcome purple">
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>04</span>
            <p className="outcome-title">AI business strategy fluency</p>
            <p className="outcome-desc">Pitch AI investments, design roadmaps, communicate ROI — regardless of seniority or background.</p>
          </div>
          <div className="outcome" style={{ gridColumn: '1/-1' }}>
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>05</span>
            <p className="outcome-title">The Meridian network — your circle for the AI era</p>
            <p className="outcome-desc">Fellows across both programs, across 7 domains. Permanent alumni access. The people who understand where you're going.</p>
          </div>
        </div>
      </section>

      {/* ── MINI LEAD ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the MERIDIAN fellowship <em>brochure.</em></h3>
            <p>Syllabus, schedule, fees, scholarships, and ISA options — straight to your inbox.</p>
          </div>
          {miniDone ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleMiniLead}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={miniEmail} onChange={e => setMiniEmail(e.target.value)} autoComplete="email" />
              <select required aria-label="Program of interest" value={miniProgram} onChange={e => setMiniProgram(e.target.value)}>
                <option value="">Program</option>
                <option>Generalist</option>
                <option>Engineering</option>
                <option>Not sure</option>
              </select>
              <button type="submit">Send brochure →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── HIRING PARTNERS & ROLES ── */}
      <section className="section jobs-section">
        <p className="section-label">Hiring partners &amp; roles</p>
        <h2 className="section-h2">The jobs<br /><em>AI specialists are landing.</em></h2>
        <p className="section-sub">India's AI hiring market is splitting in two: companies buying generic AI and companies hiring people who can actually deploy Claude inside a domain. Meridian fellows are built for the second list.</p>
        <div className="jobs-roles">
          <div className="role-card gen-side">
            <p className="role-card-program">Claude AI Generalist · Placement roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">AI Specialist</p><p className="role-band">₹12–22L · Domain teams</p></div>
              <div className="role-row"><p className="role-name">AI Strategist</p><p className="role-band">₹15–28L · Consulting &amp; in-house</p></div>
              <div className="role-row"><p className="role-name">Founder's Office Associate</p><p className="role-band">₹14–24L · Startups &amp; funds</p></div>
              <div className="role-row"><p className="role-name">Marketing AI Lead</p><p className="role-band">₹14–25L · Brand &amp; growth teams</p></div>
              <div className="role-row"><p className="role-name">Operations AI Analyst</p><p className="role-band">₹10–18L · Ops &amp; finance</p></div>
              <div className="role-row"><p className="role-name">Domain AI Consultant</p><p className="role-band">₹15–30L · Boutique consulting</p></div>
            </div>
          </div>
          <div className="role-card eng-side">
            <p className="role-card-program">Claude AI Engineering · Placement roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">Claude Solutions Engineer</p><p className="role-band">₹22–45L · AI-native startups</p></div>
              <div className="role-row"><p className="role-name">AI Engineer / Applied AI</p><p className="role-band">₹20–40L · Product teams</p></div>
              <div className="role-row"><p className="role-name">RAG / Agent Engineer</p><p className="role-band">₹22–40L · Platform teams</p></div>
              <div className="role-row"><p className="role-name">MCP Platform Engineer</p><p className="role-band">₹25–48L · Infra &amp; enterprise AI</p></div>
              <div className="role-row"><p className="role-name">LLMOps Engineer</p><p className="role-band">₹22–42L · Production AI</p></div>
              <div className="role-row"><p className="role-name">AI Research Engineer</p><p className="role-band">₹25–55L · Frontier teams</p></div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
        <div className="partners-strip">
          <p className="partners-label">Hiring partner network · India · 25+ companies</p>
          <div className="partners-logos">
            {['AI-native startup', 'Top-tier VC', "Founder's office", 'Growth-stage SaaS', 'Marketing agency', 'Boutique fund', 'FinTech', 'Enterprise AI', '+ logos coming soon'].map(p => (
              <span key={p} className="partner-logo">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MERIDIAN METRICS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Why Meridian</p>
        <h2 className="section-h2">Built around outcomes,<br /><em>measured against them.</em></h2>
        <p className="section-sub">India's AI training market is full of certificates that don't translate to careers. Meridian is engineered backwards from placement — every week, every assignment, every track decision is mapped to a hireable skill in a real domain.</p>
        <div className="metrics-strip">
          <Reveal className="metric-tile dark" delay={0}>
            <span className="metric-num">90%</span>
            <p className="metric-label">Interview pipeline target</p>
            <p className="metric-desc">Our placement goal — every fellow into an active interview pipeline within 90 days, across our domain tracks.</p>
          </Reveal>
          <Reveal className="metric-tile green" delay={70}>
            <span className="metric-num">25+</span>
            <p className="metric-label">Hiring associations</p>
            <p className="metric-desc">Founder's offices, VC firms, marketing agencies, finance teams, AI-native startups — actively recruiting AI Specialists.</p>
          </Reveal>
          <Reveal className="metric-tile" delay={140}>
            <span className="metric-num">12</span>
            <p className="metric-label">Weeks to credential</p>
            <p className="metric-desc">Three phases: AI fluency, agentic builds, and capstone + placement. Faster than a postgraduate diploma. Deeper than a course.</p>
          </Reveal>
          <Reveal className="metric-tile" delay={210}>
            <span className="metric-num">7+</span>
            <p className="metric-label">Domain tracks</p>
            <p className="metric-desc">Founder's Office · VC · Product · Project Mgmt · Engineering · Data &amp; Business Analysts · Strategists &amp; Ops · Marketing &amp; Sales.</p>
          </Reveal>
        </div>
      </section>

      {/* ── LEAD FORM ── */}
      <section className="lead-section" id="interest" ref={interestRef}>
        <div className="lead-grid">
          <div className="lead-copy">
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--lavender)', marginBottom: 14 }}>Apply to the Fellowship · Limited seats</p>
            <h2>Tell us where you<br /><em>want to go.</em></h2>
            <p>Limited seats per cohort across our Generalist and Engineering programs. Share a few details and our admissions team will reach out within 48 hours with the right next step: brochure, scholarship eligibility, or a fast-track to the application.</p>
            <ul>
              <li>Receive the fellowship brochure &amp; syllabus</li>
              <li>Get scholarship &amp; ISA eligibility check</li>
              <li>Book a 1:1 admissions call</li>
              <li>Be the first to hear about upcoming batch dates</li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Voices · Beta fellows &amp; advisors</p>
        <h2 className="section-h2">Why fellows<br /><em>chose Meridian.</em></h2>
        <p className="section-sub">These quotes are from our beta fellows and advisory voices — early specialists, hiring partners, and curriculum reviewers. Named placement stories will be published with full bios after upcoming Demo Days.</p>
        <div className="stories-grid" style={{ marginTop: 28 }}>
          {STORIES.map((s, i) => (
            <Reveal as="article" key={i} delay={Math.min(i, 5) * 60} className={`story-card${s.cls ? ` ${s.cls}` : ''}`}>
              <p className="story-quote">{s.quote}</p>
              <div className="story-meta">
                <div className="story-avatar" style={s.avatarStyle}>{s.initials}</div>
                <div>
                  <p className="story-name">{s.name}</p>
                  <p className="story-transition">{s.trans}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="stories-disclaimer">Quotes shown are anonymised excerpts from Meridian beta participants and advisory partners. Named placement stories will be published post Demo Day.</p>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'white', textAlign: 'center' }}>
        <p className="section-label">Common questions</p>
        <h2 className="section-h2">Everything you<br /><em>want to know.</em></h2>
        <FaqList items={HOME_FAQS} />
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        badge="Applications open · Limited seats per program"
        title="Your Meridian starts here."
        subtitle="Choose your program. Build your credential. Get placed."
        buttonText="Apply to the Fellowship"
        onButtonClick={scrollToInterest}
      />

      <Footer />
    </>
  );
}
