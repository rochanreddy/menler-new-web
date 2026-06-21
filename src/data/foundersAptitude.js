// AI for Founder's Office question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getFoundersSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You are entering a new market. What is the most effective way to use Claude for competitive intelligence?
Ask Claude to tell you everything about your competitors.
Define specific intelligence questions first, then use Claude to research and structure findings against those questions.
Ask Claude to predict which competitor will be the biggest threat.
Use Claude to copy your competitor's strategy and adapt it.
===
Claude gives you a confident market size figure for your investor deck. What should you do first?
Include it — Claude cited a source so it must be accurate.
Trace the cited source directly and verify its methodology, recency, and applicability to your market definition.
Round the number and include it with an estimate caveat.
Ask Claude the same question again to confirm consistency.
===
Which approach produces the most actionable whitespace analysis from Claude?
Ask Claude to list all opportunities in your industry.
Brief Claude on your specific capabilities, customer problems you hear repeatedly, and constraints of existing solutions — then ask it to identify gaps you can realistically address.
Ask Claude to analyse your industry and tell you what to build.
Use Claude to summarise recent startup funding news in your sector.
===
You want Claude to help map the regulatory landscape before entering a new sector. What is the most responsible approach?
Trust Claude's regulatory summary as current and complete.
Use Claude to build an initial map of key bodies, acts, and requirements — then verify current status with a qualified consultant before any compliance decisions.
Only proceed if Claude gives a clear go recommendation.
Regulations are too complex for AI — avoid using Claude here.
===
Which use of Claude is most valuable when building a go-to-market strategy?
Ask Claude to write your GTM strategy from scratch.
Share your hypothesis on ICP, channels, and positioning — then ask Claude to challenge assumptions, identify gaps, and stress-test the logic.
Ask Claude to predict which GTM strategy will succeed.
Use Claude to copy the GTM strategy of your most successful competitor.
===
Your co-founder wants AI to build the product roadmap from customer interview notes. What is the right role for AI?
Let AI build the roadmap — it can process notes faster and more objectively.
Use AI to surface patterns in the notes, then apply founder judgment to interpret what those patterns mean for your product vision and execution capacity.
AI analysis of customer interviews is not reliable enough for product decisions.
Only use AI for note-taking — all analysis should be manual.
===
What information should you provide Claude when evaluating whether to pivot your product?
Just describe the pivot idea and ask if it is a good idea.
Provide current metrics, the problem the pivot addresses, evidence the new direction is better, what you would give up, and ask Claude to help structure the decision framework.
Ask Claude to analyse competitor pivots and recommend a direction.
Describe the pivot and ask Claude to estimate the probability of success.
===
What is the most important limitation to understand when using AI for strategic planning?
AI cannot process large amounts of strategic information.
AI does not know your specific market dynamics, team's execution capability, or competitive moats — it works from general patterns, not your specific context.
AI strategic advice is only useful for early-stage startups.
AI cannot help with strategy because strategy requires creativity.
===
How should you use Claude when preparing for a fundraising round?
Ask Claude to write your pitch deck and investor emails.
Use Claude to research investor thesis, stress-test your pitch narrative, and draft communications — then refine with your specific voice and relationship context.
Ask Claude to predict which investors will fund you.
Use Claude to copy a successful startup's pitch deck structure.
===
What is the most effective prompt approach for developing your startup's positioning statement?
Ask Claude to write a positioning statement for your startup.
Share your ICP, the specific problem you solve, how you differ from alternatives, and what customers say — then iterate with Claude until the language resonates.
Ask Claude to analyse 10 competitor positioning statements and combine them.
Positioning statements should never be developed with AI.
===
A co-founder challenges the strategic memo you built with Claude. What is the most productive next step?
Ask Claude to defend its original reasoning.
Ask Claude to write the strongest possible counter-argument to the memo — then use both to have a richer strategic discussion.
Discard the Claude memo and restart without AI input.
Ask Claude to judge which argument is stronger.
===
What is the biggest risk of using AI to generate your startup's strategy without sufficient founder input?
The strategy will not be innovative enough.
AI generates strategy from general patterns — your actual advantage comes from specific insights and market knowledge that AI does not have.
AI strategies are too complex to execute.
The risk is primarily reputational if people discover AI was used.
===
How should you calibrate reliance on AI-generated market intelligence in a fast-moving sector?
AI market intelligence is always up-to-date and reliable.
AI provides a useful baseline but has a knowledge cutoff — supplement with current sources, customer conversations, and industry contacts.
AI market intelligence is only useful for stable, well-documented markets.
Rely on AI completely — primary research is too slow.
===
What makes second-order thinking particularly valuable in AI-assisted strategic analysis?
It means asking AI to think twice before responding.
First-order thinking asks "what will happen?" — second-order asks "then what?" AI can rapidly map downstream consequences and unintended implications of strategic choices.
It is a prompt engineering technique that improves AI output quality.
It is only relevant for late-stage startup strategy.
===
What is the most important habit for a founder using AI for strategic work?
Using AI for every strategic decision to ensure consistency.
Bring your deepest market knowledge into every AI interaction — and always verify strategic conclusions against what you know from being in the market.
Use AI only for tactical implementation, not strategic decisions.
Keep all AI use confidential so investors do not question your thinking.
===
As a solo founder, what is the highest-leverage way to use AI?
Use AI for all tasks equally to save time across the board.
Identify the three tasks that take most time but require least founder judgment — typically communication drafts, research synthesis, and document structuring — and build AI workflows for those first.
Use AI primarily for tasks you enjoy least.
Delegate all operational tasks to AI before hiring your first employee.
===
What is the most efficient AI-assisted workflow for monthly investor update emails?
Ask Claude to write the investor update without input each month.
Create a Claude Project with your template, metric definitions, and tone guidelines — each month paste in current metrics, and Claude drafts the update in your voice for review.
Have Claude automatically send investor updates without your review.
Write investor updates manually — they are too important for AI.
===
You need to write a sensitive message to your team about a key departure. What is the most effective approach?
Ask Claude to write the message and send it without editing.
Draft the message yourself first, then use Claude to refine the language and ensure nothing inadvertently lands poorly.
Ask Claude to write several versions and choose the best.
Avoid using AI for sensitive internal communications.
===
How should you use Claude to prepare for a difficult conversation with a co-founder about performance?
Ask Claude to write a script for the conversation.
Use Claude to clarify your key points, anticipate likely responses, and identify where you might react emotionally — then have the conversation yourself.
Send Claude's output directly to the co-founder instead of meeting.
Difficult co-founder conversations should never involve AI preparation.
===
What is the most efficient approach for building your company's first employee handbook?
Ask Claude to write a complete handbook from scratch.
Brief Claude on your values, culture, size, and Indian labour law context — Claude generates a structured draft — then review with an HR or legal professional for compliance.
Use a competitor's handbook and ask Claude to rewrite it.
Employee handbooks require a dedicated HR professional — AI cannot help.
===
Which AI-assisted workflow produces the best board meeting preparation?
Ask Claude to write the board deck from your raw data.
Use Claude to structure the narrative, draft deck sections, and prepare responses to likely board questions — bringing your specific board dynamics and relationship context to each stage.
Board meetings are too sensitive for AI involvement.
Send Claude the board deck and ask it to identify weaknesses.
===
How should Claude be used when responding to a public customer complaint on social media?
Ask Claude to write and post the response directly.
Use Claude to draft a response that addresses the complaint and maintains brand voice — then review for accuracy and authenticity before posting yourself.
Public complaints should never receive AI-assisted responses.
Ask Claude to write five versions and post the highest-rated one.
===
What is the right design for an AI-assisted workflow for inbound partnership enquiries?
Automate all responses without human review to handle volume.
Use Claude to draft initial responses by enquiry type, with a human review step before sending.
Partnership enquiries are too important for any AI involvement.
Use Claude to score enquiries, then respond manually to the top ones.
===
What is the most effective use of Claude for hiring and recruiting as a founder?
Ask Claude to screen CVs and make hiring recommendations.
Use Claude to draft job descriptions, write outreach messages, structure interview questions, and draft offer letters — with human judgment applied to all actual hiring decisions.
AI should not be involved in any stage of hiring.
Ask Claude to compare candidates and recommend who to hire.
===
How does AI help most when documenting company processes before they exist only in founders' heads?
Ask Claude to infer your processes from your product documentation.
Walk Claude through how you currently do each process in detail, ask Claude to structure it as a written SOP — then review and correct against how you actually work.
Process documentation should be done manually to ensure accuracy.
Ask Claude to design optimal processes based on industry best practices.
===
What is the most important consideration when using Claude for founder email and communications volume?
Speed — Claude should help you respond to everything as fast as possible.
Authenticity and accuracy — AI-drafted communications sent without sufficient review can damage relationships or create unintended commitments.
Cost — email responses should use the free AI tier to manage expenses.
Volume — the more emails Claude helps process, the better.
===
You are deciding whether to raise a bridge round or cut costs to extend runway. What is Claude most useful for?
Making the decision — Claude has processed thousands of similar scenarios.
Structuring the decision framework — mapping all relevant variables, scenarios, and assumptions so you articulate what you are actually optimising for.
Predicting the outcome of each option with probability scores.
Telling you what other founders in similar situations have done.
===
An investor notices your communications have become more polished but less personal. What should you adjust?
Increase the instruction detail in your prompts to improve quality.
Inject more of your specific voice, relationship context, and personal references into your prompts — and spend more time on the editing that makes Claude's draft sound like you.
Stop using AI for external communications entirely.
Ask Claude to write in a more casual tone to compensate.
===
What is the most effective way to use Claude to build your personal brand as a founder?
Ask Claude to write all your social media content and publish it automatically.
Use Claude to develop content frameworks and draft posts based on your actual insights — with your genuine perspective as the source material, refined through Claude.
Personal brand content should never use AI — authenticity requires manual writing.
Ask Claude to copy the content style of successful founders you admire.
===
What is the single most important operational discipline for a founder using AI extensively?
Using as many AI tools as possible to cover all bases.
A regular review cadence — periodically checking whether AI-assisted outputs still meet your quality standard and whether any AI habits are degrading rather than improving your work.
Keeping all AI use documented for potential regulatory or investor review.
Limiting AI use to avoid over-dependence on any single tool.
===
What is the most effective role for Claude when building a Series A pitch deck?
Have Claude build the complete deck from your one-line description.
Use Claude to stress-test your narrative logic, draft slide content from your detailed briefing, and anticipate investor questions — while you drive the strategy and specific claims.
Use Claude only for design layout recommendations.
Pitch decks are too important for AI — write them entirely manually.
===
What information must you provide Claude to write a compelling problem slide?
The industry you are in and the market size.
Specific evidence of the problem — customer quotes, data points, examples of the status quo failing.
The solution you have built, working backwards from it.
The names of investors who have validated the problem.
===
An investor asks a specific question about methodology in your AI-assisted pitch deck and you cannot answer it. What does this reveal?
The investor has asked an unfair question.
AI-generated content you cannot defend creates credibility risk — every claim in a pitch must come from your own understanding, even if Claude helped articulate it.
You need a technical co-founder who can answer methodology questions.
This is normal — investors understand founders use AI for pitch preparation.
===
What is the most effective way to develop your founder story using Claude?
Ask Claude to write a founder story based on your CV.
Share the actual experiences and insights that led you to this problem — then use Claude to structure and sharpen the narrative into a compelling, authentic story.
Ask Claude to write a founder story like a successful founder in your space.
Founder stories should always be written entirely manually.
===
What is the most effective way to test your pitch narrative before meeting investors?
Ask Claude to rate your pitch out of 10.
Ask Claude to play a sceptical Series A investor and raise the hardest objections to each section of your pitch — then prepare substantive responses.
Ask Claude to confirm that your pitch is compelling.
Use Claude to compare your pitch to successful pitch decks.
===
What makes Claude most useful for writing a one-page executive summary for a strategic partner?
Ask Claude to summarise your pitch deck into one page.
Brief Claude on the specific partner, their strategic priorities, what you want from the partnership, and what value you offer them — then ask Claude to draft a summary framed around their perspective.
Executive summaries should be written manually for important relationships.
Ask Claude to write a general summary that works for all audiences.
===
What is the most common mistake founders make when using AI to help write their investor pitch?
Using AI makes the pitch too long.
Accepting AI-generated market size claims or competitive analyses without verifying them — creating a polished pitch that falls apart under due diligence.
AI-assisted pitches are always too formal.
Investors can tell when AI was used and react negatively.
===
What prompt produces the most effective website homepage copy from Claude?
Ask Claude to write a homepage for a startup in your industry.
Share your ICP, the specific job they are trying to do, how your solution differs, three customer proof points, and your desired tone — then iterate until it reflects your actual differentiation.
Use Claude to copy the structure of a competitor's homepage and rewrite it.
Websites should always be written by professional copywriters, not AI.
===
Which prompt produces the most effective cold email to an enterprise prospect?
"Write a cold email to a potential customer."
"Write a cold email to the VP of Operations at a mid-size Indian manufacturing company. Our product reduces procurement cycle time by 40%. Open with a specific insight about their procurement challenges, close with a low-commitment next step. Under 150 words."
"Write a sales email that is compelling and professional."
"Write an email like the ones successful SaaS companies send."
===
What is the most effective approach for preparing media and PR communications with Claude?
Ask Claude to write press releases without input.
Brief Claude on the news, why it is significant, which publication you are targeting, and what the ideal reader action is — then refine the draft against your actual news and voice.
PR communications should never use AI assistance.
Ask Claude to write in the style of a famous tech journalist.
===
How does Claude best help a founder explain a complex technical product to non-technical investors?
Ask Claude to simplify your technical explanation.
Share your technical explanation and ask Claude to generate multiple plain-language analogies at different simplicity levels — then test which one lands best with your target audience.
Non-technical investors are not the right investors for a technical product.
Ask Claude to write the technical explanation in simple words.
===
What makes an AI-assisted pitch narrative genuinely compelling versus just well-structured?
Using more specific data points.
Genuine insight that AI cannot generate — the specific, non-obvious market observation from being deeply in it — combined with AI's ability to structure and articulate it clearly.
More slides with better visuals.
A longer narrative that covers every possible investor question.
===
How do you use Claude to process conflicting feedback on your pitch deck from two advisors?
Ask Claude to decide which advisor is right.
Share both pieces of feedback and ask Claude to identify where advisors address different aspects versus where they genuinely conflict — then identify what questions to ask to clarify the disagreement.
Use Claude to average the two pieces of feedback.
Disregard the conflicting feedback and keep the original version.
===
What is the most important principle for maintaining authenticity in AI-assisted founder communication?
Only use AI for first drafts that you rewrite completely.
The specific insight, genuine conviction, and authentic experience must come from the founder — Claude structures and articulates, but the substance that makes communication credible must be real.
Use AI only for written communication, not spoken presentations.
Disclose AI assistance in all founder communications.
===
High engagement but low serious investor inbound after three months of AI-assisted founder content. What might explain this?
Three months is not long enough to see results.
The content may be optimised for engagement metrics rather than demonstrating the specific market expertise that attracts serious investors.
Serious investors and customers do not use social media.
You need to post more frequently to reach serious investors.
===
You have three competing priorities and limited resources. How does Claude help most with prioritisation?
Ask Claude to rank the priorities.
Share your metrics, what you are optimising for, your constraints, and evidence behind each priority — and ask Claude to build a decision framework that surfaces the key tradeoffs.
Ask Claude to predict which priority will generate the highest return.
Have Claude analyse competitors to determine what to focus on.
===
What is the most important thing to understand about AI's role in founder decisions under uncertainty?
AI reduces uncertainty by providing more information.
AI can help structure the decision and map scenarios — but it cannot resolve the fundamental uncertainty about the future that makes entrepreneurial decisions genuinely difficult.
AI is most useful when uncertainty is highest.
AI should replace gut instinct in high-stakes decisions.
===
A potential enterprise contract would represent 60% of your revenue. How does Claude help you think through the risk?
Ask Claude if you should take the contract.
Ask Claude to structure the concentration risk analysis — what happens if this customer churns, how long to replace their revenue, what obligations tie you to their roadmap.
Ask Claude to calculate the expected value of the contract.
Use Claude to draft the contract terms that protect you from concentration risk.
===
How should you approach using Claude to help assess a senior team member who is not meeting expectations?
Ask Claude to make the decision based on the performance data you provide.
Use Claude to structure your assessment — clarifying specific gaps, support provided, team impact, and what a fair process looks like — while keeping the decision and accountability yours.
Share all team member details with Claude for a comprehensive assessment.
People decisions are too sensitive for any AI involvement.
===
A trusted advisor recommends a direction that conflicts with your instinct. How does Claude help you process this?
Ask Claude to tell you who is right.
Ask Claude to steelman the advisor's position and your own instinct — then identify where the genuine disagreement lies and investigate who has better information on that specific point.
Ask Claude to analyse the track record of both parties.
Trust your instinct over the advisor since you know your business best.
===
What is the most effective AI workflow for a weekly founder review of company performance?
Ask Claude to review your metrics and tell you what to focus on.
Define a standard set of questions in advance, paste in the relevant metrics and context, and use Claude to structure your analysis against those questions consistently.
Use Claude to generate a weekly report automatically without founder review.
Weekly reviews are too important for AI involvement.
===
You are evaluating a potential acquisition target. Where does Claude help most?
Ask Claude to value the company based on publicly available information.
Use Claude to build the due diligence framework — what questions to investigate, what risks to probe, what synergies to validate — while valuation and final decision involve professional advisors.
Ask Claude to recommend whether to proceed.
Use Claude to draft the term sheet for the acquisition.
===
What is decision fatigue and how can AI help founders manage it?
The exhaustion that comes from reading too many AI-generated reports.
The cognitive depletion from making many decisions that reduces quality of subsequent ones — AI helps by handling routine decisions and information processing, preserving capacity for high-judgment decisions.
Decision fatigue is a myth — good founders make excellent decisions all day.
AI increases decision fatigue by providing too many options.
===
You are facing an ethical dilemma — a customer asking you to use your platform in a way that is legal but feels wrong. How does Claude help?
Ask Claude to tell you what the ethical decision is.
Use Claude to articulate the competing values, map consequences of each course of action, and surface considerations you may not have thought of — making your own ethical reasoning more rigorous.
Ethical decisions should never involve AI.
Ask Claude to find examples of how other companies handled similar situations.
===
What is the most dangerous pattern in founder AI use for decision-making?
Using AI too infrequently for major decisions.
Treating AI as an oracle rather than a thinking partner — accepting AI output as the basis for major decisions without applying founder market knowledge and context.
Using AI for too many minor decisions.
Relying on AI for financial projections.
===
You have made a major strategic error. How does AI help you process what went wrong?
Ask Claude to diagnose why your strategy failed.
Use Claude to structure a post-mortem — identifying what assumptions were wrong, what signals were available but missed, and what the genuine learning is.
Use Claude to design a new strategy immediately.
Claude cannot help with mistakes — only with future planning.
===
How does AI most effectively help founders manage burnout risk?
Ask Claude to tell you when you are approaching burnout.
Use Claude to manage time-consuming but clearly defined tasks efficiently — freeing founder capacity for high-energy work and relationships.
AI cannot help with founder wellbeing — seek human support.
Use Claude to create a detailed daily schedule that optimises energy.
===
You are deciding between two product directions with genuinely uncertain outcomes. What is Claude's most valuable contribution?
Predicting which direction is more likely to succeed.
Helping you identify what information would most reduce your uncertainty — what to learn, who to talk to, what small experiments to run.
Analysing competitor moves to identify the safer direction.
Writing product specs for both directions to evaluate side by side.
===
A board member disagrees with your strategic direction. How do you prepare for this conversation using Claude?
Ask Claude to write arguments that will convince the board member.
Use Claude to steelman the board member's concern as strongly as possible — then prepare to either address the risk or explain why you have weighed it differently.
Ask Claude to help you explain why the board member is wrong.
Use Claude to analyse the board member's investment track record.
===
What is the most important founder mindset for using AI in decision-making?
Defer to AI analysis for all decisions where data is available.
Treat AI as a tool that improves the quality of your thinking — making analysis more structured and blind spots more visible — while maintaining that founder judgment and accountability are irreplaceable.
Use AI only for decisions where the stakes are low enough to risk being wrong.
Be sceptical of AI in all decision contexts — human judgment is always superior.
===
You are building an AI-powered product. What is the most important consideration before launch?
Whether the AI model you choose has the highest benchmark scores.
Whether you have designed for AI failure — what happens when the AI produces a wrong or confusing output, and whether your product handles that gracefully.
Whether your AI model is the most cost-efficient option.
Whether your competitors have already used AI in similar features.
===
What is the most important data privacy consideration for a founder using AI tools operationally?
Only use AI tools that are free to avoid legal complications.
Understand which data — customer information, financial data, employee details — should not be processed by consumer AI tools under your obligations and applicable data protection law.
Get written consent from all customers before using any AI tools.
AI tools are exempt from data privacy obligations since they are software.
===
You use Claude to draft legal agreements. What is the most important professional caution?
Claude cannot help with any legal documents.
Claude can draft document structures as a starting point, but all legal agreements must be reviewed by a qualified lawyer — AI legal drafts are not legal advice.
Claude legal drafts are as reliable as lawyer-drafted documents for straightforward agreements.
Only use Claude for internal agreements — external ones require professional drafting.
===
What does responsible AI mean specifically for a founder building with AI?
Only using AI tools from companies that have signed ethical AI pledges.
Designing AI-powered products that are transparent about AI involvement, handle failures gracefully, do not produce discriminatory outcomes, protect user data, and maintain human accountability for consequential decisions.
Avoiding any AI applications that could potentially be misused.
Using open-source AI models instead of commercial ones.
===
You have built competitive advantage through proprietary AI workflows. What is the most important risk to manage?
Competitors copying your AI workflows.
Key person dependency — if your AI workflows exist primarily in one person's knowledge rather than documented systems, they are liabilities rather than assets.
AI tools becoming too expensive as you scale.
Your AI tools becoming obsolete as technology evolves.
===
What is the most important thing founders should understand about how Claude and other AI models are trained?
AI models are trained by reading all publicly available internet content in real time.
AI models are trained on large datasets with a specific cutoff date — they reflect the knowledge, biases, and patterns of their training data and do not know about developments after that cutoff.
AI models are programmed with specific knowledge by their developers.
AI models learn from each conversation they have with users.
===
You are using AI to automate customer communications at scale. What governance question is most important?
Which AI tool is most cost-efficient at scale.
At what point and under what conditions will a human review automated communications before they are sent — and who is accountable when something goes wrong.
Whether the AI tool can perfectly match your brand voice.
Whether customers will be able to tell communications are AI-generated.
===
What is the most significant risk of AI-generated content in a regulated industry like fintech or healthtech?
AI content is always lower quality than human-written content.
AI-generated content may contain claims or advice that violates regulatory standards — creating compliance and liability exposure the founder is accountable for regardless of whether AI generated it.
Regulators in India do not allow AI-generated content in regulated industries.
AI content is only risky if the company is large enough to attract regulatory attention.
===
As a founder, what is your responsibility when AI you use or build causes harm to a customer?
The AI tool manufacturer is primarily responsible for harm caused by their model.
The founder and company are responsible — the choice to use AI, the product design decisions, the absence of adequate safeguards, and the failure to detect and correct issues are all founder responsibilities.
Responsibility depends on whether the harm was foreseeable.
Responsibility is shared equally between the founder and the AI tool manufacturer.
===
What is the most honest framing of what AI can and cannot do for a startup in its early stages?
AI can handle most startup operations, allowing founders to focus entirely on fundraising.
AI dramatically accelerates clearly defined text-based tasks — giving early-stage founders significant leverage — while judgment, relationships, and market insight remain irreplaceably human.
AI is only useful for startups that have reached product-market fit.
AI capability for startups is still too immature to rely on for core operations.
===
You have built a product that uses AI to make recommendations to users. What is the single most important transparency design decision?
Whether to tell users the recommendation engine uses AI.
Being clear about what the AI recommendation is based on, what it cannot consider, and what a human review or alternative option looks like — so users make genuinely informed decisions about how much to rely on it.
Transparency is a legal requirement, not a design decision.
Only disclose AI involvement if a user specifically asks.
===
What capability most distinguishes good AI use from problematic AI use for founders?
Technical understanding of how AI models work.
Critical evaluation — reviewing AI outputs with the same professional rigor you would apply to any important business decision, catching errors and questioning assumptions.
Access to the most advanced AI tools available.
Speed — the ability to use AI tools faster than competitors.
===
What does it mean for a startup to be AI-native rather than just AI-enabled?
Being AI-native means the startup's product is built entirely using AI.
AI is embedded as a core assumption in how the startup operates — workflows, communication, research, and decisions are all designed with AI participation from the start, not added to existing manual processes.
AI-native startups only use their own proprietary AI models.
Being AI-native means having more AI capabilities than competitors.
===
When is it appropriate for a founder to disclose AI involvement to investors, customers, or partners?
Never — AI use is competitive information to keep confidential.
When AI involvement is material to the quality or accuracy of what you are providing — and when the other party would reasonably want to know to make informed decisions about relying on your work.
Always — complete transparency about AI use is mandatory.
Only when specifically asked about AI use.
===
What is the most important long-term competitive advantage a founder can build using AI?
Building proprietary AI models that competitors cannot access.
Developing organisational AI fluency — a company culture where every team member uses AI effectively, workflows are systematised and documented, and AI capability compounds over time.
Being the first in your market to use a specific AI tool.
Investing in the most expensive enterprise AI tools before competitors do.
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

export const FOUNDERS_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getFoundersSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
