import { useState } from 'react';

/* A tool in a curriculum's "Tool stack" column, with its logo. Shared by the
   Generalist and AI FDE (Engineering) curricula. */

// Logo per curriculum tool (local file, with text fallback if it fails).
const TOOL_LOGO_SRC = {
  'Claude': '/logos/claude.svg', 'Claude Cowork': '/logos/claude.svg', 'Cowork': '/logos/claude.svg',
  'Claude API': '/logos/claude.svg', 'Claude Agent SDK': '/logos/claude.svg', 'Projects': '/logos/claude.svg',
  'Skills': '/logos/claude.svg', 'Artifacts': '/logos/claude.svg', 'MCP': '/logos/mcp.svg', 'OpenAI': '/logos/openai.webp',
  'Canva': '/logos/canva.webp', 'Notion': '/logos/notion.webp', 'Make': '/logos/make.webp',
  'Zapier': '/logos/zapier.webp', 'Airtable': '/logos/airtable.webp', 'Typedream': '/logos/typedream.webp',
  'n8n': '/logos/n8n.webp', 'N8N': '/logos/n8n.webp', 'Slack': '/logos/slack.webp', 'Gmail': '/logos/gmail.webp',
  'Excel': '/logos/excel.webp', 'PowerPoint': '/logos/powerpoint.webp', 'Buffer': '/logos/buffer.webp',
  // Phase 3 domain-track tools (match the exact names used in the data).
  'Perplexity': '/logos/perplexity.svg', 'NotebookLM': '/logos/notebooklm.webp', 'Gamma': '/logos/gamma.webp',
  'ElevenLabs': '/logos/elevenlabs.png', 'Canva AI': '/logos/canva.webp', 'Midjourney': '/logos/midjourney.webp',
  'Runway': '/logos/runway.webp', 'Lovable': '/logos/lovable-logo.webp', 'Emergent': '/logos/emergent.webp',
  'Gemini': '/logos/gemini.webp', 'Gemini (image)': '/logos/gemini.webp', 'ChatGPT': '/logos/chatgpt.webp',
  'Claude Code': '/logos/claude_code-removebg-preview.webp', 'Cursor': '/logos/cursor.webp',
  'SQL': '/logos/sql.svg',
};

// Tools without a local logo file — fall back to the brand's favicon by domain.
const TOOL_DOMAIN = {
  'Replit': 'replit.com', 'HubSpot': 'hubspot.com', 'Meta Ads': 'facebook.com', 'GA4': 'google.com',
  'WhatsApp Business': 'whatsapp.com', 'Google Sheets AI': 'google.com', 'Looker Studio': 'google.com',
  'GitHub': 'github.com', 'Bolt.new': 'bolt.new', 'VAPI': 'vapi.ai',
  'Jira': 'atlassian.com', 'Figma': 'figma.com', 'Mixpanel': 'mixpanel.com', 'Keka': 'keka.com',
  'Darwinbox': 'darwinbox.com', 'Web search': 'google.com', 'Multimodal': 'claude.ai',
  // AI FDE curriculum tools.
  'Postgres': 'postgresql.org', 'pgvector': 'postgresql.org', 'Qdrant': 'qdrant.tech', 'Neo4j': 'neo4j.com',
  'Docker': 'docker.com', 'GitHub Actions': 'github.com', 'OpenTelemetry': 'opentelemetry.io',
  'Langfuse': 'langfuse.com', 'Phoenix': 'arize.com', 'promptfoo': 'promptfoo.dev', 'Braintrust': 'braintrust.dev',
  'RAGAS': 'ragas.io', 'Presidio': 'microsoft.com', 'NeMo Guardrails': 'nvidia.com', 'WhatsApp': 'whatsapp.com',
  'JSON Schema': 'json-schema.org',
};

export default function ToolChip({ name }) {
  // Prefer a local logo; otherwise fall back to the brand's favicon by domain.
  const local = TOOL_LOGO_SRC[name];
  const domain = TOOL_DOMAIN[name];
  const sources = [
    local,
    domain && `https://logo.clearbit.com/${domain}`,
    domain && `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ].filter(Boolean);
  const [i, setI] = useState(0);
  const src = sources[i];
  return (
    <span className="curric-tool">
      {src && <img className="curric-tool-logo" src={src} alt="" width="36" height="36" loading="lazy" onError={() => setI(i + 1)} />}
      {name}
    </span>
  );
}
