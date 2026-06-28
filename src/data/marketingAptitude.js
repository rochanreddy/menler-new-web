// AI for Marketing & Sales question bank — 75 questions (5 sets × 15).
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getMarketingSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You use Claude to generate your brand's content strategy. The most important revision before adopting it is:
Check that it covers all digital channels your brand currently uses.
*Inject your actual customer research, positioning, and competitive context.
Ensure the content calendar is realistic for your team's capacity.
Ask Claude to refine the strategy with more specific tactical recommendations.
===
You use AI to write a campaign brief. What is the most important element you must provide as input?
Examples of successful campaigns from competitors for reference.
The platforms and formats the campaign will run across.
The budget available for the campaign.
*Your specific target audience, positioning, and campaign objective.
===
What is the most effective use of AI for content ideation in marketing?
*Rapidly generating a large quantity of ideas for human curation and refinement.
Producing the final, publication-ready content for each ideated topic.
Predicting which content topic will generate the most engagement.
Replacing the creative brief stage by suggesting content formats directly.
===
You ask Claude to write social media posts for your brand. All posts sound the same. The cause is:
Claude defaults to formal language that sounds uniform across posts.
Social media content is not Claude's strongest output type.
*The prompt lacks constraints that force variety in format, tone, and angle.
The posts need human editing to add the brand's authentic voice.
===
An AI tool claims it can predict which ad creative will perform best. The most critical evaluation question is:
"Which companies have used this tool and what were their results?"
*"Under what conditions was this prediction validated and what was the error rate?"
"What data does the tool use to make the prediction?"
"How does the prediction compare to our own historical testing data?"
===
You use AI to generate SEO-optimised blog content at scale. The most important quality risk is:
*Content that is syntactically optimised but thin in genuine insight or expertise.
Content that is too long for search engine crawlers to fully index.
Content that may duplicate existing posts on your site accidentally.
Content written in a style inconsistent with your brand voice.
===
What is the most accurate description of AI's role in creative campaign development?
AI produces final campaign concepts that are as creative as human-led work.
AI is most useful for execution but not for creative concept development.
AI creativity is superior because it is not constrained by human assumptions.
*AI generates starting material that human creativity refines into breakthrough work.
===
You use AI to personalise email subject lines for a campaign. What is the most important measurement to take?
The number of unique subject lines AI generated for the campaign.
Customer satisfaction scores for the email campaign overall.
*Open rates for AI-personalised versus non-personalised subject lines.
The time saved by using AI versus manual subject line writing.
===
A marketing manager uses AI to write all their LinkedIn posts without reading them. What is the professional risk?
*Incorrect facts, off-brand statements, or tone failures reach the public without review.
Followers will detect that posts are AI-generated and engagement will drop.
The posts will not rank well in LinkedIn's algorithm without personalisation.
The manager will lose their authentic professional voice over time.
===
Which marketing task is Claude least suited to perform independently?
Drafting headline variants for an A/B test on a landing page.
Rewriting product descriptions for a consistent tone across a catalogue.
Generating email subject line options from a campaign brief.
*Deciding which brand positioning strategy will resonate in a specific market.
===
You use AI to generate a competitor analysis. What is the most important verification step?
Have a senior marketer review the analysis for strategic relevance.
*Verify each specific claim about competitors from primary sources.
Run the analysis through a second AI tool to cross-check findings.
Check whether the analysis covers all major competitors in your space.
===
What is the most effective AI-assisted workflow for launching a new product marketing campaign?
AI runs the full campaign autonomously, including optimisation and reporting.
AI handles data and analytics; humans handle all creative and copy.
*AI generates initial drafts; humans refine, validate, and make strategic decisions.
AI writes the copy; an AI review tool validates it for quality.
===
What is the most important principle for responsible AI use in advertising?
AI-generated advertising must be disclosed to consumers in all markets.
AI should only be used for ad formats that do not involve creative judgment.
AI advertising must achieve the same performance as human-created ads.
*All AI-generated advertising claims must be accurate and not misleading.
===
You use AI to generate copy for an Indian FMCG campaign. What is the highest-risk gap?
Language accuracy in Hindi and regional languages compared to English output.
*Cultural nuance and local context that AI training data may not adequately represent.
The ability to match the visual tone of Indian advertising standards.
Regulatory compliance with ASCI guidelines for advertising in India.
===
What is the most valuable thing a marketer learns from systematic AI content experimentation?
*Which prompt specifications reliably produce on-brand, effective content for their audience.
Which AI tool performs best across the widest range of content types.
How much content AI can produce versus human writers in a given time period.
Which content topics perform best when produced with AI assistance.
===
You use AI to personalise outreach messages to 500 prospects. The highest-risk failure mode is:
Sending messages with formatting errors due to template variable failures.
Generating messages that are too long for the prospect's attention.
*Personalisation that is superficial and does not reference anything genuinely specific.
Using the same AI-generated template structure for all prospect segments.
===
A sales team wants to use AI to automatically send follow-up emails after demos. What is the most important safeguard?
*Human review of each follow-up email before it is sent.
Limiting AI follow-up to prospects who did not reply to the first outreach.
Using AI only for the subject line and writing the body manually.
Testing the AI follow-up on internal contacts first.
===
What is the most effective use of AI during the sales discovery phase?
Automatically populating CRM fields from the prospect's website and LinkedIn.
Predicting which prospects are most likely to convert based on their profile.
Writing the discovery call agenda without knowing the prospect's specific situation.
*Generating deep, tailored research questions based on prospect and industry context.
===
You use AI to create sales collateral for your product. What must you verify before sending it to prospects?
The collateral matches the visual design standards of your marketing team.
*Every feature claim, pricing figure, and competitive comparison is accurate.
The collateral does not mention capabilities still in development.
The content length is appropriate for the prospect's buying stage.
===
A sales rep uses AI to analyse a prospect's 10-K filing before a meeting. What is the highest-value output from this analysis?
A summary of the prospect's financial performance over the past 3 years.
A list of competitors the prospect has named in the filing.
*Identification of the prospect's stated strategic priorities and pain points.
A prediction of how receptive the prospect will be to your solution.
===
What is the most appropriate use of AI in pricing strategy for enterprise deals?
Automatically recommending the optimal price point based on deal data.
Setting price floors and ceilings without rep involvement.
Adjusting pricing in real time based on prospect behaviour signals.
*Generating pricing scenario models for the rep to evaluate and select from.
===
Your sales team uses AI to score leads and prioritise outreach. What is the most important ongoing governance requirement?
*Regular review of whether lead scores predict actual conversion outcomes.
Weekly updates to the AI model with new lead and conversion data.
Monthly disclosure to prospects that AI was used to score their enquiry.
Quarterly benchmarking of your AI lead scores against industry standards.
===
What is the most effective way to use AI to prepare for a complex enterprise sales negotiation?
Ask AI for the optimal negotiation strategy for this deal type.
*Generate likely counterarguments and concession scenarios to prepare responses.
Use AI to research the prospect's procurement team on LinkedIn.
Have AI analyse previous deals to predict the final contract value.
===
You want to use AI to improve the quality of your sales proposals. The most effective approach is:
Use AI to generate the proposal from your standard template and send as-is.
Use AI only for the executive summary and write the rest manually.
Have AI review your manually written proposal for quality and formatting.
*Provide AI with client context and ask it to draft, then revise with domain-specific insight.
===
What is the most important role of AI in sales forecasting?
Replacing sales manager judgment in pipeline reviews.
Producing the official forecast numbers for leadership reporting.
*Identifying patterns in pipeline data that signal forecast accuracy.
Automatically updating forecasts in real time based on deal activity.
===
A sales manager uses AI to analyse call recordings and score rep performance. What is the most important practice?
Use AI scores as the primary input to quarterly performance reviews.
*Review AI scoring with reps and use it to guide coaching conversations.
Automate coaching recommendations based on AI call analysis scores.
Share AI performance scores across the team to drive healthy competition.
===
What distinguishes an AI-native sales workflow from a traditional one with AI tools added?
*AI is designed into the process from the start, optimising each stage.
AI-native sales workflows eliminate manual data entry entirely.
AI-native workflows use AI for all customer communication automatically.
AI-native workflows are managed by AI without sales rep involvement.
===
You use AI to generate outreach for a cold email campaign. Response rates are low. What is the most likely root cause?
The emails are being detected as AI-generated and filtered by spam tools.
The subject lines are not optimised for open rate.
*The value proposition in the outreach is not relevant enough to the specific prospect.
The send volume is too high and triggering email platform limits.
===
What is the most valuable AI capability for a B2B sales team in a complex sale?
Automating all follow-up communications so reps can focus on calls.
Predicting deal outcomes with high accuracy from CRM data.
Replacing the SDR function with AI-driven outreach at scale.
*Rapidly synthesising research across many sources to prepare for each meeting.
===
What is the most important metric to track when evaluating AI's impact on a sales team?
Number of AI tool interactions per rep per week.
*Revenue per rep after AI adoption versus before AI adoption.
Time saved per week by using AI tools versus manual processes.
Rep satisfaction scores for the AI tools they use.
===
You use AI to analyse customer feedback from 3,000 product reviews. The most reliable insight AI can surface is:
*Recurring language patterns and themes across multiple reviews.
The exact reasons each specific customer is satisfied or dissatisfied.
Which customer segment is most likely to churn based on their reviews.
The statistical significance of each identified theme.
===
What is the most important limitation of AI-generated customer personas?
They cannot capture emotional or psychological customer motivations.
They are too detailed for practical use in marketing planning.
*They reflect general patterns, not your actual customer data.
They require constant updating as market conditions change.
===
You want to use AI to analyse customer churn. What is the most important first step?
Collect at least 12 months of customer data for the AI to analyse.
*Define precisely what constitutes "churn" in your business context.
Identify which AI tool performs best on subscription data analysis.
Set a baseline churn rate to measure AI-assisted reduction against.
===
An AI sentiment analysis tool says your brand sentiment is "73% positive." What does this actually tell you?
That 73% of your customers are satisfied with your brand.
That your brand is performing better than average for your industry.
That sentiment has improved if the previous measure was below 73%.
*That 73% of the analysed text was classified as positive by this specific AI model.
===
You use AI to segment customers for a retention campaign. The segments are statistically distinct but not actionable. The most likely cause is:
*The segmentation was built on data features, not on actionable behavioural differences.
The AI model produced more segments than the marketing team can execute.
The segments are too broadly defined to enable personalised messaging.
The AI lacked sufficient data to produce meaningful customer distinctions.
===
What is the most valuable outcome of AI-assisted Net Promoter Score analysis?
Predicting which detractors are most likely to churn in the next 90 days.
*Identifying specific themes in verbatim responses that drive promoters versus detractors.
Benchmarking your NPS against AI-sourced industry comparisons.
Generating recommended responses for each category of NPS feedback.
===
You use AI to build a voice of customer analysis. What human step must never be automated?
Tagging and categorising the raw customer feedback responses.
Generating a summary of the major themes from the analysis.
Creating visualisations of the frequency of different themes.
*Deciding what to do about the findings in the context of your strategy.
===
What is the most important consideration when using AI to analyse customer conversations for insights?
Whether the AI tool can handle the volume of conversation transcripts.
Whether the conversation data is structured enough for AI to analyse reliably.
*Data privacy and consent requirements for using these conversations in AI analysis.
Whether the AI insights will be shared with the product or sales team.
===
You are using AI to predict customer lifetime value. What is the most important assumption to validate?
Whether your customer base is large enough for the CLV model to be accurate.
*Whether the historical patterns the AI learned from still hold in the current market.
Whether the AI model was trained on data from a similar industry.
Whether the CLV predictions have been validated against a test set.
===
What is the most effective use of AI for customer journey mapping?
*Generating a comprehensive first-draft map for human expert validation.
Producing a final, accurate journey map from available customer data.
Replacing customer research by inferring journeys from purchase data.
Predicting which journey touchpoints have the highest conversion impact.
===
You use AI to analyse which customer segments respond best to your marketing. What is the most important caveat to your team?
AI segment analysis requires validation on at least 1,000 responses to be reliable.
Response rate differences may reflect message quality rather than segment characteristics.
*Correlation in response data does not prove which segment is most valuable to acquire.
AI segment analysis should be repeated quarterly to remain accurate.
===
What is the most responsible approach to AI-generated customer insight reports for clients?
Include a standard AI disclaimer and let the client decide how much to rely on the insights.
Present the insights as AI-generated to help clients calibrate their confidence.
Verify only the claims that are novel or counterintuitive before presenting.
*Disclose AI's role, verify all specific claims, and take professional responsibility for the findings.
===
An AI tool produces a customer segmentation that identifies a highly profitable segment your team had not previously recognised. What should you do?
Immediately redirect your marketing budget toward this newly identified segment.
*Investigate why this segment is profitable and validate it before redirecting investment.
Have the AI tool validate the finding using a separate data source.
Present the finding to leadership and let them decide whether to act on it.
===
What is the correct approach when AI customer analysis contradicts your team's existing beliefs about your customers?
Trust the AI analysis since it processed more data than the team's experience.
Trust the team's experience since AI lacks domain and relationship context.
*Investigate the contradiction — it may reveal a genuine customer insight or a data issue.
Run the analysis with a different AI tool to resolve the contradiction.
===
What is the most important skill a marketer needs to use AI for customer intelligence effectively?
*The ability to design the right analysis questions and critically evaluate the outputs.
Technical data analysis skills to interpret AI-generated statistical output.
Experience with the specific AI tools used for customer intelligence.
Ability to present AI findings compellingly to leadership.
===
You use AI to analyse your last quarter's campaign performance. What is the most important analytical principle to apply?
Ensure all metrics are pulled from a single source of truth before analysis.
Ask AI to identify the campaign that performed best by overall reach.
Compare campaign performance against AI-benchmarked industry standards.
*Distinguish what AI can observe in data from what caused the performance outcome.
===
A CMO asks for a "one number" summary of marketing performance this quarter. What should you communicate?
The overall marketing efficiency ratio calculated by dividing revenue by spend.
*Which single metric best reflects marketing's contribution to business outcomes.
The AI-generated composite marketing score across all tracked channels.
Whichever metric shows the strongest positive performance this quarter.
===
You use AI to analyse a campaign A/B test. The AI reports that Version B won. What else must you verify?
Whether the AI used the correct statistical test for the sample size.
Whether Version B also won on secondary metrics you care about.
*Statistical significance, sample size, and whether external factors confounded the result.
Whether the winning version matches your brand guidelines.
===
What is the most important limitation of AI-generated marketing attribution models?
*Attribution models assign credit based on patterns that may not reflect true causation.
AI attribution cannot track offline marketing channels in omnichannel campaigns.
Attribution models require complete data that most marketing stacks cannot provide.
AI attribution changes over time as model weights adjust, making it inconsistent.
===
You present AI-generated marketing performance reports in a monthly leadership review. Before presenting:
Ensure the report design meets the company's reporting template standards.
Have the AI review the report for internal consistency before sharing.
Check that the report covers all metrics leadership tracks each month.
*Verify every specific metric cited against the primary data source.
===
What is the most valuable AI capability for a performance marketing team?
Automating all bid management decisions across digital advertising platforms.
Generating all creative variants for multivariate testing automatically.
*Identifying patterns in large datasets that optimise spend allocation decisions.
Predicting exact ROAS for each campaign before launch.
===
A marketing analyst uses AI to produce a report showing strong ROI across all campaigns. The most important question to ask is:
*"How is ROI defined and what is included or excluded in the calculation?"
"Which campaigns had the highest ROI and what made them different?"
"How does this ROI compare to our historical performance?"
"Is the ROI definition consistent with how we report to leadership?"
===
You use AI to identify which content types drive the most website conversion. The finding shows video content is 3x more effective. What is the next analytical step?
Immediately shift 3x more budget to video content production.
*Investigate whether this reflects causal impact or correlated user intent.
Ask AI to predict what video content will perform best next quarter.
Share the finding with the creative team as a production priority directive.
===
What is the most effective use of AI in marketing budget optimisation?
Automatically reallocating budget in real time based on performance signals.
Generating the optimal budget plan that maximises projected ROAS.
*Modelling multiple budget scenarios to inform human allocation decisions.
Replacing the manual budget planning process for efficiency.
===
A marketing team uses AI to report that their campaign reached 5 million "impressions." What is the most important caveat?
AI impression tracking may double-count views across different platforms.
Impressions are a leading indicator of awareness but not a business outcome.
Impression data accuracy varies significantly by platform and measurement method.
*Impressions measure ad delivery, not attention, recognition, or impact.
===
What is the highest-quality AI contribution to measuring brand awareness?
*Identifying shifts in brand-related language and sentiment patterns over time.
Generating a brand awareness score from social media engagement data.
Predicting brand awareness levels from media spend and reach metrics.
Automatically producing brand equity dashboards from digital listening data.
===
You use AI to analyse why a campaign underperformed. What type of answer should you be most sceptical of?
An answer that identifies multiple contributing factors to the underperformance.
*A confident causal explanation that assigns the failure to a single factor.
An answer that highlights data quality issues that affected the analysis.
An answer that recommends further investigation before drawing conclusions.
===
What is the most important analytical habit for a marketer using AI for performance analysis?
Running all AI analyses twice to confirm consistency of outputs.
Limiting AI analysis to datasets where the marketer has domain expertise.
Using the same AI tool consistently to build a reliable performance baseline.
*Always asking "could this pattern reflect something other than what AI is suggesting?"
===
A digital marketing manager receives an AI-generated report showing CTR improved by 200% after a creative change. Before presenting to leadership:
*Verify the CTR calculation, the comparison period, and whether the change was isolated.
Celebrate — a 200% CTR improvement is exceptional by any standard.
Ask AI to validate the finding using a different analytical approach.
Check whether the 200% improvement is consistent across all platforms.
===
What is the most honest statement about AI's ability to predict marketing campaign outcomes?
AI prediction is highly accurate for digital channels with rich historical data.
AI cannot predict campaign outcomes due to the inherent creativity involved.
*AI can identify patterns from historical data but cannot guarantee future performance.
AI prediction accuracy increases linearly with the size of the training dataset.
===
A prospect tells your sales team they are also evaluating a competitor with a specific feature you do not have. AI suggests positioning around that gap. What is the most important question to ask first?
*Is the prospect's need for this feature genuinely critical to their use case?
Can your product team build this feature before the deal closes?
How does your competitor price this feature in their packaging?
Does AI have accurate information about the competitor's feature?
===
Your marketing team proposes using AI to automatically generate and post social content 10x per day. What is the most important risk to address?
Your social media manager will not have time to monitor 10x daily posts.
The AI may generate content that is off-brand or offensive without review.
High post frequency may trigger algorithm penalties on social platforms.
*Volume without quality or relevance will damage brand trust faster than it builds awareness.
===
A sales rep closes a large deal that the AI CRM system had predicted as low-probability. What should this inform?
A recognition that AI deal prediction is unreliable for large deals.
*A review of what the AI model missed in evaluating this deal type.
A reason to trust sales rep intuition over AI scoring in future deals.
A trigger to retrain the AI model immediately on the updated deal data.
===
You are about to launch an AI-generated marketing campaign to a major client. The client notices that the creative feels generic. What is the correct response?
"This reflects the current high standard of AI-generated creative."
"We can A/B test this creative against a human-developed version."
*Acknowledge it, revise with client-specific insight, and resubmit.
"Generic creative actually performs better in conversion rate testing."
===
A new CMO wants to use AI to reduce the marketing team from 15 to 5 people. What must be evaluated first?
*Which specific marketing capabilities AI can reliably perform at professional quality.
What the cost savings are across 10 fewer marketing team members.
Whether competitors have reduced their marketing teams with AI.
Whether the remaining 5 team members are trained on AI tools.
===
A prospect asks you in a sales call if your AI-powered product guarantees certain outcomes. What is the most professional response?
"Yes, our AI consistently achieves those outcomes for customers like you."
"No product can guarantee outcomes — but our AI gives you the best probability."
*Explain what the product typically achieves with examples, and what factors affect outcomes.
"Our AI has a 92% accuracy rate on similar customer use cases."
===
Your AI campaign optimisation tool recommends stopping a campaign that your team believes is building important brand equity. What do you do?
Follow the AI recommendation — campaign optimisation AI is more accurate than intuition.
Ignore the AI recommendation — brand equity is a qualitative judgment AI cannot assess.
Split the campaign budget: follow AI for conversion campaigns, override for brand.
*Evaluate whether the AI is measuring brand equity or only short-term conversion signals.
===
A sales team member forwards an AI-generated prospect analysis with a specific revenue figure for the prospect's company. Before using it in a pitch:
Use it if it seems consistent with the prospect's scale and industry.
*Verify the revenue figure from a primary source such as annual report or credible database.
Ask the AI to confirm the figure with a secondary check.
Include the figure with a note that it came from AI analysis.
===
You want to use AI to draft a competitive battle card for your sales team. What is the first step?
Ask Claude to produce the battle card from its training knowledge.
Identify which sales scenarios the battle card needs to address.
*Gather current, verified information about the competitor from primary sources.
Provide Claude with your product's differentiators and positioning.
===
What is the most important difference between marketing teams that use AI effectively and those that do not?
*Effective teams direct AI with strategic context; ineffective teams accept generic outputs.
Effective teams use more AI tools across more marketing functions.
Effective teams have dedicated AI specialists who manage all AI work.
Effective teams measure AI productivity and report it to leadership.
===
A client's marketing performance data shows declining results. AI suggests the creative is the problem. What is the most rigorous next step?
Replace the creative immediately based on the AI diagnosis.
*Test the hypothesis by isolating creative while holding other variables constant.
Run all campaign elements through AI analysis to identify all contributing factors.
Discuss the AI finding with the creative team and ask their opinion.
===
What is the most important principle for using AI to generate sales scripts?
Scripts should be tested on internal contacts before deployment in live calls.
Scripts must be reviewed by the sales manager before rep use.
Scripts should include AI-suggested responses to common objections.
*Scripts must be adaptable — they are a starting structure, not a word-for-word formula.
===
Your AI content generation tool is producing output that your marketing team describes as "perfectly fine but forgettable." What should you do?
Switch to a more capable AI content generation model.
Have your creative director edit all AI outputs for distinctiveness.
*Inject more specific customer language, insight, and brand opinion into your prompts.
Accept that AI content reaches a quality ceiling that requires human intervention.
===
What is the most important governance requirement for AI in B2C marketing at scale?
Regular AI accuracy testing across all marketing content categories.
*Clear criteria for what AI marketing outputs require human review before deployment.
Employee training on which AI tools are approved for marketing use.
A central repository of all AI-generated marketing materials for audit.
===
Menler's AI for Marketing & Sales bank tests professionals at which level of AI capability?
Building marketing automation systems using Claude's API.
Evaluating and selecting the best AI tools for marketing functions.
Teaching AI marketing skills to junior team members and clients.
*Applying AI judgment to real marketing and sales decisions with professional accountability.
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

export const MARKETING_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getMarketingSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
