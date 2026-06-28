// AI for Analysts — AI Aptitude question bank: 75 questions (5 sets × 15).
// Sets: Data Thinking with AI · AI-Assisted Analysis · Verification & Critical
// Evaluation · Analytical Communication · Judgment Scenarios.
//
// Correct answers VARY (A/B/C/D), so the correct option line in each block is
// prefixed with "*". Option order is shuffled at session build, so position is
// not predictable.
//
// getAnalystsSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
A manager gives you a dataset and says "find insights." Before running any AI analysis, your first step is:
Clean and format the data so AI can process it correctly.
*Define a specific business question the analysis should answer.
Run exploratory AI analysis to surface questions to investigate.
Identify which AI tool is most appropriate for this data type.
===
You are designing an AI-assisted analysis of customer churn. Which variable is most important to define first?
The AI model that performs best on classification tasks.
The size of the dataset needed for statistical significance.
The visualisation format for presenting findings to stakeholders.
*The definition of "churn" for this specific business context.
===
AI is asked to identify "trends" in your sales data. What is the most important instruction to include?
*Specify the time period, metric, and what constitutes a meaningful trend.
Ask AI to identify all trends and patterns it can find in the data.
Specify the visualisation format for displaying the trends.
Ask AI to compare this dataset to industry benchmark data.
===
Which of these analyst tasks benefits most from AI assistance?
Making the final judgment on which hypothesis is correct.
Collecting primary research data from the market.
*Generating multiple hypotheses quickly to structure the analysis.
Deciding which business decisions follow from the findings.
===
Before asking AI to analyse your dataset, the most important data quality check is:
Whether the dataset is large enough to produce statistically significant results.
*Whether the data definitions and categories are consistent throughout.
Whether the AI tool you are using can handle the file format.
Whether the dataset is recent enough to be relevant to your question.
===
You have two datasets on the same customer cohort from different internal systems. They disagree on customer count by 8%. Your first action is:
*Investigate the source and definition differences between the two systems.
Average the two counts as a reasonable estimate.
Use the larger count — it is more likely to be complete.
Use the smaller count — it is more likely to exclude duplicates.
===
An analyst wants to use AI to build a segmentation of customers. The most important input to define first is:
The number of segments that will be most manageable for the business.
The AI clustering algorithm best suited to customer data.
The data fields available for the AI to use in clustering.
*The purpose of the segmentation — what decisions it will inform.
===
You feed raw survey data into Claude and ask it to find the key themes. The most important limitation to be aware of is:
Claude cannot process survey data with more than 100 respondents.
Claude will only identify themes present in its training data.
*Claude may interpret open-text responses through its own pattern biases.
Claude requires structured data format to analyse survey responses.
===
What is the most reliable approach when using AI to size a market?
*Define your bottom-up assumptions, use AI to stress-test them, verify inputs from primary sources.
Ask AI for the market size and use it as your baseline figure.
Use AI to aggregate publicly available market research reports.
Ask AI to identify the methodology used in industry reports.
===
A stakeholder asks for "the key drivers of revenue growth." Before building the AI analysis, you should:
Ask AI to identify all statistically significant revenue variables.
Run the analysis first and define "drivers" from the findings.
Collect more data to ensure the analysis is comprehensive enough.
*Clarify whether they want correlation analysis or causal attribution.
===
Which analytical question is least appropriate for AI to answer independently?
Which date range in this dataset shows the highest variance.
*Whether this data pattern represents a real business problem worth solving.
Which columns in this dataset have the most missing values.
What the average order value is across these 10,000 transactions.
===
You are about to brief senior leadership using AI-assisted analysis. What is non-negotiable before the brief?
The presentation design must meet the company's brand standards.
The AI must have been used only for approved analysis tasks.
*Every specific figure cited must be verified from a primary source.
A written summary of AI's limitations must be disclosed to leadership.
===
What does "framing the analysis" mean for an AI Analyst?
Selecting the chart types and layout for presenting findings.
Writing the narrative around AI-generated charts and tables.
Deciding which insights from the AI analysis to include in the report.
*Defining the question, hypothesis, scope, and success criteria before starting.
===
An AI analysis identifies a correlation between two variables. The most responsible conclusion to draw is:
One variable is causing the other; this is an actionable finding.
*These variables move together; causation requires further investigation.
The correlation is meaningful only if it exceeds 0.7 coefficient.
Correlation in AI analysis confirms causation for practical purposes.
===
What is an analyst's primary responsibility when using AI for data analysis?
*Owning the quality and validity of the conclusions, regardless of AI's role.
Ensuring the AI tool used is approved for data analysis tasks.
Documenting which parts of the analysis were AI-assisted.
Ensuring the AI can access all the data it needs to analyse.
===
You use Claude to summarise 50 customer feedback responses. Before using the summary, you should:
Have a second AI tool verify the summary for completeness.
Check whether the summary matches the original response count.
*Read a sample of raw responses to validate the summary's accuracy.
Ensure Claude has not excluded responses in negative sentiment.
===
Which step in a data analysis workflow does AI most reliably accelerate?
*Structuring and reformatting raw data into a consistent schema.
Making the final decision on which findings are strategically important.
Designing the sampling methodology for the research study.
Interpreting what findings mean for the organisation's specific context.
===
What is the most effective way to use AI to explore a dataset you have never seen before?
Ask AI to run a comprehensive analysis and present its top 10 findings.
Ask AI to clean and normalise the data before any exploration.
Ask AI to compare this dataset to similar industry datasets it knows.
*Ask AI to describe the data structure, field names, and samples to orient yourself.
===
You use AI to segment customers into 5 clusters. The most important next step before presenting the segments is:
Run the same clustering with 4 and 6 clusters to compare the results.
*Interpret each cluster using your business knowledge to validate they make sense.
Ask AI to label each cluster with a descriptive name for presentation.
Calculate the statistical significance of the cluster separation.
===
You use Claude to generate the initial Python code for a data analysis pipeline. The most important next step is:
Run the code on the full dataset to check if it produces expected outputs.
Ask Claude to review and debug the code before you run any tests.
*Review and test the code on a small data sample before running it on the full dataset.
Add your name to the code as author before sharing with the team.
===
Which AI use case in analytics carries the highest verification burden?
AI-generated first drafts of analyst commentary for internal review.
AI-assisted reformatting of raw data into a structured table.
AI-generated chart labels and titles for a presentation.
*AI-generated statistics used in a board-level report.
===
An AI tool tells you that a metric "increased significantly." What is your first analytical response?
*Ask: significant compared to what baseline, over which period, by what magnitude?
Accept the finding and include it in your report as a positive trend.
Ask the AI to confirm this finding with a second statistical test.
Investigate whether the underlying data collection method changed.
===
You run the same analysis prompt twice on the same dataset and get slightly different numerical outputs. What does this indicate?
The dataset has inconsistent data that produces variable results.
*Temperature variation is producing non-deterministic outputs — use temperature = 0.
The AI is selecting different analysis methods in each session.
One run had a context window overflow that truncated the analysis.
===
A stakeholder says "the AI found this pattern — it must be true." The correct challenge is:
"AI findings are accurate by default for pattern detection tasks."
"This finding is preliminary — we should run it through a second AI tool."
"AI pattern detection is reliable for well-structured datasets."
*"AI identified this correlation — we still need to validate it with additional analysis."
===
What is the most important difference between AI "analysing" data and a human analyst doing so?
The human is slower but more accurate in numerical computation.
The AI processes larger datasets than a human could review manually.
*The human applies contextual business judgment to interpret what patterns mean.
The human can access primary sources that AI cannot reach.
===
You need to present AI-assisted analysis to a client who is unfamiliar with AI. The most important thing to communicate is:
Which AI tool was used and its technical accuracy rating.
*Which parts of the analysis were AI-generated and how they were validated.
That AI was not used for any subjective or interpretive conclusions.
That the findings would be the same whether AI was used or not.
===
You want to use AI to build an analyst's daily reporting workflow. The first workflow step must be:
*Data validation — confirming the incoming data is complete and consistent.
AI analysis — generating the daily metrics and trend commentary.
Visualisation — converting AI outputs into charts for the report.
Distribution — sending the report to the relevant stakeholders.
===
What is the most important skill an analyst develops by working with AI on data tasks?
The ability to write Python and SQL to extract data for AI processing.
The speed to process and present more analysis than without AI.
*The judgment to direct AI toward the right question and evaluate its outputs.
The ability to use the widest range of AI analytics tools available.
===
An AI analysis of your customer data produces a finding you strongly disagree with. What is the right response?
Accept the AI finding — your intuition may be biased.
Reject it and redo the analysis until it matches your expectation.
Present both the AI finding and your intuition and let the stakeholder decide.
*Investigate the data and methodology before either accepting or rejecting it.
===
What does "analytical integrity" mean when AI is involved in the analysis?
Using only AI-verified data and AI-validated methods.
*Being transparent about AI's role and accountable for the conclusions.
Ensuring AI was used only for approved analytical task types.
Documenting every AI interaction in the analysis audit trail.
===
An AI tool presents a chart showing revenue increasing 40% year-on-year. Before presenting it, you should:
*Verify the underlying data and confirm the calculation methodology.
Check whether the chart design meets your presentation standards.
Ask the AI to confirm the finding is statistically significant.
Compare the 40% figure to the company's own growth targets.
===
You use AI to draft a competitive analysis. The section you must verify most carefully is:
The analytical framework used to structure the comparison.
The section headings and narrative flow of the document.
*Specific claims about competitors' products, pricing, or performance.
The summary recommendations at the end of the analysis.
===
What is the most effective prompt technique for reducing hallucination in AI-generated data analysis?
Ask AI to cite its confidence level for each analytical finding.
*Instruct AI to work only from the provided dataset and flag when it cannot.
Run the analysis 3 times and compare outputs for consistency.
Use the most advanced model available for all analytical tasks.
===
An AI analysis identifies an anomaly in your data. What is the first question to ask?
"Is this anomaly large enough to report to stakeholders?"
"Which AI model detected this anomaly and how reliable is it?"
"What is the recommended action for this type of anomaly?"
*"Is this a data quality issue or a real business phenomenon?"
===
You receive an AI summary of 100 customer reviews that says "customers are generally satisfied." You want to probe this further. The most effective next step is:
*Read a random sample of negative reviews to test the summary's accuracy.
Ask AI to re-summarise with a focus on negative sentiment only.
Filter the raw reviews to those with the lowest star ratings.
Ask AI to list specific complaints mentioned more than five times.
===
Which of these is the strongest evidence that an AI-generated analysis is reliable?
The analysis was generated by the highest-rated AI analytics tool.
*Every specific claim traces to a verifiable primary source.
The output was consistent across 5 separate generation runs.
The analysis structure matches what a senior analyst would produce.
===
A colleague presents AI-generated market research numbers without citing sources. Your response is:
"These numbers look reasonable, so let's include them in the analysis."
"AI market research is generally accurate enough for strategic planning."
"We should re-run this with a different AI tool to cross-check."
*"We need to verify these before using them — can you show me the source data?"
===
You use AI to run sentiment analysis on employee survey data. The finding shows 72% positive sentiment. What is the most important verification step?
Compare the 72% figure to industry benchmarks for employee sentiment.
Run the same data through a second sentiment analysis tool.
*Review how AI defined "positive" and check a sample of categorised responses.
Ask HR whether 72% aligns with their own qualitative observations.
===
What is the most common error analysts make when evaluating AI-generated statistical claims?
Not verifying whether the calculation method was disclosed.
*Accepting the number without checking what population it describes.
Not running a second statistical test to confirm the result.
Presenting the number without rounding it appropriately.
===
Before using an AI-generated cohort analysis in a strategy document, what must you confirm?
*The cohort definition and whether it is consistent across all time periods.
Whether the AI tool is approved for strategic analysis tasks.
Whether the cohort size is large enough for statistical significance.
Whether the analysis was generated by the latest model version.
===
You are producing a quarterly business review and some figures were AI-generated. What is the minimum standard before the document is distributed?
The document notes which figures were AI-generated for disclosure.
An AI proofreading tool has checked the document for consistency.
*Every AI-generated figure is verified against the source data by a human.
The AI-generated figures are flagged with a lower confidence interval.
===
A stakeholder challenges a finding from your AI-assisted analysis. What is the strongest response?
"I used the most advanced AI model available for this analysis."
"The AI is highly accurate on this type of data task."
"I can re-run the analysis to confirm it produces the same result."
*Walk through the source data and methodology step by step.
===
You discover an error in data you already used for an AI analysis in last quarter's report. What do you do?
Assess whether the error would change the conclusion before disclosing.
*Correct the data, re-run the analysis, and disclose the correction to stakeholders.
Correct it for future reports but do not revise the distributed document.
Check whether anyone has used the previous report's figures before acting.
===
What distinguishes a high-quality AI-assisted analyst from a low-quality one?
The high-quality analyst uses more AI tools in their analysis workflow.
The high-quality analyst relies on AI for a higher proportion of their work.
*The high-quality analyst treats AI outputs as hypotheses requiring validation.
The high-quality analyst discloses AI use in all analytical outputs.
===
An AI flags a finding as "statistically significant." What analytical caution should you apply?
*Statistical significance depends on sample size and does not guarantee practical importance.
Statistical significance from AI is more reliable than from manual testing.
Statistical significance means the finding is correct and ready to present.
Statistical significance requires confirmation from a domain expert.
===
You need to present a complex AI-assisted analysis to a non-technical executive. The most important principle is:
Explain the AI methodology so the executive understands the basis.
Show the data first so the executive can draw their own conclusions.
Include confidence intervals so the executive understands uncertainty.
*Lead with the business implication, not the analytical method.
===
A colleague drafts an AI-assisted report that presents every finding at the same level of confidence. The problem is:
Presenting all findings at equal confidence makes the report too long.
*Different findings have different evidence quality and should be differentiated.
Executive readers will not know which findings are from AI.
A uniform confidence level violates analytical communication standards.
===
You use Claude to write an executive summary of your analysis. The summary sounds compelling but omits two findings that contradict the main narrative. What must you do?
Ask Claude to rewrite the summary with a more balanced narrative.
Present the summary as written and include contradicting findings in an appendix.
*Revise the summary to include the contradicting findings honestly.
Note in the summary that AI generated it, so the reader can judge independently.
===
What is the most effective structure for communicating an AI-assisted data finding?
*Finding — Evidence — Implication — Confidence level
Method — Data — Finding — Recommendation
Context — Analysis — Charts — Conclusion
Background — AI tool used — Output — Next steps
===
An AI-generated visualisation shows a trend that looks dramatic but the Y-axis starts at 94% rather than 0%. What should you do?
Keep the chart as-is — it correctly shows the relevant range of variation.
Add a footnote explaining that the Y-axis does not start at zero.
Ask AI to regenerate the chart with a different visualisation type.
*Reconstruct the chart with a Y-axis starting at 0 to show true scale.
===
You present AI-generated analysis and a stakeholder asks a question you cannot answer. The correct response is:
"The AI produced this analysis — you would need to ask it directly."
"The AI is confident in this finding, so the question may not apply."
*"I will investigate and get back to you with a verified answer."
"Let me re-prompt Claude right now to see if it can answer."
===
What is the correct way to handle uncertainty in an AI-assisted analytical report?
*State clearly which conclusions are high-confidence and which are directional.
Remove all findings with uncertainty from the final report.
Present all findings with confidence intervals calculated by the AI.
Disclose that AI was used and ask the reader to judge uncertainty.
===
Which element of an AI-assisted analysis is most important to attribute clearly in a report?
The name and version of the AI tool used for the analysis.
*Which specific claims were generated by AI versus verified from primary data.
The total number of AI interactions in the analysis process.
Which team member was responsible for the AI prompting work.
===
A stakeholder says your AI-assisted analysis is "just opinion." The strongest professional response is:
"This analysis used the most advanced AI tool currently available."
"The AI model processes far more data than human analysis could."
*"Here are the verified primary sources each key finding is based on."
"I have extensive experience in this domain so the interpretation is sound."
===
You want to use AI to write the narrative sections of your analysis report. The most important instruction to include in the prompt is:
"Write in a formal, professional tone suitable for executive readers."
"Ensure the narrative highlights the most positive findings first."
"Generate narrative of approximately 300 words per section."
*"Do not state or imply anything that is not explicitly supported by the findings below."
===
An AI-generated analysis uses precise-sounding figures from its training data rather than from your dataset. The most likely cause is:
*The prompt did not sufficiently specify that AI should use only the provided data.
The AI model cannot distinguish between its training data and provided datasets.
The dataset was too small for the AI to use as a primary source.
The AI tool being used requires explicit API configuration to limit data sources.
===
What is the most professional way to communicate that AI was used in your analysis?
Add a general disclaimer noting "AI tools were used in this analysis."
*State specifically which tasks AI assisted with and how outputs were verified.
Only disclose if the client or audience directly asks about your process.
AI disclosure is unnecessary when outputs have been fully verified.
===
You are presenting analysis to a board that is unfamiliar with AI. Which statement best introduces your methodology?
"AI replaced the manual analysis process, producing faster and more accurate outputs."
"We ran this analysis using the latest AI model to ensure accuracy."
"AI was used throughout, but human judgment was applied at every decision point."
*"We used AI to structure and accelerate the analysis, with all key findings verified from primary data."
===
A junior analyst on your team presents AI outputs directly as analysis findings without review. What is the correct response?
*Explain why AI outputs are starting points and establish a review process.
Accept the findings since the analyst will learn from any errors over time.
Re-run the analysis yourself to check whether the outputs are accurate.
Flag the concern to your manager before addressing it with the analyst.
===
What makes analytical communication AI-native rather than AI-assisted?
The analysis was produced entirely by AI without human editing.
AI tools are used for both analysis and the final presentation design.
*AI is used to accelerate production of the full analysis and verification is built into the workflow.
The analysis workflow was designed by an AI tool for efficiency.
===
You are under time pressure and must use AI to complete an analysis quickly. The most important principle to maintain is:
*Verify the key figures even if you must abbreviate the written commentary.
Complete the full analysis and skip verification to meet the deadline.
Use AI for the full analysis and disclose it was produced under time pressure.
Deliver partial verified analysis rather than complete unverified analysis.
===
Your AI analysis contradicts a widely held view in your organisation. What is the correct response?
Soften the finding to reduce organisational friction.
Align the analysis with the prevailing view to ensure adoption.
Bury the finding in an appendix to avoid unnecessary conflict.
*Validate the analysis rigorously before presenting it — then present it clearly.
===
A client asks you to use AI to predict their churn rate for next quarter. What is the most honest response?
"AI can accurately predict churn using your historical data."
*"AI can model patterns from past behaviour, but predicting the future requires assumptions we should define together."
"AI prediction is not reliable enough for forward-looking business metrics."
"I can produce an AI prediction, but it should be treated as directional only."
===
You discover mid-project that the data you have been using for AI analysis was mislabelled. What do you do?
Continue the analysis and note the mislabelling as a limitation.
Re-run only the analyses that will be presented to the client.
*Stop the analysis, correct the data labels, and re-run all affected analyses.
Assess the magnitude of the impact before deciding whether to re-run.
===
You use AI to build a model that predicts customer lifetime value. The model shows 85% accuracy on test data. Before deploying it, the most important check is:
*Whether the test data represents the full diversity of real production scenarios.
Whether 85% accuracy is above the industry benchmark for this model type.
Whether the model was tested on data the AI had not seen during training.
Whether the accuracy has been confirmed by a second AI model.
===
A senior stakeholder asks you to "just get AI to do the analysis" without specifying what question to answer. What do you do?
Run exploratory AI analysis and present whatever findings emerge.
Use AI to identify what questions are worth answering first.
*Clarify the question before proceeding — purposeless analysis wastes time.
Build a comprehensive dashboard covering all available metrics.
===
An AI analysis produces three findings that clearly support a strategic decision and one finding that complicates it. What do you do?
Present only the supporting findings since they are more numerous.
Aggregate all findings into a single summary recommendation.
Present the complicating finding as a "risk" in a separate section.
*Present all four findings and let the decision-maker weigh the full evidence.
===
You use Claude to assist with a sensitive analysis involving confidential company data. Before doing so, you must confirm:
That Claude is the correct AI tool for confidential data analysis.
*That your organisation's data policies permit use of this data with external AI tools.
That the data is anonymised before being shared with Claude.
That Claude's outputs will be kept internal and not published.
===
What is the right mental model for an analyst who uses AI every day?
AI is an expert colleague whose analysis I can rely on directly.
AI is a junior analyst who learns and improves with each task.
*AI is a high-speed research and production assistant — I direct and verify.
AI is a database that retrieves the correct analysis for any question.
===
Your team produces an AI-assisted forecast that turns out to be significantly wrong. What is the most productive response?
*Analyse what assumptions failed and improve the model and validation process.
Stop using AI for forecasting — the technology is not ready.
Disclose the failure to stakeholders and offer a refund for the work.
Accept that forecasting is inherently uncertain and move on.
===
A client says: "I trust your AI-assisted analysis more than your previous manual analysis because AI is objective." The correct response is:
"That's a reasonable view — AI removes human bias from the process."
*"AI analysis has different failure modes than manual analysis — objectivity depends on data quality and question framing."
"AI-assisted analysis is indeed more reliable for pattern detection tasks."
"I appreciate the confidence — AI does improve consistency in our process."
===
You are asked to scale up an AI-assisted analysis workflow from 10 reports per month to 200. The most important thing to address first is:
Which AI model tier can handle 200 reports within the API rate limits.
How much the AI tool licensing costs at the higher volume.
Whether the prompt templates can be reused across all 200 reports.
*How quality review will scale alongside the increase in volume.
===
What is the most important analyst skill that AI cannot replicate?
Reading large datasets quickly to identify patterns and anomalies.
Producing consistent analysis across large volumes of reports.
*Understanding the organisational context that makes a finding matter.
Applying statistical methods accurately to structured data.
===
An analyst says "I used AI to check my work and it confirmed everything." What is the problem?
AI confirmation tools are only reliable for grammar and formatting.
*Using AI to confirm AI-assisted work does not provide independent verification.
The analyst should have used a different AI tool for checking.
Confirmation of completed work is not a useful analytical practice.
===
What distinguishes a Menler AI Analyst from someone who just uses AI tools for data work?
The Menler Analyst uses more advanced AI analytics tools than the average analyst.
The Menler Analyst has completed a certified AI analytics training programme.
The Menler Analyst works faster on analysis tasks using AI than without.
*The Menler Analyst designs reliable analytical workflows and owns the quality of conclusions.
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

export const ANALYSTS_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getAnalystsSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
