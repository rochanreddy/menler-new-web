import { useState } from 'react';

// `heading` wraps the question in an <h3> for pages whose SEO wants each
// question as a heading (FAQPage schema); the button inside is unchanged.
export default function FaqItem({ question, answer, heading = false }) {
  const [open, setOpen] = useState(false);
  const toggle = (
    <button
      className="faq-q"
      onClick={() => setOpen(o => !o)}
      aria-expanded={open}
    >
      <span>{question}</span>
      <svg className="faq-icon" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      {heading ? <h3 className="faq-h">{toggle}</h3> : toggle}
      <div className="faq-a">
        <p>{answer}</p>
      </div>
    </div>
  );
}
