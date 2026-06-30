import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import { useApply } from '../components/common/ApplyContext';

const PRODUCT_FILTERS = ['all', 'kickstarter', 'generalist', 'engineering'];

const PRODUCTS = [
  { group: 'generalist', tag: 'Generalist · Marketing', thumbCls: '', icon: 'Aa', name: 'Lyra Brand Voice Engine', desc: "A Claude Skill trained on Lyra Brands' tone. Powers all D2C content — blog, ads, support. Cuts content cost 70%.", meta: 'Built by Anjali V. · In production at Lyra Brands' },
  { group: 'engineering', tag: 'Engineering · RAG', thumbCls: 'eng', icon: 'Rg', name: 'FlexLegal Contract RAG', desc: 'Legal-grade RAG that indexes 12k contracts and answers compliance queries with citations. Used by 4 in-house teams.', meta: 'Built by Karan I. · Deployed at FlexLegal Inc.' },
  { group: 'generalist', tag: 'Generalist · Finance', thumbCls: '', icon: 'Vc', name: 'Caldera Deal Flow Agent', desc: 'Cowork-driven agent that screens 200+ decks/month, drafts memos, and flags red-flags grounded in fund thesis.', meta: 'Built by Aman K. · Used at Caldera Ventures' },
  { group: 'engineering', tag: 'Engineering · MCP', thumbCls: 'eng', icon: 'Mc', name: 'Postmark MCP Server', desc: 'Production MCP that exposes 9 marketing tools to Claude Desktop. Adopted by 3 partner agencies.', meta: 'Built by Neha S. · Open-sourced' },
  { group: 'kickstarter', tag: 'Kickstarter · Capstone', thumbCls: 'kick', icon: 'Sp', name: 'JEE Companion Agent', desc: 'A Claude-powered study planner used by a Class-12 cohort in Pune. Adopted by 60+ students this term.', meta: 'Built by Sahil M. · Class 12, Pune' },
  { group: 'generalist', tag: 'Generalist · Operations', thumbCls: '', icon: 'Op', name: 'Helix SOP Automation', desc: 'SOP-driven Claude workflow that triages and routes 300+ support tickets/day with audit logs.', meta: 'Built by Rohit T. · Live at Helix Logistics' },
];

const BIP_POSTS = [
  { initials: 'AV', name: 'Anjali Verma', platform: 'LinkedIn · Week 8 · Generalist', text: '"Just shipped a Brand Voice Engine for Lyra. Cut their content cost 70%. Here\'s the full prompt + Skill walkthrough →"', reactions: '1.2k reactions' },
  { initials: 'KI', name: 'Karan Iyer', platform: 'GitHub · Week 11 · Engineering', text: '"flexlegal-rag — production RAG over 12,000 legal contracts. Citations + RAGAS evals. ⭐ 220"', reactions: '220 stars' },
  { initials: 'SM', name: 'Sahil Mehta', platform: 'Twitter · Day 14 · Kickstarter', text: '"My class-12 friends are using my JEE study agent. 60 users in 2 weeks. Built in 14 days at @MenlerAI"', reactions: '340 likes' },
  { initials: 'NS', name: 'Neha Subramanian', platform: 'LinkedIn · Week 9 · Engineering', text: '"Multi-agent research system on the Claude Agent SDK. Lead agent + 4 specialists. Recording + repo in comments."', reactions: '2.4k reactions' },
  { initials: 'RT', name: 'Rohit Tandon', platform: 'LinkedIn · Week 10 · Generalist', text: '"I\'m a finance guy. I built an earnings-call insight engine in Claude in Excel. Saved my team 12 hours/week."', reactions: '890 reactions' },
  { initials: 'AK', name: 'Aman Kapoor', platform: 'Twitter · Week 7 · Generalist', text: '"Cowork as a VC associate. Memos that took 4 hours now take 25 minutes. Here\'s the workflow →"', reactions: '610 likes' },
  { initials: 'DR', name: 'Divya Rao', platform: 'GitHub · Week 12 · Engineering', text: '"claude-evals-toolkit — a drop-in evals harness for production Claude apps. Open-sourced today."', reactions: '180 stars' },
  { initials: 'SM2', name: 'Sneha Menon', platform: 'LinkedIn · Week 6 · Generalist', text: '"30-day content engine for a Tier-2 D2C brand. Posts written, designed, scheduled. By Claude. By me."', reactions: '1.5k reactions' },
  { initials: 'PR', name: 'Priya Raman', platform: 'Twitter · Week 9 · Generalist', text: '"My CEO asked for a Monday briefing agent. I built it in a weekend at Menler. He wants every senior to use it."', reactions: '420 likes' },
];

const PLACEMENT_STORIES = [
  { arch: 'Career switcher', quote: '"Six months ago I was a marketing manager drowning in content briefs. Today I run a four-person Claude-native content team — at 2.4× my old salary."', meta: 'Anjali Verma · Generalist Cohort 01 · Marketing track', before: 'Mktg Mgr · ₹9L', after: 'Marketing Lead · Lyra · ₹22L', afterDays: '60 days' },
  { arch: 'Engineer step-up', quote: '"Spring Boot dev with zero LLM experience when I joined. The capstone — a multi-agent system on Claude Agent SDK — got me four offers. I picked the YC one."', meta: 'Karan Iyer · Engineering Cohort 01 · Founding AI Engineer at Loomwise (YC F25)', before: 'Backend SDE · ₹18L', after: 'Founding AI Eng · ₹38L + ESOPs', afterDays: '77 days' },
  { arch: 'Fresher', quote: '"Final-year mechanical engineering student. Pivoted to AI through Generalist. The capstone landed me an AI Analyst role at a fintech before I\'d even graduated."', meta: 'Riya Shenoy · Generalist Cohort 01 · Finance track', before: 'Final-year ME · No offers', after: 'AI Finance Analyst · ₹16L', afterDays: '45 days' },
  { arch: "Founder hire", quote: '"Got hired into the Founder\'s Office at a Series-B SaaS. I run their Claude weekly briefing, deal-eval workflow, and exec reporting agent. I was an analyst 5 months ago."', meta: "Priya Raman · Generalist Cohort 01 · Founder's Office track", before: 'Strategy Analyst · ₹12L', after: 'AI Specialist, CEO office · ₹26L', afterDays: '90 days' },
];

export default function Outcomes() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const openApply = useApply();
  const [productFilter, setProductFilter] = useState('all');

  const filteredProducts = productFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.group === productFilter);

  return (
    <>
      <Seo
        title="AI Placement & Outcomes — AI Jobs After the Fellowship | Menler"
        description="Placement outcomes from the Menler AI fellowship — salary bands, hiring partners, fellow portfolios and AI jobs after the program."
        keywords="AI placement programs, AI jobs after AI course, AI career outcomes India, AI fellowship placement, AI salaries India"
        path="/outcomes"
      />
      {/* ── HERO ── */}
      <section className="hero hero-centered" style={{ background: '#1A1647', padding: '64px clamp(22px, 6vw, 40px) 40px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(175,169,236,0.12)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(175,169,236,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: 'var(--lavender)' }}>Outcomes · Real proof</p>
          <h1 className="hero-h1" style={{ color: '#EEEDFE' }}>Proof, not promises.<br /><em style={{ color: 'var(--lavender)' }}>The Menler outcome.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(238,237,254,0.7)' }}>Capstone products built by students. Public projects shipped during the program. Real placement stories from real alumni. Real lives changed across India. Every metric on this page is auditable. We earn trust by showing receipts.</p>
          <div className="outcomes-stats">
            <div><p>90<em>%</em></p><p>Placement target</p></div>
            <div><p>₹18L<em>+</em></p><p>Median offer</p></div>
            <div><p>200<em>+</em></p><p>Projects shipped</p></div>
            <div><p>25<em>+</em></p><p>Hiring partners</p></div>
            <div><p>1k<em>+</em></p><p>Alumni & growing</p></div>
          </div>
        </div>
      </section>

      {/* ── REAL PRODUCTS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Section 1 · Real products</p>
        <h2 className="section-h2">The flagships.<br /><em>Capstone products in the wild.</em></h2>
        <p className="section-sub" style={{ maxWidth: 680, margin: '14px auto 0', textAlign: 'center' }}>Six student-built products that exist as real tools, used by real organisations. Each was a Menler capstone.</p>
        <div className="filter-chips">
          {PRODUCT_FILTERS.map(f => (
            <button key={f} className={`filter-chip${productFilter === f ? ' on' : ''}`} onClick={() => setProductFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filteredProducts.map((p, i) => (
            <div key={i} className="product-card">
              <div className={`product-thumb ${p.thumbCls}`}><span className="product-thumb-icon">{p.icon}</span></div>
              <div className="product-body">
                <span className="product-tag">{p.tag}</span>
                <p className="product-name">{p.name}</p>
                <p className="product-desc">{p.desc}</p>
                <p className="product-meta">{p.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUILD IN PUBLIC ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Section 2 · Build in Public</p>
        <h2 className="section-h2">Receipts on LinkedIn.<br /><em>Receipts on Twitter. Receipts on GitHub.</em></h2>
        <p className="section-sub" style={{ maxWidth: 680, margin: '14px auto 0', textAlign: 'center' }}>Wall of public student work shipped during the program. Real posts. Real engagement. Real momentum.</p>
        <div className="bip-grid">
          {BIP_POSTS.map((b, i) => (
            <div key={i} className="bip-card">
              <div className="bip-head">
                <div className="bip-avatar">{b.initials}</div>
                <div><p className="bip-name">{b.name}</p><p className="bip-platform">{b.platform}</p></div>
              </div>
              <p className="bip-text">{b.text}</p>
              <p className="bip-engagement"><span>{b.reactions}</span><span>View post</span></p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--specialist)', marginTop: 32, fontFamily: "'DM Serif Display',serif", fontSize: 18 }}>This is what twelve weeks of building looks like.</p>
      </section>

      {/* ── PLACEMENTS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Section 3 · Placements</p>
        <h2 className="section-h2">Where they landed.<br /><em>How they got there.</em></h2>
        <p className="section-sub" style={{ maxWidth: 680, margin: '14px auto 0', textAlign: 'center' }}>Four archetypes. Four real stories. Each one started where you might be standing right now.</p>
        <div className="placement-stories">
          {PLACEMENT_STORIES.map((s, i) => (
            <article key={i} className="placement-card">
              <span className="placement-arch">{s.arch}</span>
              <p className="placement-quote">{s.quote}</p>
              <p className="placement-meta" dangerouslySetInnerHTML={{ __html: s.meta.replace(/^([^·]+)/, '<strong>$1</strong>') }} />
              <div className="before-after">
                <div className="ba-col"><p className="ba-label">Before</p><p className="ba-val">{s.before}</p></div>
                <div className="ba-arrow">→</div>
                <div className="ba-col after"><p className="ba-label">After ({s.afterDays})</p><p className="ba-val">{s.after}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="section" style={{ background: '#062B22' }}>
        <p className="section-label" style={{ color: '#9FE1CB' }}>Section 4 · Impact</p>
        <h2 className="section-h2" style={{ color: '#E1F5EE' }}>Real lives.<br /><em style={{ color: '#9FE1CB' }}>Real income. Real shifts.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(225,245,238,0.65)', textAlign: 'center', maxWidth: 680, margin: '14px auto 0' }}>Beyond the metrics, the part that matters most. Stories of careers, families, and futures changed by twelve weeks of work.</p>
        <div className="impact-stats-strip">
          <div><p>₹14Cr+</p><p>Annual alumni earnings unlocked</p></div>
          <div><p>34%</p><p>Women placed</p></div>
          <div><p>41%</p><p>From Tier-2 / Tier-3 cities</p></div>
          <div><p>22%</p><p>First-generation learners</p></div>
        </div>
        <div className="impact-stories">
          <article className="impact-card">
            <p className="impact-archetype">From Tier-3 city</p>
            <p className="impact-headline">"My family moved to a real apartment in three months."</p>
            <p className="impact-body">Sruthi joined the Generalist track from a small town in Andhra. Her first AI Specialist offer at a Bengaluru fintech — ₹18L — let her parents move out of a one-room rented unit they'd lived in for sixteen years. She still sends back her old town for the festivals. She just doesn't live there any more.</p>
          </article>
          <article className="impact-card">
            <p className="impact-archetype">First-generation learner</p>
            <p className="impact-headline">"My father drives an auto. I'm a Founding AI Engineer."</p>
            <p className="impact-body">Karan's parents didn't know what an LLM was when he applied. Twelve weeks later, they watched him present his capstone at Demo Day on a Loom video they replayed eleven times. The YC-backed Loomwise made him an offer the next morning. His father still drives, but only when he wants to.</p>
          </article>
          <article className="impact-card">
            <p className="impact-archetype">Educator turned multiplier</p>
            <p className="impact-headline">"I teach Claude to my classroom now."</p>
            <p className="impact-body">Vandana taught Class-9 social studies in Pune for fourteen years. She took the Kickstarter to keep up with her students. Six months later, her school appointed her AI lead. She runs an after-school AI club for sixty kids. Many will end up in the next Kickstarter cohort.</p>
          </article>
        </div>
        <p style={{ textAlign: 'center', color: '#9FE1CB', marginTop: 36, fontFamily: "'DM Serif Display',serif", fontStyle: 'italic', fontSize: 22 }}>Want a path like this?</p>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button className="btn-primary" style={{ background: '#1D9E75' }} onClick={() => go('/aptitude')}>Take the Aptitude Test</button>
        </div>
      </section>

      <CtaBanner
        badge="Cohort 01 enrolling"
        title="Your story belongs on this page."
        subtitle="One application stands between you and a different next year."
        buttonText="Sign Up"
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
