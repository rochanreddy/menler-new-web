import { useState, useRef, useEffect } from 'react';
import { FDE_PHASES, FDE_AUDIENCE, FDE_HIGHLIGHTS, FDE_START, FDE_SEO, FDE_GUIDE } from '../data/fdeCurriculum';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import PlaybookModal from '../components/common/PlaybookModal';
import PayModal from '../components/common/PayModal';
import PricingCard from '../components/common/PricingCard';
import ToolChip from '../components/common/ToolChip';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import { ENGINEERING_FAQS } from '../data/faqData';
import { verifyAndDownloadBrochure } from '../lib/brochure';
import PhoneField from '../components/forms/PhoneField';
import { isSmsReachable, phoneMinLength } from '../lib/phone';
import BackgroundField from '../components/forms/BackgroundField';
import { FDE_PATH } from '../lib/routes';

// The AI Forward Deployed Engineer course page. Same flow as the Generalist
// page: hero, who it is for, curriculum, highlights, brochure, mentors,
// hiring, pricing, FAQ, CTA. Lives at FDE_PATH (src/lib/routes.js).
const CURRICULUM_PDF = '/pdfs/Menler_AI_FDE_Fellowship_Curriculum.pdf';

// Hiring section content for this page only — edit freely, it does NOT
// affect the Generalist / Kickstarter hiring sections.
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
    { name: 'AI Forward Deployed Engineer', band: '₹25–50L · AI-first teams' },
    { name: 'AI Engineer', band: '₹20–40L · Product & AI teams' },
    { name: 'Solutions Engineer', band: '₹22–45L · AI Native startups' },
    { name: 'RAG Engineer', band: '₹22–40L · Knowledge systems teams' },
    { name: 'Agent Engineer', band: '₹24–45L · Agentic AI companies' },
    { name: 'AI Product Engineer', band: '₹20–38L · Product organizations' },
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

// Pricing card content.
const FDE_PRICING = {
  pill: 'Flagship Engineering Programme',
  name: 'AI FDE Fellowship',
  price: '75,000',
  priceSub: 'incl. all taxes · EMI from ₹4,999/month',
  features: [
    ['48 hrs live instruction over 12 weeks', 'Instructor led · real questions in real time'],
    ['Build live projects with mentors', 'Six deployed builds · one per real case'],
    ['LMS + community · 1-year access', 'Recordings, resources, and cohort community'],
    ['1:1 doubt-solving sessions', 'Direct mentor access · no question left behind'],
    ['Interview pipeline + placement support', "LinkedIn review · Menler's hiring network"],
    ['Menler AI FDE Certification', 'Menler-certified · LinkedIn shareable'],
  ],
  chips: [
    { label: 'Start date', value: FDE_START.label },
    { label: 'Duration', value: '12 Weeks' },
    { label: 'Sessions', value: '24 Live · 48 hrs' },
    { label: 'Format', value: 'Live online' },
  ],
};

export default function Engineering() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', background: '', college: '', graduation_year: '' });
  const [done, setDone] = useState(false);
  // Download Curriculum → gated lead form (email OTP) that downloads the PDF.
  const [curricItem, setCurricItem] = useState(null);
  const [payProgram, setPayProgram] = useState(null); // direct Cashfree enrolment
  // Curriculum: which phase is open (-1 = none) and which of its weeks is shown.
  const [activePhase, setActivePhase] = useState(0);
  const [phaseWeek, setPhaseWeek] = useState(0);
  const weekDetailRef = useRef(null);
  // The hero stats count up a moment after the page opens.
  const [heroGo, setHeroGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroGo(true), 450);
    return () => clearTimeout(t);
  }, []);

  // Select a week. On mobile, the lesson plan stacks below the week list, so
  // scroll it into view (after re-render) — same UX as the Generalist page.
  const pickWeek = (wi) => {
    setPhaseWeek(wi);
    if (window.matchMedia('(max-width: 760px)').matches) {
      requestAnimationFrame(() => {
        const el = weekDetailRef.current;
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const openApply = useApply();
  // Distinct CTA label per button so the CRM can tell Apply / Book a Call /
  // Enrol apart (section stays the course name).
  const openFdeLead = (ctaLabel = 'Apply · AI FDE') => openApply({
    ctaLabel,
    source: 'engineering-lead',
    section: 'AI FDE Fellowship',
  });
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
    <div className="fde-page">
      {/* The Course, FAQ and breadcrumb structured data is baked into the HTML by
          scripts/prerender.mjs — a second Course added here would be a thinner
          duplicate, with no price or schedule. */}
      <Seo
        title={FDE_SEO.title}
        description={FDE_SEO.description}
        keywords={FDE_SEO.keywords}
        path={FDE_PATH}
      />
      {/* ── HERO + WHO THIS IS FOR (one screen together) ── */}
      <div className="hero-screen">
      {/* ── HERO ── */}
      <section className="hero hero-big fde-hero" style={{ background: '#085041', padding: '66px clamp(20px, 6vw, 40px) 68px' }}>
        <div className="fde-aurora" aria-hidden="true"><span /><span /></div>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(93,202,165,0.1)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(93,202,165,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#5DCAA5' }}>AI Engineering Course · Claude AI FDE Fellowship</p>
          <h1 className="hero-h1" style={{ color: '#E1F5EE' }}>Build AI Systems.<br /><em style={{ color: '#9FE1CB' }}>Become an AI FDE.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(225,245,238,0.6)' }}>India&rsquo;s only Claude-first AI Forward Deployed Engineer Fellowship.<strong className="hero-tagline" style={{ color: '#E1F5EE', fontWeight: 500 }}><span className="fde-tag-line">Engineering that ships.</span>{' '}<span className="fde-tag-line">Clients that sign.</span>{' '}<span className="fde-tag-line">A portfolio that proves it.</span></strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#1D9E75', minWidth: 220, textAlign: 'center' }} onClick={() => openFdeLead('Apply · AI FDE')}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#9FE1CB', borderColor: 'rgba(93,202,165,0.5)', minWidth: 220, textAlign: 'center' }} onClick={() => go('/aptitude')}>Take the AI Aptitude Test</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}><CountUp value="100+" run={heroGo} /></span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Engineering<br />Competencies</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}><CountUp value="25+" run={heroGo} delay={80} /></span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Hiring<br />Associations</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}><CountUp value="12" run={heroGo} delay={160} /></span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weeks Intensive<br />Fellowship</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}><CountUp value="6" run={heroGo} delay={240} /></span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Real Case<br />Engagements</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}><CountUp value="6" run={heroGo} delay={320} /></span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Production<br />Grade Projects</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#E1F5EE', paddingTop: 24, paddingBottom: 20 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Who this is for</p>
        <h2 className="section-h2" style={{ '--i': 1, color: 'var(--forest)' }}>You already code.<br /><em style={{ color: 'var(--placed)' }}>Now build with AI.</em></h2>
        <p className="section-sub" style={{ '--i': 2 }}>The AI Native products of the next decade{' '}<br />will be built by engineers who know how to work with AI.</p>
        <div className="audience-grid">
          {FDE_AUDIENCE.map((a, i) => (
            <div className="audience-card" key={a.role} style={{ '--i': i + 2 }}>
              <div className="ava" style={AVA_STYLES[i % AVA_STYLES.length]}>{i + 1}</div>
              <p className="audience-role">{a.role}</p>
              <p className="audience-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* ── CURRICULUM ── three phases of four weeks (src/data/fdeCurriculum.js). */}
      <section className="section curric-section--gen curric-section--fde" style={{ background: 'white', paddingTop: 48 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>12-week AI engineering curriculum</p>
        <h2 className="section-h2" style={{ '--i': 1, color: 'var(--forest)' }}>From prompt<br /><em style={{ color: 'var(--placed)' }}>to production.</em></h2>
        <p className="section-sub" style={{ '--i': 2 }}>Three phases, six real client cases and 100+ engineering competencies.{' '}<br />Pick a phase to open its weeks, tools and builds.</p>
        <div className="curric-acc" style={{ '--i': 3 }}>
          {FDE_PHASES.map((p, i) => {
            const open = activePhase === i;
            const week = p.modules[phaseWeek] || p.modules[0];
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={p.label}>
                <button className="curric-acc-head" onClick={(e) => {
                  const willOpen = !open;
                  setActivePhase(willOpen ? i : -1);
                  setPhaseWeek(0);
                  if (willOpen) {
                    const el = e.currentTarget;
                    setTimeout(() => {
                      if (window.__lenis) { window.__lenis.scrollTo(el, { offset: -90 }); return; }
                      const y = el.getBoundingClientRect().top + window.scrollY - 90;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 70);
                  }
                }} aria-expanded={open}>
                  <span className="curric-acc-no">{p.label} · {p.weeks}</span>
                  <span className="curric-acc-title">{p.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    <div className="curric-detail--split curric-detail--triple">
                      <div className="curric-detail-main">
                        <p className="curric-label">Modules</p>
                        <ul className="curric-weeks">
                          {p.modules.map((m, wi) => (
                            <li key={m.w} className={`curric-week${phaseWeek === wi ? ' on' : ''}`}>
                              <button className="curric-week-head" onClick={() => pickWeek(wi)} aria-pressed={phaseWeek === wi}>
                                <span className="curric-week-title">{m.w}</span>
                                <span className="curric-week-caret">›</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="curric-detail-mid" ref={weekDetailRef} style={{ scrollMarginTop: 90 }}>
                        <p className="curric-label">Lesson plan</p>
                        <ul className="curric-modules">
                          {week.lessons.map(l => <li key={l}>{l}</li>)}
                        </ul>
                        <p className="curric-label" style={{ marginTop: 28 }}>Projects you&rsquo;ll build</p>
                        <ul className="curric-modules">
                          {p.projects.map(pr => <li key={pr}>{pr}</li>)}
                        </ul>
                      </div>
                      <div className="curric-detail-tools">
                        <p className="curric-label">Tool stack</p>
                        <div className="curric-tools">
                          {p.tools.map(t => <ToolChip key={t} name={t} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" style={{ background: '#1D9E75' }} onClick={() => setCurricItem({ title: 'AI FDE Fellowship Curriculum', pdf: CURRICULUM_PDF, badge: 'Curriculum', desc: 'Full 12-week programme: the six cases, every session, weekly assignments, milestone projects and the grading rubric.', source: 'curriculum-download', section: 'AI FDE Curriculum' })}>Download Curriculum</button>
        </div>
      </section>

      {/* ── PROGRAM HIGHLIGHTS ── where the Generalist page has its domain tracks. */}
      <section className="section tracks-dark tracks-dark--fde" style={{ paddingTop: 48 }}>
        <p className="section-label" style={{ color: '#5DCAA5' }}>Program highlights</p>
        <h2 className="section-h2" style={{ '--i': 1, color: '#E1F5EE' }}>Everything an AI FDE does.<br /><em style={{ color: '#9FE1CB' }}>Real time and real builds.</em></h2>
        <p className="section-sub" style={{ '--i': 2, color: 'rgba(225,245,238,0.55)' }}>Twelve weeks of real briefs, real builds and real deadlines.{' '}<br />You don&rsquo;t watch AI get shipped. You deploy it.</p>
        <div className="fde-hl-grid">
          {FDE_HIGHLIGHTS.map((h, i) => (
            <div key={h.label} className="fde-hl-card" style={{ '--i': i }}>
              <div className="fde-hl-inner">
                <span className="fde-hl-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{HL_ICONS[h.icon]}</svg></span>
                <p className="fde-hl-name">{h.num} {h.label}</p>
                <p className="fde-hl-desc">{h.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEAD FORM (brochure) ── */}
      <section className="mini-lead" style={{ paddingTop: 48 }}>
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

      {/* ── MENTORS ── */}
      <div><MentorsRail style={{ paddingTop: 48 }} labelStyle={{ color: 'var(--forest)' }} titleStyle={{ color: 'var(--forest)' }} /></div>

      {/* ── HIRING PARTNERS & ROLES ── */}
      <div><HiringJobs {...ENG_HIRING} /></div>

      {/* ── PRICING ── */}
      <section className="section kp-section fde-pricing" style={{ background: '#ffffff', paddingTop: 8 }}>
        <p className="section-label" style={{ textAlign: 'center', color: 'var(--forest)' }}>Pricing</p>
        <h2 className="section-h2" style={{ '--i': 1, textAlign: 'center', color: 'var(--forest)' }}>One fellowship. <em style={{ color: 'var(--placed)' }}>Everything shipped.</em></h2>
        <p className="section-sub" style={{ '--i': 2, textAlign: 'center', margin: '0 auto 32px' }}>Twelve weeks of Claude-first engineering, real client cases and placement support.</p>
        <div style={{ '--i': 3 }}><PricingCard
          {...FDE_PRICING}
          tagline=""
          ctaLabel="Enrol Now"
          // Two lines, like the Generalist card: .kp-desc keeps each on one row on desktop.
          description={<>Ship your AI engineering portfolio in 12 weeks.<span className="kp-desc-line2">RAG, agents and MCP servers, built on real Indian cases.</span></>}
          onCta={() => setPayProgram('engineering')}
        /></div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="btn-primary" style={{ minWidth: 220, background: '#1D9E75' }} onClick={() => openFdeLead('Book a Call · AI FDE')}>Book a Call</button>
        </div>
      </section>

      {/* ── AI ENGINEERING COURSE GUIDE ── plain answers to what people search
          before choosing a course; the same words are baked into the static
          HTML by prerender. */}
      <section className="section fde-guide" aria-labelledby="fde-guide-h">
        <p className="section-label" style={{ textAlign: 'center', color: 'var(--forest)' }}>AI engineering course guide</p>
        <h2 id="fde-guide-h" className="section-h2" style={{ '--i': 1, textAlign: 'center', color: 'var(--forest)' }}>Everything about this <em style={{ color: 'var(--placed)' }}>AI engineering course.</em></h2>
        <p className="section-sub" style={{ '--i': 2, textAlign: 'center', margin: '0 auto' }}>Generative AI, RAG, agentic AI and MCP, taught live and built for production.</p>
        <div className="fde-guide-grid">
          {FDE_GUIDE.blocks.map((b) => (
            <article key={b.h} className={b.wide ? 'fde-guide-card is-wide' : 'fde-guide-card'}>
              <h3>{b.h}</h3>
              {b.p && <p>{b.p}</p>}
              {b.chips && (
                <ul className="fde-guide-chips">
                  {b.chips.map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>
        <div className="fde-compare-wrap">
          <h3 className="fde-compare-h">AI Engineer vs Forward Deployed Engineer vs ML Engineer</h3>
          <div className="fde-compare-scroll">
            <table className="fde-compare">
              <thead>
                <tr>{FDE_GUIDE.compare.head.map((h, i) => (i ? <th key={h} scope="col">{h}</th> : <td key="corner" />))}</tr>
              </thead>
              <tbody>
                {FDE_GUIDE.compare.rows.map(([label, ...cells]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {cells.map((c, i) => <td key={i}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── each question is an H3 (FAQPage schema is baked in by prerender). */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center', paddingTop: 48 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>FAQ</p>
        <h2 className="section-h2" style={{ '--i': 1, color: 'var(--forest)' }}>AI engineering course: <em style={{ color: 'var(--placed)' }}>your questions answered</em></h2>
        <div style={{ '--i': 2 }}><FaqList items={ENGINEERING_FAQS} headings /></div>
      </section>

      <div><CtaBanner
        badge="Applications open · 30 seats"
        title="Ready to become an AI Forward Deployed Engineer?"
        subtitle="Twelve weeks. Six real cases. One production portfolio."
        buttonText="Apply Now"
        buttonStyle={{ color: 'var(--forest)' }}
        style={{ background: 'var(--forest)' }}
        onButtonClick={() => openFdeLead('Apply · AI FDE')}
      /></div>

      <Footer />

      <PlaybookModal item={curricItem} onClose={() => setCurricItem(null)} />
      {payProgram && <PayModal program={payProgram} onClose={() => setPayProgram(null)} />}
    </div>
  );
}

/* Counts a figure up from zero once `run` turns true ("6+" keeps its "+").
   Reduced motion, or a value that isn't a number, shows the final figure. */
// Line icons for the Program highlights cards, drawn on a 24 grid.
const HL_ICONS = {
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" /></>,
  live: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  check: <><rect x="5" y="4" width="14" height="16" rx="2.5" /><path d="M8.5 12.5l2.3 2.3 4.7-4.8" /></>,
  rocket: <><path d="M12 3c3.5 2 5 5.5 5 9l-2.5 3h-5L7 12c0-3.5 1.5-7 5-9z" /><circle cx="12" cy="9.5" r="1.6" /><path d="M9.5 18l-1.5 3M14.5 18l1.5 3M12 18v3" /></>,
  case: <><rect x="3.5" y="7" width="17" height="12" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" /></>,
};

function CountUp({ value, run, delay = 0, duration = 1100 }) {
  const m = String(value).match(/^(\d+)(.*)$/);
  const target = m ? Number(m[1]) : null;
  const [n, setN] = useState(0);
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (!run || target === null || still) return undefined;
    let raf;
    let start;
    const step = (t) => {
      if (start === undefined) start = t + delay;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      setN(Math.round(target * (1 - (1 - p) ** 3)));   // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, delay, duration, still]);
  if (target === null || still) return value;
  return <>{run ? n : 0}{m[2]}</>;
}

// Avatar colours for the five audience cards, matching the Generalist page.
const AVA_STYLES = [
  { background: 'var(--cloud)', color: 'var(--specialist)' },
  { background: '#E1F5EE', color: '#085041' },
  { background: '#FAEEDA', color: '#854F0B' },
  { background: '#FCEBEB', color: '#A32D2D' },
  { background: '#F1EFE8', color: '#5F5E5A' },
];
