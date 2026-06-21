// AI for Finance question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getFinanceSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You are building a monthly P&L commentary with Claude. What is the most important constraint to include in your prompt?
Ask Claude to write a comprehensive analysis of all trends.
Instruct Claude to base commentary only on the data you provide and flag any anomaly for human review rather than explaining it away.
Ask Claude to write clearly and professionally.
Tell Claude to make the commentary suitable for all audiences.
===
Claude gives you a confident revenue forecast figure. What should you do before presenting it to stakeholders?
Include it — Claude's forecasts are based on sound statistical patterns.
Verify the assumptions behind the figure, check the methodology, and validate against your own financial model.
Round the number and present it as an estimate.
Ask Claude the same question again to confirm consistency.
===
What is the most appropriate use of Claude for building a financial model?
Ask Claude to build the entire model from scratch.
Use Claude to help structure the model logic, suggest relevant line items, and draft formula approaches — then build and validate the model yourself.
Trust Claude's model completely since it has studied many financial models.
Only use Claude for formatting the model after you have built it.
===
You need to explain variance analysis results to a non-finance business head. What is the most effective AI-assisted approach?
Have Claude rewrite the full technical analysis in simple terms.
Brief Claude on the specific variance, what caused it in business terms, and who the audience is — then refine Claude's plain-language draft with your domain knowledge.
Ask Claude to simplify everything and send it directly.
Avoid AI for audience-specific financial communication.
===
What is the most important check after using Claude to generate a financial summary from raw data?
Check that the summary reads fluently.
Verify every key figure in the summary against the source data — AI can misread, transpose, or fabricate numbers even in straightforward summarisation tasks.
Ask Claude to double-check its own summary.
Check that the summary format matches your template.
===
Which task is most appropriate for AI assistance in an FP&A workflow without significant risk?
Determining the cause of a revenue decline.
Structuring and formatting a budget template with standard line items and formulas explained in plain language.
Predicting next quarter's revenue from current trends.
Identifying which business units to prioritise for investment.
===
What is the most effective prompt for getting Claude to help with scenario modelling?
"Model different scenarios for our business."
"Build three revenue scenarios — base, upside, and downside — for the next 12 months. Base assumes 15% YoY growth. Upside assumes 25%. Downside assumes flat. Show the key driver assumptions for each scenario in a table."
"What will our revenue be next year?"
"Help me think about different outcomes for the business."
===
A stakeholder asks you to use AI to produce a revenue forecast that "shows growth." What is the professional response?
Use AI to find the assumptions that produce the growth they want.
Explain that forecasts must reflect the most defensible view of the future based on available evidence — not a desired outcome — and offer to show what assumptions would be required to achieve that growth.
Build the forecast they want and add disclaimers.
Refuse to use AI for any forecast that involves stakeholder preferences.
===
What is the most effective use of Claude for monthly management reporting?
Have Claude generate and send reports automatically without review.
Use Claude to draft the standardised sections from structured data inputs, with a human review checkpoint for contextual commentary, anomaly flagging, and executive-facing conclusions.
Use Claude only to format tables — write all commentary manually.
Monthly management reports are too sensitive for any AI involvement.
===
You use Claude to help build a three-year business plan. What is the most important caveat to include in the document?
That the plan was AI-generated.
That the plan is based on specified assumptions about market conditions and growth drivers — and that changes in those assumptions will materially change the plan output.
That the plan may not be 100% accurate.
That AI assistance was used in building the model.
===
What is false precision in financial reporting and how does AI assistance increase its risk?
When a report uses too many decimal places.
When specific figures are presented as certain when they are estimates — a risk with AI because AI produces precise-sounding numbers with the same confidence as actual data.
When AI-generated metrics use overly complex formulas.
When dashboards display more metrics than necessary.
===
What is the most effective way to use Claude to prepare for a budget review with senior leadership?
Ask Claude to predict what questions leadership will ask.
Share your budget with Claude and ask it to raise the hardest challenges a sceptical CFO would make — then prepare substantive responses to each.
Ask Claude to confirm your budget is sound.
Use Claude to simplify your budget to avoid difficult questions.
===
A business unit head disagrees with the financial analysis you produced with AI assistance. What is the most professional response?
Defend the AI-generated analysis as objective.
Investigate the disagreement — it may reveal a data quality issue, a definition mismatch, a missing business context, or a genuine analytical concern worth understanding.
Defer to the business unit head since they know their business better.
Re-run the analysis with a different AI tool for a second opinion.
===
What distinguishes an FP&A professional who uses AI effectively from one who produces unreliable AI-assisted work?
The effective professional uses more advanced AI tools.
The effective professional maintains analytical judgment throughout — questioning AI outputs, verifying key figures, connecting results to business context, and taking accountability for conclusions.
The effective professional uses AI only for the most complex tasks.
The effective professional has more technical training in AI tools.
===
What is the most important professional standard that remains constant regardless of how AI tools evolve for finance work?
Staying current with the latest AI tools and techniques.
Maintaining full accountability for financial outputs — ensuring figures are accurate, assumptions are disclosed, limitations are stated, and conclusions are defensible — regardless of how much AI assistance was used.
Using AI assistance only for lower-risk, non-critical financial tasks.
Documenting AI tool usage in every financial report.
===
What is the safest way to use Claude to help draft notes to financial statements?
Ask Claude to write the notes from memory of accounting standards.
Provide Claude with the relevant accounting policy, the actual figures, and specific disclosure requirements — then review the draft against the applicable standard before using it.
Trust Claude's notes since it has been trained on accounting standards.
Use Claude only to format pre-written notes.
===
You need to produce a Board report summarising financial performance. Which prompt produces the most useful result?
"Write a Board report on our financial performance."
"Write a Board-level financial summary for Q3. Key metrics: revenue 45Cr (up 18% YoY), EBITDA margin 22% (up 3pts), cash 12Cr. Highlight the margin improvement driver and flag the receivables increase. Audience: non-executive directors. Tone: concise, factual, no jargon. Under 300 words."
"Summarise our Q3 financials for the Board."
"Write a detailed analysis of Q3 financial performance."
===
Claude drafts an MIS report with a figure that looks inconsistent with your data. What should you do?
Trust Claude — it may have identified a data pattern you missed.
Trace the figure to its source immediately — do not include any unverified figure in a report regardless of how plausible it looks.
Mention the inconsistency in a footnote and proceed.
Ask Claude to explain where the figure came from.
===
What is the most appropriate way to use Claude for GST or tax-related documentation drafting?
Ask Claude to draft all tax documentation independently.
Use Claude to structure documentation and draft standard sections — then have every tax document reviewed by a qualified CA or tax professional before filing or submission.
Claude's tax knowledge is current enough for standard GST compliance work.
Avoid AI entirely for any tax-related documentation.
===
You want Claude to help write investor-facing financial commentary. What is the most important instruction to include?
"Write clearly and professionally."
"Do not include forward-looking statements, unsubstantiated projections, or claims not directly supported by the figures I provide. Flag any language that could be interpreted as a financial commitment."
"Make the commentary optimistic and highlight positive trends."
"Write for a sophisticated investor audience."
===
What is the most effective use of AI when preparing audit-ready documentation?
Have Claude generate all audit documentation automatically.
Use Claude to structure documentation, draft standard explanations, and organise supporting schedules — with human review ensuring every figure is traceable and every claim is substantiated.
Audit documentation must be entirely manually prepared.
Use Claude to predict what auditors will focus on.
===
You are preparing a credit information memorandum for a bank loan. What is Claude most useful for in this process?
Writing the entire memorandum without founder input.
Structuring the document, drafting standard sections, and helping articulate business strengths clearly — while all financial claims, projections, and representations are verified and owned by management.
Predicting the likelihood of loan approval based on the financials.
Generating the financial projections that banks typically want to see.
===
Which of the following is the most appropriate use of AI in preparing financial projections for an investor?
Have Claude build financial projections using industry benchmarks.
Build the projections yourself based on your business knowledge and assumptions — then use Claude to help format, present, and explain the assumptions clearly.
Use Claude to find the most optimistic reasonable assumptions.
Ask Claude which projection methodology investors prefer.
===
What is the most important professional obligation when sharing AI-assisted financial analysis with external stakeholders?
Disclosing the AI tool used in the analysis.
Ensuring all claims, figures, and conclusions have been verified for accuracy — and taking full professional accountability for the content regardless of AI assistance.
Obtaining written consent from stakeholders to use AI tools.
External stakeholders do not need to know about AI assistance.
===
What is the most effective way to use Claude to help maintain a financial reporting calendar?
Ask Claude to manage all deadlines automatically.
Use Claude to draft the calendar structure, list all regulatory and management reporting deadlines, and generate reminder templates — with a human owner maintaining the actual schedule.
Financial reporting calendars should be maintained manually only.
Ask Claude to set automatic reminders for all reporting deadlines.
===
You are asked to produce a financial analysis comparing two potential acquisition targets. What does Claude help with most?
Recommending which target to acquire.
Structuring the comparison framework, standardising the financial metrics for comparability, and drafting the narrative that explains what the numbers show.
Accessing the targets' financial data independently.
Predicting the post-acquisition financial performance of each target.
===
What is the most effective way to use Claude for drafting a finance SOP (Standard Operating Procedure)?
Ask Claude to write the SOP from scratch based on best practices.
Walk Claude through your actual process step by step, ask Claude to structure it as a written SOP — then review for accuracy and add any exceptions or approvals the written version missed.
SOPs should always be written manually to ensure accuracy.
Ask Claude to copy a finance SOP template from industry standards.
===
A team member uses Claude to produce a cash flow statement that has an error in the financing activities section. Who is professionally accountable?
The team member who used Claude for the task.
The team member who produced the output — AI assistance does not transfer professional accountability for financial statements.
The AI tool manufacturer whose model made the error.
Accountability is shared between the team member and the AI tool.
===
What is the most important habit for a finance professional using AI for document production?
Using AI for every document to maximise consistency.
Verifying every figure, tracing every claim to its source, and reviewing every AI-generated document against the applicable professional standard before use.
Using AI only for non-critical documents.
Documenting AI usage in every finance document.
===
What is the most significant risk of over-relying on AI for financial documentation over time?
The AI tools will become too expensive.
The finance professional may gradually lose the ability to independently verify what AI produces — making errors harder to catch as familiarity with underlying standards and methods fades.
Documentation quality will improve beyond what the team can maintain.
Auditors will reject AI-assisted documentation.
===
What is the most appropriate use of AI in identifying financial risks for your company?
Ask Claude to produce a complete risk register automatically.
Use Claude to help structure the risk framework and generate a comprehensive starting list of risk categories — then have finance and business domain experts validate, prioritise, and enrich each risk with specific company context.
Trust Claude's risk assessment without additional expert review.
AI is not appropriate for financial risk identification.
===
You are using AI to help monitor compliance deadlines. What is the most important design element?
Automate all compliance reminders without human oversight.
Build human review into the system — compliance failures have legal consequences and cannot be managed by automation alone, regardless of how reliable the AI tool appears.
Only use AI for lower-priority compliance deadlines.
Use AI to predict which compliance deadlines can safely be delayed.
===
A finance team uses Claude to draft internal financial controls documentation. What is the most critical review requirement?
Check that the document is clearly written.
Verify that every control described accurately reflects how the control actually operates in your organisation — not a generic best-practice description that does not match reality.
Check that the document format follows industry standards.
Have Claude review its own documentation for accuracy.
===
What is the most important limitation of using AI to help identify fraud risk indicators?
AI cannot process financial data.
AI identifies patterns that have historically been associated with fraud but cannot detect novel fraud schemes that do not match training patterns — and may also flag legitimate transactions as suspicious.
AI fraud detection is too slow for real-time monitoring.
AI fraud tools are only accurate for large enterprises.
===
You are preparing for a regulatory inspection and use Claude to help review your compliance documentation. What is the most appropriate use?
Ask Claude to confirm your compliance documentation is complete and accurate.
Use Claude to help structure the review, identify gaps in coverage, and draft missing sections — then have qualified compliance professionals verify every document against current regulatory requirements.
Trust Claude's compliance review as equivalent to a professional compliance audit.
Avoid using AI for any regulatory inspection preparation.
===
What is the most effective prompt for using Claude to help prepare a risk assessment for a new business initiative?
"Assess the risks of this initiative."
"Assess the financial, operational, regulatory, and reputational risks of this initiative. For each risk: describe the specific exposure, estimate likelihood and impact (High/Medium/Low), and suggest a mitigation approach. Context: [describe initiative]."
"What could go wrong with this initiative?"
"List all risks associated with this type of business activity."
===
What is the most important consideration when using AI to help draft anti-money laundering (AML) policies?
AML policies can be drafted by AI without additional review.
AML policies must comply with current RBI guidelines and sector-specific requirements — AI drafts must be reviewed by qualified compliance professionals familiar with Indian AML regulations.
AI-drafted AML policies are sufficient for smaller financial institutions.
Only use AI to format AML policies after they have been professionally drafted.
===
You discover that AI-generated financial risk documentation your team has been using contains an error that understated a key risk. What is the correct professional response?
Quietly correct the error in the next update.
Disclose the error to relevant stakeholders immediately, assess the impact on decisions made using the documentation, correct the documentation, and implement improved verification processes.
Wait to see if the understated risk materialises before raising the concern.
The AI tool manufacturer is responsible and should be notified first.
===
What is the most effective way to use Claude for KYC (Know Your Customer) documentation processes?
Automate all KYC documentation without human review.
Use Claude to help structure documentation requirements, draft standard KYC forms and checklists, and process documentation systematically — with human review for all final customer acceptance decisions.
KYC documentation is too regulated for any AI involvement.
Use Claude to determine whether a customer passes KYC requirements.
===
What does "regulatory technology" (RegTech) mean and why should finance professionals understand it?
Technology used by regulators to audit companies.
AI and technology solutions specifically designed to help financial institutions meet regulatory requirements more efficiently — understanding it helps finance professionals evaluate and deploy appropriate compliance tools.
RegTech is only relevant for large banks and financial institutions.
RegTech refers to the technology infrastructure used by stock exchanges.
===
What is the most appropriate role for AI in the internal audit process?
Replacing internal auditors for routine audit tasks.
Helping auditors analyse large datasets for anomalies, structure audit documentation, and draft working papers — while all audit conclusions and professional judgments remain with qualified auditors.
AI internal audit outputs are sufficient for smaller organisations.
Internal audit is too sensitive for any AI involvement.
===
What is the most important data handling consideration when using AI tools for financial risk work?
Use the fastest AI tool available to process data quickly.
Ensure financial data shared with AI tools complies with your data classification policy, contractual obligations, and applicable data protection requirements — especially for customer financial data.
Financial risk data can be shared with any AI tool since it is internally generated.
Data handling is an IT concern, not a finance professional's responsibility.
===
What is the most effective way to use Claude to help build a conflict of interest policy?
Ask Claude to write a complete conflict of interest policy for your company.
Brief Claude on your industry, company size, and specific scenarios of concern — get a structured draft — then review with legal and senior management to ensure it reflects your actual governance requirements.
Conflict of interest policies should be copied from industry templates.
These policies require a specialist law firm and cannot involve AI.
===
Which statement best describes the appropriate level of AI involvement in financial compliance decisions?
AI should make all routine compliance decisions to free up professional time.
AI identifies, structures, and documents compliance information — the compliance decision itself requires professional judgment, appropriate authorisation, and human accountability.
AI compliance decisions are acceptable if reviewed annually.
AI involvement in compliance decisions depends on the regulatory environment.
===
What is the most important habit for a finance professional managing compliance with AI assistance?
Using AI to automate as many compliance tasks as possible.
Maintaining independent professional knowledge of applicable regulations — so you can evaluate AI-generated compliance content critically rather than accepting it without the ability to assess its accuracy.
Documenting AI usage in every compliance document.
Using AI only for compliance documentation, not compliance decisions.
===
What type of finance task is most suitable for AI-assisted automation?
Complex judgmental tasks requiring financial expertise.
Repetitive, clearly defined tasks with consistent inputs and verifiable outputs — such as invoice categorisation, payment reconciliation, and standard report generation.
Any finance task to maximise efficiency.
Tasks that currently involve the most senior finance staff.
===
You want to automate accounts payable invoice processing with AI. What is the most important design element?
Automate all invoice approvals to eliminate processing delays.
Build human review checkpoints for exceptions — invoices above a threshold, unusual vendors, or amounts that do not match purchase orders — while automating routing for standard, matched invoices.
Use AI to approve all invoices under 10,000 without review.
Automate everything and review only when a payment fails.
===
What is the most effective AI-assisted workflow for bank reconciliation?
Ask Claude to perform the bank reconciliation directly.
Use AI to match and categorise transactions, flag unreconciled items for human review, and structure the reconciliation report — with a finance professional reviewing all exceptions and signing off on the final reconciliation.
Bank reconciliation is too sensitive for any AI involvement.
Use AI to identify which unreconciled items can be written off.
===
What is the most important check before deploying an AI-assisted financial automation into production?
Confirm the AI tool has good user reviews.
Test the automation on a representative sample of real transactions — including edge cases and exceptions — and verify outputs against manual results before going live.
Confirm the automation runs without error messages.
Have the AI tool developer certify the automation is accurate.
===
You use Claude to help generate Excel formulas for financial calculations. What should you always do before using the formula in a live model?
Trust the formula — Claude's Excel knowledge is reliable.
Test the formula on a small set of known inputs and verify the output matches expected results before applying it to the full model.
Ask Claude to verify its own formula before you use it.
Check that the formula has no syntax errors.
===
What is the most appropriate use of AI for expense management processes?
Have AI approve all expense claims automatically.
Use AI to categorise expenses, flag policy exceptions, and generate summary reports — with human approval for all reimbursements and exception handling.
AI expense management removes the need for an expense policy.
Use AI only to remind employees to submit expenses on time.
===
You are building a Claude workflow to automate monthly cost centre reporting. What design produces the most reliable output?
Ask Claude to pull data from all systems and build the report automatically.
Define a structured data input format, store the report template and metric definitions in a Claude Project, and have a human paste in current-month data for Claude to process into the standard report format.
Automate the entire process including data extraction and distribution.
Build a different report format each month based on what Claude suggests.
===
What is the most important consideration when using AI to assist with payroll-related calculations?
Speed — payroll calculations should be automated for efficiency.
Every payroll calculation must be verified against applicable rules — statutory deductions, tax slabs, PF/ESI contributions — before processing, since payroll errors directly affect employees and carry legal liability.
AI payroll calculations are reliable for companies under 50 employees.
Use AI to calculate payroll and have an accountant sign off quarterly.
===
A finance team has been using an AI automation for 6 months and stops reviewing outputs because "it always works." What is the primary risk?
The AI tool will become more expensive over time.
Errors that develop due to changes in data formats, business rules, or edge cases accumulate undetected — and may be harder to correct when eventually discovered.
The team will forget how to do the task manually.
The AI tool may be discontinued without notice.
===
What is the most effective way to use Claude to help improve an existing manual finance process?
Ask Claude to automate the process immediately.
Document the current process in detail for Claude, ask Claude to identify the highest-friction, most repetitive steps, and evaluate which of those are suitable for AI assistance based on clarity and verifiability.
Ask Claude to redesign the process from scratch using best practices.
Use Claude to time how long each manual process step takes.
===
What distinguishes a well-designed finance AI workflow from a poorly designed one?
A well-designed workflow uses more AI tools.
A well-designed workflow has defined quality standards, clear human review checkpoints, documented exception handling, and monitoring for output quality over time.
A well-designed workflow requires no human involvement.
A well-designed workflow processes more transactions per hour.
===
What is the most important thing to document when handing over an AI-assisted finance workflow to another team member?
The AI tool subscription details and login credentials.
The workflow's purpose, the inputs it requires, the expected outputs, known failure modes, and the verification steps required before outputs can be used.
The date the workflow was created and who built it.
The cost of the AI tool per month.
===
You are evaluating an AI vendor claiming their tool automates 90% of your accounts receivable process. What is the most important due diligence question?
What is the price and implementation timeline?
What specific tasks constitute that 90%, what error rate is documented on those tasks, and what human oversight is required for the remaining 10% and for exceptions?
Which companies are already using the tool?
Does the tool integrate with our existing ERP system?
===
What is the most appropriate attitude toward fully automating finance processes with AI?
Full automation should be the goal — humans introduce errors.
Full automation is appropriate only for well-tested, low-risk, clearly defined tasks with reliable quality monitoring — high-stakes, variable, or judgmental tasks require human involvement regardless of AI capability.
Full automation is never appropriate in finance.
Full automation decisions should be left to IT, not finance teams.
===
What is the most valuable outcome of a well-implemented AI-assisted finance operations workflow?
Eliminating the need for finance staff.
Freeing finance professionals from high-volume, routine processing to focus on analysis, judgment, and strategic partnership with the business.
Processing more transactions at lower cost.
Reducing the finance team's dependence on IT support.
===
What is the most important principle governing AI use in professional finance work?
Use AI for all tasks to remain competitive.
Professional accountability for financial outputs remains entirely with the finance professional — AI is a tool that assists, not a party that shares accountability.
AI use should be disclosed in all financial reports.
AI is only appropriate when approved by the CFO.
===
What does analytical independence mean for a finance professional using AI?
Working independently without asking colleagues for help.
Maintaining professional judgment that is independent of desired outcomes — evaluating AI outputs on their merits, not because they support a preferred conclusion.
Using AI tools that are not connected to the internet.
Completing AI-assisted analysis without management input.
===
A senior manager asks you to use AI to produce analysis that "supports our investment case." What is the professional response?
Produce the analysis they requested — the manager is responsible for the business case.
Explain that the professional obligation is to produce analysis that honestly represents what the data shows — offer to produce a rigorous analysis and present what it actually finds.
Produce the analysis but add appropriate disclaimers.
Decline to use AI for any analysis tied to an investment decision.
===
What is the most significant long-term risk of over-relying on AI for finance professional judgment?
Becoming dependent on one AI vendor.
Gradual atrophy of the professional judgment, technical knowledge, and critical thinking skills that AI assistance is designed to augment — not replace.
Increased cyber security risk from AI tool vulnerabilities.
Regulatory non-compliance if AI tools change their policies.
===
You discover that a widely-used AI-assisted analysis at your company has a systematic error that has influenced several financial decisions. What should you do?
Quietly correct the error in the next update.
Disclose the error to relevant stakeholders immediately, assess its impact on decisions made, correct the analysis, and improve verification processes to prevent recurrence.
Wait to see if the decisions influenced by the error produce bad outcomes.
Notify the AI tool manufacturer first.
===
What is the most important ethical obligation when using AI to analyse financial data about customers or counterparties?
Ensuring the AI tool has been approved for data processing by IT.
Ensuring the analysis is used only for its stated purpose and that individuals' financial data is protected throughout — not used for purposes beyond what was consented to or legally permitted.
Only using anonymised data for any AI financial analysis.
Informing each individual whose data is being analysed.
===
What does "calibrated uncertainty" mean in AI-assisted financial forecasting?
Setting AI temperature to reduce output variability.
Communicating the genuine uncertainty in a forecast — the range of outcomes, the key assumptions that drive the result, and the scenarios under which the forecast would be materially different.
Using multiple AI tools to generate a range of forecasts.
Rounding forecast figures to reduce the appearance of false precision.
===
What is "model risk" and why does it increase when AI is used in financial modelling?
The risk that a financial model will be rejected by management.
The risk that a model produces incorrect outputs that are used for financial decisions — which increases with AI because model logic may be less transparent, harder to audit, and errors may be less visible than in traditional spreadsheet models.
Model risk is a concept only relevant to large financial institutions.
AI reduces model risk by eliminating human formula errors.
===
What is the most appropriate way to handle a situation where Claude provides a financial analysis that contradicts your professional judgment?
Trust Claude — it may have identified something you missed.
Investigate the specific point of disagreement — whether it reflects a data issue, an assumption you disagree with, or a genuine analytical insight — and form your own professional conclusion based on your investigation.
Trust your judgment over Claude's analysis in all cases.
Present both Claude's analysis and your own judgment to management.
===
What is the most important thing a finance professional can do to ensure AI assists rather than undermines professional standards?
Limit AI use to lower-risk finance tasks only.
Apply the same professional standards to AI-assisted work as to manually produced work — the same verification requirements, the same disclosure obligations, and the same accountability.
Get specific AI training certification from a recognised body.
Only use AI when explicitly permitted by your professional body.
===
What is the most important skill for a finance professional in an AI-augmented role?
Proficiency in as many AI tools as possible.
The ability to critically evaluate AI-generated financial content — identifying errors, questioning assumptions, and assessing whether outputs meet the professional standard required for their intended use.
Speed of processing — being able to use AI tools faster than colleagues.
Knowledge of the technical architecture of AI models.
===
What is the most honest framing of AI's role in the future of finance?
AI will replace finance professionals who do not specialise in AI.
AI will transform the task mix of finance roles — automating routine processing and accelerating analysis — while professional judgment, stakeholder relationships, and accountability remain distinctively human.
AI will make most finance roles redundant within five years.
AI will be limited to large finance teams and will not affect smaller organisations.
===
A junior finance analyst submits AI-generated analysis without review. What is the most important feedback to give?
Encourage them to use AI more efficiently.
Explain that professional accountability for finance outputs requires personal verification — the analyst is accountable for every figure and conclusion they submit, regardless of how it was produced.
Ban AI use until they demonstrate manual proficiency.
Ask them to disclose AI use in future submissions.
===
What is the most valuable way to think about AI as a finance professional?
As a replacement for tasks you find tedious.
As a tool that amplifies your professional expertise — making your analysis faster, more comprehensive, and better communicated — while your judgment, knowledge, and accountability are what make the output professionally valuable.
As an authority on financial standards and regulations.
As a check on your own work that reduces the need for peer review.
===
As a finance professional, what is the single most important thing you must be able to do with every AI-assisted output before it leaves your desk?
Confirm it was produced by an approved AI tool.
Personally verify that the key figures are accurate, the assumptions are disclosed, and the conclusions are professionally defensible — and be prepared to explain every element if challenged.
Confirm the output format matches the required template.
Attach a note indicating AI assistance was used in production.
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

export const FINANCE_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getFinanceSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
