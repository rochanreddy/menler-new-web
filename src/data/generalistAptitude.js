// AI Generalist question bank — Entry Diagnostic (75) + Level Up (75) = 150.
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// Option order is shuffled at session build.
//
// getGeneralistSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
You receive an AI output that contains a confidently stated incorrect fact. The correct framing is:
The AI model version you used is outdated — upgrade it.
*AI outputs are starting points that require human verification.
AI is unreliable and should not be used for factual tasks.
You prompted incorrectly — a better prompt would prevent this.
===
A colleague says "I don't trust AI — it makes things up." The most accurate and constructive response is:
"You're right — AI is unreliable for professional use."
"AI is reliable as long as you use the right tool for the task."
"That concern is outdated — modern AI is much more accurate."
*AI has known failure modes but also genuine strengths worth understanding.
===
What distinguishes a generative AI model from a traditional software program?
*It produces novel outputs from statistical patterns, not explicit rules.
It can access the internet to retrieve up-to-date information.
It runs faster than traditional programs on the same hardware.
It makes decisions without any human input or instruction.
===
Which of the following most accurately describes what Claude "knows"?
A verified encyclopaedia of facts maintained by Anthropic.
Real-time information retrieved from the internet on demand.
*Statistical patterns from training data that approximate knowledge.
Expert knowledge contributed by domain specialists.
===
A prompt engineer says "prompt quality determines output quality." How accurate is this?
Inaccurate — model size matters far more than prompt quality.
*Largely accurate — prompt quality is the highest-leverage input.
Partially accurate — only for creative tasks, not factual ones.
Inaccurate — all prompts to a good model produce good outputs.
===
What is the most important practical difference between Claude and a search engine?
*Claude synthesises and generates; a search engine retrieves and ranks.
Claude is more accurate for factual queries than a search engine.
Claude provides citations while a search engine only shows links.
Claude is faster than a search engine for complex research tasks.
===
You are building a workflow that uses Claude to process customer emails. Which risk must you design for first?
Claude may run too slowly for high-volume email processing.
Claude may respond in a language the customer did not use.
Claude may generate responses that are too long for emails.
*Claude may misclassify or misrespond to some customer emails.
===
Why is it important to understand what a model's context window is before building with it?
It determines which languages the model can respond in.
It determines the maximum accuracy of the model's outputs.
*It determines how much input and conversation the model can process.
It determines which API endpoints are available to developers.
===
A manager asks you to "automate this process using AI." The correct first step is:
*Map the process and identify which steps AI can actually handle.
Select the AI tool and start building the automation immediately.
Ask the manager which AI tool they want you to use.
Estimate the cost savings before designing the solution.
===
What does "temperature = 0" mean in practice when using a language model API?
The model refuses to generate any creative or subjective content.
The model runs at reduced speed to improve accuracy.
The model caps response length at a conservative limit.
*The model produces the most probable, deterministic output.
===
You need Claude to output structured JSON. The most reliable approach is:
Ask Claude to "output JSON" without additional instructions.
*Specify the exact JSON schema in the prompt and use low temperature.
Use Claude only if it has a dedicated JSON output mode.
Generate the output and manually convert it to JSON afterward.
===
What is the most common mistake people make when first using Claude for work tasks?
Over-specifying the task with too much context and detail.
Using Claude for tasks that require real-time information.
*Giving vague instructions and expecting Claude to infer the details.
Relying on Claude before verifying it can handle the task type.
===
An AI Generalist's core skill is best described as:
Being able to code AI models and train them on custom data.
Mastering every AI tool available in their professional domain.
Understanding the mathematical foundations of machine learning.
*Knowing how to direct AI across varied tasks to produce useful outputs.
===
You run the same Claude prompt 10 times. 8 of 10 responses are correct and 2 are wrong. For a professional workflow, you should:
Accept the 80% accuracy rate — it is commercially acceptable.
*Design the workflow to catch and handle the 2 wrong outputs.
Switch to a different AI tool with a higher accuracy rate.
Run the prompt 3 times and take the majority answer.
===
Which statement about AI tools is most useful to hold as a working principle?
*AI is a powerful tool that requires human judgment to use safely.
AI tools are either reliable or unreliable — know which is which.
AI is becoming more reliable and will soon require less oversight.
AI tools are only safe when used for their explicitly intended purpose.
===
You ask Claude to help you prepare for a difficult conversation with a colleague. The best prompt includes:
Only the topic — Claude infers context from professional settings.
The outcome you want — Claude will determine how to get there.
*The context, the relationship, the goal, and the constraints.
The colleague's behaviour — Claude can assess their personality.
===
You are using Claude to help plan a complex project. The most valuable use is:
*Generating a first-pass plan you then stress-test against your knowledge.
Producing a final project plan the team can immediately follow.
Replacing the need for a project manager on smaller projects.
Creating the project timeline automatically from your calendar.
===
What is "prompt chaining" and why is it useful?
Connecting multiple AI tools in sequence to process the same input.
Saving a series of prompts to reuse across different conversations.
Running the same prompt simultaneously across multiple models.
*Breaking complex tasks into sequential prompts where each builds on the last.
===
A colleague shares a prompt that works well for them. You try it and get poor results. The most likely reason is:
The prompt was overfit to one model and does not transfer.
*Your task or context differs from theirs — prompts are context-specific.
The prompt was shared incorrectly and has formatting errors.
You need to run it several times to get a result matching theirs.
===
You are reviewing a long Claude output. Which part should you scrutinise most carefully?
The opening paragraph — AI models front-load errors.
The conclusion — AI models drift from the brief toward the end.
*Specific figures, dates, names, and citations — highest hallucination risk.
Formatting and structure — these are the most common failure points.
===
What does it mean to "engineer a prompt" rather than just "write a prompt"?
Using technical coding skills to pass prompts through an API.
Writing prompts in a structured format that AI tools can parse.
Testing a prompt across multiple AI models before using it.
*Deliberately designing each element of the prompt for a specific outcome.
===
You use Claude to draft a report and it produces 80% of what you need. The right next step is:
*Edit, restructure, and complete the remaining 20% yourself.
Prompt Claude again to add the missing 20% in one step.
Accept the 80% — it is production-ready with minor formatting.
Ask Claude to identify what is missing from its own output.
===
Which sign indicates someone is using AI as a tool effectively rather than passively?
They ask Claude for help on every task before attempting it themselves.
*They evaluate AI output critically before deciding whether to use it.
They use the most expensive AI model available for all tasks.
They check AI outputs for formatting errors before submitting.
===
You want to use Claude consistently across your team. The most important first step is:
Ensure every team member has a Claude account and access.
Identify which team member will manage Claude interactions.
Select the Claude model tier that fits your budget.
*Define what tasks Claude will handle and establish quality standards.
===
What is the best mental model for AI in a professional context?
An expert advisor whose recommendations can be trusted directly.
A search tool that retrieves answers from a large knowledge base.
*A capable junior colleague who works fast but needs oversight.
A creative tool useful only for ideation and brainstorming.
===
You discover that a prompt that worked last week produces worse results today. The most likely cause is:
Your internet connection affects Claude's response quality.
*The model may have been updated, changing its behaviour.
The prompt degraded because it was used too many times.
Claude memorised your previous conversations and changed strategy.
===
What is the most appropriate response when Claude says "I'm not sure about this"?
*Treat the output as lower-confidence and verify the key claims.
Ask Claude the same question again for a more confident answer.
Discard the output entirely — uncertainty means the answer is wrong.
Accept the answer — Claude is unusually honest when uncertain.
===
You need Claude to maintain a consistent tone across a long document. The best approach is:
Generate the document in one prompt to maintain consistency.
Ask Claude to "maintain consistent tone" throughout.
*Provide a style guide or tone example at the start of your prompt.
Generate each section separately and edit tone manually at the end.
===
Which approach produces the best AI-assisted research output?
Use AI to find and summarise sources, then compile its summaries.
Use AI exclusively since it has processed more research than any human.
Use AI only to format and structure research you have already done.
*Use AI to generate hypotheses and structures, verify facts from primary sources.
===
A generalist should be able to explain why AI sometimes fails on a task. Which explanation is most accurate?
The model is not large enough for that task type.
*The task requires precision or real-time data outside AI's design strengths.
The task was too complex for any current AI system to handle.
Insufficient training data exists for that specific task.
===
You want Claude to write a client email that sounds like you. The most effective prompt element is:
*A sample of your previous emails as a tone reference.
A list of words you prefer and words to avoid.
An instruction to write in first person and sound natural.
Your name and job title for personalisation.
===
You ask Claude to write a 500-word summary. It produces 750 words. The most effective fix is:
"Make this shorter."
"Cut 250 words from this summary."
*"Rewrite this as exactly 500 words. Do not add new points — compress the existing ones."
"Summarise this summary in 500 words."
===
What is the most reliable way to get Claude to produce a structured output format every time?
Use the phrase "always follow this format" in the instructions.
*Provide the exact template or schema you want in the prompt.
Ask Claude to review its output for format compliance.
Generate multiple outputs and select the one with the right format.
===
You want Claude to generate 10 marketing taglines for your product. You keep getting similar options. The fix is:
Ask for 10 more taglines and select from the combined 20.
Switch to a more creative AI tool built for copywriting tasks.
Run the same prompt 5 times and take the best from each.
*Add constraints that force variety — different emotions, audiences, or lengths.
===
Which prompt technique most improves the accuracy of factual AI outputs?
*Ask Claude to cite evidence or reasoning for each claim it makes.
Ask Claude to rate its own confidence on a 1-10 scale.
Ask Claude to search the internet for supporting evidence.
Ask Claude to list what it does not know before answering.
===
You want to use Claude to prepare an executive summary. The summary should contain no information that is not in the source document. The best instruction is:
"Write an accurate executive summary of this document."
*"Summarise only information explicitly present in this document. Do not add external context."
"Summarise this document without adding opinions."
"Do not hallucinate when summarising this document."
===
What does "few-shot prompting" mean?
Running the same prompt a few times and selecting the best output.
Using a short, concise prompt rather than a long detailed one.
Giving Claude a few tries to produce an acceptable output.
*Including examples of desired inputs and outputs in the prompt.
===
A client asks you to produce a document using AI. You should:
Disclose that AI produced it and let the client decide whether to use it.
Only use AI if the client has explicitly approved AI use.
*Use AI to draft it, then review, verify, and own the final output.
Not use AI for client deliverables — only for internal work.
===
You use Claude to write a proposal and it sounds generically professional but lacks your company's specific value proposition. The cause is:
Claude cannot write specific business proposals — only general ones.
*The prompt did not include your company's differentiated positioning.
The proposal genre is too structured for AI to handle effectively.
Claude's training data does not include specialised business writing.
===
Which of these represents the most advanced prompting behaviour?
*Iterating on output by providing specific, targeted improvement instructions.
Writing the longest, most detailed possible initial prompt.
Using multiple AI tools on the same task and comparing outputs.
Memorising the best prompts for each task type in your work.
===
You need Claude to maintain the same tone and approach across 20 different outputs. The most efficient approach is:
Copy-paste the best previous output as context for each new prompt.
Review and manually align tone across all 20 outputs after generation.
*Create a reusable system prompt that defines tone, role, and constraints.
Generate all 20 in one prompt with consistent instructions.
===
What is the clearest signal that an AI output requires significant human intervention before use?
It is longer than what you asked for.
It does not match the exact format you requested.
It sounds too polished and formal for the context.
*It contains specific figures or claims that are hard to verify quickly.
===
A new team member asks: "What is the most important thing to know about working with Claude?" The best answer is:
"Use it for creative tasks but avoid it for factual research."
*"Claude generates plausible text — verify anything that matters."
"The more detailed your prompt, the better the output."
"Claude is reliable for most professional tasks if you use it correctly."
===
You want Claude to generate ideas that are genuinely different from its first response. The best approach is:
Increase the temperature setting and regenerate the same prompt.
Use a different AI tool which may have different training data.
*Ask for ideas that explicitly avoid the approaches in the first response.
Ask Claude to evaluate and critique its first response before generating more.
===
Which professional task is least suited to AI assistance right now?
*Making a final legal judgment in a contested regulatory dispute.
Drafting a first version of a legal argument for attorney review.
Summarising case precedents from a set of provided documents.
Generating a list of research questions for a legal brief.
===
What is the correct order of operations when using AI to analyse a dataset?
Upload the data, run AI analysis, and present the outputs directly.
Clean the data with AI first, then define the question, then analyse.
Run exploratory AI analysis first to discover what questions to ask.
*Define the question first, then use AI to analyse, then verify key outputs.
===
Which combination of tools is most powerful for a knowledge worker using AI?
Claude plus a second AI tool to cross-check Claude's outputs.
*Claude for generation and synthesis, plus a primary source for verification.
Claude plus a premium plan for guaranteed higher accuracy.
Claude plus an AI writing checker to validate quality before use.
===
You are evaluating whether to use AI for a specific task at work. The most important question is:
"Which AI tool has the highest accuracy rating for this task type?"
"Is this task in the list of approved AI use cases at my company?"
*"What happens when AI gets this wrong and how will I catch it?"
"How much time will AI save me compared to doing it manually?"
===
What does a well-designed AI workflow always include?
*A human checkpoint to review and validate AI outputs before they matter.
A fallback to a different AI tool if the primary one fails.
A manual alternative process in case the AI is unavailable.
A logging system that records all AI inputs and outputs.
===
You are building an AI-assisted customer service workflow. The most important metric to track is:
The average response time of the AI compared to human agents.
The percentage of queries handled without human intervention.
The cost per query with AI versus without AI.
*The rate of customer complaints or escalations from AI responses.
===
Which workflow task is most appropriate to delegate entirely to Claude without human review?
Drafting a response to a customer complaint about a billing error.
Summarising a competitor's product features from a specification.
*Formatting a meeting transcript into a consistent structure.
Generating a project risk assessment for a client proposal.
===
What is the most important reason to document the prompts you use for professional work?
*So you can reproduce reliable outputs and improve them over time.
So you can prove to clients that AI was used professionally.
So you can train your own AI model on effective prompt patterns.
So you comply with your company's AI usage logging policy.
===
You use Claude to generate 5 customer persona profiles. Before using them, you should:
Ask Claude to check whether the personas are realistic.
*Validate them against real customer data or research.
Add your team's subjective preferences to each persona.
Use the personas directly — AI personas are built from broad patterns.
===
What is the key difference between using AI as a "co-pilot" versus using AI as an "autopilot"?
Co-pilot is for creative tasks; autopilot is for repetitive tasks.
Autopilot is more reliable than co-pilot for professional output.
*Co-pilot means you remain in control; autopilot means AI makes decisions.
Co-pilot requires technical skills; autopilot does not.
===
You use AI to generate a client-facing presentation. The most important pre-send check is:
Ensure the formatting and visual design meet brand standards.
Confirm the length and structure match the client's preferences.
Check that the language is appropriately formal for the client.
*Verify every factual claim, figure, and recommendation for accuracy.
===
What is the most effective way to use AI for decision-making support?
*Use AI to map options and tradeoffs, then apply your own judgment.
Use AI to recommend the best decision based on your inputs.
Use AI to validate your instinct before taking action.
Use AI to identify the option with the highest probability of success.
===
You are using Claude in a meeting to take live notes and action items. The most important post-meeting step is:
Share the notes immediately — AI is faster than human review.
*Review and correct the notes before sharing with attendees.
Ask Claude to clean up and finalise the notes before sending.
Send the raw notes and ask attendees to correct their own action items.
===
Which of these represents the highest-maturity level of AI use in a professional context?
Being faster than colleagues at completing tasks using AI tools.
Using AI for every task in your daily workflow without exception.
Knowing which AI tool to use for each category of work task.
*Designing AI-enabled systems that others in the team can use reliably.
===
What should a professional do when AI generates a response that confidently contradicts their domain expertise?
*Investigate carefully — the AI may be wrong, or they may have a gap.
Trust their expertise over AI — human domain knowledge is more reliable.
Trust the AI — it has processed more information on the topic.
Run the same query through a different AI to resolve the conflict.
===
What is "prompt drift" and why does it matter?
AI models produce lower quality outputs after extended use.
Prompts become less effective when used by many different people.
*Output quality degrades over a long conversation as context accumulates.
AI responses drift toward generic outputs when context is too brief.
===
Your manager forwards an impressive AI-generated report. They ask you to build on it. Your first step is:
*Verify the key claims and figures before treating the report as accurate.
Use Claude to expand and build on the existing AI-generated content.
Accept the report as accurate — your manager reviewed it.
Identify which AI tool generated the report to assess its reliability.
===
A colleague builds an AI chatbot for your team's internal use without telling anyone. The key concern is:
The chatbot may be slower than commercial AI tools the team uses.
The chatbot will not be as capable as enterprise AI solutions.
Using an internal chatbot may violate AI tool licensing terms.
*Sensitive internal data shared with it may not be appropriately secured.
===
You receive a task from a client: "Use AI to do X." The client does not know AI limitations. Your responsibility is to:
Tell the client that AI cannot reliably do this task as described.
*Complete the task using AI appropriately and deliver verified output.
Do the task manually since the client doesn't understand AI well.
Ask the client to specify exactly which AI tool they want you to use.
===
You use AI to generate 10 ideas for a strategy session. You share them without disclosure. What is the risk?
Someone on the team will identify the ideas as AI-generated.
The ideas will be lower quality than human-generated ones.
*The team treats the ideas as human-generated strategic thinking.
The client will ask which team member generated each idea.
===
You are working on a time-sensitive task and Claude produces an output with obvious errors. You should:
*Fix the errors yourself and complete the task — do not resubmit to Claude.
Ask Claude to fix its own errors before you review the output.
Start over with a better prompt to avoid getting errors again.
Submit the task with the errors flagged as "pending verification."
===
A startup asks you to evaluate their AI product. Which question reveals the most about real-world reliability?
"What accuracy rate does it achieve on benchmark tests?"
"Which underlying AI model does it use?"
*"What does it do when it gets the answer wrong?"
"How many customers are currently using it?"
===
You use Claude to analyse a competitor's strategy from public information. The output is insightful. Before presenting it:
Present it directly — public information analysis is low-risk.
Have Claude revise the analysis for clarity before presenting.
Identify which data points came from Claude's training versus the document.
*Verify the key facts about the competitor from primary sources.
===
A junior team member says "Claude told me we should use approach X for this project." The correct response is:
"If Claude recommended it, we should take it seriously."
*"Walk me through the reasoning — Claude's suggestions need human judgment."
"We need to ask another AI tool to validate Claude's recommendation."
"Claude cannot make recommendations on technical project decisions."
===
You use Claude to draft communications for a sensitive HR situation. The most important consideration is:
The communication must be reviewed by the CEO before sending.
You should disclose to the employee that AI drafted the communication.
*Legal and procedural accuracy must be verified with HR and legal counsel.
Claude should not be used for any HR-related communications.
===
Which of the following best describes an "AI-first" professional approach?
*Considering how AI can enhance every task before defaulting to manual work.
Using AI for every task without exception to maximise efficiency.
Building AI tools before deciding what problem to solve.
Replacing all manual processes with AI-powered alternatives.
===
You delegate a report to Claude and the deadline arrives. The report has errors. Who is accountable?
Claude is — it produced the incorrect content.
*You are — you chose to delegate to AI and are responsible for the output.
The manager is — they set the deadline without allowing review time.
No one — AI errors are unforeseeable and cannot be assigned.
===
A client insists on a deliverable that AI cannot reliably produce accurately. You should:
Use AI anyway and review carefully to catch all errors.
Decline the deliverable — professional standards prohibit unreliable AI use.
Outsource the deliverable to a specialist who can do it without AI.
*Explain the limitation and propose a hybrid approach with AI drafting and human verification.
===
You are asked to train colleagues on AI best practices. The most important lesson to start with is:
"Always use the most advanced AI model available for any task."
"AI tools are most useful for creative and ideation tasks."
*"AI outputs are starting points — own the final output yourself."
"AI can be trusted for most tasks once you have the right prompt."
===
What is the best indicator that a professional is ready to lead AI adoption in their organisation?
They have completed an AI certification from a recognised provider.
*They can explain both AI's value and its limitations with equal accuracy.
They have built at least one working AI tool using an API.
They use AI every day across all their professional tasks.
===
What does Menler's AI Generalist Entry Diagnostic assess above all else?
Whether a learner has used AI tools for more than six months.
Whether a learner can build AI tools using Claude's API.
Whether a learner has prior work experience using AI professionally.
*Whether a learner's AI judgment and instincts are ready for fellowship training.
===
You want Claude to evaluate a business argument and push back on weak points. The most effective prompt element is:
A request to list the argument's strengths and weaknesses.
*An explicit instruction to steelman then critically challenge the argument.
An instruction to be "honest and critical" in its response.
A request for Claude to play a devil's advocate role.
===
You receive a Claude output that is technically accurate but reads like generic AI text. The most targeted fix is:
Ask Claude to "make it sound more human and natural."
Regenerate with higher temperature to reduce generic patterns.
Use a different AI writing tool better suited to your style.
*Provide a voice sample and specify tone dimensions to match.
===
What is the most reliable indicator that a multi-step prompt chain is designed correctly?
*Each step's output is fully sufficient as the next step's input.
The chain produces consistent outputs across 10 test runs.
Each step uses a different AI tool for its specific capability.
The total prompt length across all steps is under the context limit.
===
You need Claude to produce a high-stakes client analysis. What does "grounding" the prompt mean?
Testing the prompt on a similar lower-stakes task first.
Adding explicit accuracy instructions to the prompt.
*Providing primary source documents for Claude to work from.
Restricting the output to information Claude is confident about.
===
Which prompting behaviour produces the most improvement in Claude output quality over time?
Using longer, more detailed prompts for every task type.
*Systematic iteration with specific, targeted feedback on each output.
Maintaining a library of prompts that worked previously.
Testing each task on three different AI tools before committing.
===
What is "output specification" and why does it matter for professional AI use?
*Defining exactly what the desired output looks like before prompting.
Specifying which AI model should produce the output.
Describing the output quality standard in a system prompt.
Outlining the steps the AI should follow to produce the output.
===
You need Claude to extract specific structured data from unstructured text reliably. The best approach is:
Ask Claude to extract all relevant information it can find.
Ask Claude to summarise the text, then extract from the summary.
Run the extraction 3 times and reconcile differences manually.
*Provide the exact extraction schema with labeled field examples.
===
You ask Claude to write a persuasive essay. It produces a balanced, both-sides analysis instead. The cause is:
Persuasive essays are outside Claude's trained capability.
The prompt did not include enough facts to support a one-sided argument.
*Claude's training leads it to hedge toward balance unless explicitly told otherwise.
Claude's safety guidelines prevent one-sided persuasive content.
===
A prompt that works perfectly in Claude 3 produces mediocre output in Claude 4. The best response is:
*Adapt the prompt — different model versions respond differently.
Revert to using Claude 3 for this specific task type.
Conclude that Claude 4 is inferior to Claude 3 for this task.
Submit feedback to Anthropic about the regression.
===
What is the most important output quality dimension to check when Claude produces a complex analysis?
Completeness — whether every possible point has been covered.
Word count — whether the output meets the specified length.
Formatting — whether headers and structure match the request.
*Logical consistency — whether conclusions follow from stated premises.
===
What does it mean to use "chain of thought" prompting?
Chaining multiple prompts together in a sequential workflow.
*Asking the model to show its reasoning step by step before answering.
Including previous conversation turns as context for the current prompt.
Asking the model to consider multiple perspectives before concluding.
===
You notice Claude consistently makes a specific type of error across several outputs. The most effective response is:
Switch to a different model since Claude cannot handle this task.
Add a general instruction to "be careful" about accuracy.
*Add a targeted negative example of that error to the prompt.
Run each output through a separate AI tool to catch the error.
===
What is the most effective use of the "system prompt" in a Claude workflow?
Providing the primary user query that Claude should respond to.
Listing all the topics the AI is allowed to discuss in the session.
Summarising previous conversation for continuity across sessions.
*Setting persistent role, tone, constraints, and task context for the session.
===
You want Claude to maintain a consistent analytical framework across a 10-part analysis series. The most efficient approach is:
Copy the framework into each individual prompt as a reminder.
*Define the framework in the system prompt and reuse it across all parts.
Produce all 10 parts in a single prompt to maintain consistency.
Generate part 1, then paste it as context for each subsequent part.
===
An output fails a critical quality check. Which response demonstrates the highest professional judgment?
*Identify the specific failure, fix it manually, and update the prompt to prevent recurrence.
Regenerate the output with the same prompt and hope for better results.
Lower the quality standard to match what the AI consistently produces.
Document the failure and avoid using AI for similar tasks in the future.
===
A company is deciding where to apply AI first. The most strategically sound criterion is:
The most complex tasks to demonstrate AI's maximum capability.
The tasks that executives are most excited about automating.
*High-volume, repetitive tasks where errors are catchable and correctable.
The tasks where AI tools already exist off-the-shelf.
===
A startup says "we use AI for everything." What is the most important evaluative follow-up?
*"What does your human review process look like for AI outputs?"
"Which AI tools are you using and how much do they cost?"
"What is your AI accuracy rate across your use cases?"
"How many staff did you replace with AI automation?"
===
What distinguishes a genuine AI strategy from a list of AI tools to use?
A strategy covers more tools and use cases than a simple list.
A strategy is approved by senior leadership; a list is not.
Strategy specifies the technical infrastructure AI will run on.
*Strategy defines why AI is used, for what, and how success is measured.
===
An organisation wants to build internal AI capabilities rather than buy off-the-shelf tools. The most important first question is:
"Which open-source AI models can we fine-tune for our use case?"
*"Do we have the data, talent, and processes to do this sustainably?"
"What is the cost difference between building and buying?"
"What are our competitors building internally?"
===
What does "AI augmentation" mean in a strategic context?
Adding AI features to an existing product or software platform.
Increasing the size or capability of an existing AI model.
*Using AI to enhance human capability rather than replace human roles.
Using multiple AI models in combination for better outputs.
===
Which metric most accurately measures the value AI is adding to a knowledge work team?
Total number of AI tool interactions per week.
Reduction in task completion time versus pre-AI baseline.
Employee satisfaction with AI tools after 90 days of use.
*Quality-adjusted output per person across AI-assisted tasks.
===
A team has been using AI for three months and productivity has not improved. The most likely cause is:
*AI is being used for the wrong tasks or without proper review workflows.
Three months is too short to see AI productivity improvements.
The team is using AI tools that are not suited to their industry.
AI productivity gains require a minimum team size to be visible.
===
What is the correct mental model for an "AI-native" business process?
The process runs entirely on AI with no human involvement.
*AI is embedded in how the process works from the start, not added later.
The process was originally designed by an AI tool.
The process uses only AI tools built specifically for that industry.
===
The most common reason enterprise AI projects fail is:
AI models not being advanced enough for enterprise requirements.
Lack of budget for enterprise AI tool licences.
Resistance from employees who fear job replacement.
*Poor data quality, unclear objectives, or insufficient human oversight.
===
A client asks: "Should we replace our customer service team with AI?" The most responsible first response is:
"Yes, AI can handle most customer service queries effectively."
"No, customer service requires human empathy AI cannot provide."
*"What specific problems in your current customer service are you trying to solve?"
"It depends on your budget for AI tools versus headcount."
===
What is the highest-value AI application for a solo entrepreneur?
Using AI to replace the need for professional advisors.
*Automating high-volume, time-consuming tasks to free strategic time.
Building a personal AI model trained on their specific expertise.
Using AI to generate social media content at scale.
===
What is the best indicator that an organisation's AI adoption is maturing?
*AI use is governed by defined policies and measured against outcomes.
The organisation has deployed AI tools across every department.
AI was mentioned in the annual report and investor presentations.
The organisation employs dedicated AI specialists in every team.
===
A company trains all employees on AI tools in a one-day workshop. What is most likely missing?
A certificate that validates employee AI proficiency.
An executive sponsor who mandates AI use after training.
*Ongoing practice, feedback, and use cases specific to each role.
A longer training duration — one day is insufficient for any learning.
===
Which capability is most scarce and valuable in an AI-enabled workforce?
Technical ability to build and fine-tune AI models.
Speed of AI tool adoption across different platforms.
Ability to write long, detailed prompts for complex tasks.
*The judgment to direct AI toward the right problems with the right constraints.
===
An AI Generalist's ultimate responsibility in an organisation is:
Training all employees to use AI tools effectively.
*Ensuring AI is directed toward genuine value and governed responsibly.
Building the technical AI infrastructure for the organisation.
Staying updated on the latest AI tools and recommending new ones.
===
What makes an "agentic" AI different from a standard AI chatbot?
*It can take multi-step actions autonomously to complete a goal.
It has higher intelligence and can handle more complex questions.
It learns from interactions and improves over time.
It connects to the internet and retrieves live information.
===
What is the most important design principle for an agentic AI workflow?
Maximising the number of steps the agent can complete without human input.
Using the most powerful available model as the agent's core.
*Defining clear boundaries for what actions the agent can take autonomously.
Ensuring the agent can retry failed steps automatically.
===
You build an AI agent that books meetings on your behalf. What safety mechanism is most critical?
Limiting the agent to reading calendar data, not writing to it.
*Requiring human confirmation before any booking is finalised.
Using only open calendar slots to avoid conflicts.
Setting a maximum of 3 bookings per day to limit errors.
===
What is "tool use" in the context of Claude agents?
The ability to use a wider range of vocabulary and expression styles.
Access to multiple AI models depending on the task type.
The ability to display formatted output including tables and code blocks.
*The ability to call external functions or APIs as part of generating a response.
===
You are designing an AI agent to process and categorise incoming documents. The most important reliability feature is:
*A logging system and human review queue for low-confidence categorisations.
Using the highest-accuracy AI model for all categorisations.
A retry mechanism that attempts each categorisation 3 times.
A testing protocol that evaluates the agent on 100 sample documents.
===
What is the key risk of allowing an AI agent to send emails autonomously?
Email sending API costs may accumulate without visibility.
*It may send emails the user did not intend or with incorrect content.
Recipients may respond directly to the AI without knowing it.
Email deliverability may be affected by AI-generated content.
===
What does "human in the loop" mean in an agentic AI system?
A human writes the initial prompt that the agent acts on.
A human monitors the agent's performance via a dashboard.
A human is available to answer the agent's questions.
*A human reviews and approves agent decisions at defined checkpoints.
===
You want to use Claude to automate a multi-step research workflow. Which task should remain human-controlled?
Compiling search results from multiple sources into a summary.
Reformatting research notes into a consistent template.
*Deciding which sources are authoritative and whether to trust the findings.
Identifying which sources were published in the past 12 months.
===
What is the most accurate description of "prompt injection" risk in agentic systems?
Too many prompts in a session cause the agent to lose context.
*Malicious content in external sources manipulates the agent's behaviour.
A long prompt reduces the agent's ability to follow instructions.
Users inject conflicting instructions that confuse the agent.
===
Which human task is hardest to automate with current AI agents?
*Exercising judgment in ambiguous, high-stakes situations.
Reading and summarising multiple long documents.
Scheduling meetings across complex calendar constraints.
Categorising incoming requests by topic and urgency.
===
You build an agent that automates customer onboarding. After deployment, what is the most important ongoing activity?
Training the agent on new customer data to improve over time.
Expanding the agent's scope to handle more onboarding steps.
*Monitoring outputs for errors and updating the agent as processes change.
Reducing human oversight as the agent's performance proves reliable.
===
A well-designed AI workflow for document review should:
Route all documents to AI first, then humans only if AI rejects them.
Achieve 100% AI coverage to eliminate the need for human review.
Randomise 10% of documents to human review as a quality check.
*Flag uncertain cases for human review rather than making all decisions autonomously.
===
What is the most important constraint to define before deploying any autonomous AI agent?
The maximum number of API calls the agent may make per hour.
*What irreversible actions the agent is and is not permitted to take.
Which AI model the agent should use for each decision type.
The acceptable error rate for the agent's primary function.
===
You notice that an AI agent has started taking an action you did not design it to take. The first response is:
Monitor the unauthorised action to see if it is producing good outcomes.
Update the agent's instructions to include the new action formally.
*Stop the agent, investigate the trigger, and restore intended boundaries.
Report the unexpected behaviour to the AI model provider.
===
Which statement best describes the current state of AI agents in professional settings?
*Powerful for well-defined tasks but requiring careful human oversight.
Ready to operate autonomously across most professional workflows.
Still experimental and not yet reliable enough for production use.
Limited to creative tasks and not yet applicable to operational work.
===
You receive an AI output that is well-written and confidently stated. The most important quality check is:
Whether the output follows the format you requested.
Whether the writing style matches your target audience.
Whether the output is within the requested length range.
*Whether the specific claims are accurate and verifiable.
===
What is the most reliable method for evaluating an AI-generated strategy document?
Run the document through a second AI tool for comparison.
*Apply your own domain expertise to challenge each key recommendation.
Ask Claude to critique its own strategy document.
Share it with peers and use their reactions as quality signal.
===
An AI output is factually correct but logically inconsistent. Which statement is true?
Logical consistency and factual accuracy always align in AI outputs.
A logically inconsistent output is always also factually incorrect.
*Individual facts can be accurate while the overall argument is flawed.
Logical consistency is not relevant for factual AI outputs.
===
You are evaluating two AI outputs on the same task. Output A is shorter and direct; Output B is longer and thorough. How do you choose?
*Evaluate which better achieves the task objective, regardless of length.
Choose A — shorter outputs reflect more confident and accurate AI.
Choose B — more thorough coverage indicates higher effort.
Choose the output with fewer hedging phrases and qualifications.
===
What is "hallucination detection" in practical professional terms?
A software tool that flags AI outputs with low confidence scores.
An AI feature that marks statements the model is uncertain about.
The practice of asking Claude to check its own outputs for errors.
*The process of verifying specific claims against primary sources.
===
Which type of AI error is most dangerous in a professional context?
A vague, hedged answer that provides no actionable information.
An answer that misunderstands the question and goes off-topic.
*A confident, specific, wrong fact that is hard to detect without expertise.
A response that is too long and includes irrelevant information.
===
You are building an AI quality scoring rubric for your team. Which dimension should be weighted highest?
*Factual accuracy of specific, verifiable claims.
Fluency and grammatical correctness of the output.
Adherence to the specified format and structure.
Completeness and coverage of relevant topics.
===
An AI output includes a reference to a study with specific findings. Your first action is:
Add a footnote noting the source is AI-generated.
*Search for the actual study and verify it exists and says what AI claims.
Proceed if the findings align with your prior knowledge.
Ask Claude for the study's DOI or URL for citation.
===
What is the most useful signal that an AI output is at risk of being low quality?
The output is shorter than expected for the task.
The output uses hedging language like "generally" or "may."
*The task required precise, specific, or recent information.
Claude took longer than usual to generate the response.
===
A team member argues that if AI output sounds professional, it must be good enough to use. The most precise counter is:
AI writing quality varies too much to be relied on for professional work.
Professional-sounding AI output still needs to be reformatted for clients.
Professional quality is subjective and AI cannot achieve it reliably.
*Professional writing quality and factual accuracy are independent dimensions.
===
You ask Claude to rate the quality of its own output on a 1-10 scale. How useful is this rating?
*Very limited — AI self-assessment is not reliably calibrated.
Very useful — it identifies outputs the AI is uncertain about.
Useful as a baseline — compare ratings across multiple outputs.
Fully reliable — Claude knows its own capability boundaries well.
===
What is the correct response when you spot a factual error in an AI output mid-task?
Re-run the entire prompt to get a fresh error-free output.
*Correct the error yourself and continue — do not re-prompt for a full rewrite.
Ask Claude to find and fix its own factual errors.
Flag the error and submit the task anyway for time efficiency.
===
Which output review habit has the highest return on time invested?
Reading every word of every AI output before using it.
Running outputs through grammar and spell-check tools.
Comparing AI output to what you expected before reading it.
*Focusing review on specific figures, citations, and time-sensitive claims.
===
What does "output calibration" mean in professional AI use?
*Developing an accurate sense of where AI is reliable versus where it fails.
Adjusting the AI model's settings to improve output quality.
Testing AI outputs against a calibration dataset for accuracy.
Calibrating response length to match the task requirements.
===
A manager receives two reports on the same topic: one from a human analyst and one from AI. The manager cannot distinguish them. What does this prove?
It proves AI has reached human-level analytical capability.
It proves the human analyst should be reviewed for underperformance.
*It proves only that AI can produce human-quality prose, not that the content is accurate.
It proves AI is suitable to replace analysts on this type of task.
===
A team member says "I feel stupid using AI — it does things faster than I can." The most effective response from a team leader is:
*"AI handles speed; your judgment determines if the output is actually right."
"You should use AI more so you feel more comfortable with it."
"AI is a tool, not a measure of intelligence — do not compare yourself."
"Everyone feels this way initially — the feeling passes with more use."
===
What is the most important organisational condition for successful AI adoption?
Executive mandate requiring all employees to use AI tools daily.
A large budget for premium AI tool access across the team.
Dedicated AI specialists who manage tools on behalf of others.
*Psychological safety to experiment, fail, and share learning openly.
===
You want to build an AI-fluent culture in your organisation. The most effective first action is:
Train everyone on AI fundamentals before allowing any tool use.
*Create visible quick wins by using AI on real tasks with the team.
Hire a Chief AI Officer to lead the cultural transformation.
Survey employees on their current AI tool usage and attitudes.
===
A team member uses AI extensively and produces more output than their colleagues. What is the most important performance question to ask?
"Are they using AI tools that are approved by the organisation?"
"Are they documenting their AI prompts for the team to learn from?"
*"Is the quality and accuracy of their AI-assisted output meeting the standard?"
"Are they becoming less capable at the underlying skills themselves?"
===
An AI-sceptical colleague says: "AI will make everyone's thinking lazy and shallow." The most nuanced response is:
*"That's a genuine risk that depends on how AI is used — passive use atrophies skills; active use can sharpen thinking."
"That concern is valid — AI is best kept out of professional workflows."
"That concern is outdated — research shows AI improves critical thinking."
"AI only makes thinking lazy for people who already have that tendency."
===
What is the most effective way to transfer AI knowledge within a team?
Sending team members to an external AI certification programme.
Holding a monthly AI tool demo and exploration session.
*Sharing specific prompts, examples, and workflows that produced good results.
Requiring team members to document every AI interaction.
===
You are leading an AI adoption initiative. What does failure look like most commonly?
Employees adopt AI faster than the infrastructure can support.
AI produces outputs that require too much human review.
Senior leadership does not approve the AI tools selected.
*AI is used superficially without changing underlying workflows.
===
A team member asks: "Should I tell clients I used AI to do this work?" The most accurate guidance is:
"Always disclose — transparency with clients is non-negotiable."
*"Follow your profession's disclosure norms and your client's stated preferences."
"Never disclose — clients don't need to know your production tools."
"Disclose only if the client specifically asks about your process."
===
What is the most meaningful way to measure a team's AI maturity?
How many AI tools they use across different task categories.
How quickly they adopted new AI tools after they became available.
*Whether they can identify and correct AI failures in their own workflows.
Whether they have formal AI policies documented in writing.
===
A colleague presents a highly compelling AI-generated analysis in a strategy meeting. No one questions it. What is the risk?
*The group may act on hallucinated or unverified data.
The colleague may be over-relying on AI for strategy work.
The group will expect AI-generated analysis in all future meetings.
The AI tool used may not be appropriate for strategic analysis.
===
What does it mean to "govern AI use" in an organisational context?
Controlling who in the organisation has access to AI tools.
*Defining which tasks AI is used for, how outputs are reviewed, and what standards apply.
Monitoring AI tool usage volumes and costs across teams.
Ensuring all AI use is approved by senior leadership in advance.
===
How should an AI Generalist respond when asked to evaluate whether a task is appropriate for AI?
Check whether the task type is on the company's approved AI use list.
Ask which AI tool the requester has in mind for the task.
Estimate the time saved versus manually completing the task.
*Assess what can go wrong, how it will be caught, and whether the stakes justify the risk.
===
Which statement about AI and professional expertise is most accurate?
AI reduces the need for expertise by providing expert-level outputs.
AI and expertise are interchangeable for most professional tasks.
*AI amplifies expertise — experts get more from AI than novices do.
AI makes expertise less valuable because it democratises information.
===
What is the most honest advice to give a student entering the workforce in an AI-transformed environment?
"Learn to code AI systems — technical skills are the only durable advantage."
*"Develop strong judgment skills — AI handles speed; you add direction and quality control."
"Use AI constantly to maximise productivity in your early career."
"Focus on skills AI cannot do rather than on working alongside it."
===
Menler's AI Generalist Level Up bank tests you at the mid-fellowship stage. What does "level up" indicate?
You have mastered every AI tool used in the Generalist Fellowship.
You are ready to teach AI fundamentals to students below your level.
You have completed the technical AI engineering prerequisites.
*You are applying AI judgment to complex, ambiguous professional situations.
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

export const GENERALIST_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the full 150-question pool,
// each with its options shuffled.
export function getGeneralistSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
