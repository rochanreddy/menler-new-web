// AI for Product Management question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getProductSession(n) → a fresh random n-question session in the runner's format:
// { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
What is the most effective use of Claude in the product discovery phase?
Ask Claude to identify what features your product should build next.
Use Claude to synthesise research inputs, structure problem statements, and generate hypotheses to test — while actual customer discovery remains human-conducted.
Ask Claude to analyse competitor products and replicate their features.
Use Claude to predict which product ideas will succeed before testing them.
===
You have 30 user interview transcripts to analyse. What is the most effective AI-assisted approach?
Ask Claude to read all transcripts and tell you what to build.
Define specific research questions first — what problems came up, what workflows are broken, what outcomes users need — then use Claude to identify patterns across transcripts against those questions.
Ask Claude to summarise each transcript individually.
Use Claude to rank user quotes by how compelling they are.
===
Claude generates a list of user pain points for your product category. What should you do with it?
Use the list directly as the basis for your next sprint.
Treat it as a hypothesis set to validate with actual user research — AI-generated pain points reflect training data patterns, not your specific users' actual experience.
Share it with engineering immediately to start solution design.
Trust it if it matches what your customer success team has heard anecdotally.
===
What is the most effective use of Claude to help write a user research discussion guide?
Ask Claude to write the guide without any context.
Brief Claude on the research objective, the stage of discovery, what you already know, and what you need to learn — then review the guide to ensure questions are open-ended and bias-free.
Ask Claude to write questions that will confirm your existing hypotheses.
Use Claude to write closed questions that are faster for users to answer.
===
You want to use Claude to help synthesise research from multiple sources — interviews, surveys, support tickets, and NPS comments. What approach works best?
Paste everything into Claude and ask for insights.
Organise inputs by source type first, define the themes you want to investigate, then use Claude to identify patterns within each source and across sources — with human judgment applied to reconcile conflicting signals.
Ask Claude to determine which source type is most reliable.
Use only the source with the most data points for AI analysis.
===
What is the most important limitation of AI-generated user personas?
AI cannot create user personas — only UX researchers can.
AI personas are based on general patterns, not your specific users — they risk creating fictional archetypes that feel credible but do not reflect the actual people using your product.
AI personas are only useful for consumer products, not B2B.
AI personas require too much data to generate accurately.
===
What is the most appropriate use of AI for usability testing?
Have AI conduct usability tests with users.
Use Claude to help design the test protocol, create task scenarios, and analyse session notes — while actual usability sessions are conducted and observed by humans.
Replace usability testing with AI prediction of usability issues.
Use AI to automatically identify usability issues from screen recordings.
===
How should Claude be used to help identify the right problem to solve before building a feature?
Ask Claude what problem you should solve next.
Share your research evidence — user interviews, support data, churn signals — and ask Claude to help structure a problem statement that distinguishes the symptom from the underlying root cause.
Ask Claude to analyse your competitors' features to identify problem gaps.
Use Claude to predict which problem is worth the most revenue if solved.
===
You receive conflicting signals from user research — some users want feature A, others want feature B. What is the most effective use of Claude to process this?
Ask Claude to decide which group of users is right.
Brief Claude on both signal types, the user segments they come from, and the business context — ask Claude to help structure a framework for deciding which signal to weight more and why.
Use Claude to predict which feature will generate more revenue.
Ask Claude to average the two signals into a compromise solution.
===
What is the most effective prompt for using Claude to help with jobs-to-be-done (JTBD) analysis?
"Analyse our product's jobs to be done."
"Here are five user interview quotes: [quotes]. For each, identify the functional job the user is trying to accomplish, the emotional dimension of that job, and any social context. Then identify common themes across all five."
"What jobs do customers want our product to do?"
"Generate a JTBD framework for our product category."
===
What is the most valuable outcome of AI-assisted product discovery?
Faster feature ideation and specification.
More rigorous hypothesis generation and synthesis — so the product team enters user research conversations with better questions and analyses research outputs more systematically.
Reduced need for user research as AI can infer user needs.
Automated generation of product requirements from research data.
===
You are conducting discovery for a feature that requires deep domain expertise your team does not have. How does Claude help most?
Ask Claude to substitute for domain expert knowledge.
Use Claude to research the domain, generate a list of questions to ask domain experts, and help you understand concepts well enough to have productive expert conversations.
Trust Claude's domain knowledge as equivalent to an expert's.
Claude cannot help with domain-specific product discovery.
===
What is the most appropriate role for AI in synthesising support ticket data for product insights?
Have AI automatically generate product requirements from support tickets.
Use AI to categorise and cluster support tickets by theme, quantify frequency patterns, and surface the most common underlying problems — with PM judgment applied to determine which patterns represent genuine product opportunities.
Support ticket data should never be used for product discovery.
AI can determine which support issues represent product bugs vs user error.
===
What is the most important thing a PM must bring to AI-assisted product discovery?
A large enough dataset for AI to analyse effectively.
A clear point of view on the business context, strategic priorities, and user segments that makes AI-generated insights relevant rather than generic.
Technical knowledge of how AI discovery tools work.
Enough time to review all AI-generated outputs thoroughly.
===
What is the most important professional obligation when using AI to assist in user research?
Disclosing AI use to research participants.
Ensuring that AI assistance enhances rather than replaces genuine empathy for users — product decisions must be grounded in real understanding of user needs, not just pattern-matched AI outputs.
Using only AI tools approved by the research team.
Documenting AI usage in all research reports.
===
What is the most effective use of Claude to help build a product roadmap?
Ask Claude to generate the product roadmap from your backlog.
Brief Claude on strategic objectives, known user needs, technical constraints, and business priorities — use Claude to help structure themes and sequence logic while PM judgment drives the actual prioritisation decisions.
Ask Claude to prioritise your backlog automatically.
Use Claude to copy the roadmap structure of a successful competitor.
===
You have 50 feature requests in your backlog. What does Claude help with most in the prioritisation process?
Selecting which 10 features to build next.
Structuring the evaluation framework, grouping similar requests by underlying need, and drafting the rationale for each prioritisation decision — with PM judgment applied to the actual ranking.
Predicting which features will generate the most revenue.
Removing features from the backlog that AI determines are low value.
===
A stakeholder pressures you to add their feature to the top of the roadmap. How does Claude help you respond professionally?
Ask Claude to support the stakeholder's request.
Use Claude to help structure a clear explanation of the prioritisation criteria and where this feature sits against the current roadmap — and prepare for the stakeholder conversation with data and reasoning.
Ask Claude to predict the revenue impact of the requested feature.
Have Claude send the stakeholder a response on your behalf.
===
What is the most effective use of AI when applying a prioritisation framework like RICE or ICE?
Have AI calculate RICE/ICE scores automatically from your backlog.
Use Claude to help apply the framework consistently across items — generating first-cut scores with documented assumptions — then review each score with the team to challenge assumptions and refine.
Ask Claude which prioritisation framework to use.
Trust AI-calculated prioritisation scores without human review.
===
What is the most important limitation of AI-assisted roadmap planning?
AI cannot process enough data for effective roadmap planning.
AI lacks knowledge of your specific organisational dynamics, engineering capacity realities, stakeholder relationships, and competitive context that are essential inputs to good roadmap decisions.
AI roadmap tools are only useful for B2C product companies.
AI cannot understand product strategy concepts.
===
How should Claude be used to help communicate roadmap decisions to a cross-functional team?
Have Claude write and distribute roadmap communications without PM review.
Use Claude to draft the roadmap narrative — explaining the strategic rationale, what is in and what is not, and why — then the PM reviews, personalises for the audience, and presents it.
Roadmap communications should always be written entirely manually.
Ask Claude to present the roadmap to the team in a meeting.
===
What is the most effective use of Claude when planning a product quarter?
Ask Claude to plan the quarter without team input.
Use Claude to structure the planning document, draft objective statements, identify dependencies across teams, and generate the risk log — while the actual commitments come from team capacity and PM judgment.
Quarterly planning is too complex for any AI involvement.
Ask Claude to allocate engineering capacity across initiatives.
===
You need to say no to a feature request that has strong executive sponsorship. What does Claude help you prepare?
Ask Claude to draft a rejection email to the executive.
Use Claude to help structure the business case for the decision — framing the trade-off clearly, quantifying the opportunity cost, and preparing the conversation with data and alternative proposals.
Ask Claude to predict whether the executive will accept the rejection.
Have Claude rewrite the feature request as a lower priority item.
===
What is the most valuable use of AI for now/next/later roadmap planning?
Have AI populate all three horizons based on backlog data.
Use Claude to help articulate the strategic rationale for each horizon, ensure items are genuinely connected to the strategy, and draft the narrative that explains how now enables next.
Ask Claude to predict when each roadmap item will be ready.
AI is not useful for now/next/later planning as it lacks temporal reasoning.
===
A new competitor launches a feature that appears on your backlog. How does Claude help you decide whether to accelerate it?
Ask Claude to recommend whether to accelerate or hold the feature.
Use Claude to structure a rapid analysis — competitive differentiation impact, current roadmap disruption cost, user importance of this feature type — then make the decision with the PM team.
Accelerate the feature automatically when any competitor launches it.
Ask Claude to predict how many customers you will lose without this feature.
===
What is the most important thing a good roadmap communicates beyond the list of features?
The exact delivery dates for each feature.
The strategic rationale — why these items, in this order, will create the most value for users and the business in this period — which AI can help draft once the PM has defined the underlying logic.
The engineering effort required for each item.
The ROI calculation for every feature on the roadmap.
===
What is the most effective way to use Claude to help manage technical debt on the roadmap?
Ask Claude to estimate how much technical debt your product has.
Use Claude to help articulate the business impact of specific technical debt items in language stakeholders understand — making the case for investment in ways that connect to outcomes, not engineering metrics.
Technical debt decisions should never involve AI.
Ask Claude to recommend which technical debt items to ignore.
===
What is the most effective use of AI for OKR setting in product teams?
Have Claude generate OKRs for the product team.
Brief Claude on strategic priorities and the outcome you are trying to achieve — use Claude to draft OKR language, ensure key results are genuinely measurable, and check that they distinguish outcomes from outputs.
OKRs should always be set by leadership without AI assistance.
Ask Claude to benchmark your OKRs against industry standards.
===
What is the most important signal that a roadmap needs to be revised?
A competitor launches a new product.
New information — from user research, market signals, or business results — that invalidates one or more of the strategic assumptions the current roadmap is built on.
The engineering team says the roadmap is too ambitious.
A senior stakeholder expresses dissatisfaction with the roadmap.
===
What is the most important professional skill for PMs using AI in roadmapping?
The ability to use AI prioritisation tools proficiently.
The ability to make and communicate confident, well-reasoned prioritisation decisions — AI structures the analysis but the PM must own and defend every roadmap choice.
The ability to process more roadmap data than non-AI PMs.
Technical knowledge of how AI roadmapping tools work.
===
What is the most effective use of Claude to help write a product requirements document (PRD)?
Ask Claude to write the PRD from a one-line feature description.
Provide Claude with the user problem, the research evidence, the proposed solution, success metrics, constraints, and edge cases — use Claude to structure and draft the PRD, then review for completeness and accuracy.
Use Claude to copy a PRD template from a well-known product company.
PRDs should always be written entirely by the PM without AI assistance.
===
You ask Claude to write acceptance criteria for a new feature. What information must you provide?
Just the feature name and a brief description.
The specific user behaviours the feature must enable, the edge cases it must handle, the performance requirements, and what 'done' looks like from a user perspective.
The engineering implementation approach.
The business revenue target for the feature.
===
What is the most important review step after using Claude to draft a technical specification?
Check that the specification is well-formatted.
Have engineering review the specification for technical feasibility and completeness — AI can miss implementation implications, system interactions, and constraints that engineers know from the codebase.
Ask Claude to check its own specification for technical accuracy.
Check that the specification matches the style of previous specs.
===
What is the most effective use of Claude for writing user stories?
Ask Claude to generate all user stories for a feature without context.
Provide Claude with the user persona, the job they are trying to do, the specific scenarios, and the acceptance criteria framework — then review stories for specificity and testability.
User stories should always be written in sprint planning without AI.
Ask Claude to generate as many user stories as possible for every feature.
===
How should Claude be used to help maintain a product wiki or knowledge base?
Have Claude automatically update all wiki pages when the product changes.
Use Claude to draft new wiki content, update outdated sections when briefed on changes, and maintain consistent structure — with human review before any content is published.
Product wikis should never use AI for content generation.
Ask Claude to determine which wiki pages are outdated.
===
You are writing a feature brief for a design sprint. What makes the Claude-assisted brief most effective?
Ask Claude to write a comprehensive feature brief covering all possibilities.
Brief Claude with the specific design challenge, the user problem to solve, key constraints, what success looks like for the user, and what you are NOT trying to solve in this sprint.
Ask Claude to copy the structure of a feature brief from a design thinking template.
Design sprint briefs should always be written by the design team.
===
What is the most effective way to use Claude to document API requirements for engineering?
Ask Claude to write the API specification without PM input.
Provide Claude with the use cases the API must support, the data inputs and expected outputs, the error conditions to handle, and performance requirements — then have engineering review for technical completeness.
API documentation should always be written by engineering, not PM.
Claude cannot help with technical API documentation.
===
What is the most appropriate use of AI in writing product release notes?
Have Claude generate release notes automatically from the code commit log.
Brief Claude on each change — what it does, who it helps, and why it matters — and ask Claude to write customer-facing descriptions that communicate value, not technical implementation details.
Release notes should always be written by technical writers.
AI release notes are not suitable for external customer audiences.
===
You want Claude to help create a product FAQ document. What produces the most useful output?
Ask Claude to generate all possible questions about your product.
Compile the questions you actually receive from users, prospects, and support — then use Claude to draft clear, accurate answers to each, reviewed against the actual product.
Ask Claude to write questions and answers without any product input.
FAQs should be written entirely by customer support, not PM.
===
What is the most important caution when using Claude to write product documentation that will be published externally?
Ensure the documentation is comprehensive enough.
Verify every feature description, interaction flow, and technical detail against the actual product — AI-generated documentation that does not match product behaviour damages user trust.
Make sure the documentation matches competitor documentation quality.
Confirm that Claude's writing style is consistent with your brand.
===
What is the most effective use of Claude to help write a product strategy document?
Ask Claude to write the strategy document without PM direction.
Share the strategic analysis, the key bets you are making, the rationale behind each, and the success metrics — use Claude to structure and articulate the narrative clearly.
Product strategy documents should never use AI assistance.
Ask Claude to recommend the best product strategy for your category.
===
You are creating onboarding documentation for a new product feature. Which approach produces the most user-friendly output from Claude?
"Write onboarding documentation for this feature."
"Write step-by-step onboarding guidance for [feature] for a first-time user who has never used [product] before. Each step should include: what to click, what they will see, and what it enables them to do. Use plain language, no jargon."
"Document the feature comprehensively."
"Write documentation like the best SaaS products use."
===
What is the most effective way to use Claude to maintain consistency across a large product documentation set?
Ask Claude to automatically update all documentation when changes occur.
Define a documentation style guide, store it in a Claude Project, and use Claude to check new and updated content against the guide before publication — maintaining consistent voice, structure, and terminology.
Documentation consistency requires dedicated technical writers only.
Ask Claude to rewrite all existing documentation in one consistent style.
===
What is the most important skill for PMs using AI for product documentation?
Being able to write faster with AI assistance.
The ability to translate product thinking into precise briefs that give Claude the specific context it needs — because documentation quality is determined by brief quality.
Technical knowledge of documentation tools.
The ability to review AI documentation for grammar and style.
===
What is the most important thing to remember when publishing AI-assisted product documentation?
Disclosing that documentation was AI-assisted.
Taking full responsibility for accuracy — every claim in published documentation reflects on the product and brand, regardless of whether AI drafted it.
Using a disclaimer that documentation may contain errors.
Having legal review all AI-generated documentation before publication.
===
What is the most appropriate use of AI to help a PM interpret product analytics?
Have AI determine what product changes to make from analytics data.
Use Claude to structure the analytical framework, identify patterns in the data, and generate hypotheses to investigate — with PM judgment applied to interpretation and decision-making.
Trust AI-generated analytics interpretations as definitive conclusions.
Product analytics should always be analysed without AI assistance.
===
You see a significant drop in a key product metric. How does Claude help you investigate it?
Ask Claude to diagnose the cause of the metric drop.
Share the metric data, timeline, and relevant context with Claude — ask Claude to help structure a systematic diagnostic framework and generate plausible hypotheses — then investigate each hypothesis with data.
Ask Claude to fix the metric drop.
Have Claude predict when the metric will recover.
===
What is the most important caution when using Claude to generate insights from product usage data?
Claude cannot process product usage data.
AI insights reflect the patterns in the data provided — they do not account for context outside the data, and correlation patterns should not be treated as causal conclusions without further investigation.
Product usage insights should only come from data scientists.
Claude's insights are always less accurate than analyst-generated insights.
===
You want to use Claude to help define the success metrics for a new feature before it launches. What approach works best?
Ask Claude to recommend the best metrics for your feature.
Brief Claude on the user problem the feature solves, the behaviour change you expect, and the business objective — ask Claude to generate candidate metrics and evaluate whether each is leading or lagging, measurable, and actionable.
Success metrics should always be defined by the data team.
Ask Claude to benchmark your planned metrics against industry standards.
===
What is the most effective use of AI to help interpret qualitative feedback alongside quantitative data?
Have AI determine which data type is more reliable.
Use Claude to structure the analysis so qualitative themes are connected to quantitative patterns — identifying where qualitative context explains quantitative signals and where they conflict.
Qualitative and quantitative data should always be analysed separately.
Trust quantitative data over qualitative data in all product decisions.
===
You want to use Claude to help evaluate the results of an A/B test. What information must you provide?
Just the conversion rates for each variant.
The test design, sample sizes, duration, statistical significance, the metric being measured, and the specific behavioural change each variant was designed to produce.
Ask Claude to determine statistical significance from the raw data.
Provide Claude with the business revenue impact of each variant.
===
What is the most important limitation of using AI to predict feature adoption rates?
AI cannot make numerical predictions.
Feature adoption predictions require understanding of your specific user base, their current behaviour patterns, and the context of the launch — factors that AI generalises from patterns rather than knowing specifically.
AI adoption predictions are only accurate for large user bases.
Adoption rate predictions should always come from the data science team.
===
You are building a dashboard for your product team to track key health metrics. What does Claude help with most?
Building the actual dashboard in your analytics tool.
Defining the metric framework — which metrics to track, how to define them, what the alert thresholds should be, and how to structure them into a coherent view of product health.
Predicting which metrics will show the most important signals.
Selecting the best dashboard tool for your team.
===
What is the most effective way to use Claude to help with cohort analysis?
Ask Claude to perform cohort analysis on your user data.
Define the cohort segmentation logic and the behaviour metrics you want to track per cohort — brief Claude on this — then use Claude to help interpret the patterns and generate actionable hypotheses.
Cohort analysis is too complex for AI assistance.
Ask Claude to identify which user cohort is most valuable.
===
A PM uses AI to analyse data and concludes that feature X causes retention. What additional step is essential before acting on this conclusion?
Confirm the analysis with a second AI tool.
Investigate whether the correlation reflects genuine causation — through controlled experimentation, qualitative research to understand the mechanism, and testing alternative explanations.
Present the conclusion to leadership for approval.
Build feature X immediately since the data is clear.
===
What is the most effective use of Claude to help communicate data insights to non-technical stakeholders?
Have Claude present data insights directly to stakeholders.
Use Claude to translate technical data findings into plain-language business implications — connecting metric patterns to customer outcomes and business results in terms stakeholders understand and can act on.
Non-technical stakeholders should learn to interpret data themselves.
Data communications should always be prepared by the data team.
===
What is the most important signal that your product analytics is misleading your decisions?
When the data team disagrees with your interpretation.
When user research findings consistently contradict what the quantitative data suggests — indicating the metrics are measuring the wrong things or missing important user behaviour.
When competitors have different metrics for the same product area.
When AI-generated insights conflict with stakeholder expectations.
===
You are reviewing AI-generated product experiment results. The results show statistical significance but a very small effect size. What is the most appropriate interpretation?
A statistically significant result always means the experiment succeeded.
Statistical significance tells you the effect is unlikely to be chance — it does not tell you whether the effect is large enough to matter for the business or the user experience.
Small effect sizes are always too small to act on.
Ask Claude to recommend whether to implement the change.
===
What is the most important professional obligation when presenting AI-assisted product analytics to leadership?
Disclosing which AI tool was used in the analysis.
Taking full accountability for the accuracy of the analysis and the soundness of the conclusions — and being transparent about the limitations and assumptions in the data.
Having a data scientist validate all AI-generated insights before presentation.
Presenting AI-generated insights as more objective than human analysis.
===
What is the single most important thing that distinguishes PMs who use data effectively from those who do not?
Access to better analytics tools.
The discipline of connecting data to decisions — ensuring every analytical exercise is anchored to a specific question that, when answered, will change what the team does.
More data sources to draw from.
Faster analytical processing enabled by AI tools.
===
What is the most important principle for PMs using AI in product work?
Using AI for all product tasks to maximise output velocity.
The product manager remains fully accountable for every decision, specification, and recommendation — AI assists the work but does not share accountability for its quality or outcomes.
AI use in product management should always be disclosed to engineering.
AI is only appropriate for documentation tasks, not strategic product decisions.
===
What is the most significant risk of over-relying on AI for product strategy?
AI strategic advice is always generic.
Gradual atrophy of the product intuition and market judgment that comes from deep customer immersion — AI-generated strategy reflects training patterns, not the earned insight that comes from being deeply in the market.
AI strategy tools are too slow for fast-moving product decisions.
AI product strategy tools are only available to large teams.
===
What does "PM judgment" mean and why can AI not replace it?
The ability to use data to make product decisions.
The ability to make good product decisions despite incomplete information, conflicting stakeholder inputs, and genuine uncertainty — drawing on deep user empathy, business understanding, and pattern recognition that AI cannot fully replicate.
The seniority and experience required to approve product decisions.
The skill of reviewing AI-generated product recommendations.
===
A PM discovers that an AI-generated PRD they approved and shipped contained a significant error that degraded user experience. Who is professionally accountable?
The AI tool manufacturer.
The PM who approved and shipped the specification — professional accountability for product decisions does not transfer to AI tools.
Accountability is shared between the PM and the AI tool.
The engineering team that implemented the specification.
===
What is the most important thing PMs must maintain as AI assists more of their work?
Proficiency in as many AI tools as possible.
Deep, direct customer connection — the empathy and understanding of real user needs that grounds product decisions in human reality rather than data patterns.
The ability to review AI outputs faster than before.
Technical knowledge of how AI product tools work.
===
You discover that an AI tool you use for user research synthesis has been producing outputs with a systematic bias that skewed several product decisions. What is the professional response?
Continue using the tool since the bias may correct itself.
Assess the scope of impact, correct affected product decisions where possible, implement improved validation processes, and investigate what decisions were made based on the biased outputs.
Report the issue to the AI tool manufacturer and wait for a fix.
Stop using all AI tools for user research synthesis immediately.
===
What is the most appropriate attitude toward AI-generated feature ideas?
Implement them quickly to move faster than competitors.
Treat them as hypotheses to validate — AI-generated ideas reflect general patterns, not your specific users' actual needs, and must be tested before shaping the roadmap.
Reject AI-generated ideas in favour of user research-generated ones.
AI-generated ideas are always less creative than human-generated ones.
===
What is "product intuition" and how should AI be used to develop rather than replace it?
The ability to use analytical tools effectively.
The earned ability to quickly sense which user problems matter most and which solutions will work — developed through direct user contact, ship-and-learn cycles, and pattern recognition across product decisions. AI accelerates analysis but should not substitute for the direct experience that builds intuition.
Intuition is unreliable and should be replaced by AI data analysis.
Product intuition is only relevant for consumer product managers.
===
What is the most important consideration when using AI to help with stakeholder communication?
Using AI to communicate more frequently.
Ensuring every AI-drafted communication accurately reflects your actual product thinking — stakeholders must be able to trust that what you communicate reflects your genuine understanding and judgment.
Using AI only for written communication, not verbal presentations.
Disclosing AI assistance in all stakeholder communications.
===
What is the most effective way to develop AI fluency as a PM without compromising professional development?
Use AI for all tasks to build familiarity as quickly as possible.
Use AI to accelerate well-understood tasks while deliberately doing the harder, judgment-intensive work manually — maintaining the professional development that comes from struggling with difficult decisions.
Avoid AI for the first year of PM work to develop fundamentals first.
AI fluency and professional development are mutually exclusive.
===
What makes a PM 'AI-fluent' rather than just 'AI-dependent'?
Using AI tools consistently across all product tasks.
Knowing when to use AI, when not to, and maintaining the ability to evaluate AI outputs critically and take full accountability for every product decision.
Being able to explain how AI tools work technically.
Using AI to produce more output than peers who do not use AI.
===
What is the most important ethical consideration for PMs building AI-powered product features?
Ensuring AI features generate sufficient revenue to justify development.
Designing AI features that are transparent about AI involvement, handle AI failures gracefully, do not produce discriminatory outcomes, and maintain human accountability for consequential decisions.
Avoiding AI features until the technology is fully mature.
Disclosing AI involvement in all product features to users.
===
A PM says: "AI can now do most of what junior PMs do, so we don't need to hire them." What is the most accurate response?
They are correct — AI will replace junior PM roles entirely.
AI can replicate the surface-level output of junior PM work but cannot develop the judgment, customer empathy, and cross-functional relationship skills that make senior PMs effective — skills that develop through junior PM experience.
They are correct for product documentation but not for strategy.
The answer depends entirely on the specific company and product type.
===
What is the most important long-term investment for a PM using AI extensively in their work?
Staying current with every new AI PM tool that launches.
Investing deliberately in deep customer connection, cross-functional relationship building, and the judgment-intensive product work that compounds professional capability over time.
Learning to build AI tools rather than just using them.
Building a personal brand around AI-augmented PM productivity.
===
As a PM, what is the single most important commitment when using AI in your product work?
Producing more output and moving faster than non-AI PMs.
Maintaining full accountability for every product decision — ensuring AI assistance makes your thinking more rigorous and your decisions better, without reducing your ownership of or responsibility for product outcomes.
Disclosing AI assistance in all product documentation.
Using AI tools approved by your organisation's technology governance team.
`;

// Fisher–Yates shuffle (client-only, so Math.random is fine).
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Parse RAW into { q, options:[{t,s}] }; the 2nd option (B) is correct.
const ITEMS = RAW.split(/^===$/m)
  .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
  .filter((lines) => lines.length >= 5)
  .map((lines) => ({
    q: lines[0],
    options: lines.slice(1, 5).map((t, i) => ({ t, s: i === 1 ? 1 : 0 })),
  }));

export const PRODUCT_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getProductSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
