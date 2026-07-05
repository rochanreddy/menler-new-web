// AI for HR — AI Aptitude question bank: 75 questions (5 sets × 15).
// Sets: Talent Acquisition · Learning & Development · People Analytics &
// Workforce Planning · HR Compliance & Ethics · HR Judgment Scenarios.
//
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getHrSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }], explanation } (s = 1 for the correct option).

const RAW = String.raw`
You use AI to screen 500 CVs for a marketing role. The most important safeguard is:
Using the most advanced AI model available to maximise screening accuracy.
*Human review of AI-shortlisted and AI-rejected candidates before decisions are finalised.
Ensuring the AI has access to all job requirements before screening.
Running the screening twice to confirm consistent AI shortlisting.
Human review of both shortlisted and rejected candidates keeps a person accountable and catches biased or erroneous exclusions; a better model or a repeat run only automates the same flawed logic more confidently.
===
What is the most significant bias risk when using AI to screen CVs?
AI cannot evaluate soft skills or cultural fit from CV text.
AI may favour CVs with better formatting over weaker content.
AI may incorrectly parse CVs from non-standard formats.
*AI may replicate historical hiring patterns that excluded certain groups.
Models trained on past hiring data learn who was hired before, so they can systematically disadvantage groups that were historically underrepresented; parsing and formatting issues are quality problems, not discrimination risks.
===
You use Claude to draft a job description. The most important edit before publishing is:
*Removing language that may discourage qualified candidates from applying.
Ensuring the JD uses current industry-standard terminology.
Checking that the JD matches your internal HR template format.
Adding specific compensation ranges to attract quality candidates.
Exclusionary or gendered wording narrows your applicant pool and can create legal exposure, so removing it has the greatest impact; terminology, template formatting, and pay ranges are useful but secondary to who feels able to apply.
===
A candidate asks "was AI used to evaluate my application?" What is the most appropriate response?
Decline to disclose internal screening methodology.
Explain that AI was used only for initial sorting, not evaluation.
*Be transparent about AI's role in the screening process.
Tell them AI was not involved if it was only used for CV parsing.
Transparency about how AI was used respects the candidate and aligns with fair-hiring expectations; downplaying, denying, or refusing to disclose erodes trust and can breach emerging disclosure obligations.
===
Which AI application in talent acquisition adds the most value with the least risk?
Making the final hiring recommendation after all interviews.
*Drafting structured interview questions from a job description.
Predicting which candidates will perform best in the role.
Scoring video interview responses for communication quality.
Generating structured, job-relevant interview questions augments human judgment without deciding outcomes, so the risk is low; final recommendations, performance prediction, and video scoring make or heavily influence decisions and carry high bias and validity risk.
===
You are building an AI-assisted hiring workflow. What does "human in the loop" specifically require?
*A human reviews and approves AI recommendations at every decision point.
A human wrote the initial job description the AI worked from.
A human can override AI decisions if they disagree after the fact.
A human monitors AI screening performance through a dashboard.
Human in the loop means a person actively reviews and approves before each decision is made, not merely that a human was involved upstream or could intervene afterward; post-hoc override and dashboard monitoring leave the AI effectively deciding.
===
What is the most important limitation to communicate to hiring managers who want to use AI for final candidate selection?
AI recommendations are statistical averages and may not apply to this specific role.
AI selection models require a minimum of 1,000 historical data points to be reliable.
AI selection tools have not been validated for the Indian hiring market.
*AI cannot account for the contextual and interpersonal factors that predict job success.
Job success depends on context, relationships, and potential that AI cannot observe from application data, which is the core reason it should not select on its own; the specific data-volume and market-validation claims are situational, not universal truths.
===
A hiring manager says "the AI scored this candidate low so we should pass." The most important challenge to this reasoning is:
The AI may not have received the candidate's full application materials.
AI scores should be one input among many, not the sole decision factor.
*The AI score reflects pattern matching, not human judgment about fit and potential.
AI scoring systems are only valid when candidates consent to being scored.
The deepest challenge is that an AI score is statistical pattern matching against past data, not an assessment of this person's fit or potential, so it should never stand in for human judgment; incomplete inputs and consent are real but narrower concerns.
===
You use AI to generate a job offer letter template. What is non-negotiable before using it?
*Legal review to ensure it complies with applicable employment law.
Checking that it matches your company's visual identity guidelines.
Having the hiring manager personalise it for the specific candidate.
Confirming it includes all standard clauses for your industry.
An offer letter is a binding document, so legal review for employment-law compliance is essential before use; branding, personalisation, and standard clauses matter but cannot substitute for legal validity.
===
What is the most accurate statement about AI and "culture fit" assessment in hiring?
AI is more objective than humans at assessing culture fit.
AI culture fit assessment is reliable when trained on existing team data.
Culture fit AI works best when combined with personality assessment tools.
*AI cannot reliably assess culture fit and risks encoding cultural homogeneity.
Training on your current team teaches the AI to prefer people like those already there, entrenching homogeneity rather than measuring fit, so AI cannot reliably assess it; the other options wrongly treat that same mechanism as objectivity or reliability.
===
You want to reduce time-to-hire using AI. The most appropriate first step is:
Implement AI screening for all roles immediately to test time savings.
*Identify which specific steps in your hiring process are the bottlenecks.
Survey hiring managers about which parts of the process they find most time-consuming.
Benchmark your current time-to-hire against industry averages using AI research.
You cannot fix what you have not diagnosed, so identifying the actual bottlenecks comes first; deploying AI everywhere, surveying perceptions, or benchmarking externally can all miss where the real delay sits.
===
A recruiter uses AI to write personalised candidate outreach at scale. The highest risk to manage is:
Candidates replying faster than the recruiter can handle the responses.
AI outreach that is stylistically inconsistent across different messages.
*Outreach that feels personalised but lacks genuine specificity for each candidate.
Sending outreach to candidates who have opted out of recruiting contact.
Generic messages dressed up as personal damage the employer brand and candidate trust when the hollowness shows, making that the highest risk; volume, style consistency, and opt-out compliance are more easily managed operationally.
===
Which interview practice is most improved by AI assistance?
Evaluating candidate responses during the interview itself.
Predicting which candidate will perform best based on interview notes.
Scoring candidates on interpersonal communication during video interviews.
*Designing structured, competency-based interview questions.
AI reliably strengthens interview design by generating structured, competency-based questions, a preparation task with low risk; live evaluation, performance prediction, and communication scoring intrude on human judgment and introduce bias.
===
What is the most important principle for ethical AI use in the hiring process?
AI should be disclosed to candidates at the beginning of the process.
*Humans are accountable for every hiring decision regardless of AI's role.
AI should only be used for tasks explicitly approved by the HR team.
AI hiring tools must achieve unbiased outcomes before deployment.
Human accountability for every decision is the foundational principle, because it holds whatever the tool does; disclosure and internal approval are practices that flow from it, and "unbiased before deployment" is an unattainable standard.
===
What does "adverse impact" mean in the context of AI hiring tools?
*When an AI tool produces significantly worse outcomes for a protected group.
When candidates react negatively to discovering AI was used in screening.
When an AI tool produces incorrect recommendations for senior roles.
When AI hiring speeds become too fast for the HR team to manage.
Adverse impact is the legal concept of a practice producing significantly worse outcomes for a protected group, even without intent to discriminate; the other options describe candidate reactions or operational issues, not the disparate-impact standard.
===
You use AI to design a training programme for your team. What is the most important first step?
Generate a comprehensive curriculum covering all relevant topics.
Benchmark the training design against industry best practices.
*Identify the specific skill gap the training must close.
Decide whether to use AI for delivery as well as design.
Effective training starts from the specific skill gap it must close, or it risks being comprehensive but irrelevant; benchmarking and delivery decisions matter only after you know what problem the training solves.
===
What is the most effective use of AI in personalising employee learning paths?
*Adapting content sequence and difficulty based on demonstrated performance data.
Generating different versions of the same content for different job levels.
Allowing employees to select their own learning content from AI recommendations.
Providing AI-generated explanations when employees request additional context.
True personalisation adapts the sequence and difficulty to each learner's demonstrated performance, which is where AI adds the most value; level-based variants, self-selection, and on-demand explanations are helpful but do not respond to individual progress.
===
A manager asks AI to evaluate employee performance based on their written communications. What is the primary concern?
AI cannot access the full range of employee work outputs for evaluation.
The evaluation may violate employee privacy depending on jurisdiction.
Written communication is too subjective a metric for AI to score reliably.
*Written communication samples introduce significant bias and do not measure overall performance.
Judging performance from writing samples penalises non-native speakers and roles that communicate less in text, introducing bias while capturing only a sliver of the job, so it is not a valid measure; access, privacy, and subjectivity are secondary to that validity failure.
===
You use Claude to design microlearning modules for a new product launch. What must you verify before deployment?
That the modules meet the minimum length standard for your LMS.
*The accuracy of every product claim in the learning content.
That the design matches your company's learning template exactly.
That Claude used the most current product information in its training data.
Since AI can state plausible but wrong product details, verifying the accuracy of every claim is essential before launch training goes out; length, template match, and assumptions about training-data currency do not protect learners from misinformation.
===
What is the most appropriate role for AI in mentoring and coaching programmes?
Replacing peer mentoring for employees at junior levels.
Providing AI coaching as the primary development intervention.
*Supplementing human mentors with structured resources and reflection prompts.
Matching mentors and mentees using AI analysis of their communication styles.
Mentoring is fundamentally a human relationship, so AI is best used to supplement mentors with resources and reflection prompts rather than replace them or become the primary intervention; style-based matching risks encoding bias and misjudging fit.
===
You use AI to generate employee survey questions. What is the most important quality check?
Whether the questions are short enough for a good completion rate.
Whether the questions are in the same format as last year's survey.
Whether the questions avoid leading language as identified by AI.
*Whether the questions measure what the business actually needs to understand.
A survey only creates value if its questions measure what the business needs to learn, so construct validity is the key check; brevity, format continuity, and neutral wording improve a survey that is already asking the right things.
===
What is the most reliable AI use case for leadership development programmes?
*Generating scenario-based learning situations for leadership skills practice.
Assessing participants' leadership potential from their written outputs.
Predicting which participants will become effective leaders after the programme.
Replacing executive coaches with AI coaching for cost efficiency.
Generating realistic practice scenarios is a reliable, low-risk way AI supports leadership development; assessing potential, predicting future leaders, and replacing coaches all ask AI to make high-stakes human judgments it cannot validly make.
===
A learning and development team uses AI to track employee engagement with training content. What is the most important thing to do with this data?
Share it with line managers to inform performance reviews.
*Use it to identify specific patterns that inform content and delivery improvements.
Use it to rank employees by learning engagement for reward programmes.
Send it to the AI tool for model improvement over time.
Engagement data is most responsibly used to improve the content and delivery itself; feeding it into performance reviews or reward rankings repurposes learning data for evaluation, which erodes trust and discourages honest engagement.
===
What is the most effective way to use AI to prepare managers for difficult conversations?
Provide managers with a script to read from during the conversation.
Ask AI for the optimal approach to the specific conversation.
Have AI analyse the manager's communication style before the conversation.
*Generate realistic scenarios and practice dialogue for the specific situation.
Practising through realistic scenarios builds the manager's own capability to adapt in the moment, which is the goal; scripts make conversations rigid, a single "optimal approach" ignores context, and style analysis does not develop the skill.
===
Which statement about AI and 70:20:10 learning frameworks is most accurate?
AI can replicate all three learning components with appropriate tools.
AI replaces the 20% social learning component more effectively than formal training.
*AI is most applicable to the 10% formal learning component.
AI is most useful for the 70% on-the-job learning component.
The 70:20:10 model attributes only 10% of development to formal learning, which is exactly the structured-content area AI supports best; the 70% experiential and 20% social components depend on real work and human relationships that AI cannot replace.
===
You use AI to identify skills gaps across the organisation from job description and performance data. What must you do before making L&D investment decisions?
Ensure the AI analysed at least 12 months of performance data for accuracy.
*Validate AI-identified gaps with qualitative input from managers and employees.
Have the HR leadership team review and approve the skills gap analysis.
Commission an independent audit of the AI skills gap methodology.
AI-identified gaps are hypotheses from limited data, so validating them with the managers and employees who know the real context is essential before investing; a fixed data window, leadership sign-off, or an external audit does not confirm the gaps are real.
===
What is the most important design principle for AI-assisted assessments in learning programmes?
*AI assessment should measure demonstrated capability, not just recall of content.
AI assessments should be adaptive — harder questions for higher scorers.
AI assessments should be scored by AI to remove human marking bias.
AI assessments should be shorter than traditional assessments to maximise completion.
Assessments create value when they measure demonstrated capability rather than mere recall, since capability is what transfers to the job; adaptivity, AI marking, and brevity are optimisations that matter only once the assessment measures the right thing.
===
An employee complains that an AI learning recommendation does not match their actual development needs. What is the most appropriate response?
Explain that AI recommendations are optimised for the average learner in their role.
Switch the employee to a human-curated learning path instead.
*Review the data the AI used and allow the employee to provide input on their needs.
Adjust the AI model's parameters to improve recommendations for this employee.
Reviewing the underlying data and inviting the employee's input treats them as a partner and improves the recommendation with real context; defending the average, abandoning the tool, or quietly tweaking parameters all bypass the person who knows their own needs best.
===
What is the most important reason to maintain human oversight in AI-driven performance learning interventions?
AI learning interventions are not yet reliable enough for production use.
Employees prefer human contact for development conversations.
Human oversight is legally required for performance-related learning.
*Learning needs are contextual and relationship-driven in ways AI cannot fully capture.
Human oversight matters most because development needs are shaped by context and relationships that AI cannot fully see; the claims about production-readiness, preference, and blanket legal requirement are either overstated or situational.
===
What is the highest-value AI capability for an HR team managing learning at scale?
Generating entirely new training content on demand for any skill area.
*Rapidly personalising content recommendations across large learner populations.
Predicting which employees will leave if not given development opportunities.
Replacing external training vendors for cost-effective L&D delivery.
At scale, AI's greatest value is rapidly tailoring recommendations to many individual learners, something humans cannot do manually; unconstrained content generation risks inaccuracy, attrition prediction is high-risk, and vendor replacement is a cost play, not a learning gain.
===
You use AI to analyse attrition data and identify employees at risk of leaving. Before sharing this with managers:
*Assess the privacy, consent, and potential harm implications of sharing risk scores.
Verify that the attrition model accuracy rate is above the industry standard.
Ensure the risk scores are presented with appropriate confidence intervals.
Have the legal team review the model methodology for compliance.
Flight-risk labels can lead to employees being sidelined or treated unfairly, so assessing privacy, consent, and potential harm comes first; accuracy, confidence intervals, and legal review are important but do not address whether sharing the scores could harm the people named.
===
What is the most important limitation of AI-powered people analytics?
People analytics AI requires very large employee populations to be accurate.
AI cannot access the qualitative data needed for meaningful workforce insights.
*Correlation in people data does not establish causation for management decisions.
People analytics AI is only valid when employees have consented to data use.
People analytics surfaces correlations, and acting on them as if they were causes leads to wrong management decisions, which is the core limitation; population size, qualitative access, and consent are real constraints but do not capture this fundamental interpretive trap.
===
An AI workforce planning model suggests that 20% of your workforce will need reskilling for digital roles. What is the most important next step?
Design and launch the reskilling programme immediately to stay ahead of the curve.
*Validate this projection against qualitative input from business and functional leaders.
Commission an independent AI audit to verify the workforce planning model.
Share the projection with the board as a strategic risk for discussion.
A model projection is a starting point that should be validated against the judgment of business and functional leaders before you act; launching immediately, auditing the model, or escalating to the board all move before you have confirmed the projection reflects reality.
===
Which people analytics question is most appropriate for AI to answer?
Whether a specific employee's performance issues are addressable with training.
Which employees are most likely to become leaders in the next 3 years.
Whether a specific team's underperformance is caused by poor management.
*What patterns in historical hiring data predict which candidates were retained?
Identifying historical patterns associated with retention is a descriptive, aggregate question AI handles well; the other options ask AI to make causal or individual predictive judgments about specific people, which it cannot do reliably or fairly.
===
You use AI to segment your workforce for a compensation review. The most critical check is:
*Whether the segmentation could inadvertently reflect or amplify pay inequities.
Whether the segments are the right size for manageable compensation review.
Whether the AI used the current compensation bands in its segmentation.
Whether the segmentation methodology has been validated by HR leadership.
Segmentation built on existing pay data can bake in and magnify current inequities, so checking for that is most critical in a compensation review; segment size, current bands, and leadership validation are process details that do not guard against amplifying unfairness.
===
What is the most appropriate use of AI in succession planning?
Selecting the most qualified internal candidate for a leadership role.
*Identifying patterns in career paths that correlate with leadership readiness.
Predicting which candidates will succeed in a specific leadership role.
Automatically advancing employees whose performance data meets the threshold.
AI is best used to surface patterns in career progression that inform human succession decisions; selecting candidates, predicting individual success, and auto-advancing on thresholds all hand consequential people decisions to the model.
===
An HR team wants to use AI to monitor employee wellbeing through sentiment analysis of internal communications. The most important concern is:
Sentiment analysis of text is not sufficiently accurate for wellbeing monitoring.
Employees will change their communication behaviour if they know they are monitored.
The wellbeing data generated may not be actionable without clinical expertise.
*This constitutes employee surveillance and may violate privacy rights.
Scanning private communications is surveillance that can breach privacy rights and destroy trust, making it the paramount concern; accuracy limits, behaviour change, and lack of actionability are real but secondary to the fundamental question of whether the monitoring is legitimate at all.
===
You use AI to analyse exit interview data to identify retention risk factors. What is the most reliable insight AI can surface?
The exact reasons each specific employee decided to leave.
The manager most responsible for attrition based on exit interview data.
*Recurring themes and language patterns that appear across multiple exit interviews.
Whether the identified risk factors are present in current employee surveys.
AI reliably detects recurring themes and language patterns across many exit interviews, an aggregate strength; pinpointing exact individual reasons or blaming a specific manager overreaches from what the data can support.
===
What is the most important privacy principle for HR AI applications?
Employee data should be anonymised before being used in any AI model.
*Employee data should only be used for purposes employees have been informed about.
AI models trained on employee data must be reviewed by a data protection officer.
Employees should have the right to review AI-generated assessments about them.
Purpose limitation, using data only for the purposes employees were told about, is the foundational privacy principle; anonymisation, DPO review, and access rights are important safeguards but flow from and support that core commitment.
===
A business leader asks HR to use AI to identify employees who are "flight risks." What is the most important challenge to address before proceeding?
*How the risk information will be used and whether it might harm the employees identified.
Whether the attrition model has been validated on your company's specific employee data.
Whether employees have consented to their data being used for attrition prediction.
Whether the model can distinguish between employees who have already decided to leave.
The first question is how the flight-risk labels will be used and whether they could harm the people named, since even an accurate model becomes unethical if the output leads to unfair treatment; validation, consent, and model precision matter but presuppose the use is legitimate.
===
You build an AI model that predicts high performance in engineering roles. After deployment, you notice it predicts lower performance for women. What must you do?
Add gender as a variable in the model to correct the bias.
Disclose the bias to the engineering leadership and continue using it with caution.
*Stop using the model immediately and investigate the source of bias.
Monitor the model for another quarter to see if the bias persists at scale.
A model producing discriminatory predictions must be stopped and investigated at once; continuing "with caution," waiting a quarter, or crudely adding gender as a variable all keep a discriminatory tool in live decision-making.
===
What is the most effective AI use case for improving diversity in hiring?
Blind screening that hides candidate names and universities.
Identifying which interview panellists rate candidates most diversely.
Scoring candidates on objective criteria to remove subjective bias.
*Standardising job requirement language to remove exclusionary criteria.
Standardising job-requirement language removes exclusionary criteria at the source and widens the qualified pool before anyone is assessed; blind screening and "objective" scoring can still embed bias, and rating panellists on diversity misuses the metric.
===
What is the most important governance requirement for AI in people analytics?
Regular accuracy testing of all people analytics AI models in production.
*Clear ownership of who is responsible for AI model outputs and their consequences.
Employee notification whenever an AI model is used in a people decision.
Third-party audit of all people analytics AI models before deployment.
Governance rests on clear ownership of who is accountable for model outputs and their consequences, because without a responsible owner no other control is enforced; accuracy testing, notification, and audits are practices that a named owner is responsible for driving.
===
You use AI to analyse your company's internal pay equity data. The most important limitation to communicate is:
AI pay equity analysis requires more than 500 employees to be statistically valid.
AI cannot access all relevant compensation components needed for full analysis.
*AI identifies patterns that suggest inequity but cannot establish the causes.
AI pay equity results are only legally defensible if conducted by a qualified auditor.
AI can flag patterns that suggest pay inequity but cannot explain why they exist, so causes require human investigation before conclusions are drawn; the specific headcount threshold and blanket legal-defensibility claims are not universally true.
===
What is the most accurate description of AI's role in strategic workforce planning?
*AI surfaces patterns and projections that inform human strategic decisions.
AI automates the workforce planning process for efficiency at scale.
AI replaces the need for HR business partners in workforce planning conversations.
AI makes workforce planning more accurate by removing human forecasting bias.
AI's proper role is to surface patterns and projections that inform human strategic choices; framing it as full automation, a replacement for HRBPs, or a bias-free forecaster overstates its capability and removes necessary human judgment.
===
Your company operates across multiple Indian states and uses AI in hiring. What is the most important compliance check?
Whether the AI vendor is registered and compliant in all states of operation.
Whether your AI hiring tool has been tested for accuracy across regional accents.
Whether employees in each state have been trained on the AI hiring process.
*Whether AI hiring practices comply with applicable state-level employment laws.
Employment law can vary by state, so confirming your AI hiring practices comply with each applicable state law is the key check; vendor registration, accent testing, and staff training do not substitute for legal compliance where you hire.
===
What is the most important question before implementing AI-based performance evaluation?
Whether the AI model has been validated on a representative performance dataset.
*Whether the AI evaluation criteria are transparent and contestable by employees.
Whether line managers support replacing human assessment with AI evaluation.
Whether the AI evaluation system can integrate with your existing HRIS.
Because performance evaluations affect people's livelihoods, the criteria must be transparent and open to challenge by those evaluated; dataset validation, manager buy-in, and HRIS integration matter but do not secure fairness and contestability for employees.
===
A manager wants to use AI to monitor remote employee productivity. The most important concern is:
Productivity AI metrics may not accurately capture remote work output.
Remote monitoring AI requires employees to be notified in their contracts.
*Surveillance without consent undermines trust and may violate employment law.
AI productivity monitoring may disadvantage employees with unreliable internet access.
Covert productivity surveillance corrodes trust and can breach employment law, making it the foremost concern; metric accuracy, contractual notice, and connectivity disadvantage are real issues but secondary to whether the monitoring is legitimate and consented to.
===
What is the most accurate statement about AI and unconscious bias in HR processes?
*AI can perpetuate bias at scale but can also be explicitly designed to reduce it.
AI removes unconscious bias because it makes decisions based on data, not intuition.
AI introduces new forms of bias that are more difficult to detect than human bias.
AI bias and human bias cancel each other out when used together in evaluation.
AI is dual-edged: it can scale existing bias or, with deliberate design, help reduce it, which is the balanced and accurate view; claiming it removes bias, only adds hidden bias, or cancels human bias are all oversimplifications.
===
You discover that an AI interview scoring tool gives lower scores to candidates who speak with non-metropolitan Indian accents. What is the correct action?
Add an accent correction filter to normalise speech before scoring.
Continue using it but give accent-affected candidates a manual score boost.
Inform hiring managers so they can compensate for the bias in their decisions.
*Withdraw the tool from use and address the bias before any redeployment.
A tool that scores candidates lower for their accent is discriminatory and must be withdrawn until the bias is fixed; accent "correction," manual boosts, and asking managers to compensate all leave a biased tool in use and attempt to patch over discrimination.
===
What is the most important ethical principle for AI in HR?
AI HR tools must demonstrate equivalent accuracy to human HR judgment.
AI HR applications must be approved by the employees they will assess.
*AI HR decisions must be explainable to and contestable by the people they affect.
AI HR decisions must achieve lower error rates than manual HR processes.
The central ethical principle is that decisions affecting people must be explainable to and contestable by them, preserving human dignity and recourse; accuracy parity and lower error rates are performance benchmarks, and universal employee pre-approval is impractical as a standard.
===
Your CHRO wants to use AI to predict which employees are likely to experience burnout. What governance must be in place before deployment?
*Clear policies on how identified employees will be helped, not penalised.
Accuracy benchmarks the burnout model must achieve before use.
Employee consent to have their data used for burnout prediction.
Legal review confirming the burnout prediction model is compliant.
Before predicting something as sensitive as burnout, you need firm policies ensuring identified employees are supported rather than penalised, or the prediction can cause the harm it claims to prevent; accuracy, consent, and legal review are necessary but do not by themselves guarantee the data is used to help.
===
A job candidate sues your company alleging AI screening discriminated against them. What documentation must you be able to produce?
Proof that the AI tool was purchased from a reputable enterprise vendor.
*The criteria and methodology the AI used and evidence of validation testing.
The hiring manager's manual review notes confirming the AI recommendation.
Evidence that the candidate did not meet the minimum stated qualifications.
Defending against a discrimination claim requires showing the AI's criteria, methodology, and validation testing to demonstrate the process was job-related and fair; vendor reputation, a manager's confirming notes, or this candidate's qualifications do not prove the tool itself was non-discriminatory.
===
What is the most responsible approach to employee data in AI HR tools?
Anonymise all employee data before it is used in any AI HR model.
Require employee consent for every specific use of their data in AI models.
*Collect only the data necessary for the specific HR purpose and retain it minimally.
Encrypt all employee data to ensure it cannot be accessed by the AI vendor.
Data minimisation, collecting only what the purpose requires and keeping it briefly, is the most responsible baseline and limits harm if data is misused; anonymisation, per-use consent, and encryption are valuable controls but do not address collecting and holding more data than needed.
===
What is the most important signal that an AI HR tool vendor is responsible?
Their tool is used by large Fortune 500 companies.
They offer a money-back guarantee if the tool underperforms.
Their AI is built on the most advanced foundation model available.
*They provide bias audit results and commit to ongoing monitoring.
Sharing bias-audit results and committing to ongoing monitoring signals genuine accountability for fairness; a marquee client list, a refund guarantee, or an advanced underlying model say nothing about whether the tool treats candidates equitably.
===
What is the most appropriate role for AI in a disciplinary investigation?
*Organising and surfacing relevant documents and communications for human review.
Making the initial finding on whether a policy violation occurred.
Recommending the appropriate disciplinary action based on precedent.
Replacing the investigation officer for efficiency in straightforward cases.
In a disciplinary investigation AI should assist by organising and surfacing relevant material for human review, leaving findings and outcomes to people; making findings, recommending sanctions, or replacing the officer delegates judgments with serious consequences that require human accountability.
===
A new joinee receives their onboarding content from an AI system. What must remain human?
The administrative process for benefits enrolment and ID card issuance.
*The relationship-building conversations that establish belonging and context.
The policy and compliance training content delivery.
The document signing and contract completion process.
The relationship-building that creates belonging and cultural context is inherently human and cannot be automated; administrative tasks, standard training delivery, and document signing are transactional steps AI or systems can readily support.
===
What is the most important criterion for evaluating an AI-generated HR policy document?
Whether it matches the tone and style of your existing HR documentation.
Whether it covers all the topics that HR policies typically address.
Whether it has been reviewed and approved by the CHRO.
*Whether it complies with applicable employment law in your jurisdiction.
A policy document must above all comply with the employment law of your jurisdiction, since an inaccurate policy creates legal risk; matching tone, covering typical topics, and CHRO sign-off do not guarantee the content is legally sound.
===
What is the most effective way to ensure AI tools in HR are used responsibly?
*Build responsible use principles into team training and workflow design.
Require all AI HR outputs to receive CHRO approval before action.
Audit all AI HR decisions annually by an external AI ethics specialist.
Limit AI HR use to functions where errors can be quickly reversed.
Embedding responsible-use principles into everyday training and workflow design makes good practice the default at the point of use; CHRO approval of everything creates bottlenecks, annual external audits are too infrequent to catch daily issues, and restricting AI to reversible tasks needlessly limits value.
===
What distinguishes ethical AI use in HR from compliant AI use in HR?
Ethical use requires employee consent; compliant use does not require consent.
Ethical use exceeds legal standards; compliant use meets international best practice.
*Ethical use considers impact on employees; compliant use meets minimum legal requirements.
Ethical use requires explainable AI; compliant use only requires accurate AI.
Compliance meets the minimum the law requires, while ethical use goes further to weigh the actual impact on employees; the other options misstate the distinction by tying it narrowly to consent, best practice, or explainability.
===
A senior leader asks you to use AI to find reasons to justify a termination decision already made. What is the correct response?
*Decline — AI should not be used to retroactively justify predetermined decisions.
Proceed — using AI to document the decision is an improvement over informal records.
Proceed only if the AI findings genuinely support the decision.
Ask the legal team if using AI for this purpose is permissible.
Using AI to manufacture justification for a decision already made is unethical and legally risky, so the correct response is to decline; proceeding in any form or merely checking permissibility legitimises building a false evidentiary trail.
===
You discover that AI used in your last hiring cycle may have screened out qualified candidates from a specific background. What do you do?
Conduct a quiet internal review before deciding whether to take action.
Document the finding and include it in the next annual AI audit.
Check whether the candidates who were screened out were actually strong enough.
*Investigate the scope, notify affected candidates if appropriate, and fix the process.
Potential discrimination demands prompt, transparent action: investigate the scope, notify affected candidates where appropriate, and fix the process; a quiet review, deferring to an annual audit, or second-guessing whether the candidates were "good enough" all minimise and delay accountability.
===
An HR manager uses AI to write all their employee communication without reading it. An email goes out with an incorrect policy statement. Who is accountable?
The AI tool vendor — their tool produced incorrect content.
*The HR manager — they sent communication they had not reviewed.
The HR Director — they are responsible for the manager's process.
The organisation — they permitted AI use for employee communication.
Accountability rests with the HR manager who sent unreviewed communication, because the human who uses AI output owns the result; blaming the vendor, the director, or the organisation deflects from the individual's failure to review before sending.
===
A CHRO wants to automate annual performance ratings using AI. The most important objection to raise is:
AI performance ratings have not been validated for accuracy against human ratings.
Employees will resist AI performance ratings and engagement will decline.
*Performance ratings affect pay, promotion, and career — they require human accountability.
Annual ratings are too infrequent for AI pattern detection to be reliable.
Performance ratings drive pay, promotion, and careers, so they demand human accountability rather than automation; validation, employee resistance, and data frequency are secondary to the principle that consequential decisions about people must have a responsible human owner.
===
Your company plans to use AI to monitor employee engagement through email sentiment. You must address this with the CEO first. The most important point is:
*This is employee surveillance that may violate privacy rights and destroy trust.
Email sentiment analysis is not sufficiently accurate for engagement measurement.
The legal team must review whether this is permissible in your jurisdiction.
Employees should be given the option to opt out before implementation.
Scanning employees' emails for sentiment is surveillance that can violate privacy and shatter trust, which is the essential point to raise; accuracy, legal review, and opt-out options are relevant details that do not confront the core legitimacy problem.
===
You are implementing an AI hiring tool recommended by a vendor. The vendor says it is "bias-free." What must you do before deployment?
Ask the vendor to provide their bias audit documentation.
Pilot the tool with 10 candidates and evaluate the results.
*Conduct your own independent validation on your candidate pool before using it.
Obtain a legal indemnification from the vendor for any discrimination claims.
No tool is truly bias-free, so you must independently validate it on your own candidate pool before deployment; the vendor's documentation, a tiny pilot, or legal indemnification do not confirm the tool behaves fairly with your applicants.
===
A highly capable candidate is rejected by your AI screening tool. A hiring manager advocates strongly for them. What is the most appropriate process?
Override the AI decision since hiring manager judgment should prevail.
Reject the candidate since overriding AI creates inconsistency in your process.
Refer the case to HR leadership to resolve the conflict.
*Review the AI's screening criteria and manually evaluate the candidate against them.
The sound process is to examine why the AI rejected the candidate and manually assess them against the actual criteria, turning the conflict into a check on the tool; blindly overriding, blindly deferring, or escalating without review misses the chance to test whether the AI screened correctly.
===
You are the HRBP for a team where AI recommends that three specific employees are "low performers." Managers want to start performance improvement plans. What do you do first?
Support the managers — AI has identified a performance concern to address.
*Investigate whether the AI recommendation has validity before any action is taken.
Consult legal before any performance management process begins.
Review the employees' recent performance data independent of the AI recommendation.
Before anyone is placed on a PIP, you must first establish whether the AI's "low performer" label is valid, since acting on a flawed recommendation harms real people; supporting managers immediately, jumping to legal, or reviewing data are steps that either presume validity or come after the core question is answered.
===
Your organisation has decided that all HR AI use must be disclosed to employees. A manager asks if they can skip disclosure for a "minor" AI tool used in scheduling. What do you say?
"Scheduling tools are operational, not people decisions, so disclosure is optional."
"You can use your judgment on disclosure for minor tools."
*"Disclosure applies to all AI use — consistency is what makes the policy credible."
"Check with legal on whether scheduling AI triggers the disclosure requirement."
A disclosure policy only retains credibility if it is applied consistently to all AI use, so no exception should be carved out for "minor" tools; treating scheduling as exempt, delegating to individual judgment, or deferring to legal undermines the policy's integrity.
===
What is the most important thing an HR professional must understand about AI to use it responsibly?
*AI reflects the patterns in its training data — including historical biases.
AI is most reliable for structured, data-rich HR tasks like payroll processing.
AI in HR requires ongoing accuracy monitoring to remain reliable over time.
AI cannot replace the legal expertise needed for compliance decision-making.
The foundational understanding is that AI mirrors its training data, historical biases included, which shapes every responsible-use decision that follows; the points about reliable tasks, monitoring, and legal expertise are true but derive from this core insight.
===
A new HR technology vendor proposes using AI to predict which employees will experience mental health issues. What is your response?
Pilot the tool with a small group to test its accuracy before wider deployment.
*Decline — mental health prediction is an unacceptable invasion of employee privacy.
Accept if employees consent to participation in the programme.
Accept if the predictions are used only to offer support, not for evaluation.
Predicting employees' mental health is an unacceptable invasion of privacy that should be declined outright; piloting, seeking consent, or limiting the use to "support" still normalises deeply intrusive profiling of protected health information.
===
You are building an AI-powered HR analytics dashboard. What must you include to ensure responsible use?
Real-time updating so all data reflects the current moment.
Confidence scores for all AI-generated predictions and recommendations.
Audit logs of every user who views each data point in the dashboard.
*Contextual interpretation guidance so users understand what metrics mean.
Contextual interpretation guidance helps users understand what the metrics do and do not mean, preventing the misreading that leads to poor decisions; real-time updates, confidence scores, and audit logs are useful features but do not by themselves ensure the data is interpreted responsibly.
===
What is the most important difference between AI-assisted HR decisions and AI-made HR decisions?
AI-assisted decisions are faster; AI-made decisions are more consistent.
AI-assisted decisions use AI for analysis; AI-made decisions use AI for action.
*AI-assisted decisions have a human accountable for the outcome; AI-made decisions do not.
AI-assisted decisions require human review; AI-made decisions do not require consent.
The defining difference is accountability: in AI-assisted decisions a human owns the outcome, whereas AI-made decisions remove that human ownership, which is why the former is appropriate for consequential HR matters; the speed, analysis-versus-action, and consent framings miss this central point.
===
What is the most important quality for an HR professional using AI in their daily work?
Technical knowledge of how the AI models used in HR actually work.
*The ability to evaluate AI outputs critically with people-first ethical judgment.
Speed of adoption across all available HR AI tools.
Ability to communicate AI capabilities to leadership and employees.
The most important quality is critically evaluating AI outputs through people-first ethical judgment, which is what keeps AI use safe and fair; deep technical knowledge, rapid adoption, and communication skills are helpful but do not substitute for sound judgment about the outputs.
===
Menler's AI for HR bank is designed for HR professionals at what stage of AI maturity?
Those exploring AI for the first time in a non-technical role.
Those building AI systems and models for HR technology products.
Those managing AI vendors and procurement for large HR functions.
*Those applying AI to real HR work with professional accountability for outcomes.
The bank targets HR professionals applying AI to real work while remaining accountable for the outcomes, which is why it emphasises judgment and ethics; it is not pitched at first-time explorers, AI system builders, or procurement-focused vendor managers.
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

// Parse RAW into { q, options:[{t,s}], explanation }; the option line prefixed
// with "*" is correct, and the line after the 4 options is the explanation.
const ITEMS = RAW.split(/^===$/m)
  .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
  .filter((lines) => lines.length >= 5)
  .map((lines) => ({
    q: lines[0],
    options: lines.slice(1, 5).map((l) => {
      const correct = l.startsWith('*');
      return { t: correct ? l.replace(/^\*\s*/, '') : l, s: correct ? 1 : 0 };
    }),
    explanation: lines[5] || '',
  }));

export const HR_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getHrSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options), explanation: it.explanation }));
}

// The bank's named sets, in source order.
export const HR_SETS = [
  'Talent Acquisition',
  'Learning & Development',
  'People Analytics & Workforce Planning',
  'HR Compliance & Ethics',
  'HR Judgment Scenarios',
];

// A fresh session for one set: `count` questions from that set's block, options shuffled.
export function getHrSet(setIdx, count = 15) {
  const per = Math.floor(ITEMS.length / HR_SETS.length);
  const start = setIdx * per;
  return shuffle(ITEMS.slice(start, start + per)).slice(0, count)
    .map((it) => ({ q: it.q, options: shuffle(it.options), explanation: it.explanation }));
}
