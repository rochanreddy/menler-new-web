// AI for Product Management question bank — 75 questions (5 sets × 15).
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getProductSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You use AI to generate product feature ideas. The most important next step is:
Prioritise the ideas by the effort required to implement them.
*Validate which ideas address real, frequently occurring user problems.
Share all ideas with the engineering team for feasibility assessment.
Ask AI to rank the ideas by projected business impact.
===
You use Claude to write a product strategy document. What is the highest-risk gap?
The strategy may not align with your company's existing technical capabilities.
The strategy will be too generic for the engineering team to implement.
The strategy may not address regulatory requirements in your market.
*The strategy lacks your specific market context, user data, and competitive intelligence.
===
What is the most reliable AI use case in product discovery?
*Synthesising patterns from large volumes of user feedback quickly.
Determining which user problems are worth solving for your business.
Predicting which product features will have the highest adoption rate.
Replacing user interviews with AI-generated personas and insights.
===
A product manager uses AI to define target user personas. What is the most important limitation?
AI cannot model personas for niche or emerging user segments.
AI-generated personas are too detailed for practical use in roadmaps.
*AI personas reflect general patterns, not your actual user base.
AI personas lack the emotional depth needed for empathy-based design.
===
You use AI to analyse competitor products. What is the most critical verification step?
Check that the analysis covers all major competitors in your space.
*Verify specific product claims by using the actual competitor product.
Have a product designer review the analysis for completeness.
Run the competitor analysis again to confirm consistent outputs.
===
What is the most effective use of AI in writing a product requirements document?
*Drafting the structure and standard sections for human expert completion.
Writing the complete PRD based on the product brief you provide.
Generating the acceptance criteria for all features automatically.
Replacing the need for product spec reviews with AI-generated docs.
===
Which question should guide every AI-assisted product decision?
"What does AI recommend for this decision type based on industry patterns?"
"Is the AI output good enough for us to move forward without validation?"
"How would a top-tier product company make this decision?"
*"Does this decision serve the user problem we validated, or just what AI suggested?"
===
You are using AI to prioritise your product backlog. What is the most important input to provide?
The complete list of features and bugs in the current backlog.
Your company's overall product vision and strategy documents.
*Your validated user impact data, business goals, and technical effort estimates.
Examples of how competitors have prioritised similar features.
===
A product leader says "we should use AI to define our product roadmap." The most important challenge is:
*Roadmaps reflect strategic choices about what not to build — AI cannot make these tradeoffs.
AI roadmaps do not account for the technical dependencies between features.
AI cannot prioritise between competing stakeholder requirements reliably.
Roadmaps require quarterly updates that AI cannot maintain automatically.
===
What is the most valuable AI capability during a product discovery sprint?
Selecting which hypotheses to test based on strategic alignment.
Conducting user interviews autonomously at scale.
Predicting which discovery hypotheses will be validated by testing.
*Rapidly generating a wide set of problem hypotheses from user research inputs.
===
What is the most important quality a product manager needs when working with AI?
Technical understanding of how AI models generate their outputs.
*Critical evaluation of AI outputs against actual user evidence.
Speed in using AI to produce more product artefacts than competitors.
Ability to demonstrate AI-generated outputs to stakeholders convincingly.
===
You use AI to generate OKRs for your product team. What is the most important revision before adopting them?
Ensure the key results are time-bound and assigned to specific team members.
Check that the OKRs are ambitious enough to drive meaningful stretch.
*Replace generic outcome metrics with those that specifically reflect your product's goals.
Have the engineering team validate the key results are achievable.
===
What is the most important step before using AI to analyse user research data?
Ensure the research data is structured for AI to process efficiently.
Select the AI tool most suited to qualitative data analysis.
Verify that the research sample size is sufficient for pattern identification.
*Define the research questions the analysis should answer.
===
You run a design sprint and use AI to synthesise the outcomes. What is the most important verification step?
Have the sprint facilitator review the AI synthesis for accuracy.
*Compare the AI synthesis to your original notes to check for omissions or distortions.
Check that all participant perspectives are represented in the synthesis.
Ensure the synthesis connects to the product strategy document.
===
What is the most accurate description of AI's role in product strategy?
*AI accelerates production of strategy artefacts; humans provide the judgment.
AI can develop product strategy autonomously given sufficient context.
AI is most useful for execution planning, not for strategy development.
AI and human product managers produce strategy of equivalent quality.
===
What is the most effective use of AI in writing user stories?
Defining the acceptance criteria based on the product vision.
Determining which user stories belong in the current sprint.
*Drafting the initial user story format for each validated feature.
Estimating story points for each AI-generated user story.
===
You use AI to generate a product specification. An engineer reads it and says "this is ambiguous on the edge cases." What does this reveal?
*AI specifications require PM expertise to close gaps before engineering handoff.
The engineer should ask the AI to clarify the ambiguous sections.
AI product specifications are not yet reliable enough for engineering use.
The PM should regenerate the spec with a more detailed prompt.
===
What is the most important AI use case during the engineering build phase of a product?
Automatically managing the sprint board based on development progress.
Replacing code reviews with AI-driven quality assessment.
Predicting which features will require the most engineering effort.
*Helping engineers write, review, and debug code more efficiently.
===
A PM wants to use AI to write the release notes for a product update. What is non-negotiable?
The tone must match the company's established release note style.
*Every feature and bug fix mentioned must be verified as actually shipped.
The release notes must be reviewed by the engineering lead.
The release notes must list features in order of user impact.
===
What is the correct use of AI when managing stakeholder feedback on a product roadmap?
Determining which stakeholder preferences should influence the roadmap.
Responding to individual stakeholders based on their feedback patterns.
*Synthesising patterns across stakeholder inputs to surface common priorities.
Making the final roadmap prioritisation based on AI-weighted feedback.
===
You use AI to generate a go-to-market plan for a new feature. The most important input you must provide is:
The feature's technical specifications and implementation timeline.
The budget available for marketing the new feature.
Examples of GTM plans from comparable product launches.
*The specific user segment, use case, and validated problem the feature solves.
===
What is the most important principle for AI use in sprint planning?
*AI can assist preparation, but prioritisation decisions require human judgment.
AI can automate sprint planning to free PMs for strategic work.
AI should determine sprint capacity based on historical velocity data.
AI can select which backlog items to include based on roadmap alignment.
===
You use AI to draft a product announcement email. What must you review specifically?
The email's subject line and preview text for open rate optimisation.
*Every product claim, feature description, and availability statement for accuracy.
Whether the tone matches the company's established communication style.
Whether the announcement highlights the features most valued by users.
===
What is the highest-risk AI use case in the product development lifecycle?
Using AI to draft engineering tickets without human review.
Using AI to suggest naming options for new product features.
Using AI to summarise user research transcripts for PM review.
*Using AI-generated user research synthesis as the sole basis for feature decisions.
===
What is the most important thing a PM learns from using AI systematically in their product workflow?
How to write prompts that produce consistently structured product artefacts.
Which AI tools perform best across different product development stages.
*Which specific tasks AI can reliably accelerate and which require irreplaceable human judgment.
How to communicate AI's product outputs effectively to different stakeholders.
===
You use AI to draft technical documentation for a product API. What is the most critical review step?
The documentation must follow the company's technical writing style guide.
*Every technical claim, parameter description, and example must be tested for accuracy.
The documentation must be reviewed by the technical writer before publication.
The examples must use realistic rather than placeholder data.
===
A product team uses AI to generate test cases for a new feature. What is the most important human contribution?
*Identifying edge cases and failure scenarios that AI testing patterns may miss.
Ensuring the test cases cover the full acceptance criteria of each story.
Assigning test cases to the appropriate QA team members.
Reviewing the test cases for completeness against the feature specification.
===
What is the most effective AI contribution to post-launch product analytics?
Making recommendations on which product changes will improve retention.
Replacing the product analyst's role in interpreting usage data.
*Identifying patterns in user behaviour data that surface hypotheses to investigate.
Predicting which users will churn based on their post-launch activity.
===
You are preparing for a product retrospective and use AI to summarise the sprint. What must you add?
A comparison to AI benchmarks for sprint velocity in your product category.
The engineering team's individual contributions for performance tracking.
An AI-generated recommendation for the next sprint's focus areas.
*The team's specific context, decisions, and learnings that were not in structured data.
===
What is the most important governance requirement for AI tools used in the product development workflow?
Approval from the CTO for all AI tools used by the product team.
*Human ownership of every output that informs a product decision.
Documentation of every AI interaction in the product workflow.
Quarterly review of AI tool performance across the product lifecycle.
===
You use AI to analyse user retention data. The most important analytical principle is:
*Identify patterns that generate testable hypotheses before making product changes.
Make product changes immediately based on AI-identified retention drivers.
Compare your retention metrics to AI-sourced industry benchmarks.
Use AI to predict which users will churn and target them with retention campaigns.
===
A PM uses AI to analyse feature usage data. The AI finds that Feature X has low usage. What is the correct conclusion?
Feature X should be removed from the product to reduce complexity.
Users do not understand how to use Feature X and need better onboarding.
*Low usage is a signal worth investigating — not a conclusion about the feature's value.
Feature X is not valuable and should be deprioritised in the roadmap.
===
What is the most reliable use of AI for product experimentation?
Automatically selecting which experiments to run based on strategic priorities.
*Generating multiple experiment hypotheses from user data and product context.
Determining sample sizes and statistical significance thresholds for each experiment.
Making the shipping decision based on A/B test results from the experiment.
===
You use AI to analyse product NPS scores and verbatim comments. What is the most valuable output?
Prediction of which detractors will churn in the next 30 days.
An overall NPS trend analysis compared to industry benchmarks.
Automated responses to individual NPS comments at scale.
*Specific themes in verbatim comments from promoters and detractors.
===
What is the most important skill for a PM interpreting AI-generated product analytics?
*Asking whether the pattern reflects user behaviour or a data collection artefact.
Understanding the statistical methods AI used to identify the pattern.
Comparing AI analytics to the product team's intuitive understanding.
Determining whether the finding is significant enough to share with leadership.
===
A product team uses AI to define success metrics for a new feature. What is the most important revision?
Ensure metrics are measurable within the current product analytics infrastructure.
*Replace generic metrics with those that specifically reflect the feature's user value hypothesis.
Add leading indicators alongside lagging metrics for real-time tracking.
Check that metrics are consistent with the company's overall product KPIs.
===
You use AI to analyse which features drive conversion in your product. The AI identifies Feature Y as a strong predictor. What is the risk in acting on this directly?
Feature Y may be too complex to optimise for without significant engineering investment.
The AI analysis may have included users outside your target segment.
Feature Y's impact on conversion may differ across different user cohorts.
*Feature Y may correlate with conversion because engaged users discover it, not because it causes conversion.
===
What is the most appropriate product metric to track AI's impact on user value?
The number of AI interactions per user per session.
User satisfaction scores for the AI-powered features.
*Whether users achieve their core task goals faster or more successfully with AI features.
The percentage of tasks completed using AI versus manual methods.
===
You are reviewing AI-generated product usage reports for a quarterly business review. The most important thing to do before the review is:
Have the data team review the reports for accuracy before distribution.
*Verify every metric against the primary data source and document any discrepancies.
Check that the metrics align with what was tracked in the previous quarter.
Ensure the report format meets the QBR presentation standards.
===
What is the most important analytical question when AI identifies a drop in a product metric?
*"Is this a real behaviour change or a data collection or reporting issue?"
"Which team member is responsible for the metric that dropped?"
"How does this drop compare to historical seasonal patterns in this metric?"
"What is the AI's recommended action to recover the metric?"
===
A PM presents an AI-generated cohort analysis showing strong product-market fit. What is the most important methodological check?
Ensure the cohort size is above the threshold for statistical reliability.
Compare the cohort analysis to industry benchmarks for PMF signals.
*Confirm the cohort definition is consistent across all time periods in the analysis.
Verify that the retention curves were calculated by the correct AI model.
===
What is the most valuable AI contribution to product roadmap communication?
Predicting which roadmap items will generate the most stakeholder support.
Ranking stakeholder concerns by importance to address in communications.
Automatically producing the roadmap slides for the leadership presentation.
*Generating clear, stakeholder-specific explanations of why items are on the roadmap.
===
You use AI to identify user friction in your onboarding flow. What must you do before acting on the findings?
Share the findings with the design team for their assessment of severity.
*Validate the AI-identified friction points through direct user sessions or testing.
Quantify each friction point by its impact on activation rate.
Ask AI to suggest the UX changes that would address each friction point.
===
What is the most important thing to remember about AI-generated product data insights?
AI data insights are only reliable when the product has significant user volume.
AI identifies patterns that human analysts would eventually find themselves.
*AI identifies patterns, but correlation is not causation — test before you build.
AI data insights require validation only for features with significant investment.
===
What is the most effective way for a PM to use AI throughout the product development cycle?
*Direct AI for production tasks at each stage while owning every decision and output.
Delegate all documentation tasks to AI to focus on strategic decisions.
Use AI only for the stages where it demonstrably saves the most time.
Use AI uniformly across all stages to build consistent skills across the team.
===
You are designing an AI-powered feature for your product. The first question to answer is:
"Which AI model should we integrate for this feature?"
"What will the AI feature be called in the product?"
"How will we communicate AI's involvement to users?"
*"What specific user problem does AI solve better than a non-AI approach?"
===
What is the most important design principle for an AI-powered product feature?
Make the AI's decision process fully transparent to all users.
*Give users meaningful control to review, override, or guide AI decisions.
Ensure AI features are always faster than the non-AI alternative.
Design AI features so users do not need to understand AI to use them.
===
A product team is deciding whether to use a third-party AI API or build a proprietary model for their AI feature. The most strategically important factor is:
The cost difference between licensing an API and training a proprietary model.
Whether the CTO has experience with the third-party API's technology stack.
*Whether the feature requires data or capabilities unavailable in third-party APIs.
Which option will be faster to ship for the upcoming product deadline.
===
You are building an AI recommendation engine for your product. What is the most important quality metric to track?
*Whether recommendations lead to user outcomes, not just clicks.
The click-through rate on AI-generated recommendations.
The volume of recommendations generated per user session.
User satisfaction ratings immediately after a recommendation is shown.
===
A user reports that an AI feature in your product gave them incorrect information. What is the correct immediate response?
Explain that AI features are inherently probabilistic and errors are expected.
Ask the user to provide more context so the AI can learn from the error.
Direct the user to the feature's known limitations documentation.
*Acknowledge the error, investigate the failure mode, and communicate what was done to fix it.
===
What is the most important consideration when adding AI to an existing product workflow?
Whether the AI model is compatible with your product's technical infrastructure.
Whether your users are ready to adopt AI-powered features.
*Whether AI genuinely improves the workflow or adds friction and complexity.
Whether competitors have already added AI to comparable workflows.
===
You are designing an AI feature that will make decisions that affect user accounts. What is the most critical design requirement?
*Users must be able to review, understand, and reverse AI decisions.
The AI must achieve 99% accuracy before the feature is launched.
Users must be notified every time the AI makes a decision.
The AI decisions must be explained using technical model outputs.
===
What is the most important user research question to answer before launching an AI product feature?
"Are users excited about AI-powered features in this product category?"
*"Do users understand what the AI is doing and when to trust its outputs?"
"How does the AI feature perform in usability testing compared to the manual workflow?"
"What percentage of users activate the AI feature in the first session?"
===
An AI product feature consistently makes errors for a specific user segment. What must you do?
Add a disclaimer that the feature may not work for all user types.
Monitor the error rate for another month to see if it self-corrects.
*Stop the feature for that segment while investigating and correcting the issue.
Ask that user segment to provide more training data to improve the model.
===
What is the most honest way to communicate AI feature limitations to users?
Use general language like "AI-powered" without specific capability descriptions.
Mention AI in marketing copy but not in the product interface itself.
Tell users AI is experimental so they calibrate expectations appropriately.
*State specifically what the AI does well and where users should verify or override.
===
What distinguishes an AI feature that builds user trust from one that erodes it?
*Consistent, reliable performance over time within a clearly communicated scope.
Using the most advanced AI model to minimise error rates.
Explaining the AI's reasoning for every output it produces.
Asking users to rate AI outputs to improve model quality over time.
===
A PM is evaluating whether to use a large language model or a rule-based system for a product feature. When is a rule-based system more appropriate?
When the feature needs to handle a wide variety of natural language inputs.
*When the task has clear, enumerable rules and errors have significant consequences.
When the engineering team has more experience with rule-based systems.
When the feature must operate without internet connectivity.
===
What is the most important product metric for evaluating whether an AI chatbot in your product is working?
The average conversation length per user session.
The percentage of conversations where the AI does not escalate to a human.
User satisfaction ratings immediately after each chatbot interaction.
*Whether users successfully complete the task they started the conversation for.
===
You are designing the error handling for an AI product feature. What is the most important principle?
*Errors should degrade gracefully and inform users what to do next.
Errors should be minimised through comprehensive testing before launch.
Errors should be logged silently so as not to interrupt the user experience.
Errors should always be escalated to a human agent for resolution.
===
What is the most important question a PM should ask about an AI vendor's model before integrating it into their product?
"What is the model's accuracy score on standard benchmarks?"
"How many companies are currently using this model in production?"
*"How does the model perform on the specific tasks our users will actually use it for?"
"What is the model's latency profile under our expected load?"
===
A major AI feature your team built has received negative user feedback after launch. What is the most productive first response?
*Analyse the specific failure modes from user feedback to understand what went wrong.
Revert the feature immediately until user satisfaction recovers.
Reassure users that AI features improve over time with usage.
Ask users to provide more detailed feedback through an in-app survey.
===
Your CEO requests that the product team add AI to every feature by next quarter. What is the most professionally sound response?
Commit to the goal and begin integrating AI across all features immediately.
Explain that adding AI everywhere would significantly slow the team's delivery velocity.
Counter-propose that the team should add AI to the three highest-priority features only.
*Propose evaluating each feature against the criterion of whether AI specifically improves user value.
===
A competitor launches an AI feature that your users are excited about. What is the correct product response?
Immediately begin building a comparable feature to maintain competitive parity.
*Understand what problem the feature solves for users before deciding to build a version.
Wait six months to see how the feature performs before making a product decision.
Ask your power users whether they want your version of the feature.
===
A B2B customer says "your AI feature gave my employee incorrect information that led to a customer service error." What is your responsibility?
Point to your terms of service that disclaim AI output accuracy.
Ask for the specific interaction log so the AI can learn from the error.
*Investigate the failure, acknowledge the impact, and explain what has been fixed.
Offer a credit for the inconvenience caused by the AI output.
===
Your product team has been using AI to generate all product documentation for six months. A new team member finds significant inaccuracies in several key docs. What does this reveal?
*AI documentation was deployed without a verification workflow in place.
The AI tool used for documentation has become less accurate over time.
The new team member identified edge cases the existing team had not noticed.
Documentation accuracy deteriorates when AI is used for long periods.
===
You want to use AI to conduct competitive analysis and recommend which features to build. What is the most important limitation to communicate to your team?
AI competitive analysis is only useful for products with more than 50 competitor features to compare.
The analysis will need to be repeated monthly to stay relevant to fast-moving markets.
*Competitor intelligence from AI may be outdated and feature recommendations lack your specific strategic context.
Engineering must validate the recommended features for technical feasibility.
===
A product analytics AI tool flags that your most-used feature has declining engagement. Before investigating, what is the most important question?
"Which user segment shows the most significant engagement decline?"
"Has a competitor recently released a comparable feature?"
"Should we notify users of the change and gather their feedback?"
*"Has anything changed in how this feature's usage is tracked or reported?"
===
Your product's AI feature performs excellently in testing but struggles in production with certain user inputs. What is the most likely cause?
The AI model degrades in performance under higher production load.
*Production user inputs are more diverse and unexpected than test scenarios covered.
The production environment has different AI model configurations than testing.
Users are interacting with the feature differently than the design intended.
===
A PM uses AI to decide which features to cut from the roadmap. What is the most important thing they must not outsource to AI?
The analysis of which features have the lowest usage in production.
The documentation of why each cut feature was removed from the roadmap.
*The judgment about which features are strategically essential versus tactically convenient.
The communication plan for informing stakeholders about the roadmap change.
===
What is the most important thing a PM must understand about users before designing an AI product feature?
*Whether users can reliably identify when the AI output is correct versus incorrect.
Whether users are generally positive or negative about AI technology.
Whether users have prior experience with AI-powered products.
Whether users are willing to share their data to train the AI model.
===
Your product team ships an AI feature that inadvertently creates a negative experience for users with accessibility needs. What must you do?
Add accessibility disclaimers to the feature so affected users know to avoid it.
*Stop the feature for affected users, fix the accessibility issue, and re-test before redeployment.
Prioritise the accessibility fix in the next sprint without removing the feature.
Offer affected users an alternative non-AI workflow as a workaround.
===
A startup wants to build an "AI product manager" to replace human PMs. What is the most accurate assessment?
AI product managers are already working effectively in some companies.
AI could replace junior PMs but not senior PMs with strategic experience.
AI product managers would be more consistent but less creative than human PMs.
*AI can assist PM tasks but cannot replace the judgment, relationships, and accountability PMs provide.
===
You discover that your AI recommendation feature has been surfacing content that subtly steers users toward higher-margin products regardless of fit. What is the correct response?
Disclose the recommendation logic to users so they can make informed choices.
Adjust the objective function to balance user fit and margin equally.
*Stop the feature immediately, investigate the objective function, and redesign with user value as the primary optimisation target.
Continue operating the feature since recommendation engines always involve business objectives.
===
What is the most important quality for a PM building AI-powered products?
Technical expertise in machine learning and model evaluation.
*The judgment to distinguish when AI genuinely serves users versus when it creates complexity.
Speed of AI feature adoption compared to the competitive market.
Ability to communicate AI feature benefits to sales and marketing teams.
===
Menler's AI for Product Management bank tests professionals at which level of AI maturity?
Learning the foundational concepts of AI to start a career in product management.
Building AI models and evaluating machine learning systems for product teams.
Managing AI vendors and procurement processes for enterprise product teams.
*Applying AI judgment to real product decisions with professional ownership of outcomes.
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

// Parse RAW into { q, options:[{t,s}] }; the option line prefixed with "*" is correct.
const ITEMS = RAW.split(/^===$/m)
  .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
  .filter((lines) => lines.length >= 5)
  .map((lines) => ({
    q: lines[0],
    options: lines.slice(1, 5).map((l) => {
      const correct = l.startsWith('*');
      return { t: correct ? l.replace(/^\*\s*/, '') : l, s: correct ? 1 : 0 };
    }),
  }));

export const PRODUCT_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getProductSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}

// The bank's named sets, in source order.
export const PRODUCT_SETS = [
  'AI for Product Discovery & Strategy',
  'AI in the Product Development Lifecycle',
  'Data-Driven Product Decisions with AI',
  'AI Product Features & Design',
  'Product Judgment Scenarios',
];

// A fresh session for one set: `count` questions from that set's block, options shuffled.
export function getProductSet(setIdx, count = 15) {
  const per = Math.floor(ITEMS.length / PRODUCT_SETS.length);
  const start = setIdx * per;
  return shuffle(ITEMS.slice(start, start + per)).slice(0, count)
    .map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
