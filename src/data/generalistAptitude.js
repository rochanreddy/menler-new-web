// Combined AI Generalist question bank — Entry Diagnostic (75) + Level Up (75) = 150.
// Each block below is: question line, then the 4 options. The 2nd option (B) is the
// correct answer in the source PDFs; we shuffle option order at session build so the
// correct answer isn't always in the same position.
//
// getGeneralistSession(n) → returns a fresh random n-question session in the
// aptitude runner's format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
What is the core difference between a generative AI model and a traditional software program?
Generative AI is faster than traditional software.
Traditional software follows explicit rules written by humans; generative AI learns statistical patterns from data and generates new outputs — text, images, code — that were not pre-programmed.
Generative AI only works on the internet while traditional software works offline.
Traditional software is more creative; generative AI is more logical.
===
You are preparing to join the AI Generalist Fellowship. Which statement best describes what "AI generalist" means?
Someone who knows a little about every AI tool but is expert in none.
Someone who can apply AI fluently across different domains and workflows — not just within one specialised technical area.
Someone who has completed a computer science degree with an AI specialisation.
Someone who uses AI for personal tasks but not professional ones.
===
Claude is described as "Claude-native" in Menler's programs. What does this mean in practice?
Claude is the only AI tool covered in Menler programs.
Menler's curriculum is built around Claude as the primary working environment — prompting, projects, connectors, and workflows are all designed for Claude specifically, not as generic AI tool training.
Claude is a native Indian AI tool built in Bengaluru.
Claude-native means you must use Claude on a native mobile app, not a browser.
===
What is a "token" in the context of AI language models?
A payment unit used to purchase AI credits.
The basic unit of text that AI models process — roughly a word or part of a word — with models having a maximum token limit per conversation called a context window.
A security code required to log into an AI platform.
A reward point earned by using AI tools frequently.
===
What does it mean when an AI model is described as having a "knowledge cutoff"?
The AI stops answering questions after a certain number of messages.
The model's training data has an end date — it has no knowledge of events, publications, or developments after that date unless it has a web search tool.
The AI refuses to answer questions beyond a certain complexity level.
The AI's responses become less accurate after being used for many hours.
===
A friend says: "You don't need to learn AI — it will learn from you automatically." What is wrong with this view?
Nothing — AI does learn from your interactions automatically.
AI models do not learn from individual user conversations in real time. The skill of directing AI effectively — prompting, iteration, workflow design — must be actively developed by the user.
They are partially right — AI learns your name and preferences but not your skills.
They are right only for paid AI subscriptions that include personalisation.
===
What is the "context window" of an AI model and why does it matter for professional work?
The physical screen size recommended for using AI tools.
The maximum amount of text the AI can process in a single conversation — determining how much document, history, or instruction you can include before the AI loses track of earlier content.
The time period during which the AI is most accurate.
The number of tabs you can have open simultaneously in Claude.ai.
===
Which of the following best describes what "prompting" is as a professional skill?
Learning to type faster to interact with AI more efficiently.
The ability to write clear, structured, context-rich instructions that reliably direct AI toward high-quality, specific outputs for professional tasks.
Memorising a set of magic phrases that unlock AI's best responses.
The technical process of submitting requests to an AI API.
===
What is the difference between Claude's "Projects" feature and a standard conversation?
Projects are paid; standard conversations are free.
Projects maintain persistent context — instructions, files, and memory — across multiple conversations, making them suitable for ongoing work rather than one-off queries.
Projects can only be used for creative writing tasks.
There is no functional difference — Projects is just a visual organiser.
===
What does "hallucination" reveal about how AI models fundamentally work?
It reveals that AI models are not as advanced as they appear.
It reveals that AI models generate probable text rather than verified truth — they predict what words should follow, not whether those words are accurate.
It reveals that AI models are deliberately deceptive.
It reveals that AI models copy from other sources without attribution.
===
Before joining the Generalist Fellowship, which of the following skills is most important to already have?
The ability to write code in at least one programming language.
Comfort with written communication — the ability to express what you want clearly in text, since prompting is fundamentally a writing skill.
A background in mathematics or statistics.
Experience working in a technology company.
===
What is the most accurate description of what the Generalist Fellowship's first 6 weeks focus on?
Learning to build AI applications using Python.
Building cross-functional AI fluency — prompting, workflow automation, tool use, and applied AI thinking — before specialising in a domain track.
Studying the history and theory of artificial intelligence.
Preparing for the Anthropic Claude certification exam.
===
A prospective Fellow says: "I'll just use ChatGPT instead of Claude during the Fellowship since I'm already familiar with it." What is the key consideration they are missing?
ChatGPT is less capable than Claude for all tasks.
The Fellowship curriculum is built around Claude-specific features — Projects, Skills, Connectors — that do not exist in ChatGPT. Using a different tool means missing the actual system being taught.
ChatGPT is more expensive than Claude for professional use.
Using ChatGPT instead of Claude violates the Fellowship's terms and conditions.
===
What does "AI-native workflow" mean?
A workflow that requires an AI engineer to set up.
A way of working where AI is integrated from the start as a core collaborator — not added as an afterthought to an existing manual process.
A workflow that runs entirely on autopilot without human input.
A workflow that can only be built using paid enterprise AI tools.
===
What is the most important mindset to bring into the Generalist Fellowship?
Confidence that AI will handle everything with minimal input from you.
Treating every AI interaction as an opportunity to develop skill — prompting deliberately, reviewing outputs critically, and learning from what works and what doesn't.
Scepticism about AI's usefulness until you see proof it can help your specific work.
Focus on learning as many AI tools as possible before the Fellowship ends.
===
What is the most reliable structure for a professional prompt?
Start with a greeting and end with a thank you.
Role or context, then specific task, then format requirements, then constraints or exclusions. This structure ensures the AI has everything it needs before generating output.
Keep it under 20 words to avoid confusing the AI.
Use bullet points for every prompt regardless of the task.
===
You need Claude to analyse a competitor's product page. What should your prompt include beyond the URL or pasted content?
Nothing — pasting the content is sufficient.
What specific aspects to analyse, the framework to use, the output format, and what you will do with the analysis — so Claude produces a structured, actionable result rather than a general summary.
A request for Claude's personal opinion on the competitor.
Instructions to search the internet for additional competitor information.
===
What is the purpose of including a "negative constraint" in a prompt?
To make the AI work harder by giving it restrictions.
To explicitly exclude outputs, formats, or content you don't want — preventing the AI from defaulting to patterns that are common but unsuitable for your specific need.
Negative constraints always reduce output quality.
To test whether the AI will follow instructions.
===
You ask Claude to write a proposal and the first draft is too formal. Which follow-up is most effective?
"Make it better."
"Rewrite this in a warmer, more conversational tone — as if written by a founder talking directly to a potential partner, not a consultant writing a formal document. Keep all the content but change the register throughout."
"Try again."
"Make it less formal."
===
What is "output anchoring" and when is it useful?
Setting a maximum word count to prevent long responses.
Starting the AI's response with a partial completion — for example, beginning with the first line of a table or a JSON bracket — so the AI continues in the exact format you need from the first token.
Repeating the most important instruction at the end of a prompt.
Saving a prompt as a template to reuse across projects.
===
What is the key difference between a "persona prompt" and a "role prompt"?
They are identical — persona and role mean the same thing in prompting.
A persona prompt gives the AI a full character with voice, tone, and perspective. A role prompt assigns a functional position ('act as an editor') that shapes task approach without a full character.
Persona prompts are for creative tasks; role prompts are for analytical ones.
Role prompts require more tokens and are therefore less efficient.
===
You are using Claude to help draft a client email and want to preserve your personal writing style. What is the most effective approach?
Describe your writing style in general terms: "write like me."
Paste two or three examples of your existing writing and instruct Claude to match the voice, sentence length, vocabulary, and tone demonstrated in those examples.
Ask Claude to write the email and then manually adjust the style afterward.
Use Claude only for the content and write the email from scratch yourself.
===
What does it mean to "ground" a prompt?
Keeping the prompt simple and basic.
Including specific source material — a document, data set, or set of facts — and instructing Claude to base its response on that material rather than on its general training knowledge.
Connecting your prompt to real-world examples to make it more relatable.
Starting every prompt by stating the current date and context.
===
You have a 50-page report to analyse with Claude. What is the most effective approach?
Paste all 50 pages in a single message and ask for the full analysis.
Decompose the analysis: identify the key questions first, then extract and paste the most relevant sections for each question, directing Claude to specific pages rather than the full document.
Ask Claude to summarise the full report first, then analyse the summary.
Use a different AI tool since Claude cannot handle 50-page documents.
===
What is the most effective way to prompt Claude when you are not sure exactly what you want?
Write the vaguest possible prompt so Claude has maximum freedom to interpret.
Describe what you are trying to achieve, what you know about it so far, what has not worked, and ask Claude to help you clarify the problem before attempting a solution.
Ask multiple short questions in rapid succession.
Use another AI tool to formulate your prompt before bringing it to Claude.
===
What is a "prompt template" and why is it valuable in professional workflows?
A standard greeting used to start every AI conversation.
A reusable prompt structure with placeholders for variable content — enabling consistent, high-quality AI output for recurring tasks without rewriting the prompt from scratch each time.
A prompt written by a professional prompt engineer and sold commercially.
A Claude feature that automatically saves your previous prompts.
===
When should you use chain-of-thought prompting in professional tasks?
For every task, since it always produces better results.
For complex, multi-step analytical tasks where the reasoning process matters — risk assessments, strategic analysis, complex problem diagnosis — not for simple formatting or drafting tasks where it adds length without value.
Only for tasks involving mathematics or coding.
Chain-of-thought is only available in paid AI subscriptions.
===
You receive an AI output that is 80% excellent and 20% problematic. What is the most efficient approach?
Discard the entire output and start again.
Quote the 20% back to Claude with a specific explanation of what is wrong with it and what you want instead, preserving the 80% that is already working.
Accept the full output and fix the 20% manually.
Ask Claude to "fix the bad parts" without specifying which parts or what is wrong.
===
What is the most important signal that a prompt needs to be improved?
The response takes longer than 10 seconds to generate.
The output requires significant rewriting, misunderstands the task, or misses important constraints — indicating the prompt did not communicate what was actually needed.
The response is shorter than expected.
Claude asks a clarifying question before responding.
===
What distinguishes a "professional-grade" prompt from a casual one?
Professional prompts are longer.
Professional prompts are precise about role, task, format, constraints, and audience — eliminating as much ambiguity as possible so that the first output is genuinely usable or close to it.
Professional prompts use formal language and avoid contractions.
Professional prompts always include specific word counts.
===
What is the most important principle when designing an AI-assisted workflow for the first time?
Automate everything immediately to maximise efficiency.
Start with the highest-friction, most repetitive task in your current workflow — the one where AI assistance would produce the most immediate, tangible time saving.
Design the most sophisticated workflow possible to future-proof your process.
Ask AI to design the workflow for you before you attempt it yourself.
===
What is a "Claude Project" and how does it change how you work with AI?
A paid Claude feature for team collaboration on documents.
A persistent workspace in Claude that retains your instructions, files, and context across multiple conversations — enabling ongoing, project-specific AI assistance without re-explaining context each time.
A structured Claude conversation with more than 10 messages.
A project management template that Claude fills out for you.
===
You want to use Claude to help manage your weekly work review. What should you store in the Project instructions?
Nothing — Project instructions are for advanced users only.
Your role and context, the format you want for the weekly review, the specific questions you always want answered, and any recurring constraints — so each week's review requires minimal setup.
The weekly data you want to review, updated every week.
A list of AI tools you plan to use alongside Claude.
===
What is a "trigger" in the context of an AI-assisted workflow?
A button you click to start an AI conversation.
A specific event or condition that initiates a step in an automated or semi-automated AI workflow — for example, receiving a new email triggers a summarisation step.
A harmful prompt that causes AI to behave unexpectedly.
The moment when AI output is reviewed and approved for use.
===
You want to use Claude to help draft responses to common customer queries. What workflow design produces the most consistent quality?
Ask Claude to draft each response from scratch every time.
Create a Project with instructions that include your brand voice, common query types with response frameworks, and tone guidelines — then provide the specific query for each conversation.
Give Claude the customer's full contact history for every query.
Let Claude draft responses without any instructions to avoid constraining its creativity.
===
What does it mean to have a "human review checkpoint" in an AI workflow?
A scheduled break where AI tools are turned off for human rest.
A deliberate point in the workflow where a human reviews, edits, or approves AI output before it moves to the next step or is used externally.
A feature in Claude that automatically flags its own uncertain outputs for review.
A meeting between the human and the AI to discuss workflow performance.
===
Which of the following is the best example of a well-designed AI-assisted research workflow?
Ask Claude to research everything and trust its output completely.
Define the research questions first, use Claude to gather and structure information, verify key facts from primary sources, use Claude to synthesise into the required format, then human review before use.
Google the topic first, then paste everything into Claude for a summary.
Ask Claude the same research question 5 times and take the most common answer.
===
You want to use Claude to help process meeting notes into action items every week. What makes this an ideal AI workflow candidate?
It is complex and requires sophisticated AI reasoning.
It is repetitive, clearly defined, has a consistent input format (meeting notes) and output format (action items), and the cost of occasional errors is recoverable.
It is important enough to justify the time investment in automation.
It requires no human review since meeting notes are always accurate.
===
What is the risk of not documenting your AI workflow prompts and instructions?
There is no risk — AI workflows do not require documentation.
If the prompts are not saved, the workflow breaks the next time the context window resets, the person using it changes, or you need to improve it — rebuilding from scratch each time.
Documentation makes workflows slower to run.
Documented prompts are more likely to be copied by competitors.
===
You build an AI workflow that works perfectly with one type of input but breaks when the input format changes slightly. What does this indicate?
The AI tool has a bug that needs to be reported.
The workflow was designed too tightly around one specific input pattern and lacks the robustness to handle natural variation. The prompt needs to be redesigned to handle input variability.
You need a more powerful AI model for this workflow.
The workflow should only be used with exactly the inputs it was designed for.
===
What does "AI-assisted" mean versus "AI-automated" in a workflow context?
They mean the same thing — both involve using AI for tasks.
AI-assisted means AI supports human decision-making with drafts or analysis; AI-automated means AI completes the task and sends or acts on outputs with minimal or no human review.
AI-automated is more expensive than AI-assisted.
AI-assisted requires more technical setup than AI-automated.
===
What is the most valuable output of the first month of using Claude professionally?
A large number of completed AI tasks.
A growing library of effective prompts and workflow templates, tested and refined through real use — representing genuine intellectual capital that compounds over time.
Familiarity with every feature Claude offers.
A certificate demonstrating Claude proficiency.
===
You want to use Claude to help prepare for an important stakeholder meeting. What is the most effective workflow?
Ask Claude to tell you what will be discussed in the meeting.
Brief Claude on the meeting context, attendees, objectives, and known concerns, ask Claude to help anticipate questions and prepare responses, review and refine, use Claude to draft talking points, then final human review.
Ask Claude to join the meeting as an observer.
Use Claude only after the meeting to process notes — not before for preparation.
===
What is the role of "constraints" in making an AI workflow reliable?
Constraints slow down AI workflows unnecessarily.
Constraints define the boundaries of acceptable output — what format, length, tone, and content is required — preventing the AI from making interpretive choices that would break the workflow downstream.
Constraints are only needed for creative tasks where AI has too much freedom.
Constraints should be avoided to give AI maximum flexibility.
===
What is the most sustainable approach to building AI workflows over time?
Build the most complex workflow possible immediately.
Start simple, test thoroughly, iterate based on actual use, add complexity only when the simpler version is reliable — treating workflow design as a continuous improvement process.
Build all workflows at once to save time.
Delegate workflow design entirely to AI tools.
===
What is an "AI connector" in Claude's ecosystem?
A physical cable that connects your computer to Claude's servers.
An integration that allows Claude to access data from external tools — like Google Drive, email, or Notion — within a conversation, enabling AI assistance with your actual work data.
A premium feature that connects multiple Claude users in a group session.
A browser extension that adds Claude to every website you visit.
===
What is the difference between Claude.ai and the Claude API?
Claude.ai is for personal use; the Claude API is for enterprise use only.
Claude.ai is a ready-to-use interface for end users; the Claude API is for developers to integrate Claude into their own applications, automations, and products.
The Claude API provides a more advanced model than Claude.ai.
Claude.ai requires a monthly subscription while the API is always free.
===
Which tool would you use alongside Claude for building a no-code automation that sends a summary email every time a new document is added to a shared Google Drive folder?
Google Docs.
n8n or Zapier — workflow automation platforms that connect apps and trigger actions without coding.
Claude Code.
Microsoft Excel.
===
What is "Claude Skills" in the context of Menler's curriculum?
A gamified learning system within Claude that awards skill badges.
Custom instructions or system-level configurations stored in a Project that define how Claude should behave for a specific recurring task — effectively a trained AI assistant for that purpose.
Anthropic's official training certification for Claude users.
A feature that teaches Claude new capabilities it did not have during training.
===
A generalist AI professional needs to process PDFs, draft emails, analyse spreadsheet data, and schedule meetings — all using AI. What does this require?
A single AI tool that does everything perfectly.
An understanding of which AI tools or Claude features handle each task, and how to move data between them efficiently — a 'tool-stacking' capability.
A dedicated IT team to set up integrations.
Learning to code so you can build custom integrations.
===
What is the primary use case for Claude's document upload feature?
Storing documents permanently in Claude's memory.
Providing Claude with specific source material to analyse, summarise, or work with — replacing the need to paste large amounts of text and enabling more focused, document-grounded responses.
Converting documents into different file formats.
Sharing documents with other Claude users in the same session.
===
What distinguishes a "Claude Routine" from a one-off Claude interaction?
Routines are more expensive than one-off interactions.
A Routine is a defined, repeatable AI workflow with consistent inputs and outputs — designed to run regularly (daily, weekly) with minimal setup each time.
Routines can only be built by Claude developers.
Routines require multiple AI tools working together.
===
You are evaluating whether to use an AI tool for a new workflow. Which consideration is most important?
Whether the tool has the best user interface.
Whether the tool's output quality, data handling practices, and integration capabilities meet the specific requirements of the task and the professional standards it must meet.
Whether the tool was founded by well-known AI researchers.
Whether the tool is the most popular in the market.
===
What is the most effective way to use Claude alongside a spreadsheet tool like Google Sheets?
Ask Claude to open Google Sheets directly.
Copy relevant data from Sheets into Claude for analysis and interpretation, use Claude to generate formulas or summaries, then paste results back — using each tool for what it does best.
Replace Google Sheets with Claude for all data work.
Claude and spreadsheet tools cannot be used together.
===
What is a "system prompt" and how does it relate to Claude Skills in professional use?
A system prompt is a technical term for the user's first message in a conversation.
A system prompt is a set of instructions that shape Claude's behaviour before any user message — in professional workflows, well-crafted system prompts are what make Skills, Projects, and Routines reliable and consistent.
System prompts are only accessible to Claude developers and cannot be set by regular users.
A system prompt is Claude's automatic introduction message at the start of each conversation.
===
Which of the following is the best use of Claude's web search capability?
Replacing all manual research — Claude's web search is always more accurate than human searching.
Supplementing Claude's training knowledge with current information for time-sensitive tasks — recent news, current pricing, updated policies — while still verifying important findings independently.
Web search is only available in Claude's paid API tier.
Using web search for every query to ensure all information is current.
===
What is the advantage of building Claude workflows in a Project rather than in separate conversations?
Projects have a larger context window than individual conversations.
Projects maintain consistent instructions, files, and context across every conversation within them — creating a persistent, professional working environment rather than repeatedly starting from zero.
Projects allow multiple people to work with Claude simultaneously.
Projects automatically save and export your conversations.
===
What is "MCP" (Model Context Protocol) and why does it matter for AI generalists?
A mandatory certification programme for Claude users.
An open protocol that enables Claude to connect with external tools and data sources in a standardised way — expanding what Claude can access and do within professional workflows.
A premium Claude plan that includes more context window capacity.
A measurement of Claude's response speed and accuracy.
===
You are choosing between two AI writing tools. Tool A produces slightly better prose; Tool B integrates directly with your existing CRM and email system. For professional workflow use, which consideration is more important?
Always choose the tool with the better output quality.
Integration capability often outweighs marginal quality differences in workflow contexts — a tool that fits into your existing process seamlessly typically delivers more total value than a superior tool that requires manual data transfer.
Always choose the tool with more users since it will be better supported.
Choose based on price — workflow efficiency reduces costs.
===
What is the most important thing to understand about AI tools before embedding them in professional workflows?
Their pricing models and upgrade paths.
Their data handling practices — what data is stored, for how long, who can access it, and whether it is used for model training — especially for workflows involving client, financial, or sensitive organisational data.
Their founding team's technical background.
Their user interface ratings on review platforms.
===
What is the fundamental reason why AI cannot be a "source of truth" for professional decisions?
AI tools are not connected to the internet.
AI generates probable responses based on training patterns — it cannot verify its own accuracy, access real-time authoritative data, or take professional accountability for its outputs.
AI is too slow to be used for time-sensitive professional decisions.
AI sources of truth require a paid enterprise subscription.
===
What does "temperature" control in an AI model, in simple professional terms?
The physical operating temperature of the server running the model.
The degree of randomness in the model's outputs — lower temperature produces more predictable, focused responses; higher temperature produces more varied, creative ones.
How quickly the model generates responses.
The maximum length of a response the model will produce.
===
Why does an AI sometimes give different answers to the same question across different sessions?
The AI updates itself between sessions based on new information.
The combination of response randomness (temperature), slightly different prompt interpretations, and the absence of cross-session memory means identical inputs can produce meaningfully different outputs.
The AI personalises responses based on your usage history.
Different answers indicate a bug that should be reported to the AI company.
===
What is a "RAG system" in simple terms and why does it matter for professional AI applications?
A recycling and generation system for reusing old AI outputs.
Retrieval-Augmented Generation — a system where an AI retrieves relevant documents from a knowledge base before generating a response, dramatically reducing hallucination risk for domain-specific queries.
A random answer generator used to test AI system reliability.
A type of AI training that uses real-world data.
===
You are evaluating whether AI is suitable for a specific professional task. Which framework is most useful?
Try it and see — if the first output is good, AI is suitable.
Assess: Is the task well-defined? Is good output objectively recognisable? Is the cost of error recoverable? If yes to all three, AI is likely suitable. If any is unclear, design human oversight into the workflow.
AI is suitable for all professional tasks — the question is which AI tool to use.
AI is only suitable for tasks that are currently done manually by junior staff.
===
What is "prompt injection" and why is it a professional concern as AI becomes more autonomous?
A method of making prompts work faster.
An attack where malicious instructions hidden in content processed by an AI (documents, emails, web pages) cause the AI to follow the attacker's instructions instead of the user's — a significant risk in agentic AI systems.
A technique for adding prompts to documents automatically.
A premium feature for professionals who need faster AI responses.
===
What does it mean that AI models have "emergent capabilities"?
AI models develop new physical abilities as they grow larger.
As AI models scale in size and training data, they sometimes develop capabilities that were not explicitly trained — abilities that emerge from scale rather than deliberate programming.
AI models learn new capabilities from each conversation they have.
Emergent capabilities are bugs that appear in large AI models.
===
What is the professional implication of AI models having different "context windows"?
Larger context windows mean the AI is always more accurate.
Context window size determines how much text, data, or history can be active in one conversation — a critical constraint for workflows involving long documents, extended conversations, or complex multi-step analysis.
Context windows only matter for AI coding tasks.
Context windows are only relevant when using the Claude API, not Claude.ai.
===
What is "fine-tuning" and when is it relevant to a generalist's work?
Editing an AI's response after it is generated.
Retraining an AI model on specific domain data to specialise its behaviour — relevant when off-the-shelf AI consistently produces outputs that require significant correction for a specific professional domain.
Fine-tuning is a technique all Claude users should apply to their prompts.
Fine-tuning is a free feature available to all Claude Pro subscribers.
===
Why is "human oversight" not just a safety precaution but a workflow design principle?
Legal regulations require human review of all AI outputs.
Human oversight catches errors that AI cannot detect in its own outputs, maintains accountability, adds judgment that AI lacks, and creates the feedback loop that improves AI workflow quality over time.
Human oversight is needed because AI tools are not yet reliable enough for professional use.
Human oversight is only necessary for AI outputs shared externally.
===
What is the most important thing to know about AI's limitations with numerical reasoning?
AI models cannot process numbers at all.
AI language models are trained on text patterns and can make arithmetic errors, especially with multi-step calculations — they should be used to explain and structure numerical reasoning, but calculations should always be verified independently.
AI is more accurate than calculators for complex maths.
Numerical limitations only affect free AI tiers.
===
What does "alignment" mean in the context of AI safety, in professional terms?
Making sure AI tools work with your existing software.
The degree to which an AI system's behaviour matches the intentions and values of the humans it is designed to serve — a core concern as AI systems become more capable and autonomous.
Formatting AI outputs to align with company brand standards.
The technical process of integrating AI into existing IT infrastructure.
===
Why do AI companies like Anthropic emphasise that AI tools should be used as "a tool, not an authority"?
To limit their legal liability for incorrect AI outputs.
Because AI generates probable responses, not verified truth — framing AI as an authority removes the critical human judgment that catches errors, hallucinations, and contextual failures.
Because AI tools are not advanced enough to be authoritative yet.
To encourage users to pay for more human expert services.
===
What is the most important technical concept for a generalist to understand about how Claude was built — without needing to understand the technical details?
Claude was programmed with a complete set of facts about the world.
Claude learned patterns from vast amounts of human text — meaning it reflects the patterns, biases, and gaps in that text, and generates outputs that are statistically likely based on those patterns, not independently verified truth.
Claude was built by a team of human editors who manually curated all its responses.
Claude updates its knowledge automatically every 24 hours.
===
As an AI Generalist Fellow completing the entry diagnostic, which statement best describes what you are committing to develop?
The ability to use as many AI tools as possible across your professional life.
Applied AI fluency — the ability to prompt effectively, design reliable workflows, evaluate AI output critically, and deploy AI thoughtfully across any domain you work in.
The technical skills needed to build AI models and applications from scratch.
A specialisation in one AI domain that will define your career going forward.
===
You have completed the Generalist Fellowship. Which statement best describes what "prompting mastery" looks like at this stage?
Knowing a large number of prompt templates to apply to different situations.
The ability to diagnose why a prompt produced a poor output and redesign it precisely — not just iterate randomly until something works.
Being able to write the longest and most detailed prompts possible.
Having memorised the prompting techniques that work best with Claude.
===
You need Claude to consistently produce outputs in a specific JSON schema across hundreds of workflow runs. What is the most reliable approach?
Include "return JSON" in every prompt and spot-check occasionally.
Provide the exact schema with field names and types, include a complete example of a correctly formatted output, prohibit any additional fields or wrapping text, and implement programmatic validation with retry logic.
Use a different AI tool that has native JSON output.
Ask Claude to validate its own JSON before returning it.
===
What is "meta-prompting" and when is it most valuable?
Asking Claude to summarise your prompt before executing it.
Using Claude to write, evaluate, and optimise prompts for a specific task — turning the AI into a prompt engineer that systematically explores the prompt space for you.
A technique for making prompts shorter without losing quality.
Writing prompts that teach Claude new skills it did not have before.
===
A prompt that works perfectly for 95% of cases fails on a specific edge case category. What is the correct engineering response?
Rewrite the entire prompt to address the edge case.
Characterise the failing edge cases precisely, add the minimum targeted instruction or example that addresses them, and regression-test to confirm the 95% case is unaffected.
Accept the 5% failure rate as within acceptable limits.
Switch to a more powerful AI model.
===
What is "instruction interference" and how does it degrade prompt quality over time?
When two users give Claude conflicting instructions simultaneously.
When new instructions added to a prompt subtly conflict with existing ones — causing the model to satisfy one at the expense of another, degrading overall output quality even when each instruction seems individually correct.
When instructions are written in a language Claude understands poorly.
When a prompt is too long for the context window and instructions get cut off.
===
What is the most effective technique for getting Claude to produce outputs that match your specific professional voice?
Describe your voice in adjectives: "professional, warm, direct."
Provide three to five samples of your best existing writing, have Claude identify the specific patterns (sentence length, vocabulary, punctuation habits, structural preferences), then instruct it to match those patterns explicitly.
Ask Claude to write like a specific well-known author whose style resembles yours.
Use the same prompt every time and your voice will emerge naturally over time.
===
You are building a prompt for a high-stakes workflow that processes sensitive client information. What additional constraint is most important beyond standard prompt design?
Make the prompt longer to be more specific.
Add an explicit data handling instruction: what Claude should not reference, reproduce, or include in outputs — ensuring the prompt architecture itself enforces appropriate information boundaries.
Use a different AI tool for all sensitive information workflows.
Ask Claude to confirm it has understood the sensitivity before proceeding.
===
What is "prompt brittleness" and what design practice prevents it?
A prompt that is too short and therefore produces vague outputs.
A prompt that works on well-formed inputs but fails on natural variation — different phrasing, missing fields, unexpected formats. Prevented by testing with varied, imperfect inputs and adding handling instructions for common variation patterns.
A prompt that only works with one specific AI model.
A prompt that produces outputs that become outdated quickly.
===
How do you evaluate whether a prompt redesign has actually improved performance versus just changing it?
Run the new prompt once and compare the output quality subjectively.
Test both versions against a defined evaluation set covering the full range of expected inputs — including edge cases — and measure improvement using consistent, objective criteria before deploying the new version.
Ask Claude which version of the prompt it prefers.
Count the number of output changes between versions — more changes means more improvement.
===
What is the most important property to maintain when adding examples to a prompt?
Examples should always be longer than the expected output.
Examples must be high-quality and representative of the actual production distribution — including the most important edge cases — because bad examples actively teach wrong patterns.
Always provide at least 10 examples for every prompt.
Examples should be from different domains to maximise diversity.
===
A Claude workflow produces outputs that are correct in testing but drift in quality over weeks of production use. What is the most likely cause?
Claude's performance degrades over time with heavy use.
Production inputs are gradually diverging from the test distribution — users are phrasing queries differently, providing different context, or using the workflow for edge cases it wasn't designed for.
The prompt is corrupting itself through repeated use.
Claude automatically updates and changes its behaviour over time.
===
What is "constitutional prompting" in practical professional use?
Writing prompts that comply with your company's legal and compliance requirements.
Building a set of principles into the prompt that Claude evaluates its own output against before responding — for example, checking that a response meets accuracy, tone, and format standards before delivering it.
Using Anthropic's Constitutional AI framework to train a custom model.
A prompting technique exclusive to Anthropic's enterprise customers.
===
You are handing off a production prompt to a colleague. What documentation is most important to include?
The date the prompt was created and the model version it was tested on.
The prompt's intended function, its known failure modes, the evaluation set used to validate it, and the reasoning behind specific instruction choices — so the colleague can maintain and improve it safely.
A list of all the iterations you went through before settling on this version.
The average output quality score across all test cases.
===
What is the most important signal that a prompt system is ready for production deployment?
It has produced good outputs on at least 10 test cases.
It performs reliably across the full expected input distribution — including edge cases — and has a defined human review process for the cases where it fails or produces uncertain output.
The prompt author is satisfied with the output quality.
The prompt has been reviewed by a senior member of the team.
===
As a Generalist Fellow, what does your evolved prompting capability enable that was not possible at the entry stage?
Writing longer, more detailed prompts for every task.
Designing reliable, production-grade prompt systems — with structured evaluation, documented failure modes, and workflows that maintain quality at scale — not just getting good outputs on individual queries.
Access to Claude's more advanced models.
The ability to use Claude without reviewing its outputs.
===
What distinguishes an "AI-native workflow" from a workflow with AI added to it?
AI-native workflows use more AI tools than traditional workflows.
AI-native workflows are designed from the ground up around AI capabilities — the entire process logic assumes AI participation, rather than inserting AI into steps of an existing manual process.
AI-native workflows require no human involvement at any step.
AI-native workflows can only be built by software engineers.
===
You have designed a Claude workflow that works well manually. You now want to automate it using n8n. What is the most important consideration before building the automation?
Whether n8n is free or paid.
Whether every step of the workflow produces outputs in formats that the next step can reliably process without human interpretation — because automation removes the human judgment that patches workflow gaps.
Whether the workflow is important enough to justify automation.
Whether Claude has an official n8n integration.
===
What is a "multi-agent workflow" and when does it outperform a single-agent approach?
A workflow that requires multiple human agents to review AI outputs.
A workflow where multiple AI instances operate in parallel or in sequence — with each agent specialised for a specific task — outperforming single-agent approaches for complex tasks that benefit from specialisation, parallel processing, or internal review.
A workflow that uses multiple AI tools from different companies.
Multi-agent workflows are always more efficient than single-agent ones.
===
What is the most important safety design principle for agentic AI workflows that take real-world actions?
Give the AI agent access to everything it might need.
Implement minimal necessary permissions — the agent should only have access to the systems and data it specifically needs for its defined task, with irreversible actions requiring explicit human approval.
Test the agent thoroughly before deployment — no further oversight needed.
Use the most capable AI model available to reduce error rates.
===
You have a recurring research workflow where Claude summarises industry news every morning. After two months, you notice the summary quality has declined. What is the most likely cause and fix?
Claude's quality degrades with repeated use of the same prompt.
The news sources and topic landscape have shifted — the prompt was calibrated for the news patterns of two months ago. Update the prompt to reflect current topics, add new sources, and refine the focus based on what has proven most valuable.
You need to upgrade to a higher Claude subscription tier.
The workflow has reached its maximum performance ceiling.
===
What is the role of "structured outputs" in building reliable AI automation?
Structured outputs make AI responses look more professional.
Structured outputs (JSON, defined schemas, consistent field formats) enable downstream automation steps to process AI-generated content programmatically — without human interpretation bridging each step.
Structured outputs are only needed when building AI APIs.
Structured outputs reduce the quality of AI responses.
===
What is "human-in-the-loop" versus "human-on-the-loop" and when should you use each?
They mean the same thing — humans review all AI outputs.
Human-in-the-loop means AI outputs require human approval before each action. Human-on-the-loop means humans monitor and can intervene but AI proceeds autonomously — appropriate only for lower-risk, well-tested tasks.
Human-in-the-loop is for enterprise use; human-on-the-loop is for personal workflows.
Human-on-the-loop removes human accountability from AI actions.
===
You want to build an AI workflow that automatically drafts responses to inbound sales enquiries and sends them without review. What is wrong with this design?
Nothing — automated email responses are standard business practice.
Sales enquiries vary significantly in context, intent, and required response — automating without review risks sending inappropriate, inaccurate, or damaging responses to potential clients at scale.
The workflow is technically sound but too expensive to operate.
You need Claude's enterprise plan to send emails automatically.
===
What is "workflow observability" and why does it matter as AI workflows become more complex?
The ability to watch AI generating its responses in real time.
The ability to monitor, log, and audit what AI workflows are doing at each step — critical for diagnosing failures, maintaining quality, ensuring compliance, and improving workflow performance over time.
A feature that lets users see which AI model is running their workflow.
Workflow observability is only relevant for technical teams, not generalist practitioners.
===
You build a workflow where Claude analyses customer feedback and routes it to the appropriate team. After deployment, you discover it is misrouting 15% of cases. What is the correct response?
Accept the 85% accuracy as a good enough result for automation.
Analyse the misrouted cases to identify the pattern, update the routing criteria in the prompt, add examples of the tricky cases, and re-test before redeployment — treating each failure as a specification gap to fix.
Replace Claude with a fine-tuned classification model immediately.
Add more routing categories to handle the edge cases.
===
What is the most important metric for evaluating an AI workflow in a professional context?
The number of API calls the workflow makes per day.
The quality and reliability of outputs relative to the professional standard they must meet — not speed, cost, or volume, which are secondary metrics.
The speed at which the workflow completes tasks.
The cost per task completed relative to manual execution.
===
What is "prompt chaining" and how does it differ from a single complex prompt?
Connecting multiple Claude sessions to share context across devices.
Breaking a complex task into a sequence of simpler prompts where each output feeds the next — enabling better quality control, error isolation, and intermediate validation than attempting everything in one prompt.
Asking Claude the same prompt multiple times to improve accuracy.
A technique for making prompts shorter by splitting them across messages.
===
You want to scale an AI workflow from running once per week to running thousands of times per day. What changes most in the design considerations?
You need a faster internet connection.
Scale introduces reliability requirements (every edge case now happens regularly), cost management, error rate impact (1% failure rate means thousands of daily errors), and monitoring complexity — all requiring design attention before scaling.
You simply run the same workflow more frequently.
You need to upgrade to Claude's enterprise API tier only.
===
What is the highest-leverage investment a Generalist Fellow can make after completing the Fellowship?
Learning to code so they can build more sophisticated AI tools.
Building a personal library of tested, documented workflow templates — each one refined through real use — that compounds their productivity permanently and can be shared, adapted, and improved over time.
Keeping up with every new AI tool that launches.
Getting certified in as many AI platforms as possible.
===
What is the single most important capability that separates a Generalist Fellow from a casual AI user in a professional environment?
Access to paid AI subscriptions with more powerful models.
The ability to design AI workflows that reliably produce professional-grade outputs at scale — not just getting good results on individual queries when conditions are perfect.
Speed of prompting — being able to write prompts faster than colleagues.
Knowledge of more AI tools than other team members.
===
A Generalist Fellow is embedded in a finance team that has never used AI. What is the highest-impact starting point?
Immediately automate the most complex financial models.
Identify the single most time-consuming, repetitive, clearly defined task — likely report drafting, data interpretation, or meeting prep — and build a reliable AI workflow for that task first to demonstrate value.
Train the entire finance team on Claude before starting any work.
Build a comprehensive AI strategy document before touching any actual tasks.
===
You are using Claude to support a marketing team's content production. What workflow produces the most consistent brand-aligned output?
Give Claude the brief and let it write content without constraints.
Store brand voice guidelines, tone rules, audience personas, and example content in the Project — so every content draft starts from a fully briefed AI that never needs re-orienting on brand.
Have a human rewrite all AI content from scratch to ensure brand alignment.
Use Claude only for editing human-written content, not for initial drafts.
===
An HR professional uses a Generalist Fellow's AI workflow to help screen job applications. What is the most critical design element?
Speed — the workflow should process applications as fast as possible.
A structured output that identifies relevant experience and flags potential concerns, combined with a mandatory human review before any candidate is shortlisted or rejected.
A scoring system that automatically ranks candidates and sends rejections.
Integration with all major job portals for automatic application retrieval.
===
A founder uses Claude to help with investor communications. What risk requires the most careful prompt design?
The risk that Claude writes too formally for the founder's voice.
The risk that Claude generates financial projections, performance claims, or forward-looking statements that are inaccurate, misleading, or potentially in breach of securities regulations.
The risk that investor communications are too long.
The risk that Claude uses industry jargon the investors might not understand.
===
A product team wants to use Claude to analyse customer interview transcripts. What approach produces the most actionable insights?
Ask Claude to summarise each transcript individually.
Define specific analytical questions before processing transcripts — what pain points, what jobs-to-be-done, what objections — then have Claude analyse all transcripts against those specific dimensions and synthesise patterns across them.
Ask Claude to identify everything important in the transcripts.
Have Claude create a single paragraph summary of all interviews combined.
===
A legal team wants to use Claude to help review contracts. What is the most responsible workflow design?
Have Claude identify and accept all standard clauses automatically.
Use Claude to flag non-standard clauses, missing provisions, and unusual terms for lawyer review — Claude surfaces issues faster than manual reading, but all legal conclusions and decisions remain with qualified counsel.
Use Claude only for contracts below a certain value threshold.
Have Claude rewrite problematic clauses and send the revised contract to the counterparty.
===
What is the most valuable thing a Generalist Fellow brings to a domain team that has been using AI independently?
More expensive AI tool subscriptions.
A systematic approach to workflow design — structured prompting, persistent context in Projects, documented templates, and quality evaluation — replacing ad-hoc AI use with reliable, scalable processes.
Knowledge of more AI tools than the domain team currently uses.
The ability to build custom AI applications using code.
===
You are helping a sales team use AI to research prospects before calls. What makes this workflow genuinely valuable versus just adding AI to the mix?
Making the research process faster.
Redesigning how research flows into call preparation — AI researches and structures context in a defined format, which directly populates a call prep template that the salesperson reviews and adds personal context to before the call.
Replacing manual research entirely with AI-generated profiles.
Using AI to score prospects and prioritise the call list automatically.
===
A Generalist Fellow is asked to help a finance team build an AI workflow for monthly reporting. The team produces 12 different reports for different stakeholders. What is the right starting approach?
Build all 12 report workflows simultaneously to save time.
Identify the report that is most time-consuming, most consistent in structure, and least sensitive to errors — build that workflow first, establish quality, then systematically expand to others using the same template logic.
Build the most complex report workflow first to tackle the hardest challenge.
Ask AI to design the workflow for all 12 reports at once.
===
What is the most common mistake Generalist Fellows make when embedding AI in a domain team's workflow?
Building workflows that are too simple for the team's needs.
Designing workflows for ideal conditions without accounting for how the domain team actually works — the real input variability, approval processes, compliance requirements, and edge cases that only domain experts know about.
Using Claude instead of a domain-specific AI tool.
Over-documenting the workflow in ways the domain team ignores.
===
A Generalist Fellow is supporting a product team that wants to use AI for user research synthesis. What output format produces the most value for product decisions?
A comprehensive summary document of all research findings.
A structured synthesis organised around specific product questions — what evidence exists for each, what confidence level is warranted, and what further research is needed — directly mapped to the decisions the team needs to make.
A list of all quotes from user interviews categorised by theme.
A ranked list of user complaints from most to least common.
===
A Generalist Fellow is asked: "Can AI do X for our team?" What is the most professional and accurate initial response?
"Yes, AI can do everything — let me show you."
"It depends on how X is defined, what quality standard is required, and what the cost of errors is. Let me map the task and we can design a test to find out."
"No, AI is not reliable enough for professional workflows yet."
"Let me research which AI tools are available for X first."
===
What makes a domain-specific AI workflow "sustainable" over time?
Using the most advanced AI model available.
Clear documentation, ownership (someone responsible for maintaining it), a review cadence for prompt quality, and a feedback loop from users that flags when output quality degrades.
Automating as much of the workflow as possible to reduce human dependency.
Sustainability is determined by the AI tool — not the workflow design.
===
A Generalist Fellow has built an effective AI workflow for one domain team. How should they approach expanding it to other teams?
Copy the exact workflow to all teams immediately.
Treat each new team as a distinct deployment — adapting the workflow to their specific context, constraints, and quality requirements, while leveraging the template logic and lessons learned from the first deployment.
Ask the first team to train the other teams directly.
Build a new workflow from scratch for each team to ensure it fits their needs perfectly.
===
What is the most important lesson from the domain application phase of the Generalist Fellowship?
AI works equally well in every domain with the same approach.
Domain expertise and AI capability must work together — AI amplifies what domain experts know; it cannot substitute for domain knowledge it doesn't have. The best AI workflows are built by people who understand both the domain and the AI.
Technical AI skills are more important than domain understanding.
AI is most valuable in domains where work is most repetitive.
===
What is the defining characteristic of an "agentic" AI system versus a standard conversational AI?
Agentic AI is more intelligent than conversational AI.
Agentic AI can plan and execute multi-step sequences of actions — using tools, making decisions, and adapting based on intermediate results — rather than just generating a single response to each input.
Agentic AI requires no human supervision.
Agentic AI is a paid enterprise feature not available to generalist practitioners.
===
You are designing an AI agent that will manage calendar scheduling autonomously. What is the most critical safety design principle?
Give the agent access to all team calendars for maximum context.
Scope the agent's permissions to the minimum necessary, require explicit confirmation before creating or modifying events involving external parties, and log all actions for review.
Test the agent for a week before turning off human oversight.
Use the most capable AI model to reduce scheduling errors.
===
What is the "orchestrator" role in a multi-agent AI architecture?
The human who oversees the AI agents.
The top-level AI agent that breaks down a complex goal, delegates subtasks to specialised sub-agents, collects their outputs, and synthesises the final result.
The AI company's server infrastructure that routes requests.
The most capable AI model in a multi-agent system.
===
What is the most important consideration when evaluating an AI system's output for professional use?
Whether the output matches the expected format.
Whether the output meets the professional quality standard required for its intended use — accuracy, completeness, tone, and fitness for purpose — evaluated against the specific context, not generic AI quality standards.
Whether the output was generated faster than a human would produce it.
Whether the AI used the most recent information available.
===
What is "RAG" and when should a generalist recommend it over standard prompting?
Rapid Answer Generation — a technique for getting faster AI responses.
Retrieval-Augmented Generation — when a task requires accurate, specific information from a large, frequently updated knowledge base that cannot fit in a single prompt context window.
RAG is always superior to standard prompting for professional use.
RAG is a coding technique only relevant for AI developers.
===
What does "evaluation" mean in the context of building AI systems, and why does it matter for generalists?
Testing whether an AI tool is worth paying for.
The systematic process of measuring AI system performance against defined criteria — enabling generalists to objectively compare prompts, workflows, and systems rather than relying on subjective impression.
Evaluation is a technical process only relevant to AI engineers.
Asking Claude to evaluate its own output quality.
===
A company wants to deploy Claude for customer support. What is the most important architectural decision before deployment?
Which subscription tier of Claude to use.
Where the human review checkpoints are — which queries AI handles autonomously, which require human escalation, and what triggers escalation — because these decisions determine both quality and risk exposure.
How many customer support agents to retain after AI deployment.
Whether to use Claude or a competitor AI model.
===
What is "grounding" in an AI system architecture and why is it critical for professional applications?
Making AI responses sound confident and authoritative.
Connecting AI outputs to specific, verifiable source documents — so responses can be traced to their basis and the AI is constrained to what those sources actually say rather than generating from general training.
Grounding is a training technique used by AI companies.
Ensuring AI responses are appropriate for a professional audience.
===
What is the purpose of a "fallback" in an AI workflow architecture?
A backup AI model that activates when the primary model is unavailable.
A defined alternative path the workflow takes when AI output fails to meet quality criteria — preventing workflow failure from propagating and ensuring the task still gets completed, possibly via human handling.
The ability to undo an AI action after it has been taken.
A feature that stores previous AI outputs for reuse.
===
What is the most important thing to monitor after deploying an AI workflow in a professional environment?
The number of AI requests processed per day.
Output quality over time — specifically whether the distribution of real production inputs is matching the prompt's design assumptions, and whether quality is stable or drifting.
The cost of AI API calls per month.
Whether users are satisfied with the AI interface.
===
What distinguishes a well-architected AI system from a collection of individual AI prompts?
A well-architected system uses more advanced AI models.
A well-architected system has defined interfaces between components, explicit quality gates, fallback logic, monitoring, and documentation — it behaves predictably and maintains quality even as inputs and context change.
A well-architected system requires an engineering team to build and maintain.
Architecture is only relevant for systems processing more than 1,000 requests per day.
===
What is the relationship between AI workflow design and organisational change management?
They are separate concerns — AI design is technical, change management is HR.
AI workflow deployment almost always changes how people work — requiring stakeholder engagement, adoption support, training, and feedback loops — and the best-designed AI workflow will fail if the change management is neglected.
Change management is only needed when AI is replacing human roles entirely.
AI workflows that produce clearly better outputs are adopted automatically without change management.
===
You are evaluating an AI vendor's claim that their system achieves "95% accuracy" on a task relevant to your professional use case. What additional information is most important before acting on this claim?
What AI model powers the vendor's system.
How accuracy was measured — what the evaluation set contained, whether it represents your specific use case and distribution, and what the 5% failures looked like — since accuracy on a benchmark rarely translates directly to accuracy in production.
Whether the vendor is profitable and well-funded.
How long the vendor has been in business.
===
What is the most important capability a Generalist Fellow develops that enables them to evaluate and recommend AI systems professionally?
Knowledge of all available AI tools and their technical specifications.
The ability to define clear evaluation criteria for any professional AI task — specifying what good output looks like, what failure modes are unacceptable, and how to test systematically — independent of which AI tool is being evaluated.
Relationships with AI vendors who can provide professional recommendations.
Deep knowledge of one AI platform that can be applied to all evaluation scenarios.
===
As a Generalist Fellow who has completed the Level Up diagnostic, what is your primary responsibility when working with AI in professional settings?
Maximising the number of tasks completed using AI.
Maintaining professional accountability for all AI-assisted work — ensuring outputs meet professional standards, errors are caught before they cause harm, and human judgment is applied where AI judgment is insufficient.
Staying updated on the latest AI tools and models.
Building the most sophisticated AI workflows possible.
===
A senior colleague asks you to design an "AI strategy" for your team. Where do you start?
Research all available AI tools and present a comparison.
Diagnose the team's highest-value, highest-friction workflows first — then design an AI adoption sequence that starts with the clearest wins and builds toward more complex automation.
Propose deploying AI across all workflows simultaneously for maximum impact.
Start with the most technically sophisticated AI application to demonstrate ambition.
===
What is the most important ethical responsibility of an AI-fluent professional in a team that does not yet understand AI's limitations?
Avoid using AI to prevent misunderstandings.
Actively correct AI overconfidence — explaining when AI output requires verification, flagging hallucination risks in high-stakes contexts, and ensuring colleagues don't treat AI output as authoritative without appropriate review.
Keep AI use private to avoid team confusion.
Let the team discover AI limitations through their own experience.
===
How should a Generalist Fellow approach the question: "Will AI replace my job?"
Reassure everyone that AI will never replace human jobs.
Acknowledge that AI is transforming roles — automating specific tasks within most jobs — and position yourself as someone who evolves with those changes by continuously developing the judgment, creativity, and relationship capabilities that AI augments rather than replaces.
Warn colleagues that their jobs are at risk to create urgency for AI adoption.
Avoid the question as it is too politically sensitive to address directly.
===
What is the most important governance consideration when deploying AI in a team that handles sensitive data?
Getting approval from the CEO before using any AI tool.
Establishing clear policies for which data can be processed by which AI tools, how AI-generated outputs are reviewed and approved, and who is accountable for AI-assisted decisions — before deployment, not after.
Only using AI tools that are approved by the government.
Ensuring all AI use is kept confidential from clients and stakeholders.
===
What is the most honest description of the current state of AI capability for complex professional work?
AI can now handle all professional tasks reliably with minimal oversight.
AI is extraordinarily capable on well-defined, high-volume, text-processing tasks and a powerful force multiplier for human experts — but it requires structured workflows, clear quality standards, and human judgment for complex, contextual, or high-stakes professional decisions.
AI is still too unreliable for any professional use without extensive technical setup.
AI capability is advancing so rapidly that any assessment today will be obsolete in a month.
===
A junior colleague approaches you excited about a new AI tool that claims to "eliminate the need for human review." What is your response?
Encourage them — AI is advancing rapidly and this may be true.
Engage sceptically but constructively: ask what the tool was evaluated on, what failure modes exist, and what the cost of errors would be in your specific professional context before considering adoption.
Dismiss the claim immediately as marketing hype.
Report the tool to IT security as a potential risk.
===
What is "responsible scaling" in the context of deploying AI across a professional organisation?
Using AI only for tasks below a certain financial value threshold.
Expanding AI deployment sequentially — only scaling to the next use case once the current deployment has demonstrated quality, reliability, and appropriate oversight — rather than deploying AI everywhere simultaneously.
Responsible scaling means reducing AI use as it becomes more capable to maintain human skills.
Scaling AI use in proportion to the organisation's revenue growth.
===
What is the most important thing a Generalist Fellow can do to ensure AI creates value rather than risk in their professional environment?
Use the most advanced AI models for all tasks.
Design every AI workflow with explicit quality standards, appropriate human oversight, clear accountability, and a feedback mechanism — ensuring AI augments professional judgment rather than bypassing it.
Keep all AI use internal and never share AI-assisted work externally.
Only use AI for tasks where errors are completely inconsequential.
===
How should a Generalist Fellow think about staying current in a field where AI capabilities change rapidly?
Read every AI news article published daily to stay fully informed.
Focus on developing durable capabilities — evaluation, workflow design, critical thinking, prompt design — that apply across tools, rather than chasing every new tool release.
Get certified in every major AI platform annually.
Follow AI researchers on social media for the most current insights.
===
What is the most important thing AI cannot do that a skilled professional must provide?
Generate large volumes of text quickly.
Exercise genuine professional judgment — contextual understanding, ethical reasoning, accountability for consequences, and the creativity that emerges from lived experience and domain expertise.
Access the internet for current information.
Produce outputs in a specific format reliably.
===
A client asks whether you used AI to produce work they commissioned. What is the most professional response?
Deny AI use to avoid any perception of lower quality.
Disclose AI involvement accurately and explain the quality assurance process — what AI contributed, how it was reviewed, and why the output meets the professional standard they contracted for.
AI use is always confidential and should never be disclosed.
Only disclose if the client specifically asks about each tool used.
===
What is the most accurate framing for how AI will change professional skills requirements over the next decade?
Technical skills will become less important as AI handles more technical work.
The premium on distinctively human capabilities — judgment, creativity, contextual understanding, relationship management — will increase as AI handles more routine technical and cognitive work.
All professionals will need to become AI engineers to remain relevant.
Professionals who specialise deeply in one domain will be most protected from AI impact.
===
What does it mean to be "AI-accountable" as a professional?
Being accountable to your employer for how much you use AI.
Taking full professional responsibility for all work that AI assists with — including verifying outputs, disclosing AI use appropriately, maintaining quality standards, and standing behind AI-assisted decisions as if you made them yourself.
Only being accountable for work where you did not use AI.
AI accountability belongs to the AI companies, not the professionals who use AI tools.
===
What is the single most important capability that the Generalist Fellowship develops that no tool, certificate, or course can replace?
Knowledge of the full range of available AI tools.
Applied judgment — the ability to evaluate what AI can reliably do in your specific professional context, design systems that leverage those capabilities appropriately, and maintain professional accountability for the results.
The ability to prompt Claude effectively for any task.
A network of other AI-fluent professionals.
===
A Generalist Fellow completing the Level Up diagnostic represents what stage in their professional AI journey?
The end point — completion of AI learning.
A demonstrated foundation — the beginning of a compounding professional journey where AI fluency, domain application, and professional judgment continue to develop through ongoing practice and deliberate learning.
The point at which they can transition to building AI models.
The qualification required to teach others about AI.
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

// Parse RAW into [{ q, opts:[A,B,C,D] }] where opts[1] (B) is the correct answer.
const ITEMS = RAW.split(/^===$/m)
  .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
  .filter((lines) => lines.length >= 5)
  .map((lines) => ({ q: lines[0], opts: lines.slice(1, 5) }));

// One item → the aptitude runner's question format, with options shuffled
// (correct option carries s:1; the rest s:0).
function toQuestion(item) {
  const options = item.opts.map((t, i) => ({ t, s: i === 1 ? 1 : 0 }));
  return { q: item.q, options: shuffle(options) };
}

export const GENERALIST_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions drawn from the full 150-question pool.
export function getGeneralistSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map(toQuestion);
}
