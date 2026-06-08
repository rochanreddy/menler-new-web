import { APTITUDE_QUESTIONS, SET_QUESTIONS } from './aptitudeQuestions';

const CLUSTER_NAMES = [
  'Agentic AI',
  'AI Agent Workflows',
  'AI Engineering Thinking',
  'AI Judgement',
  'AI Network Infrastructure',
  'AI Tool Ecosystem',
  'LLM Fundamentals',
  'Prompt Engineering',
  'RAG Knowledge Systems',
];

function buildSets(clusterName) {
  const custom = SET_QUESTIONS[clusterName];
  if (custom?.length) {
    return custom.map((questions, i) => ({
      label: `Set ${i + 1}`,
      questions,
    }));
  }
  // Fallback: same default pool for all 5 sets until you add SET_QUESTIONS[clusterName].
  return Array.from({ length: 5 }, (_, i) => ({
    label: `Set ${i + 1}`,
    questions: APTITUDE_QUESTIONS,
  }));
}

export const CLUSTERS = CLUSTER_NAMES.map(name => ({
  name,
  sets: buildSets(name),
}));

export function getSetQuestions(clusterName, setIdx) {
  const cluster = CLUSTERS.find(c => c.name === clusterName);
  return cluster?.sets[setIdx]?.questions ?? APTITUDE_QUESTIONS;
}

// A 14-day learning roadmap. Lightly tailored by the recommended program.
export function buildRoadmap(program) {
  const base = [
    'Set up Claude.ai and your AI workspace',
    'Prompt engineering — the 5 core patterns',
    'Multimodal prompting: text, images & documents',
    'Build your first research assistant',
    'Claude Projects & persistent context',
    'Tool use — connect Claude to your stack',
    'Checkpoint — ship mini-build #1',
    'Workflow automation with MCP & Cowork',
    'Domain deep-dive: apply Claude to your role',
    'Evaluation — how to know your output is good',
    'Build a real automation for your work',
    'AI safety, verification & responsible use',
    'Polish your portfolio project',
    'Capstone demo + your next step',
  ];
  const last = program === 'Claude AI Engineering'
    ? 'Capstone demo + start the Engineering track'
    : program === 'Claude AI Generalist'
      ? 'Capstone demo + start the Generalist track'
      : 'Capstone demo + start the Kickstarter';
  return base.slice(0, 13).map((focus, i) => ({ day: i + 1, focus })).concat({ day: 14, focus: last });
}
