// AI for Students — combined question bank: Beginner (75) + Aware (75) = 150.
// Correct answers VARY (A/B/C/D); the correct option line is prefixed with "*".
// (In the Beginner source PDF the printed "Correct Answer" letters were
// inconsistent with the highlighted option + explanation — we follow the
// highlighted/explained answer.) Option order is shuffled at session build.
//
// getStudentSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
A student asks Claude to solve a maths problem. Claude gives a wrong answer confidently. Why?
Claude lacks access to a built-in calculator.
Claude is not designed for maths questions.
*AI generates plausible text, not verified answers.
The student did not phrase the question clearly.
===
Which task is AI most reliably suited for?
Checking whether a news story is accurate.
Predicting stock prices using historical data.
Telling you what decision you should make.
*Drafting, summarising, and restructuring text.
===
A classmate says AI is just a smarter search engine. The key difference is:
AI is faster and covers more topics.
*AI generates new responses rather than retrieving pages.
AI works offline while search engines need internet.
AI handles only text while search handles images too.
===
You ask Claude the same question twice and get different answers. This tells you:
Claude is malfunctioning and should be reset.
*AI outputs are probabilistic, not fixed results.
The question was too vague for AI to handle.
Claude is learning from your previous question.
===
A student submits an AI-written essay as their own. The main risk is:
The essay will contain grammar and style errors.
The teacher can detect AI writing automatically.
*The student misses the learning the task builds.
The AI may have plagiarised from another student.
===
What does it mean that AI has a "knowledge cutoff"?
AI stops answering after a certain number of queries.
AI cannot process information beyond a word limit.
AI cannot remember previous conversations you had.
*AI was only trained on data up to a specific date.
===
Which task is AI least suited to handle reliably?
Summarising the main points of a long article.
Suggesting synonyms for overused vocabulary.
*Verifying whether a specific news story is true.
Helping restructure a disorganised paragraph.
===
A student notices Claude adds facts that were not in the original document. This is called:
Contextual inference from related training data.
Semantic prediction based on document patterns.
Knowledge interpolation from the training corpus.
*Hallucination — generating plausible but false content.
===
What best describes what Claude actually "understands"?
Claude understands language the same way humans do.
*Claude processes patterns in text without comprehension.
Claude understands facts but not emotions or context.
Claude understands only the topics in its training data.
===
A student asks Claude for medical advice about a symptom. The best response is:
A diagnosis based on the symptom and likely conditions.
A refusal to answer any medical question at all.
*General information with a recommendation to see a doctor.
A list of conditions ranked from most to least probable.
===
How do AI models actually learn?
By searching the internet during each conversation.
From real-time feedback given by users during chats.
*From patterns in large datasets before deployment.
By reading textbooks that are programmed into them.
===
A student uses AI for all homework and stops trying independently. The main long-term risk is:
The AI will eventually start giving incorrect answers.
*The student's own cognitive skills will weaken over time.
Teachers will design harder tasks to prevent AI use.
The student will lose interest in non-AI learning methods.
===
A student plans to use an AI fact in a project. What should they always do first?
Use it if the AI responded with high confidence.
Ask a second AI model to confirm the same fact.
*Verify it against a reliable independent source.
Check whether classmates have seen the same fact.
===
Which is a genuine benefit of AI that students can use well?
Getting accurate answers without doing any research.
Replacing the need to read primary source material.
*Getting fast feedback on drafts and writing quality.
Checking whether online sources are academically credible.
===
Why does giving AI context behind your question improve the response?
Context helps AI connect to live internet sources.
*Context prevents AI from giving generic responses.
Context activates more processing power in the model.
Context makes AI responses more honest and accurate.
===
An AI image generator creates a realistic photo of an event that never happened. Using it in a school project risks:
Producing an image with visible AI artifacts.
*Presenting fabricated content as a real event.
Automatically infringing copyright on real images.
Triggering content filters in the school's systems.
===
You paste a 10-page document into Claude and ask for a summary. It misses a key point from page 7. Why?
Claude cannot process more than 5 pages at once.
Claude randomly skips sections of long documents.
Key detail was formatted in a way Claude cannot parse.
*AI can under-weight information from the middle of long inputs.
===
A student asks an AI chatbot for a laptop recommendation. How reliable is this?
Very reliable — AI tracks current prices and reviews.
Reliable if the student gives a clear budget.
*Partially reliable — the information may be outdated.
Completely unreliable for any product decisions.
===
Which of these best describes what a "prompt" is?
A command that programs AI behaviour permanently.
A pre-written template stored inside the AI model.
A script the AI uses to structure its answers.
*The input you give AI to generate a response.
===
A student asks Claude to "write me a good essay" and gets a generic result. Most likely reason?
Claude cannot write essays on general topics.
The topic was too broad for AI to process.
*The prompt gave Claude no specific context to work from.
Claude needed a longer instruction to perform well.
===
What is the main limitation of AI translation for academic work?
AI translation tools are broadly inaccurate.
AI cannot translate non-Latin script languages.
AI translation is too slow for academic deadlines.
*Nuance, idiom, and specialist terms may be mistranslated.
===
A student finds that Claude gives different quality answers depending on how the question is asked. This shows:
Claude has inconsistencies in its training data.
Claude works better for some students than others.
*AI output quality is highly sensitive to input quality.
The student should switch to a more reliable AI tool.
===
Which task should a student never rely on AI alone to complete?
Drafting a first version of a personal statement.
Generating questions to study from a chapter.
*Assessing whether an academic source is credible.
Suggesting synonyms for words used too frequently.
===
A student uses AI to generate practice quiz questions from their textbook. This is:
Academically dishonest without teacher permission.
Only effective for subjects with factual content.
*Useful — it supports active recall and self-testing.
Less effective than re-reading the chapter directly.
===
What is the most important habit when using AI for research?
Choosing the AI tool with the largest training dataset.
Asking follow-up questions to get more depth.
*Treating AI outputs as starting points, not final answers.
Clearing conversation history before each new topic.
===
A student finds Claude provided a citation that does not exist. This is an example of:
Copyright infringement by the AI model.
A database retrieval error in the AI system.
The AI deliberately providing misleading information.
*Hallucination — generating plausible but false content.
===
A student uses Claude for an initial explanation then verifies against a textbook. This approach is:
Inefficient — the textbook should always come first.
Dishonest — AI explanations should not be used in study.
*Effective — AI explanation then source verification.
Risky — AI explanations may conflict with textbooks.
===
Which prompt gets the most useful response from an AI writing assistant?
"Write something for my English class."
"Improve my essay on climate change."
"Fix the grammar errors in this paragraph."
*"Review this paragraph's argument and suggest one fix."
===
Why might AI give a confident answer about a recent event that is wrong?
AI does not know how to express uncertainty in responses.
The question was not specific enough about the event.
The event was too complex for the AI model to process.
*The AI's training data does not include recent events.
===
A student says: "I always double-check what AI tells me." This habit reflects:
A lack of trust in modern technology.
A misunderstanding of how AI actually works.
An unnecessarily cautious approach to AI tools.
*Critical thinking appropriately applied to AI outputs.
===
What makes a prompt effective?
Using formal, professional language throughout.
Keeping it short so the AI processes it faster.
*Giving AI the context, task, and desired output clearly.
Including technical vocabulary relevant to the topic.
===
Which prompt approach gets the simplest explanation of photosynthesis from Claude?
Ask Claude to explain photosynthesis without any constraints.
Ask Claude to explain photosynthesis in "simple terms" only.
*Specify the exact age and knowledge level of the target audience.
Request a detailed and comprehensive explanation of the topic.
===
Claude gives a partially helpful answer that misses your main point. Best next step?
Start a new conversation and rephrase from scratch.
Try a different AI tool that may understand better.
*Rephrase the question with more specific context.
Accept the partial answer and supplement with research.
===
What does "role prompting" mean?
Asking AI to act as a character in a creative scenario.
*Telling AI to respond as a specific type of expert.
Setting rules for how AI must behave across sessions.
Assigning different AI tools to different task types.
===
A student uses the same prompt for different topics and gets inconsistent results. Most likely reason?
The AI randomly changes how it interprets prompts.
The prompt is too short to apply across different topics.
*Different topics need different context to be useful.
The AI forgets the student's preferences between sessions.
===
Which technique most helps Claude give a structured response to a complex question?
Asking the question formatted as bullet points.
*Asking Claude to respond step by step.
Using academic language in the question.
Keeping the prompt under twenty words.
===
A student pastes a long passage and asks Claude "Is this good?" The problem with this prompt is:
*"Good" is undefined — the prompt has no evaluation criteria.
The passage is too long for Claude to assess effectively.
Claude cannot evaluate creative or academic writing.
The prompt should specify the subject area first.
===
A student types a long complex paragraph as a prompt and gets a confusing, off-topic response. They should:
Add even more context so Claude understands better.
Use a different AI tool for complex multi-part questions.
*Break it into one clear question at a time.
Repeat the same prompt until Claude gets it right.
===
What is the benefit of giving Claude an example of the output you want?
It prevents Claude from producing overly long responses.
It makes Claude process your request more quickly.
*It gives Claude a concrete format to match.
It ensures Claude commits to a specific answer.
===
When is following up with Claude after an initial response most valuable?
Only when the initial response is entirely wrong.
*When the response partially helps but misses something.
Only for technical or highly specialised questions.
After every response to check for potential errors.
===
A student wants brainstorming help for a history project. Which prompt works best?
"Give me project ideas for history class."
"What should I do my history project on?"
"Brainstorm some history topics I could research."
*"WWI Year 10 project: give me five angles I haven't explored."
===
A student notices that adding "explain your reasoning" to any prompt improves the answers. Why?
It activates a special reasoning mode in the model.
It prevents Claude from giving overly short responses.
*It encourages Claude to produce more structured thinking.
It makes Claude access more of its training knowledge.
===
What is most important to include when asking Claude to help with a writing task?
The target word count for the final piece.
*The audience, purpose, and tone of the writing.
Your own draft so Claude has something to improve.
A list of specific words you want Claude to include.
===
A student asked Claude three times and got three different answers. They conclude AI is useless. What is wrong with this reasoning?
They should have used a more advanced AI model.
They should have accepted the first answer Claude gave.
*Variation signals the prompt was too vague, not that AI fails.
AI variation is random and cannot be avoided by anyone.
===
Which prompt approach most likely produces a useful study plan from Claude?
Ask Claude for a study plan without naming the subject or exam.
Ask Claude for general advice on studying more effectively.
*Specify the subject, timeframe, and the structure you want in the plan.
Ask Claude what the best general science exam preparation method is.
===
Claude says a scientist won a Nobel Prize. The student plans to use this in a presentation. They should:
Use it — Claude is reliable for well-known historical facts.
Ask Claude to confirm the claim one more time.
Only include it if the scientist is widely recognised.
*Verify it in a reliable source before including it.
===
A student said "are you sure?" and Claude changed its answer. This happened because:
The follow-up gave Claude new information to work from.
Claude updated its knowledge from the conversation.
*AI often defers to user challenges even when originally right.
The second computation used more processing power.
===
A student reads that AI is "objective because it uses data, not opinion." What is wrong with this?
AI does use opinion — it is programmed with developer views.
*Data itself reflects human choices about what to collect.
AI is subjective because it produces random outputs.
Objectivity is impossible for any information source at all.
===
A friend shares a professional-looking AI-generated article with citations. Before sharing it further, you should:
Share it if the topic seems plausible and relevant.
Read it carefully and check for logical errors.
*Check whether the article and its citations actually exist.
Ask Claude whether the article is trustworthy.
===
Claude gives a confident answer about a current news event. The student should be cautious because:
Claude cannot access news from any time period.
News topics are too complex for AI to summarise.
Claude is not permitted to discuss current events.
*Claude has no information about events after its training cutoff.
===
A student asks Claude which religion is best. What response should they expect?
A recommendation based on ethical principles.
A ranked comparison of major world religions.
*A balanced overview without a personal recommendation.
A refusal to answer any religious questions.
===
A student uses Claude to research both sides of a debate. Key caution?
Claude will only present one side convincingly.
*Claude may produce incomplete arguments for either side.
Claude is not permitted to generate debate arguments.
Claude's debate content cannot be used for academic work.
===
A student finds that Claude always agrees with whatever position they argue. This means:
Claude is confirming their arguments are logically sound.
This is normal — AI is designed to be supportive.
*The AI is showing sycophancy, not genuine agreement.
The student is an unusually clear and logical thinker.
===
Which is the most appropriate use of critical thinking when using AI?
Avoiding AI for any task that involves verified facts.
Only using AI tools from well-known companies.
*Evaluating AI outputs the same way you would any source.
Trusting AI more than websites because AI is more advanced.
===
A student realises they always accept AI answers without checking. What should they change?
Switch to a different AI model with better accuracy.
*Build a habit of verifying key claims before use.
Limit AI use to topics they already understand well.
Always disagree with AI first to test for sycophancy.
===
Why might AI give a convincing answer that is still wrong?
The AI was trained on too little data for this topic.
The question was phrased in a way AI misinterpreted.
*AI optimises for plausible text, not for verified truth.
The AI had insufficient processing time for the question.
===
A student asks Claude what career to choose. The most appropriate AI response is:
A ranked recommendation based on the student's interests.
A list of the highest-paying careers to consider.
*Questions to help the student clarify their own priorities.
A prediction of which careers will exist in ten years.
===
What is the most reliable way to test whether an AI-generated claim is accurate?
Ask the same AI to double-check the claim it made.
See whether classmates or friends agree with the claim.
Ask a different AI model the same question independently.
*Check whether the claim appears in a trusted authoritative source.
===
A student trusts AI more than Wikipedia because "AI sounds more intelligent." The flaw is:
Wikipedia is actually more accurate than AI.
*Intelligence of tone does not indicate accuracy of content.
AI and Wikipedia use the same underlying training data.
Trust in sources should be based on personal experience.
===
A student uses AI to build arguments for a position they personally disagree with. This is:
Academically dishonest in all circumstances.
Risky because AI arguments may sound persuasive but be wrong.
Only acceptable when explicitly assigned by a teacher.
*A useful exercise in perspective-taking and argumentation.
===
A teacher says students can "use AI to assist" with an assignment. This most likely means:
Generate the full assignment using AI tools.
*Use AI to brainstorm and draft, then develop it yourself.
Use AI to proofread only after writing the full draft.
Use AI to find and list sources for the bibliography.
===
A student generates a report using AI, edits it slightly, and submits it. The main issue is:
The edits were not enough to make it original.
AI-generated reports always contain factual errors.
*The work does not reflect the student's own learning.
The student did not cite the AI tool as a source.
===
A school has no AI policy yet. A student is unsure about using AI for an assignment. Best approach?
Use it quietly since no rule currently prohibits it.
Avoid AI entirely until a formal policy is published.
*Ask the teacher directly before using it.
Use AI only for research tasks, not for writing.
===
A student struggling with a concept uses Claude for a clearer explanation, then returns to the textbook. This is:
A shortcut that avoids genuine engagement with the content.
Only appropriate if the textbook explanation has errors.
Only useful for students who learn better by reading.
*An effective use of AI as a learning scaffold.
===
What is academic integrity in the context of AI use?
Avoiding AI for any part of school or homework tasks.
Using AI only for subjects where it performs most reliably.
*Being honest about how AI contributed to your submitted work.
Ensuring AI-generated content is free of factual errors.
===
A student uses AI to check their essay for grammar, then improves phrasing themselves. This is:
Dishonest — all writing must be done independently.
*An appropriate use of AI as an editing support tool.
Only acceptable if the teacher allows spell-checkers.
Risky because AI may alter the student's intended meaning.
===
A student asks Claude to write their creative writing task because they "aren't good at it." The main problem is:
Claude's creative writing lacks originality.
*The assignment exists to build the skill they feel they lack.
AI creative writing rarely meets teacher expectations.
Claude may produce content that violates school guidelines.
===
What is the most honest way for a student to acknowledge AI use in submitted work?
Add "some AI assistance was used" to the references.
*Disclose specifically what AI was used for and how ideas developed.
Only acknowledge AI if the teacher specifically asks about it.
Acknowledge AI if more than half the content was generated by it.
===
A student practises debate by arguing with Claude before the class debate. This is:
Unfair to students who cannot access AI tools.
Only useful if Claude produces genuinely challenging counterarguments.
Dishonest if the student does not disclose the practice method.
*A legitimate technique that develops argumentation skills.
===
A student finds Claude more engaging than the textbook and skips the chapter. The risk is:
Claude uses more complex vocabulary than textbooks.
*Claude may omit content the exam specifically covers.
Textbooks are always more accurate than AI explanations.
The teacher will know they did not read the chapter.
===
A student asks AI to predict possible exam questions. How useful is this?
Very useful — AI can analyse past paper patterns precisely.
*Moderately useful as brainstorming but should not replace full preparation.
Not useful — AI has no knowledge of any specific exam.
Only useful when past papers are available online.
===
What is the most important skill developed by using AI well at school?
Typing prompts quickly and accurately.
Identifying which AI tool to use for each task type.
Producing higher-quality work in less time than peers.
*Evaluating, verifying, and improving AI-generated outputs.
===
A student wants AI to help them solve a problem without giving the answer directly. Best approach?
Accept the answer and move on to the next problem.
Ask Claude to confirm the final answer is correct.
*Ask Claude for only the first step, then work from there.
Stop using AI for tasks that involve problem-solving.
===
A student uses AI for every task and feels productive. The risk they may not notice is:
They may be producing work that is too advanced for their level.
AI tools may become unavailable before future exams.
Their teacher may be using AI-detection software.
*They may build AI dependency rather than personal capability.
===
A student who uses AI and a student who does not both score the same on an exam. What does this most suggest?
AI use during study makes no measurable difference.
The exam format successfully prevented AI from helping.
Both students have identical underlying capabilities.
*They may have very different skill levels developing underneath.
===
A language model generates each word by:
Searching a knowledge base for the most relevant phrase.
*Sampling from a probability distribution over its vocabulary.
Applying logical inference rules to the input question.
Retrieving the closest matching sentence from training data.
===
What does "temperature" control in a language model output?
The maximum number of tokens the model can generate.
The speed at which the model processes your input.
The confidence threshold for including a fact in the response.
*The randomness or creativity in the sampled token distribution.
===
Why can a language model produce different answers to the identical prompt in separate sessions?
*Randomness in the sampling step produces varied outputs.
The model updates its weights between each conversation.
The model searches different databases each session.
Previous conversations influence the model's knowledge state.
===
What is a "context window" in a language model?
The time period within which the model can access recent news.
The set of topics the model has been trained to respond to.
*The maximum total tokens the model can process at one time.
The number of follow-up questions allowed in one session.
===
Which statement about transformer-based AI models is accurate?
They process text sequentially, word by word, like humans read.
*They use attention mechanisms to weigh relationships between tokens.
They store factual knowledge in a searchable lookup table.
They reason from first principles to arrive at conclusions.
===
Why does Claude sometimes refuse to answer certain questions?
*Its training includes guidelines that shape which requests it declines.
It cannot process questions that exceed its topic training range.
It detects harmful intent using a separate threat classifier.
Its context window is too small for sensitive or complex questions.
===
What is "fine-tuning" a language model?
Adjusting the model's temperature for better output quality.
Filtering the model's training data to remove harmful content.
Reducing the model's size so it runs faster on a device.
*Training an existing model further on a specific dataset or task.
===
A model trained primarily on English text is asked a question in Bengali. The most likely outcome is:
It will refuse the question since it was trained only in English.
It will translate the question to English and respond in English.
*It may respond but with lower accuracy and fluency in Bengali.
It will generate the same quality response as it does in English.
===
What makes "hallucination" a structural property of language models rather than a fixable bug?
*Models predict probable text, not verified facts, by design.
Hallucination is caused by corrupted data in model storage.
It only occurs when the model has insufficient training data.
It can be fully eliminated by using a larger model size.
===
What happens when you reach the end of a model's context window in a long conversation?
The model automatically summarises the conversation and continues.
The model refuses to generate any further responses.
The model switches to a compressed memory mode.
*The model can no longer access the earliest parts of the conversation.
===
Why do larger language models generally perform better on complex tasks?
Larger models are trained on more recent data by necessity.
*More parameters allow more complex pattern representations.
Larger models have access to faster external knowledge bases.
More parameters increase the model's logical reasoning capacity.
===
What is the key difference between a base model and an instruction-tuned model?
Base models are larger and more capable than instruction-tuned ones.
Instruction-tuned models have access to real-time internet data.
*Instruction-tuned models are trained to follow conversational instructions.
Base models are designed for professional use; tuned models for consumers.
===
What does RLHF (Reinforcement Learning from Human Feedback) primarily do?
Trains models to retrieve and cite human-written sources accurately.
Reduces hallucination by checking outputs against a fact database.
Speeds up model training by using human-labelled data more efficiently.
*Trains models to produce outputs humans rate as more helpful and safe.
===
Why does providing a system prompt before user input improve Claude's behaviour?
It increases the model's context window for the conversation.
*It sets persistent context and behavioural guidelines for the session.
It reduces the model's response time by pre-loading intent.
It unlocks more accurate model outputs by activating expert mode.
===
What is the most accurate description of what a language model "knows"?
*Statistical patterns from training text that approximate knowledge.
A structured knowledge graph of facts stored during training.
Verified encyclopaedic facts curated before deployment.
Real-time information retrieved from internet sources.
===
You ask Claude to write a poem, and you ask it to solve a differential equation. Which task is Claude more structurally suited to?
The equation — mathematical reasoning is more reliable.
Both equally — Claude handles all text tasks the same way.
*The poem — language generation is its core competency.
The equation — it can access mathematical libraries.
===
A classmate says "Claude with web search is always accurate because it checks the internet." What is wrong with this?
*Claude still generates its synthesis of search results, which can contain errors.
Nothing is wrong — web search eliminates hallucination entirely.
Web search makes Claude slower but not more accurate overall.
Claude cannot actually browse the internet during web search.
===
Which of these tasks is Claude most likely to perform consistently well?
Predicting next week's stock price movements from news.
Diagnosing a rare medical condition from a symptom list.
Translating a complex legal contract to another language perfectly.
*Reformatting and restructuring a well-defined piece of text.
===
Why is Claude unreliable for tasks requiring precise numerical calculation?
It was not trained on mathematical data.
*It generates number tokens statistically, not arithmetically.
It does not have access to a calculation engine.
Numerical tasks exceed its context window capacity.
===
An AI tool claims "zero hallucination." The most critical response is:
Trust it — large companies would not make false capability claims.
Accept it for factual tasks but remain cautious for creative ones.
*Ask for evidence — no current language model can guarantee this.
Verify it by testing the tool on creative writing prompts only.
===
What does Claude do well that a basic search engine does not?
It retrieves the most recent and accurate factual information.
It provides source citations for every claim it makes.
It verifies information before including it in a response.
*It synthesises, explains, and reasons across multiple pieces of information.
===
You give Claude a 10-page document and ask it to find every mention of a specific term. What is the key reliability concern?
*Claude may miss instances depending on how it attends to the text.
Claude cannot process documents longer than 2 pages at a time.
Claude will only search the first and last paragraphs.
Claude requires the document to be in plain text format.
===
What is the most significant limitation of AI for creative writing assistance?
It cannot generate text in a first-person narrative voice.
*It produces statistically average outputs that can lack originality.
Creative writing tasks exceed its context window.
It only generates text in genres heavily represented online.
===
A student asks Claude to "read" an uploaded PDF. What is actually happening?
Claude visually reads and interprets each page like a human.
Claude downloads the file and searches it like a browser.
Claude accesses the PDF's metadata and key words only.
*Claude processes the extracted text content from the document.
===
Why might Claude perform worse on a highly specialised technical topic than a generalist one?
Claude applies more conservative limits on technical responses.
Technical topics exceed the model's logical processing capability.
*Specialised topics have less training data relative to general ones.
Claude routes technical queries to a reduced-capability sub-model.
===
What is the most appropriate use of AI in writing a formal research report?
Generating the complete report and submitting it as written.
*Drafting sections, which you revise, verify, and rewrite in your own words.
Generating citations and sources, which you compile into a bibliography.
Producing the final polished draft after outlining the structure yourself.
===
An AI writing tool rates your essay "8/10 for argument strength." How reliable is this score?
*It reflects pattern-matching against training examples, not true evaluation.
It is highly reliable — AI evaluates argument quality objectively.
It is reliable for structure but not for individual word choice.
It is accurate only if the tool was trained on academic essays.
===
Which scenario most clearly requires a human expert rather than AI?
Drafting the initial structure of a business proposal.
Explaining what a specific legal clause generally means.
*Diagnosing and prescribing treatment for a patient's symptoms.
Summarising a long meeting transcript into key action points.
===
Why does Claude sometimes decline to answer questions it could technically answer?
The question exceeded the factual scope of its training data.
Safety classifiers running in parallel override its responses.
Declining reduces server load for high-demand queries.
*Its training includes values that lead it to prioritise safety over capability.
===
The most accurate statement about AI and creativity is:
AI is fully creative because it generates content that did not exist before.
*AI can produce novel combinations but within statistical boundaries.
AI cannot be creative at all since it only recombines existing text.
AI creativity is identical to human creativity in practice.
===
You read a study that says "AI outperforms humans at X task." The most important follow-up question is:
*"Under what specific conditions and metrics was this evaluated?"
"Which company funded the research?"
"How long did the AI take compared to the human?"
"Was the same AI used for all human comparison groups?"
===
A chatbot passes the Turing Test with a specific evaluator. This proves:
It is indistinguishable from a human across all contexts.
It possesses general intelligence equivalent to a human.
*It can produce human-like text in that particular interaction.
It has genuine understanding of the questions it answered.
===
An AI company claims their model scores 90% on a medical knowledge exam. A critical reader asks:
"Why was only 90% achieved and not 100%?"
*"Does this performance transfer to real clinical decision-making?"
"Which competing AI models scored lower on the same exam?"
"Is the exam available for students to practise on?"
===
You see a viral post claiming "AI wrote this and it's perfect — AI is now better than humans at writing." The most accurate assessment is:
"If it looks perfect, it is perfect — quality is objective."
"This claim is certainly false — AI cannot match human writing."
"This claim is certainly true — AI now outperforms humans at text tasks."
*"Better at writing" requires defining what dimension of quality is being measured.
===
Your AI-generated essay received positive feedback from a peer. The safest conclusion is:
*The essay was effective for this reader in this context.
The essay is high quality and would perform well in any setting.
AI-generated essays are generally better than human-written ones.
You should use AI to write all future essays based on this result.
===
A student argues that AI cannot be biased because it uses maths. The most precise counter is:
AI maths is subjective and can be coded with intentional bias.
*The mathematical patterns were learned from biased human-generated data.
All mathematical systems contain inherent human biases.
Maths-based AI is only unbiased when trained on balanced datasets.
===
You use AI to research a historical event and it gives a detailed, confident account. The responsible next step is:
Accept it — history is well-documented in AI training data.
Add a disclaimer that the account may contain errors.
Ask the AI to list its sources to verify the account.
*Cross-reference with established historical sources before using it.
===
What is "prompt injection" and why does it matter for students using AI tools?
A technique for making AI prompts shorter and more efficient.
The process of adding context to improve AI response quality.
*Malicious instructions embedded in content that hijacks an AI's behaviour.
A method of injecting real-time data into an AI's training set.
===
An AI assistant confidently tells you that a specific scientific paper was published in Nature. Before citing it, you should:
Trust it — major journal names are well-known in AI training.
*Search for the actual paper in a verified academic database.
Ask the AI for the DOI number to use as your citation.
Add "(via AI)" after the citation to flag the AI source.
===
Why might AI perform better when you tell it what role to play (e.g., "act as a senior editor")?
*It activates patterns from training text written from that perspective.
It unlocks a dedicated expert module for that professional role.
It increases the model's reasoning capacity for the task.
It bypasses safety guidelines for more expert-level responses.
===
What is the most reliable method for verifying whether an AI output is factually accurate?
Running the same prompt through two different AI tools.
Asking the AI to rate its own confidence level.
*Tracing every specific claim to a citable primary source.
Checking whether the output sounds logical and well-written.
===
An AI tells you a company raised 50 crore in funding last month. What should alert you most?
The large funding amount — AI exaggerates financial figures.
The use of Indian currency — AI is less accurate on Indian data.
The specific number — AI always invents precise financial figures.
*The very recent timeframe — AI may not have this data.
===
What is the most accurate way to describe AI "understanding" of language?
True semantic comprehension equivalent to human reading.
*Sophisticated pattern matching that resembles but differs from human understanding.
Surface-level word matching with no semantic capability.
Full grammatical understanding with no real-world grounding.
===
A student uses an AI to "check if my argument is logically valid." What is the limitation?
AI cannot evaluate the logic of multi-step arguments at all.
AI logical checks are only reliable for arguments under 100 words.
*AI assesses plausibility from training patterns, not formal logical validity.
AI applies legal rather than philosophical logic standards.
===
What is the core skill that separates students who use AI effectively from those who do not?
*Critical judgment in evaluating and directing AI outputs.
Having access to the most powerful AI tools available.
Being able to write longer, more detailed prompts.
Understanding the technical architecture of the AI model.
===
Which professional task is Claude most reliably valuable for, right now?
Producing a final, publication-ready report on a complex topic.
Providing legally binding guidance on a regulatory question.
Replacing a qualified editor for a manuscript before submission.
*Generating a first draft that a human then revises and verifies.
===
You use Claude to generate code that will handle customer data. The first thing you must do after is:
Run it directly in production to see if it performs correctly.
*Review the code for logic errors and security vulnerabilities.
Ask Claude to review its own code to identify issues.
Have another AI tool validate the code before using it.
===
What is the most effective way to use Claude for learning a difficult concept?
Ask Claude to write a comprehensive summary you can memorise.
Ask Claude for the three most important facts about the concept.
*Ask Claude to explain it, then ask follow-up questions on what you didn't understand.
Ask Claude to generate a test on the concept to take immediately.
===
You need to summarise 50 research papers on a topic. Where does AI most help?
*Processing and synthesising patterns across many documents quickly.
Providing citable academic summaries of each paper.
Replacing the need to read any of the original papers.
Generating an annotated bibliography with verified citations.
===
A student builds a Claude-powered study assistant for their class. The biggest risk to address first is:
Claude will not understand questions from younger students.
Claude will generate responses that are too long for students.
Claude may respond in English even when asked in other languages.
*Claude may confidently give students incorrect information.
===
What does "RAG" (Retrieval-Augmented Generation) solve in language model applications?
It increases the speed of model responses in production.
It eliminates hallucination by blocking uncertain outputs.
*It supplements model knowledge with retrieved external documents.
It reduces the model size so it can run on local devices.
===
You are building a product that uses Claude to answer customer questions about your company. The most important safeguard is:
*A human review process for responses on sensitive topics.
Limiting Claude to responses shorter than 100 words.
Using the most expensive Claude model for accuracy.
Asking Claude to only answer questions it is confident about.
===
When is it appropriate to cite Claude as a source in academic work?
When the information it produced cannot be found elsewhere.
*When citing the tool itself as the method, not the facts it produced.
When you used Claude to generate the research question.
Citing Claude is always appropriate for any academic purpose.
===
A student uses an AI coding assistant that auto-completes their code. The most important habit to maintain is:
Running all suggested code in a separate testing environment.
Only accepting suggestions for syntax corrections, not logic.
*Reading and understanding every line of code before accepting it.
Asking the AI to explain every suggestion before accepting it.
===
What is the most honest statement about AI image generation for school projects?
AI images are indistinguishable from professional photography.
AI image generation is always appropriate for school projects.
AI-generated images are copyright-free and safe to use anywhere.
*It can produce visuals, but original thinking must come from you.
===
You want to use Claude to practise for a job interview. The most effective approach is:
*Ask Claude to conduct a mock interview, then give honest critique.
Ask Claude for a list of likely questions to memorise.
Ask Claude to write model answers to each question.
Ask Claude to predict which questions your interviewer will ask.
===
An AI tool automatically generates your class schedule. You notice it has scheduled two classes at the same time. This illustrates:
AI scheduling tools should never be used without human input.
*AI can make logical errors that humans can easily spot and correct.
The AI was not trained on scheduling data.
The error occurred because the context window was exceeded.
===
You want Claude to help you prepare for a science debate. Which use adds the most value?
Writing your opening statement so you can memorise it.
Predicting what the opposing team is likely to argue.
Producing a bibliography of sources that support your position.
*Generating strong counter-arguments to your position for you to address.
===
What is the key difference between AI being a "tool" and AI being an "authority"?
*A tool is directed by your judgment; an authority replaces your judgment.
Tools require technical skill to use; authority does not.
Tools are more accurate; authority is more convenient.
AI is both a tool and an authority depending on the task.
===
A student says: "I always ask AI to improve my writing, and it always makes it worse by sounding generic." The root cause is:
AI tools are not designed to improve personal writing voice.
Claude's writing style defaults to a formal academic register.
*Generic improvement prompts produce generic stylistic output.
The student's original writing is too informal for AI to process.
===
What is the most significant societal risk of deepfake video technology?
*Fabricated video of real people saying things they never said.
Reducing the quality of professional video production.
Making film and television content easier to produce.
Replacing the need for actors in commercial advertisements.
===
In India, AI-driven credit scoring impacts loan access for millions of people. The primary ethical concern is:
AI credit scores are slower to compute than human assessment.
Customers cannot check their AI-generated credit score.
AI credit scoring ignores repayment history as an input.
*Embedded bias may systematically disadvantage certain communities.
===
Who is ultimately responsible when an AI system causes harm to a user?
The AI system itself since it made the autonomous decision.
*The organisation that deployed the AI in that context.
The user who chose to trust and use the AI system.
The AI researchers who built the underlying model.
===
A student argues that AI should be banned from schools to prevent cheating. The most nuanced response is:
They are right — AI in schools causes more harm than benefit.
AI detection software is sufficient without needing any policy.
*Teaching responsible AI use better prepares students for the future.
Schools should only allow AI tools created for education.
===
What is the most honest statement about AI and privacy?
*Data shared with AI tools may be used in ways users do not expect.
AI tools are required by law to encrypt and protect all user data.
Privacy risks only exist when using free AI tools, not paid ones.
AI companies cannot access conversations due to technical barriers.
===
Why does AI replacing human workers raise concerns beyond just job loss?
AI tools always produce lower-quality work than human workers.
AI replacement is illegal under Indian labour protection laws.
*It concentrates economic gains in fewer hands and increases inequality.
Automation removes jobs that most people do not want anyway.
===
Which behaviour most clearly demonstrates AI literacy in a student?
Knowing the names and rankings of the top AI tools available.
Being able to explain how transformer architectures work.
Building a personal AI project using APIs and Python code.
*Critically evaluating AI outputs and verifying before using them.
===
An AI hiring tool is found to favour candidates from certain universities. The most constructive response is:
Stop using AI in hiring entirely across all organisations.
*Audit the model for training data bias and correct it.
Add a human as a final check who reverses all AI decisions.
Replace the AI tool with one from a different vendor.
===
What makes AI-generated misinformation more dangerous than traditional misinformation?
It is always more convincing than human-generated content.
It cannot be identified by any current detection tools.
*It can be produced at massive scale with minimal effort.
It spreads faster because AI tools share it automatically.
===
A company uses AI to personalise news feeds. The most important long-term concern is:
*Users see only content that reinforces their existing views.
Users will be charged for AI-curated news in the future.
Personalised feeds are slower to load than standard feeds.
AI cannot personalise news for users with niche interests.
===
India's draft Digital Personal Data Protection framework addresses AI. The most important implication for students is:
Students must register with the government before using AI.
*Personal data used to train AI tools may require your consent.
All AI tools operating in India must be built in India.
Indian students are legally prohibited from sharing data with foreign AI.
===
What is the most accurate description of AI's current role in scientific research?
A replacement for laboratory experiments and data collection.
A fully autonomous system for generating and validating hypotheses.
A tool only suitable for literature review, not active research.
*A powerful tool that accelerates discovery while requiring expert oversight.
===
You are a student writing about the ethics of AI surveillance. Claude helps you draft arguments. What is your ethical obligation?
Disclose that Claude co-authored your paper with you.
Only use Claude for arguments you already agree with.
*Understand the arguments well enough to defend them as your own.
Verify that Claude's arguments are legally compliant.
===
A school introduces an AI ethics module. What is the most important outcome it should produce?
Students who can identify and name all current AI tools.
*Students who can reason about AI impacts and make informed decisions.
Students who can build simple AI models using provided code.
Students who are aware that AI can be used for harmful purposes.
===
Menler positions itself as India's first Claude-native AI upskilling platform. For an AI-aware student, "Claude-native" most accurately signals:
The platform was built using Claude's API as a back-end service.
All Menler instructors were trained by Anthropic directly.
Menler is the official Claude training partner for Indian institutions.
*The curriculum is built around how Claude specifically works and is used.
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

export const STUDENT_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the full 150-question pool,
// each with its options shuffled.
export function getStudentSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}

// The bank's named sets, in source order (Beginner 1–5, then Aware 1–5).
export const STUDENT_SETS = [
  'What Is AI — Core Awareness',
  'AI Tools — What They Can & Cannot Do',
  'Talking to AI — Prompting Basics',
  'AI Judgment & Critical Thinking',
  'AI in School — Using It Responsibly',
  'How AI Models Actually Work',
  'AI Capabilities & Their Real Limits',
  'Thinking Critically About AI',
  'AI Tools in Practice',
  'AI Ethics & Society',
];

// A fresh session for one set: `count` questions from that set's block, options shuffled.
export function getStudentSet(setIdx, count = 15) {
  const per = Math.floor(ITEMS.length / STUDENT_SETS.length);
  const start = setIdx * per;
  return shuffle(ITEMS.slice(start, start + per)).slice(0, count)
    .map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
