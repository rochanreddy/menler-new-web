// AI for HR question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getHrSession(n) → a fresh random n-question session in the runner's format:
// { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
What is the most appropriate use of AI when screening job applications?
Have AI shortlist candidates automatically based on CV matching.
Use AI to structure and summarise applications, surface relevant experience, and flag potential concerns — with all shortlisting decisions made by a human.
Use AI to score candidates and rank them in order of suitability.
Automate rejection emails to all candidates AI scores below a threshold.
===
You want Claude to help write a job description. What produces the most effective output?
Ask Claude to write a job description for a senior marketing role.
Brief Claude on the role's specific responsibilities, must-have and good-to-have skills, team context, and the type of candidate profile you are looking for — then refine the draft.
Ask Claude to copy a job description from a competitor's listing.
Have Claude write the most comprehensive job description possible.
===
What is the most important bias risk when using AI to help screen resumes?
AI may take too long to process large volumes of resumes.
AI may reflect historical hiring biases from training data — favouring candidates from certain institutions, backgrounds, or with certain name patterns — producing discriminatory shortlists.
AI may flag too many candidates for human review.
AI resume screening is only biased for technical roles.
===
How should Claude be used to help prepare structured interview questions?
Ask Claude to write all interview questions without role context.
Brief Claude on the competencies the role requires, share the job description, and ask Claude to generate behavioural and situational questions mapped to each competency.
Use Claude to generate trick questions that test candidates under pressure.
Ask Claude to generate questions that will identify the "best" candidate objectively.
===
You receive 200 applications for a role. Which AI-assisted workflow is most appropriate?
Have AI automatically reject the bottom 150 without human review.
Use AI to categorise applications by fit across defined criteria, generate a structured summary of each candidate, and create a prioritised review list for the hiring team to work through.
Ask AI to select the top 20 candidates and proceed with those only.
Use AI to send personalised rejection emails to all applicants immediately.
===
What is the most effective use of Claude for drafting a candidate offer letter?
Ask Claude to write a standard offer letter without input.
Provide Claude with the specific role, compensation details, joining date, conditions, and any bespoke terms — get a draft — then have HR or legal review before sending.
Use Claude to generate the best possible compensation package for the candidate.
Ask Claude to copy an offer letter template from a large company.
===
What should you do if Claude suggests a screening criterion that could indirectly discriminate against a protected group?
Use the criterion if Claude generated it — AI is objective.
Reject or modify the criterion — AI can generate discriminatory criteria because its training data reflects historical patterns, not fair hiring practice. The HR professional is accountable for the fairness of all hiring criteria.
Use the criterion but apply it only to certain candidate pools.
Report the issue to the AI tool's manufacturer.
===
What is the most effective way to use Claude to personalise outreach to passive candidates?
Ask Claude to send automated messages to all passive candidates.
Brief Claude on each candidate's background, the role, and the specific reason they are a good fit — ask Claude to draft a personalised message that speaks to their profile specifically.
Ask Claude to write one generic message that can be sent to all candidates.
Passive candidate outreach should never use AI — it must be fully personal.
===
A hiring manager says they want to use AI to "clone" their best performer. What is the most important concern to raise?
Cloning the best performer is an excellent use of AI in hiring.
Hiring to replicate one profile risks creating a homogeneous team, reinforcing existing biases, and excluding diverse candidates who could perform equally well or better in different ways.
AI cannot create a profile of a specific employee.
The concern is only relevant if the best performer belongs to a minority group.
===
What is the most important consideration when using AI to help assess psychometric or skills test results?
AI assessment of test results is always more objective than human assessment.
AI can identify patterns in test results but should not make final assessment conclusions — the meaning of test results in the context of the specific role and organisational culture requires human interpretation.
Psychometric test results should never be processed by AI.
AI assessment is only appropriate for technical skills tests, not psychometric tests.
===
What is the most effective AI-assisted workflow for managing a high-volume campus recruitment drive?
Automate all campus recruitment decisions with AI.
Use AI to process applications, generate structured candidate summaries, schedule assessments, and track pipeline status — with human review for all shortlisting and offer decisions.
Use AI only for scheduling — all other steps must be manual.
Campus recruitment is too standardised to benefit from AI assistance.
===
You use Claude to help draft interview feedback documentation for rejected candidates. What is the most important constraint?
Ask Claude to write the most comprehensive feedback possible.
Ensure the feedback is specific to what was observed in the interview, accurate, and consistent with feedback given to all candidates — avoiding language that could create legal liability.
Have Claude write feedback that is encouraging to reduce disappointment.
Interview feedback documentation should always be written manually.
===
What is the most important thing to remember when using AI to help with reference check questions?
AI-generated reference questions are always more comprehensive than manual ones.
Reference check questions must be relevant to the role and consistent across candidates — AI can help generate a structured question set, but questions that could be used to gather discriminatory information must be removed.
Reference checks should be automated entirely with AI.
AI cannot help with reference check question design.
===
What metric best indicates that an AI-assisted hiring workflow is working effectively?
The number of applications processed per hour.
Quality of hire — whether the candidates selected through the AI-assisted process perform well in role and are retained — not processing speed or volume.
The reduction in time-to-hire compared to the previous process.
The percentage of applications screened by AI without human review.
===
What is the most important professional obligation for an HR professional using AI in hiring?
Using AI tools approved by the company's IT department.
Ensuring all hiring decisions are fair, legally compliant, and defensible — and that the use of AI does not introduce or amplify discriminatory patterns in who gets hired.
Documenting AI tool usage in every hiring process.
Getting AI certification before using AI for hiring decisions.
===
What is the most effective use of AI for designing a learning programme for a new employee cohort?
Ask Claude to design the entire learning programme without context.
Brief Claude on the role, skill gaps identified, learning objectives, cohort size, and available delivery formats — then use Claude's draft as a starting point to refine with L&D expertise.
Use Claude to copy a learning programme from a large company in the same industry.
AI cannot help with learning programme design.
===
You want to use Claude to create training content for a new HR policy. What is the most effective approach?
Ask Claude to write training content from scratch.
Provide Claude with the actual policy document, target audience, key behaviours the training must change, and the format required — then review the draft against the policy for accuracy.
Ask Claude to summarise the policy and send it to employees directly.
Training content should always be developed by a professional learning designer.
===
What is the most appropriate use of AI to support employee onboarding?
Have AI conduct the entire onboarding process without human contact.
Use AI to provide consistent information responses to common onboarding questions, generate personalised onboarding plans, and draft check-in schedules — with human managers leading relationship and culture integration.
AI onboarding tools replace the need for a buddy or manager during onboarding.
Onboarding is too relationship-dependent for any AI involvement.
===
A manager asks you to use AI to identify which employees are at risk of leaving. What is the most important consideration?
Use AI flight risk models immediately — they are proven to be accurate.
Assess the data being used, whether employees have consented to this analysis, the accuracy and bias risks of the model, and whether the intervention approach respects employee dignity and privacy.
Flight risk AI is only appropriate for companies with more than 1000 employees.
Flight risk prediction should only use publicly available data about employees.
===
What is the most effective use of Claude for creating employee survey questions?
Ask Claude to write a comprehensive employee engagement survey.
Brief Claude on what specific aspects of the employee experience you are trying to understand and what decisions the results will inform — then review the questions for clarity, neutrality, and coverage.
Use Claude to copy questions from a well-known employee engagement survey.
Employee survey design should never use AI.
===
You want to use Claude to help analyse employee engagement survey results. What is the most effective prompt approach?
"Analyse these survey results and tell me what they mean."
"Analyse these survey results across these specific dimensions: [list]. Identify the top three themes, the biggest gaps by department, and any questions with significantly lower scores than the overall average. Format as a structured summary."
"Summarise the survey results for management."
"Find the most important insight in this survey data."
===
What is the most important limitation of AI-generated personalised learning recommendations?
AI cannot generate personalised recommendations at scale.
AI recommendations are based on data patterns — they may not account for the individual's specific career aspirations, personal circumstances, or the nuanced capabilities their manager has observed.
Personalised learning recommendations must always be done manually.
AI recommendations are only accurate for technical skills development.
===
How should Claude be used to help design a performance improvement plan (PIP)?
Ask Claude to write a PIP for the underperforming employee.
Brief Claude on the specific performance gaps, what support has already been provided, the measurable improvement targets required, and the timeframe — use Claude's draft as a structure to refine with HR and management.
PIPs should never involve AI as they are too sensitive.
Ask Claude to recommend whether a PIP or termination is more appropriate.
===
What is the most appropriate way to use AI to help build a competency framework for your organisation?
Ask Claude to generate a competency framework based on your industry.
Use Claude to draft a framework structure based on your organisational values and role families — then validate each competency definition with senior leaders and role incumbents before finalising.
Competency frameworks cannot be developed with AI assistance.
Use Claude to copy the competency framework of a company you admire.
===
What is the most effective use of AI in creating manager capability development programmes?
Have Claude design and deliver the entire manager development programme.
Use Claude to structure the curriculum based on the management capability gaps identified, draft session materials, and generate discussion case studies — with experienced facilitators delivering and adapting the programme.
Manager development is too nuanced for AI involvement.
Use Claude to select which managers to include in the programme.
===
You are developing an AI-assisted career pathing tool for employees. What is the most important design principle?
The tool should recommend one optimal career path for each employee.
The tool should present options and relevant information to support the employee's own career decisions — not make career decisions for them.
The tool should only show career paths that the employee is fully qualified for today.
Career pathing tools should automate transfer and promotion decisions.
===
What is the most effective way to use Claude to support manager-led performance conversations?
Have Claude conduct the performance conversation with employees.
Use Claude to help managers prepare — structuring their observations, drafting talking points, anticipating employee responses, and suggesting constructive framing for difficult feedback.
Performance conversations should never involve AI preparation.
Ask Claude to generate a performance rating for each employee.
===
What is the most important ethical consideration when using AI to analyse patterns in employee productivity data?
Ensuring the AI tool is fast enough to process large data sets.
Ensuring employees are aware of what data is being collected, how it is being used, and that analysis does not cross into surveillance that undermines trust and psychological safety.
Productivity data analysis should only use anonymised data.
AI productivity analysis is only ethical for remote workers.
===
What is the most effective way to use Claude to improve new manager transition support?
Have Claude be the primary support resource for new managers.
Use Claude to create personalised onboarding guides for new managers based on their team context, draft first-90-day plans, and generate structured check-in templates for their manager and HR partner.
New manager support is too relationship-dependent for AI involvement.
Ask Claude to recommend whether each new manager is ready for leadership.
===
What is the most important principle for HR professionals using AI in L&D and employee experience?
Using AI to maximise the efficiency of all HR processes.
Ensuring AI enhances the human experience at work rather than replacing the human connection, manager relationships, and individual dignity that are the foundation of a positive employee experience.
Using AI only for administrative L&D tasks.
Measuring AI impact on L&D through training completion rates only.
===
What type of HR task is most suitable for AI automation?
Performance appraisal decisions.
Repetitive, clearly defined tasks with consistent inputs — such as drafting routine HR communications, generating payroll summaries, and maintaining compliance checklists.
All HR tasks to maximise efficiency.
Tasks that currently take the most senior HR staff time.
===
You want to use Claude to help manage high volumes of routine employee queries. What is the right design?
Automate all employee query responses without human review.
Build a Claude-assisted system that handles common, policy-based queries consistently — with clear escalation to an HR professional for complex, sensitive, or ambiguous situations.
All employee queries must be handled by HR professionals only.
Use Claude to decide whether each query needs HR attention.
===
What is the most effective way to use Claude for HR policy document maintenance?
Have Claude update all HR policies automatically when regulations change.
Use Claude to draft updated policy sections when changes are required, structure the policy document consistently, and generate a summary of changes — with HR and legal review before any policy is published.
HR policy documents should never use AI in their development.
Ask Claude to ensure your policies align with competitors' policies.
===
What is the most effective use of AI for workforce analytics and headcount planning?
Have AI produce the headcount plan without HR or business input.
Use AI to process workforce data, model scenarios based on defined assumptions, and structure the analysis — with HR and business leaders providing the strategic context and making the final headcount decisions.
Workforce analytics should be done manually for accuracy.
AI workforce analytics is only reliable for companies with over 500 employees.
===
You are using Claude to help prepare for an employment tribunal related to a dismissal case. What is the most important caution?
Claude's legal analysis can be submitted directly to the tribunal.
Use Claude to help structure your documentation and timeline, draft factual summaries, and identify gaps — but all legal strategy and submissions must be prepared or reviewed by a qualified employment lawyer.
AI assistance in employment tribunal preparation is always inappropriate.
Claude's legal knowledge of Indian employment law is current and comprehensive.
===
What is the most appropriate use of AI in processing employee exit interview data?
Have AI make conclusions about why employees are leaving.
Use AI to identify themes and patterns across multiple exit interviews — then have HR analyse those patterns in the context of organisational knowledge to draw conclusions and design retention interventions.
Exit interview data should never be processed by AI due to sensitivity.
AI exit interview analysis can replace the need for actual exit interviews.
===
You want to build a Claude-assisted workflow for monthly HR reporting to leadership. What design is most reliable?
Have Claude pull all HR data and generate the report automatically.
Define a structured data input format, store the report template in a Claude Project, have HR paste in current-month data, and build a human review checkpoint before distribution.
HR reports to leadership should always be prepared entirely manually.
Let Claude determine what metrics to include each month.
===
What is the most important data governance consideration for HR teams using AI tools?
Using the cheapest AI tool to manage HR budget constraints.
Ensuring that employee personal data processed by AI tools complies with applicable data protection law, employment contracts, and the organisation's data handling policies — especially for sensitive HR data.
HR data can be shared with any AI tool since it is used internally.
Data governance is an IT responsibility, not an HR one.
===
What is the most effective use of Claude for managing HR compliance calendar obligations?
Have Claude manage all compliance deadlines automatically.
Use Claude to map all applicable compliance obligations into a structured calendar, draft reminder communications, and generate preparation checklists — with an HR owner maintaining accountability for each obligation.
Compliance calendars should always be maintained manually.
Use Claude to determine which compliance obligations can be deprioritised.
===
You use Claude to help draft HR metrics and KPI definitions for a new people dashboard. What is the most important review step?
Check that the definitions read clearly.
Validate every metric definition with the business leaders who will use the dashboard — ensuring the metrics are meaningful to their decisions and the definitions match how data is actually collected in your systems.
Have Claude validate that the metrics align with industry benchmarks.
HR metric definitions should always be set by the finance team.
===
What is the most effective way to use AI in identifying patterns in absenteeism data?
Have AI diagnose the cause of absenteeism and recommend interventions.
Use AI to surface patterns — departments, times of year, demographic clusters — then have HR investigate with context-sensitive conversations to understand what is driving the patterns before designing interventions.
Absenteeism data should never be analysed by AI due to sensitivity.
AI can accurately predict which employees will have high future absenteeism.
===
What is the most appropriate response when an employee raises a grievance about an AI-generated HR decision?
Explain that AI decisions are objective and therefore not subject to grievance.
Treat the grievance with the same seriousness as any grievance about a human HR decision — investigate, explain the basis of the decision, and correct if it was wrong or unfair.
Direct the employee to the AI tool manufacturer.
AI HR decisions cannot be reviewed through a grievance process.
===
What is the most valuable outcome of well-implemented AI-assisted HR operations?
Eliminating the need for HR administrative staff.
Freeing HR professionals from high-volume administrative processing to invest more time in strategic people initiatives, manager capability building, and employee support.
Processing more HR transactions at lower cost.
Reducing HR headcount as a percentage of total employees.
===
You want to use Claude to help build an HR chatbot for employees. What is the most important design decision before building?
Which AI model to use as the underlying technology.
Defining precisely which queries the chatbot will handle and which will escalate to HR — because the boundary between AI handling and human handling is the most consequential design decision for employee trust and quality.
The visual design of the chatbot interface.
Whether to name the chatbot to give it a personality.
===
What is the single most important thing for HR professionals to remember when implementing AI-assisted operations?
AI efficiency gains should be reflected in HR headcount reductions.
The employment relationship is ultimately human — AI assists HR operations but the duty of care, fairness, and dignity owed to employees must always be delivered through human judgment and accountability.
AI in HR operations should be disclosed to employees in the employment contract.
HR AI implementations should be approved by employee representatives before deployment.
===
What is the most effective use of Claude to support a manager handling a team conflict?
Have Claude mediate the conflict directly through a chat interface.
Help the manager structure their understanding of the situation, prepare for the conversation with each party, and identify constructive framing — while the manager leads all actual conversations.
Ask Claude to determine who is at fault in the conflict.
Conflict resolution should never involve AI at any stage.
===
How should AI be used when developing a people strategy for your organisation?
Ask Claude to write the people strategy without organisational input.
Use Claude to research people strategy frameworks, structure the strategy document, and draft specific sections — with HR leadership and senior management providing the strategic direction and priorities.
People strategy is too sensitive for AI involvement.
Ask Claude to copy the people strategy of a company you admire.
===
You are designing an AI policy for your organisation on employees' use of AI tools at work. What is the most important element to include?
A list of approved AI tools employees can use.
Clear guidance on data handling — what company, client, or employee data can and cannot be inputted into AI tools — and the accountability framework for AI-assisted outputs.
A prohibition on all AI tool use until further notice.
A requirement that all AI outputs are disclosed to managers.
===
What is the most effective way to use Claude to help with restructuring communications to affected employees?
Have Claude write all restructuring communications and distribute them.
Draft your key messages and the essential information employees need first — then use Claude to refine the language, check the tone, and ensure the communication is clear and respectful.
Restructuring communications should never use AI due to sensitivity.
Ask Claude to predict how employees will react to the restructuring.
===
What is the most appropriate use of AI in supporting employee mental health and wellbeing programmes?
Have AI provide mental health counselling to employees.
Use AI to provide information about available resources, help design programme content, analyse engagement data, and handle administrative programme aspects — while all direct mental health support is delivered by qualified professionals.
Mental health and wellbeing are too sensitive for any AI involvement.
Use AI to identify which employees are experiencing mental health challenges.
===
A manager asks you to use AI to monitor employee sentiment in internal communications. What is the most important concern to raise?
The AI may not be accurate enough for sentiment analysis.
Monitoring employee communications — even for wellbeing purposes — without employees' knowledge and explicit consent raises serious privacy, trust, and legal concerns that could fundamentally damage the employment relationship.
Sentiment monitoring is only appropriate for customer-facing employees.
The concern is only relevant if the monitoring identifies negative sentiment.
===
What is the most effective use of Claude when developing an employer value proposition (EVP)?
Ask Claude to write an EVP for your company.
Brief Claude on your company culture, what employees value about working there based on survey data, what you offer that competitors do not, and your target candidate profile — then iterate on the EVP language.
Use Claude to copy the EVP of the most admired employer in your sector.
EVPs should be written entirely by marketing, not HR.
===
What is the most appropriate AI-assisted approach to diversity, equity, and inclusion (DEI) reporting?
Have AI generate DEI insights without specifying what data to use.
Define the specific DEI metrics to measure, use AI to process the data and structure the report, and have HR and leadership review the findings with appropriate contextual sensitivity before sharing.
DEI data should never be processed by AI.
AI will automatically identify the most important DEI issues to address.
===
You are building an AI-assisted performance management system. What is the most important safeguard to include?
Ensuring the system calculates performance scores automatically.
Ensuring every performance conclusion is reviewed and confirmed by the employee's direct manager before it influences any employment decision — with an employee appeal mechanism available.
Using the most advanced AI model for performance assessment accuracy.
Ensuring the system tracks as many employee data points as possible.
===
What is the most effective use of Claude for drafting a response to an employee collective representation request?
Ask Claude to write the response without HR or legal input.
Brief Claude on the request, your organisation's position, and the applicable legal framework — use Claude to draft a structured response — then review with legal counsel before sending.
Employee representation matters should never involve AI assistance.
Ask Claude to advise on the legal merits of the representation request.
===
What is the most important consideration when using AI to help set pay and compensation structures?
AI compensation benchmarking is always more accurate than manual benchmarking.
AI can help process market data and structure compensation frameworks efficiently, but pay decisions must reflect organisational values, internal equity, and be free from algorithmic bias that could perpetuate pay gaps.
Compensation decisions should never involve AI due to sensitivity.
AI pay recommendations can be implemented directly without review.
===
What is the most effective use of AI to support HR business partnering?
Have AI replace the HRBP for routine business meetings.
Use AI to prepare HRBPs with data insights before business meetings, draft reports and proposals, and handle administrative tasks — freeing HRBP time for strategic relationship building and business partnership.
HRBPs should only use AI for data analysis, not for any communication tasks.
AI cannot contribute meaningfully to strategic HR business partnering.
===
What is the most important principle when using AI to analyse data about protected characteristics in the workforce?
AI analysis of protected characteristic data is always inappropriate.
Analysis must have a specific, legitimate HR purpose — such as identifying pay equity gaps or assessing representation — with appropriate data governance, minimisation of individual identification risk, and sensitivity in how findings are communicated.
Protected characteristic analysis requires only anonymised aggregate data.
Only the most senior HR leadership should see AI analysis of protected characteristic data.
===
An organisation wants to use AI to predict high-potential employees for succession planning. What is the most important design constraint?
The AI should identify high-potentials based on performance data alone.
The AI should surface candidates for human consideration, not make succession decisions — and the criteria must be validated for bias before use, since historical high-potential identification often reflects demographic patterns more than actual potential.
AI succession planning tools are only appropriate for senior leadership roles.
Succession planning should never use AI because it is too subjective.
===
What is the most important thing HR professionals must remember when using AI to support people strategy and employee relations?
AI efficiency gains justify reducing investment in human HR capability.
Every employee is a whole person — AI supports HR processes but cannot replace the human care, fairness, and professional judgment that employees deserve in every interaction that affects their working lives.
AI people strategy tools are only effective in large organisations.
Employee relations matters should always be kept separate from any AI involvement.
===
What is the most important principle governing AI use in HR?
Using AI for all HR tasks to remain competitive.
The employment relationship and all consequential decisions about employees' working lives require human judgment and accountability — AI assists but does not determine.
AI use in HR should be disclosed to all employees at all times.
AI is only appropriate for non-sensitive HR administrative tasks.
===
What is the most significant risk of using AI for high-stakes HR decisions without adequate oversight?
The decisions will be made too quickly.
AI may embed and amplify historical biases — producing systematically unfair outcomes for certain groups — without any human catching the pattern because the outputs look analytically objective.
Employees will become suspicious of AI involvement.
The AI tool may become unavailable and disrupt the process.
===
An HR professional says: "AI HR decisions are fairer because they are not influenced by human emotion or prejudice." What is the most accurate response?
They are correct — AI removes subjective bias from HR decisions.
AI reflects the patterns in its training data — which includes historical HR decisions that may have been biased. AI bias can be less visible and harder to challenge than human bias, making it potentially more dangerous.
They are partially correct — AI removes emotion but not prejudice.
They are correct for structured decisions like CV screening but not for interviews.
===
What is the most important thing to verify before implementing an AI tool for a core HR function?
That the AI tool has good reviews from other HR teams.
That the AI tool's outputs have been tested for accuracy and differential impact across relevant demographic groups relevant to your workforce — not just overall accuracy.
That the AI tool integrates with your existing HRIS system.
That the AI tool provider has signed an ethical AI pledge.
===
What does informed consent mean in the context of HR AI applications?
Informing the IT department before deploying AI tools.
Ensuring employees understand what AI tools are being used to process their data, for what purpose, and how AI-generated outputs may influence decisions that affect them.
Getting employees to sign a consent form before any AI tool is used.
Consent is only required for AI tools that process health data.
===
What is the most appropriate attitude toward fully automating HR decisions with AI?
Full automation should be the goal — humans introduce bias and inconsistency.
Full automation of consequential HR decisions is inappropriate — human judgment, accountability, and the ability to consider context that falls outside the AI's training are essential for fair employment practice.
Full automation is acceptable if the AI tool is certified by a recognised body.
Full automation decisions should be left to the CEO, not HR.
===
You discover that an AI tool your organisation has been using for CV screening has been systematically disadvantaging applicants from certain educational institutions. What is the professional response?
Continue using the tool since the bias may balance out over time.
Suspend the tool immediately, assess the scope of impact, notify affected candidates where possible, implement a remediation process, and conduct a root cause investigation before considering whether to redeploy.
Adjust the tool's settings to reduce the bias without suspending it.
Notify the AI tool manufacturer and wait for them to issue a fix.
===
What is the most effective way for HR professionals to maintain professional judgment in an AI-augmented role?
Use AI for all tasks and rely on it to catch its own errors.
Deliberately maintain and develop the professional expertise that AI assists — continuing to understand employment law, develop employee relations skills, and apply contextual judgment — rather than delegating professional development to AI.
Only use AI for tasks where professional judgment is not required.
Ask AI to identify which of your professional skills are still needed.
===
A job applicant who was rejected after AI-assisted screening asks to understand the basis of the decision. What is the most appropriate response?
Explain that AI made the decision and no further information is available.
Provide a meaningful explanation of the criteria used and how the applicant was assessed — even where AI assisted in the process, the organisation must be able to explain and stand behind every employment decision.
Only provide feedback if the applicant threatens legal action.
Refer the applicant to the AI tool manufacturer.
===
What is "algorithmic accountability" in HR and why does it matter?
The AI tool's technical documentation of how its algorithm works.
The principle that organisations using AI in HR are accountable for the outcomes that AI produces — including discriminatory patterns, privacy violations, and employment decisions — regardless of whether those outcomes were intended.
Algorithmic accountability only applies to automated decision-making, not AI-assisted decisions.
Accountability for AI HR outcomes belongs to the AI tool manufacturer.
===
What is the most important metric for evaluating the success of AI in HR?
The cost reduction achieved through AI implementation.
Whether AI-assisted HR processes produce fair, accurate outcomes that support employee wellbeing and organisational effectiveness — not just efficiency or cost metrics alone.
The number of HR processes automated.
Employee satisfaction with AI-assisted HR tools.
===
What professional responsibility do HR leaders have for AI implementations in their organisations?
Approving AI tool purchases and monitoring licence costs.
Ensuring AI tools used in HR are fit for purpose, tested for fairness, governed appropriately, and monitored continuously — and taking accountability for the employment outcomes they produce.
Delegating AI implementation responsibility entirely to IT.
Signing off on AI implementations and then monitoring only if problems arise.
===
What is the most important thing to communicate to employees about how AI is used in HR processes that affect them?
That AI is used to improve efficiency and reduce costs.
What data is processed, for what purpose, what decisions AI may influence, what human oversight exists, and how employees can seek review or raise concerns about AI-influenced decisions that affect them.
That AI makes all HR processes more objective and fair.
That AI use in HR has been approved by senior management.
===
What distinguishes an HR professional who uses AI responsibly from one who creates risk?
The responsible HR professional uses more advanced AI tools.
The responsible HR professional maintains human judgment and accountability for all employment decisions, actively monitors AI for fairness, and prioritises employee dignity over process efficiency.
The responsible HR professional uses AI only for administrative tasks.
The responsible HR professional documents all AI usage for audit purposes.
===
As an HR professional, what is the most important commitment to make when adopting AI tools?
Adopting AI tools as quickly as possible to remain competitive.
Committing to fair, dignified, and accountable employment practice in every AI-assisted HR process — ensuring AI enhances rather than compromises the employment relationship.
Committing to full automation of HR processes within a defined timeline.
Committing to transparency with employees about which AI tools are used.
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

export const HR_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getHrSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
