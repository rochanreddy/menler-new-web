/**
 * Menler AI Aptitude Test — 10 questions, each option has score (s).
 * Max score = 40 (10 questions × max 4 points each).
 */
export const APTITUDE_QUESTIONS = [
  {
    q: 'You need Claude to extract action items from a 40-minute meeting recording. What do you provide first?',
    options: [
      { t: 'Just the transcript and ask "find action items"', s: 1 },
      { t: 'Transcript + format template + owner/deadline columns', s: 4 },
      { t: 'Paste everything and ask it to summarise', s: 2 },
      { t: 'Write a Python script to parse the transcript', s: 3 },
    ],
  },
  {
    q: 'Your first Claude prompt gives a vague answer. What do you do?',
    options: [
      { t: 'Try a completely different AI tool', s: 1 },
      { t: 'Add context, constraints, and a worked example to the prompt', s: 4 },
      { t: 'Ask the same question again', s: 2 },
      { t: 'Accept the vague output — AI has limits', s: 1 },
    ],
  },
  {
    q: 'You want Claude to write a detailed competitive analysis. The most effective approach is:',
    options: [
      { t: '"Write a competitive analysis of our product"', s: 1 },
      { t: 'Define competitors, dimensions, audience, format, and examples', s: 4 },
      { t: '"Compare our product with competitors in 200 words"', s: 2 },
      { t: 'Ask Claude to search the web for data', s: 2 },
    ],
  },
  {
    q: 'Claude produces a mostly correct financial model but has a wrong formula in one cell. You should:',
    options: [
      { t: 'Discard the output and start from scratch', s: 1 },
      { t: 'Pinpoint the cell, explain the error, ask Claude to fix only that section', s: 4 },
      { t: 'Manually fix it without telling Claude', s: 3 },
      { t: 'Regenerate the entire model hoping for a better result', s: 2 },
    ],
  },
  {
    q: 'Which of these is the best use of Claude\'s "Projects" or persistent context feature?',
    options: [
      { t: 'One-off fact lookup', s: 1 },
      { t: 'Ongoing product strategy work requiring brand voice, docs, and decision history', s: 4 },
      { t: 'Writing a single email', s: 1 },
      { t: 'Translating a paragraph', s: 1 },
    ],
  },
  {
    q: 'You need Claude to help build an automated reporting pipeline. What is your first step?',
    options: [
      { t: '"Build me a reporting pipeline"', s: 1 },
      { t: 'Map out data sources, desired output format, frequency, and distribution channel first', s: 4 },
      { t: 'Google how to build a reporting pipeline', s: 2 },
      { t: 'Ask a developer to do it instead', s: 1 },
    ],
  },
  {
    q: 'Claude confidently gives you a fact about a recent industry event. What do you do?',
    options: [
      { t: 'Trust it — Claude is always accurate', s: 1 },
      { t: 'Verify with a primary source before using it in work', s: 4 },
      { t: 'Ask Claude if it is sure', s: 3 },
      { t: 'Ask a colleague to verify', s: 3 },
    ],
  },
  {
    q: 'You want Claude to consistently match your brand\'s writing style. The most effective method is:',
    options: [
      { t: '"Write like my brand"', s: 1 },
      { t: 'Provide 3-5 approved content samples + a style guide with do/don\'t examples', s: 4 },
      { t: 'Tell Claude your brand name and hope it knows', s: 1 },
      { t: 'Write manually — AI can\'t match brand voice', s: 1 },
    ],
  },
  {
    q: 'A colleague says "AI will replace my job." Which response reflects the most accurate mental model?',
    options: [
      { t: 'Agree — AI replaces all knowledge work eventually', s: 1 },
      { t: 'Disagree — AI augments; people who use AI well will outperform those who don\'t', s: 4 },
      { t: 'Unsure — nobody knows yet', s: 2 },
      { t: 'Disagree — AI is just hype and won\'t affect most jobs', s: 1 },
    ],
  },
  {
    q: 'You want to automate a weekly competitive brief using Claude API. What do you plan for?',
    options: [
      { t: 'Just call the API and see what happens', s: 1 },
      { t: 'Prompt template, input data pipeline, validation step, output formatting, error handling', s: 4 },
      { t: 'Write the prompt once and schedule it as a cron job', s: 2 },
      { t: 'Hire a developer to build it from scratch', s: 1 },
    ],
  },
];

export const MAX_SCORE = APTITUDE_QUESTIONS.reduce(
  (acc, q) => acc + Math.max(...q.options.map(o => o.s)),
  0
);

export function getRecommendation(score) {
  const pct = score / MAX_SCORE;
  if (pct >= 0.85) {
    return {
      band: 'Advanced — AI Power User',
      program: 'Claude AI Engineering',
      path: '/engineering',
      rationale: 'Your responses show systems thinking and precision prompting. You\'re ready for API, RAG, MCP, and agent architectures.',
      color: 'var(--forest)',
      bg: '#E1F5EE',
    };
  }
  if (pct >= 0.60) {
    return {
      band: 'Intermediate — AI Specialist path',
      program: 'Claude AI Generalist',
      path: '/generalist',
      rationale: 'You have solid intuition. The Generalist program will sharpen your prompting, build real domain projects, and earn you the Specialist certification.',
      color: 'var(--specialist)',
      bg: 'var(--cloud)',
    };
  }
  return {
    band: 'Foundational — AI Beginner',
    program: 'Gen AI Kickstarter',
    path: '/kickstarter',
    rationale: 'Start with the 14-day Kickstarter to build confident AI fluency. Five mini-builds will transform how you think about AI workflows.',
    color: '#854F0B',
    bg: '#FAEEDA',
  };
}
