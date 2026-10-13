import { useState } from 'react';
import { FDE_CASES, FDE_OUTCOMES, FDE_TRACKS } from '../data/fdeCurriculum';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import { ENGINEERING_FAQS } from '../data/faqData';
import { verifyAndDownloadBrochure } from '../lib/brochure';
import PhoneField from '../components/forms/PhoneField';
import { isSmsReachable, phoneMinLength } from '../lib/phone';
import BackgroundField from '../components/forms/BackgroundField';

// Hiring section content for the Engineering page only — edit freely, it does
// NOT affect the Generalist / Kickstarter hiring sections.
const ENG_HIRING = {
  label: 'Hiring associations & roles',
  title: 'The jobs',
  titleEm: 'AI FDEs are landing.',
  labelStyle: { color: 'var(--forest)' },
  titleStyle: { color: 'var(--forest)' },
  titleEmStyle: { color: 'var(--placed)' },
  sub: 'Companies are hiring engineers who can sit with a client, own an AI system end to end and defend it in production.',
  genLabel: 'AI Engineering',
  engLabel: 'Advanced AI Systems',
  genRoles: [
    { name: 'AI Engineer', band: '₹20–40L · Product & AI teams' },
    { name: 'Solutions Engineer', band: '₹22–45L · AI Native startups' },
    { name: 'RAG Engineer', band: '₹22–40L · Knowledge systems teams' },
    { name: 'Agent Engineer', band: '₹24–45L · Agentic AI companies' },
    { name: 'AI Product Engineer', band: '₹20–38L · Product organizations' },
    { name: 'AI Platform Engineer', band: '₹25–48L · Enterprise AI teams' },
  ],
  engRoles: [
    { name: 'LLMOps Engineer', band: '₹22–42L · Production AI teams' },
    { name: 'MCP Platform Engineer', band: '₹25–48L · AI infrastructure teams' },
    { name: 'AI Infrastructure Engineer', band: '₹24–46L · Platform & infra teams' },
    { name: 'AI Research Engineer', band: '₹25–55L · Frontier AI teams' },
    { name: 'Applied AI Scientist', band: '₹30–60L · Research organizations' },
    { name: 'Agentic Systems Engineer', band: '₹28–55L · AI-first companies' },
  ],
};

export default function Engineering() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', background: '', college: '', graduation_year: '' });
  const [done, setDone] = useState(false);
  // Curriculum: which case is open (-1 = none) and which of its two weeks is shown.
  const [openCase, setOpenCase] = useState(0);
  const [caseWeek, setCaseWeek] = useState(0);
  const toggleCase = (i, el) => {
    const willOpen = openCase !== i;
    setOpenCase(willOpen ? i : -1);
    setCaseWeek(0);
    if (willOpen && el) {
      setTimeout(() => {
        if (window.__lenis) { window.__lenis.scrollTo(el, { offset: -90 }); return; }
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      }, 70);
    }
  };
  const openApply = useApply();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  // BackgroundField asks a student their college and a graduate their year.
  // Those ride in their own fields, not in the background string, so spread
  // the reported object — it always carries both keys, which is what clears
  // the stale one when someone switches group.
  const setDetail = (d) => setForm((f) => ({ ...f, ...d }));
  const handleBrochure = async (e) => {
    e.preventDefault();
    try {
      await verifyAndDownloadBrochure({
        name: form.name,
        email: form.email,
        countryCode: form.countryCode,
        phone: form.phone,
        program: 'engineering',
        background: form.background,
        college: form.college, graduation_year: form.graduation_year,
        resource: 'AI FDE Fellowship Brochure',
        source: 'engineering-page',
        cta_label: 'Brochure: AI FDE',
        section: 'AI FDE Fellowship',
      });
      setDone(true);
    } catch { /* keep form open for retry */ }
  };

  return (
    <>
      {/* The Course, FAQ and breadcrumb structured data is baked into the HTML by
          scripts/prerender.mjs — a second Course added here would be a thinner
          duplicate, with no price or schedule. */}
      <Seo
        title="AI FDE Fellowship — Forward Deployed AI Engineer Program India | Menler"
        description="A 12-week AI Forward Deployed Engineer fellowship. Six real-world cases, built with Claude and defended to a client panel — from first interview to handover."
        keywords="AI FDE fellowship, forward deployed engineer, forward deployed AI engineer course India, AI engineering fellowship, Claude AI engineering, Claude Agent SDK, MCP, RAG, AI evaluation, AI deployment, AI specialist program India"
        path="/engineering"
      />
      {/* ── HERO + WHO THIS IS FOR (one screen together) ── */}
      <div className="hero-screen">
      {/* ── HERO ── */}
      <section className="hero hero-big" style={{ background: '#085041', padding: '66px clamp(20px, 6vw, 40px) 54px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(93,202,165,0.1)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(93,202,165,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#5DCAA5' }}>AI FDE Fellowship · Bengaluru, India</p>
          <h1 className="hero-h1" style={{ color: '#E1F5EE' }}>Twelve weeks. Six real-world cases.<br /><em style={{ color: '#9FE1CB' }}>Defended, not just delivered.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>Train as a Forward Deployed AI Engineer: sit with a client, frame a messy problem and own the solution from first interview to handover.<strong className="hero-tagline" style={{ color: '#E1F5EE', fontWeight: 500 }}>Graded on whether you can defend what you built.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#1D9E75', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#9FE1CB', borderColor: 'rgba(93,202,165,0.5)', minWidth: 220, textAlign: 'center' }} onClick={() => go('/aptitude')}>Take the AI Aptitude Test</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weeks<br />Sat + Sun</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>6</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Real-world<br />cases</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weekly<br />assignments</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>6</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Milestone<br />projects</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>100</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Competencies<br />cleared</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#E1F5EE', paddingTop: 24, paddingBottom: 20 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Who this is for</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Built for people who will be<br /><em style={{ color: 'var(--placed)' }}>questioned on their decisions.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>For anyone who wants to deliver AI systems to real clients — comfortable reading code, working in a terminal and defending decisions in front of a panel.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>1</div><p className="audience-role">Engineers</p><p className="audience-desc">Write the core components and take on the stretch builds.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>2</div><p className="audience-role">Analysts</p><p className="audience-desc">Direct Claude Code, own the tests and defend the numbers.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>3</div><p className="audience-role">Consultants</p><p className="audience-desc">Run discovery, frame the problem and own the client.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>4</div><p className="audience-role">Technical product people</p><p className="audience-desc">Turn a messy operational problem into a shipped system.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>5</div><p className="audience-role">Early-career graduates</p><p className="audience-desc">Ready to work at a client-facing standard from week one.</p></div>
        </div>
      </section>
      </div>

      {/* ── TWO TRACKS ── */}
      <section className="section" style={{ background: 'white', paddingBottom: 12 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Two tracks, one standard</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Builder or Engineer.<br /><em style={{ color: 'var(--placed)' }}>Same bar, same defence.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Python or JavaScript at reading level. Builder-track learners need not have written production code. API credits for the programme are provided by Menler.</p>
        <div className="audience-grid fde-tracks">
          {FDE_TRACKS.map((t, i) => (
            <div className="audience-card" key={t.name}>
              <div className="ava" style={i === 0 ? { background: '#E1F5EE', color: '#085041' } : { background: 'var(--cloud)', color: 'var(--specialist)' }}>{i + 1}</div>
              <p className="audience-role">{t.name}</p>
              <p className="audience-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURRICULUM ── one row per two-week case; open it for its weeks,
          topics, project and tools (src/data/fdeCurriculum.js). */}
      <section className="section curric-section--gen curric-section--fde" style={{ background: 'white' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>12-week curriculum</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Frame the problem. Build the system.<br /><em style={{ color: 'var(--placed)' }}>Prove it works. Defend it to the client.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Six two-week case blocks, each built from a public problem in an Indian industry. Week A frames the problem and builds the foundation; Week B completes, hardens and tests it. Every block ends in a Case Defence on the second Sunday.</p>
        <div className="curric-acc">
          {FDE_CASES.map((c, i) => {
            const open = openCase === i;
            const week = c.modules[caseWeek] || c.modules[0];
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={c.label}>
                <button className="curric-acc-head" onClick={(e) => toggleCase(i, e.currentTarget)} aria-expanded={open}>
                  <span className="curric-acc-no">{c.label} · {c.weeks}</span>
                  <span className="curric-acc-title">{c.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    <div className="curric-detail--split curric-detail--triple">
                      <div className="curric-detail-main">
                        <p className="curric-label">Weeks</p>
                        <ul className="curric-weeks">
                          {c.modules.map((m, wi) => (
                            <li key={m.w} className={`curric-week${caseWeek === wi ? ' on' : ''}`}>
                              <button className="curric-week-head" onClick={() => setCaseWeek(wi)} aria-pressed={caseWeek === wi}>
                                <span className="curric-week-title">{m.w}</span>
                                <span className="curric-week-caret">›</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="curric-detail-mid">
                        <p className="curric-label">What you learn</p>
                        <ul className="curric-modules">
                          {week.lessons.map((l) => <li key={l}>{l}</li>)}
                        </ul>
                        <p className="curric-label" style={{ marginTop: 28 }}>Project you&rsquo;ll build &amp; defend</p>
                        <ul className="curric-modules">
                          {c.projects.map((pr) => <li key={pr}>{pr}</li>)}
                        </ul>
                      </div>
                      <div className="curric-detail-tools">
                        <p className="curric-label">Identity shift</p>
                        <p className="fde-shift">{week.shift}</p>
                        <p className="curric-label" style={{ marginTop: 24 }}>Tool stack</p>
                        <div className="curric-tools">
                          {c.tools.map((t) => <span className="fde-tool" key={t}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="section-sub fde-rhythm" style={{ maxWidth: 'none' }}>Saturday and Sunday, 2 live hours each · 7–8 hours of outside work a week · pods of five, one mentor for every two pods · graded by defence: 80 of 100 competencies plus a capstone pass.</p>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: '#E1F5EE' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>What you leave with</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Evidence, judgment<br /><em style={{ color: 'var(--placed)' }}>and a cohort.</em></h2>
        <div className="audience-grid fde-outcomes">
          {FDE_OUTCOMES.map((o, i) => (
            <div className="audience-card" key={o.t}>
              <div className="ava" style={{ background: 'white', color: '#085041' }}>{i + 1}</div>
              <p className="audience-role">{o.t}</p>
              <p className="audience-desc">{o.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail labelStyle={{ color: 'var(--forest)' }} titleStyle={{ color: 'var(--forest)' }} />

      {/* ── HIRING PARTNERS & ROLES ── */}
      <HiringJobs {...ENG_HIRING} subStyle={{ maxWidth: 'none' }} />

      {/* ── LEAD FORM ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3 style={{ color: 'var(--forest)' }}>Get the AI FDE <em style={{ color: 'var(--placed)' }}>brochure & curriculum</em>.</h3>
            <p>Syllabus, schedule, fees &amp; scholarships — verify your number and download it instantly.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Brochure downloading.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleBrochure}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <PhoneField countryCode={form.countryCode} phone={form.phone} onCountryCode={(v) => set('countryCode', v)} onPhone={(v) => set('phone', v)} />
              <BackgroundField label="You are…" onChange={(v) => set('background', v)} onDetail={setDetail} />
              <button type="submit">Verify &amp; Download</button>
              {!isSmsReachable(form.countryCode) && form.phone.length >= phoneMinLength(form.countryCode) && (
                <p className="mini-lead-hint">We can only text Indian numbers — your code will arrive by email.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>FAQ</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>AI FDE Fellowship FAQ</h2>
        <FaqList items={ENGINEERING_FAQS} />
      </section>

      <CtaBanner
        badge="Applications open · 30 seats"
        title="Ready to deliver AI to real clients?"
        subtitle="Twelve weeks. Six cases. Every one defended."
        buttonText="Apply Now"
        buttonStyle={{ color: 'var(--forest)' }}
        sectionStyle={{ background: 'var(--forest)' }}
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
