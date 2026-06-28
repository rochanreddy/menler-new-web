// AI for HR — AI Aptitude question bank: 75 questions (5 sets × 15).
// Sets: Talent Acquisition · Learning & Development · People Analytics &
// Workforce Planning · HR Compliance & Ethics · HR Judgment Scenarios.
//
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getHrSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You use AI to screen 500 CVs for a marketing role. The most important safeguard is:
Using the most advanced AI model available to maximise screening accuracy.
*Human review of AI-shortlisted and AI-rejected candidates before decisions are finalised.
Ensuring the AI has access to all job requirements before screening.
Running the screening twice to confirm consistent AI shortlisting.
===
What is the most significant bias risk when using AI to screen CVs?
AI cannot evaluate soft skills or cultural fit from CV text.
AI may favour CVs with better formatting over weaker content.
AI may incorrectly parse CVs from non-standard formats.
*AI may replicate historical hiring patterns that excluded certain groups.
===
You use Claude to draft a job description. The most important edit before publishing is:
*Removing language that may discourage qualified candidates from applying.
Ensuring the JD uses current industry-standard terminology.
Checking that the JD matches your internal HR template format.
Adding specific compensation ranges to attract quality candidates.
===
A candidate asks "was AI used to evaluate my application?" What is the most appropriate response?
Decline to disclose internal screening methodology.
Explain that AI was used only for initial sorting, not evaluation.
*Be transparent about AI's role in the screening process.
Tell them AI was not involved if it was only used for CV parsing.
===
Which AI application in talent acquisition adds the most value with the least risk?
Making the final hiring recommendation after all interviews.
*Drafting structured interview questions from a job description.
Predicting which candidates will perform best in the role.
Scoring video interview responses for communication quality.
===
You are building an AI-assisted hiring workflow. What does "human in the loop" specifically require?
*A human reviews and approves AI recommendations at every decision point.
A human wrote the initial job description the AI worked from.
A human can override AI decisions if they disagree after the fact.
A human monitors AI screening performance through a dashboard.
===
What is the most important limitation to communicate to hiring managers who want to use AI for final candidate selection?
AI recommendations are statistical averages and may not apply to this specific role.
AI selection models require a minimum of 1,000 historical data points to be reliable.
AI selection tools have not been validated for the Indian hiring market.
*AI cannot account for the contextual and interpersonal factors that predict job success.
===
A hiring manager says "the AI scored this candidate low so we should pass." The most important challenge to this reasoning is:
The AI may not have received the candidate's full application materials.
AI scores should be one input among many, not the sole decision factor.
*The AI score reflects pattern matching, not human judgment about fit and potential.
AI scoring systems are only valid when candidates consent to being scored.
===
You use AI to generate a job offer letter template. What is non-negotiable before using it?
*Legal review to ensure it complies with applicable employment law.
Checking that it matches your company's visual identity guidelines.
Having the hiring manager personalise it for the specific candidate.
Confirming it includes all standard clauses for your industry.
===
What is the most accurate statement about AI and "culture fit" assessment in hiring?
AI is more objective than humans at assessing culture fit.
AI culture fit assessment is reliable when trained on existing team data.
Culture fit AI works best when combined with personality assessment tools.
*AI cannot reliably assess culture fit and risks encoding cultural homogeneity.
===
You want to reduce time-to-hire using AI. The most appropriate first step is:
Implement AI screening for all roles immediately to test time savings.
*Identify which specific steps in your hiring process are the bottlenecks.
Survey hiring managers about which parts of the process they find most time-consuming.
Benchmark your current time-to-hire against industry averages using AI research.
===
A recruiter uses AI to write personalised candidate outreach at scale. The highest risk to manage is:
Candidates replying faster than the recruiter can handle the responses.
AI outreach that is stylistically inconsistent across different messages.
*Outreach that feels personalised but lacks genuine specificity for each candidate.
Sending outreach to candidates who have opted out of recruiting contact.
===
Which interview practice is most improved by AI assistance?
Evaluating candidate responses during the interview itself.
Predicting which candidate will perform best based on interview notes.
Scoring candidates on interpersonal communication during video interviews.
*Designing structured, competency-based interview questions.
===
What is the most important principle for ethical AI use in the hiring process?
AI should be disclosed to candidates at the beginning of the process.
*Humans are accountable for every hiring decision regardless of AI's role.
AI should only be used for tasks explicitly approved by the HR team.
AI hiring tools must achieve unbiased outcomes before deployment.
===
What does "adverse impact" mean in the context of AI hiring tools?
*When an AI tool produces significantly worse outcomes for a protected group.
When candidates react negatively to discovering AI was used in screening.
When an AI tool produces incorrect recommendations for senior roles.
When AI hiring speeds become too fast for the HR team to manage.
===
You use AI to design a training programme for your team. What is the most important first step?
Generate a comprehensive curriculum covering all relevant topics.
Benchmark the training design against industry best practices.
*Identify the specific skill gap the training must close.
Decide whether to use AI for delivery as well as design.
===
What is the most effective use of AI in personalising employee learning paths?
*Adapting content sequence and difficulty based on demonstrated performance data.
Generating different versions of the same content for different job levels.
Allowing employees to select their own learning content from AI recommendations.
Providing AI-generated explanations when employees request additional context.
===
A manager asks AI to evaluate employee performance based on their written communications. What is the primary concern?
AI cannot access the full range of employee work outputs for evaluation.
The evaluation may violate employee privacy depending on jurisdiction.
Written communication is too subjective a metric for AI to score reliably.
*Written communication samples introduce significant bias and do not measure overall performance.
===
You use Claude to design microlearning modules for a new product launch. What must you verify before deployment?
That the modules meet the minimum length standard for your LMS.
*The accuracy of every product claim in the learning content.
That the design matches your company's learning template exactly.
That Claude used the most current product information in its training data.
===
What is the most appropriate role for AI in mentoring and coaching programmes?
Replacing peer mentoring for employees at junior levels.
Providing AI coaching as the primary development intervention.
*Supplementing human mentors with structured resources and reflection prompts.
Matching mentors and mentees using AI analysis of their communication styles.
===
You use AI to generate employee survey questions. What is the most important quality check?
Whether the questions are short enough for a good completion rate.
Whether the questions are in the same format as last year's survey.
Whether the questions avoid leading language as identified by AI.
*Whether the questions measure what the business actually needs to understand.
===
What is the most reliable AI use case for leadership development programmes?
*Generating scenario-based learning situations for leadership skills practice.
Assessing participants' leadership potential from their written outputs.
Predicting which participants will become effective leaders after the programme.
Replacing executive coaches with AI coaching for cost efficiency.
===
A learning and development team uses AI to track employee engagement with training content. What is the most important thing to do with this data?
Share it with line managers to inform performance reviews.
*Use it to identify specific patterns that inform content and delivery improvements.
Use it to rank employees by learning engagement for reward programmes.
Send it to the AI tool for model improvement over time.
===
What is the most effective way to use AI to prepare managers for difficult conversations?
Provide managers with a script to read from during the conversation.
Ask AI for the optimal approach to the specific conversation.
Have AI analyse the manager's communication style before the conversation.
*Generate realistic scenarios and practice dialogue for the specific situation.
===
Which statement about AI and 70:20:10 learning frameworks is most accurate?
AI can replicate all three learning components with appropriate tools.
AI replaces the 20% social learning component more effectively than formal training.
*AI is most applicable to the 10% formal learning component.
AI is most useful for the 70% on-the-job learning component.
===
You use AI to identify skills gaps across the organisation from job description and performance data. What must you do before making L&D investment decisions?
Ensure the AI analysed at least 12 months of performance data for accuracy.
*Validate AI-identified gaps with qualitative input from managers and employees.
Have the HR leadership team review and approve the skills gap analysis.
Commission an independent audit of the AI skills gap methodology.
===
What is the most important design principle for AI-assisted assessments in learning programmes?
*AI assessment should measure demonstrated capability, not just recall of content.
AI assessments should be adaptive — harder questions for higher scorers.
AI assessments should be scored by AI to remove human marking bias.
AI assessments should be shorter than traditional assessments to maximise completion.
===
An employee complains that an AI learning recommendation does not match their actual development needs. What is the most appropriate response?
Explain that AI recommendations are optimised for the average learner in their role.
Switch the employee to a human-curated learning path instead.
*Review the data the AI used and allow the employee to provide input on their needs.
Adjust the AI model's parameters to improve recommendations for this employee.
===
What is the most important reason to maintain human oversight in AI-driven performance learning interventions?
AI learning interventions are not yet reliable enough for production use.
Employees prefer human contact for development conversations.
Human oversight is legally required for performance-related learning.
*Learning needs are contextual and relationship-driven in ways AI cannot fully capture.
===
What is the highest-value AI capability for an HR team managing learning at scale?
Generating entirely new training content on demand for any skill area.
*Rapidly personalising content recommendations across large learner populations.
Predicting which employees will leave if not given development opportunities.
Replacing external training vendors for cost-effective L&D delivery.
===
You use AI to analyse attrition data and identify employees at risk of leaving. Before sharing this with managers:
*Assess the privacy, consent, and potential harm implications of sharing risk scores.
Verify that the attrition model accuracy rate is above the industry standard.
Ensure the risk scores are presented with appropriate confidence intervals.
Have the legal team review the model methodology for compliance.
===
What is the most important limitation of AI-powered people analytics?
People analytics AI requires very large employee populations to be accurate.
AI cannot access the qualitative data needed for meaningful workforce insights.
*Correlation in people data does not establish causation for management decisions.
People analytics AI is only valid when employees have consented to data use.
===
An AI workforce planning model suggests that 20% of your workforce will need reskilling for digital roles. What is the most important next step?
Design and launch the reskilling programme immediately to stay ahead of the curve.
*Validate this projection against qualitative input from business and functional leaders.
Commission an independent AI audit to verify the workforce planning model.
Share the projection with the board as a strategic risk for discussion.
===
Which people analytics question is most appropriate for AI to answer?
Whether a specific employee's performance issues are addressable with training.
Which employees are most likely to become leaders in the next 3 years.
Whether a specific team's underperformance is caused by poor management.
*What patterns in historical hiring data predict which candidates were retained?
===
You use AI to segment your workforce for a compensation review. The most critical check is:
*Whether the segmentation could inadvertently reflect or amplify pay inequities.
Whether the segments are the right size for manageable compensation review.
Whether the AI used the current compensation bands in its segmentation.
Whether the segmentation methodology has been validated by HR leadership.
===
What is the most appropriate use of AI in succession planning?
Selecting the most qualified internal candidate for a leadership role.
*Identifying patterns in career paths that correlate with leadership readiness.
Predicting which candidates will succeed in a specific leadership role.
Automatically advancing employees whose performance data meets the threshold.
===
An HR team wants to use AI to monitor employee wellbeing through sentiment analysis of internal communications. The most important concern is:
Sentiment analysis of text is not sufficiently accurate for wellbeing monitoring.
Employees will change their communication behaviour if they know they are monitored.
The wellbeing data generated may not be actionable without clinical expertise.
*This constitutes employee surveillance and may violate privacy rights.
===
You use AI to analyse exit interview data to identify retention risk factors. What is the most reliable insight AI can surface?
The exact reasons each specific employee decided to leave.
The manager most responsible for attrition based on exit interview data.
*Recurring themes and language patterns that appear across multiple exit interviews.
Whether the identified risk factors are present in current employee surveys.
===
What is the most important privacy principle for HR AI applications?
Employee data should be anonymised before being used in any AI model.
*Employee data should only be used for purposes employees have been informed about.
AI models trained on employee data must be reviewed by a data protection officer.
Employees should have the right to review AI-generated assessments about them.
===
A business leader asks HR to use AI to identify employees who are "flight risks." What is the most important challenge to address before proceeding?
*How the risk information will be used and whether it might harm the employees identified.
Whether the attrition model has been validated on your company's specific employee data.
Whether employees have consented to their data being used for attrition prediction.
Whether the model can distinguish between employees who have already decided to leave.
===
You build an AI model that predicts high performance in engineering roles. After deployment, you notice it predicts lower performance for women. What must you do?
Add gender as a variable in the model to correct the bias.
Disclose the bias to the engineering leadership and continue using it with caution.
*Stop using the model immediately and investigate the source of bias.
Monitor the model for another quarter to see if the bias persists at scale.
===
What is the most effective AI use case for improving diversity in hiring?
Blind screening that hides candidate names and universities.
Identifying which interview panellists rate candidates most diversely.
Scoring candidates on objective criteria to remove subjective bias.
*Standardising job requirement language to remove exclusionary criteria.
===
What is the most important governance requirement for AI in people analytics?
Regular accuracy testing of all people analytics AI models in production.
*Clear ownership of who is responsible for AI model outputs and their consequences.
Employee notification whenever an AI model is used in a people decision.
Third-party audit of all people analytics AI models before deployment.
===
You use AI to analyse your company's internal pay equity data. The most important limitation to communicate is:
AI pay equity analysis requires more than 500 employees to be statistically valid.
AI cannot access all relevant compensation components needed for full analysis.
*AI identifies patterns that suggest inequity but cannot establish the causes.
AI pay equity results are only legally defensible if conducted by a qualified auditor.
===
What is the most accurate description of AI's role in strategic workforce planning?
*AI surfaces patterns and projections that inform human strategic decisions.
AI automates the workforce planning process for efficiency at scale.
AI replaces the need for HR business partners in workforce planning conversations.
AI makes workforce planning more accurate by removing human forecasting bias.
===
Your company operates across multiple Indian states and uses AI in hiring. What is the most important compliance check?
Whether the AI vendor is registered and compliant in all states of operation.
Whether your AI hiring tool has been tested for accuracy across regional accents.
Whether employees in each state have been trained on the AI hiring process.
*Whether AI hiring practices comply with applicable state-level employment laws.
===
What is the most important question before implementing AI-based performance evaluation?
Whether the AI model has been validated on a representative performance dataset.
*Whether the AI evaluation criteria are transparent and contestable by employees.
Whether line managers support replacing human assessment with AI evaluation.
Whether the AI evaluation system can integrate with your existing HRIS.
===
A manager wants to use AI to monitor remote employee productivity. The most important concern is:
Productivity AI metrics may not accurately capture remote work output.
Remote monitoring AI requires employees to be notified in their contracts.
*Surveillance without consent undermines trust and may violate employment law.
AI productivity monitoring may disadvantage employees with unreliable internet access.
===
What is the most accurate statement about AI and unconscious bias in HR processes?
*AI can perpetuate bias at scale but can also be explicitly designed to reduce it.
AI removes unconscious bias because it makes decisions based on data, not intuition.
AI introduces new forms of bias that are more difficult to detect than human bias.
AI bias and human bias cancel each other out when used together in evaluation.
===
You discover that an AI interview scoring tool gives lower scores to candidates who speak with non-metropolitan Indian accents. What is the correct action?
Add an accent correction filter to normalise speech before scoring.
Continue using it but give accent-affected candidates a manual score boost.
Inform hiring managers so they can compensate for the bias in their decisions.
*Withdraw the tool from use and address the bias before any redeployment.
===
What is the most important ethical principle for AI in HR?
AI HR tools must demonstrate equivalent accuracy to human HR judgment.
AI HR applications must be approved by the employees they will assess.
*AI HR decisions must be explainable to and contestable by the people they affect.
AI HR decisions must achieve lower error rates than manual HR processes.
===
Your CHRO wants to use AI to predict which employees are likely to experience burnout. What governance must be in place before deployment?
*Clear policies on how identified employees will be helped, not penalised.
Accuracy benchmarks the burnout model must achieve before use.
Employee consent to have their data used for burnout prediction.
Legal review confirming the burnout prediction model is compliant.
===
A job candidate sues your company alleging AI screening discriminated against them. What documentation must you be able to produce?
Proof that the AI tool was purchased from a reputable enterprise vendor.
*The criteria and methodology the AI used and evidence of validation testing.
The hiring manager's manual review notes confirming the AI recommendation.
Evidence that the candidate did not meet the minimum stated qualifications.
===
What is the most responsible approach to employee data in AI HR tools?
Anonymise all employee data before it is used in any AI HR model.
Require employee consent for every specific use of their data in AI models.
*Collect only the data necessary for the specific HR purpose and retain it minimally.
Encrypt all employee data to ensure it cannot be accessed by the AI vendor.
===
What is the most important signal that an AI HR tool vendor is responsible?
Their tool is used by large Fortune 500 companies.
They offer a money-back guarantee if the tool underperforms.
Their AI is built on the most advanced foundation model available.
*They provide bias audit results and commit to ongoing monitoring.
===
What is the most appropriate role for AI in a disciplinary investigation?
*Organising and surfacing relevant documents and communications for human review.
Making the initial finding on whether a policy violation occurred.
Recommending the appropriate disciplinary action based on precedent.
Replacing the investigation officer for efficiency in straightforward cases.
===
A new joinee receives their onboarding content from an AI system. What must remain human?
The administrative process for benefits enrolment and ID card issuance.
*The relationship-building conversations that establish belonging and context.
The policy and compliance training content delivery.
The document signing and contract completion process.
===
What is the most important criterion for evaluating an AI-generated HR policy document?
Whether it matches the tone and style of your existing HR documentation.
Whether it covers all the topics that HR policies typically address.
Whether it has been reviewed and approved by the CHRO.
*Whether it complies with applicable employment law in your jurisdiction.
===
What is the most effective way to ensure AI tools in HR are used responsibly?
*Build responsible use principles into team training and workflow design.
Require all AI HR outputs to receive CHRO approval before action.
Audit all AI HR decisions annually by an external AI ethics specialist.
Limit AI HR use to functions where errors can be quickly reversed.
===
What distinguishes ethical AI use in HR from compliant AI use in HR?
Ethical use requires employee consent; compliant use does not require consent.
Ethical use exceeds legal standards; compliant use meets international best practice.
*Ethical use considers impact on employees; compliant use meets minimum legal requirements.
Ethical use requires explainable AI; compliant use only requires accurate AI.
===
A senior leader asks you to use AI to find reasons to justify a termination decision already made. What is the correct response?
*Decline — AI should not be used to retroactively justify predetermined decisions.
Proceed — using AI to document the decision is an improvement over informal records.
Proceed only if the AI findings genuinely support the decision.
Ask the legal team if using AI for this purpose is permissible.
===
You discover that AI used in your last hiring cycle may have screened out qualified candidates from a specific background. What do you do?
Conduct a quiet internal review before deciding whether to take action.
Document the finding and include it in the next annual AI audit.
Check whether the candidates who were screened out were actually strong enough.
*Investigate the scope, notify affected candidates if appropriate, and fix the process.
===
An HR manager uses AI to write all their employee communication without reading it. An email goes out with an incorrect policy statement. Who is accountable?
The AI tool vendor — their tool produced incorrect content.
*The HR manager — they sent communication they had not reviewed.
The HR Director — they are responsible for the manager's process.
The organisation — they permitted AI use for employee communication.
===
A CHRO wants to automate annual performance ratings using AI. The most important objection to raise is:
AI performance ratings have not been validated for accuracy against human ratings.
Employees will resist AI performance ratings and engagement will decline.
*Performance ratings affect pay, promotion, and career — they require human accountability.
Annual ratings are too infrequent for AI pattern detection to be reliable.
===
Your company plans to use AI to monitor employee engagement through email sentiment. You must address this with the CEO first. The most important point is:
*This is employee surveillance that may violate privacy rights and destroy trust.
Email sentiment analysis is not sufficiently accurate for engagement measurement.
The legal team must review whether this is permissible in your jurisdiction.
Employees should be given the option to opt out before implementation.
===
You are implementing an AI hiring tool recommended by a vendor. The vendor says it is "bias-free." What must you do before deployment?
Ask the vendor to provide their bias audit documentation.
Pilot the tool with 10 candidates and evaluate the results.
*Conduct your own independent validation on your candidate pool before using it.
Obtain a legal indemnification from the vendor for any discrimination claims.
===
A highly capable candidate is rejected by your AI screening tool. A hiring manager advocates strongly for them. What is the most appropriate process?
Override the AI decision since hiring manager judgment should prevail.
Reject the candidate since overriding AI creates inconsistency in your process.
Refer the case to HR leadership to resolve the conflict.
*Review the AI's screening criteria and manually evaluate the candidate against them.
===
You are the HRBP for a team where AI recommends that three specific employees are "low performers." Managers want to start performance improvement plans. What do you do first?
Support the managers — AI has identified a performance concern to address.
*Investigate whether the AI recommendation has validity before any action is taken.
Consult legal before any performance management process begins.
Review the employees' recent performance data independent of the AI recommendation.
===
Your organisation has decided that all HR AI use must be disclosed to employees. A manager asks if they can skip disclosure for a "minor" AI tool used in scheduling. What do you say?
"Scheduling tools are operational, not people decisions, so disclosure is optional."
"You can use your judgment on disclosure for minor tools."
*"Disclosure applies to all AI use — consistency is what makes the policy credible."
"Check with legal on whether scheduling AI triggers the disclosure requirement."
===
What is the most important thing an HR professional must understand about AI to use it responsibly?
*AI reflects the patterns in its training data — including historical biases.
AI is most reliable for structured, data-rich HR tasks like payroll processing.
AI in HR requires ongoing accuracy monitoring to remain reliable over time.
AI cannot replace the legal expertise needed for compliance decision-making.
===
A new HR technology vendor proposes using AI to predict which employees will experience mental health issues. What is your response?
Pilot the tool with a small group to test its accuracy before wider deployment.
*Decline — mental health prediction is an unacceptable invasion of employee privacy.
Accept if employees consent to participation in the programme.
Accept if the predictions are used only to offer support, not for evaluation.
===
You are building an AI-powered HR analytics dashboard. What must you include to ensure responsible use?
Real-time updating so all data reflects the current moment.
Confidence scores for all AI-generated predictions and recommendations.
Audit logs of every user who views each data point in the dashboard.
*Contextual interpretation guidance so users understand what metrics mean.
===
What is the most important difference between AI-assisted HR decisions and AI-made HR decisions?
AI-assisted decisions are faster; AI-made decisions are more consistent.
AI-assisted decisions use AI for analysis; AI-made decisions use AI for action.
*AI-assisted decisions have a human accountable for the outcome; AI-made decisions do not.
AI-assisted decisions require human review; AI-made decisions do not require consent.
===
What is the most important quality for an HR professional using AI in their daily work?
Technical knowledge of how the AI models used in HR actually work.
*The ability to evaluate AI outputs critically with people-first ethical judgment.
Speed of adoption across all available HR AI tools.
Ability to communicate AI capabilities to leadership and employees.
===
Menler's AI for HR bank is designed for HR professionals at what stage of AI maturity?
Those exploring AI for the first time in a non-technical role.
Those building AI systems and models for HR technology products.
Those managing AI vendors and procurement for large HR functions.
*Those applying AI to real HR work with professional accountability for outcomes.
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

export const HR_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getHrSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
