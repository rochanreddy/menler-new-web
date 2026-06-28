// AI for Finance — AI Aptitude question bank: 75 questions (5 sets × 15).
// Sets: Financial Data Thinking · AI-Assisted Analysis & Modelling · Risk,
// Compliance & Verification · Financial Communication & Reporting · Judgment Scenarios.
//
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getFinanceSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
Before using AI to analyse financial data, the most important step is:
Clean and standardise all data fields for AI processing.
*Define the specific financial question the analysis must answer.
Identify which AI tool performs best on financial datasets.
Ensure the dataset covers at least 3 years of historical data.
===
You use AI to compare two companies' financial performance. The most important data quality check before analysis is:
Whether the AI tool can handle multi-company datasets.
Whether the data covers the same fiscal year definitions.
Whether the currency figures have been inflation-adjusted.
*Whether both companies use the same accounting standards.
===
You ask Claude to identify trends in your P&L. What instruction produces the most useful output?
*Specify the metric, time period, and what magnitude of change matters.
Ask Claude to identify all patterns and anomalies in the data.
Ask Claude to compare your P&L to industry averages.
Ask Claude to explain what each P&L line item means.
===
A finance team member uses AI to generate a cash flow forecast. What is the most critical human input?
The historical data provided to the AI for training.
The visualisation format for the output forecast.
*The underlying assumptions for each forecast driver.
The AI model version used for financial forecasting.
===
Which financial task benefits most from AI assistance?
Making the final investment recommendation for capital allocation.
*Rapidly generating variance analysis narratives for multiple cost centres.
Auditing financial statements for compliance with regulatory standards.
Setting interest rate assumptions for a 5-year DCF model.
===
You feed raw transaction data to Claude and ask it to categorise expenses. The most important limitation to communicate to stakeholders is:
*AI categorisation may contain errors requiring human review before use.
AI cannot categorise transactions without a predefined chart of accounts.
AI expense categorisation is only reliable for transactions above a high threshold.
AI will only categorise transactions with clear vendor name data.
===
An AI tool flags that your receivables days outstanding has increased from 42 to 58 days. What is the correct analytical next step?
Ask the AI to predict future receivables based on the new trend.
Present the finding to leadership immediately as a cash flow risk.
Ask AI to compare this to industry benchmarks for receivables days.
*Investigate whether this is a change in customer payment behaviour or a data issue.
===
What is the most important reason NOT to use AI for final financial projections in an investor presentation?
AI financial projections are inherently less accurate than analyst-built models.
Investors can detect AI-generated financial projections in due diligence.
*The projections require assumption ownership the presenter must be able to defend.
AI cannot access the proprietary data needed for accurate projections.
===
You use AI to build a financial dashboard for a client. Before delivery, you must:
*Verify every formula and figure against the underlying source data.
Ensure the dashboard design meets the client's visual preferences.
Have Claude review the dashboard for calculation errors.
Confirm the dashboard uses the client's preferred currency format.
===
What does "grounding" a financial AI prompt mean in practice?
Specifying the accounting standard the AI should apply.
Including context about the industry so AI interprets ratios correctly.
Setting temperature to zero to ensure deterministic financial outputs.
*Providing the actual financial data the AI must work from, not its training knowledge.
===
Which financial KPI is most dangerous to derive from AI without verification?
Revenue, since it is the most commonly reported figure.
*EBITDA, since its definition varies significantly between companies.
Headcount, since AI cannot access HR system data.
Net income, since AI cannot perform multi-line calculations.
===
You use AI to compare your company's burn rate to industry benchmarks. The most important caveat is:
Burn rate comparisons only work for companies of identical size.
AI cannot calculate burn rate without monthly cash flow statements.
*AI training data benchmarks may be outdated or from a different market context.
Industry benchmarks are only relevant for venture-backed companies.
===
A junior finance analyst asks AI to explain a complex derivative instrument. What is the appropriate guidance?
Trust AI explanations for widely traded instruments only.
Avoid using AI for complex financial instrument explanations entirely.
Use AI only if the explanation matches the analyst's prior knowledge.
*Use AI for initial orientation, then verify with authoritative financial references.
===
What is the most valuable use of AI in financial due diligence?
Providing definitive assessments of financial risk in target companies.
*Rapidly synthesising patterns across a large set of financial documents.
Replacing the need for accountants to review historical financials.
Generating binding investment recommendations from financial data.
===
What is a finance professional's primary responsibility when using AI for analysis?
*Owning the accuracy and validity of every output regardless of AI's role.
Documenting which steps of the analysis were AI-assisted.
Using only AI tools approved by the finance team's IT policy.
Disclosing AI use to stakeholders in all financial communications.
===
You use Claude to draft the assumptions page of a financial model. The most important revision you must make is:
Ensure the assumptions are presented in the format investors expect.
Check that the assumptions cover all major model drivers.
*Replace generic assumptions with figures specific to your business context.
Verify that the assumption page is consistent in number format.
===
A financial model built with AI assistance shows an unusual spike in month 7. The first action is:
*Trace the spike to its source formula and underlying assumptions.
Smooth the model by averaging month 7 with adjacent months.
Ask Claude to explain why month 7 shows a spike.
Present the spike as a scenario worth noting in the analysis.
===
Which step in financial modelling is Claude most reliably useful for?
Populating the model with accurate company-specific financial figures.
Validating the mathematical integrity of complex model formulas.
Making assumptions about future market conditions and growth rates.
*Drafting the structure and labels of a financial model for human population.
===
You ask Claude to build a 3-statement financial model. What is the most important instruction to include?
Specify that the model should balance the balance sheet automatically.
*Define every assumption explicitly and instruct Claude to flag where it is uncertain.
Ask Claude to use industry-standard formatting for all financial models.
Specify the number of periods and currency for the model.
===
What is the most reliable way to verify that an AI-built financial model is arithmetically correct?
Have Claude review its own model for calculation errors.
Run the model with zero inputs and confirm all outputs are zero.
*Manually trace key formulas cell by cell from assumptions to outputs.
Compare the model's totals to a manually calculated rough estimate.
===
You use AI to generate sensitivity analysis for a financial model. The most important human contribution is:
Ensuring the sensitivity table is formatted correctly for presentation.
Checking that AI used the correct base case assumptions for sensitivity.
Deciding how many sensitivity scenarios to include in the analysis.
*Selecting which variables to sensitise and interpreting what the output means.
===
An AI-generated DCF valuation shows your startup is worth a high figure. Before presenting this to investors:
*Trace every assumption and challenge each one with a bull and bear case.
Present the figure alongside the AI tool's accuracy rating.
Have a second AI tool validate the valuation before presenting.
Compare the figure to recent comparable company valuations to verify.
===
What does "model integrity" mean when AI assists in building financial models?
The model was reviewed and approved by a qualified accountant.
*Every formula, assumption, and output can be traced, explained, and defended.
The model produces consistent outputs across multiple AI generation runs.
The model structure follows internationally accepted financial standards.
===
You use Claude to write a financial commentary for your monthly management accounts. What is non-negotiable before distribution?
The commentary length matches the finance team's reporting template.
The commentary uses the same language as last month's report.
The commentary has been reviewed by the CFO for tone and style.
*Every variance explained is accurately reflected in the underlying data.
===
Which financial metric is most susceptible to AI misinterpretation?
Revenue, because it is always clearly defined in accounting standards.
COGS, because AI cannot access supply chain data.
*Working capital, because its composition varies significantly by business model.
Net income, because AI cannot perform multi-step calculations reliably.
===
You are using AI to analyse your company's unit economics. What is the most important input to validate first?
The historical unit volume data for the past 12 months.
*The definition of a "unit" used consistently throughout the analysis.
The AI tool's capability to handle subscription-based unit economics.
Whether your unit economics are comparable to industry benchmarks.
===
A finance team member wants to use AI to automate month-end journal entries. What is the most important safeguard?
*Human review and approval of every AI-generated journal before posting.
Using the highest-accuracy AI model available for accounting tasks.
Testing the automation on a sandbox accounting system first.
Having the CFO sign off on the automation design before deployment.
===
What is the most accurate statement about using AI for financial forecasting?
AI forecasting is more accurate than human forecasting for most financial metrics.
AI forecasting is only useful for short-term cash flow projections.
*AI can generate structurally sound forecasts, but assumption quality determines usefulness.
AI cannot produce reliable financial forecasts without historical data inputs.
===
You present an AI-assisted financial model to a board. A director asks about a specific assumption. You cannot explain it. What does this reveal?
The assumption is too technical for board-level discussion.
The AI model used an inappropriate assumption for this context.
The board director is being unreasonably detailed in their questioning.
*You do not fully own the model — AI generated it and you did not verify it.
===
What practice most improves AI-assisted financial analysis over time?
Using the most advanced AI model for all financial analysis tasks.
*Building a library of verified, business-specific prompt templates for recurring analyses.
Running every analysis through two different AI tools and reconciling.
Having a dedicated AI specialist manage all financial AI interactions.
===
Your finance team uses AI to screen contracts for risk clauses. What is the critical limitation to communicate?
*AI may miss or misinterpret complex legal language — legal review remains essential.
AI contract screening only works for contracts in English.
AI cannot screen contracts longer than 20 pages reliably.
AI risk screening does not cover regulatory compliance clauses.
===
What is the most important reason AI cannot replace a chartered accountant for statutory financial reporting?
AI cannot access the accounting systems needed for statutory reporting.
Chartered accountants have more accurate knowledge of accounting standards.
*Statutory reporting requires licensed professional accountability.
Statutory reports require physical signatures AI cannot provide.
===
A company uses AI to monitor transactions for fraud. An AI alert fires on a legitimate transaction. What is this called?
A false negative — the AI missed a fraudulent transaction.
*A false positive — the AI incorrectly flagged a valid transaction.
A precision error — the AI threshold is too tightly calibrated.
A model drift — the AI is responding to outdated fraud patterns.
===
You use AI to identify financial anomalies in your accounts. An AI flags that a vendor's invoices have increased by 40% year-on-year. Before escalating:
Report this immediately as a potential procurement fraud risk.
Ask the AI to run a historical trend analysis to confirm the pattern.
Compare the vendor's prices to market rates using AI research.
*Verify whether this reflects a genuine increase in services or a data or contract issue.
===
What is the most appropriate use of AI in a financial audit process?
*Identifying sample transactions for auditors to investigate manually.
Replacing the sample selection process entirely with AI coverage.
Making audit conclusions about the completeness of financial statements.
Certifying that financial records comply with applicable standards.
===
A client asks whether your AI-generated financial analysis complies with SEBI regulations. The correct response is:
Explain that AI-generated analysis is not subject to SEBI regulations.
*Confirm compliance with qualified legal and regulatory counsel before asserting it.
Review the relevant SEBI provisions with Claude before responding.
Confirm compliance since your AI tool provider is an enterprise platform.
===
What is the most important principle for AI use in financial services risk management?
AI risk models must achieve 99% accuracy before deployment in production.
AI risk outputs should be disclosed to regulators when they influence decisions.
AI in risk management must be auditable using explainable AI methods.
*All AI risk outputs must have a documented human review process before action.
===
You use AI to prepare a tax calculation estimate. What is the most important caveat?
The calculation is reliable for standard transactions but not for complex structures.
AI tax calculations are accurate as long as current tax rates are provided.
*The calculation is indicative only and must be reviewed by a qualified tax professional.
The calculation should be disclosed to the tax authority as AI-generated.
===
What makes AI particularly useful for regulatory reporting preparation?
Automatically verifying compliance with applicable regulatory standards.
*Rapidly structuring and formatting large volumes of data into required templates.
Replacing the compliance officer's review for routine reports.
Providing real-time updates on regulatory changes that affect reporting.
===
Which scenario most clearly requires human professional judgment rather than AI?
*Deciding how to classify an ambiguous transaction under an accounting standard.
Generating a formatted trial balance from a structured data export.
Drafting the standard notes to accounts for a financial statement.
Calculating depreciation charges across a fixed asset register.
===
What is the correct approach to AI-assisted KYC document verification in financial services?
Use AI for straightforward cases and humans for complex ones only.
Fully automate KYC verification for customers below a risk threshold.
*Use AI to assist the review process, with human sign-off on every verification.
Use AI verification for initial onboarding and periodic review only.
===
You discover that your AI financial analysis tool has been producing slightly incorrect calculations due to a model error. What must you do?
Patch the model and monitor future outputs without retroactive notification.
Assess whether the errors were material before deciding on action.
Report the tool error to the AI vendor and await their correction.
*Identify all affected outputs, correct them, and notify stakeholders who received them.
===
What is the most important limitation of AI in credit risk assessment?
AI cannot access credit bureau data needed for comprehensive assessment.
*AI models learn from historical data and may miss novel risk patterns.
AI credit models are too slow for real-time lending decision requirements.
AI credit assessment is not recognised as valid by Indian financial regulators.
===
When using AI to prepare financial communications for investors, what is the highest compliance risk?
Using non-standard financial metrics without sufficient explanation.
Failing to disclose that AI was used in preparing the communication.
*Including forward-looking statements not supported by documented assumptions.
Including financial figures not audited by a qualified accountant.
===
What is the correct professional stance on using AI for internal financial controls?
*AI can strengthen controls when designed with human oversight and testing.
AI is too unreliable for use in regulated financial control environments.
AI should replace manual controls to eliminate human error.
AI internal controls are acceptable only if audited by external AI specialists.
===
You use Claude to write the CEO letter for your company's annual report. What is non-negotiable before publication?
The letter must be reviewed by the company's PR team for tone.
The letter must be consistent with the audited financial statements.
The CEO must disclose that AI assisted in drafting the letter.
*Every factual claim must be verified and the CEO must fully own the narrative.
===
What is the most effective structure for an AI-assisted financial analysis presentation?
Lead with methodology, then present data, then state conclusions.
*Lead with the business implication, support with verified figures, acknowledge limitations.
Show all data first, then walk through each analytical step taken.
Present findings in order of statistical significance, highest to lowest.
===
A finance manager uses AI to write board-level financial commentary. Before the board meeting:
The commentary should be reviewed by the CEO for strategic alignment.
The board must be informed that AI assisted in preparing the commentary.
*Every number cited must be traced to the approved management accounts.
The commentary should match the format used in the previous board meeting.
===
You present AI-generated financial projections and a board member challenges your revenue assumption. The strongest response is:
*Explain the specific business evidence supporting the revenue assumption.
"The AI model generated these projections using industry benchmark data."
"I can re-run the model with different assumptions to find one you prefer."
"The 95% confidence interval from the AI model supports this range."
===
When should financial commentary explicitly quantify uncertainty?
Only in scenarios analyses, not in base case management reports.
Never — uncertainty in financial reports undermines stakeholder confidence.
Only when the CFO specifically requests probabilistic output.
*When the outcome depends on factors outside the business's control.
===
You need to present monthly financial performance to a non-financial leadership team. AI drafts the commentary. What must you do before presenting?
Ensure the commentary uses the same format as previous months.
Check that the commentary identifies the right operational owners for each variance.
*Verify accuracy and translate technical financial language into business terms.
Have the commentary reviewed by the CFO before presenting to other leaders.
===
What is the most important principle when communicating AI-assisted financial forecasts?
*Clearly distinguish what is a stated assumption from what is a projection.
Cite the AI model version and accuracy rate for the forecast.
Present only the most likely scenario to avoid confusing stakeholders.
Frame forecasts as AI-generated to manage stakeholder expectations.
===
A client asks for a financial model with detailed output but insists you turn it around in 4 hours using AI. What is the most professional response?
"AI can produce a fully verified model in that timeframe without issue."
*"I can produce a solid first version in 4 hours but some figures will need verification before final use."
"A quality financial model cannot be produced in 4 hours regardless of AI."
"I will use AI for all sections and verify only the key outputs."
===
What is the most effective way to communicate that an AI-assisted financial analysis has limitations?
Add a general disclaimer that AI tools were used in the analysis.
Present confidence intervals for all key figures in the analysis.
*State specifically what was verified versus what is directional.
Note that the analysis should be reviewed by a qualified accountant.
===
You use AI to write a financial report for a regulated entity. Which step is most critical before submission?
Check that the report format matches the regulatory template exactly.
Confirm the AI tool used is approved by the relevant regulator.
Ensure the report is submitted through the correct regulatory channel.
*Have a qualified professional verify compliance with applicable reporting standards.
===
What is the most common failure mode in AI-assisted investor financial communication?
*Using AI-generated projections without understanding and owning the assumptions.
Formatting financial figures inconsistently across different sections.
Using AI for narrative sections but not for the financial tables.
Including too many scenarios which confuses investors about the base case.
===
What does good financial disclosure practice look like for AI-assisted reports?
Adding a single footnote that AI tools were used in report preparation.
*Disclosing AI's role at the task level and confirming human review of all figures.
Disclosing AI use only when specifically required by the relevant standard.
Maintaining a private log of AI use without external disclosure.
===
You use AI to analyse investor comments from previous AGMs to prepare the CFO for this year's AGM. What is the highest-value insight the AI should surface?
The most vocal shareholders from previous meetings.
The questions that attracted the most shareholder support.
The topics that management answered most confidently in prior years.
*Recurring concerns that have not yet been addressed by management.
===
What is the strongest argument for maintaining human review of AI-generated financial reports even when AI accuracy is high?
*High accuracy average masks the possibility of catastrophic individual errors.
Human review is required by all financial reporting standards.
Human review adds credibility to AI outputs for external stakeholders.
Human review is faster than AI for detecting calculation errors.
===
The most important quality for a finance professional using AI in their work is:
Technical AI expertise so they can evaluate model quality directly.
Speed of AI tool adoption across all financial analysis workflows.
*Analytical scepticism about AI outputs combined with practical judgment about when to verify.
Ability to use AI to produce more output than colleagues without AI.
===
Your AI-generated quarterly forecast shows an unexpected 30% revenue increase in Q3. Your first action is:
*Identify the assumption or formula driving the increase and validate it.
Present the forecast — unexpected upside is positive news for leadership.
Ask the AI to re-run the forecast to see if the increase is consistent.
Benchmark the Q3 growth against industry peers using AI research.
===
A startup founder asks you to use AI to project their path to profitability for a Series A pitch. Your professional approach is:
Generate projections that show the most attractive path to justify the valuation.
Use AI to identify what assumptions investors typically want to see.
Match the projections to the founder's stated business plan goals.
*Model conservative, realistic, and optimistic scenarios with explicit, defensible assumptions.
===
You are under audit and the auditor requests the basis for a specific figure in your management accounts that was AI-generated. What do you do?
Explain that AI generated the figure and its accuracy is high on financial tasks.
*Provide the source data and calculation methodology that produced the figure.
Ask Claude to reproduce the calculation and provide it as the audit basis.
Request more time to verify the figure before providing the audit response.
===
A colleague argues that AI will make finance roles obsolete within 5 years. The most accurate response is:
AI will fully automate finance within 5 years as model capability grows.
Finance roles are safe because they require human relationship skills AI cannot replicate.
*AI will transform finance roles by automating production and elevating judgment requirements.
AI impact on finance will be minimal since financial data requires professional oversight.
===
You discover that your company's financial model has been using AI-generated market size figures that are not sourced. What is the correct immediate action?
*Replace all unsourced figures with verified data and update all affected documents.
Add source notes attributing the figures to AI as a disclosure.
Keep the figures if they are consistent with industry understanding.
Run the same queries with a different AI tool to cross-verify.
===
A CFO wants to use AI to reduce headcount in the FP&A team. What should be evaluated first?
How much cost savings the reduction will generate annually.
Whether AI tools can be integrated with the existing finance tech stack.
*Which specific tasks AI can reliably perform and at what quality standard.
How competitors are using AI in their FP&A functions.
===
You are reviewing an AI-generated financial model produced by a junior team member. You notice the model looks correct but uses 15% WACC for a high-growth startup. What do you do?
Accept the 15% — it is within a reasonable range for this asset class.
Ask the junior team member why they chose 15% before changing it.
Ask Claude what the appropriate WACC should be for this company.
*Correct the WACC with a justified rate appropriate for the company's risk profile.
===
An investor says your financial model "looks sophisticated" after reviewing it. This should make you:
Feel confident the investor will proceed with the investment.
*Ensure you can defend every assumption and figure in it before the next conversation.
Consider whether the model is too complex for its purpose.
Prepare to share the model with other investors as a template.
===
What is the correct response when you realise you have sent an investor an AI-generated financial summary with an incorrect figure?
Wait to see if the investor notices or asks about it.
Send a full revised document without highlighting the specific error.
*Send a correction immediately with an accurate figure and brief explanation.
Check first whether the error is material before deciding whether to correct.
===
A client wants AI to automate their accounts payable process entirely. What is your professional recommendation?
*Design AI automation with human review at key exception and approval points.
Recommend full automation since accounts payable is a straightforward transaction process.
Advise against AI in accounts payable due to fraud risk.
Recommend AI for invoice receipt and matching but not for payment authorisation.
===
What is the most important thing to establish before using AI to assist in financial negotiations?
That the AI tool is approved for use in confidential financial negotiations.
*That every AI-generated figure or claim has been verified before it enters the negotiation.
That the counterparty is also using AI to ensure a level playing field.
That the AI has been given full context about the negotiation history.
===
You build an AI dashboard that alerts the finance team to budget variances above 10%. The most important design decision is:
The threshold level that triggers the alert.
Which AI model is used to calculate the variance.
How frequently the dashboard refreshes its data.
*What the human action protocol is when the alert fires.
===
A finance professional becomes entirely dependent on AI for all analysis. What is the most serious professional risk?
They become slower than AI-fluent colleagues in routine analysis tasks.
They become unable to operate when AI tools are unavailable.
*They lose the judgment to evaluate AI outputs accurately when it matters most.
They make more errors because they rely on AI rather than checking themselves.
===
What makes AI adoption in finance sustainable rather than just a productivity trend?
Achieving widespread adoption of AI tools across all finance functions.
*Integrating AI into governance structures with defined quality standards.
Continuous investment in newer and more capable AI models.
Measuring AI productivity gains monthly and reporting to leadership.
===
Menler's AI for Finance bank tests applied financial judgment with AI. What distinguishes a Menler-trained finance professional?
They use a wider range of AI tools than finance professionals without training.
They produce faster financial analysis than their non-AI-fluent peers.
They have passed a Menler assessment that certifies their AI finance skills.
*They design and own AI-assisted financial workflows with professional accountability.
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

export const FINANCE_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getFinanceSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}

// The bank's named sets, in source order.
export const FINANCE_SETS = [
  'Financial Data Thinking',
  'AI-Assisted Analysis & Modelling',
  'Risk, Compliance & Verification',
  'Financial Communication & Reporting',
  'Judgment Scenarios',
];

// A fresh session for one set: `count` questions from that set's block, options shuffled.
export function getFinanceSet(setIdx, count = 15) {
  const per = Math.floor(ITEMS.length / FINANCE_SETS.length);
  const start = setIdx * per;
  return shuffle(ITEMS.slice(start, start + per)).slice(0, count)
    .map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
