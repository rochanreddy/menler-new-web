import { useState } from 'react';

// GenAI toolstack — shared by the home page and the campaign landing pages so
// the tool list only ever lives in one place.
export const TECH = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'NotebookLM', logo: '/logos/google-notebook-lm.webp' },
  { name: 'Notion AI', logo: '/logos/notion.webp' },
  { name: 'Canva AI', logo: '/logos/canva.webp' },
  { name: 'Granola', logo: '/logos/granola_ai.webp' },
  { name: 'Fireflies', logo: '/logos/fireflies.webp' },
  { name: 'ElevenLabs', logo: '/logos/elevenlabs.png' },
  { name: 'Runway', logo: '/logos/runway.webp' },
  { name: 'HeyGen', logo: '/logos/heygen.webp' },
  { name: 'n8n', logo: '/logos/n8n.webp' },
  { name: 'Zapier', logo: '/logos/zapier.webp' },
  { name: 'Lovable', logo: '/logos/lovable-logo.webp' },
  { name: 'Emergent', logo: '/logos/emergent.webp' },
  { name: 'Lyzr', logo: '/logos/lyzr.webp' },
];

// One toolstack chip. Falls back to text-only if the logo fails to load.
export function ToolStackChip({ tool }) {
  const [ok, setOk] = useState(!!tool.logo);
  return (
    <div className="toolstack-chip">
      {ok && <img className="toolstack-logo" src={tool.logo} alt="" aria-hidden="true" loading="lazy" onError={() => setOk(false)} />}
      <span className="toolstack-name">{tool.name}</span>
    </div>
  );
}

export default function ToolStack({
  title = 'Your GenAI toolstack',
  sub = 'Get hands on with AI tools from your first prompt to your first real project.',
  className = 'section toolstack-section',
  tools = TECH,
  style,
}) {
  // Three rows as even as the list allows, so adding or dropping a tool can't
  // quietly leave one stranded on a row of its own. Fifteen gives 5/5/5.
  const per = Math.ceil(tools.length / 3);
  const rows = [tools.slice(0, per), tools.slice(per, per * 2), tools.slice(per * 2)];

  return (
    <section className={className} style={style}>
      <h2 className="toolstack-title">{title}</h2>
      <p className="toolstack-sub">{sub}</p>
      <div className="toolstack-grid">
        {rows.map((row, ri) => (
          <div key={ri} className="toolstack-row">
            {row.map(t => <ToolStackChip key={t.name} tool={t} />)}
          </div>
        ))}
      </div>
    </section>
  );
}
