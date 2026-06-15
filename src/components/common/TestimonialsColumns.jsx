import React from 'react';
import { motion } from 'motion/react';

// ── Testimonial data ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "We're seeing plenty of AI certificates in the market. What's rare are candidates who can demonstrate real builds. Menler's portfolio-led model makes evaluation significantly easier.",
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face',
    name: 'Talent Partner',
    role: 'High-Growth SaaS Company',
  },
  {
    text: "What stood out was the portfolio-first approach. Fellows aren't just learning concepts — they're shipping assets, agents, and workflows that can be reviewed by employers.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
    name: 'Neha Sinha',
    role: 'Founder · AI Automation Studio',
  },
  {
    text: "I joined expecting another AI course. Instead, I left with a portfolio I could actually discuss in interviews and a much clearer understanding of how AI is used inside real businesses.",
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    name: 'Aditya Rao',
    role: 'Beta Fellow',
    fellow: true,
  },
  {
    text: "The strongest signal for us is proof of work. Menler's focus on projects, reviews, and operator mentorship aligns far better with how modern AI hiring decisions are made.",
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
    name: 'Hiring Manager',
    role: 'AI & Automation Practice',
  },
  {
    text: "Most AI programs teach prompts. Menler teaches systems. The curriculum focuses on workflows, evaluation, deployment, and business impact — the things operators actually get measured on.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    name: 'Arjun Menon',
    role: 'AI Product Lead · Enterprise Automation',
  },
  {
    text: "The biggest difference was learning from practitioners who use AI every day. Every session felt connected to actual workflows rather than theory.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    name: 'Sneha Kulkarni',
    role: 'Beta Fellow',
    fellow: true,
  },
  {
    text: "Claude Cowork changed how I approach research. I can now synthesise and deliver insights in a fraction of the time. My manager noticed before I even mentioned the program.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    name: 'Rahul Desai',
    role: 'Strategy Analyst · Series B Startup',
  },
  {
    text: "The program gave me a structured way to go from idea to deployed agent. The capstone review process alone was worth the fellowship fee.",
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    name: 'Priya Nair',
    role: 'Product Manager · Fintech',
  },
  {
    text: "I've hired from many bootcamps. Menler fellows are different — they come in with context on how AI actually integrates into business operations, not just how to write prompts.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    name: 'Hiring Director',
    role: 'Growth-Stage SaaS',
  },
];

// ── Single scrolling column ─────────────────────────────────────────────────
function TestimonialsColumn({ testimonials, duration = 15, className = '' }) {
  return (
    <div className={`tmc-col${className ? ` ${className}` : ''}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="tmc-track"
      >
        {[0, 1].map((_, copyIdx) => (
          <React.Fragment key={copyIdx}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div className="tmc-card" key={`${copyIdx}-${i}`}>
                <p className="tmc-text">{text}</p>
                <div className="tmc-author">
                  <div>
                    <p className="tmc-name">{name}</p>
                    <p className="tmc-role">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

// ── Section export ──────────────────────────────────────────────────────────
// Column 1 = beta fellows, column 2 = individual people, column 3 = organisations.
const ORGS = ['Talent Partner', 'Hiring Manager', 'Hiring Director'];
// Repeat short groups so a single loop copy is taller than the column — otherwise
// the marquee scrolls into empty space and cards "pop in" before it loops.
const fill = (arr, min = 6) => (arr.length === 0 ? arr : Array.from({ length: Math.max(min, arr.length) }, (_, i) => arr[i % arr.length]));
const col1 = fill(TESTIMONIALS.filter(t => t.fellow));
const col3 = fill(TESTIMONIALS.filter(t => ORGS.includes(t.name)));
const col2 = fill(TESTIMONIALS.filter(t => !t.fellow && !ORGS.includes(t.name)));
const colAll = fill(TESTIMONIALS); // mobile: one column with every testimonial

export default function TestimonialsColumns() {
  return (
    <section className="tmc-section">
      <div className="tmc-head">
        <p className="section-label">Voices · Fellows &amp; Advisors</p>
        <h2 className="section-h2">Why<br /><em>chose Menler.</em></h2>
        <p className="section-sub">
          From beta fellows and advisory voices — AI operators, builders, curriculum reviewers, and hiring associations.
        </p>
      </div>
      <div className="tmc-columns">
        <TestimonialsColumn testimonials={colAll} duration={28} className="tmc-col--all" />
        <TestimonialsColumn testimonials={col1} duration={18} className="tmc-col--sm" />
        <TestimonialsColumn testimonials={col2} duration={22} className="tmc-col--md" />
        <TestimonialsColumn testimonials={col3} duration={20} className="tmc-col--lg" />
      </div>
    </section>
  );
}
