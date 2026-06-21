// Combined AI for Students question bank — Aware (75) + Beginner (75) = 150.
// Unlike the Generalist bank, correct answers vary, so the correct option in each
// block below is prefixed with "*". Option order is shuffled at session build.
//
// getStudentSession(n) → a fresh random n-question session in the runner's format:
// { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
Which company makes Claude, the AI assistant used in Menler's programs?
OpenAI
Google
*Anthropic
Microsoft
===
You have used ChatGPT casually. What is the most important thing to understand about how it differs from a search engine?
ChatGPT searches the web faster than Google.
*ChatGPT generates new text based on learned patterns rather than retrieving existing web pages — making it better for drafting and explaining, but unreliable for current facts.
ChatGPT only works for creative writing tasks.
ChatGPT remembers everything you have ever asked it across all sessions.
===
What does GPT stand for in ChatGPT?
General Purpose Technology
*Generative Pre-trained Transformer
Global Processing Tool
Graphical Prediction Technology
===
Which of the following AI tools is specifically designed for generating images from text descriptions?
Claude
*Midjourney
Grammarly
Notion AI
===
A student says "all AI tools are basically the same." What is the most accurate response?
They are correct — all AI tools use the same underlying technology.
*Different AI tools are built on different models, trained on different data, optimised for different tasks, and have different safety approaches — they are not interchangeable.
They are correct — the only difference is the user interface.
All AI tools from the same country are the same; tools from different countries differ.
===
What is a "large language model" (LLM)?
A very large dictionary stored on a computer.
*A type of AI system trained on vast amounts of text to understand and generate human language.
A government database of all language documents.
A tool that translates between more than 100 languages simultaneously.
===
Which of the following is an example of a "multimodal" AI capability?
An AI that can only process text.
*An AI that can process both text and images — for example, analysing a photograph and describing what is in it.
An AI that works in multiple countries.
An AI that can answer questions in multiple languages.
===
What is the primary business model of most free AI tools like the free tier of ChatGPT or Claude?
They are fully funded by governments.
*Free tiers attract users and build data; revenue comes from paid subscriptions, API access for businesses, and enterprise contracts.
They make money by selling your private conversations to advertisers.
They are non-profit tools with no commercial interest.
===
Which Indian company has partnered with Anthropic to bring Claude to Indian enterprises?
*Tata Consultancy Services
Infosys
Reliance Jio
None — Claude is not available in India
===
What does "open source" mean when applied to an AI model?
The AI model is available for free to use online.
*The model's weights and often its training details are publicly released, allowing anyone to download, study, modify, and deploy the model.
The AI company's offices are open to the public.
The AI can access any website openly without restrictions.
===
What is "Claude.ai"?
A coding platform for AI developers.
*Anthropic's consumer-facing web and mobile interface for accessing Claude — available for free with a paid Pro tier for higher usage.
A social media platform for AI enthusiasts.
An AI tool specifically for college students.
===
A new AI tool launches and claims to be "100% accurate and never wrong." What should you conclude?
This is likely true for the latest generation of AI models.
*This claim is false — no current AI model achieves 100% accuracy. All models hallucinate and make errors to varying degrees.
This is true only for scientific and medical queries.
This is true if the model has been trained on verified data.
===
What is the difference between Claude's free tier and Claude Pro?
The free tier cannot understand English; Pro adds language support.
*Pro offers higher usage limits, access to more powerful models, priority access during peak times, and features like extended context windows.
The free tier is for students only; Pro is for professionals.
There is no difference — both tiers access identical capabilities.
===
Which of the following best describes what "AI safety" means as a field?
Teaching AI to avoid dangerous physical activities.
*Research and engineering focused on ensuring AI systems behave as intended, remain aligned with human values, and do not cause unintended harm as they become more capable.
Installing antivirus software to protect AI systems from hackers.
Setting screen time limits on AI usage.
===
What year did ChatGPT launch publicly, marking the beginning of widespread AI awareness?
2018
2020
*2022
2024
===
You have been using ChatGPT for a few months. You notice your prompts have gotten longer but your results haven't improved much. What is most likely the issue?
Longer prompts always produce better results — you need to go even longer.
*Length is not the key variable — clarity, specificity, and structure matter more than length. Long vague prompts produce long vague outputs.
You have reached the maximum capability of the AI tool.
The AI tool is deliberately limiting your results to encourage a paid upgrade.
===
What is a "system prompt" and why does it matter?
A message the AI sends to itself before responding.
*A set of instructions given to an AI before the conversation begins that shapes its behaviour, tone, role, and constraints for the entire session.
The first message a user sends to start a conversation.
A technical command that resets the AI to its default settings.
===
You paste an article into Claude and ask: "Is this accurate?" What is the most likely limitation of Claude's response?
Claude will refuse to evaluate articles for accuracy.
*Claude can check the article against its training data but cannot access real-time sources — and its training data has a cutoff date. It may miss recent developments or have outdated information.
Claude will always say the article is accurate to avoid conflict.
Claude can only evaluate articles written in English.
===
Which prompting technique involves asking an AI to explain its reasoning step by step before giving a final answer?
Zero-shot prompting
*Chain-of-thought prompting
Role prompting
Negative prompting
===
You want Claude to write in a formal, academic tone. Which instruction is most effective?
"Write formally."
*"Write in a formal academic tone — avoid contractions, use precise vocabulary, structure arguments with clear topic sentences, and cite reasoning explicitly."
"Be professional."
"Write like a professor."
===
What does it mean to "iterate" on an AI response?
To copy the AI's response and use it immediately.
*To treat the AI's first response as a draft and refine it through follow-up instructions — improving, redirecting, or expanding specific parts.
To ask the AI the same question multiple times until you get a different answer.
To switch between different AI tools for the same task.
===
You ask an AI to help brainstorm 20 business ideas. It gives you 20 but many are similar. What follow-up prompt would most improve diversity?
"Give me 20 more ideas."
*"Now give me 20 more ideas — ensure each one is in a completely different industry and addresses a different customer segment from the previous list."
"Make the ideas better."
"Remove the bad ideas."
===
What is "few-shot prompting" in simple terms?
Asking the AI only a few short questions.
*Giving the AI one or two examples of the input-output pattern you want before asking it to perform the task — so it learns the format from your examples.
Using the AI for a few minutes before paying for a subscription.
Limiting the AI to short responses by setting a word count.
===
You are writing a college application essay. Which is the most responsible use of AI?
Have AI write the entire essay based on your CV.
*Use AI to brainstorm angles, get feedback on your draft, improve specific sentences, and check for errors — while keeping the ideas and authentic voice yours.
Use AI to write the essay and then change a few words so it sounds like you.
Ask AI to write an essay exactly like the essays of students who got into your target college.
===
You give Claude the same prompt twice in the same session and get slightly different responses. Why?
*Claude has a random element in how it generates responses, meaning outputs are not perfectly deterministic at default settings.
Claude is malfunctioning and you should report the bug.
The second response is always more accurate than the first.
Claude is trying different answers until it finds the correct one.
===
Which of these is the most effective way to get AI to produce content for a specific audience?
"Write for a general audience."
*"Write for final-year engineering students at IIT who have no prior finance knowledge but strong analytical skills."
"Write for everyone."
"Make it accessible."
===
You want Claude to produce output in a specific JSON format. What is the most reliable approach?
Just ask for JSON and Claude will figure out the right structure.
*Provide the exact JSON schema you want — including field names, data types, and an example — and explicitly instruct Claude to return only valid JSON with no other text.
JSON formatting is not possible with AI tools.
Ask Claude to write the data as a table first, then convert it to JSON manually.
===
What is the most common reason AI-generated content feels generic and impersonal?
AI tools are programmed to be neutral and impersonal by default.
*The prompt lacked specific context about the person, situation, voice, or audience — generic prompts produce generic outputs.
AI tools are limited to formal writing styles only.
Generic content is easier to process and therefore faster to generate.
===
You are using Claude to help prepare for a job interview. Which approach will be most useful?
"Give me interview tips."
*"I am interviewing for a Business Analyst role at a mid-size fintech startup in Bengaluru. The role involves working with product and engineering teams. Help me prepare answers to behavioural questions using the STAR method, focused on analytical and communication skills."
"What questions will they ask me?"
"Write my answers for me so I can memorise them."
===
What is the biggest difference between using AI for a one-off task versus building an AI-powered workflow?
One-off tasks use free AI tools; workflows require paid subscriptions.
*A workflow chains multiple AI interactions together — with each output feeding the next step — enabling complex, repeatable processes that would be impractical to do manually every time.
Workflows can only be built by software engineers.
There is no meaningful difference — workflows are just multiple one-off tasks done in sequence.
===
A marketing student uses AI to generate 10 social media post drafts. What is the most important next step?
Post all 10 immediately to maximise content volume.
*Review each draft for brand voice, factual accuracy, appropriate tone, and platform fit — then edit before posting.
Pick the longest one as it will have the most impact.
Ask AI to rank the 10 posts and automatically post the top-ranked one.
===
A finance student uses AI to calculate compound interest for a project. What is the safest approach?
Trust the AI calculation completely as AI is more accurate than humans at maths.
*Use the AI's formula and approach as a guide, then verify the numerical result with a calculator or spreadsheet.
Avoid using AI for any finance calculations under any circumstances.
Only use AI for calculations if the numbers involved are under 1,000.
===
An HR professional uses AI to help screen 200 job applications. What is the most important risk to be aware of?
AI will take too long to screen 200 applications.
*AI may reflect biases present in training data — potentially disadvantaging candidates from certain backgrounds, genders, or educational institutions — requiring human oversight of shortlisting decisions.
AI cannot read PDF resumes.
Using AI for hiring is illegal in India.
===
A law student uses AI to research case precedents. What is the critical caution?
AI is perfect for legal research as it has memorised all published cases.
*AI may cite cases that do not exist or misrepresent case details — legal research requires verification against authoritative legal databases.
AI is too slow for legal research and should not be used.
Only AI tools made by law firms are reliable for legal research.
===
A student studying medicine asks AI for a diagnosis based on described symptoms. What is the most accurate statement about AI's response?
AI diagnoses are as reliable as a GP's diagnosis for common conditions.
*AI can generate plausible-sounding medical information but should never be used for actual diagnosis — always consult a qualified doctor.
AI medical responses are reviewed by doctors before being shown to users.
AI is reliable for diagnosis only if the user provides their full medical history.
===
A product design student uses AI to generate 30 initial ideas for a new app feature. Which statement best describes the right role for these ideas?
All 30 should be implemented since AI ideas are always well-researched.
*The 30 ideas are a starting stimulus for creative thinking — the student should evaluate them critically, combine and develop the most promising ones, and discard the rest.
AI ideas are protected by copyright and cannot be used commercially.
The ideas are only useful if the student asks follow-up questions for each one.
===
A journalism student uses AI to help write a news article. What is the single most important rule?
AI-written articles are fine to publish without review if the prompt was detailed enough.
*Every factual claim, quote, and statistic in the AI-generated content must be independently verified before publication.
AI can write opinion pieces but not factual news articles.
AI journalism is only acceptable for entertainment and lifestyle content.
===
A commerce student uses AI to summarise the Budget speech. What is the most useful way to engage with the summary?
Read the AI summary instead of the actual Budget documents.
*Use the AI summary to understand the structure and key themes, then read the original Budget documents for any points that matter to their analysis.
Cite the AI summary in their assignment as a source.
Share the AI summary immediately on social media as accurate reporting.
===
A graphic design student uses AI image generation to create visual concepts for a client brief. What professional consideration is most important?
AI-generated images are always free to use commercially without any restrictions.
*The student should check the image generator's commercial usage terms and consider whether the client needs fully original work that cannot be traced to AI-generated content.
AI images are only appropriate for personal projects, never for client work.
AI images must always be credited to the AI tool in client deliverables.
===
An economics student asks AI to predict next year's GDP growth rate for India. How should they treat the AI's response?
As an accurate forecast since AI analyses more data than human economists.
*As an illustration of one possible analytical framework, not a reliable prediction — economic forecasting involves genuine uncertainty that no AI can resolve.
As useless since AI cannot understand economics.
As accurate only if the AI cites specific data sources.
===
A student creates an entire school project using AI and submits it as their own work. Beyond the academic integrity issue, what learning opportunity have they missed?
They have missed learning how to use AI tools effectively.
*They have bypassed the thinking, researching, organising, and writing process — which is where actual learning and skill development happens.
They have missed the chance to get a higher grade by doing it themselves.
They have missed nothing — the project outcome is what matters, not the process.
===
A student notices that when they ask AI about politically sensitive topics in India, the AI tends to be cautious and balanced. Why?
The AI is programmed by the Indian government to reflect official positions.
*AI companies design their models to be cautious on politically sensitive topics to avoid controversy and potential harm — this reflects deliberate safety choices, not neutrality.
The AI cannot understand political topics.
The AI is balanced because it has read all political viewpoints equally.
===
Which of the following is the best use of AI for a student preparing for competitive exams like CAT or UPSC?
Ask AI to predict which questions will appear in this year's exam.
*Use AI to explain concepts you don't understand, generate practice questions, get feedback on your written answers, and create custom revision schedules.
Use AI to take mock tests on your behalf and study only the questions AI got wrong.
Use AI to memorise past year papers by asking it to recite them.
===
A student finds that AI gives very different quality answers depending on how they phrase the question. What does this reveal?
The AI is inconsistent and therefore unreliable for serious use.
*Prompting is a genuine skill — the same AI model produces vastly different output quality based on the clarity, specificity, and structure of the input.
The student should use a different AI tool that gives consistent answers.
This is a technical bug that AI companies are working to fix.
===
How should a student think about AI tools in relation to their college education?
AI makes college education obsolete since you can learn everything from AI.
*AI is a powerful tool that accelerates learning, expands what you can do, and prepares you for a professional world where AI literacy is expected — but it supplements education, it does not replace it.
AI should only be used after graduation in professional settings.
College should ban AI entirely to maintain academic standards.
===
What is "deepfake" technology and why is it a concern?
A type of AI that makes video game graphics more realistic.
*AI-generated synthetic media — videos, audio, or images — that realistically depict people saying or doing things they never said or did, creating significant potential for misinformation and harm.
A privacy setting that makes your social media posts harder to find.
A deepfake is a very detailed photograph taken with a high-end camera.
===
You receive a voice note from what sounds like your friend asking you to urgently send them money. What should you do?
Send the money immediately since you recognise your friend's voice.
*Verify through a separate channel — call your friend directly on their known number — as AI voice cloning can replicate voices convincingly.
Only send money if the voice note is longer than 30 seconds.
Ignore all voice notes as they are all AI-generated fakes.
===
What does "AI hallucination" mean and what is the most accurate mental model for why it happens?
AI gets confused when questions are too long, causing it to give random answers.
*AI generates text by predicting probable continuations — when it lacks reliable information, it generates plausible-sounding text anyway, because it has no reliable way to distinguish between what it knows and what it is making up.
AI hallucination is a rare bug that occurs only in older AI models.
AI hallucinates when it detects that the user wants a specific answer.
===
A student uses AI to write an essay arguing a position they personally disagree with. What ethical consideration should they keep in mind?
This is always unethical since AI should only be used to express genuine opinions.
*This is fine — AI-assisted argument construction is a legitimate learning exercise, like devil's advocate writing. The ethical issue would be presenting it as a genuine personal belief if it is not.
AI cannot write arguments for positions it doesn't agree with.
The student must disclose to the reader that they personally disagree with the essay.
===
An AI tool you use regularly updates its privacy policy to say it will use your conversations to train future models. What is the appropriate response?
Ignore it — privacy policies are always the same and don't affect you.
*Read the policy change carefully, understand what data will be used and how, check whether you can opt out, and decide whether to continue using the tool based on your comfort level.
Delete your account immediately as this is illegal.
Share the policy change on social media as a warning to everyone.
===
What is "AI-generated misinformation" and why is it particularly dangerous compared to traditional misinformation?
AI misinformation is less dangerous because it is easy to identify.
*AI can generate false information at scale, make it highly plausible, personalise it, translate it into multiple languages, and create it far faster and cheaper than human misinformation campaigns — making it a significant threat to information ecosystems.
AI misinformation only affects older people who are less familiar with technology.
AI misinformation is already solved by fact-checking websites.
===
A student uses AI to write an apology message to a friend after an argument. Is this ethical?
Never — all personal communication should be 100% human-written.
*It depends on intent — if the student genuinely means the apology and is using AI to articulate it better than they could alone, that is reasonable. If AI is being used to simulate remorse the student doesn't feel, that is deceptive.
Always — AI writes more empathetic messages than humans.
Only if the friend is told the message was AI-generated.
===
Which of the following represents the most serious misuse of AI by a student?
Using AI to brainstorm essay ideas.
*Using AI to impersonate a classmate in online communications to damage their reputation.
Using AI to check grammar in a personal essay.
Using AI to translate a document from Hindi to English.
===
What does "algorithmic bias" mean in the context of AI systems that affect real people's lives?
Errors in AI code that cause it to crash unexpectedly.
*Systematic patterns in AI outputs that unfairly disadvantage certain groups — often because the training data reflected historical inequalities or certain populations were underrepresented.
The AI's tendency to prefer certain programming languages.
The natural preference of AI for numerical data over text.
===
A company uses AI to make fully automated decisions about loan applications with no human review. What is the primary concern?
AI loan decisions are too slow for practical banking.
*Fully automated high-stakes decisions remove human accountability, may perpetuate biased patterns from training data, and deny applicants the ability to have decisions reviewed by a human who can consider context.
AI cannot access credit score databases.
Fully automated decisions are always more accurate than human ones.
===
What is "prompt injection" and why should aware AI users know about it?
A method of typing prompts faster using keyboard shortcuts.
*An attack where malicious instructions are hidden in content that the AI processes — for example, in a document or website — causing the AI to follow the attacker's instructions instead of the user's.
A technique for improving AI outputs by adding more detail to prompts.
A paid feature that gives your prompts priority processing.
===
You create an AI-generated image of a real person doing something they never did. Even if it is clearly labelled as AI-generated, what concern remains?
No concern — the label resolves all ethical issues.
*Even labelled synthetic media can damage reputations, spread if the label is removed, and contribute to a general erosion of trust in authentic media — the potential for harm does not disappear with a label.
The only concern is copyright — not reputation or ethics.
Concern only exists if the image is shared publicly.
===
What is the most important principle for citing AI assistance in academic work?
Never cite AI — it makes your work look less original.
*Follow your institution's specific AI use policy, and when in doubt, disclose how AI was used — what it contributed and what you did yourself.
Only cite AI if the tool asks you to.
Cite AI only if you used it for more than 50% of the work.
===
Why is it important for AI users — not just AI developers — to understand the basics of AI ethics?
It is not important — AI ethics is only for developers and regulators.
*AI users make choices every day about what tasks to delegate to AI, how to use AI outputs, and how to represent AI-assisted work — these choices have real ethical implications that affect other people.
AI ethics only matters in professional contexts, not for students.
Understanding ethics makes AI tools work better technically.
===
What does "human in the loop" mean in AI systems?
A human watching the AI work in real time to prevent it from overheating.
*Designing AI systems so that a human reviews, approves, or can override AI decisions — especially for high-stakes or irreversible actions.
The requirement that a human must type every prompt manually.
A safety feature that pauses AI every 10 minutes for human review.
===
You have been using ChatGPT for casual tasks. What is the single most important upgrade in how you think about AI that separates casual users from truly AI-fluent ones?
Switching from ChatGPT to a more advanced AI tool.
*Shifting from treating AI as a magic answer machine to treating it as a powerful but fallible collaborator that requires clear direction, critical review, and human judgment to produce reliable output.
Learning to use AI for more tasks every day.
Getting a paid AI subscription to access better models.
===
What does it mean to "decompose a task" before using AI?
*Breaking a large task into smaller, specific sub-tasks that can each be handled by a focused AI prompt — rather than trying to handle everything in one complex request.
Removing parts of a task that AI cannot handle.
Deciding which AI tool to use for which part of a task.
Summarising what you want before sending a long prompt.
===
What is the difference between using AI as a "search engine substitute" versus using it as a "thinking partner"?
There is no practical difference — both approaches produce the same results.
*Using AI as a search substitute means asking for facts and accepting the output. Using it as a thinking partner means engaging in dialogue — pushing back, asking for alternatives, challenging assumptions, and refining ideas through conversation.
A thinking partner use requires a paid AI subscription.
Thinking partner use is only appropriate for creative tasks.
===
A student wants to build a personal AI workflow for managing their studies. What is the most useful first step?
Buy the most expensive AI subscription available.
*Map out the repetitive, time-consuming parts of their current study process — then identify which of those are well-suited for AI assistance based on what AI does well.
Ask AI to design the entire workflow for them immediately.
Learn to code so they can build a custom AI tool.
===
What is an "AI agent" in simple terms?
A human who sells AI products to companies.
*An AI system that can take a sequence of actions — using tools, browsing the web, writing code, calling APIs — autonomously to complete a multi-step goal, rather than just generating a single response.
A chatbot that remembers your previous conversations.
An AI that is specifically trained to work in one industry.
===
Why is "context" the most valuable thing you can give an AI model?
More context makes responses longer, which is always better.
*Context bridges the gap between the AI's general training and your specific situation — the more precisely you describe your context, the more relevant and useful the AI's output becomes.
AI tools require context to function at all — without it they produce error messages.
Context is valuable because it uses up your message limit slower.
===
What does it mean that AI is "transforming" rather than "replacing" most professional roles?
AI is making all professional roles easier with no negative consequences.
*AI is changing the mix of tasks within roles — automating routine, repetitive parts and shifting human energy toward judgment, creativity, relationship-building, and complex problem-solving that AI does poorly.
AI is replacing junior professionals but not senior ones.
AI transformation only affects roles that involve sitting at a computer.
===
A student graduates and their new employer expects them to use AI tools fluently. They have no prior professional AI experience. What should they have done differently?
Nothing — AI tools can be learned on the job in a few days.
*Built practical AI habits during college — using AI regularly for real tasks, developing critical evaluation skills, and understanding AI's strengths and limitations across different domains.
Taken a coding course to understand how AI models work technically.
Used AI exclusively for personal tasks, not academic work, to build fluency.
===
What is "prompt engineering" as a professional skill?
A software engineering discipline for building AI systems.
*The ability to design clear, structured, context-rich prompts that reliably produce high-quality AI output for specific professional tasks — a skill that is increasingly valued across all domains.
A certification programme offered by OpenAI.
The technical process of training AI models on custom datasets.
===
What is the "AI skill stack" that Menler's programs are designed to build?
The ability to build and train AI models from scratch.
*A layered set of capabilities: AI literacy, prompting fluency, workflow design, domain-specific AI application, and agentic systems — each layer enabling more sophisticated and valuable AI use.
Proficiency in all major AI tools currently available in the market.
A set of software engineering skills for AI product development.
===
What is the most important question to ask before using AI for any professional task?
"Which AI tool has the highest rating for this task?"
*"If this AI output is wrong or misleading, what is the consequence — and does that consequence require me to verify it before using it?"
"How quickly can AI complete this task compared to doing it manually?"
"Does my employer allow AI use for this task?"
===
A fellow student who has been using AI for 2 years says: "I don't need to fact-check AI anymore — I know when it's right." What is your assessment?
They are probably correct — experienced AI users develop reliable intuition for AI accuracy.
*They are overconfident — even experienced AI users cannot reliably detect hallucinations by intuition alone. AI's confident presentation of errors is specifically what makes them hard to detect.
They are correct only for factual questions, not for opinion-based content.
They are correct if they use Claude specifically, which has higher accuracy.
===
What does "grounding" mean when discussing how to improve AI reliability for professional tasks?
Keeping AI responses short and to the point.
*Providing the AI with specific source documents, data, or context to base its responses on — rather than relying solely on its general training knowledge.
Connecting the AI to the internet for real-time information access.
Training yourself to understand the AI's reasoning before using its output.
===
What will be the most important factor determining whether AI makes your professional life better or more stressful?
The quality of AI tools available to you.
*Whether you develop genuine AI fluency — the ability to use AI effectively, evaluate its output critically, and integrate it into workflows that genuinely reduce your effort and improve your output quality.
Whether your employer invests in expensive enterprise AI subscriptions.
Whether you are a fast typist.
===
What is the single most important habit of highly effective AI users, based on everything covered in this question bank?
Using as many different AI tools as possible.
*Maintaining the habit of critical evaluation — always asking whether the AI's output is accurate, appropriate, and genuinely useful before acting on it or sharing it.
Using AI for at least 4 hours every day to build fluency.
Keeping up with every new AI tool that launches.
===
What does AI stand for?
Automated Intelligence
*Artificial Intelligence
Advanced Information
Assisted Input
===
Which of the following is the best description of what an AI chatbot does?
It searches the internet and copies answers from websites.
*It generates responses by predicting what words are most likely to follow based on patterns learned from large amounts of text.
It connects to a database of pre-written answers and retrieves the closest match.
It records what users type and sends it to human agents who write replies.
===
You ask an AI chatbot a question and it gives you a confident but completely wrong answer. What is this called?
A bug
*A hallucination
A timeout error
A bias warning
===
Which of the following tasks is AI currently best at?
Predicting tomorrow's stock prices with certainty
*Drafting a first version of a written document based on instructions
Making final legal judgments on court cases
Feeling emotions and genuinely caring about your problems
===
A student uses an AI tool to write their entire assignment and submits it without reading it. What is the biggest risk?
The AI will report them to their teacher.
*The assignment may contain errors, false information, or content that does not match the actual question.
The AI will charge them money for the submission.
The font style might be different from the school's requirements.
===
What is the name of the AI tool built by Anthropic that Menler's courses are built around?
ChatGPT
Gemini
*Claude
Copilot
===
Which of these is NOT an example of AI in everyday life?
A music app that suggests songs based on what you've listened to
*A calculator that adds numbers when you press buttons
A spam filter that automatically moves suspicious emails to junk
A map app that predicts traffic and suggests a faster route
===
What does it mean when people say an AI model was "trained"?
A human taught the AI by talking to it for many hours.
*The AI was exposed to massive amounts of data so it could learn patterns, relationships, and how to respond.
The AI was programmed with a list of correct answers to all possible questions.
The AI was connected to the internet so it could read everything online.
===
You are chatting with an AI and you feel like it really understands you and cares about you. What should you remember?
The AI has developed a genuine friendship with you and remembers you between conversations.
*The AI is generating language that sounds caring, but it does not have feelings, consciousness, or genuine personal memory of you.
The AI is actually a human customer service agent pretending to be AI.
The AI is using your personal data from social media to personalise its responses.
===
Which of the following statements about AI and privacy is most accurate?
Everything you type into an AI chatbot is completely private and deleted immediately.
*What you type into an AI tool may be stored, used to improve the model, or seen by the company — so avoid sharing sensitive personal information.
AI companies are legally required to delete all your data within 24 hours.
AI chatbots can only see your current message and have no ability to store anything.
===
What is the difference between AI and a regular computer program?
AI is faster than regular programs.
*Regular programs follow exact rules written by humans; AI learns patterns from data and can handle situations not explicitly programmed.
AI programs never make mistakes while regular programs do.
Regular programs need electricity while AI programs do not.
===
A friend tells you: "AI will replace all human jobs in the next 5 years." What is the most accurate response?
They are completely right — every job will be automated very soon.
*AI is changing many jobs but most experts believe it will transform work rather than eliminate all jobs — and new types of work will emerge.
They are completely wrong — AI cannot do any work that humans currently do.
Only jobs involving computers will be affected; physical jobs are completely safe.
===
What is a "prompt" in the context of using an AI tool?
A reminder notification sent by the AI to keep you engaged.
*The instruction or question you give to an AI to tell it what you want it to do.
A paid upgrade feature available in premium AI plans.
The AI's own internal thinking process before it gives an answer.
===
Which of the following is a responsible way to use AI for studying?
Copy the AI's answer word for word and submit it as your own work.
*Use AI to explain a concept you don't understand, then write your own notes and answer in your own words.
Ask AI to take your exam for you while you watch videos.
Trust AI's answer on historical dates and facts without verifying them.
===
Generative AI tools like ChatGPT and Claude became widely available to the public around which year?
2015
2019
*2022
2030
===
You need to find out what time a restaurant closes today. Which tool is most appropriate?
Ask an AI chatbot like Claude.
*Search Google Maps or call the restaurant directly.
Ask a large language model with a 2023 knowledge cutoff.
Use an AI image generator.
===
Which of these tasks would an AI writing tool handle best?
Telling you the exact current weather in your city.
*Writing a first draft of a thank-you email to a teacher.
Predicting whether you will pass your next exam.
Knowing what happened in the news this morning.
===
A student asks an AI to "summarise this chapter" and pastes 20 pages of text. What is a likely limitation of the AI's summary?
The AI will refuse to summarise more than one page.
*The AI may miss nuanced arguments, oversimplify complex points, or lose the author's specific emphasis.
The AI will add its own opinions and bias the summary.
The AI will charge a fee for processing long text.
===
What does it mean that an AI model has a "knowledge cutoff"?
The AI stops responding after a certain number of messages.
*The AI's training data has a specific end date — it does not know about events that happened after that date.
The AI refuses to answer questions that are too difficult.
The AI can only process a limited number of words per session.
===
Which of the following is something AI image generators like DALL-E or Midjourney can do?
Take a real photograph of a scene you describe.
*Generate a new image based on a text description.
Edit photos with 100% accuracy and no distortions.
Produce images that are always legally safe to use commercially.
===
You ask an AI to help you with a maths problem and it gives you a wrong answer confidently. What should you do?
Trust the AI since computers are always better at maths than humans.
*Verify the answer yourself or with a calculator, as AI can make computational errors.
Ask the AI the same question again — it will correct itself automatically.
Switch to a different AI tool, as only some AIs can do maths.
===
Which of these is an example of an AI tool specifically designed for creating visual content?
Claude
Grammarly
*Canva's AI image generator
Google Sheets
===
A classmate says AI can read your mind and knows what you really mean even when you write vague instructions. Is this true?
Yes — AI can detect emotional intent beyond what you write.
*No — AI only processes the text you provide. Vague instructions produce vague or wrong outputs.
Yes — AI uses your previous search history to understand your intent.
Yes — AI is trained to guess what students typically want.
===
What is an AI "chatbot" most similar to in terms of how it works?
A human expert you can consult for guaranteed accurate advice.
*A very sophisticated autocomplete that generates the most likely useful continuation of your conversation.
A search engine that finds and displays existing web pages.
A recorder that plays back answers from previous conversations.
===
Which of the following tasks would be most risky to rely on AI for without human review?
Generating ideas for a birthday party theme.
*Producing a medical diagnosis based on symptoms you describe.
Suggesting synonyms for a word in an essay.
Explaining the plot of a novel.
===
You want to translate a paragraph from English to Tamil. Which approach is safest?
Trust the AI translation completely since AI translation is always perfect.
*Use an AI translation tool as a starting point, then have a Tamil speaker review it for accuracy and naturalness.
Avoid AI translation tools entirely as they cannot handle Indian languages.
Use AI only if the paragraph is about technology — AI struggles with other topics.
===
What is the purpose of an AI tool like Grammarly?
To write entire essays for you automatically.
*To check and improve grammar, spelling, tone, and clarity in your writing.
To translate your writing into other languages.
To score your writing against exam marking schemes.
===
A student says: "I use AI so I don't need to learn how to write anymore." What is the best response to this?
They are right — AI will handle all writing tasks in the future.
*Writing ability helps you give better instructions to AI, evaluate its output critically, and communicate when AI tools are unavailable or inappropriate.
They are right — companies will only hire people who can use AI, not people who can write.
Writing is indeed obsolete, but students should learn coding instead.
===
Which statement best describes what AI can do with a YouTube video?
AI can watch the video exactly as a human does and understand every visual detail.
*AI tools can process transcripts or captions from videos to summarise or answer questions — but visual understanding varies by tool.
AI cannot process any video content under any circumstances.
AI watches videos at 10x speed to analyse them faster than humans.
===
What is the most important habit to build when using AI tools as a student?
Always use the longest possible prompt to get the best results.
*Verify important facts, think critically about AI output, and use AI to support your learning rather than replace it.
Only use paid AI tools as free tools are always inaccurate.
Never use AI for school work of any kind to avoid academic issues.
===
You want AI to help you write a speech for your school event. Which prompt will get the best result?
"Write a speech."
*"Write a 3-minute speech for my school's annual day celebration. The theme is environmental awareness. The audience is students aged 14–18. Tone should be inspiring and end with a call to action."
"Write something good for school."
"Make a speech about the environment and make it nice."
===
You receive an AI response that is too long and technical. What is the best next step?
Accept it — AI always knows how long a response should be.
*Follow up with a specific instruction: "Rewrite this in simpler language in 3 bullet points."
Start a completely new conversation and try a different topic.
Copy it into Google Translate to simplify it.
===
What does it mean to give AI "context" in a prompt?
It means providing your personal login information for security.
*It means giving the AI background information about your situation so it can produce more relevant and tailored responses.
It means attaching a file to your message.
It means using technical vocabulary to make the AI take you seriously.
===
Which of the following is an example of a good follow-up prompt after receiving an AI response?
"That was great, thank you!"
*"Can you make the second paragraph shorter and add a real-life example from India?"
"Write it again."
"I don't like this."
===
You ask AI to "be creative" and the response is not what you expected. What is the root cause?
The AI is having a bad day.
*"Be creative" is undefined — creativity means different things to different people. Specific constraints produce better creative results.
You need a premium subscription for creative tasks.
AI cannot be creative under any circumstances.
===
A student asks AI: "Explain photosynthesis." Then asks: "Now explain it like I'm 10 years old." What technique is the student using?
Hallucination testing
*Prompt chaining and refinement
Context injection
Model switching
===
Which of these prompts would produce the most useful explanation of a difficult concept?
"Tell me about quantum physics."
*"Explain quantum entanglement in simple terms with one everyday analogy. No equations. Under 150 words."
"Explain quantum physics completely and in detail."
"What is quantum?"
===
You paste your essay into an AI and say "Fix this." What will most likely happen?
The AI will make targeted corrections you will be happy with.
*The AI may rewrite large sections, change your voice, and make changes you didn't want — because you didn't specify what needed fixing.
The AI will refuse to edit student work.
The AI will only fix spelling and grammar automatically.
===
What is the benefit of giving AI a "role" in your prompt — for example, "Act as a patient teacher"?
It gives the AI legal authority to teach.
*It shifts the AI's tone, vocabulary, and approach to match that persona, making responses more suited to your specific need.
It makes the AI work faster.
It unlocks hidden capabilities not available by default.
===
You want AI to help you prepare for a debate. Which prompt structure is most effective?
"Help me debate."
*"I am preparing for a debate on the topic: 'Social media does more harm than good.' I am arguing FOR this position. Give me 5 strong arguments with evidence I can research further."
"What is debate?"
"Tell me about social media."
===
Which of the following best describes what happens when you start a new chat session with an AI?
The AI remembers everything from your previous conversations and builds on them.
*In most AI tools, each new session starts fresh — the AI has no memory of past conversations unless you explicitly provide that context.
The AI accesses your account profile to personalise responses.
The AI asks you to reintroduce yourself before answering questions.
===
A student receives a long AI response. The most useful thing to do is:
Read every word carefully before using any of it.
*Skim to find the sections most relevant to your need, then read those carefully and verify key facts.
Copy the entire response immediately as it will be perfect.
Discard it and try again with a different AI tool.
===
You are writing a story and want AI to help. Which prompt gives you the most useful starting point?
"Write a story."
*"Write the opening paragraph of a mystery story set in Mumbai in 1990. The main character is a 16-year-old girl who discovers a hidden diary in her school library. First-person perspective. Suspenseful tone."
"Write something creative and interesting."
"Tell me a story about a student."
===
What does "temperature" mean when people talk about AI settings (in simple terms)?
How hot the server running the AI gets during processing.
*A setting that controls how random or creative versus predictable and factual the AI's responses are.
The speed at which the AI generates responses.
Whether the AI uses formal or informal language.
===
What is the single most important thing that determines the quality of an AI's output?
The speed of your internet connection.
*The clarity, specificity, and quality of the prompt you give it.
The time of day you use the AI.
The number of questions you have asked in previous sessions.
===
You read a very convincing article online that says it was "written with AI assistance." What should you do?
Trust it completely since AI-assisted articles are always more accurate.
*Read it critically — AI assistance does not guarantee accuracy, and the article still requires fact-checking like any other source.
Ignore it entirely since AI-written content is always unreliable.
Only trust it if the AI tool used is mentioned by name.
===
An AI gives you two different answers to the same question in two separate sessions. What does this suggest?
One of the answers must be deliberately wrong because the AI was testing you.
*AI responses can vary — it is important to evaluate both answers critically rather than assuming either is definitively correct.
The AI has a technical error and should be reported.
The second answer is always more accurate since the AI has updated itself.
===
A classmate uses AI to generate a list of "famous Indian scientists" for a project and copies it without checking. Two of the names on the list don't exist. This is an example of:
A software bug that needs to be fixed by the AI company.
*An AI hallucination that was not caught because the student did not verify the content.
Plagiarism since the student copied from an AI.
Normal AI behaviour that everyone should expect and accept.
===
Which of the following is a sign that an AI response might be unreliable?
The response is longer than you expected.
*The AI provides very specific numbers, quotes, or citations without indicating how to verify them.
The response uses simple language.
The AI asks you a clarifying question.
===
You ask AI for advice on a personal problem. It gives you very detailed, empathetic advice. What should you remember?
The AI genuinely cares about you and its advice is personalised to your situation.
*AI generates empathetic-sounding responses based on language patterns — it does not know your full situation and its advice should not replace human judgment, counselling, or professional help.
AI personal advice is always more objective than advice from friends.
AI is legally required to give accurate personal advice.
===
Your teacher says AI is "biased." What does this mean in simple terms?
The AI prefers some students over others.
*AI learns from human-created data, which contains human biases — so AI can reflect, amplify, or perpetuate unfair stereotypes and imbalances present in that data.
The AI is programmed to favour certain political opinions.
Bias in AI means it always gives the same answer to every question.
===
A student asks AI to write both sides of a debate. The AI writes both but makes one side clearly weaker. What is likely happening?
The AI is deliberately helping the student win the debate.
*The AI's training data may have favoured one perspective, causing it to argue one side more convincingly than the other.
The AI is testing which side the student supports.
This proves AI cannot write arguments at all.
===
You find out that a news article was entirely generated by AI without any human editor reviewing it. What is the most appropriate response?
Trust it more since AI is objective and humans introduce bias.
*Read it more cautiously — unreviewed AI content may contain errors, hallucinations, or misleading information.
Report the website to the government for using AI.
Assume it is fake news and stop reading it entirely.
===
When is it appropriate to use AI to help write a message to a friend?
Never — using AI for personal communication is always deceptive.
*It depends on context — using AI to help draft a difficult message, improve wording, or express something better than you could alone is generally fine, as long as you review and personalise it.
Always — AI writes better messages than humans in all situations.
Only if your friend knows and consents to you using AI.
===
Which is the most critical skill for a student using AI regularly?
Typing speed — faster typing means better AI use.
*Critical thinking — the ability to evaluate AI output, identify errors, and decide what to trust, modify, or discard.
Memorising all the different AI tools available.
Being able to code so you can build your own AI.
===
Your AI assistant tells you a historical fact that contradicts what your textbook says. What should you do?
Trust the AI since it has access to more recent research than your textbook.
*Check multiple reliable sources — textbooks can be outdated but AI can also hallucinate; the truth requires verification.
Trust your textbook always since AI cannot be trusted for factual content.
Ask the AI the same question again to see if it changes its answer.
===
A student is using AI to research climate change. The AI keeps giving answers that sound uncertain and hedged. What does this likely mean?
The AI has a bug in its climate change knowledge.
*The AI is reflecting genuine scientific complexity or its own uncertainty — hedged answers on nuanced topics are often more accurate than overconfident ones.
The AI is trying to avoid a controversial topic.
The student needs to pay for a premium plan to get direct answers.
===
You share your home address with an AI chatbot as part of a question. What risk does this create?
No risk — AI cannot store or share any information.
*Your personal information may be stored in the AI company's systems and potentially used in ways you did not intend.
The AI will use your address to send you marketing materials.
The AI will share your address with your school automatically.
===
A very confident AI answer is not necessarily a correct one. What term describes this mismatch between confidence and accuracy?
Overloading
*Calibration failure or hallucination
Processing lag
Bias training
===
Which of these is the best description of "responsible AI use"?
Using AI for every task to maximise efficiency.
*Using AI as a tool that augments your thinking — verifying its output, taking responsibility for how you use it, and knowing when human judgment is essential.
Only using AI for tasks that have no risk of error.
Never using AI for school or work to avoid ethical concerns.
===
Which Indian industry is currently seeing some of the fastest AI adoption?
Traditional textile manufacturing
*IT and software services
Commercial fishing
Stone quarrying
===
A student learns to use AI tools fluently alongside their regular studies. How does this most likely benefit them?
They can skip learning their subject entirely since AI knows everything.
*They develop a hybrid skill set — domain knowledge plus AI fluency — that is increasingly valued by employers and universities.
They will never need to take exams since AI can take exams for them.
It only benefits them if they are studying computer science.
===
Which of the following is an example of AI creating a new type of job rather than just replacing an old one?
A robot replacing a factory line worker.
*A prompt engineer who designs and tests AI prompts for companies.
An ATM replacing a bank teller.
A dishwasher replacing hand-washing dishes.
===
A student wants to start learning AI skills today at zero cost. Which is the most practical first step?
Buy an expensive laptop with the fastest GPU available.
*Create a free account on Claude.ai or ChatGPT and start experimenting with prompts for everyday tasks.
Enroll in a 4-year computer science degree.
Learn Python programming before attempting any AI tool.
===
Which of the following career paths does NOT benefit from AI literacy?
Doctor
Graphic designer
Farmer
*None — all careers benefit from some degree of AI literacy
===
What does the term "AI-native" mean when describing a company or professional?
A company that builds AI models from scratch.
*A company or professional that uses AI as a fundamental part of how they work — not as an add-on, but as core to their workflow and output.
A professional who was born after AI was invented.
A company that only sells AI products.
===
A student in Class 11 starts building a habit of using AI for homework help, creative projects, and research. By the time they graduate college, what advantage have they built?
They will have memorised all the AI tools that exist.
*They will have years of practical AI experience — developed intuition for what AI is good at, how to prompt effectively, and how to critically evaluate output.
They will automatically get a job in technology.
They will be able to build their own AI models.
===
Which of the following is NOT a responsible use of AI in academic work?
Using AI to explain a concept you find difficult.
*Asking AI to generate an exam answer and submitting it without disclosure or modification.
Using AI to suggest improvements to your own written draft.
Using AI to brainstorm ideas before you start writing.
===
Why is India considered a particularly significant country in the global AI landscape?
India has the most AI companies in the world.
*India has the world's largest pool of English-speaking young people, a large technology workforce, and a growing AI startup ecosystem — making it a major player in both AI adoption and development.
India invented the internet and therefore leads in all digital technologies.
India has banned all foreign AI tools and built its own alternatives.
===
What is the most honest description of what Menler's AI Generalist Fellowship prepares you for?
Becoming an AI researcher who builds new AI models.
*Becoming a professional who can use Claude and AI tools fluently in any domain — prompting, automation, product thinking, and AI-augmented work.
Getting a government job in the AI ministry.
Learning to code AI applications in Python.
===
A student wants to use AI to learn a new language. Which approach is most effective?
Ask AI to translate everything for you and memorise its translations.
*Use AI as a practice partner — ask it to have conversations with you in the target language, correct your mistakes, and explain grammar rules.
Ask AI to write grammar notes and memorise them without practising.
AI cannot help with language learning under any circumstances.
===
Which of the following is a sign that someone is AI-fluent rather than AI-dependent?
They use AI for every task without reviewing the output.
*They know when to use AI, when not to, and they always review and take responsibility for what they produce with AI assistance.
They have memorised the names of every AI tool.
They can write code to build their own AI models.
===
You are a student interested in AI but have no coding background. Which statement is most accurate?
You must learn to code before you can make any useful use of AI.
*You can develop significant AI fluency without coding — prompting, workflow design, and domain-specific AI use do not require programming.
Coding is the only thing that matters in AI — everything else is superficial.
Non-coders cannot get jobs in the AI era.
===
What is one thing AI genuinely cannot do, regardless of how advanced it becomes?
Write text in multiple languages.
*Take genuine accountability and moral responsibility for the decisions made using its output.
Summarise long documents.
Generate creative ideas.
===
If you could learn only one skill to be better at using AI, which would have the highest impact?
Learning to type faster.
*Learning to write clear, specific, context-rich prompts — because prompt quality drives output quality more than any other variable.
Learning to code in Python.
Memorising the technical specifications of different AI models.
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
