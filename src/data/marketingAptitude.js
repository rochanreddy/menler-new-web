// AI for Marketing & Sales question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getMarketingSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
What is the most important step before using Claude to write marketing copy?
Ask Claude to research your industry and write the copy independently.
Define your target audience, the specific job the copy must do, the tone, and the channel — then brief Claude with that context.
Give Claude your competitor's copy and ask it to improve on it.
Ask Claude to write several versions and pick the best one without input.
===
You receive an AI-generated social media post that is grammatically perfect but sounds nothing like your brand. What is the root cause?
The AI tool used is not advanced enough for brand voice work.
The prompt lacked brand voice guidance — tone, vocabulary preferences, what to avoid, and ideally examples of on-brand content.
AI cannot replicate brand voice under any circumstances.
Social media copy always sounds generic when AI-generated.
===
What is the most effective AI-assisted workflow for a monthly content calendar?
Ask Claude to generate the entire calendar without any input.
Define your content pillars, audience personas, key dates, and channel mix first — then use Claude to generate topic ideas, post drafts, and schedule recommendations within that framework.
Use Claude to copy last month's calendar with different dates.
Ask Claude to research what competitors are posting and replicate it.
===
You want Claude to write an email campaign for a product launch. Which prompt produces the most useful result?
"Write an email for our product launch."
"Write a 3-email drip sequence for our new inventory management SaaS launch targeting supply chain managers at mid-size Indian manufacturers. Email 1: problem-aware hook. Email 2: solution and proof. Email 3: urgency and CTA. Tone: direct, no fluff. Subject lines included."
"Write a professional marketing email for our new product."
"Write emails like the ones successful SaaS companies send."
===
An AI-generated ad headline gets high click-through rates but the product page has poor conversion. What does this indicate?
The AI tool needs to be reconfigured for conversion-focused copy.
The headline creates an expectation the product page does not fulfil — a messaging alignment problem, not an AI problem.
High CTR always leads to low conversion — this is normal AI behaviour.
The AI-generated headline should be replaced with a human-written one.
===
What is the most appropriate use of AI for A/B testing marketing copy?
Have AI select the winning variant automatically based on early data.
Use AI to generate multiple copy variants efficiently, then run structured A/B tests with defined metrics and sufficient sample sizes — with human analysis of results and decision-making.
AI-generated copy always outperforms human-written copy in A/B tests.
A/B testing marketing copy should never use AI-generated variants.
===
You are building a content strategy for a B2B SaaS company. What is Claude most useful for?
Determining which content topics will generate the most leads.
Researching topic frameworks, drafting thought leadership outlines, writing first drafts of long-form content, and repurposing existing content across formats.
Predicting which content will rank on Google before it is published.
Replacing the need for subject matter expert input in content creation.
===
What is the most important check before publishing AI-generated marketing content?
Check that it is grammatically correct.
Verify every factual claim, statistic, and product specification — AI can generate plausible-sounding but incorrect content that damages credibility when published.
Check that it is longer than your competitor's content.
Confirm the AI tool used is on your company's approved list.
===
What is the most effective use of Claude for repurposing a long-form blog post?
Ask Claude to summarise the blog post for all channels.
Brief Claude on each target channel, its format constraints, and audience context — then ask Claude to adapt the blog for each channel specifically rather than produce one summary for all.
Ask Claude to shorten the blog post progressively for each channel.
Repurposing should always be done manually to maintain quality.
===
You ask Claude to write content that positions your brand as a thought leader. The output is generic and forgettable. What is the most likely cause?
Claude cannot write thought leadership content.
The prompt lacked a specific, non-obvious point of view — thought leadership requires a genuine perspective, which must come from the brand, not from AI.
The content needs to be longer to establish thought leadership.
You need a more advanced AI model for thought leadership work.
===
What is the most effective use of AI for video script writing?
Ask Claude to write the script without any context about the video.
Brief Claude on the video objective, audience, platform, desired length, hook approach, and call to action — then use Claude to draft the script structure and dialogue.
Video scripts require a professional scriptwriter — AI cannot help.
Ask Claude to write a script based on a competitor's most viewed video.
===
What is the most important principle for using AI in influencer marketing content?
Have AI generate all influencer briefs and posts.
AI can help structure briefs and suggest content angles, but the influencer's authentic voice must be preserved — branded content that sounds AI-generated erodes the trust that makes influencer marketing effective.
AI and influencer marketing should never be combined.
Use AI to select influencers based on follower count data.
===
You are a marketing manager reviewing an AI-generated campaign brief. What should you check beyond spelling and grammar?
Whether the brief is longer than your previous campaign briefs.
Whether the strategy is coherent, the audience definition is specific, the insight is genuine (not generic), and every tactical recommendation follows from the stated strategy.
Whether the brief matches the format of industry standard templates.
Whether Claude has cited its sources for the market data included.
===
What is the most effective way to use AI to improve an underperforming campaign?
Ask Claude to diagnose why the campaign is underperforming.
Share the campaign performance data, the original brief, and what you know about audience response — ask Claude to help structure a diagnostic framework and generate hypotheses to test.
Have Claude generate a completely new campaign to replace the existing one.
Ask Claude to predict what changes will most improve performance.
===
What is the most important limitation of AI for creative campaign ideation?
AI cannot generate creative ideas — only humans can.
AI generates ideas from patterns in training data — making it excellent for executing familiar formats but less likely to produce the genuinely surprising, culturally specific, or emotionally resonant ideas that define breakthrough campaigns.
AI ideation only works for digital campaigns, not above-the-line advertising.
AI creative ideas always require legal review before use.
===
What is the most effective use of Claude for sales prospecting research?
Ask Claude to find all potential customers in your target market.
Brief Claude on your ICP and ask it to structure research on specific named prospects — their business context, likely pain points, relevant trigger events, and the best angle for outreach.
Ask Claude to generate a list of 1000 prospects to cold call.
Use Claude to research prospects after the first meeting, not before.
===
You want to use Claude to help write a proposal for a new enterprise client. What information must you provide?
Just the client's name and industry.
The client's specific problem, what they said in discovery, what outcome they need, the solution you are proposing, commercial terms, and why you are the right partner.
Your standard proposal template and ask Claude to fill it in.
The price and features of your product.
===
A sales rep uses AI to send highly personalised outreach at scale. What is the most important risk?
The AI will make grammatical errors in the emails.
Personalisation that looks researched but is not genuine can be detected by prospects — damaging trust and making future outreach from that sender less effective.
Sending too many emails will trigger spam filters.
Personalised outreach at scale is always more effective than generic outreach.
===
What is the most effective use of AI to help a sales team prepare for a discovery call?
Have AI conduct the discovery call on behalf of the sales rep.
Use Claude to research the prospect, anticipate their likely pain points and questions, suggest discovery questions mapped to your qualification framework, and prepare relevant proof points.
Use Claude to write a script for the sales rep to read during the call.
AI cannot help with discovery call preparation.
===
You are building a CRM-integrated AI workflow to help sales reps update deal notes after calls. What is the most important design element?
Automate all CRM updates without rep review.
Have AI draft the call summary and deal note from the rep's brief verbal or written input — with the rep reviewing and confirming before it is saved to the CRM.
Use AI only to remind reps to update the CRM after calls.
CRM data should always be manually entered by reps for accuracy.
===
What is the most effective use of AI to improve sales email response rates?
Have AI send emails automatically without rep involvement.
Use Claude to help craft subject lines and opening sentences tailored to the specific prospect context — the elements with the highest impact on open and response rates.
Ask Claude to make all emails shorter.
Use Claude to write longer emails with more product information.
===
A sales manager wants to use AI to predict which deals will close. What is the most important caution?
AI deal prediction tools are always more accurate than manager intuition.
AI deal prediction is based on historical CRM data patterns — it cannot account for relationship factors, political dynamics, or emerging information that experienced reps have but have not entered into the CRM.
Deal prediction AI is only reliable for deals above a certain value threshold.
AI deal prediction should replace pipeline reviews entirely.
===
What is the most effective way to use Claude for competitive sales battlecards?
Ask Claude to research all competitors and write the battlecards independently.
Provide Claude with specific competitor information, the objections your reps most frequently hear, and your differentiation points — use Claude to structure the battlecard and draft the competitive responses.
Battlecards should always be written by product marketing without AI.
Ask Claude to recommend which competitors to focus on.
===
What is the most effective AI-assisted workflow for handling sales objections?
Have AI respond to all objections automatically in email.
Build a library of common objections with Claude-drafted responses, validated by experienced reps — then use Claude to help reps personalise these responses to specific prospect contexts.
Sales objection handling should never use AI as it requires human empathy.
Ask Claude to identify the best objection-handling framework for your industry.
===
You want to use Claude to help create a sales playbook for a new market segment. What approach produces the best result?
Ask Claude to write the playbook based on general B2B sales best practice.
Brief Claude on everything you know about the segment from early sales conversations, what has worked, what has not, and the specific buyer journey — then use Claude to structure and document it.
Copy a playbook from a similar company and ask Claude to adapt it.
Sales playbooks should always be written by the sales director without AI.
===
What is the most appropriate use of AI in sales coaching?
Have AI score every sales call and determine coaching priorities.
Use AI to help managers structure coaching conversations, identify patterns in rep performance data, and draft development plans — with managers delivering all actual coaching and development support.
AI sales coaching tools replace the need for sales managers.
Sales coaching should never involve AI tools.
===
You are using Claude to help draft a client presentation on the commercial terms of a deal. What is the most important caution?
Ensure the presentation is visually engaging.
Verify every commercial figure, term, and representation against the actual agreed terms — errors in commercial presentations can create unintended contractual commitments.
Ask Claude to recommend the most favourable commercial terms to present.
Commercial presentations should never be drafted with AI.
===
What is the most effective way to use Claude to help with customer renewal and expansion conversations?
Have Claude conduct renewal conversations via automated email sequences.
Use Claude to research the customer's usage, results achieved, and business context changes — then prepare personalised talking points that connect their success to the expansion opportunity.
Renewal and expansion should always be managed without AI tools.
Ask Claude to calculate the maximum price increase the customer will accept.
===
What distinguishes a sales professional who uses AI effectively from one who produces unreliable AI-assisted work?
The effective professional uses more AI tools.
The effective professional brings genuine prospect and customer knowledge to every AI interaction — and reviews all AI-generated sales content before using it with prospects and clients.
The effective professional only uses AI for low-stakes sales tasks.
The effective professional has more technical training in AI tools.
===
What is the most important professional obligation for sales professionals using AI in customer interactions?
Disclosing AI use to every customer.
Ensuring all representations made to customers — claims about the product, commercial terms, timelines, and commitments — are accurate, regardless of whether AI assisted in drafting them.
Using only AI tools approved by the legal team.
Documenting AI usage in every customer interaction record.
===
What is the most effective use of Claude for market research?
Ask Claude to conduct primary research with your target customers.
Use Claude to synthesise secondary research, structure competitive landscapes, and draft research frameworks — while primary customer research remains human-conducted.
Trust Claude's market data as current and comprehensive.
AI cannot contribute meaningfully to market research.
===
You ask Claude to summarise your target market's key pain points. What is the most important limitation to understand?
Claude will only summarise pain points from your industry.
Claude's response is based on training data patterns — not your specific customers. Only direct customer research reveals the actual pain points of your specific audience in your specific context.
Claude can only identify five pain points per query.
Claude's pain point analysis is always too general for B2B markets.
===
What is the most effective AI-assisted approach to analysing customer interview transcripts?
Ask Claude to conduct the customer interviews and summarise them.
Define the specific themes and questions you want to analyse across transcripts — then use Claude to identify patterns, group similar responses, and surface outliers across the full dataset.
Give Claude the transcripts and ask it to tell you what customers want.
Customer interview analysis should always be done manually.
===
You want Claude to help build a customer persona. What produces the most useful output?
Ask Claude to create a persona for your target customer.
Share actual research data — interview quotes, survey findings, behavioural data — and ask Claude to structure this into a persona document rather than generating a persona from general assumptions.
Ask Claude to build a persona based on demographic data alone.
Personas should always be built by a UX researcher without AI.
===
What is the most appropriate use of AI for competitor analysis?
Ask Claude to monitor competitor activity in real time.
Use Claude to structure the competitive analysis framework, synthesise publicly available information about competitors, and organise findings by dimension — then validate key findings independently.
Trust Claude's competitor analysis as comprehensive and current.
Competitor analysis should never use AI due to sensitivity.
===
What is the most effective use of AI for social listening and brand sentiment analysis?
Ask Claude to monitor social media and report brand sentiment hourly.
Use social listening tools to collect data, then use Claude to help structure the analysis, identify themes, and draft the insights report — with human judgment applied to what the sentiment patterns mean for strategy.
AI cannot contribute to sentiment analysis work.
Have Claude search the internet and report on recent brand mentions.
===
You are using Claude to help identify market entry opportunities in a new Indian city. What is the most important supplement to Claude's analysis?
Detailed population statistics for the city.
On-the-ground primary research — local customer conversations, distribution partner interviews, and direct observation of market dynamics that AI training data cannot capture.
A comparison with how you entered other cities previously.
AI analysis is sufficient for market entry decisions in most Indian cities.
===
What is the most effective way to use Claude to help analyse customer churn data?
"Tell me why customers are churning."
"Analyse this churn data across these dimensions: [list]. Identify the top three factors associated with churn in the first 90 days, segment by customer size, and flag any patterns that differ significantly from our overall churn rate."
"What is our churn rate in this data?"
"Find the most important insight in this churn data."
===
A marketing team uses Claude to generate insights from customer feedback surveys. The insights look comprehensive but stakeholders are not acting on them. What is most likely wrong?
The insights need to be presented in a more visually engaging format.
The insights are structured as findings rather than implications — telling stakeholders what customers said without connecting it to what the team should do differently.
Claude-generated survey insights are always too generic for action.
Stakeholders do not trust AI-generated market research insights.
===
What is the most important consideration when using Claude to help size a new market opportunity?
Use Claude's market size figure directly in your business case.
Treat Claude's market sizing as a starting hypothesis to validate — trace every figure to a primary source, challenge the methodology, and stress-test the assumptions with domain experts.
Market sizing is too complex for AI assistance.
Only use Claude for market sizing if it can cite sources for every figure.
===
What is the most effective way to use Claude for win/loss analysis?
Ask Claude to determine why deals are won or lost from CRM data alone.
Collect win/loss interview data from customers and lost prospects first — then use Claude to structure the analysis, identify patterns, and draft the insights report.
Win/loss analysis should never use AI.
Ask Claude to predict which future deals will be won based on past patterns.
===
You want to use Claude to help identify trends relevant to your marketing strategy. What is the most important limitation?
Claude cannot identify trends — only humans can.
Claude's knowledge has a cutoff date — for fast-moving trends, AI research must be supplemented with current sources, recent reports, and real-time monitoring tools.
Claude can only identify trends in digital marketing, not broader market trends.
Trend analysis requires a dedicated market research agency, not AI.
===
What is the most effective use of AI for customer segmentation?
Have AI determine the optimal customer segmentation for your business.
Use AI to process customer data and identify statistical clusters — then apply marketing expertise to determine which segments are strategically meaningful and how to address each.
Customer segmentation should never use AI due to data privacy concerns.
AI customer segmentation always produces better results than manual segmentation.
===
What is the most important ethical consideration when using AI to build detailed customer profiles?
Ensuring the profiles are accurate.
Ensuring the data used to build profiles was collected with appropriate consent and that the profiles are used only for the purpose customers would reasonably expect — not for purposes they did not consent to.
Customer profiling with AI is always ethically appropriate.
Ethical considerations only apply to profiles of individual consumers, not business customers.
===
What is the most valuable thing a marketer brings to AI-assisted market research that AI cannot provide?
The ability to process more data than AI can handle.
Contextual business judgment — knowing which insights are strategically significant, which customer signals to prioritise, and how research findings connect to competitive positioning and business decisions.
Access to primary research methods AI cannot use.
A larger budget for research than AI tools require.
===
What is the most appropriate CRM task to automate with AI?
Automated customer relationship management without human involvement.
Repetitive, clearly defined tasks — drafting follow-up email templates, generating call summary notes, updating standard deal fields — that free sales and marketing professionals for higher-value activities.
All CRM tasks to maximise efficiency.
Tasks that involve the most data entry by the most senior sales staff.
===
You want to use Claude to help build a lead scoring system. What is the most important input?
Ask Claude to determine the best lead scoring criteria for your industry.
Define the characteristics and behaviours that your highest-converting leads have demonstrated historically — based on actual CRM and conversion data — then use Claude to help structure the scoring logic.
Use Claude to copy a lead scoring model from a similar company.
Lead scoring systems should always be built by data scientists.
===
What is the most effective design for an AI-assisted marketing automation workflow?
Automate all customer communications without human review.
Automate the routine, rules-based communication steps — triggered emails, sequence progression, list segmentation — while maintaining human review for anything that requires contextual judgment or involves high-value relationships.
Marketing automation should only trigger from human-initiated actions.
AI marketing automation is only appropriate for B2C, not B2B.
===
A marketing team builds an AI workflow that sends personalised emails at scale. After three months, open rates decline significantly. What is the most likely cause?
The AI tool has become less effective over time.
The audience has learned to recognise the pattern of AI-generated personalisation — the emails feel formulaic despite being individually addressed.
Email open rates always decline after three months.
The marketing team needs to upgrade to a more advanced AI model.
===
What is the most effective use of Claude in revenue operations (RevOps)?
Have Claude manage the entire RevOps function.
Use Claude to draft process documentation, structure analytical frameworks, generate reporting templates, and synthesise cross-functional data — with RevOps professionals maintaining strategic oversight and decision-making.
Claude cannot contribute to RevOps functions.
Use Claude to predict revenue and set sales targets automatically.
===
You want to build an AI-assisted system to generate personalised product recommendations for existing customers. What is the most important governance decision?
Which AI recommendation algorithm produces the highest CTR.
What data is used to generate recommendations, whether customers have consented to this use of their data, and whether there is a mechanism to override recommendations that are contextually wrong.
How frequently recommendations should be sent to each customer.
Whether to disclose that recommendations are AI-generated.
===
What is the most effective use of AI for customer success management?
Have AI manage all customer success interactions.
Use AI to monitor product usage signals, surface at-risk customers, draft check-in communications, and structure success plan templates — with customer success managers leading all actual customer relationships.
Customer success is too relationship-dependent for AI involvement.
Use AI to determine which customers should be escalated to enterprise tier.
===
You are evaluating whether to implement an AI chatbot for your marketing website. What is the most important design decision?
Which AI model powers the chatbot.
The precise boundary between what the chatbot handles and when it escalates to a human — because this boundary determines customer experience quality and conversion impact.
The visual design of the chatbot interface.
Whether to name the chatbot to make it seem more human.
===
What is the most effective way to use Claude to help build a sales and marketing alignment process?
Ask Claude to write the alignment process without input from both teams.
Facilitate a structured conversation between sales and marketing to identify friction points and shared definitions — then use Claude to document the agreed process, SLAs, and handoff criteria.
Sales and marketing alignment cannot be supported by AI tools.
Ask Claude to recommend the best sales and marketing alignment framework.
===
You use Claude to help build a customer journey map. What makes this effective?
Ask Claude to map the ideal customer journey for your category.
Ground the map in actual customer research — the stages customers go through, their questions and concerns at each stage, and the touchpoints where they interact with your brand — then use Claude to structure and document it.
Customer journey maps should always be created by UX professionals.
Ask Claude to create a journey map based on how your competitors structure their customer experience.
===
What is the most important metric for evaluating AI-assisted marketing automation?
The number of automated communications sent per month.
The quality of customer engagement and conversion outcomes — whether AI-assisted automation produces interactions that customers value and that move them towards purchase, not just high volume at low cost.
The cost per automated communication.
The percentage of marketing tasks automated.
===
What is the most effective use of AI in managing a high-volume inbound lead qualification process?
Have AI qualify and route all inbound leads without human review.
Use AI to score and prioritise inbound leads based on defined criteria, draft the initial response to each lead, and route to the appropriate sales resource — with humans handling all qualification conversations.
Inbound lead qualification should always be done manually.
Use AI to determine which leads should receive no follow-up.
===
What is the most important thing to monitor after deploying an AI-assisted customer communication workflow?
The number of communications sent per day.
Customer engagement quality — response rates, sentiment, opt-out rates, and whether the communications are generating the intended customer actions.
The cost per communication compared to the previous manual process.
Whether the AI tool is generating any error messages.
===
What is the most effective way to maintain authenticity in AI-assisted CRM communications at scale?
Send the same AI-generated message to all contacts simultaneously.
Ensure every AI-generated communication is grounded in specific, genuine knowledge of the recipient — their actual situation, relationship history, and specific context — rather than formulaic personalisation tokens.
Always disclose that communications are AI-assisted to maintain trust.
Authenticity is incompatible with AI-assisted communication at scale.
===
What is the single most important principle for marketing and sales professionals using AI in customer-facing workflows?
Maximising the volume of customer interactions AI can handle.
Every customer interaction represents a relationship moment — AI assists the efficiency of these moments but the quality, accuracy, and authenticity of customer interactions remains the professional's responsibility.
Disclosing AI involvement in all customer-facing communications.
Using AI only for internal marketing and sales tasks, not customer-facing ones.
===
What is the most important principle governing AI use in marketing and sales?
Using AI for all tasks to remain competitive.
Every claim made to customers and every representation in marketing materials must be accurate — AI assistance does not transfer accountability for truthfulness and accuracy.
AI use must be disclosed in all marketing materials.
AI is only appropriate for back-office marketing tasks.
===
A marketing manager asks you to use AI to generate fake customer reviews for a product. What is the professional and legal response?
Generate the reviews since AI-written content is technically not from a real person.
Refuse — fake reviews are deceptive marketing practices prohibited by consumer protection law and platform policies, regardless of whether AI produces them.
Generate the reviews but make them sound authentic.
Use AI to generate reviews and disclose they are AI-generated.
===
What is the most significant risk of using AI to generate marketing content at high volume without adequate review?
The content will be low quality.
Inaccurate claims, misleading framing, or brand-inconsistent content can reach customers at scale before being caught — multiplying the reputational and legal exposure of any individual error.
High-volume content always performs worse than lower-volume content.
AI content volume triggers regulatory scrutiny.
===
What is the most important ethical consideration in AI-powered marketing personalisation?
Whether the personalisation improves click-through rates.
Whether the personalisation uses customer data in ways customers would reasonably expect and have consented to — not exploiting personal information in ways they would find intrusive or manipulative.
Personalisation is always ethical if customers have signed terms and conditions.
Ethical considerations in personalisation only apply to sensitive product categories.
===
You discover that your AI-generated ad campaign contains a claim that cannot be substantiated. What is the professional response?
Keep the campaign running since the claim sounds plausible.
Pause the campaign immediately, correct the claim, and implement a review process to prevent unsubstantiated claims reaching customers in future — regardless of the cost or disruption.
Add a small disclaimer to the ad to reduce legal exposure.
Wait to see if anyone challenges the claim before pausing the campaign.
===
What is "dark pattern" design and why is it incompatible with responsible AI marketing?
A visual design style that uses dark colours in marketing materials.
UX patterns that exploit cognitive biases to manipulate users into actions they did not intend — incompatible with responsible marketing because AI can generate these at scale and with increasing effectiveness.
Marketing copy that targets customers at night.
AI-generated content that is designed to look human-created.
===
What is the most appropriate attitude toward AI-generated content that increases sales metrics but raises ethical concerns?
Prioritise sales metrics — that is the purpose of marketing and sales.
Investigate the ethical concern seriously — if the content achieves sales through deception, manipulation, or privacy violation, it creates long-term brand and legal risk that outweighs short-term metric gains.
Use the content but monitor for complaints.
Let the legal team make the final call on ethical concerns.
===
What is the most important professional responsibility when using AI to target vulnerable customer segments?
Targeting vulnerable segments is always inappropriate regardless of AI involvement.
Applying heightened scrutiny to ensure the marketing approach does not exploit vulnerability — and rejecting AI-generated targeting or messaging approaches that could harm rather than genuinely serve these customers.
Vulnerable customer targeting is the same as any other targeting — just optimise for conversion.
Responsibility for vulnerable customer outcomes rests with the AI tool.
===
What does "attribution" mean in marketing and how does AI assistance affect the responsibility for accurate attribution?
How AI tools attribute credit for marketing ideas to their sources.
Attributing business outcomes (sales, leads) to the marketing activities that generated them — AI assistance in analysis does not reduce the marketer's responsibility to ensure attribution methodology is sound and conclusions are accurate.
Attribution is only relevant for digital marketing channels.
AI tools automatically determine the correct attribution model.
===
A senior manager asks you to adjust AI-generated campaign reporting to make performance look better before a quarterly review. What is the professional response?
Adjust the reporting — the manager has seniority to make this decision.
Refuse — reporting that misrepresents campaign performance misleads leadership decisions and creates business risk that outweighs any short-term political benefit.
Adjust the reporting but keep the original version for your records.
Ask the AI tool to generate a version of the report that shows better performance.
===
What is the most important skill for marketing and sales professionals in an AI-augmented role?
Proficiency in as many AI tools as possible.
Critical judgment — the ability to evaluate AI-generated content and analysis for accuracy, appropriateness, and strategic fit before it reaches customers or influences decisions.
Speed — being able to produce more content faster than competitors.
Technical knowledge of how AI marketing tools work.
===
What is the most honest framing of how AI will change marketing and sales roles?
AI will replace most marketing and sales roles within five years.
AI will transform the task mix — automating high-volume, rule-based activities while increasing the value of creativity, relationship management, strategic judgment, and customer empathy.
AI will only affect digital marketing roles, not sales or traditional marketing.
AI will make marketing and sales roles easier but not fundamentally different.
===
You use AI to generate a large volume of SEO content. What is the most important professional obligation before publishing?
Check that the content is grammatically correct.
Verify that every factual claim is accurate, the content genuinely serves the reader's needs (not just search algorithms), and the content reflects your brand's genuine expertise — not AI-generated filler.
Confirm the content includes the target keywords at the right density.
Check that the content is longer than competitor pages.
===
What is the most important thing marketing and sales professionals must remember about customer data used in AI systems?
Customer data in AI systems is automatically anonymised.
Customer data used to train or operate AI systems must have been collected with appropriate consent for that purpose — using customer data in ways beyond the scope of their consent is both unethical and increasingly illegal.
Customer data used internally for AI systems does not require consent.
Consent requirements for customer data only apply to sensitive personal data.
===
What is the single most important commitment for a marketing or sales professional using AI in customer-facing work?
Producing more content and outreach than was previously possible.
Maintaining the customer's trust — ensuring every AI-assisted interaction is accurate, relevant, and treats the customer with the respect and care that builds long-term relationships.
Staying ahead of competitors in AI tool adoption.
Disclosing AI involvement in all customer-facing communications.
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

export const MARKETING_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getMarketingSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
