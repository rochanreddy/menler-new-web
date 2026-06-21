// AI for Analysts question bank — 75 questions (5 sets × 15).
// In the source PDF the correct answer is always the 2nd option (B); we shuffle
// option order at session build so the correct answer isn't always in one spot.
//
// getAnalystsSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You receive a dataset and your manager asks you to "find insights." What is the most important first step before involving AI?
Run the dataset through an AI tool immediately to surface patterns.
Define the specific business questions you are trying to answer — because AI-generated insights from an undefined question produce interesting but unactionable output.
Clean the data first before defining any questions.
Check which AI tools are best suited for the size of the dataset.
===
An AI tool surfaces a strong correlation between two variables in your dataset. What is the most important analytical caution?
Correlation always implies causation when found by AI.
Correlation is not causation — the AI has identified a statistical relationship, not an explanation. The cause requires domain expertise, additional data, or experimental design to establish.
AI-identified correlations are always more reliable than human-identified ones.
Strong correlations should always be included in your report regardless of their interpretation.
===
You use Claude to help interpret a complex dataset. Claude gives you a very confident explanation. What should you do before including it in a report?
Trust the explanation — Claude has analysed vast amounts of data in training.
Verify the interpretation against your domain knowledge, the data itself, and any subject matter experts — because Claude generates plausible interpretations, not verified ones.
Ask Claude the same question again to confirm the explanation is consistent.
Include the explanation with a footnote stating it was AI-generated.
===
What is the most common way AI adds genuine value to the early stages of data analysis?
Replacing the need for a skilled analyst entirely.
Accelerating data exploration — quickly summarising distributions, flagging anomalies, generating initial hypotheses, and suggesting analytical approaches — so the analyst can focus on interpretation and decision-making.
Providing definitive answers to business questions from raw data.
Automatically cleaning and transforming data without human review.
===
A business stakeholder sees your AI-assisted analysis and asks: "Did the AI do this or did you?" What is the most professional response?
"The AI did most of the heavy lifting."
"I used AI to accelerate the analysis — it helped me explore and structure the data faster. The interpretation, validation, and conclusions are mine, and I take full responsibility for the output."
"I did everything manually — I just used AI to format the presentation."
"The AI and I collaborated equally on this analysis."
===
What does "data quality" mean and why does it matter more in AI-assisted analysis than in manual analysis?
Data quality only matters for large datasets.
Data quality — accuracy, completeness, consistency, and timeliness of data — matters more with AI because AI processes data at scale and amplifies errors: a systematic data quality problem produces systematically wrong AI-generated insights across the entire analysis.
AI tools automatically detect and fix data quality issues.
Data quality is a technical concern for data engineers, not analysts.
===
Which analytical task is most appropriate for AI assistance without significant risk of misleading output?
Determining the cause of a business metric decline.
Summarising the key statistics and distribution characteristics of a clean, well-understood dataset.
Predicting next quarter's revenue from current trends.
Identifying which customer segments to prioritise for retention.
===
You are asked to analyse customer churn data. Which framing produces the most useful AI-assisted analysis?
"Tell me everything about the churn data."
"Analyse this churn data to identify the top three factors most associated with customers who churned within 90 days of signup. Format findings as a table with the factor, associated churn rate, and sample size."
"What is the churn rate in this data?"
"Find patterns in this data that might explain churn."
===
What is the most important question to ask about any data before using AI to analyse it?
"Is this dataset large enough for AI analysis?"
"Do I understand how this data was collected, what it actually measures, and what biases or limitations might exist in it?"
"Is this data stored in a format the AI tool can process?"
"Has this data been used in AI analysis before?"
===
A colleague says: "We don't need analysts anymore — AI can just analyse the data directly." What is the most accurate response?
They are right — AI makes human analysts redundant.
AI dramatically accelerates the mechanical parts of analysis, but the analytical judgment required to frame the right questions, interpret results correctly, connect findings to business context, and make defensible recommendations requires human expertise that AI does not replace.
They are partially right — AI replaces junior analysts but not senior ones.
They are wrong — AI cannot analyse data at all without human direction.
===
What is "survivorship bias" and why is it a risk in AI-assisted business data analysis?
When AI only analyses data from the most recent time period.
When analysis is based only on data from entities that survived to be observed — for example, analysing only successful businesses — producing conclusions that don't account for the failures that no longer exist in the dataset.
When AI focuses too heavily on the most statistically significant findings.
When a dataset is too small for AI analysis to produce reliable results.
===
You have summarised a complex analysis using AI and the summary reads perfectly but misses a critical nuance. What does this reveal?
The AI tool made an error and should be replaced.
AI summarisation optimises for readability and completeness of obvious content — it does not know which nuances are critical for your specific audience and decision context without being explicitly told.
Your prompt was incorrect and needs to be rewritten.
Critical nuances cannot be captured in any summary, AI or human.
===
What is the most appropriate role for AI in helping an analyst communicate findings to a non-technical business audience?
Have AI rewrite the entire analysis in non-technical language without analyst review.
Use AI to draft plain-language explanations of technical findings, then review and refine to ensure accuracy is preserved, context is correct, and the level of simplification is appropriate for the specific audience.
Ask AI to decide which findings to share and which to omit for a non-technical audience.
AI communication assistance is not appropriate for business analysis.
===
What is "anchoring bias" in the context of AI-assisted analysis and how does it affect analytical quality?
When AI anchors its analysis to the first data point in a dataset.
When an analyst over-weights the first AI-generated insight and evaluates subsequent findings relative to it — even when the first insight was directionally wrong or incomplete.
When AI tools are anchored to specific analytical frameworks from their training.
When analysts anchor their reports to AI-generated conclusions without verification.
===
What distinguishes an analyst who uses AI effectively from one who uses AI but produces unreliable work?
The effective analyst uses more AI tools.
The effective analyst maintains analytical judgment throughout — questioning AI outputs, verifying key findings, connecting results to domain knowledge, and taking accountability for conclusions — rather than treating AI output as the analysis itself.
The effective analyst uses AI only for the most complex tasks.
The effective analyst has more technical training in AI tools.
===
You paste a messy dataset into Claude and ask it to identify data quality issues. What is the most appropriate use of Claude's response?
Accept Claude's list of issues as complete and fix them all.
Use Claude's response as a starting checklist — it surfaces common patterns like missing values, duplicates, and formatting inconsistencies — then verify each issue against the actual data before acting.
Only address the issues Claude rates as "high severity."
Claude cannot identify data quality issues in pasted data.
===
You want Claude to help write a formula for a complex Excel calculation. What information should you include in the prompt?
Just describe the calculation in plain language.
Describe the calculation, specify the Excel version, name the actual columns or cell references involved, give an example of the expected input and output, and note any edge cases like blank cells or negative values.
Ask Claude to write the formula and then test it yourself.
Paste the entire spreadsheet and ask Claude to identify what formula is needed.
===
You use Claude to generate Python code for cleaning a dataset. Before running the code, what is the most important step?
Run it immediately since Claude's code is generally reliable.
Read through the code to understand what it does, test it on a small sample of data first, and verify the output matches expectations before applying it to the full dataset.
Ask Claude to verify its own code before you run it.
Only run Claude-generated code if you are a trained programmer.
===
What is the most effective prompt for getting Claude to help restructure a wide-format dataset into a long-format one?
"Restructure my data."
"Convert this dataset from wide format to long format. Currently each row is a customer with columns for Month1_Sales, Month2_Sales, Month3_Sales. I need each row to represent one customer-month combination with columns: CustomerID, Month, Sales. Here is a sample of the current structure: [paste sample]."
"Transform the data to the correct format for analysis."
"Make the data longer."
===
You ask Claude to help you clean customer names in a dataset — standardising capitalisation, removing special characters, and trimming whitespace. Claude provides a Python script. What additional instruction ensures the script is safe to run?
"Make the script faster."
"Add a step that creates a backup copy of the original data before making any changes, and print the first 10 rows before and after transformation for manual verification."
"Add error handling for all possible exceptions."
"Make the script work for any type of data, not just names."
===
A dataset has 15% missing values in a key column. You ask Claude how to handle them. Claude suggests three methods. How should you select between them?
Choose the method Claude ranks as most accurate.
Select based on the business context — what missing data means in this domain, whether the missingness is random or systematic, and what the downstream analysis requires — not on generic statistical merit alone.
Always choose the simplest method Claude suggests.
Use all three methods and average the results.
===
What is the safest way to use Claude for processing data that contains personally identifiable information (PII)?
Paste the data with PII directly — Claude's responses are private.
Anonymise or pseudonymise the PII before sharing with Claude, work with a representative sample that excludes real individuals, or use a Claude deployment that meets your organisation's data privacy requirements.
Only share data with Claude if the individuals have given consent.
PII data should never be processed with any AI tool.
===
You want Claude to help you create a data validation framework for incoming monthly sales reports. What makes this a good AI-assisted workflow?
Data validation is too sensitive for AI involvement.
The task is well-defined (consistent monthly reports), the validation rules can be explicitly specified, outputs are verifiable, and once built the framework runs reliably — making it an ideal candidate for AI-assisted development.
You would need a data engineer to implement any AI-assisted validation.
AI can only validate data formats, not business logic rules.
===
You ask Claude to help merge two datasets on a common key. After the merge, the row count is unexpected. What should you investigate first?
The AI made an error — request the merge again.
Understand the join type used (inner, left, right, full outer) and whether it matches your analytical intent, check for duplicate keys in either dataset that would inflate the row count, and verify the key column formats match exactly.
Reduce the dataset size and try again.
Switch to a different AI tool for data merging tasks.
===
What is the most productive way to use Claude when you are stuck on a complex data transformation you cannot figure out?
Ask Claude to solve the entire transformation without explaining the logic.
Describe the exact starting structure and desired output structure with small examples, explain what you have already tried and why it did not work, and ask Claude to explain its approach — not just provide code.
Share the full dataset and ask Claude to figure out the transformation.
Try a different approach entirely rather than using AI for stuck points.
===
You need to combine data from three different systems, each with slightly different naming conventions for the same fields. What is the most effective AI-assisted approach?
Ask Claude to automatically detect and match fields across all three systems.
Build a field mapping table manually (which field in system A corresponds to which in B and C), then use Claude to help generate the transformation logic based on that explicit mapping.
Trust Claude to infer the correct field mappings from the data content.
Standardise the fields manually in each system before using any AI assistance.
===
What is the most important quality check after using AI to help generate a data cleaning script?
Check that the code is well-commented.
Run the script on a sample with known characteristics and verify that every transformation produced exactly the expected result — checking both that correct values were transformed correctly and that edge cases were handled as intended.
Have another AI tool review the code for errors.
Check that the script runs without producing error messages.
===
A stakeholder asks you to add a new data source to an existing AI-assisted analysis pipeline. What is the most important first step?
Add the new data source and re-run the pipeline immediately.
Understand the new data source's structure, quality, update frequency, and how it relates to existing data — then assess whether the existing pipeline logic handles the new source correctly or requires modification.
Ask AI to assess whether the new data source is compatible.
Check whether the AI tool can process the new data format.
===
What is the most effective use of Claude for automating repetitive monthly data reporting tasks?
Have Claude generate the full report automatically every month without any human review.
Use Claude to generate the standardised sections of the report from structured data inputs, with a human review checkpoint for contextual commentary, anomaly flagging, and executive-facing conclusions.
Use Claude only to format the data tables — write all commentary manually.
Monthly reporting is too sensitive for AI involvement at any stage.
===
You use Claude to help generate a data dictionary for a new dataset. What makes this an ideal AI-assisted task?
Because AI can access the data source systems directly to generate accurate definitions.
Because the task is structured (consistent format for each field), time-consuming to do manually for large datasets, and the AI draft provides a useful starting point that a domain expert can review and refine — rather than starting from scratch.
Because AI-generated data dictionaries are always more accurate than human ones.
Because data dictionaries do not require domain knowledge to produce accurately.
===
Your stakeholder says: "I want a dashboard that shows everything." What is the most effective analyst response?
Build the most comprehensive dashboard possible.
Work with the stakeholder to identify the three to five decisions they need to make regularly, and build the dashboard around the metrics that most directly inform those decisions — 'everything' produces dashboards that nobody uses.
Ask AI to determine the most important metrics for the stakeholder's role.
Build a prototype of everything and let the stakeholder choose what to keep.
===
You use Claude to help write the narrative commentary for a monthly BI report. What is the most important constraint to include in your prompt?
"Write clearly and professionally."
"Base the commentary only on the data metrics I provide. Do not add context, benchmarks, or comparisons that are not in the data I share. Flag any metric that looks anomalous for human review rather than explaining it away."
"Write a comprehensive analysis of all trends in the data."
"Make the commentary suitable for a general business audience."
===
A key metric in your dashboard shows a 15% decline month-on-month. You ask Claude to explain it. What is the most appropriate role for Claude's response?
Report Claude's explanation directly to stakeholders as the confirmed reason.
Use Claude's response as a hypothesis list — possible explanations to investigate with additional data — not as a confirmed diagnosis that can be reported without further investigation.
Trust Claude's explanation if it cites specific data patterns.
Ask Claude the same question three times and take the most common explanation.
===
What is the most effective AI-assisted approach to building a new metric framework for a business function that has not been measured systematically before?
Ask Claude to recommend the standard metrics for that business function.
Work with function stakeholders to identify their goals and decisions, use Claude to research relevant metric frameworks and translate them to your context, then validate the proposed metrics with domain experts before building any dashboards.
Build dashboards first and identify metrics based on what data is available.
Adopt whatever metrics Claude recommends as they are based on industry best practices.
===
You are asked to build a self-service analytics capability for a non-technical business team. What is the most important design consideration?
Ensure the tool has the most features possible.
Design for the decisions the team needs to make, not for the analyst's capability — using language, filters, and visualisations that match how the business team thinks about their work, not how the data is structured.
Use the most advanced BI tool available.
Build the capability so non-technical users can also write SQL queries.
===
What is "metric inflation" and how does AI assistance increase its risk?
When a dashboard displays too many metrics on a single screen.
When metrics are selected or framed to make performance look better than it is — a risk with AI assistance because AI can generate plausible metric definitions and interpretations that serve the desired narrative without explicitly questioning whether they are honest.
When AI-generated metrics use overly precise decimal places.
When dashboards include too many AI-generated visualisations.
===
A stakeholder requests a forecast of next year's revenue based on this year's data. You use Claude to help build the forecast model. What is the most important caveat to include in your output?
That the forecast was AI-generated.
That the forecast is based on specified assumptions about market conditions, growth patterns, and external factors — and that changes in those assumptions (which are uncertain) will materially change the forecast output.
That the forecast may not be 100% accurate.
That you used AI assistance in building the model.
===
What is the most appropriate use of AI in designing data visualisations?
Ask AI to select the best chart type for any dataset automatically.
Use AI to draft visualisation options and write the narrative around them — then apply human judgment about which visualisation most clearly communicates the specific insight to the specific audience.
AI cannot contribute to data visualisation design.
Trust AI visualisation recommendations completely since they are based on data visualisation best practices.
===
You need to explain a complex statistical concept to a non-technical business audience. What is the most effective AI-assisted approach?
Have Claude write a full statistical explanation and share it directly.
Ask Claude to generate several plain-language explanations at different simplicity levels — then select and refine the one most appropriate for your specific audience, adding business-relevant examples they will recognise.
Avoid explaining statistical concepts to non-technical audiences.
Ask Claude to create a technical diagram that explains the concept visually.
===
What is the difference between a "vanity metric" and an "actionable metric" and how does this distinction affect AI-assisted BI work?
Vanity metrics are visual and actionable metrics are numerical.
A vanity metric looks impressive but does not connect to decisions or outcomes (e.g. total website visits); an actionable metric directly informs a decision (e.g. conversion rate by traffic source). AI will build dashboards around whatever metrics you specify — ensuring you specify actionable ones is the analyst's responsibility.
AI tools automatically filter out vanity metrics from dashboards.
Vanity metrics are fine for external reporting; actionable metrics are for internal use.
===
You are presenting AI-generated analysis to a senior executive who is sceptical of AI. What is the most effective approach?
Lead with the fact that AI was used to demonstrate innovation.
Lead with the insight and the evidence — data, validation, and business implication. Mention AI assistance as part of the methodology if relevant, but the credibility comes from the rigour of verification and the clarity of the recommendation.
Do not mention AI involvement to avoid scepticism.
Have the AI generate a second version of the analysis as a cross-check.
===
What is the most common reason BI dashboards fail to drive business decisions despite being technically correct?
The dashboards use the wrong data visualisation tools.
The dashboards were designed around data availability rather than decision needs — they show what exists in the database rather than what the decision-maker needs to see at the point of making a decision.
Business users are not technically sophisticated enough to use dashboards.
Dashboards require too much maintenance to remain accurate.
===
How should an analyst handle a situation where AI-generated analysis conflicts with the business team's intuition about performance?
Always trust the data over business intuition.
Investigate the conflict — it may reveal a data quality issue, a definition mismatch, an analytical error, or a genuine performance surprise. Both the data and the intuition contain information; the conflict is a signal worth understanding.
Always trust business intuition over AI-generated analysis.
Present both perspectives to senior leadership and let them decide.
===
What is the most effective way to use Claude to prepare for a data review meeting with sceptical stakeholders?
Ask Claude to predict what questions the stakeholders will ask.
Share the analysis with Claude and ask it to steelman the critique — identify the weakest assumptions, the most likely objections, the data quality concerns a sceptic would raise — then prepare responses to each.
Ask Claude to confirm that the analysis is correct before the meeting.
Use Claude to simplify the analysis to avoid sceptical questions.
===
What is the ultimate test of whether an AI-assisted BI investment has succeeded?
Whether the dashboards are visually impressive and stakeholders comment positively on them.
Whether the analysis and dashboards are actually used to inform decisions — and whether those decisions are better informed and more consistent than before AI assistance was introduced.
Whether the analyst spends less time on reporting tasks.
Whether the AI tools used are the most advanced available.
===
You need to write a SQL query to find the top 10 customers by revenue in the last 90 days. Which prompt gets the most useful result from Claude?
"Write a SQL query for top customers."
"Write a SQL query to return the top 10 customers by total revenue for the 90 days ending today. Table: orders. Relevant columns: customer_id, order_date, revenue. Sort descending by revenue. Use standard SQL compatible with PostgreSQL."
"Help me with SQL."
"Find top customers in my database."
===
Claude generates a Python script for data analysis. You run it and get an error message. What is the most effective next step?
Ask Claude to "fix the error."
Paste the full error message into Claude along with the relevant section of code and your data structure, and ask Claude to diagnose the specific error — the error message contains the information needed to fix the problem.
Try running the script again in case it was a temporary error.
Rewrite the entire script from scratch.
===
What is the most appropriate way to use Claude for Excel formula work?
Ask Claude to access your Excel file directly.
Describe the calculation you need in plain language with the actual column names and a small example, get the formula from Claude, test it on sample data manually, and verify the result matches expectations before applying it broadly.
Ask Claude to write a macro that does everything automatically.
Trust Claude's Excel formulas completely since they are based on Excel documentation.
===
You want to use Claude to help build a Python script that automates your weekly data export and formatting process. What is the most efficient approach?
Ask Claude to write the complete script in one prompt.
Describe the full process step by step, build and test each step separately before combining them, and have Claude explain each section — enabling you to maintain and modify the script without having to rebuild it from scratch if something changes.
Ask Claude for a script template and fill in the details yourself.
This type of automation always requires a dedicated software developer.
===
What is the most valuable way to use AI assistance when working with an unfamiliar BI tool like Tableau, Power BI, or Looker?
Ask AI to use the BI tool directly on your behalf.
Use Claude to understand the concepts and find the specific menu paths, feature names, and approach to implement what you need — then apply that guidance yourself in the tool.
Switch to a different BI tool that you already know well.
AI cannot help with tool-specific BI questions.
===
You need to merge two Excel tables on a common key and identify records that exist in one but not the other. You have basic Excel skills. Which approach is most appropriate?
Ask Claude to perform the merge directly in your Excel file.
Describe the tables, their structure, and what you need to achieve — ask Claude to provide step-by-step instructions using VLOOKUP or XLOOKUP, or an alternative approach like Power Query, with explanations of each step.
This task requires Python and cannot be done in Excel.
Ask Claude to write a macro that does the merge automatically.
===
What is the most important consideration when using AI-generated SQL in a production database environment?
Whether the SQL runs without error messages.
Whether the SQL has been reviewed by someone with authority to run queries on that database, tested in a development environment first, and checked for potential performance impacts on other systems sharing the database.
Whether Claude has confirmed the SQL is correct.
Whether the SQL uses the latest SQL syntax.
===
You want to use Claude to help you understand a complex Python script someone else wrote. What is the most effective prompt?
"Explain this code."
"Explain this Python script section by section. For each section, describe: what it does, why it might be structured this way, what inputs it expects, and what outputs it produces. Flag any parts that look unusual or potentially problematic."
"Rewrite this code in simpler terms."
"Tell me if this code has any bugs."
===
Which of the following is the best use of Claude for a Tableau dashboard project?
Asking Claude to connect to your Tableau Server and build the dashboard.
Using Claude to help design the dashboard structure and metric hierarchy before building — what views to include, what filters are needed, how to organise the layout — then building in Tableau yourself.
Asking Claude to write Tableau-specific code to automate the entire dashboard.
Claude cannot assist with Tableau projects.
===
You use Claude to help write a DAX formula for a Power BI calculation. The formula produces unexpected results. What should you investigate first?
Assume Claude's formula is correct and look for a data error.
Check whether the formula uses the correct evaluation context for your specific data model — row context versus filter context is the most common source of unexpected DAX results — and provide this context information to Claude when asking for help.
Ask Claude to rewrite the formula in a simpler way.
Switch the calculation to SQL instead of DAX.
===
What is the most effective workflow for using Claude to help build a repeatable Python-based data pipeline?
Ask Claude to write the complete pipeline and deploy it immediately.
Design the pipeline stages conceptually first, use Claude to build and test each stage separately, document the logic as you go, and build error handling at each stage before integrating into the full pipeline.
Have Claude write the pipeline and test it on a subset of real production data.
Repeatable Python pipelines always require a dedicated engineer.
===
An analyst without Python experience wants to use Claude to automate a repetitive data task. What is the most important consideration?
They should learn Python before using Claude for any coding tasks.
They should understand what the code does at a conceptual level — even without writing it themselves — so they can verify it is doing the right thing, debug obvious errors, and maintain it as requirements change.
Claude-generated Python requires no understanding to use safely.
They should use a no-code tool instead of Claude for Python tasks.
===
What is the most valuable analytical skill in an AI-assisted tool environment?
Knowing how to use the most AI tools.
The ability to specify what you need precisely and evaluate whether the AI's output meets that specification — because AI tool assistance is only as good as the clarity of the requirement and the rigour of the review.
Learning to code Python fluently to supplement AI-generated code.
Speed — being able to use AI tools faster than colleagues.
===
What is the most appropriate attitude toward AI coding assistance for analysts who are not professional programmers?
Avoid AI coding assistance entirely until you have learnt to code properly.
Use AI coding assistance as an accelerator for clearly defined, testable tasks — understanding that you remain responsible for verifying outputs and that the skill gap should be managed through conceptual understanding and rigorous testing.
Trust AI-generated code completely since it is written by a more capable programmer than you.
Only use AI coding assistance for tasks you could also do manually.
===
A new AI-powered analytics tool claims to make analysts redundant by "automatically generating insights from raw data." What is the most professionally accurate assessment?
This is correct — the best analytics tools do eliminate the need for analysts.
The tool can accelerate data processing and surface statistical patterns efficiently, but the analytical judgment required to frame the right questions, interpret results in business context, ensure data quality, and translate findings into decisions remains a human responsibility.
This claim should be dismissed as pure marketing with no technical substance.
This is correct for structured data but not for unstructured data.
===
What is "p-hacking" and why does AI assistance increase the risk of it?
A method of optimising Python code for better performance.
Running multiple statistical tests until one produces a significant result — presenting that test as if it were the pre-planned analysis. AI tools that quickly run many tests make it faster to do this, increasing the risk if not managed deliberately.
Using AI to hack into a protected database.
A type of data manipulation that only affects small datasets.
===
An analyst presents an AI-generated analysis with a conclusion that supports the sponsor's preferred outcome. The analysis was not independently verified. What is the professional concern?
The concern is only relevant if the analysis turns out to be wrong.
The analysis may reflect confirmation bias — selecting or framing AI outputs that support the desired conclusion without rigorous verification of alternatives. Professional analytical standards require independence from outcome preferences.
Sponsoring stakeholders are always the most reliable validators of analysis.
The concern is only relevant if the analysis is used externally.
===
What is the most important professional obligation when sharing AI-assisted analysis with external clients or regulators?
Disclosing the AI tool used in every report.
Ensuring that all claims, statistics, and conclusions have been verified for accuracy by the analyst — and that the analyst takes full professional accountability for the content regardless of whether AI assisted in producing it.
Obtaining written consent from clients to use AI tools.
External audiences do not need to know about AI assistance in analysis.
===
What does "analytical reproducibility" mean and how does AI assistance affect it?
The ability to reproduce any analysis using the same AI tool.
The ability to reproduce the same result from the same data using the same method — a professional standard that requires documenting AI prompts, tool versions, and methodology alongside the analysis output.
Reproducibility is only relevant for scientific research, not business analysis.
AI assistance automatically improves reproducibility by standardising the analysis process.
===
A team member uses AI to generate a forecast and presents it with false precision — "revenue will be exactly £2,347,891 next quarter." What is the analytical concern?
The concern is the specific revenue figure, which may be wrong.
False precision misleads stakeholders into treating a probabilistic estimate as a certainty — the presentation should communicate the uncertainty range and key assumptions that drive the forecast, not a single point estimate that implies false accuracy.
Forecasts should always be rounded to avoid this problem.
False precision is only a concern in regulated financial reporting contexts.
===
What is "model overfitting" in simple analytical terms and why does it matter for AI-assisted analysis?
When an AI model generates too many outputs for the analyst to review.
When an analytical model is tuned so precisely to historical data that it fails to generalise to new data — producing excellent past performance metrics but poor predictive accuracy. AI tools that optimise aggressively can produce overfitted models that look impressive but perform poorly.
When AI tools take too long to process large datasets.
When a dashboard model includes too many metrics.
===
You discover that a widely-used AI-assisted analysis at your company contains a systematic error that has influenced several business decisions. What is the professional response?
Quietly correct the error in the next report without flagging the past issue.
Disclose the error to relevant stakeholders immediately, document the scope of the impact, correct the analysis, and implement a process improvement to prevent similar errors — even if it is professionally uncomfortable.
Wait to see if the decisions influenced by the error produce bad outcomes before raising the concern.
The AI tool manufacturer is responsible for the error and should be notified first.
===
What is the most important analytical standard for using AI to support a decision with significant financial or operational consequences?
Using the most capable AI model available.
Independently verifying all key inputs, assumptions, and conclusions — treating AI output as a draft that requires the same rigorous review as if it were produced by a junior analyst on their first month.
Having the AI tool generate a confidence score for its analysis.
Ensuring the analysis was reviewed by the AI tool's developer.
===
A dataset shows clear demographic differences in an outcome metric. You use AI to help interpret these differences for a business report. What is the most important professional consideration?
Report the differences as the AI has described them.
Ensure the interpretation distinguishes between observed statistical differences and causal claims — and that the framing does not inadvertently reinforce stereotypes, suggest discrimination, or draw conclusions about groups that the data does not support.
Omit demographic analysis from business reports to avoid controversy.
Demographic data should always be handled by HR, not analytical teams.
===
What is the professional responsibility of an analyst who suspects that an AI-generated insight is directionally correct but based on flawed reasoning?
Use the insight if the direction is correct — the reasoning details do not matter.
Investigate the reasoning, identify the flaw, and either correct it or discard the insight — directionally correct conclusions built on flawed reasoning can lead to wrong decisions when applied in different contexts.
Present both the insight and the reasoning concern to stakeholders and let them decide.
Flag the concern in a footnote and proceed with the analysis.
===
What distinguishes an analyst with AI fluency from one who simply uses AI tools?
The AI-fluent analyst uses more advanced AI tools.
The AI-fluent analyst maintains analytical judgment throughout — using AI to accelerate mechanical work while applying critical thinking, domain knowledge, and professional standards at every step where judgment is required.
The AI-fluent analyst produces analysis faster than non-AI users.
The AI-fluent analyst can explain how the AI tools work technically.
===
What is the most important ethical obligation when using AI to analyse data about real people?
Ensuring the AI tool has been approved for data processing by the IT team.
Ensuring the analysis is used only for its stated purpose, that individuals' privacy is protected at every stage, and that findings are not used to disadvantage individuals in ways they have not consented to.
Only using anonymised data for any AI analysis.
Informing each individual whose data is being analysed.
===
What is "analytical humility" and why is it especially important in AI-assisted analysis?
Admitting when you do not know how to use an AI tool.
The professional practice of acknowledging the limitations, assumptions, and uncertainty in your analysis — especially important with AI assistance because AI produces confident-sounding outputs even when underlying uncertainty is high.
Being modest about your analytical achievements to avoid seeming arrogant.
Acknowledging that AI tools are smarter than human analysts.
===
A stakeholder asks you to use AI to find data that proves their hypothesis. What is the professionally correct response?
Use AI to find the supporting data as requested — stakeholder satisfaction is important.
Explain that the analytical objective is to test the hypothesis rigorously, not to confirm it — and offer to use AI to run a proper analysis that examines both supporting and contradicting evidence.
Decline to use AI for any hypothesis testing — this should be done manually.
Use AI to find the supporting data, but also find contradicting data to present alongside it.
===
What is the most important professional standard that remains constant regardless of how AI tools evolve?
Staying current with the latest AI tools and techniques.
Maintaining full accountability for analytical outputs — ensuring findings are accurate, interpretations are honest, limitations are disclosed, and conclusions are defensible — regardless of how much AI assistance was used to produce them.
Using AI assistance only for lower-risk, non-critical analytical tasks.
Documenting AI tool usage in every analytical report.
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

export const ANALYSTS_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the pool, options shuffled.
export function getAnalystsSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
