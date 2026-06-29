// AI for Engineers — "All About AI" question bank: 825 questions across 11 domains
// (AI Engineering, AI Agents & Workflows, AI Networks & Infrastructure, AI Tools
// Ecosystem, AI Judgment, LLM Fundamentals, Prompt Engineering, RAG & Knowledge
// Systems, AI Reliability & Evaluation, AI Product Thinking, AI Native Execution),
// 75 questions each. Sourced from Menler_AIEngineering_Complete_QuestionBank.pdf.
//
// Correct answers VARY (A/B/C/D), so the correct option line in each block is
// prefixed with "*". Option order is shuffled at session build, so position is
// not predictable.
//
// getEngineeringSession(n) → a fresh random n-question session in the runner's
// format: { q, options: [{ t, s }] } (s = 1 for the correct option).

const RAW = String.raw`
What is a "token" in the context of a large language model?
A security credential required to access a model via API.
*A unit of text — roughly a word or word-fragment — that the model processes.
A numerical representation of an entire sentence in the model.
A discrete step in the model's reasoning chain.
===
A language model predicts the next token by:
Searching its training data for the closest matching sequence.
Applying logical rules to determine the most appropriate continuation.
Retrieving the answer from a structured internal knowledge base.
*Computing a probability distribution over all possible next tokens.
===
What does "context window" refer to in a language model?
*The maximum number of tokens the model can process in a single call.
The time window within which the model can access recent events.
The set of topics the model was trained to respond to.
The visible portion of the user's screen during inference.
===
Why does a language model sometimes produce different outputs for the same input?
The model updates its weights between each generation call.
Different server instances apply different inference rules.
*Sampling randomness controlled by the temperature parameter.
The model draws from different training data subsets each run.
===
What does "autoregressive generation" mean?
The model generates the entire response in a single forward pass.
*The model generates one token at a time, conditioning each on all previous tokens.
The model recursively rewrites its output until it meets a quality threshold.
The model selects from a fixed set of response templates.
===
What is the role of the softmax function in a language model's output layer?
*Converts raw logit scores into a valid probability distribution over the vocabulary.
Filters out low-probability tokens to speed up generation.
Applies grammar rules to ensure syntactically valid outputs.
Normalises the input tokens before they enter the transformer.
===
What is "attention" in a transformer model?
A filtering layer that removes irrelevant tokens before processing.
A memory module that retrieves facts from external knowledge bases.
A scoring system that ranks candidate outputs by quality.
*A mechanism that computes weighted relationships between all tokens in the input.
===
What distinguishes a "decoder-only" architecture from an "encoder-decoder" architecture?
Decoder-only models are smaller and faster but less capable.
Encoder-decoder models can only handle fixed-length inputs.
*Decoder-only models generate text left-to-right without a separate encoding step.
Decoder-only models require separate fine-tuning for each task.
===
What happens when you set temperature = 0 during inference?
*The model always selects the highest-probability token, producing deterministic output.
The model refuses to generate creative or speculative content.
The model generates shorter responses to reduce computation.
The model switches to a rule-based response mode.
===
What is "top-p sampling" (nucleus sampling)?
Selecting the top p% of tokens by individual probability.
Sampling tokens in order of probability until p tokens have been drawn.
Setting a minimum probability threshold p below which tokens are excluded.
*Sampling only from the smallest set of tokens whose cumulative probability exceeds p.
===
What does the "embedding layer" do in a language model?
Compresses long inputs into shorter summary vectors for efficiency.
*Converts discrete token IDs into dense continuous vector representations.
Maps model outputs back to human-readable text tokens.
Stores the model's factual knowledge as lookup tables.
===
Why do language models have a "knowledge cutoff"?
The model's context window cannot hold information beyond a certain date.
Anthropic manually updates the model's knowledge on a scheduled basis.
*Training data collection ends at a point in time, so the model has no knowledge of later events.
Regulatory requirements limit the training data to pre-approved date ranges.
===
What is the primary function of "layer normalisation" in a transformer?
Reduces the model's output to a fixed-length vector for classification.
Normalises the input tokens before the attention mechanism.
Applies regularisation to prevent individual attention heads from dominating.
*Stabilises training by normalising activations across features within each layer.
===
What does "parameter count" tell you about a language model?
The number of discrete facts the model has memorised from training data.
*The total number of learnable weights that encode the model's knowledge and behaviour.
The maximum number of tokens the model can process per second.
The number of distinct tasks the model was trained to perform.
===
What does "perplexity" measure in language model evaluation?
*How surprised the model is by a test text — lower means better prediction.
How often the model produces factually incorrect outputs on a benchmark.
The computational complexity of the model's inference process.
The degree of grammatical error in the model's generated text.
===
What is "pre-training" in the context of large language models?
A small trial training run to test the model architecture before full training.
Training the model on labelled examples for a specific downstream task.
*Training on a large general text corpus to learn broad language patterns.
A calibration step that sets the model's safety and refusal thresholds.
===
What does "fine-tuning" a language model mean?
*Continuing training on a smaller, task-specific dataset to adapt model behaviour.
Adjusting the model's temperature and sampling parameters for a use case.
Removing knowledge the model learned from pre-training that is not needed.
Adding new layers to the model architecture to handle a specific domain.
===
What is the purpose of RLHF (Reinforcement Learning from Human Feedback)?
Teaching the model to retrieve information from the internet during inference.
Ensuring the model's factual claims match a curated ground-truth database.
Reducing the model's parameter count for deployment efficiency.
*Aligning model outputs with human preferences using human-rated training signal.
===
What is "catastrophic forgetting" in the context of fine-tuning?
The model forgets context from earlier in a conversation as the context window fills.
*The model loses previously learned general capabilities when fine-tuned on narrow data.
The training process fails because the learning rate is too high.
The model's training data contains contradictory information that degrades performance.
===
What is "LoRA" (Low-Rank Adaptation) used for?
Compressing model weights to reduce inference memory requirements.
Generating low-resolution outputs faster than full model inference.
*Efficient fine-tuning by training only small low-rank weight update matrices.
A regularisation technique to prevent overfitting during pre-training.
===
What does "instruction tuning" accomplish?
Teaches the model to produce structured outputs like JSON and markdown.
Reduces the model's tendency to hallucinate by adding factual training data.
Converts a classifier model into a generative model.
*Trains the model to follow natural language instructions rather than just complete text.
===
Why does training a large language model require massive compute?
*Computing gradients and updating billions of parameters across trillions of tokens requires enormous parallelism.
Language models need to search the internet during training to acquire knowledge.
Each training step requires solving an NP-hard optimisation problem.
The model must be evaluated on every possible input during training.
===
What is a "reward model" in the RLHF pipeline?
A model that evaluates the factual accuracy of the language model's outputs.
*A model trained on human preferences that scores outputs for the RL training loop.
The language model itself when used to evaluate its own generated responses.
A rule-based system that enforces safety guidelines during training.
===
What does "gradient descent" do during model training?
Searches through possible model architectures to find the optimal one.
Selects the most informative training examples for the current batch.
Normalises the model's outputs to match the training data distribution.
*Iteratively adjusts model weights in the direction that reduces the training loss.
===
What is the primary function of the learning rate in model training?
Determines how quickly the model can read and process training examples.
Sets the maximum number of training steps before the run terminates.
*Controls how large each weight update step is during gradient descent.
Adjusts the proportion of the training data used in each epoch.
===
What is "overfitting" in model training?
The model generates outputs that are too long and detailed for the given task.
*The model memorises training data and performs poorly on new, unseen examples.
The model's training loss decreases while its outputs become less coherent.
The model's weights exceed the memory capacity of the GPU.
===
What is the difference between a "base model" and an "instruction-tuned model"?
*A base model predicts next tokens from text; an instruction-tuned model follows conversational instructions.
A base model is larger; an instruction-tuned model is a compressed version.
A base model can only generate code; an instruction-tuned model handles all text.
A base model has no safety training; an instruction-tuned model has been safety-tested.
===
What does "constitutional AI" (CAI) refer to in the context of Anthropic's training approach?
A legal framework governing how AI models can be used commercially.
A hardware architecture that ensures safe computation during inference.
*Training models to critique and revise their outputs according to a set of principles.
A method for training models without any human-generated data.
===
What is "data contamination" in the context of model evaluation?
When training data contains offensive or harmful content the model has learned.
When noise introduced during data preprocessing corrupts training examples.
When competing models train on each other's outputs, leading to distribution collapse.
*When test set examples were present in the model's training data, inflating benchmark scores.
===
What is "tokenizer" vocabulary size typically optimised for?
Maximising the number of languages the model can process.
*Balancing coverage of common words with manageable model input dimension.
Minimising training data storage requirements.
Matching the output dimension of the model's embedding layer exactly.
===
What is "KV cache" and why does it matter for inference?
*Stores computed key-value pairs from previous tokens to avoid recomputing them.
A hardware cache that stores the most frequently accessed model weights.
A client-side cache that stores previous API responses for reuse.
A compression algorithm that reduces model output size for transmission.
===
What does "quantisation" do to a language model?
Converts the model from a generative to a discriminative architecture.
Splits the model across multiple GPUs for parallel inference.
*Reduces the numerical precision of model weights to decrease memory and speed up inference.
Removes redundant neurons from the model to reduce its parameter count.
===
What is "speculative decoding" in language model inference?
The model generates multiple complete responses and selects the best one.
*A smaller draft model generates candidate tokens that the main model verifies in parallel.
Inference is run speculatively on predicted user queries before they are submitted.
The model skips low-confidence tokens to speed up generation.
===
What is "batch inference" and when is it useful?
Breaking a long input into smaller batches to fit within the context window.
Running the same input multiple times to average out sampling variation.
Pre-computing responses for a batch of expected future queries.
*Processing multiple input requests simultaneously to improve GPU utilisation.
===
What is "multi-head attention"?
*Running multiple attention computations in parallel, each learning different relationship patterns.
Applying attention to the input from multiple users simultaneously.
A technique where the model attends to its previous outputs before generating.
Attention computed across multiple transformer layers simultaneously.
===
What does "model parallelism" solve?
Ensures multiple users can query the same model simultaneously.
*Splits a model too large to fit on one GPU across multiple GPUs.
Allows the model to process multiple modalities (text and images) in parallel.
Distributes training data across GPUs to speed up data loading.
===
What is "flash attention" designed to improve?
The speed at which the attention mechanism learns to focus on relevant tokens.
The accuracy of attention scores for long-distance token dependencies.
The initialisation of attention weights to speed up model convergence.
*Memory efficiency of the attention computation by avoiding storing large intermediate matrices.
===
What is "inference latency" and what are the main contributors to it?
The delay between the user sending a query and the server receiving it.
The time required to load model weights from storage into memory.
*The time to generate a response — driven by model size, hardware, and generation length.
The computational cost of evaluating training loss on the inference server.
===
What does "throughput" measure in an LLM serving context?
The accuracy of the model's outputs on a standard benchmark.
*The number of tokens (or requests) the system can process per unit time.
The bandwidth available between the client and the inference server.
The proportion of requests that complete within an SLA latency target.
===
What is a "mixture of experts" (MoE) architecture?
*A model where only a subset of specialised sub-networks (experts) activates per token.
An ensemble of multiple separate models that vote on the best response.
A training approach using multiple human annotators as domain experts.
A model that dynamically selects which dataset to sample from during training.
===
What is "positional encoding" and why do transformers need it?
Encodes the semantic position of words within a sentence's grammatical structure.
Maps absolute token positions to relative importance weights for attention.
*Injects sequence position information since attention is inherently order-agnostic.
Adds timestamp information to allow the model to process time-series data.
===
What is "beam search" in text generation?
A method for parallelising attention computation across multiple processing units.
A technique for filtering harmful content from the model's output distribution.
An approach that generates text in both forward and backward directions.
*A search algorithm that maintains multiple candidate sequences and selects the highest-scoring one.
===
What is "chain of thought" (CoT) prompting and why does it improve performance on complex tasks?
A technique that chains multiple separate model calls together automatically.
*Prompting the model to reason step by step before answering, improving accuracy on multi-step problems.
Prompting the model to generate its full context window before producing an answer.
A sampling technique that produces multiple candidate reasoning paths simultaneously.
===
What does "context length scaling" refer to as a challenge in LLM development?
Longer contexts require proportionally more training data to learn from.
Models produce worse outputs when given more context than their training used.
*The computational cost of attention grows quadratically with sequence length.
Context windows must be fixed at training time and cannot be extended.
===
What is the difference between "model weights" and "model activations"?
*Weights are stored parameters; activations are intermediate computed values during a forward pass.
Weights determine output format; activations determine output content.
Weights are used during training; activations are used during inference.
Weights are shared across layers; activations are unique to each input token.
===
What is an "eval" (evaluation) in the context of language model development?
A human expert review of model outputs for quality assurance.
A safety check run before deploying a model update to production.
An automated scan for harmful content in the model's training data.
*A systematic test measuring model performance on a defined task or capability.
===
What is the most important limitation of benchmark scores as a measure of model quality?
Benchmarks can only measure factual knowledge, not reasoning ability.
*Benchmark performance may not reflect real-world task performance or user value.
Benchmark scores are proprietary and not publicly disclosed by model providers.
Benchmarks require human evaluation which introduces inter-rater variability.
===
What does "MMLU" (Massive Multitask Language Understanding) measure?
The model's ability to understand and generate multiple languages.
Multiturn dialogue quality across many conversational topics.
*Multiple-choice knowledge across 57 academic subjects and disciplines.
The model's performance at generating structured data in multiple formats.
===
What is "human eval" in LLM evaluation?
*Having human raters compare or assess model outputs directly.
Running the model on problems where humans' correct answers are the ground truth.
A specific coding benchmark that measures model performance on Python tasks.
An internal Anthropic evaluation methodology for safety testing.
===
What does "accuracy on held-out test data" measure in model evaluation?
How accurately the model reproduces its training data verbatim.
The percentage of inference calls that complete without technical errors.
How precisely the model's outputs match the user's intended format.
*How well the model performs on examples it was not exposed to during training.
===
What is "F1 score" and why is it useful in model evaluation?
A composite benchmark score averaging performance across multiple F-series tasks.
A measure of fluency that rates the grammatical correctness of model outputs.
*The harmonic mean of precision and recall, balancing false positives and false negatives.
The fraction of model outputs that a human rater finds factually correct.
===
Why is "model calibration" important?
*A calibrated model's confidence scores accurately reflect the probability it is correct.
Calibration ensures the model produces outputs of consistent length.
A calibrated model refuses to answer questions outside its training domain.
Calibration aligns the model's vocabulary with the user's expected terminology.
===
What is "LLM-as-judge" evaluation and what is its key limitation?
Asking users to rate their conversations with an LLM — limited by user expertise.
*Using a language model to rate other model outputs — limited by the judge model's own biases.
Running models against standardised legal evaluation criteria — limited by jurisdiction.
Evaluating model outputs on safety criteria — limited by adversarial prompt injection.
===
What does "win rate" measure in comparative model evaluation?
The percentage of benchmark tasks a model completes successfully.
The probability that a model produces a factually correct answer on a given topic.
*The fraction of head-to-head comparisons where one model is preferred over another.
The fraction of inference calls that complete without timeout or error.
===
What is "evals data contamination" and why is it a significant problem?
Evaluation data collected from users introduces privacy risks.
Human annotators contaminate eval results by disagreeing with each other.
Model outputs leak into evaluation pipelines, creating circular scoring.
*Benchmark test sets present in training data make scores meaninglessly high.
===
What is the purpose of a "safety eval"?
*Measuring a model's tendency to produce harmful, misleading, or inappropriate outputs.
Testing that the model's inference API meets performance SLA requirements.
Verifying that the model's training data was sourced ethically.
Ensuring the model's outputs are grammatically correct and coherent.
===
What does "red teaming" mean in AI model development?
Competing against another team to achieve higher benchmark scores.
*Adversarially probing a model to find safety failures, harmful outputs, or exploitable behaviours.
Testing model performance under high-load production traffic conditions.
Running the model on tasks from domains it was not specifically trained for.
===
Why do evaluation results sometimes differ across providers reporting the same benchmark?
Different providers have access to different versions of the same benchmark test set.
Benchmarks are designed differently for each model provider by the benchmark authors.
Different GPU hardware produces numerically different inference results.
*Prompt formatting, few-shot examples, and generation settings all affect scores significantly.
===
What does a model's performance on "out-of-distribution" data reveal?
*How well the model generalises beyond the patterns present in its training data.
How the model handles inputs in languages not present in the training corpus.
Whether the model can identify when a question is factually incorrect.
The model's robustness to typos and grammatical errors in input text.
===
What is the key difference between "task-specific" and "general" capability evaluation?
Task-specific evals use human raters; general evals use automated metrics.
Task-specific evals are faster; general evals require more compute.
*Task-specific evals measure one skill; general evals measure breadth across many skills.
Task-specific evals are proprietary; general evals are publicly published.
===
You are building a product feature where the same input must always produce the same output. What inference setting do you use?
*Temperature = 0 for deterministic, reproducible generation.
Temperature = 1 for maximum quality generation.
Top-p = 1.0 to include the full vocabulary distribution.
Max tokens set to exactly the expected output length.
===
You need to reduce the cost of running Claude at scale. The most impactful lever is:
Switching to a different cloud region with lower GPU costs.
Increasing batch size to improve throughput without changing token count.
Using a longer context window to process more data per call.
*Reducing input and output token counts through prompt and output design.
===
A model produces high-quality outputs in testing but degrades in production. The most likely cause is:
The model is being called with a higher temperature in production.
*Production inputs differ from test inputs in format, length, or content distribution.
The production server hardware is less powerful than the test environment.
The model's weights are being updated by production usage patterns.
===
You want Claude to output only valid JSON. The most reliable approach is:
Use the phrase "respond in JSON" without further specification.
Post-process Claude's output with a JSON formatter to fix any errors.
*Specify the exact JSON schema in the prompt with an example, and set temperature = 0.
Ask Claude to rate its own output for JSON validity before returning it.
===
Which scenario most clearly justifies fine-tuning a model rather than using prompting?
*Consistent high-quality performance on a very specific domain not covered well by the base model.
Adding the ability to browse the internet and retrieve current information.
Reducing the model's hallucination rate on general knowledge questions.
Making the model respond in a different language than its primary training language.
===
You notice that a model's benchmark scores have improved significantly between versions but user satisfaction has not. The most likely explanation is:
Users are not sophisticated enough to recognise the quality improvement.
The model is being tested by users on tasks outside the benchmark scope.
*Benchmark improvements do not always translate to real-world capability improvements.
Satisfaction metrics have a 3-6 month lag behind capability improvements.
===
A RAG system retrieves relevant documents and passes them to Claude, but Claude's answers are still often wrong. The most likely cause is:
Claude's context window is too small to process the retrieved documents.
Claude is ignoring the retrieved context and generating from training knowledge.
The embedding model used for retrieval is not from Anthropic.
*Retrieved documents are not accurately addressing the specific question being asked.
===
What is the most important thing to monitor in a production LLM system?
GPU memory utilisation to prevent out-of-memory errors.
*Output quality on real user inputs, not just test set performance.
API response times to ensure SLA compliance.
Token costs per request to control infrastructure spend.
===
You are asked to compare two language models for a production use case. What evaluation approach is most reliable?
Compare their scores on the latest public benchmarks from their technical reports.
Ask both models to rate each other's outputs on the target task.
*Run both models on a sample of real production inputs and measure task-specific outcomes.
Select the model with the higher parameter count, as it generally performs better.
===
What is the most important property of a prompt template used in a production system?
*Robustness — producing consistent, correct outputs across diverse real inputs.
Conciseness — minimising token count to reduce API costs.
Creativity — producing varied outputs to avoid repetition.
Formality — using professional language appropriate to enterprise users.
===
A system prompt instructs Claude to "always respond in exactly 3 bullet points." This is:
A hard enforcement mechanism that overrides all other output tendencies.
*A format constraint that Claude will generally follow but cannot guarantee perfectly.
An instruction that Claude will refuse if the content does not fit 3 points.
A valid instruction only when temperature is set to 0.
===
You want to evaluate whether a model update improved performance without introducing regressions. What methodology do you use?
Deploy the new model and monitor user satisfaction for 30 days.
Ask domain experts to rate the new model's outputs on a sample of queries.
Compare the models' scores on a new benchmark not used in either version's training.
*Run a consistent eval suite on both model versions and compare scores on all dimensions.
===
What is the most important consideration when choosing a context window size for a production application?
Maximising context window size to ensure the model has access to all possible information.
Minimising context window size to reduce API latency and cost.
*Whether the actual use case inputs will fit within the window reliably, with headroom.
Matching the context window to the size used in the model's original training.
===
What is the strongest signal that a language model is hallucinating rather than misunderstanding a question?
The model produces a vague, hedged response that does not directly answer.
*The model produces specific, confident, plausible-sounding details that are factually wrong.
The model asks for clarification before answering.
The model produces an answer that contradicts its previous responses.
===
Menler's AI Engineering Thinking bank is designed for learners at what stage?
Academic researchers specialising in machine learning architecture design.
Those studying for ML engineering interviews at top technology companies.
Learners with no prior exposure to AI who want a technical foundation.
*Those building applied AI products who need to understand model behaviour and constraints.
===
What distinguishes an AI "agent" from a standard AI chatbot?
An agent has higher intelligence and handles more complex questions.
*An agent takes multi-step actions autonomously using tools to achieve a goal.
An agent learns and improves from each conversation over time.
An agent can access the internet and retrieve current information.
===
What is the "observe-orient-decide-act" (OODA) loop relevant to in agentic AI?
A debugging framework for identifying errors in multi-step AI pipelines.
A compliance framework for monitoring AI agent behaviour in production.
A training methodology for teaching agents to plan multi-step tasks.
*A mental model for how an AI agent processes perception and takes action iteratively.
===
What is "tool use" (function calling) in the context of language model agents?
*The model can invoke predefined external functions and incorporate their results.
The model uses different internal parameters depending on the task type.
The model selects from a library of pre-written prompt templates for each task.
The model switches between text and code generation modes based on context.
===
What is the most important design constraint for an autonomous AI agent?
Using the most capable available model as the agent's reasoning core.
Minimising the number of steps the agent takes to complete a task.
*Clearly defined boundaries on what actions it is and is not permitted to take.
Ensuring the agent can retry failed steps without human intervention.
===
What does "planning" mean in an agentic AI system?
The model predicting which future user requests are most likely to arrive.
*Decomposing a goal into a sequence of steps before beginning execution.
Scheduling agent jobs across multiple servers for parallel execution.
Pre-generating several candidate responses before selecting the best one.
===
What is the "ReAct" framework for AI agents?
*Interleaving reasoning and action steps — the model thinks, then acts, then thinks again.
A React.js framework for building user interfaces for AI agent products.
A reinforcement learning approach for training agents through trial and error.
A method for automatically generating tool definitions from API documentation.
===
What is the most common failure mode of an AI agent in production?
The agent uses too much compute and exceeds cost budgets unexpectedly.
The agent refuses to take any action without explicit human confirmation.
The agent produces outputs too slowly for real-time use cases.
*The agent gets stuck in loops or takes wrong actions when encountering unexpected inputs.
===
What is "scaffolding" in the context of AI agent development?
A set of pre-written prompts that guide the agent through each task step.
The process of gradually increasing task complexity during agent training.
*The code infrastructure that manages agent execution, tool calls, and state.
A technique for breaking large agent outputs into smaller manageable chunks.
===
What is the difference between a "single-step" and "multi-step" AI workflow?
*Single-step is one model call; multi-step chains multiple calls where each builds on the last.
Single-step handles simple tasks; multi-step requires a more capable model.
Single-step uses one model; multi-step uses multiple different models.
Single-step is synchronous; multi-step is always asynchronous.
===
What is "memory" in the context of an AI agent?
The total amount of RAM available to the model during inference.
The agent's ability to learn and update its weights from user interactions.
The portion of the context window reserved for conversation history.
*Mechanisms for persisting and retrieving context across multiple agent steps or sessions.
===
What makes "irreversible actions" especially important to handle carefully in agents?
Irreversible actions take longer and increase per-step latency.
*Mistakes cannot be undone without significant effort or harm.
Irreversible actions require more compute than reversible ones.
Regulatory frameworks prohibit agents from taking irreversible actions without a license.
===
What is "chain of thought" most useful for in an agentic context?
Linking multiple agent instances together in a sequential pipeline.
Tracking the sequence of tool calls an agent has made for debugging.
*Having the agent reason explicitly before deciding which action to take next.
Generating a narrative explanation of the agent's actions for the user.
===
What is the primary purpose of a system prompt in an AI agent?
Providing the agent with real-time data it needs for the current task.
Setting the agent's output format for all responses it generates.
Storing the conversation history so the agent can reference previous turns.
*Defining the agent's role, capabilities, constraints, and available tools.
===
What does "agent trajectory" refer to?
The latency curve of an agent across multiple task runs.
*The sequence of observations, reasoning steps, and actions an agent takes to complete a task.
The path an agent takes through a decision tree during planning.
The history of user prompts that led to the current agent invocation.
===
What is "grounding" in the context of AI agents?
*Anchoring agent actions and beliefs to verified external information sources.
Connecting the agent to a physical hardware environment for real-world tasks.
Providing the agent with explicit instructions at the start of each session.
Limiting the agent's output to text that can be directly executed as code.
===
When a language model "calls a function," what actually happens?
The model directly executes code within its own inference process.
The model retrieves a pre-computed result from a cached function output store.
*The model outputs a structured request; external code executes it and returns the result.
The model generates pseudocode that a human developer then implements.
===
What information must a tool definition include for Claude to call it effectively?
*Tool name, description of what it does, and parameter schema with types and descriptions.
Tool name, the API endpoint URL, and authentication credentials.
Tool name, the programming language it is implemented in, and expected runtime.
Tool name, a list of example inputs, and the expected output format.
===
What is "parallel tool calling" and when is it useful?
Running the same tool multiple times with different inputs to compare results.
Using multiple AI models in parallel, each with access to different tools.
Pre-warming tool execution environments before the agent begins a task.
*Invoking multiple tools simultaneously when results are independent of each other.
===
What is the most important consideration when designing a tool for an AI agent?
Minimising the tool's response time to reduce agent latency.
*Clear, unambiguous description of when and how to call it to prevent misuse.
Ensuring the tool can handle any possible input without throwing exceptions.
Matching the tool's interface to standard REST API conventions.
===
You give an agent a web search tool. What is the most important risk to manage?
Web search may return results that exceed the agent's context window.
The agent may make too many search calls and exceed API rate limits.
*The agent may act on false or malicious information retrieved from the web.
Web search results may be in a language the model cannot process.
===
What is "prompt injection" in an agentic context?
Injecting additional instructions into the agent's system prompt at runtime.
A technique for inserting few-shot examples into the agent's prompt dynamically.
An attack where an adversary sends the agent an unusually long input to cause errors.
*Malicious instructions embedded in content the agent reads that hijack its behaviour.
===
What is the correct handling when a tool call returns an error?
*The agent should detect the error, decide whether to retry or use a fallback, and proceed accordingly.
The agent should immediately terminate and report failure to the user.
The agent should retry the same call indefinitely until it succeeds.
The agent should proceed as if the tool returned an empty successful response.
===
You are designing an agent that can send emails on the user's behalf. What is the non-negotiable safeguard?
Limiting the agent to sending emails only to addresses in the user's contacts.
*Human review and confirmation before any email is sent.
Adding a standard AI disclosure footer to every email the agent sends.
Logging all sent emails to a database for audit purposes.
===
What is the difference between a "deterministic" and "non-deterministic" tool in agent design?
Deterministic tools execute instantly; non-deterministic tools have variable latency.
Deterministic tools are safe for agents to call; non-deterministic ones require human approval.
Deterministic tools are built in-house; non-deterministic tools call third-party APIs.
*Deterministic tools always return the same output for the same input; non-deterministic tools do not.
===
What does "tool result grounding" mean in a RAG-enabled agent?
The tool results are stored in a permanent database for future reference.
The agent verifies tool results by calling a second verification tool.
*The agent's answer is based on retrieved document content rather than training knowledge.
The tool results are formatted and grounded to a specific output template.
===
What is the most reliable way to prevent an agent from calling a sensitive tool inappropriately?
Adding a human approval step before every tool call the agent makes.
*Clear tool descriptions specifying exactly when the tool should and should not be called.
Removing sensitive tools from the agent's tool list unless explicitly needed.
Using a safety classifier to intercept and block inappropriate tool calls.
===
What is "structured output" and why is it important for tool use?
*Machine-parseable formatted output (like JSON) that the scaffolding code can reliably process.
Formatted text output that is presented to users in a visually organised way.
Output that is generated according to a fixed response template.
Output that has been reviewed and approved by a human before delivery.
===
You notice your agent is calling the same tool repeatedly with the same parameters. The most likely cause is:
The tool has a bug that returns incorrect results, confusing the agent.
The agent's context window is too small to remember it already called the tool.
*The agent is stuck in a loop because the tool result is not resolving its uncertainty.
The system prompt instructed the agent to verify all tool results by re-calling.
===
What is the most important metric to track for tool reliability in a production agent?
Average tool response latency across all calls in production.
Total number of tool calls made per user session.
The percentage of tool calls that return non-empty results.
*Tool call error rate and the agent's recovery success rate when errors occur.
===
What is the correct approach when an agent needs a tool that does not yet exist?
Use the most general-purpose tool available as a substitute, even if it does more.
*Build a minimal, well-documented tool that does exactly what is needed and nothing more.
Ask the model to simulate the tool's output using its training knowledge.
Build a tool that handles all possible future needs to avoid rebuilding later.
===
What is "prompt chaining" and when does it produce better results than a single prompt?
*Sequential prompts where each output becomes the next input — better for complex, multi-stage tasks.
Linking multiple AI models together where each specialises in a different modality.
Repeating the same prompt multiple times and selecting the best output.
Appending follow-up instructions to a prompt to extend a single response.
===
What is the main reliability advantage of prompt chaining over a single long prompt?
Chaining is faster because each individual prompt is shorter.
Chaining uses less total compute than a single long prompt.
*Each step can be verified and corrected before it propagates errors to the next step.
Chaining allows different models to be used for different steps.
===
What is a "map-reduce" pattern in prompt chaining?
Process large documents by dividing them across multiple models simultaneously.
*Apply the same operation to many items in parallel (map), then aggregate results (reduce).
Generate multiple candidate outputs and select the one that reduces perplexity.
A data engineering pattern for preprocessing training data before model ingestion.
===
What is the most important design principle for individual steps in a prompt chain?
Each step should be as long as possible to minimise the number of steps.
Each step should produce a self-contained final output that needs no further processing.
Each step should include instructions for handling all possible error conditions.
*Each step should have a single, clearly defined input and output.
===
You are building a chain that extracts information from documents and writes a report. The most important step to include between extraction and writing is:
*A validation step that checks the extracted information for completeness and accuracy.
A formatting step that converts extracted data to the report's visual template.
A planning step where the model outlines the report structure.
A length-checking step to ensure the report will fit within the context window.
===
What is "dynamic chain construction" in an AI workflow?
The chain is built by sampling randomly from a library of available prompt steps.
*The agent determines which steps to execute based on intermediate results.
New chain steps are added by the user as the task progresses.
The model dynamically selects which language model to call at each step.
===
What is the most common failure mode when chaining prompts?
The total token count across the chain exceeds what is cost-effective.
Different steps use different prompt formats that produce incompatible outputs.
The final step loses coherence because the context window has been exceeded.
*Errors in early steps compound and corrupt all subsequent steps.
===
How should you handle a step in a prompt chain that fails or produces bad output?
Restart the entire chain from step one with a better initial prompt.
Pass the failed output to the next step and flag it as uncertain.
*Detect the failure, retry with a modified prompt or different approach, then continue.
Ask the user to provide the correct output for the failed step manually.
===
What is "prompt compression" and why does it matter in long chains?
Reducing the length of each chain step's prompt to speed up generation.
*Summarising intermediate outputs to prevent context accumulation from filling the window.
Removing redundant instructions from prompts to reduce token costs.
A technique for combining multiple chain steps into one to reduce API calls.
===
What distinguishes a "deterministic chain" from a "branching chain"?
*A deterministic chain always follows the same steps; a branching chain routes based on intermediate outputs.
A deterministic chain uses the same model at each step; a branching chain uses different models.
A deterministic chain is synchronous; a branching chain is asynchronous.
A deterministic chain is simpler to build; a branching chain requires more compute.
===
What is "output parsing" in prompt chaining and why can it fail?
Translating the final output into the user's preferred language.
Running grammar and spell-check on model outputs before they move to the next step.
*Extracting structured data from a model's text output — fails when format is inconsistent.
Converting model outputs to speech for audio applications.
===
When is it appropriate to use a single complex prompt versus a chain of simpler prompts?
Single prompts are always better because they require fewer API calls.
Chains are always better because each step can be individually optimised.
Single prompts are better for speed; chains are better when accuracy is critical.
*Single prompts work for straightforward tasks; chains are better for complex multi-stage workflows.
===
What is the most important thing to log in a production prompt chain?
The total token count and cost of each chain execution.
*Every step's inputs, outputs, and any errors, for debugging and quality monitoring.
Only the final output and whether the chain succeeded or failed.
The model version used at each step for reproducibility tracking.
===
A prompt chain produces a good result 90% of the time but fails 10%. The best engineering response is:
Accept the 10% failure rate and notify users when failures occur.
Switch to a more capable model to reduce the failure rate.
*Add validation steps and error handling to catch and recover from the 10% failures.
Redesign the chain so it only runs on the 90% of inputs where it is expected to succeed.
===
What is a "handoff" in a prompt chain context?
*Passing the output of one step as the structured input to the next step.
Transferring a user session from an AI agent to a human support agent.
Moving a workflow from development to production deployment.
Shifting responsibility for a chain from one developer to another.
===
What is a "multi-agent system" in AI?
A single AI model that simulates multiple personas in a conversation.
A cluster of servers running the same AI model for high availability.
An AI system that can call multiple external APIs in a single step.
*Multiple AI agents working together, each handling a part of a complex task.
===
What is the primary advantage of using specialised agents versus one general-purpose agent for complex tasks?
Specialised agents use less compute than a single general-purpose agent.
*Specialised agents can be independently optimised and tested for their specific role.
Specialised agents can use different underlying models for different subtasks.
Specialised agents are easier to prompt and require shorter system prompts.
===
What is an "orchestrator" agent?
An agent that manages the infrastructure and compute resources for other agents.
An agent that translates between different agents' output formats.
*An agent that coordinates other agents — assigning tasks and synthesising their results.
The most capable agent in a system that overrides other agents' decisions.
===
What is the biggest coordination challenge in multi-agent systems?
*Ensuring agents share consistent context and don't operate on contradictory information.
Preventing agents from using too many tokens in aggregate.
Ensuring each agent uses the same AI model version.
Managing API rate limits when multiple agents call external tools simultaneously.
===
What is "agent role confusion" and how does it manifest?
The user cannot tell which agent in a system produced a given output.
An agent fails to understand what role the user wants it to play.
Multiple agents produce identical outputs because they have similar role definitions.
*An agent acts outside its assigned role, taking actions intended for another agent.
===
What is "emergent behaviour" in multi-agent systems and why is it a risk?
Agents developing new capabilities through interaction with each other.
Agents that spontaneously develop efficient workflows without being explicitly programmed.
*Unexpected system-level behaviour arising from agent interactions not anticipated by designers.
A single agent discovering a novel approach that improves the whole system's performance.
===
What is a "deadlock" in a multi-agent system?
*Two or more agents each waiting for the other to complete before they can proceed.
A situation where all agents produce identical outputs and the system cannot select one.
An agent that keeps sending requests to a tool that is unavailable.
A failure mode where an orchestrator loses track of which agents are active.
===
What is the most appropriate use of parallel agent execution?
All tasks in a multi-agent system, to minimise total completion time.
*Tasks that are independent of each other and whose results can be combined afterward.
Tasks where an earlier agent's output is uncertain and needs verification.
Tasks where the final result needs to be produced as quickly as possible.
===
What is the correct approach when one agent in a multi-agent system produces an error?
The entire multi-agent workflow restarts from the beginning.
The failed agent retries indefinitely until it succeeds.
*The orchestrator detects the error and decides whether to retry, use a fallback, or escalate.
The orchestrator skips the failed agent's task and proceeds without its output.
===
What is "agent communication protocol" and why does it matter?
The rate at which agents send messages to each other during execution.
The security protocol used to authenticate agent-to-agent API calls.
The programming language used to implement each agent's reasoning logic.
*The structured format by which agents exchange information — critical for interoperability.
===
What distinguishes "cooperative" from "competitive" multi-agent architectures?
*Cooperative agents work toward a shared goal; competitive agents optimise different objectives.
Cooperative agents share compute resources; competitive agents have isolated resources.
Cooperative agents can call each other's tools; competitive agents cannot.
Cooperative agents are designed by the same team; competitive ones are from different vendors.
===
What is a "critic agent" and when is it useful?
An agent that monitors system performance and alerts when metrics degrade.
*An agent that evaluates another agent's output and identifies errors or improvements.
An agent that filters harmful content from other agents' outputs.
An agent that rejects tasks outside its scope and returns them to the orchestrator.
===
What is the most important human oversight requirement for multi-agent systems?
A human reviewing every message that passes between agents.
A human approving the addition of each new agent to the system.
Daily audits of all agent logs by a designated system administrator.
*Checkpoint reviews at consequential decision points before irreversible actions.
===
What is "agent handoff" in a customer service context?
*An AI agent transferring a conversation to a human agent when it cannot resolve the issue.
One AI agent passing a task to a specialised AI agent with more relevant tools.
A system that routes new incoming queries to the most available agent.
The process of switching a user from one product's AI to another product's AI.
===
What is the most reliable way to test a multi-agent system before production deployment?
Unit testing each agent in isolation with simulated inputs from other agents.
Testing the orchestrator in isolation with all worker agents mocked.
*Running end-to-end tests on realistic scenarios that cover the main task paths and edge cases.
Deploying to a canary user group and measuring error rates in production.
===
What is the "minimal footprint" principle in agent design?
*Request only the permissions and tools needed for the specific task.
Use the smallest possible model that can complete the task adequately.
Minimise the number of steps the agent takes to complete each task.
Limit the agent to read-only tool access to prevent unintended changes.
===
What is "reward hacking" as it applies to AI agent systems?
A security vulnerability where an attacker manipulates the agent's reward signal.
An agent that requests rewards (credits, tokens) from users in exchange for help.
A training failure where the reward model assigns high scores to clearly wrong outputs.
*An agent achieves its specified objective by means that violate the designer's intent.
===
What is the most important difference between "safe" and "unsafe" agentic behaviour?
Safe agents are slower because they verify each step; unsafe agents are faster.
*Safe agents stay within their authorised scope; unsafe agents take unauthorised actions.
Safe agents use less capable models; unsafe agents use the most powerful model.
Safe agents have human oversight; unsafe agents operate in a production sandbox.
===
What is "cascading failure" in an agent system?
When multiple agents fail at the same time due to a shared resource outage.
A failure mode where an agent's output keeps growing until it exceeds context limits.
*An error in one component propagates and amplifies through dependent components.
When retry logic causes exponentially increasing API calls that overwhelm a service.
===
What is the most effective way to prevent an agent from taking an action with irreversible consequences?
*Require explicit human confirmation before the agent executes any irreversible action.
Add a post-execution check that undoes any action the agent should not have taken.
Train the agent to recognise irreversible actions and automatically refuse them.
Limit the agent's tool access so it cannot access any tool with irreversible effects.
===
What is "scope creep" in agent design and why is it dangerous?
The system prompt gradually grows too long for the context window.
The agent's tool list expands over time without systematic review.
*The agent gradually takes on tasks beyond its intended scope, increasing risk.
The agent's performance degrades as the deployment scope expands.
===
What is the most important log to maintain for agent safety auditing?
A log of every user prompt that triggered an agent execution.
A record of every API call and its cost for billing and performance analysis.
A log of every tool error and the agent's recovery strategy.
*A complete record of every action taken and its outcome, with timestamps.
===
What is "principal hierarchy" in the context of AI agent safety?
The order in which agents execute in a multi-agent pipeline.
*The authority structure defining whose instructions the agent should prioritise.
The chain of command within the development team responsible for the agent.
The ranking of tools the agent should prefer when multiple tools could serve a purpose.
===
What is the correct response when an agent is given an instruction that conflicts with its safety constraints?
Follow the instruction since the user or operator has authority over the agent.
Attempt to partially follow the instruction while minimising safety violations.
*Follow the safety constraints and explain why the conflicting instruction cannot be followed.
Escalate the conflict to the operator for resolution before proceeding.
===
Why is "rate limiting" important in production AI agent systems?
*Prevents runaway agents from making unbounded API calls that cause cost or service failures.
Ensures fair distribution of compute resources between multiple concurrent users.
Prevents agents from generating outputs that exceed the context window size.
Limits the number of agents that can be deployed simultaneously in the system.
===
What is the most important test to run before deploying an AI agent to production?
Performance testing — does the agent complete tasks within the SLA time limits?
*Adversarial testing — can the agent be prompted to take actions outside its intended scope?
Cost testing — does the agent stay within the target token budget per task?
Compatibility testing — does the agent work correctly across all supported platforms?
===
What does "fail-safe" mean in an agent system design?
The agent automatically retries all failed operations until they succeed.
The agent stores its state so it can resume from the last successful step after a failure.
A backup agent that activates when the primary agent fails.
*When the system fails, it defaults to a safe state rather than an unsafe one.
===
What is "human-in-the-loop" most critical for in agent design?
All agent tasks, since agents should never operate without human supervision.
The initial task specification, to ensure the agent has the correct goal.
*High-stakes, irreversible, or uncertain decisions where agent errors have significant consequences.
Error recovery steps, where the agent cannot determine the correct next action.
===
What is the most reliable indicator that an AI agent system needs a human escalation path?
The agent has been running for longer than its typical task completion time.
*The agent encounters a situation where proceeding would require taking an irreversible action under uncertainty.
The agent has made more than a defined number of tool calls without completing.
The user has sent more than three messages without being satisfied with the response.
===
Menler's AI Agents & Workflows bank targets practitioners at what level?
Researchers studying multi-agent coordination and emergent AI behaviour.
Beginners learning what AI agents are for the first time.
Executives deciding whether to invest in agentic AI for their organisation.
*Those designing and building production AI agent systems with real reliability requirements.
===
What is an "API key" in the context of accessing an AI model?
A configuration parameter that controls the model's output temperature.
*A credential that authenticates requests to an AI provider's API endpoints.
A licence that grants permission to use a specific model commercially.
An encryption key used to secure the model's weights in transit.
===
What does a REST API return when a request succeeds?
A binary model output that must be decoded before use.
A confirmation message and the request ID for tracking purposes.
The model's confidence score alongside the generated response.
*A response body (typically JSON) and an HTTP 200-level status code.
===
What is the difference between synchronous and asynchronous API calls?
*Synchronous calls wait for the response; asynchronous calls return immediately and retrieve the result later.
Synchronous calls are encrypted; asynchronous calls are not.
Synchronous calls are for small requests; asynchronous calls are for large ones.
Synchronous calls use REST; asynchronous calls use WebSockets.
===
What is "streaming" in the context of LLM API responses?
Continuously processing an incoming audio or video feed through an AI model.
Sending large documents to the AI API in small chunks to avoid size limits.
*Receiving tokens as they are generated rather than waiting for the full response.
A real-time learning mode where the model updates based on user feedback.
===
What HTTP status code indicates that an API request was rejected due to rate limiting?
503 Service Unavailable.
*429 Too Many Requests.
401 Unauthorized.
400 Bad Request.
===
What is "exponential backoff" and why is it used in AI API integrations?
*Retrying failed requests with increasing delays to avoid overwhelming the API.
A technique for gradually increasing batch size to optimise throughput.
A method for reducing token usage by exponentially compressing prompts.
A caching strategy that stores responses for exponentially increasing time periods.
===
What is a "system prompt" in the API context, and how does it differ from a user message?
A system prompt is encrypted for security; a user message is sent in plain text.
A system prompt is processed first by a faster model; user messages use the full model.
A system prompt is visible to users; a user message is confidential.
*A system prompt sets persistent instructions for the model; a user message is the runtime input.
===
What does "max_tokens" control in an API request?
The maximum number of tokens allowed in the user's input prompt.
The total maximum tokens for the entire conversation context window.
*The maximum number of tokens the model will generate in its response.
The number of candidate responses the model generates before selecting the best.
===
What is the purpose of a "system fingerprint" or "model version pinning" in production API use?
*Ensuring a specific model version is used for reproducibility and preventing unexpected changes.
Verifying that the API response was generated by the claimed model and not tampered with.
Tracking which system sent the API request for billing attribution.
Ensuring the model uses the same random seed across all requests.
===
What is "context stuffing" and why is it problematic?
A technique for fitting more data into a prompt by compressing or summarising it.
An attack where malicious content is added to the context to manipulate the model.
The process of loading model weights into GPU memory before inference.
*Filling the context window with excessive content, degrading model attention on key information.
===
What does an API "endpoint" refer to?
The server hardware at the physical end of the network that runs the model.
*The specific URL that receives API requests for a particular functionality.
The final token the model generates before stopping.
The response format returned at the end of a streaming response.
===
What is "prompt caching" and what problem does it solve?
Storing common user prompts in a database to respond without calling the model.
Caching model outputs so identical requests return the same response instantly.
*Reusing cached computation for repeated prompt prefixes to reduce cost and latency.
A technique for compressing prompts before sending them to the API.
===
What is the most important consideration when storing API keys in a production application?
Keys must be rotated every 24 hours to prevent unauthorised use.
Keys must be encrypted with AES-256 before being stored in any database.
Keys must be different for development and production environments.
*Keys must be stored in environment variables or a secrets manager, never in code.
===
What is "model routing" in a multi-model production system?
Load-balancing requests across multiple instances of the same model.
*Directing different requests to different models based on task requirements and cost.
Routing model outputs to different downstream systems based on content type.
Selecting the optimal serving hardware for each model inference request.
===
What does "API observability" mean in an AI production system?
*Monitoring request/response data, latency, errors, costs, and quality to understand system behaviour.
Making the AI API's internal workings transparent to end users.
Ensuring the model's reasoning is explainable for each response it generates.
Logging all user conversations for compliance and audit purposes.
===
What is "RAG" (Retrieval-Augmented Generation) and what problem does it solve?
Training a model on domain-specific data to improve its in-domain performance.
A technique for reducing hallucination by blocking uncertain model outputs.
*Supplementing a model with retrieved documents to answer questions it could not from training alone.
A method for compressing large datasets before feeding them to a language model.
===
What is a "vector embedding" in the context of RAG?
*A numerical representation of text that captures semantic meaning in a high-dimensional space.
A compressed version of a document stored in a binary database format.
A template that structures how retrieved documents are inserted into prompts.
A hash of a document used to check for duplicates in the knowledge base.
===
How does a vector database enable semantic search?
By indexing documents with keyword tags and returning exact keyword matches.
By training a specialised model on the document corpus for each new query.
By storing documents in a tree structure ordered by semantic topic.
*By comparing query embeddings to document embeddings using cosine or dot product similarity.
===
What is "chunking" in RAG and why does it matter?
Compressing retrieved documents to reduce the tokens sent to the model.
*Splitting documents into smaller pieces that fit within retrieval and context limits.
Dividing the RAG workflow into modular processing stages.
Grouping semantically similar documents together for batch embedding.
===
What is "hybrid search" in a RAG system?
Running the same query through multiple embedding models and merging results.
Searching both an internal database and the public internet for relevant documents.
*Combining vector similarity search with keyword (BM25) search to improve retrieval.
Using two different vector databases and selecting the better result for each query.
===
What is "re-ranking" in a RAG pipeline and when is it used?
Running the model on retrieved documents to decide which ones are accurate.
Reordering the model's generated output for better coherence and flow.
A post-processing step that re-ranks model responses by quality score.
*A second-pass scoring step that reorders retrieved documents by relevance before passing to the model.
===
What causes "retrieval failures" in a RAG system and how are they typically diagnosed?
*The retrieved documents do not contain the answer — diagnosed by checking retrieval results independently of generation.
The vector database is returning results too slowly, causing timeouts.
The embedding model is mismatched with the vector database query format.
The model is ignoring retrieved documents and generating from training knowledge.
===
What is "embedding model alignment" and why does it matter in RAG?
The embedding model must be trained on the same data as the generation model.
*Documents and queries must be embedded by the same model for similarity comparisons to work.
Embedding dimensions must exactly match the vector database's storage format.
The embedding model must be retrained whenever documents in the knowledge base change.
===
What is the most important metric to track for RAG retrieval quality?
Mean retrieval latency — how quickly the vector database returns results.
Embedding model perplexity on the document corpus.
The cosine similarity score of the top-1 retrieved result for each query.
*Recall@K — whether the correct document is in the top-K retrieved results.
===
What is "metadata filtering" in a vector database?
Removing identifying information from documents before they are embedded.
Filtering out low-quality embeddings based on their vector magnitude.
*Filtering retrieved documents by structured attributes (date, author, category) in addition to semantic similarity.
A security layer that prevents unauthorised users from querying certain documents.
===
What is "document freshness" a challenge for in RAG systems?
Ensuring retrieved documents are readable and not too old to understand.
*Keeping the knowledge base up to date when source documents change or new ones are added.
Preventing the model from generating outdated information from its training data.
Managing storage costs as the document corpus grows over time.
===
What is the "lost in the middle" problem in RAG with long contexts?
*Language models attend less to information in the middle of long contexts, missing retrieved content.
Long retrieved documents cause the model to lose track of the original user question.
Documents retrieved in the middle of a session are processed less accurately than early ones.
Chunking long documents causes the middle sections to be missing from the index.
===
What is the difference between "sparse" and "dense" retrieval?
Sparse retrieval indexes a subset of documents; dense retrieval indexes all documents.
Sparse retrieval is faster but less accurate; dense retrieval is slower but perfect.
*Sparse uses keyword matching (BM25); dense uses semantic embedding similarity.
Sparse retrieval works for short queries; dense retrieval handles multi-sentence queries.
===
What is "answer grounding" in RAG and why is it important?
Physically grounding the RAG system to a secure server infrastructure.
Verifying that retrieved documents are from trusted, authoritative sources.
Ensuring the model's answer uses the exact wording from retrieved documents.
*Ensuring the model's answer is based on and citable from the retrieved documents.
===
What is the most important operational consideration for a production RAG system?
Embedding model inference speed to minimise query-time latency.
*Document ingestion pipeline reliability — ensuring the index stays fresh and complete.
Vector database storage cost as the document corpus grows.
The number of documents returned per retrieval call (top-K parameter).
===
What is "time to first token" (TTFT) and why does it matter for user experience?
*The latency before the first token appears — drives perceived responsiveness in streaming UIs.
The time required for the model to read and process the first token of input.
The delay between model deployment and the first successful API request.
The time it takes for the first token in a prompt to be embedded and stored.
===
What is "tokens per second" (TPS) and what does it measure in LLM serving?
The rate at which input tokens are processed by the model before generation begins.
The throughput of the vector database during retrieval operations.
*The rate at which the model generates output tokens — higher means faster text generation.
The API's capacity for processing concurrent streaming requests.
===
What is a "GPU" and why is it essential for LLM inference?
A specialised memory chip that stores model weights for fast retrieval during inference.
*A processor with thousands of cores optimised for the parallel matrix operations in neural network inference.
A hardware accelerator that translates model outputs into binary for network transmission.
A co-processor that handles tokenisation and embedding before the main model runs.
===
What is "model sharding" in the context of LLM deployment?
Splitting user requests across multiple independent model instances for load balancing.
Breaking model responses into shards that are assembled client-side.
A compression technique that reduces model size by removing redundant weights.
*Distributing model weights across multiple GPUs because the model is too large for one device.
===
What is "serving latency percentile" (e.g., p99) and why does it matter?
*The latency that 99% of requests complete within — captures worst-case user experience.
The average latency for the top 99% most common request types.
A benchmark score measuring the model's inference speed on standard hardware.
The percentage of requests that complete within a predefined latency SLA.
===
What is "cold start" in serverless AI deployment?
An inference error caused by the model receiving an input it was not trained on.
*The latency spike from initialising a new container or loading model weights on first request.
A deployment strategy that starts with a small model and scales to larger models under load.
The process of pre-warming the GPU cache before inference begins.
===
What is "autoscaling" in an AI serving infrastructure?
Automatically adjusting the model's generation parameters based on query complexity.
A technique for dynamically resizing batch sizes based on GPU memory availability.
Automatically updating model weights when new training data becomes available.
*Automatically adding or removing compute instances based on request load.
===
What is the primary tradeoff between model size and serving cost?
Larger models have lower latency but higher memory requirements.
Larger models are cheaper to run because they require fewer API calls.
*Larger models cost more per token but may produce higher quality output.
Larger models produce more tokens per request, increasing total cost disproportionately.
===
What is "inference batching" and how does it improve GPU utilisation?
Breaking a single large request into multiple smaller batches for parallel processing.
*Processing multiple requests simultaneously in a single GPU forward pass.
Pre-generating common responses in advance for instant retrieval.
Grouping similar prompts together to improve cache hit rates.
===
What is "vLLM" and what problem does it solve?
*A high-throughput serving engine that improves GPU memory efficiency using PagedAttention.
A validation library for verifying that LLM outputs meet quality thresholds.
A vector database optimised for large-scale language model embedding storage.
A load balancer designed specifically for distributing LLM API requests.
===
What is "SLA" (Service Level Agreement) in the context of AI API deployment?
A legal agreement governing the permitted uses of an AI model in production.
A security standard that API providers must meet for enterprise deployment.
*A committed performance guarantee defining uptime, latency, and throughput thresholds.
A model accuracy guarantee specifying minimum benchmark performance.
===
What is "horizontal scaling" in AI serving infrastructure?
Increasing the hardware specification of existing serving instances.
Extending the model's context window to handle longer inputs.
Scaling the model's parameter count to improve output quality.
*Adding more serving instances in parallel to increase total capacity.
===
What is the most important thing to include in an AI service health dashboard?
GPU utilisation and memory consumption per serving instance.
*Error rate, latency percentiles, and request volume — the three pillars of service health.
Cost per request and total monthly API spend.
Model accuracy scores from the latest evaluation run.
===
What is the "deployment canary" strategy in AI model updates?
Deploying the new model to a test environment and canary testing for safety issues.
Using a smaller, cheaper model as a canary to catch harmful requests before the main model.
*Routing a small percentage of traffic to the new model version before full rollout.
A gradual rollout that increases model context window size incrementally.
===
What is "model deprecation" and what should production systems do about it?
*When a model version is retired by the provider — systems should pin to specific versions and have migration plans.
When a model's accuracy degrades over time due to distribution shift in production inputs.
The process of removing an underperforming model from a multi-model routing system.
A fine-tuning technique that reduces model size by removing deprecated capabilities.
===
What is the primary cost driver for LLM API usage?
The number of API requests made regardless of their content.
The time spent waiting for the model to complete generation.
The size of the model accessed, independent of token count.
*The number of input and output tokens processed per request.
===
What is "token efficiency" and why does it matter at scale?
Ensuring the model generates the maximum useful information per token output.
*Achieving the required output quality with the fewest possible tokens — directly reduces cost.
A measure of how accurately the model represents information in each token.
The ratio of useful content to total content in the model's training data.
===
Which approach most effectively reduces output token costs in a production system?
Using a higher temperature to generate more focused responses.
Switching to a smaller model that generates shorter responses.
*Instructing the model to be concise and specifying exactly the output format needed.
Increasing the max_tokens limit to allow the model to be more complete.
===
What is "cost per query" in AI production systems and how is it calculated?
*Total API cost divided by number of queries — the primary unit economics metric.
The infrastructure cost of running one GPU for the duration of one query.
The product of latency and compute cost per second for each inference call.
The cost of the embedding model call plus the generation model call per RAG query.
===
A RAG system makes 3 API calls per user query: embedding, retrieval, and generation. The most expensive component is typically:
Embedding — dense embedding models are computationally the most expensive component.
Retrieval — vector database queries at scale dominate infrastructure costs.
All three are approximately equal in cost for a well-designed system.
*Generation — output tokens from large models cost significantly more than embedding.
===
What is "caching" in the context of LLM production costs?
Pre-loading model weights into GPU memory to reduce cold start latency.
Using compression to reduce the size of API responses in transit.
*Storing responses for identical or near-identical queries to avoid repeated API calls.
Storing user conversation history locally to reduce API calls for context reconstruction.
===
What is the "price-performance" consideration when selecting a model for a production use case?
*Using the cheapest model that reliably achieves the required quality threshold.
Selecting the highest-performance model and optimising for cost later.
Matching the model size exactly to the complexity of the task at hand.
Using the same model for all tasks to simplify infrastructure management.
===
What is "token budget management" in a complex AI workflow?
Allocating a maximum number of tokens to each user account per month.
*Tracking and controlling token usage across all steps to prevent cost overruns.
Setting the max_tokens parameter to match the expected response length.
Compressing prompts using a tokeniser to minimise input token count.
===
What is the most cost-effective approach for handling a task that requires only simple text formatting?
Use the largest model available to ensure perfect output quality.
Use a deterministic rule-based system and avoid calling an AI model entirely.
*Use a small, fast model — simple tasks do not justify frontier model costs.
Use the frontier model with a very low max_tokens to limit cost.
===
What is "inference cost optimisation" at the infrastructure level?
Reducing the number of model layers to speed up inference computation.
Optimising the model's sampling parameters to generate fewer tokens.
Minimising the size of training data to reduce the cost of future fine-tuning runs.
*Maximising GPU utilisation through batching, quantisation, and efficient scheduling.
===
What is "usage-based pricing" vs "flat-rate pricing" for AI APIs?
*Usage-based charges per token; flat-rate charges a fixed fee regardless of consumption.
Usage-based charges per API call; flat-rate charges per model version accessed.
Usage-based scales down with volume; flat-rate charges the same regardless of scale.
Usage-based is for inference; flat-rate is for training and fine-tuning.
===
What is the primary risk of optimising for cost before establishing baseline quality?
Cost optimisations are harder to implement once the system is in production.
*You may optimise for the wrong objective if quality requirements are not yet defined.
Cheap models are less secure and introduce additional safety risks.
Cost optimisation requires retraining the model which is expensive.
===
What is "latency vs throughput" tradeoff in AI serving?
Higher throughput models produce lower latency responses by generating faster.
Latency is a user experience concern; throughput is an infrastructure concern.
Low latency and high throughput are always in conflict and cannot both be achieved.
*Low latency often requires dedicated resources that reduce utilisation; high throughput benefits from batching that increases latency.
===
What is "compute cost normalisation" when comparing AI pricing across providers?
*Converting costs to a per-token or per-1M-token basis for apples-to-apples comparison.
Adjusting for hardware differences between cloud providers when benchmarking.
Normalising model output quality scores before comparing cost-effectiveness.
Converting provider costs to a common currency for international cost comparisons.
===
What is the biggest risk of using a free tier AI API in a production system?
Free tiers use less capable model versions than paid tiers.
Free tier usage cannot be monitored or tracked for debugging.
*Rate limits and reliability SLAs are not appropriate for production workloads.
Free tier API keys expire unpredictably, causing production outages.
===
What is "data privacy" the most critical concern for in AI API integrations?
*Ensuring sensitive data sent to AI providers is not stored, used for training, or exposed.
Ensuring the AI model does not generate personally identifiable information in outputs.
Preventing users from extracting the AI provider's proprietary model weights.
Encrypting all API communications between the client and the model provider.
===
What is "output filtering" in a production AI system?
Limiting the length of model outputs to prevent context window overflow.
Filtering input prompts before they are sent to the model.
Selecting only the highest-quality outputs from multiple model generations.
*Post-processing model outputs to detect and block harmful or inappropriate content.
===
What is "zero data retention" (ZDR) in AI API contracts and when is it required?
A technical setting that prevents the model from caching previous responses.
*A contractual guarantee that the provider does not store API request/response data.
A compliance mode where the model refuses to generate any data about users.
A policy that prevents training data from being retained after a model is released.
===
What is "access control" most important for in a multi-user AI application?
Preventing users from accessing the AI system during maintenance windows.
Limiting the number of API calls each user can make per day.
*Ensuring users can only query with data and permissions appropriate to their role.
Ensuring the AI model only generates content appropriate for each user's age group.
===
What is "audit logging" in AI governance and what must it capture?
*A tamper-evident log of who queried the AI, what they asked, and what it responded.
A technical log of API errors and latency metrics for system debugging.
A training data provenance record showing where model knowledge came from.
A compliance certificate demonstrating the model meets regulatory standards.
===
What is "model security" concerned with in an AI deployment context?
Ensuring the AI model's weights are free of security vulnerabilities.
Verifying that the AI model was trained on legally compliant data.
*Preventing unauthorised access, model extraction, and adversarial manipulation of the AI system.
Protecting the AI model from being overwhelmed by high volumes of requests.
===
What is "PII detection" and why is it important in AI pipelines?
Detecting when AI outputs contain names and personal details that should be anonymised.
A compliance check that verifies model training data was PII-free.
An output filter that removes all names from AI-generated text.
*Identifying personally identifiable information in data before it is sent to AI models.
===
What is the most important governance requirement for AI use in a regulated industry?
Using only AI models that have received regulatory certification for the specific industry.
*Documented policies for AI use, output verification, and human oversight of consequential decisions.
Ensuring AI systems are built on open-source models for transparency.
Limiting AI use to tasks that have been individually approved by a compliance committee.
===
What is "rate limiting" from an API provider's perspective?
Limiting the length of model outputs to manage server resource consumption.
Throttling the speed of model generation to improve response consistency.
*Restricting the number of API requests or tokens per time period per client to ensure fair access.
Restricting which model versions a particular client tier can access.
===
What is "vendor lock-in" as a risk in AI infrastructure decisions?
*Becoming so dependent on one AI provider's proprietary features that switching is prohibitively costly.
A legal liability when using AI provider data in ways that violate their terms.
An infrastructure risk when a single provider hosts all production AI workloads.
A quality risk when a provider's model quality deteriorates after you have built on it.
===
What is the correct approach to handling model provider outages in a production AI system?
Queue all requests and retry them once the provider recovers.
*Fallback to an alternative provider or degrade gracefully to non-AI functionality.
Alert users that the AI service is temporarily unavailable and ask them to wait.
Switch to a cached version of the model running locally on application servers.
===
What is "infrastructure as code" (IaC) important for in AI deployment?
Writing the AI model's system prompt in a code-based configuration format.
Using code to generate training data for fine-tuning AI models.
Defining the AI model's architecture parameters in configuration files.
*Reproducible, version-controlled, auditable deployment of AI serving infrastructure.
===
What is the most important security practice for AI API keys in a team environment?
Sharing a master API key only with senior team members via secure messaging.
Rotating all API keys every 24 hours to prevent long-term exposure.
*Using per-service, per-environment keys with least-privilege scope and rotation policies.
Storing API keys in a shared encrypted spreadsheet accessible to the team.
===
What is "content moderation" as an infrastructure concern in AI deployments?
Manually reviewing AI-generated content before it is published to users.
*Automatically screening both inputs and outputs for harmful content at scale.
Configuring the AI model's safety settings to block certain content categories.
Limiting which users can access AI features based on age or verification status.
===
What does "AI governance" mean at the organisational level?
The technical controls that prevent AI models from taking unauthorised actions.
Compliance with specific AI regulations in the organisation's operating jurisdiction.
A committee that approves each new AI model deployment before it goes to production.
*Policies, processes, and oversight structures for responsible AI deployment and use.
===
What is a "Claude Project" and what does it enable?
A Claude API project that groups multiple fine-tuned model versions together.
*A persistent workspace with a shared system prompt and knowledge files across conversations.
A collaboration environment where multiple users share a Claude account.
A structured workflow builder that automates multi-step Claude interactions.
===
What is a "Claude Skill" and how is it different from a standard instruction?
A technical capability Claude has, like writing code or analysing images.
A tool Claude can call to access external data or APIs.
A safety setting that restricts Claude to a specific domain of responses.
*A reusable, persistent prompt configuration for a specific recurring task.
===
What does "Claude with web search" enable that Claude alone cannot do?
*Access to current information beyond the training knowledge cutoff.
Generating longer and more detailed responses on complex topics.
Producing more accurate factual responses on topics in its training data.
Performing multi-step reasoning tasks that require external verification.
===
What is "Claude Code" designed to do?
A tool for evaluating the quality and security of code that Claude generates.
A platform for fine-tuning Claude on a developer's proprietary codebase.
*An agentic coding environment where Claude can read, write, and execute code autonomously.
A lightweight Claude model optimised for faster code completion responses.
===
What is a "system prompt" in the Claude API context and what does it control?
A hidden safety layer that filters harmful content before the model sees user input.
*Persistent instructions that set Claude's role, constraints, and context for all interactions.
The initial message Claude sends to the user at the start of a conversation.
A configuration parameter that controls Claude's output format and length.
===
What is a "Claude Connector" (MCP integration) and what does it enable?
*A connection between Claude and external services, allowing Claude to read and write data.
A Claude API wrapper that simplifies authentication and request formatting.
A browser extension that allows Claude to assist with web-based tasks.
A tool for monitoring Claude API usage and tracking costs per integration.
===
What is "Claude Routines" and what problem does it solve?
A scheduling system that sends Claude reminders and time-based notifications.
A quality control process that reviews Claude's outputs before delivery.
A conversation management feature that saves and resumes long conversations.
*Automated sequences of Claude instructions that run without manual prompting each time.
===
What distinguishes "Claude for Teams" from personal Claude plans?
Access to more powerful model versions not available to individual users.
Higher message limits and faster response times for power users.
*Collaborative workspaces, admin controls, and enterprise privacy protections for organisational use.
The ability to fine-tune Claude on proprietary organisational data.
===
What does Anthropic's "Acceptable Use Policy" govern for Claude?
*The types of tasks and content Claude can be used for commercially and personally.
The technical limitations of Claude's context window and output length.
The pricing tiers and usage limits for different Claude API plans.
The data retention policies for conversations and API request logs.
===
What is "prompt engineering" in the Claude context and why does it matter?
The process of building Claude-powered applications using the Anthropic API.
A technique for reducing Claude's API costs by compressing prompts.
Training Claude on custom data to improve its performance on specific tasks.
*Designing prompts to reliably produce high-quality, well-formatted Claude outputs.
===
What is the most important difference between "operator" and "user" in the Claude API model?
Operators have access to more powerful models; users access standard model versions.
*Operators configure Claude's behaviour via system prompts; users interact within those constraints.
Operators can see all user conversations; users can only see their own conversations.
Operators pay for API usage; users access Claude through the operator's application.
===
What is "Claude's extended thinking" mode designed for?
Long documents that require extended processing time to analyse completely.
Multi-turn conversations that benefit from deeper context retention.
*Complex problems that benefit from explicit step-by-step reasoning before answering.
Creative writing tasks that require extended brainstorming before drafting.
===
What is a "Claude artifact" in the Claude.ai interface?
A persistent memory object that Claude uses to remember information across sessions.
A file attached to a conversation that Claude can read and reference.
A reusable prompt template stored in the user's Claude account.
*A standalone piece of generated content (code, document, design) displayed in a separate panel.
===
What does "model context protocol" (MCP) enable for Claude?
A protocol for Claude to maintain context across multiple separate conversations.
*A standardised way for external tools and data sources to connect to Claude.
A security standard for encrypting data sent between Claude and external services.
A format specification for structuring Claude's system prompts consistently.
===
What is the most effective use of Claude's Projects feature for a team?
*Configuring a shared project with relevant context so all team members get consistent Claude behaviour.
Creating separate projects for each team member to personalise their Claude experience.
Using projects to store conversation histories for long-term team reference.
Setting up projects to restrict which Claude features different team members can access.
===
What is the primary function of a "code assistant" AI tool?
Automatically deploying code to production environments after generation.
Replacing software developers for routine coding tasks in enterprise environments.
*Suggesting, completing, explaining, and debugging code within a development environment.
Training custom AI models on a developer's codebase for specialised generation.
===
What is "tab completion" in the context of AI code assistants?
*Accepting AI-suggested code completions with a single key press.
Auto-completing terminal commands based on the user's history.
AI filling in HTML tab attributes and indentation automatically.
A keyboard shortcut for switching between code and documentation panels.
===
What is the most important limitation of AI-generated code that developers must account for?
Generated code is always stylistically different from the developer's own code.
Generated code tends to be less efficient than hand-written code for performance-critical tasks.
Generated code cannot be run without manual review by a senior engineer.
*Generated code may be functionally wrong, insecure, or incompatible with the specific context.
===
What is "in-context learning" as it applies to code assistants?
The assistant retrains its weights on the developer's codebase during the session.
*The assistant learns the project's style and patterns from the files open in the editor.
A learning mode where the assistant improves by receiving developer corrections.
The ability of the assistant to learn new programming languages from examples.
===
What is "Cursor" as an AI development tool?
A code review tool that uses AI to identify and fix bugs before deployment.
A code generation API that integrates with existing development environments.
*An AI-native code editor built around deep AI assistance for coding tasks.
A tool for converting AI-generated pseudocode into executable code.
===
What is the most important security practice when using AI-generated code?
Only use AI-generated code in non-production environments and development branches.
Run all generated code through an AI security scanner before deployment.
Require senior engineer sign-off on all AI-generated code before merging.
*Treat every line of generated code as unreviewed third-party code and audit for vulnerabilities.
===
What is "GitHub Copilot" and what is its primary value proposition?
*An AI pair programmer integrated into VS Code that suggests code completions in real time.
A GitHub product that automatically reviews and approves pull requests using AI.
A tool that generates entire GitHub repositories from a natural language description.
An AI model trained specifically on GitHub's private codebase for internal use.
===
What is the best way to use an AI code assistant for unfamiliar codebases?
Have it rewrite the entire codebase in a more familiar style.
*Ask it to explain existing code sections before making changes.
Use it to generate tests before attempting to understand the existing code.
Ask it to identify and remove code that may be outdated.
===
What is the most common failure mode when using AI to generate unit tests?
Generated tests are too comprehensive and slow down the CI/CD pipeline.
Generated tests use deprecated testing frameworks the project doesn't use.
Generated tests cannot cover edge cases because AI doesn't understand business logic.
*Generated tests pass against the generated code without testing actual correct behaviour.
===
What is "Devin" conceptually as an AI coding tool?
A developer productivity tool that estimates time and complexity for coding tasks.
An AI-powered code review system that identifies issues in pull requests.
*An autonomous AI software engineer that plans, codes, and debugs end-to-end tasks.
A pair programming tool that observes a developer coding and offers suggestions.
===
What is the biggest risk of using AI to accelerate technical debt reduction?
Refactoring speed outpaces testing capacity, leaving gaps in test coverage.
*Generated refactored code may introduce new bugs while removing old patterns.
AI may not understand the business reasons behind legacy code patterns.
Generated code may accidentally change application behaviour while improving structure.
===
What is "code generation" vs "code assistance" in the AI tool landscape?
*Generation produces complete code from specifications; assistance augments developers writing code.
Generation works on any programming language; assistance is limited to major languages.
Generation is a batch process; assistance operates in real time during development.
Generation is more accurate than assistance because it starts from scratch.
===
What is the most appropriate use of AI for code documentation?
Replacing the need for developers to write documentation themselves.
Generating documentation that serves as the authoritative source of truth.
*Generating initial docstrings and comments that developers then review and refine.
Documenting only AI-generated code sections, leaving human code unchanged.
===
What is "Copilot for CLI" and what does it enable?
A tool for deploying Copilot-generated code through command-line CI/CD pipelines.
A CLI interface for accessing GitHub Copilot's code generation capabilities.
An AI that monitors CLI output and alerts when commands produce errors.
*AI assistance for terminal commands — explaining, generating, and debugging shell commands.
===
What is the most reliable way to evaluate an AI code assistant for a development team?
Compare benchmark scores from the assistant vendors' published documentation.
*Run a task-specific evaluation on real project work and measure quality and velocity outcomes.
Survey developers on their subjective preference after a two-week trial.
Measure the number of code suggestions accepted versus rejected over 30 days.
===
What is a "no-code AI builder" and what type of user does it serve?
*A visual tool for building AI-powered applications without writing code.
A simplified version of Claude designed for users with no AI experience.
A tool that generates code automatically so developers never need to write it.
A drag-and-drop interface for assembling pre-built AI models into pipelines.
===
What is "N8N" and what does it enable in an AI workflow context?
A no-code platform specifically for building AI chatbots and conversational agents.
A vector database optimised for storing N8N workflow configuration data.
*An open-source workflow automation tool that connects AI and non-AI services.
A Claude-specific workflow builder maintained by Anthropic for enterprise users.
===
What is "Zapier" commonly used for in AI-enabled business workflows?
Building AI models from business data without requiring machine learning expertise.
*Connecting AI tools with other business applications through trigger-action automations.
A Claude-certified integration platform for enterprise AI deployments.
A workflow orchestration tool for managing multi-agent AI systems.
===
What is "Make" (formerly Integromat) and how does it differ from Zapier?
A code generation tool that produces Zapier workflows from natural language descriptions.
An AI model training platform that creates custom models from business data.
A project management tool with AI-powered task prioritisation and scheduling.
*A visual workflow automation platform with more complex branching logic than Zapier.
===
What is "Lovable" (formerly GPT Engineer) as a tool?
*A no-code AI app builder that generates full-stack web applications from text descriptions.
A fine-tuning platform that makes AI models more lovable by improving their personality.
A prompt engineering tool that generates optimised prompts for different AI models.
A customer feedback tool that helps product teams build AI features users love.
===
What is the primary limitation of no-code AI tools compared to coded implementations?
They are slower to build with than hand-coding the same functionality.
*They offer less control over complex logic, error handling, and system integration.
They cannot connect to enterprise APIs and databases.
They produce lower quality AI outputs because they use simpler models.
===
What is "Airtable with AI" and what workflow does it enable?
An AI model training platform that uses Airtable data to fine-tune language models.
A document management system with AI search and summarisation capabilities.
A project management tool that uses AI to assign tasks to team members.
*A structured database with AI-powered automation for enriching and acting on data.
===
What is "Replit" and how is it used for AI-enabled development?
A no-code platform for deploying pre-built AI models to production.
A tool for converting AI-generated code into deployable applications automatically.
*A browser-based coding environment with integrated AI assistance and instant deployment.
A code review platform that uses AI to ensure quality before deployment.
===
What is the most important consideration when choosing between Zapier and custom code for an AI workflow?
Cost — Zapier subscriptions are more expensive than equivalent server infrastructure.
*Complexity, maintainability needs, and whether the use case fits standard trigger-action patterns.
Speed of development — custom code is always faster to build for simple use cases.
Security — custom code is always more secure than third-party automation platforms.
===
What is "NotebookLM" and what is its primary use case?
*A Google AI tool for synthesising and conversing with uploaded documents.
An AI-powered Jupyter notebook that generates and executes data science code.
A tool for documenting and explaining AI workflows built with other no-code tools.
A Google Workspace integration that adds AI assistance to Google Docs.
===
What is "Perplexity AI" best described as?
An AI writing assistant optimised for perplexing or counterintuitive content.
A research tool for evaluating and comparing the perplexity scores of different AI models.
*An AI-powered search engine that answers questions with cited sources.
A conversational AI trained specifically for academic research and citation.
===
What is the best use case for a no-code AI tool in a professional workflow?
Building complex AI applications with custom business logic and integrations.
Replacing software development entirely for AI-enabled product features.
Running large-scale AI model fine-tuning on proprietary company data.
*Automating high-volume, repetitive AI tasks that follow a consistent pattern.
===
What is the most important governance consideration when deploying no-code AI automations in a company?
Verifying that the no-code platform is ISO 27001 certified for enterprise use.
*Ensuring automated AI actions are reviewed and authorised by appropriate stakeholders.
Confirming the no-code tool uses the same AI model as the company's other AI tools.
Ensuring all automation workflows are documented in a central workflow registry.
===
What is "Gamma" and what does it produce?
A GitHub integration tool that uses AI to automate pull request reviews.
A code generation tool from Google that produces Python scripts from descriptions.
*An AI-powered presentation tool that generates polished slide decks from text.
An AI model evaluation platform for comparing presentation-quality outputs.
===
What is the primary difference between workflow automation tools (Zapier, N8N) and agentic AI systems?
*Workflow tools follow fixed predetermined paths; agents dynamically decide next steps.
Workflow tools are cheaper to run; agents use more compute per task.
Workflow tools work with structured data; agents work with unstructured text.
Workflow tools are synchronous; agents are always asynchronous.
===
What is a "multimodal" AI model?
A model that combines multiple training methodologies for improved performance.
A model that operates across multiple deployment environments simultaneously.
A model that can be accessed through multiple API interfaces.
*A model that can process and generate multiple content types such as text, images, and audio.
===
What is "vision capability" in a language model and what does it enable?
The ability to generate images from text descriptions.
*The ability to analyse and reason about images provided as input.
The ability to process video files and extract relevant information.
The ability to render visual outputs like charts and diagrams.
===
What is the most important limitation of AI vision models when processing documents?
Vision models can only process one page at a time, not multi-page documents.
Vision models cannot reason about numerical data presented in tables.
*OCR accuracy degrades with poor image quality, unusual fonts, or complex layouts.
Vision models require images to be in PNG format to achieve accurate text extraction.
===
What is "text-to-image" generation and which tools are most commonly used?
*Generating images from text descriptions using diffusion models like Midjourney and DALL-E.
Converting text documents into visual infographics using AI layout tools.
Generating text captions for existing images using vision language models.
Converting text-based code into visual diagram representations.
===
What is "speech-to-text" (STT) and what are its most common production applications?
Generating realistic speech audio from text using AI voice synthesis.
Converting handwritten text captured by a device's microphone to digital text.
A search technique that queries databases using voice commands rather than typing.
*Converting spoken audio to written text — used in transcription, voice interfaces, and captioning.
===
What is "Whisper" in the AI tool landscape?
Anthropic's tool for generating low-volume, subtle AI content moderation signals.
A browser-based tool for private, end-to-end encrypted conversations with Claude.
*OpenAI's open-source speech recognition model for transcribing audio.
A voice synthesis model that generates human-sounding speech from text.
===
What is "text-to-speech" (TTS) and when is it most appropriate to use AI TTS?
*Converting written text to synthesised spoken audio — appropriate for scalable voice content.
Converting spoken audio to text using AI transcription models.
An AI capability that speaks responses aloud in real time during a conversation.
A tool for matching AI-generated voice to a specific person's voice characteristics.
===
What is the most important consideration when deploying AI vision in a compliance-sensitive document workflow?
Whether the vision model can process the company's proprietary file formats.
*Whether the OCR accuracy is sufficient for the document types and consequences of extraction errors.
Whether the AI vision tool has been trained on similar document types.
Whether the vision model supports batch processing for high-volume document intake.
===
What is "video AI" and what are its emerging production use cases?
A category of AI tools for generating realistic synthetic video from text descriptions.
The application of computer vision to optimise video streaming quality and compression.
*AI applied to video for analysis, summarisation, and content understanding at scale.
AI tools that assist video editors with timeline management and color correction.
===
What is the primary risk when using AI-generated images in commercial contexts?
Generated images are always lower resolution than photography for professional use.
AI image styles are recognisable and may reduce brand authenticity.
Generated images cannot be used in print because they lack sufficient metadata.
*Copyright and licensing issues with training data or generated outputs resembling existing works.
===
What is the most accurate description of current "AI video generation" capability?
*Short clip generation from text or image prompts — improving rapidly but still limited in length and consistency.
Full-length film and commercial production from natural language scripts.
Video editing automation that applies AI enhancements to existing footage.
Real-time video generation that produces content as events unfold.
===
What is "document AI" and what workflows does it enable?
An AI model trained specifically on legal, financial, and technical documents.
*AI for extracting, classifying, and routing information from documents at scale.
A document management system that uses AI search for knowledge retrieval.
Tools that convert AI model outputs into formatted business documents.
===
What is the most important quality metric for an AI transcription tool in a business context?
Transcription speed compared to the real-time playback speed of the audio.
The number of languages the tool can transcribe simultaneously.
The model's benchmark performance on standard transcription datasets.
*Word error rate (WER) on the specific audio conditions the tool will encounter in production.
===
What is the key difference between "vision" models and "image generation" models?
*Vision models analyse existing images; generation models create new images from text.
Vision models are used for surveillance; generation models are used for creative work.
Vision models process real photographs; generation models work only with synthetic images.
Vision models require more compute per inference; generation models are faster.
===
What is the most appropriate multimodal AI tool for a team that processes thousands of invoices daily?
A general-purpose vision model accessed via API for each invoice individually.
A manual review workflow augmented by an AI chatbot for difficult cases only.
*A document AI solution specifically designed for invoice data extraction at scale.
A fine-tuned text model that processes invoice data exported to CSV format.
===
You need to automate sending a daily summary email based on data from a CRM and a spreadsheet. The most appropriate tool is:
*A no-code workflow tool like Zapier or N8N that connects the CRM, spreadsheet, and email.
A custom Python script deployed as a serverless function.
Claude with an MCP connector to all three services.
A specialised email marketing platform with database integrations.
===
A team wants to build an AI tool for employees to ask questions about internal policy documents. The correct architecture is:
Fine-tune Claude on the policy documents so it learns the specific policies.
Build a keyword search over the documents and use Claude to format search results.
Use Claude directly without any additional setup — it can answer general policy questions from training.
*RAG: index policy documents in a vector database and use Claude to answer questions from retrieved context.
===
A non-technical founder wants to build a prototype product with AI features in a weekend. The most appropriate starting point is:
The Claude API with a Python backend and React frontend.
*A no-code builder like Lovable or Replit with AI assistance.
A template from a software agency that they customise for their use case.
A pre-built SaaS product and abandon the idea of a custom AI feature.
===
A company wants to add AI assistance to their customer support. The first step before choosing any tool is:
Selecting the AI tool with the highest customer satisfaction ratings.
Piloting the largest, most capable AI model to see what is possible.
*Defining what specific support tasks AI should handle and what remains with humans.
Calculating cost savings from AI replacing human agents before evaluating options.
===
You are evaluating AI transcription tools for recording team meetings. The most important evaluation criterion is:
*Accuracy on real team meeting audio with the team's specific vocabulary and accents.
The number of speakers the tool can differentiate in the transcript.
Integration with the video conferencing platform the team uses.
The speed at which transcripts are delivered after meetings end.
===
Which AI tool is most appropriate for a marketing team that needs to consistently generate on-brand social media posts at scale?
A fine-tuned version of Claude trained on previous on-brand social posts.
A dedicated social media AI tool from a specialist marketing AI vendor.
*Claude with a detailed brand voice system prompt and a template for each post type.
Midjourney for visuals combined with Claude for caption copy separately.
===
What is the correct tool for a developer who needs to quickly understand a large, unfamiliar codebase?
GitHub Copilot tab completion as they read through the files.
A no-code tool that visualises code structure and dependencies automatically.
Ask Claude to explain the codebase from a brief description they provide.
*Claude Code or a similar AI coding assistant with full codebase access.
===
A small business owner wants to automate sending personalised follow-up emails after customer purchases. Which approach is most appropriate?
Hiring a developer to build a custom email automation system with AI integration.
*A no-code workflow tool connecting the e-commerce platform to an email service with AI personalisation.
Using Claude directly in a browser to manually draft follow-up emails one at a time.
Purchasing a dedicated AI email marketing platform and migrating all email workflows.
===
What is the most important question to ask before integrating a third-party AI tool into a workflow that processes customer data?
"Is this the most accurate AI tool available for this specific task?"
"Does this tool integrate natively with our existing software stack?"
*"How does this tool handle, store, and process our customers' data?"
"What is the per-user cost of this tool at our customer volume?"
===
A developer needs to choose between Zapier and N8N for a workflow automation project. The most important differentiating factor is:
*Complexity and control requirements — N8N offers more flexibility; Zapier is simpler to use.
Cost — N8N is always cheaper because it is open source.
Accuracy — Zapier uses more reliable connectors than N8N.
Speed — N8N executes workflows faster due to its self-hosted architecture.
===
You are recommending AI tools to a professional services firm. The most important first question is:
"What is your budget for AI tool subscriptions?"
*"What specific problems or bottlenecks in your work do you want AI to address?"
"Do you have a technical team who can implement AI tools?"
"Which AI tools are your competitors already using?"
===
What is the most appropriate use of Midjourney or DALL-E in a content production workflow?
Replacing professional photography for all commercial marketing assets.
Producing final publication-ready visuals without designer involvement.
Generating brand guidelines and visual identity systems from text descriptions.
*Generating visual concepts and initial images that a designer then refines.
===
What is the correct way to evaluate whether an AI writing tool fits a marketing team's needs?
Check the tool's performance on standard creative writing benchmarks.
Ask the vendor for customer case studies from comparable companies.
*Run a controlled trial generating real marketing content and have the team rate quality and brand fit.
Compare the tool's pricing to other AI writing tools in the same category.
===
A company wants to build an internal AI knowledge base tool. The riskiest approach is:
Building a RAG system that retrieves and cites specific internal documents.
*Deploying a general-purpose chatbot without grounding it in the company's actual documents.
Using Claude with company documents as context in a controlled internal environment.
Starting with a pilot deployment limited to a small group of internal users.
===
Menler's AI Tools Ecosystem bank is designed to test what capability?
Technical knowledge of how each AI tool is built and what algorithms it uses.
Sales capability for recommending AI tools to clients and prospects.
Development skills for integrating multiple AI tools into production systems.
*Practical judgment in selecting and using the right AI tool for each professional situation.
===
What is the most reliable signal that an AI output is high quality?
The output is fluent, grammatically correct, and well-structured.
*Specific claims are traceable to verifiable sources or logical derivations.
The output is longer and more detailed than what was requested.
The model expressed high confidence throughout the response.
===
What does "output calibration" mean in professional AI use?
Adjusting the AI model's temperature and sampling settings for each task.
Running AI outputs through a secondary model to score their quality.
Calibrating output length to match the expected format for each task type.
*Developing accurate judgment about where AI outputs are reliable versus where they fail.
===
You receive an AI output that answers a question you did not ask while ignoring the one you did. The cause is:
*The prompt was ambiguous enough that the model interpreted a different question.
The model lacked the knowledge to answer the intended question.
The model's safety filters redirected the response to a safer topic.
The model exceeded its context window before processing the full question.
===
What distinguishes a "correct" AI output from a "useful" one?
Correct outputs are longer and more complete; useful outputs are shorter and actionable.
Correct outputs are verifiable; useful outputs are those the user decides to act on.
*Correctness means factually accurate; usefulness means relevant to the actual task need.
There is no meaningful distinction — correct outputs are always useful.
===
What is the most effective quality control step for AI-generated reports before distribution?
Running a grammar and spell-check tool to catch surface errors.
*Human expert review of all specific claims, figures, and recommendations.
Asking the AI to review its own report for accuracy before finalising.
Comparing the report structure against a template for format compliance.
===
What is "fluency illusion" in AI output evaluation?
*Well-written text gives readers false confidence that the content is accurate.
AI outputs that use complex vocabulary to obscure simple concepts.
The experience of reading AI text as if a human wrote it.
The tendency for AI to repeat fluency-related phrases in different contexts.
===
What is the most important dimension to evaluate in an AI output for a professional client deliverable?
Length and detail appropriate for the client's seniority level.
Brand voice consistency with the organisation's communication standards.
Completeness — covering all aspects of the topic without omissions.
*Factual accuracy of specific claims that will inform client decisions.
===
What does "output specificity" indicate about AI quality on knowledge tasks?
Specific outputs are always more accurate because they demonstrate depth of knowledge.
Specific outputs indicate the model has retrieved relevant information from the web.
*Specific, concrete outputs are higher risk for error than general summaries.
Output specificity is independent of accuracy and provides no quality signal.
===
A colleague says "the AI output looks great, let's use it." What is missing from this evaluation?
*Assessment of whether the content is factually accurate, not just whether it looks good.
A review of the output's length and format relative to the intended audience.
Comparison with a human-written version to assess relative quality.
A review of the prompt used to generate the output for quality issues.
===
What is the most common quality failure in AI-generated marketing copy?
Grammar errors that undermine the professional appearance of the copy.
Excessive length that exceeds the intended word count or format requirements.
Overly promotional language that violates advertising standards.
*Generic, pattern-following content that lacks the specific voice and differentiation of the brand.
===
What is the correct response when an AI output is good enough for one part of the task but wrong for another?
Reject the entire output and regenerate from scratch.
*Use the good parts as-is and fix the wrong parts yourself.
Ask the AI to fix the wrong parts by identifying them in a follow-up prompt.
Average the two parts together to produce a balanced acceptable output.
===
What is the best indicator that an AI output has been appropriately personalised for a specific audience?
It is shorter and more direct than a general-purpose response would be.
It avoids technical jargon that might confuse a non-expert audience.
*It references specific context, terminology, and concerns relevant to that audience.
It was generated using a role prompt specific to the target audience.
===
What is "output drift" in a multi-step AI task?
The model's output quality decreasing as the context window fills.
Inconsistency in output style between different sections of a long document.
The model taking longer per output token as context length increases.
*The AI progressively deviates from the original brief as the task proceeds.
===
What is the most important thing to check when comparing two AI outputs on the same task?
Which output is longer, as length often correlates with thoroughness.
*Which output better fulfils the actual task objective, not just which reads better.
Which output uses more varied vocabulary and sentence structures.
Which output was generated with the higher temperature setting.
===
What is the most appropriate quality standard for AI-generated content used in training materials?
*Every factual claim must be accurate, as learners will treat training content as authoritative.
The content must be engaging and accessible, as these are the primary goals of training.
The content must pass AI detection tools to ensure it does not appear AI-generated.
The content must be reviewed by the L&D team for format and length compliance.
===
What is "hallucination" in a language model?
The model seeing patterns or meanings that are not present in the input.
A failure mode where the model refuses to answer factual questions.
*Generating text that is confident and plausible but factually incorrect.
Generating repetitive or looping text that does not converge to an answer.
===
Why is hallucination a structural property of language models rather than a fixable bug?
*Models predict statistically probable text, which can produce plausible-sounding errors.
Hallucination is caused by insufficient training data and grows less common with more data.
Hallucination is a deliberate design choice to make models more creative.
Hallucination occurs only when models are asked questions outside their training domain.
===
What is the most reliable method for detecting hallucination in an AI output?
Running the output through a second AI model for cross-validation.
Asking the AI to rate its own confidence on each claim in the output.
Checking whether the output is internally consistent and logically coherent.
*Tracing every specific claim to a verifiable primary source.
===
An AI output cites a specific academic paper with author names, journal, and year. What should you do before using this citation?
Use the citation as-is — AI cites sources accurately when provided with a reference.
*Search for and verify the actual paper exists and says what the AI claims.
Add a note that the citation was AI-generated for full transparency.
Ask the AI to confirm the citation is correct by re-checking its training data.
===
What is "confabulation" and how is it related to hallucination?
Confabulation refers to AI-generated content that confuses different topics into one answer.
Confabulation is a more severe form of hallucination where the model invents entire narratives.
*Confabulation is producing false memories with confidence — hallucination is the AI equivalent.
Confabulation is the technical term for hallucination in medical AI contexts.
===
What is the highest-risk task type for AI hallucination?
Generating creative fiction where facts do not need to be accurate.
Summarising a long document provided directly in the context.
Reformatting data from one structured format to another.
*Generating specific, verifiable details like dates, statistics, people, and citations.
===
What is the correct way to prompt Claude to reduce hallucination risk on factual questions?
*Instruct Claude to acknowledge uncertainty and cite its reasoning rather than assert facts confidently.
Use a higher temperature to make Claude more creative and less likely to commit to wrong facts.
Ask Claude to provide three possible answers and select the most common one.
Provide Claude with a specific factual question and ask for the single most accurate answer.
===
What is "grounding" as a mitigation for hallucination?
Adding a factual accuracy disclaimer to all AI-generated outputs.
*Providing the model with source documents to reason from rather than generating from training memory.
Training the model on larger and higher-quality datasets to reduce errors.
Using retrieval-augmented generation to supplement the model's knowledge cutoff.
===
A developer finds that adding "check your work" to a prompt reduces errors. Why does this work?
It signals to the model that the task requires higher accuracy and changes the generation weights.
It triggers a different model pathway designed for accuracy-critical tasks.
It doubles the effective context the model uses by prompting it to re-read the input.
*The instruction activates a self-review step that catches some generation errors.
===
What is the "verification habit" and why is it the most important AI skill for professionals?
Asking the AI to verify its own outputs before accepting them as final.
Running all AI outputs through a third-party fact-checking service.
*Systematically checking AI-generated claims against primary sources before acting on them.
Having a second team member review all AI-generated content before use.
===
What does "source attribution" mean in an AI output context, and why is it insufficient on its own?
Attribution identifies who is responsible for the information in the output.
*Citing a source does not guarantee the source exists or says what the AI claims.
Source attribution is a copyright requirement for AI-generated content.
Attribution is sufficient if the source cited is a peer-reviewed academic journal.
===
You are using AI to write a report on a competitor's market position. Which facts must you independently verify?
*All specific claims about the competitor's products, market share, revenue, and strategy.
Only the financial figures, since these are the most commonly hallucinated.
Only claims that conflict with your prior understanding of the competitor.
No verification is needed if the AI was given accurate web search results to work from.
===
What is the most important principle for professional use of AI outputs in high-stakes contexts?
Always disclose that AI was used to produce any professional output.
Only use AI for tasks where errors are immediately obvious and easily corrected.
*Never use an AI output for a consequential decision without verifying the critical facts.
Always have a second AI model cross-check the first model's output before use.
===
What is the most reliable indicator that an AI output is low risk for hallucination?
The output is shorter, as shorter outputs have fewer opportunities for error.
The model expressed appropriate uncertainty about some claims in the output.
The task topic is well-represented in the model's training data.
*The task is structural or logical rather than factual — formatting, calculation, or reasoning.
===
What is the most important thing a professional learns from consistently applying the verification habit?
A comprehensive list of AI output types that are reliably accurate.
*A calibrated sense of which AI output types need more versus less verification.
The ability to identify hallucinations by reading style and tone alone.
Confidence that AI outputs are reliable enough for most professional tasks.
===
What is the single most impactful element to add to a vague prompt to improve AI output quality?
*A specific description of what the output should look like when done well.
A longer, more detailed description of the topic to give the AI more context.
Instructions for the AI to "think carefully" before responding.
A request for the AI to ask clarifying questions before answering.
===
When should you use a "role prompt" (e.g., "act as a senior editor")?
When you want the model to take on a persona and maintain it throughout the conversation.
When you need the model to use domain-specific terminology in its responses.
*When the desired output benefits from a specific professional perspective or expertise level.
When you want to prevent the model from including caveats and qualifications.
===
What is the most effective way to get a consistently structured output format from Claude?
Use the phrase "always follow this format" in the system prompt.
*Provide the exact template or schema you want in the prompt, ideally with an example.
Ask Claude to generate the format itself before producing the content.
Specify the desired format in general terms at the end of the prompt.
===
What is "negative prompting" and when is it useful?
Providing examples of bad outputs to help the model recognise what not to produce.
Using a critical, evaluative tone in the prompt to encourage higher-quality responses.
Removing positive examples from the prompt to force more creative outputs.
*Explicitly telling the model what to avoid in its output to prevent specific failure modes.
===
What does "few-shot prompting" mean and why does it work?
*Providing example input-output pairs in the prompt that demonstrate the desired behaviour.
Running the same prompt multiple times and selecting the best few outputs.
Starting with a short, minimal prompt and adding detail until the output improves.
Using only a few essential instructions rather than a long, complex prompt.
===
When is it better to use multiple simple prompts in sequence rather than one complex prompt?
When you want to reduce API costs by keeping each individual call shorter.
*When the task has distinct stages that each benefit from focused, undivided attention.
When the task requires real-time user input at intermediate stages.
Always — multiple simple prompts are always more reliable than one complex prompt.
===
What is the most common mistake people make when writing their first serious prompts?
Making the prompt too long and overloading the model with irrelevant context.
Using too formal a tone that makes the model produce overly academic responses.
Not including enough examples for the model to understand the task.
*Being too vague about what they want and expecting the model to infer the specifics.
===
What is the most reliable way to improve AI output quality through iteration?
Regenerate the output with higher temperature to introduce variation.
Add more context about the background and topic to the original prompt.
*Identify the specific element that fell short and give targeted correction instructions.
Ask the model to rate its own output and improve the lowest-rated elements.
===
What is "context injection" and why does it improve prompting outcomes?
Injecting the user's previous conversation history to maintain continuity.
*Adding task-specific context that Claude lacks from training to make outputs more relevant.
Providing real-time data through a web search tool to update Claude's knowledge.
Adding the user's identity information so Claude can personalise responses.
===
What is the most important thing to consider when deciding how much context to include in a prompt?
*Whether each piece of context actually affects the output — remove context that does not.
Including as much context as possible to ensure the model has everything it needs.
Keeping context under 500 words to prevent the model from being distracted.
Matching context volume to the model's context window to maximise performance.
===
What is the difference between a "system prompt" and a "user prompt" in terms of prompting strategy?
System prompts are longer and more detailed; user prompts are shorter and direct.
System prompts are for operators; user prompts are only for end users.
*System prompts set persistent context and role; user prompts specify the immediate task.
System prompts define format; user prompts define the topic to cover.
===
What is "prompt sensitivity" and why does it matter for production systems?
The degree to which a prompt activates the model's safety filters.
The length threshold above which longer prompts stop improving output quality.
A model's tendency to generate different outputs to the same prompt across sessions.
*Small changes in prompt wording can significantly change output quality or behaviour.
===
What is the most important test to run when deploying a prompt in a production system?
Testing with the same input 10 times to measure output consistency.
*Testing with real and adversarial user inputs to identify edge cases and failure modes.
Testing with the ideal example input to confirm the prompt works correctly.
Testing API latency to ensure the prompt length does not cause timeouts.
===
What is the best way to evaluate whether a prompt change improved or degraded output quality?
Use the new prompt for a week in production and see if user complaints decrease.
Ask Claude to compare its outputs from both prompt versions and judge which is better.
*Run both prompt versions on the same test set and compare outputs systematically.
Check whether the new prompt produces longer, more detailed outputs.
===
What is the most important principle for prompt design in a product used by non-technical users?
*The prompt must produce high-quality outputs even when user inputs are vague or unusual.
The prompt must be short enough that users can read and understand it themselves.
The prompt must prevent users from changing Claude's behaviour through their messages.
The prompt must include example queries that users can copy and adapt.
===
What is the most common reason AI fails at tasks it seemed capable of during testing?
The model degrades when used at high volume due to server load.
Users communicate less clearly in production than in controlled testing.
The model's capabilities diminish as the conversation grows longer.
*Production inputs are more diverse and edge-case-rich than test inputs.
===
What is the most dangerous failure mode in AI-assisted decision support?
The AI produces too many options, creating decision paralysis for the user.
*The AI confidently produces wrong recommendations that the decision-maker accepts without review.
The AI refuses to make a recommendation on high-stakes decisions.
The AI makes different recommendations on the same situation across sessions.
===
What is "specification gaming" as an AI failure mode?
The AI interprets an ambiguous specification too literally and produces wrong output.
The AI fails to follow a specification it was given in the system prompt.
*The AI achieves the specified metric while violating the underlying intent.
The AI produces outputs that technically meet the specification but are of poor quality.
===
What is "automation bias" and how does it affect AI-assisted professional work?
*The tendency to trust and accept AI outputs without applying sufficient critical review.
The tendency to prefer automated processes over manual ones regardless of quality.
The AI model's tendency to produce outputs consistent with its training biases.
A systematic error introduced when AI automates tasks with inherent bias.
===
What is the most appropriate response when an AI makes a factual error in a professional context?
Discard all AI use on this task type to prevent future errors.
Ask the AI to regenerate the response with a request to be more accurate.
Report the error to the AI provider as a model defect to be fixed.
*Correct the specific error and assess whether it indicates a pattern requiring systematic changes.
===
What is "brittleness" in AI systems and when does it most commonly appear?
When the AI system is fragile and frequently produces error messages or crashes.
When the model performs well in testing but deteriorates quickly after deployment.
*When small changes in input produce unexpectedly large changes in output quality.
When the model's outputs are correct but structured incorrectly for downstream use.
===
What is "task decomposition failure" in an AI workflow?
*The AI misidentifies how to break a complex task into manageable subtasks.
The workflow breaks down because the context window cannot hold all subtasks.
The AI fails to complete tasks because it is given too many subtasks at once.
A failure where one agent's task decomposition conflicts with another agent's.
===
What is the most important diagnostic question when an AI workflow produces wrong outputs?
"Did the AI model produce lower-quality outputs than in our initial testing?"
*"Which specific step in the workflow produced the error that propagated to the output?"
"Did the user input contain errors that the AI then replicated in the output?"
"Was the context window too small for the volume of information processed?"
===
What is "overconfident failure" as a unique risk in AI systems?
The AI overestimates how complex a task is and over-engineers its response.
The AI refuses tasks within its capability because it underestimates its own ability.
*AI expresses high confidence on outputs that are actually wrong or uncertain.
A failure where confident AI use leads organisations to reduce human expertise.
===
What is the most reliable way to identify systematic AI failure patterns in production?
Surveying users about whether they were satisfied with AI outputs.
Comparing production output error rates to model benchmark accuracy scores.
Running periodic A/B tests with human-generated outputs as the control condition.
*Tracking error types and correlating them with input characteristics and task types.
===
What is the most important human capability that must not be lost even with advanced AI assistance?
*The ability to critically evaluate outputs and make final judgments independently.
The ability to perform tasks manually without AI assistance when systems fail.
The ability to write effective prompts to extract value from AI systems.
The ability to explain AI behaviour to non-technical stakeholders.
===
What is the most common reason AI underperforms on specialised professional tasks?
The model applies excessive safety filtering on professional domain content.
*Training data underrepresents the specific domain, reducing pattern quality for those tasks.
Professional tasks require real-time data that exceeds the model's knowledge cutoff.
The model cannot distinguish between professional and general user queries.
===
What is "model collapse" risk in a multi-model pipeline?
Multiple model calls on the same data produce contradictory outputs that cannot be resolved.
The pipeline fails when any single model call errors out, halting the entire workflow.
Individual models produce lower quality outputs when called from a pipeline than directly.
*Errors propagate and compound through the pipeline, producing increasingly wrong outputs.
===
What is the most important pre-deployment test for an AI system that will make consequential recommendations?
*Testing on adversarial inputs designed to find recommendations that are dangerously wrong.
Testing the system's recommendation quality against human expert baseline scores.
Testing the system's latency under the expected production request volume.
Testing whether the system correctly declines requests outside its competence scope.
===
What is the most important thing an organisation should do after an AI system causes a significant error?
Disable AI use for that task type until a better model is available.
Disclose the error to all affected stakeholders and offer remediation.
*Conduct a root cause analysis and implement systematic prevention measures.
Report the failure to the AI model provider for model improvement.
===
Who is accountable for the consequences of an AI-generated output used in a professional decision?
*The professional who used the AI output and chose to act on it.
The AI provider who created the model that generated the output.
The organisation that deployed the AI tool used in the workflow.
Accountability is shared between the AI provider and the user in proportion to their role.
===
What is the most important disclosure consideration when submitting AI-assisted professional work?
Always disclosing AI use in all professional work, regardless of context.
Disclosing only when AI generated more than 50% of the final output.
Not disclosing AI use since it is now standard practice and assumed.
*Whether the context requires disclosure and what level of disclosure is appropriate.
===
A professional submits AI-generated work to a client as their own analysis. The client makes a wrong decision based on AI hallucinations in the work. What is the professional's primary responsibility?
To notify the AI provider of the hallucination so the model can be improved.
*To own the consequences — they verified the AI output insufficiently before submission.
To share responsibility with the AI tool since it generated the wrong content.
To disclose to the client that AI was used so they can make their own assessment.
===
What is the most important principle for maintaining professional integrity when using AI?
Disclose AI use consistently to all clients and stakeholders.
Only use AI for tasks where errors are immediately obvious and inconsequential.
*Own every output fully — verify, understand, and be able to defend every claim.
Use AI only for tasks explicitly approved by your professional body or employer.
===
What is "deskilling risk" in the context of professional AI use?
*Relying on AI so heavily that core professional skills atrophy from disuse.
The risk of hiring less-skilled professionals because AI reduces skill requirements.
The risk of AI errors causing professionals to make decisions below their normal skill level.
The demotion of skilled professionals who resist AI adoption in their organisations.
===
What is the correct response when a client asks you to use AI to do something you are not confident it can do reliably?
Use AI anyway and review the output carefully to catch errors.
Decline the task entirely to avoid professional risk.
*Be transparent about AI's limitations for this task and propose an approach with appropriate human judgment.
Charge more to compensate for the additional verification time required.
===
What is the most important thing to understand about AI and professional liability?
AI providers carry partial liability for model errors that cause client harm.
Professional liability is reduced when AI is used, since errors are the tool's fault.
Professional liability applies only when AI is used without human review.
*AI use does not transfer professional liability — the professional remains fully accountable.
===
What is "professional judgment" in the context of AI-assisted work?
A licensed professional's ability to produce work without any AI assistance.
*The human expert's capacity to direct AI appropriately and evaluate its outputs critically.
The certification that a professional has received AI literacy training.
The right of a professional to choose whether or not to use AI tools.
===
What is the most important way AI changes professional development requirements?
Professionals can now develop expertise more quickly because AI speeds learning.
Domain expertise becomes less important as AI can supply domain knowledge on demand.
*Professionals must develop critical evaluation skills alongside domain expertise.
Professional development should focus on AI skills rather than core domain skills.
===
What is the correct professional response when AI produces an output that contradicts your domain expertise?
*Investigate carefully — the AI may have found something you missed, or it may be wrong.
Trust your expertise — it is always more reliable than AI pattern-matching.
Trust the AI — it has processed more information on the topic than you have.
Present both the AI output and your expert view and let the client decide.
===
What is the most important governance requirement for AI use in a regulated profession?
Regulatory approval for each AI tool used in professional practice.
*Documented processes showing how AI outputs are verified before professional use.
Client consent before any AI tool is used in delivering professional services.
A dedicated AI compliance officer who reviews all AI-generated professional work.
===
What is "AI washing" in a professional context and why is it problematic?
Adding unnecessary AI features to products to appear more technologically advanced.
Over-claiming AI capabilities to win business that the AI cannot actually deliver.
Using AI branding on content to attract attention and signal modernity.
*Claiming AI-generated work as purely human-generated to meet expectations or avoid disclosure.
===
A junior team member asks whether they should use AI for everything to maximise productivity. The most accurate guidance is:
Use AI for everything — productivity gains always outweigh any quality concerns.
Avoid AI until you have mastered the underlying skills independently.
*Use AI where it genuinely helps and exercise judgment to develop your own skills alongside AI.
Use AI only for tasks that have been approved by the team lead for AI use.
===
What is the most important quality a professional needs to use AI responsibly in the long term?
Technical understanding of how AI models work at the architecture level.
*Intellectual honesty about what AI can and cannot do, and when its outputs should not be trusted.
Comprehensive awareness of all available AI tools and their respective capabilities.
A consistent record of disclosing AI use to all professional stakeholders.
===
Menler's AI Judgment bank tests practitioners at what level of professional maturity?
Those learning about AI for the first time and exploring its basic capabilities.
Those building AI systems and models who need to evaluate their own outputs.
Those managing AI teams and evaluating which AI tools to invest in.
*Those who must make independent, accountable decisions about AI use in their professional work.
===
What is the core mechanism that allows transformer models to weigh the relevance of different parts of an input when producing an output?
Recurrent processing, which reads tokens one at a time and updates a hidden state.
*Self-attention, which computes relationships between all token positions simultaneously.
Convolutional filters, which detect local patterns across fixed-size windows.
Hard-coded routing tables that assign each token to a specialist sub-network.
===
Why did transformers largely replace RNNs for language modelling tasks?
Transformers use less memory per token because they compress sequences into a single vector.
Transformers are deterministic, so they always produce the same output for the same input.
Transformers were designed specifically for text, whereas RNNs were designed for time-series data.
*Transformers process all tokens in parallel, making training faster and avoiding the vanishing gradient problem.
===
In a transformer, what does the feed-forward layer do after the attention layer?
*It applies a non-linear transformation independently to each token position.
It re-orders the token sequence based on predicted importance scores.
It compresses the full sequence into a single context vector.
It retrieves relevant facts from an external knowledge base.
===
What does the term "parameters" refer to in a large language model?
The configuration settings a developer passes to the model at runtime.
The number of tokens the model can process in a single call.
*The learned numerical weights that determine how the model transforms inputs into outputs.
The hyperparameters used during training such as learning rate and batch size.
===
What is the role of positional encoding in a transformer?
It encodes the semantic meaning of each token into a fixed numerical vector.
*It injects information about the order of tokens, since attention itself is position-agnostic.
It determines which tokens are masked during the training process.
It compresses the full input sequence into a lower-dimensional representation.
===
What distinguishes a decoder-only transformer (like GPT-style models) from an encoder-decoder transformer (like T5)?
*Decoder-only models generate text autoregressively; encoder-decoder models encode an input first, then decode to a target sequence.
Decoder-only models can only answer questions; encoder-decoder models can generate free-form text.
Decoder-only models are smaller and faster; encoder-decoder models are larger and more accurate.
Decoder-only models require fine-tuning for every task; encoder-decoder models work zero-shot.
===
What is "causal masking" in a decoder-only transformer?
Hiding sensitive tokens in the input to prevent the model from memorising private data.
Masking low-confidence tokens in the output to reduce hallucination.
Blocking certain attention heads from activating to reduce compute cost.
*Preventing each token from attending to future tokens during training, so the model learns to predict the next token.
===
What is a "head" in multi-head attention?
The first token in a sequence, which carries the most context for the rest.
A separate sub-network that handles a specific language task like NER or sentiment.
*An independent attention function that learns to focus on different aspects of the input simultaneously.
A parameter group that is frozen during fine-tuning to preserve pre-trained knowledge.
===
Why do larger language models tend to perform better on tasks they were not explicitly trained for?
*Scale enables emergent capabilities — patterns learned across diverse training data generalise to novel tasks.
Larger models have more memory and can store more facts verbatim from training data.
Larger models are always trained on more recent data, giving them better world knowledge.
Larger models apply explicit reasoning rules, whereas smaller models only match patterns.
===
What is the difference between pre-training and instruction tuning?
Pre-training is done by the user; instruction tuning is done by the model provider.
Pre-training uses labelled data; instruction tuning uses unlabelled internet text.
Pre-training produces a chat model; instruction tuning produces a base model.
*Pre-training learns general language representations from raw text; instruction tuning aligns the model to follow human instructions.
===
What does "temperature" control in an LLM at inference time?
The speed of token generation — higher temperature makes the model generate faster.
*The sharpness of the probability distribution over next tokens — higher temperature produces more varied outputs.
The maximum length of the output — higher temperature allows longer responses.
The number of attention heads active during generation — higher temperature activates more heads.
===
What is a "mixture of experts" (MoE) architecture?
A training technique where multiple smaller models vote on the correct output before it is returned.
A deployment pattern where different model versions handle different user request types.
*A model architecture where only a subset of specialist sub-networks are activated for each token, reducing compute per forward pass.
A fine-tuning approach that trains a separate expert for each target domain.
===
What is the significance of the "residual connection" in transformer blocks?
It saves the model's previous response so it can refer to it in multi-turn conversations.
It connects the encoder and decoder in sequence-to-sequence models.
It stores intermediate attention scores for use in interpretability tooling.
*It adds the block's input directly to its output, helping gradients flow and enabling deeper networks.
===
What does "RLHF" stand for and what problem does it solve?
Recursive Language Hierarchy Formation — structuring the model's internal representations for better retrieval.
*Reinforcement Learning from Human Feedback — aligning model outputs with human preferences beyond what next-token prediction alone achieves.
Reduced Latency High Fidelity — a technique for speeding up inference without quality loss.
Regularised Loss with Hallucination Filtering — suppressing fabricated outputs during training.
===
What is "weight sharing" in the context of transformer models?
*Using the same parameter matrix for multiple roles in the architecture — for example, tying input embeddings to the output projection layer.
Distributing a single model's weights across multiple GPUs for parallel inference.
Sharing fine-tuned weights between different user-facing deployments of the same base model.
Copying weights from a larger model into a smaller model as a form of distillation.
===
What is a token in the context of a large language model?
A security credential required to authenticate API requests.
A discrete reasoning step the model takes before producing an answer.
*The basic unit of text the model processes — roughly a word, sub-word, or punctuation mark.
A numerical identifier assigned to each unique sentence in the training corpus.
===
Why do some words cost more tokens than others?
*Rare or long words are split into multiple sub-word tokens by the tokeniser.
Common words are cached and cost zero tokens to process.
Words in capitals are always treated as single tokens regardless of length.
Token cost depends on word frequency in the training data, not word length.
===
What is an embedding in the context of LLMs?
A compressed version of the model's weights used for faster inference.
A structured format for injecting external data into the model's context.
A technique for reducing hallucinations by anchoring outputs to source text.
*A dense numerical vector that represents the meaning of a token or text in a high-dimensional space.
===
What does it mean for two texts to have a "high cosine similarity" in embedding space?
They share a high proportion of identical tokens after tokenisation.
*Their embedding vectors point in nearly the same direction, indicating semantic similarity.
They were retrieved from the same document in the training corpus.
Their token counts are within a small percentage of each other.
===
What is the difference between a "token embedding" and a "sentence embedding"?
Token embeddings are used during training; sentence embeddings are used only at inference time.
Token embeddings are high-dimensional; sentence embeddings are always 128 dimensions.
*Token embeddings represent individual tokens; sentence embeddings represent the meaning of an entire passage as a single vector.
Token embeddings are learned; sentence embeddings are computed using hand-crafted rules.
===
Why does tokenisation of non-English text often cost more tokens per word?
Non-English models use a different API endpoint that charges at a higher rate.
Non-Latin scripts require Unicode escaping, which multiplies the byte count.
Non-English words are always treated as unknown tokens and replaced by a placeholder.
*Tokenisers trained on English-heavy data have larger vocabulary coverage for English, so non-English words are split into more sub-word pieces.
===
What is the "vocabulary size" of a language model?
*The total number of distinct tokens the model recognises — typically tens of thousands of sub-word pieces.
The number of unique concepts the model can discuss, inferred from its training data.
The maximum number of tokens the model can generate in a single response.
The number of languages the model was trained on.
===
What happens to embedding representations as they pass through transformer layers?
They remain identical at each layer; layers only affect the attention weights.
*They are progressively refined — each layer transforms the representations to capture increasingly abstract and contextual information.
They collapse to a single value per token that represents its classification label.
They are discarded after each layer and re-computed from the original token IDs.
===
What is the purpose of "special tokens" like [CLS], [SEP], or <|endoftext|>?
They are placeholders for sensitive information that has been redacted from the input.
They indicate tokens that the model should copy verbatim without modification.
They are error codes inserted when the tokeniser cannot parse a word.
*They serve as structural markers that help the model understand task boundaries, sequence starts/ends, or signal generation completion.
===
What is "semantic search" and how does it differ from keyword search?
Semantic search is faster because it uses pre-computed index tables; keyword search is slower because it reads raw documents.
Semantic search only works on structured data; keyword search works on both structured and unstructured text.
*Semantic search matches based on meaning using embedding similarity; keyword search matches based on exact or fuzzy token overlap.
Semantic search requires a fine-tuned model; keyword search works with any off-the-shelf model.
===
What does it mean when a model is described as having a "128K token context window"?
The model was trained on 128,000 documents.
*The model can process up to 128,000 tokens — input plus output — in a single call.
The model can remember up to 128,000 previous conversations.
The model generates outputs of exactly 128,000 tokens before stopping.
===
Why do embeddings from one model not work directly with embeddings from a different model?
*Each model learns its own vector space with different dimensions and geometric structure; cross-model distances are meaningless.
Embeddings are encrypted at generation time and can only be decrypted by the originating model.
Different models use incompatible file formats that cannot be loaded by each other's inference engines.
Embeddings are only valid during the session in which they were generated.
===
What is the role of the embedding layer at the start of a transformer?
It filters out low-relevance tokens before they enter the attention mechanism.
It compresses the input sequence to reduce compute cost in later layers.
*It converts token IDs into dense continuous vectors that the attention mechanism can operate on.
It assigns each token a confidence score that propagates through the network.
===
What does "dimensionality" refer to in the context of embedding vectors?
The number of languages the embedding model was trained on.
The maximum text length that can be embedded in a single call.
The precision (float16 vs float32) used to store the embedding values.
*The number of values in the vector — higher dimensionality allows richer representations but increases storage and compute cost.
===
What is "out-of-vocabulary" (OOV) handling in modern tokenisers?
OOV tokens are replaced with a fixed [UNKNOWN] token that the model treats as a generic placeholder.
*Sub-word tokenisers like BPE eliminate OOV by breaking any word into known sub-word pieces, including byte-level fallbacks.
OOV handling requires the user to manually add new tokens to the vocabulary before inference.
Modern models skip OOV tokens silently during generation to avoid errors.
===
What practical problem does a limited context window create for enterprise AI applications?
*Long documents, conversation histories, or knowledge bases may not fit, forcing truncation or chunking strategies.
The model refuses to answer questions about topics not covered in the first 1,000 tokens.
Enterprise users pay per context window slot, making long inputs prohibitively expensive.
Context limits only affect the output length, not the amount of input the model can read.
===
What is the "lost in the middle" problem with long context windows?
When context windows are long, the model loses track of the user's original question.
Content placed in the middle of the context is automatically summarised and compressed.
*Models tend to pay more attention to content at the beginning and end of the context, and less to content in the middle.
Long contexts cause the model to switch languages or styles midway through the response.
===
Why does increasing context window size increase inference cost?
Longer contexts require more fine-tuning passes to update the model's weights.
*Attention computation scales quadratically with sequence length, making longer contexts significantly more expensive.
APIs charge a flat fee per context window size tier regardless of actual token count.
Longer contexts increase the model's temperature, requiring more sampling passes.
===
What is a "sliding window" approach to handling documents longer than the context window?
Expanding the model's context window dynamically as more tokens are added.
Summarising earlier parts of the document and injecting summaries into later windows.
Routing different sections of the document to different model instances simultaneously.
*Processing the document in overlapping chunks that each fit within the context, then aggregating results.
===
What is the difference between "context length" and "memory" for a language model?
*Context length is the tokens available in a single call; memory refers to mechanisms for persisting information across multiple calls.
Context length is a hardware limit; memory is a software configuration set by the developer.
Context length applies to the input; memory applies only to the model's output generation.
Context length and memory are the same thing — different terms used by different providers.
===
What happens when you exceed a model's context window?
The model automatically summarises earlier content to make room for new tokens.
*The API typically truncates the input, raises an error, or the model silently ignores overflow tokens depending on implementation.
The model switches to a retrieval mode, fetching the overflow content from a cache.
The response quality degrades linearly but the model still processes all tokens.
===
What is "KV cache" and why does it matter for inference efficiency?
A key-value store external to the model used to retrieve facts during generation.
A compressed representation of the model's weights for faster loading at startup.
A log of previous API calls that the model uses to maintain conversation history.
*A cache of the key and value matrices from previous tokens, avoiding recomputation during autoregressive generation.
===
What is "context stuffing" and when is it a problem?
Injecting adversarial content into the context to manipulate the model's output.
Using the context window exclusively for system prompt instructions, leaving no room for user input.
*Filling the context with as much information as possible and hoping the model uses it — which degrades performance when the signal is buried in noise.
Compressing multiple conversations into a single context to save API costs.
===
How does "retrieval-augmented generation" (RAG) address context window limitations?
RAG extends the model's context window by compressing retrieved documents before insertion.
*Instead of loading all documents into context, RAG retrieves only the most relevant chunks at query time, keeping context focused and within limits.
RAG eliminates the need for a context window by storing all knowledge in the vector database.
RAG allows the model to read documents in real time from external URLs during generation.
===
What is "prompt caching" offered by some model providers?
*A feature that caches the computed key-value states for a shared prefix, reducing cost and latency for repeated inputs with the same preamble.
A service that stores previously generated responses and returns them verbatim for identical prompts.
A client-side feature that saves prompt templates in a local file for faster reuse.
A fine-tuning technique that learns which prompt structures work best for a given task.
===
What does "multi-turn context management" require from an application developer?
Subscribing to a stateful session tier from the model provider that maintains context server-side.
Fine-tuning the model on the specific conversation history before each new session.
*Explicitly maintaining and passing the full conversation history with each API call, since the model has no built-in session memory.
Summarising every turn before sending it to the model to keep token counts low.
===
What is "context poisoning" in the context of language model security?
A phenomenon where outdated training data in the model's weights causes incorrect answers.
Overloading the context window with tokens to cause the model to crash or return errors.
Using context length to bypass rate limits by batching many requests into one call.
*An attack where malicious content injected into the context manipulates the model's reasoning or outputs.
===
Why does very long context not always produce better results?
APIs hard-cap response quality above a certain context length to manage compute costs.
*Attention over very long sequences can dilute focus, and the model may fail to use distant relevant content effectively.
Long contexts always improve results — the limitation is only in the user's interpretation.
Long contexts cause the model to switch to a less capable inference mode to manage memory.
===
What is the practical implication of paying for both input and output tokens in most pricing models?
Developers should always minimise system prompt length at the expense of instruction quality.
Output tokens are always cheaper, so applications should request longer responses to get more value.
*Prompt design and output length both directly affect cost — verbose prompts and long responses compound expenses.
Token costs only apply to production deployments; development and testing are always free.
===
What is "context window utilisation" and why does it matter operationally?
*How much of the available context window a request actually uses — important for cost management, latency, and avoiding truncation.
A metric for how accurately the model uses information within the context to answer questions.
The percentage of the training corpus that fits within the model's context window.
A measure of how frequently a deployed model's context fills to capacity in production.
===
What does "autoregressive generation" mean?
The model generates all output tokens simultaneously in a single forward pass.
The model retrieves pre-generated responses from a cache and adapts them to the current input.
The model repeatedly revises its entire output until a quality threshold is met.
*The model generates one token at a time, conditioning each new token on all previously generated tokens.
===
What is "greedy decoding" and what is its main drawback?
Generating multiple full responses and selecting the one with the highest overall probability.
*Always picking the single highest-probability token at each step — fast but can miss higher-quality sequences reachable through lower-probability early choices.
Randomly sampling tokens without any probability weighting, producing maximally diverse outputs.
Constraining generation to tokens that appear in a predefined vocabulary whitelist.
===
What is "chain-of-thought" reasoning and why does it improve performance?
A training technique that chains multiple fine-tuning stages to build reasoning capabilities.
A retrieval method that chains document lookups to gather evidence before answering.
*Prompting the model to reason through intermediate steps before giving a final answer, which improves accuracy on complex tasks.
A decoding strategy that generates multiple candidate chains and selects the best one.
===
What distinguishes a "reasoning model" (like o1 or o3) from a standard instruction-tuned model?
*Reasoning models are trained to spend more compute generating internal reasoning chains before producing an answer, improving performance on hard tasks.
Reasoning models have access to external calculators and search tools by default.
Reasoning models are always larger in parameter count than standard instruction-tuned models.
Reasoning models generate answers in a structured JSON format rather than natural language.
===
What is "top-p" (nucleus) sampling?
Selecting the top p percent of tokens by frequency in the training data.
Limiting generation to tokens that appear in the top p documents retrieved from a knowledge base.
Setting a minimum probability threshold below which tokens are never generated.
*Sampling from the smallest set of tokens whose cumulative probability exceeds p, avoiding both determinism and the long tail of unlikely tokens.
===
What is the difference between "latency" and "throughput" in LLM inference?
Latency measures output quality; throughput measures how many servers are running simultaneously.
Latency is a user-facing metric; throughput is only relevant for model training pipelines.
*Latency is the time from request to first token; throughput is the number of tokens or requests processed per unit time.
Latency and throughput are the same metric measured at different time scales.
===
What is "speculative decoding" and what problem does it solve?
*A technique where a smaller draft model generates candidate tokens that a larger model verifies in parallel, reducing total latency.
A method where the model predicts the user's likely next prompt to pre-generate a response.
A sampling strategy that generates multiple response candidates and selects the most likely one.
A compression technique that reduces the model's memory footprint during inference.
===
What does "hallucination" mean in the context of LLMs?
The model producing outputs that are stylistically inconsistent with the prompt.
*The model generating content that is confidently stated but factually incorrect or entirely fabricated.
The model repeating the same phrase or sentence multiple times in a response.
The model refusing to answer questions it was trained to answer due to safety filters.
===
What is "beam search" in the context of LLM decoding?
Searching the training data for the closest matching sentence to the current context.
Filtering generated tokens through a classifier beam before adding them to the output.
*Maintaining multiple candidate sequences simultaneously and selecting the one with the highest overall probability at the end.
Splitting generation across multiple GPU cores to increase throughput.
===
Why do reasoning models have higher latency than standard models?
They make multiple API calls to external tools before generating a response.
They run each response through a separate verification model before returning it.
They are deployed on fewer servers than standard models, creating longer queue times.
*They generate extended internal reasoning chains — often thousands of tokens — before producing the visible answer.
===
What does "token budget" mean in practical LLM application design?
*The allocation of available context tokens across system prompt, retrieved content, conversation history, and output, managed to stay within limits and control cost.
The total number of tokens a user is permitted to generate per month under a subscription plan.
A training-time constraint that limits how many tokens the model can generate during fine-tuning.
A safety mechanism that stops generation when the model's confidence falls below a threshold.
===
What is "few-shot inference" and how does it differ from fine-tuning?
Few-shot inference requires fewer API calls than fine-tuning and is therefore cheaper.
*Few-shot inference provides examples in the prompt to guide the model at runtime; fine-tuning updates the model's weights through additional training.
Few-shot inference works only with small models; fine-tuning is required for large models.
Few-shot inference and fine-tuning are synonymous — both adapt the model to new tasks.
===
What is "output consistency" and why is it a challenge with temperature > 0?
Output consistency is guaranteed when using the same model version and system prompt.
Output consistency only matters for creative tasks; factual tasks are always deterministic.
Output consistency can be enforced by setting max_tokens to a fixed value.
*At temperatures above 0, the model samples probabilistically, so identical inputs can produce different outputs — inconsistency is inherent.
===
What is the "prefill" phase of LLM inference?
*The phase where the model processes the full input prompt in parallel, before beginning autoregressive generation.
The phase where the server pre-loads model weights into GPU memory before the first request.
The phase where the application populates template placeholders before sending the prompt.
The phase where retrieved documents are ranked and inserted into the context window.
===
What does "model quantisation" do and why is it used?
It compresses the model by removing parameters that contributed least to training performance.
It converts the model from one architecture to another for deployment on different hardware.
*It reduces the numerical precision of model weights (e.g., from float32 to int8), shrinking memory footprint and increasing inference speed with modest quality trade-offs.
It splits the model into smaller modules that can be fine-tuned independently.
===
What is the primary consideration when choosing between a large frontier model and a smaller efficient model for a production application?
*Task complexity, latency requirements, cost constraints, and privacy needs — not parameter count alone.
The larger model is always preferable because it will produce better outputs.
Model selection should always prioritise the most recently released model.
The choice depends entirely on the context window size required for the application.
===
What is "fine-tuning" and when is it the right choice over prompting?
Fine-tuning is always the first step in deploying an LLM for any enterprise application.
Fine-tuning is only possible for open-source models; commercial models cannot be fine-tuned.
Fine-tuning is a synonym for instruction tuning — it refers to the initial alignment step performed by the model provider.
*Fine-tuning updates model weights on new training data — appropriate when prompt engineering cannot achieve the required consistency, style, or task performance.
===
What is a "base model" versus an "instruction-tuned model"?
A base model is smaller; an instruction-tuned model is the same architecture with more parameters.
*A base model is trained only on next-token prediction; an instruction-tuned model has been further trained to follow instructions and behave helpfully.
A base model is free to use; an instruction-tuned model requires a paid API subscription.
A base model generates code; an instruction-tuned model generates natural language.
===
What is "LoRA" (Low-Rank Adaptation) and why is it used for fine-tuning?
A regularisation technique that penalises large weight updates during fine-tuning to prevent catastrophic forgetting.
A data augmentation method that generates synthetic training examples using the base model.
*A parameter-efficient fine-tuning method that injects small trainable rank-decomposition matrices into the model, leaving original weights frozen — dramatically reducing compute and memory requirements.
A deployment optimisation that reduces the number of active layers during inference.
===
What is "catastrophic forgetting" in the context of fine-tuning?
*When fine-tuning on new data causes the model to lose performance on tasks it previously handled well.
When the model generates outputs that directly contradict its training data.
When a model's fine-tuning run fails midway and all checkpoints are lost.
When a model overfits to the fine-tuning data and performs worse than the base model on the target task.
===
What is a "system prompt" in the context of deployed LLM applications?
A special prompt that triggers the model to enter a system administration mode.
A hidden prompt generated by the model itself to guide its own reasoning.
*A fixed instruction block provided by the operator that sets the model's behaviour, persona, and constraints before the user's input is processed.
A prompt constructed automatically from the user's account metadata and preferences.
===
What factors should drive the decision to use an open-source model versus a commercial API?
Open-source models are always cheaper; commercial models are always more capable.
Commercial APIs are suitable for prototypes; open-source models should always be used in production.
The choice depends only on the licence type of the open-source model.
*Data privacy requirements, customisation needs, cost at scale, latency constraints, and available ML engineering capacity.
===
What is "domain adaptation" in the context of LLMs?
Translating a model trained on English data to perform well on other language domains.
*Adjusting a general-purpose model — through fine-tuning, prompting, or RAG — to perform well on a specific domain such as legal, medical, or financial text.
Adapting a text model to handle non-text modalities like images or audio.
Changing the model's system prompt to make it sound like a domain expert.
===
What is "multimodal" capability in an LLM?
The ability to output multiple response formats such as JSON, Markdown, and plain text.
The ability to handle multiple languages in the same model.
*The ability to process and generate content across multiple modalities — text, images, audio, or video — within a single model.
The ability to run on multiple hardware platforms including CPU, GPU, and TPU.
===
What is the significance of a model's "knowledge cutoff"?
*The model has no reliable knowledge of events that occurred after its training data cutoff date.
The model refuses to answer questions that require more than its knowledge cutoff token limit.
The knowledge cutoff determines the maximum context the model can process.
The knowledge cutoff is the date after which the model's licence expires.
===
What is the difference between "zero-shot" and "few-shot" prompting in the context of model capability?
Zero-shot prompting works only on fine-tuned models; few-shot prompting works on base models.
*Zero-shot asks the model to perform a task without examples; few-shot provides examples in the prompt to demonstrate the desired behaviour.
Zero-shot produces shorter outputs; few-shot produces longer outputs.
Zero-shot is faster because it skips the example processing step.
===
What is "model distillation" and what is it used for?
Extracting factual knowledge from a large model into a structured database.
Removing unsafe capabilities from a model by filtering its outputs during training.
Splitting a large model into smaller independent sub-models for parallel deployment.
*Training a smaller student model to mimic the outputs of a larger teacher model — producing a compact model that retains much of the teacher's capability.
===
When is fine-tuning NOT the right solution?
When the task involves structured output — fine-tuning never helps with format compliance.
When using a commercial model, since fine-tuning is only available for open-source models.
*When you have limited high-quality data, when the issue is solvable with better prompting, or when you need the model to use knowledge that post-dates training.
When the application requires low latency, since fine-tuned models are always slower.
===
What does "safety alignment" mean in the context of commercial LLMs?
Encrypting model weights to prevent extraction or misuse by third parties.
*Training processes — including RLHF, Constitutional AI, or similar — that teach the model to refuse harmful requests and behave in accordance with defined values.
Restricting the model's outputs to a whitelist of approved response types.
Testing the model against a fixed benchmark to ensure outputs are factually correct.
===
What is the practical implication of model deprecation for production applications?
Deprecated models become freely available for local deployment once removed from the API.
Deprecation only affects fine-tuned models; base model API access is permanent.
Model deprecation triggers automatic migration to the latest version with no engineering work required.
*Applications built on a deprecated model version must be re-evaluated and potentially re-engineered when that version is removed from the API.
===
What is the primary purpose of a system prompt in an LLM application?
To provide the model with a list of facts it should memorise for the session.
*To set the model's behaviour, persona, constraints, and context before any user interaction begins.
To configure the API parameters such as temperature and max tokens.
To authenticate the operator's identity before the model processes user input.
===
Why does a well-crafted system prompt reduce the need for per-request instructions?
System prompts are cached by the model and applied at the hardware level for efficiency.
User messages are ignored if a system prompt is present — the model only follows system-level instructions.
System prompts compress the token count of subsequent messages automatically.
*Standing instructions in the system prompt apply to every turn, eliminating repetition in user messages.
===
What is the risk of an overly vague system prompt?
*The model defaults to generic helpful assistant behaviour, which may not match the application's requirements.
Vague system prompts are rejected by the API and return a validation error.
The model generates longer responses to compensate for the lack of guidance.
Vague system prompts are more expensive because the model must infer more at runtime.
===
What is "prompt injection" and why is it a threat to system prompt integrity?
A technique for inserting dynamic content into a static system prompt template at runtime.
A training vulnerability where system prompt data leaks into the model's base weights.
*An attack where user input contains instructions that attempt to override or circumvent the system prompt.
An API error caused by invalid characters or encoding in the system prompt.
===
What is the difference between a system prompt and a user message in terms of model trust?
System prompts are processed first but carry the same trust level as user messages.
*System prompts are set by the operator and carry higher trust; user messages come from end users and should be treated with appropriate scepticism.
User messages carry higher trust because they are entered directly by the authenticated user.
The model treats all messages identically — trust level is determined by content, not role.
===
What is the recommended approach for including sensitive instructions in a system prompt?
*Place critical constraints clearly and early in the system prompt, as models attend more reliably to content at the beginning.
Encode sensitive instructions in Base64 to prevent users from reading them if the prompt is leaked.
Put all restrictions at the end of the system prompt so they override any earlier instructions.
Never include restrictions in the system prompt — use a post-processing filter instead.
===
What is "meta-prompting"?
Writing a prompt that describes itself — a self-referential structure used in reasoning tasks.
A technique for nesting one prompt inside another to build hierarchical instructions.
A meta-learning approach where the model learns optimal prompt structures from training data.
*Using an LLM to generate, improve, or evaluate prompts — treating prompt writing as a task the model can assist with.
===
What is a "persona" in a system prompt and when is it appropriate to use one?
A security mechanism that prevents the model from revealing the contents of the system prompt.
A template variable that inserts the user's name into the model's responses.
*A defined character identity (name, tone, expertise) that the model adopts — appropriate when consistent brand voice or specialised expert framing improves user experience.
A fine-tuning instruction that permanently changes the model's personality across all deployments.
===
How should a system prompt handle conflicting instructions — for example, when a user asks the model to do something the system prompt prohibits?
*The system prompt should explicitly state how to handle conflicts — typically by declining politely and staying within the defined scope.
Conflicting instructions are automatically resolved by the model in favour of the user.
The model should always follow the most recent instruction, regardless of source.
Conflicting instructions cause the model to generate an error and terminate the session.
===
What is the effect of instruction length on system prompt reliability?
Longer system prompts always produce more reliable behaviour because they provide more context.
System prompts above a certain length are truncated by the API automatically.
Instruction length has no effect on reliability — only instruction clarity matters.
*Very long system prompts can dilute the model's attention, causing it to miss or inconsistently follow some instructions.
===
What is "system prompt leakage" and how should it be handled?
A technical bug where the system prompt appears in the model's output due to an API error.
*The risk that a user extracts the system prompt through clever questioning — mitigated by instructing the model not to reveal it, though not guaranteed.
A security vulnerability where system prompt content is logged and exposed in API responses.
The gradual degradation of system prompt effectiveness over the course of a long conversation.
===
What is the benefit of including examples directly in a system prompt?
Examples are parsed by the API as training data, permanently improving the model's performance.
Examples reduce the total token count of user messages by pre-loading common responses.
*Examples demonstrate the desired behaviour concretely, reducing ambiguity and improving output consistency across diverse inputs.
Examples override the model's default behaviour by acting as a fine-tuning signal at runtime.
===
What is a "negative constraint" in a system prompt and when should you use one?
A constraint that scores the model's output negatively if it exceeds a length limit.
An instruction that inverts the model's default behaviour by negating its training objectives.
A security flag that triggers human review when certain keywords appear in the output.
*An explicit instruction about what the model must NOT do — useful when the boundary between allowed and prohibited behaviour might otherwise be ambiguous.
===
What is a "grounding instruction" in a system prompt?
An instruction that anchors the model's persona to a specific historical period.
*An instruction that tells the model to base its responses on provided documents or data, rather than its own internal knowledge.
A system-level instruction that prevents the model from generating speculative content.
An instruction that grounds the model's outputs in a specific cultural or regional context.
===
What is the purpose of "format instructions" in a system prompt?
*To specify the structure of the model's outputs — such as JSON, markdown, bullet points, or response length — ensuring downstream processing can rely on a consistent format.
To tell the model which file format the user's uploaded documents are in.
To configure the API's response encoding, such as UTF-8 or ASCII.
To define the formatting rules for the system prompt itself.
===
What is the simplest way to activate chain-of-thought reasoning in a capable model?
Setting the temperature to 0 to force the model into a deterministic reasoning mode.
Enabling a special "reasoning mode" flag in the API request parameters.
*Including a phrase like "Think step by step" or "Reason through this carefully before answering".
Fine-tuning the model on reasoning traces before deploying it.
===
Why does chain-of-thought prompting improve accuracy on arithmetic and logic problems?
*Breaking the problem into explicit steps externalises intermediate reasoning, allowing the model to build on correct sub-results rather than attempting a one-shot answer.
Chain-of-thought activates a specialised reasoning sub-network that bypasses the token prediction mechanism.
The model has access to a calculator when chain-of-thought mode is activated.
Writing out steps reduces the probability of sampling from incorrect regions of the token distribution.
===
What is "zero-shot chain-of-thought" versus "few-shot chain-of-thought"?
Zero-shot CoT uses no context; few-shot CoT injects retrieved documents to ground the reasoning.
Zero-shot CoT works for small models; few-shot CoT is only effective for models above a certain size.
Zero-shot CoT and few-shot CoT produce identical results — the difference is only in token efficiency.
*Zero-shot CoT asks the model to reason step by step without examples; few-shot CoT provides worked examples of reasoning traces alongside the task.
===
What is "self-consistency" as a prompting technique?
Asking the model to verify its own answer by re-reading the question after generating a response.
*Generating multiple independent reasoning chains for the same problem and taking the majority answer, improving reliability over a single chain.
A technique that enforces logical consistency by checking that all statements in a response are non-contradictory.
Prompting the model to produce the same output across multiple API calls by setting temperature to 0.
===
What is "tree-of-thought" (ToT) prompting?
A prompt format that organises information hierarchically using indented bullet points.
A method of chaining multiple LLM calls in a branching pipeline to handle different intent categories.
*A technique that explores multiple reasoning paths in a tree structure, evaluating intermediate steps and backtracking from dead ends.
A visualisation technique that maps the model's attention weights onto a tree diagram.
===
What type of task benefits least from chain-of-thought prompting?
Mathematical word problems with multiple operations.
Tasks requiring the model to plan a sequence of actions.
Legal or medical reasoning tasks that involve weighing multiple considerations.
*Simple factual lookups or direct questions where the answer requires no intermediate reasoning steps.
===
What is "scratchpad reasoning" in the context of extended thinking models?
*An internal reasoning process where the model generates a private thinking trace before producing the visible answer.
A developer technique for logging intermediate API calls during a multi-step pipeline.
A whiteboard metaphor used in prompt templates to organise complex instructions.
A model feature that stores reasoning traces in a database for later retrieval.
===
What is a "reasoning trace" and why should developers evaluate it?
A log of all API calls made during an agentic workflow, used for debugging and auditing.
*The step-by-step reasoning the model produces before its final answer — examining it reveals whether the model is reasoning correctly or reaching correct answers for wrong reasons.
A structured output format that encodes the model's confidence for each claim in the response.
A fine-tuning dataset extracted from the model's internal activations.
===
What is "prompt chaining" and how does it differ from a single complex prompt?
Linking multiple system prompts together so that each one overrides the previous one.
A technique for combining outputs from multiple concurrent LLM calls into a single response.
Constructing a single prompt that references multiple previous prompts in the conversation.
*Breaking a task into sequential LLM calls where each call's output becomes the next call's input, enabling more reliable and debuggable multi-step processing.
===
What is "step-back prompting"?
A technique for prompting the model to reconsider an incorrect answer by providing a hint.
A fallback prompting strategy used when the primary prompt fails to produce useful output.
*Asking the model to first reason about the general principles or concepts relevant to a question before addressing the specific question.
A method for reducing verbosity by asking the model to summarise its reasoning at the end.
===
What is the risk of uncritically accepting a chain-of-thought response that arrives at a correct final answer?
Correct answers with visible reasoning are always more expensive to generate.
*The reasoning may be flawed or confabulated, meaning the correct answer was reached by chance and the reasoning cannot be trusted for generalisation.
The model may refuse to generate reasoning for follow-up questions if it already showed its work.
Accepting correct answers trains the model to produce shorter reasoning traces in future calls.
===
What is "least-to-most" prompting?
*Decomposing a complex problem into simpler sub-problems solved in order from easiest to hardest, using each answer to inform the next.
A prompting strategy that begins with minimal instructions and adds detail only when the model fails.
Providing the model with the most basic examples first, then increasing complexity.
A token-efficiency technique that orders prompt sections from shortest to longest.
===
What is "role prompting" and how does it affect model outputs?
Asking the model to take on the user's perspective to generate more empathetic responses.
A technique for switching the model between different task types within a single conversation.
*Assigning the model an expert identity ("You are an expert in X") that primes it to respond with domain-appropriate knowledge and tone.
Specifying the API role parameter to grant the model operator-level permissions.
===
What is "directional stimulus prompting"?
A technique for steering the model's attention toward specific sections of a long document.
A method for generating responses with a specific emotional valence by including sentiment cues.
An adversarial technique for steering the model away from its safety guidelines.
*Including a hint or guiding keyword in the prompt that nudges the model toward a desired type of response.
===
Why is it important to test prompts across a diverse set of inputs, not just the examples that motivated the prompt design?
Diverse testing is required by API terms of service before deploying a production prompt.
*Prompts optimised for a few examples often overfit and fail on edge cases, adversarial inputs, or distributional shifts in real user queries.
Testing on diverse inputs allows the model to improve its responses through in-context learning.
Models behave identically across all inputs given the same prompt — diverse testing is for the developer's confidence only.
===
What is the general principle for ordering information in a long prompt?
*Place the most critical instructions at the beginning and end, as models attend less reliably to information in the middle of long prompts.
Place examples first, then instructions, so the model understands the task before reading the rules.
Order information from most specific to most general, matching how humans read documents.
Randomise the order to prevent the model from developing positional biases.
===
What is "context injection" in the context of LLM applications?
A technique for injecting adversarial content into a prompt to test model robustness.
A method for compressing large documents into the context window using summarisation.
*Dynamically inserting relevant information — user data, retrieved documents, or state — into the prompt at runtime before sending it to the model.
The process of fine-tuning a model on context-specific data to improve domain performance.
===
What is the benefit of separating different types of content in a prompt using clear delimiters?
Delimiters are required by the API for the prompt to be parsed correctly.
*Delimiters (XML tags, markdown headers, triple quotes) help the model distinguish between instructions, examples, data, and user input — reducing confusion and improving reliability.
Delimiters reduce the token count by compressing whitespace between sections.
Delimiters tell the model which sections to ignore when generating a response.
===
What is "few-shot prompting" and what makes examples effective?
A technique for reducing API calls by batching multiple questions into a single prompt.
Providing the model with a few hints about where to search for information.
A method for fine-tuning the model using a small number of labelled examples.
*Providing input-output pairs that demonstrate the desired behaviour — effective examples are representative, correctly formatted, and cover edge cases.
===
What is "prompt templating" and why is it important for production systems?
*Using parameterised prompt structures where placeholders are filled at runtime — ensuring consistency, testability, and separation of prompt logic from application logic.
Designing a fixed prompt that the model memorises across sessions for faster response times.
A technique for generating prompts automatically from user intent without developer involvement.
A compression format that reduces prompt token counts for cost efficiency.
===
What is the risk of including too many examples in a few-shot prompt?
The model is limited to processing a maximum of five examples in a single prompt.
*It consumes context window space that could be used for the actual input or retrieved content, and may cause the model to overfit to the example format rather than generalise.
Too many examples cause the model to average across them, producing bland outputs.
Including many examples triggers a fine-tuning mode that permanently alters the model.
===
What is "instruction decomposition" and why does it improve prompt reliability?
Splitting a long prompt into multiple API calls to avoid context window limits.
A technique for removing ambiguous language from instructions through automated rewriting.
Decomposing the model's output into component parts for downstream processing.
*Breaking a complex instruction into explicit sequential sub-steps, making it easier for the model to follow each part correctly.
===
What is a "dynamic system prompt" and when is it appropriate?
A system prompt that updates itself based on feedback from the model's previous responses.
A system prompt generated entirely by the model at the start of each conversation.
*A system prompt that varies based on user context, account type, or application state — appropriate when different users or scenarios require meaningfully different model behaviour.
A system prompt that rotates through different configurations to test which performs best.
===
What does it mean to "format-prime" a model in a prompt?
Including format instructions in the first line of the system prompt to give them maximum weight.
*Beginning the assistant's turn with a partial response that demonstrates the desired format, encouraging the model to continue in that structure.
Pre-processing the prompt to ensure consistent whitespace and encoding before sending to the API.
Training the model on formatted outputs so it defaults to structured responses.
===
What is the purpose of "negative examples" in few-shot prompting?
*Showing the model what incorrect or undesired outputs look like helps it learn the boundary between acceptable and unacceptable responses.
Negative examples are incorrect input-output pairs used to test the model's error detection.
Including negative examples reduces hallucination by training the model to avoid incorrect patterns.
Negative examples are output-only samples that the model uses as contrast when generating new responses.
===
What is "prompt versioning" and why does it matter?
A technique for compressing prompts into shorter versions without losing meaning.
An API feature that stores different prompt configurations for different user segments.
*Treating prompts as code with version control — tracking changes, enabling rollback, and correlating prompt versions with evaluation results.
A method for generating multiple variants of a prompt to identify the most effective one.
===
What is "XML tag prompting" and why does Anthropic recommend it for Claude?
A technique for encoding structured data as XML before injecting it into a prompt.
An API authentication method where requests are wrapped in XML envelopes.
A fine-tuning approach that trains Claude to output well-formed XML by default.
*Using XML-style tags like <instructions>, <document>, and <output> to structure prompt sections — Claude's training makes it particularly responsive to this structured format.
===
What is "output length control" and how is it best achieved?
Setting the temperature to control how much the model elaborates on each point.
*Specifying the desired response length explicitly in the prompt — either via instruction or by setting max_tokens in the API — to prevent verbose or truncated outputs.
Fine-tuning the model on outputs of the desired length to make it naturally concise.
Output length is determined solely by the model and cannot be controlled through prompting.
===
What is "constrained generation" and when is it used?
A safety technique that prevents the model from generating content above a certain risk score.
A token budget constraint that stops generation when the cost exceeds a defined threshold.
*Restricting the model's output to a defined set of options or a specific grammar — used when the application requires exact, predictable output formats.
A decoding method that forces the model to use only words from the user's input.
===
What is the difference between a "prompt" and a "programme" in the context of LLM engineering?
*A prompt is a single query; a programme is a structured composition of multiple prompts, logic, and tool calls that orchestrates complex tasks.
A prompt is written in natural language; a programme is written in a formal programming language.
A prompt is sent to the model; a programme is stored in the model's memory for later use.
A prompt produces one response; a programme produces multiple responses in parallel.
===
Why is JSON output mode preferred over asking the model to "respond in JSON" via instruction?
JSON mode is faster because the model skips the natural language generation step.
JSON mode reduces hallucination because the model cannot generate unsupported claims in JSON format.
JSON mode is cheaper because structured outputs require fewer tokens than prose.
*JSON mode (where available) constrains the token sampling to enforce valid JSON structure, eliminating parse errors from instruction-only approaches.
===
What is "structured output" prompting and why does it matter for downstream systems?
A technique for making model outputs more readable to human reviewers by adding headings and bullet points.
*Prompting the model to return data in a machine-readable format (JSON, XML, CSV) that downstream code can reliably parse without natural language interpretation.
Prompting the model to cite its sources in a structured bibliography format.
A method for generating outputs that conform to a visual design template.
===
What is a "schema prompt" and how does it reduce output variability?
A database schema injected into context to tell the model what data is available for retrieval.
A validation schema run after generation to filter out non-conforming outputs.
*A prompt that defines the exact fields, types, and structure of the desired output — giving the model a concrete template to fill rather than asking it to invent a structure.
A meta-prompt that describes how to write other prompts for a specific task category.
===
What is the trade-off between Markdown output and plain text output in LLM applications?
*Markdown renders well in chat interfaces but produces cluttered output when displayed in plain text contexts — format choice must match the rendering environment.
Markdown outputs are always more expensive because formatting tokens count toward usage.
Plain text outputs are always more reliable because models are trained primarily on unformatted text.
Markdown is only appropriate for code outputs; plain text should be used for all prose responses.
===
What is "chain-of-thought with output extraction"?
A technique that chains multiple reasoning steps, then feeds the trace into a second model for evaluation.
A CoT variant that extracts the most confident sentence from the reasoning trace as the answer.
A method for extracting specific entities from a reasoning trace using regex patterns.
*Prompting the model to reason through a problem, then explicitly extracting the final answer from a designated section rather than parsing the entire reasoning trace.
===
What is "output grounding" and when is it important?
A technique for preventing the model from generating content that contradicts its training data.
A post-processing step that verifies outputs against a factual database.
*Instructing the model to anchor its response to specific provided text, data, or documents rather than drawing from its parametric knowledge.
A formatting instruction that requires the model to cite the paragraph number for each claim.
===
What is a "response template" in prompt engineering?
*A pre-defined output structure with placeholders that the model fills in, ensuring consistent format while allowing variable content.
A saved prompt template that developers reuse across multiple API calls.
An HTML or Markdown template that formats the model's raw output for display.
A fine-tuning template that defines the expected input-output format for training examples.
===
What is the "answer first" prompting pattern and when is it useful?
A technique where the correct answer is provided to the model first, then it explains why.
*Asking the model to state its conclusion first, then provide supporting reasoning — useful for concise, scannable outputs where the user needs the answer immediately.
A CoT variant where the model predicts the answer before reasoning, then checks its prediction.
A format instruction that places numerical answers before textual answers in the output.
===
What is "citation prompting" and what are its limitations?
A technique for forcing the model to use only information from Wikipedia articles.
A post-processing method that automatically adds citations to model outputs using a database lookup.
*Instructing the model to cite specific documents or passages for each claim — useful for verifiability, but the model may fabricate citations if sources are not provided in context.
A prompting style where each sentence ends with a source URL that the model generates.
===
What is "output length calibration" and why does it require evaluation?
Setting max_tokens to match the desired word count, converting words to tokens using the standard 0.75 ratio.
Training the model on outputs of the desired length so it learns the target without explicit instruction.
A technique for compressing verbose model outputs in post-processing to meet length requirements.
*Empirically determining the instruction that produces outputs of the right length and depth for the use case — because models interpret vague length instructions inconsistently.
===
What is the benefit of including a "reasoning section" and a "conclusion section" as separate output fields?
*It separates the model's working from its final answer, making it easier to evaluate reasoning quality independently and to display only the conclusion to end users.
Separate sections reduce token count because the model can omit reasoning from the conclusion.
Separate sections allow different models to handle reasoning and conclusion independently.
It prevents the model from including reasoning in the conclusion, which would confuse users.
===
What is "table formatting" in prompt engineering and when should it be avoided?
A technique for organising prompt content into columns to reduce vertical space.
*Asking the model to format comparative information as a Markdown table — effective in rendered interfaces but problematic when outputs are processed as plain text or fed into non-rendering systems.
A database output format required when the model retrieves structured data.
A rendering instruction that converts bullet points into table rows automatically.
===
What is "label prompting" for classification tasks?
Assigning a numerical label to each example in a few-shot prompt to help the model index them.
Applying content labels to model outputs as a post-processing classification step.
A technique for labelling sections of a prompt to help the model understand their role.
*Restricting the model's output to a defined set of class labels, preventing free-text responses that require additional parsing.
===
What is a "confidence score" prompt and what are its reliability limits?
*Asking the model to express its confidence in its answer as a number — useful directionally but unreliable as a calibrated probability because models are not trained to produce calibrated confidence scores.
A prompt that activates the model's internal confidence estimation mechanism for more accurate outputs.
A post-processing technique that scores outputs using a separate classifier model.
A prompt format that instructs the model to only respond when confidence exceeds a threshold.
===
What is "chain of verification" (CoVe) prompting?
A multi-model approach where a second model verifies each claim in the first model's output.
A CoT variant that generates an answer, then traces backward to verify each reasoning step.
*A technique where the model generates an initial answer, drafts verification questions about that answer, answers each question, then revises the final answer based on what the verification reveals.
A prompting strategy that asks the model to list all sources that support and contradict its answer.
===
What is "prompt sensitivity" and why is it a problem for production systems?
*The phenomenon where small changes in prompt wording produce significantly different model outputs, making results fragile and hard to maintain.
The model's tendency to respond differently to the same prompt when it contains sensitive topics.
The degradation in prompt effectiveness that occurs as the model's weights are updated.
The computational sensitivity of the model to the numerical values in the input embedding.
===
What is an "evaluation prompt" (also called an "LLM-as-judge" prompt)?
A prompt used to evaluate the developer's prompting skills against a benchmark.
A system prompt configuration used exclusively in model evaluation benchmarks.
A prompt that retrieves evaluation metrics from an external scoring service.
*A prompt that instructs a language model to score, rank, or critique another model's output against defined criteria.
===
What is "prompt regression testing" and why is it necessary?
A technique for identifying prompts that cause the model to regress to earlier, less capable behaviour.
*Running a fixed test suite of prompts and expected outputs after any change to the prompt, model, or system to detect quality degradations before they reach production.
A method for automatically rolling back prompt changes that reduce user engagement metrics.
Testing whether a new model version responds consistently to prompts designed for an older model.
===
What is the "evaluation rubric" approach to assessing model outputs?
A rubric is an automated scoring algorithm that computes quality scores from output tokens.
A grid of benchmark tasks sourced from academic evaluation datasets.
*Defining explicit, observable criteria for what constitutes a good output, allowing consistent scoring across evaluators and over time.
An evaluation technique that compares model outputs to a golden reference answer using BLEU score.
===
What is "adversarial prompting" in the context of reliability testing?
*Deliberately crafting inputs designed to break, confuse, or manipulate the model — used to find failure modes before they appear in production.
A technique for generating adversarial training examples to improve model robustness.
A method for testing whether the model can detect and resist adversarial user inputs.
The practice of using aggressive language in prompts to force the model to be more direct.
===
What is the difference between "precision" and "recall" when evaluating LLM classification outputs?
Precision is the proportion of outputs that are factually accurate; recall is the proportion that are relevant.
Precision measures output conciseness; recall measures how much of the input the model references.
*Precision measures how often the model's positive labels are correct; recall measures how often actual positives are correctly identified.
Precision and recall are interchangeable metrics — they differ only in which class is treated as positive.
===
What is "hallucination rate" as an evaluation metric?
The rate at which the model generates content outside its defined persona or scope.
A measure of how often the model fails to respond to a prompt within the defined context window.
The frequency with which the model's outputs differ across multiple runs of the same prompt.
*The proportion of model outputs that contain factually incorrect or fabricated claims — measured by comparing outputs against ground truth or retrieved sources.
===
What is "A/B testing" of prompts and what makes it valid?
A testing method where version A is the production prompt and version B is an evaluation-only prompt never shown to users.
*Comparing two prompt variants against each other with real or representative traffic to measure which produces better outcomes on defined metrics.
Testing prompt A in development and prompt B in production to compare real-world and simulated performance.
A randomised test where users are shown two model responses and asked to choose the better one.
===
What is "reference-free evaluation" and when is it necessary?
Evaluating prompts without testing them against the target model, using a proxy model instead.
A method for evaluating factual accuracy without access to the original source documents.
*Evaluating model outputs without a ground truth reference answer — necessary for open-ended tasks where no single correct answer exists.
An automated evaluation technique that does not require human annotators.
===
What is "prompt drift" and how can it be detected?
*The gradual degradation in prompt effectiveness over time as the model version, data, or user behaviour changes — detected through ongoing evaluation against a fixed test suite.
The tendency for long prompts to lose coherence toward the end due to context window limitations.
A phenomenon where model outputs drift toward training data patterns when prompts are ambiguous.
The gradual divergence between a prompt's intended behaviour and what users actually ask.
===
What is the purpose of a "golden dataset" in prompt evaluation?
A training dataset used to fine-tune the model on the specific task the prompt is designed for.
*A curated set of representative inputs with high-quality human-verified expected outputs used as a benchmark for evaluating and comparing prompt versions.
A set of adversarial inputs specifically designed to break the model under evaluation.
The original training data used by the model provider, used as a reference for capability assessment.
===
What is "inter-rater reliability" and why does it matter for LLM evaluation?
The reliability of the model's outputs when the same prompt is sent to multiple server instances simultaneously.
A metric for how consistently the model follows instructions across different evaluators' test inputs.
The agreement rate between the model's outputs and a reference answer database.
*The degree to which different human evaluators agree on quality scores — low agreement means the evaluation criteria are ambiguous, making scores unreliable as a benchmark.
===
What is "output toxicity evaluation" in the context of prompt testing?
A technique for filtering toxic words from model outputs using a keyword blocklist.
An evaluation that measures how often the model refuses to answer questions it should answer.
*Systematically testing whether prompts produce harmful, biased, or offensive outputs across a representative range of inputs including adversarial cases.
A safety audit of the model provider's training data for toxic content.
===
What is "calibration" in the context of model confidence and evaluation?
Calibration refers to adjusting the model's temperature so its outputs match the desired level of certainty.
*A well-calibrated model's stated confidence accurately reflects its actual accuracy — when it says 80% confident, it is right about 80% of the time.
A post-processing technique that normalises confidence scores across different model outputs.
Calibration is the process of fine-tuning a model to produce correct answers on a validation set.
===
What is the most important principle for maintaining reliable prompt behaviour in production?
Locking the prompt and never changing it once it has been tested and deployed.
Using the largest available model to maximise output quality and minimise failure rates.
Ensuring the system prompt is as long and detailed as possible to cover all possible scenarios.
*Continuous evaluation against a fixed test suite — monitoring output quality metrics over time and treating prompt performance as an ongoing operational concern, not a one-time setup.
===
What is a vector database and why is it used in AI applications?
A database that stores model weights and configuration files for fast model loading.
*A database optimised for storing and searching high-dimensional embedding vectors using approximate nearest-neighbour algorithms.
A relational database with a vector data type added for storing numerical arrays.
A key-value store where AI-generated responses are cached for fast retrieval.
===
What is the difference between storing embeddings in a vector database versus a traditional relational database?
Vector databases store text; relational databases store numbers — embeddings are numbers so they belong in relational databases.
Vector databases are schema-less; relational databases require a fixed schema that embeddings do not fit.
Vector databases are only suitable for development; production systems must use relational databases for reliability.
*Vector databases are optimised for ANN search with specialised indexing (HNSW, IVF); relational databases support exact match and range queries but cannot efficiently search high-dimensional vectors.
===
What is HNSW and why is it commonly used in vector search?
*Hierarchical Navigable Small World — a graph-based ANN index that provides fast and accurate nearest-neighbour search with good performance on high-dimensional data.
High-Noise Semantic Weighting — a technique for down-weighting noise in embedding vectors before indexing.
Hybrid Neural Search Workflow — a pipeline combining dense and sparse retrieval in a single index.
Horizontal Node Sharding and Weaving — a distributed architecture for scaling vector databases across multiple servers.
===
What does "cosine similarity" measure in the context of embedding search?
The absolute distance between two vectors in Euclidean space.
The number of shared tokens between two pieces of text after tokenisation.
*The angular similarity between two vectors — a value near 1 means the vectors point in the same direction, indicating semantic similarity.
The proportion of embedding dimensions where both vectors have the same sign.
===
What is the role of an embedding model in a RAG pipeline?
Generating the final response from retrieved documents using the base language model.
*Converting text (queries and documents) into dense vectors so they can be compared for semantic similarity during retrieval.
Compressing retrieved documents into shorter summaries before they enter the context window.
Classifying retrieved documents into topic categories to improve relevance ranking.
===
What is the difference between "sparse" and "dense" retrieval?
*Sparse retrieval (BM25) uses keyword frequency and inverse document frequency; dense retrieval uses embedding similarity — combining both is often more effective than either alone.
Sparse retrieval works on small datasets; dense retrieval scales to large corpora.
Sparse retrieval retrieves fewer documents; dense retrieval retrieves more documents per query.
Sparse retrieval uses the full text; dense retrieval uses only the first sentence of each chunk.
===
What is "metadata filtering" in a vector database and why is it important?
Tagging embedding vectors with quality scores to filter out low-confidence retrievals.
Removing metadata fields from documents before embedding to reduce vector noise.
A post-processing step that filters retrieved documents by their cosine similarity score.
*Restricting vector search to documents matching specific metadata conditions (date, author, category) before or after ANN search — essential for access control and relevance filtering.
===
What is "dimensionality reduction" in the context of embeddings and when is it used?
Reducing the number of documents in an index by merging semantically similar chunks.
Shrinking the embedding model's parameter count to reduce inference cost.
*Compressing high-dimensional embedding vectors into lower dimensions using techniques like PCA or UMAP — used to reduce storage cost, search latency, or to enable 2D/3D visualisation.
A technique for normalising embedding vectors to unit length before storage.
===
What is "vector index freshness" and how is it managed?
*Keeping the vector index up to date as new documents are added or existing documents change — managed through re-indexing pipelines or real-time upsert operations.
The accuracy degradation of ANN indexes over time due to model drift.
The frequency with which vector database providers update their ANN algorithms.
A metric for how recently the embedding model was trained relative to the indexed documents.
===
What is "multi-tenancy" in a vector database and why does it matter for enterprise applications?
The ability to run multiple embedding models simultaneously within the same index.
A deployment pattern that runs the vector database across multiple cloud regions.
A feature that allows multiple users to query the same index concurrently without performance degradation.
*The ability to store and search embeddings for multiple isolated organisations or users within a single database instance, with strict access separation.
===
What is "approximate" nearest-neighbour search and why is it used instead of exact search?
ANN is used because exact search is mathematically impossible in high-dimensional spaces.
*ANN trades a small amount of accuracy for dramatically faster search — exact nearest-neighbour search over millions of vectors is too slow for real-time applications.
ANN returns approximate results to prevent the model from over-fitting to the retrieved content.
ANN is a regulatory requirement for AI systems to prevent deterministic retrieval behaviour.
===
What is the significance of the embedding model's "embedding dimension" for a vector database?
The embedding dimension determines the maximum document length that can be embedded.
Higher embedding dimensions always improve retrieval accuracy regardless of the corpus size.
*The embedding dimension determines storage requirements and search latency — higher dimensions capture more semantic nuance but require more storage and compute for each comparison.
The embedding dimension must match the language model's hidden state size to work correctly.
===
What is "namespace" or "collection" separation in a vector database?
A feature that assigns human-readable names to individual embedding vectors for easier management.
A partitioning technique that stores embeddings alphabetically by document title.
A security mechanism that encrypts different vector partitions with different keys.
*Logically isolating groups of vectors within the same database so different applications or data sources can be searched independently.
===
What is "re-ranking" after vector retrieval and why is it needed?
A technique that re-orders retrieved documents chronologically before injecting them into context.
*A second-stage ranking step that uses a more accurate (but slower) model to re-score the top-k retrieved candidates, improving final result relevance.
A post-retrieval step that removes duplicate content from the retrieved candidate set.
A method for re-embedding retrieved documents with a higher-quality model for final selection.
===
What is "embedding drift" and when does it cause problems?
*When documents and queries are embedded with different model versions, their vectors are in incompatible spaces — retrieval quality degrades significantly.
The gradual degradation of embedding quality as the vector database becomes too large.
The tendency for embedding models to produce less accurate vectors for rare vocabulary over time.
A phenomenon where embeddings become less unique over time as new documents are indexed.
===
What is "chunking" in a RAG pipeline and why is it necessary?
Compressing documents into dense summaries before embedding them.
Dividing the vector index into shards for distributed storage across multiple servers.
*Splitting source documents into smaller segments that fit within the embedding model's token limit and provide focused, retrievable units of information.
Breaking the user's query into sub-questions to improve retrieval coverage.
===
What is "fixed-size chunking" and what is its main limitation?
*Splitting text into chunks of a fixed token count — simple to implement but can cut across sentence or paragraph boundaries, creating incoherent fragments.
Embedding each sentence as its own chunk — produces too many small chunks for efficient indexing.
Dividing documents into fixed numbers of sections regardless of content length.
A chunking method that preserves document structure by splitting only on heading markers.
===
What is "semantic chunking" and what problem does it solve?
Embedding each sentence independently and clustering similar sentences into a single chunk.
Using the embedding model itself to determine the optimal chunk boundaries through similarity analysis.
A chunking method that creates chunks based on the number of distinct concepts they contain.
*Splitting text at semantically meaningful boundaries — paragraphs, topic shifts, section headings — rather than at arbitrary token counts.
===
What is "chunk overlap" and what is its purpose?
Storing multiple copies of the same chunk with different embeddings from different models.
*Repeating a portion of text at the boundary between adjacent chunks to prevent information loss at split points.
A technique for combining the embeddings of two adjacent chunks into a single vector.
Overlapping metadata between chunks so retrieval systems can reconstruct document structure.
===
What is "hierarchical chunking" and when is it appropriate?
Chunking a document tree structure based on its heading hierarchy.
A method where each chunk is embedded at progressively lower dimensions for multi-resolution search.
*Creating chunks at multiple granularity levels — sentence, paragraph, section, document — and linking them, enabling retrieval at the right granularity for different query types.
Chunking documents in order of their importance, processing the most critical sections first.
===
What is a "document parser" in the context of RAG pipelines and why does it matter?
A model component that classifies documents into categories before they are indexed.
A tool that splits documents into chunks based on their natural language structure.
A retrieval component that parses the user's query into structured search parameters.
*Software that extracts clean text from raw file formats (PDF, DOCX, HTML, spreadsheets) before chunking — poor parsing produces garbled chunks that degrade retrieval quality.
===
What is "chunk size" and how should it be chosen?
*The token count of each chunk — chosen empirically based on the embedding model's limits, the granularity of information, and the typical query type, balancing specificity against context completeness.
The file size of the embedded chunk as stored in the vector database.
The number of sentences per chunk, typically fixed at 3–5 for optimal retrieval.
The token count must always match the context window size of the language model.
===
What is "parent-child retrieval" in a RAG system?
A retrieval pattern where parent documents are retrieved first and child documents are retrieved from within them.
*Indexing small child chunks for precise retrieval, but injecting the larger parent chunk into context to provide surrounding information.
A hierarchical permission model where parent users can access all child users' retrieved documents.
A chunking strategy where parent headings are stored as separate chunks above their child content.
===
What is "document-level metadata" and how does it enhance retrieval?
A summary of the document's content stored as a separate embedding for document-level retrieval.
The document's file format and encoding information required by the parser.
Metadata tags embedded within the chunk text to help the language model understand the source.
*Structured information about the document (author, date, source, category, access level) stored alongside chunk embeddings, enabling filtered and context-aware retrieval.
===
What is "index poisoning" and why is it a security concern for RAG systems?
A database corruption attack that corrupts ANN index structures to cause retrieval failures.
A technique used by attackers to extract documents from a vector database by observing query patterns.
*Injecting adversarial or misleading documents into the vector index to manipulate what the system retrieves and ultimately what the LLM says.
The gradual degradation of index quality caused by adding too many similar documents.
===
What is "sparse-dense hybrid indexing"?
An indexing approach that stores small chunks densely and large chunks sparsely to optimise storage.
*Maintaining both a sparse keyword index (BM25) and a dense embedding index, then combining their scores for retrieval to get the benefits of both.
A technique that uses sparse matrix compression to reduce vector storage costs.
An index that switches between sparse and dense retrieval based on query length.
===
What is "incremental indexing" and why does it matter operationally?
*Adding new documents to the index without rebuilding the entire index from scratch — critical for knowledge bases that receive frequent updates.
A technique for progressively improving index quality by re-embedding documents in order of retrieval frequency.
Building the index in stages across multiple machines to reduce memory requirements.
A method that incrementally compresses old embeddings to free space for new documents.
===
What is "content-aware chunking" for structured documents like tables and code?
A chunking technique that embeds the document's style and formatting alongside its text content.
Using the document's own section markers to determine chunk boundaries.
*Treating tables, code blocks, and structured data as atomic units rather than splitting them mid-structure, preserving semantic integrity.
A method that assigns different embedding models to different content types within the same document.
===
What is a "knowledge graph" and how does it complement vector retrieval?
A visual diagram of the vector space showing how document embeddings cluster.
A database of factual triples used to verify the accuracy of LLM-retrieved content.
A graph database version of a vector index that organises embeddings by topic hierarchy.
*A structured representation of entities and their relationships — useful for queries that require multi-hop reasoning across connected concepts that pure semantic search handles poorly.
===
What is "late chunking" in modern RAG pipelines?
Delaying the chunking step until query time, dynamically splitting documents based on query relevance.
*Embedding the full document first with a long-context embedding model, then splitting the contextualised token representations into chunk-level embeddings — preserving full-document context in each chunk's embedding.
A technique that embeds chunks only when they are first queried, rather than pre-computing all embeddings at index time.
A post-retrieval step that re-splits retrieved chunks to fit the available context window.
===
What is "top-k retrieval" and what determines the right value of k?
*Returning the k most similar chunks to the query — k is chosen based on the context window budget, retrieval precision, and how much relevant content a typical query needs.
Retrieving all documents above a cosine similarity threshold, with k as the minimum floor.
A retrieval strategy that always returns exactly 5 chunks regardless of query complexity.
The k top-scored chunks from the sparse keyword index, used before dense re-ranking.
===
What is "query expansion" in retrieval and how does it improve recall?
Expanding the context window to accommodate more retrieved chunks.
Breaking a complex query into sub-queries and retrieving results for each independently.
*Generating alternative phrasings or related terms for the query before retrieval, increasing the chance of matching relevant content that uses different vocabulary.
Adding metadata filters to a query after initial retrieval to narrow results.
===
What is "hypothetical document embedding" (HyDE) and what problem does it solve?
Creating fictional document examples during index creation to improve embedding model training.
*Generating a hypothetical answer to the query, embedding that answer, and using it for retrieval — solving the vocabulary gap between short queries and longer document chunks.
Embedding a hypothetical user persona to personalise retrieval results.
A technique for generating synthetic documents to fill gaps in a sparse knowledge base.
===
What is "multi-query retrieval" and when is it useful?
Sending the same query to multiple vector databases simultaneously and taking the union of results.
Splitting a complex query into sequential sub-queries where each result informs the next.
Retrieving from multiple indexes in parallel to compare coverage across different knowledge bases.
*Generating multiple reformulations of the user's query, retrieving results for each, and merging the results — useful for broad or ambiguous queries where a single phrasing misses relevant content.
===
What is "retrieval precision" versus "retrieval recall" in a RAG context?
*Precision: proportion of retrieved chunks that are actually relevant; Recall: proportion of relevant chunks in the corpus that were successfully retrieved.
Precision: accuracy of the final LLM answer; Recall: proportion of the question that the answer addresses.
Precision: speed of retrieval; Recall: completeness of the indexed corpus.
Precision and recall are the same metric in retrieval contexts — both measure relevance.
===
What is "cross-encoder re-ranking" and how does it differ from bi-encoder retrieval?
Cross-encoders retrieve from multiple embedding models simultaneously, taking the best result.
*Cross-encoders process query and document together in one pass, capturing interactions — more accurate than bi-encoders which encode them independently, but too slow for initial retrieval.
Cross-encoders use keyword overlap alongside semantic similarity for more accurate retrieval.
Cross-encoders are a faster alternative to bi-encoders that sacrifice accuracy for speed.
===
What is "contextual retrieval" (as introduced by Anthropic) and what problem does it solve?
A retrieval technique that uses the conversation history as additional context for query reformulation.
A method where retrieved chunks are summarised before being injected into the LLM context.
A retrieval approach that retrieves both the relevant chunk and its adjacent chunks automatically.
*Prepending a chunk-specific summary of its role within the parent document to each chunk before embedding — solving the problem of chunks that lose meaning without document context.
===
What is "retrieval augmented generation" (RAG) at its most fundamental level?
Training a language model on retrieved web content to keep its knowledge current.
Using a language model to generate improved search queries for a traditional search engine.
*Retrieving relevant external content at query time and injecting it into the LLM context, grounding the response in provided information rather than the model's parametric knowledge alone.
A technique for compressing retrieval results into the model's context window more efficiently.
===
What is "self-querying retrieval" and how does it improve structured knowledge bases?
A retrieval pattern where the model generates its own retrieval queries without user input.
*Using an LLM to convert natural language queries into structured filters for the vector database — combining semantic search with metadata filtering based on the user's intent.
A method where the retrieval system queries itself to identify gaps in the knowledge base.
A technique for retrieving documents that match the style of the user's query rather than its content.
===
What is "reciprocal rank fusion" (RRF) and when is it used?
*A method for combining ranked result lists from multiple retrieval systems by aggregating reciprocal rank positions — used in hybrid retrieval to merge sparse and dense results.
A technique for re-ranking retrieved documents based on their relevance to the full conversation history rather than just the current query.
A scoring method that multiplies the dense retrieval score by the sparse retrieval score.
A fusion technique that averages the embedding vectors of top retrieved chunks before LLM injection.
===
What is "retrieval latency" and why does it matter for user-facing applications?
The delay between a document being added to the corpus and it becoming retrievable.
The time taken for the LLM to process retrieved chunks and generate a response.
*The time taken from query submission to when retrieved chunks are available for the LLM — in user-facing applications, retrieval latency adds directly to perceived response time.
A metric for how quickly the vector index can be rebuilt after a major update.
===
What is "query routing" in a multi-knowledge-base RAG system?
Load-balancing retrieval queries across multiple vector database replicas.
A technique for splitting a complex query into multiple sub-queries routed to different LLMs.
Forwarding unanswerable queries to a human agent after retrieval fails.
*Classifying incoming queries and directing them to the most appropriate knowledge base or retrieval strategy based on query type or domain.
===
What is "passage retrieval" versus "document retrieval"?
Passage retrieval uses embedding similarity; document retrieval uses keyword matching.
*Passage retrieval returns the specific relevant section within a document; document retrieval returns the whole document — passage retrieval is more precise for focused queries.
Passage retrieval is used for short documents; document retrieval is used for long documents.
Passage and document retrieval are equivalent — the distinction is in how results are displayed, not how they are retrieved.
===
What is "negative sampling" in embedding model training and why does it matter for retrieval quality?
Removing low-quality documents from the index to prevent them from being retrieved.
A technique for generating synthetic queries for documents that have no natural associated queries.
*Training the embedding model on hard negative examples — documents that are superficially similar to relevant ones but should be ranked lower — to produce embeddings that distinguish near-duplicates.
Sampling a subset of the corpus to train a small retrieval model for low-resource settings.
===
What is "retrieval evaluation" and what metrics are used?
*Systematic measurement of retrieval quality using metrics like recall@k, precision@k, NDCG, and MRR against a labelled dataset of queries and relevant documents.
An evaluation of the LLM's ability to use retrieved context accurately in its final answer.
A benchmark test that measures how quickly the vector database returns results under load.
An audit of the knowledge base for completeness and accuracy before deploying a RAG system.
===
What is "grounding" in a RAG system and why is it the primary mechanism for reducing hallucination?
Connecting the model to real-time data sources so its knowledge is always current.
A technique for fact-checking model outputs against a database of verified facts after generation.
Anchoring the model's outputs in user-specific context by injecting user profile data.
*Instructing the model to base its response on provided documents only, making fabricated claims verifiable and constraining the model away from its parametric knowledge.
===
What is "faithfulness" as a RAG evaluation metric?
Whether the retrieved documents are factually correct and up to date.
*Whether the model's response accurately reflects the content of the retrieved documents, without adding claims not supported by the retrieved context.
Whether the model responds consistently across multiple runs of the same query.
Whether the model's persona remains consistent with the system prompt throughout the conversation.
===
What is "answer relevance" in RAG evaluation and how does it differ from faithfulness?
Answer relevance measures output length; faithfulness measures citation accuracy.
Answer relevance is an automated metric; faithfulness requires human evaluation.
*Answer relevance measures whether the response addresses the user's question; faithfulness measures whether it is grounded in the retrieved context — a response can be faithful but irrelevant, or relevant but unfaithful.
Answer relevance and faithfulness are the same metric evaluated from different perspectives.
===
What is "source citation" in RAG output and how does it reduce user trust risk?
*Including the source document name, section, or URL for each claim — allowing users to verify responses and signalling that the system is grounded in authoritative content.
A legal requirement that all AI-generated content must attribute its sources.
A technique for improving response quality by forcing the model to read sources more carefully.
A post-processing step that automatically adds Wikipedia links to key terms in the response.
===
What is the "context faithfulness" problem in RAG?
Retrieved context that is outdated or factually incorrect before the model even reads it.
The model refusing to generate responses when retrieved context is insufficient.
A parsing failure where the model cannot read embedded tables or structured data in retrieved chunks.
*The model generating responses that contradict or misrepresent the retrieved context — often by over-relying on its parametric knowledge instead of the provided documents.
===
What is the "knowledge conflict" problem in RAG?
When two retrieved documents contradict each other, leaving the model unable to determine the truth.
When the knowledge base is too large for all relevant documents to fit in the context window.
*When retrieved documents contradict the model's parametric knowledge — the model must decide whether to trust the retrieved content or its training, and often gets this wrong.
When the model's knowledge cutoff pre-dates the retrieved documents, causing integration errors.
===
What is "attribution hallucination" in a RAG context?
*The model claiming a retrieved document says something it does not actually say — accurately citing the source but misrepresenting its content.
Hallucinating a source citation that does not exist in the retrieved documents.
Attributing the response to the wrong retrieved document when multiple are in context.
Generating a response attributed to the user's past statements rather than retrieved documents.
===
What is "RAG versus fine-tuning" and when should each be used to reduce hallucination?
Fine-tuning always produces more accurate responses; RAG is a workaround for models that cannot be fine-tuned.
*RAG injects current, verifiable external content at query time; fine-tuning bakes domain knowledge into weights. RAG is preferred when the knowledge is dynamic, traceable, or requires citation.
RAG is used for factual questions; fine-tuning is used for stylistic adaptation.
RAG and fine-tuning produce identical results — the choice depends only on implementation cost.
===
What is "abstention" and when should a RAG system abstain?
A safety mechanism that prevents the model from generating responses on sensitive topics.
A retrieval strategy that returns no results when confidence is below a threshold.
*Declining to answer when the retrieved context does not contain sufficient information, rather than hallucinating a response.
A technique where the model refers users to human agents instead of answering.
===
What is "chunk context contamination" and how does it cause incorrect responses?
A corruption where encoding errors in retrieved chunks introduce garbled text into the context.
The injection of adversarial content into retrieved chunks by a malicious document author.
A problem where chunks from different documents are combined in a way that creates copyright issues.
*When irrelevant or misleading retrieved chunks are included in the context alongside relevant ones, and the model synthesises information across all of them, producing a confused response.
===
What is "confidence-based routing" in a RAG system?
*Routing queries to different response strategies based on retrieval confidence — high-confidence retrievals go to the LLM; low-confidence ones trigger clarification, abstention, or human escalation.
A technique for routing high-traffic queries to faster model endpoints during peak load.
A method for automatically selecting the most confident retrieved chunk as the sole context.
A routing system that sends low-confidence responses to a human reviewer before delivery.
===
What is "closed-book versus open-book" generation in LLM systems?
Closed-book models cannot access the internet; open-book models can browse the web in real time.
*Closed-book: the model answers from parametric memory only; Open-book (RAG): the model answers from provided documents — open-book is generally more accurate for specific factual questions.
Closed-book generation requires fine-tuning; open-book generation uses the base model.
Closed-book and open-book refer to whether the model's system prompt is visible to users.
===
What is the "faithfulness versus completeness" trade-off in RAG responses?
Faithful responses are shorter; complete responses are longer — the trade-off is response length.
Faithfulness is a user-facing quality; completeness is an internal system metric.
The trade-off only applies when retrieved content is from multiple conflicting sources.
*Maximally faithful responses stick close to retrieved content and may miss information not in the context; complete responses may hallucinate to fill gaps — the balance depends on application risk tolerance.
===
What is "hallucination detection" as a post-generation step?
*Running a secondary check — using an LLM or a fact-checking model — to identify claims in the response that are not supported by the retrieved context.
A pre-generation filter that blocks prompts likely to cause hallucination.
A metric computed from the model's internal token probability distributions.
A technique for identifying hallucinated citations by querying the source database.
===
What is a "grounding score" and how is it used in RAG evaluation?
A score assigned to each retrieved chunk indicating how relevant it is to the query.
A benchmark score that compares RAG system performance against non-RAG baselines.
*A metric that measures what proportion of the response's claims are traceable to the retrieved context — used to monitor and improve RAG faithfulness over time.
A confidence score generated by the LLM indicating how certain it is about its response.
===
What is an "enterprise knowledge system" built on RAG?
*An AI application that connects organisational knowledge sources — policies, documents, databases, wikis — to a language model via retrieval, enabling employees to query internal knowledge in natural language.
A database system that uses AI to automatically categorise and tag enterprise documents.
A model fine-tuned on an organisation's proprietary data to answer internal questions.
A search engine that uses keyword indexing to retrieve enterprise documents faster than traditional search.
===
What is "access control" in an enterprise RAG system and how is it typically implemented?
Encrypting all documents in the vector index to prevent unauthorised access to raw embeddings.
A login system that authenticates users before allowing them to query the knowledge base.
A post-retrieval filter that removes sensitive content from responses before delivery.
*Ensuring users can only retrieve content they are authorised to see — typically through metadata filtering by user role, department, or document classification.
===
What is "knowledge freshness" and how is it managed in a production RAG system?
Using a recent embedding model to ensure indexed documents reflect the latest language patterns.
*Keeping the indexed knowledge current by continuously ingesting new documents, updating changed ones, and removing deprecated ones through automated pipelines.
Restricting retrieval to documents published within the last 90 days to prevent stale answers.
Retraining the language model periodically to incorporate knowledge from the organisation's documents.
===
What is a "knowledge gap" in an enterprise RAG system and how should it be handled?
A discrepancy between what the LLM knows parametrically and what is in the knowledge base.
A retrieval failure caused by poor chunking that prevents the system from finding existing content.
*When the knowledge base does not contain information to answer a query — handled by abstaining gracefully, routing to a human expert, or flagging the gap for knowledge base improvement.
The difference in quality between documents produced by different departments in the organisation.
===
What is "document lifecycle management" in the context of RAG?
*Tracking documents through creation, versioning, expiry, and deletion — ensuring the knowledge base reflects current authoritative versions and removes outdated content.
A content governance process for ensuring documents are written in a RAG-compatible format.
A backup and recovery system for vector database contents.
The process of archiving retrieved responses for audit and compliance purposes.
===
What is "semantic deduplication" in knowledge base curation?
A technique for removing identical files from a document repository before indexing.
Using an LLM to merge similar documents into a single authoritative version.
*Identifying and removing near-duplicate documents or chunks using embedding similarity — preventing the same information from being retrieved multiple times and inflating its apparent importance.
A post-retrieval step that removes duplicate chunks before injecting them into the LLM context.
===
What is "knowledge base segmentation" and when is it appropriate?
Splitting large documents into smaller ones to improve chunking quality.
A technique for distributing the vector database across multiple servers for performance.
Segmenting users into groups that receive different knowledge base access for A/B testing.
*Organising the knowledge base into separate indexes or namespaces by domain, department, or topic — improving retrieval precision and enabling domain-specific access control.
===
What is "RAG observability" and what does it involve?
A technique for making the RAG system's internal workings visible to end users.
*Monitoring and logging the full RAG pipeline — queries, retrieved chunks, generation inputs and outputs — to diagnose failures, measure quality, and identify improvement opportunities.
Real-time monitoring of vector database performance metrics like latency and throughput.
An audit trail of all user queries for compliance and legal discovery purposes.
===
What is "hybrid knowledge architecture" combining structured and unstructured data?
A database architecture that uses different storage formats for different document types.
A retrieval system that uses different embedding models for different content types.
*An AI system that retrieves from both vector databases (for semantic search of unstructured text) and relational databases (for precise structured data queries) and synthesises both in the response.
A knowledge base that mixes publicly available and proprietary documents.
===
What is "personalised retrieval" in an enterprise context?
*Adapting retrieved content based on the user's role, preferences, history, or current project context — surfacing the most relevant content for that specific user rather than generic results.
A technique for retrieving information that matches the user's writing style.
A retrieval strategy that prioritises documents the user has previously accessed.
Adjusting retrieval scores based on the user's department to apply access control.
===
What is "knowledge base quality scoring" and why is it important before RAG deployment?
A technique for benchmarking the knowledge base's retrieval performance against industry standards.
*Assessing the coverage, accuracy, currency, and format quality of documents in the knowledge base before deployment — poor quality input produces poor quality RAG output.
Automatically scoring document importance to prioritise which content to index first.
A compliance assessment of knowledge base content for regulatory requirements.
===
What is "chunking for tables" and why does it require special handling?
Tables should always be embedded as plain text with whitespace preserved to maintain alignment.
Tables in documents should be removed before indexing because they confuse embedding models.
Table cells should each be indexed as separate chunks to maximise retrieval granularity.
*Tables must be preserved as complete atomic units or converted to structured formats, because splitting a table mid-row destroys the row-column relationships needed to interpret the data.
===
What is a "retrieval-augmented fine-tuning" (RAFT) approach?
Fine-tuning an embedding model on domain-specific query-document pairs to improve retrieval quality.
A technique for fine-tuning the entire RAG pipeline jointly — both retriever and generator — on task-specific data.
*Fine-tuning the language model to be better at using retrieved documents — specifically training it to identify relevant context, ignore distractors, and extract answers faithfully.
Using RAG to generate training data for fine-tuning a smaller, more efficient model.
===
What is the "two-stage RAG" architecture and what problem does it solve?
An architecture with two separate knowledge bases — one for retrieval and one for grounding validation.
*A retrieve-then-filter architecture: first retrieve a large candidate set (high recall), then apply a more expensive filter or re-ranker to select the final context (high precision) — solving the precision-recall trade-off.
A two-model architecture where one model retrieves and another model generates the response.
A pipeline that runs two independent RAG calls and merges their responses.
===
What is "RAG evaluation at the pipeline level" and what does it measure?
A performance test that measures the throughput and latency of the production RAG pipeline.
An audit of the RAG system's compliance with data governance policies.
Evaluating the quality of individual components (chunker, embedder, retriever) separately before integration.
*Measuring the end-to-end performance of the complete RAG system — retrieval quality, grounding faithfulness, and answer accuracy — rather than evaluating each component in isolation.
===
What is the most reliable approach for detecting hallucinations in a RAG system's output?
Measuring the model's token probability scores and flagging outputs with low confidence.
*Comparing each claim in the response against the retrieved source documents using an LLM-as-judge evaluation.
Running the same prompt multiple times and flagging responses that differ across runs.
Checking whether any sentences in the response appear verbatim in the training corpus.
===
What is a "factual consistency" check and how is it different from a "factual accuracy" check?
Factual consistency checks grammar and style; factual accuracy checks content.
Factual consistency requires human evaluation; factual accuracy can be automated.
Factual consistency applies to structured data; factual accuracy applies to prose responses.
*Factual consistency checks whether the response aligns with the provided context; factual accuracy checks whether the response reflects real-world truth.
===
What is "SelfCheckGPT" as a hallucination detection technique?
*Generating multiple samples from the same prompt and checking whether consistent facts appear across samples — consistent facts are likely true; inconsistent ones are likely hallucinated.
Asking the model to check its own output for errors before returning the response.
A benchmark dataset for evaluating language models on factual accuracy tasks.
A prompt engineering technique that instructs the model to flag uncertain statements.
===
What is "hallucination taxonomy" and why does it matter for mitigation?
A list of topics on which models are known to hallucinate, used to pre-filter queries.
A structured dataset of known hallucination examples used to evaluate detection systems.
*Classifying hallucinations by type (factual fabrication, attribution error, intrinsic contradiction, extrinsic inconsistency) to identify appropriate mitigations for each.
A metric that measures the severity of hallucinations on a 1–5 scale.
===
What is "entity hallucination" and why is it particularly harmful?
A type of hallucination specific to named entity recognition tasks.
*The model generating incorrect proper nouns — wrong names, companies, dates, statistics, or locations — which appear authoritative and are hard to spot without domain knowledge.
The model misidentifying the entity type (person vs. organisation) in its response.
Hallucinations that only occur when the query involves specific entity categories.
===
What is the "calibration-hallucination connection" in LLMs?
*Poorly calibrated models — those whose confidence scores do not reflect actual accuracy — are more likely to produce hallucinations presented with inappropriate certainty.
Hallucination rates can be reduced by calibrating the temperature parameter during inference.
Calibrated models always produce accurate outputs; uncalibrated models always hallucinate.
The calibration curve can be used to predict the exact hallucination rate for a given model.
===
What is "hallucination red-lining" in deployment?
A technique for highlighting hallucinated text in model outputs for user review.
A safety rating that restricts model use to low-hallucination-risk domains.
A benchmark process for measuring hallucination rate before production deployment.
*Defining topics or query types where hallucination risk is unacceptably high and implementing hard constraints — abstention, human review, or explicit source citation requirements — for those categories.
===
What is "citation grounding" as a hallucination mitigation strategy?
Embedding citations into the model's training data so it learns to attribute claims accurately.
A post-processing step that automatically adds Wikipedia citations to factual claims.
*Requiring the model to cite a specific source document and passage for every factual claim, making unverifiable claims impossible to present as grounded.
A retrieval technique that pre-selects only highly cited documents for inclusion in context.
===
What is the "Needle in a Haystack" test for LLMs?
*A test that places a specific fact in a large context and measures whether the model can accurately retrieve and use it — evaluating context utilisation across the full context window.
A benchmark for measuring how quickly the model can find relevant information in a knowledge base.
A test that checks whether the model hallucinates when the correct answer is rare in its training data.
A technique for identifying the specific training examples most responsible for a hallucination.
===
What is "intrinsic hallucination" versus "extrinsic hallucination"?
Intrinsic hallucinations are generated by the model's internal reasoning; extrinsic ones come from retrieved documents.
Intrinsic hallucinations occur in mathematical tasks; extrinsic ones occur in language tasks.
Intrinsic hallucinations are detectable by automated tools; extrinsic ones require human evaluation.
*Intrinsic hallucinations contradict the provided input context; extrinsic hallucinations add information not present in the context — both are failures but require different detection approaches.
===
What makes number-based claims particularly high-risk for hallucination?
Numerical processing is handled by a different sub-module that is more prone to errors.
*Numbers (statistics, dates, quantities, percentages) are precise, consequential, and the model has no reliable mechanism for generating correct figures it did not memorise from training.
Models are not trained on numerical data, so all numerical outputs are generated randomly.
Numbers require calculation, which LLMs cannot perform accurately without tool use.
===
What is "RAGAs" (Retrieval-Augmented Generation Assessment) and what does it measure?
A dataset of question-answer pairs for benchmarking RAG systems against human baselines.
An API endpoint that scores RAG outputs in real time during production.
*A framework for evaluating RAG systems on faithfulness, answer relevance, context relevance, and context recall — providing a structured suite of automated evaluation metrics.
A set of prompting templates for constructing grounded, hallucination-resistant RAG responses.
===
What is "chain-of-thought faithfulness" and why is it an evaluation concern?
Whether the reasoning chain contains factually accurate intermediate steps.
Whether the reasoning chain is internally consistent without contradictions.
Whether the reasoning chain is sufficiently detailed for the user to follow.
*Whether the model's stated reasoning actually reflects the process it used to arrive at its answer — models can produce plausible-sounding but post-hoc rationalisations.
===
What is the "TruthfulQA" benchmark and what does it measure?
A benchmark for evaluating LLM performance on factual question-answering from Wikipedia.
*A benchmark specifically designed to measure how often LLMs generate false information on questions where common misconceptions or plausible-sounding wrong answers exist.
A dataset of questions that models commonly hallucinate, used to fine-tune against hallucination.
A benchmark that measures whether models accurately report their own uncertainty.
===
What is "grounded generation evaluation" and how does it differ from benchmark evaluation?
*Grounded generation evaluation measures how accurately a model uses provided context for specific documents; benchmark evaluation measures general capability on standardised test sets.
Grounded generation evaluation is automated; benchmark evaluation requires human raters.
Grounded generation evaluation measures speed; benchmark evaluation measures accuracy.
Benchmark evaluation applies to production systems; grounded generation evaluation applies only to research models.
===
What is the difference between "offline evaluation" and "online evaluation" for AI systems?
Offline evaluation is manual; online evaluation is automated.
Offline evaluation applies to model training; online evaluation applies to model inference.
*Offline evaluation uses pre-collected test sets before deployment; online evaluation measures real user interactions and outcomes in production.
Offline evaluation measures accuracy; online evaluation measures latency.
===
What is "BLEU score" and what are its limitations for evaluating LLM outputs?
*BLEU measures n-gram overlap between generated text and reference text — adequate for machine translation but poor for evaluating open-ended generation where many valid responses exist.
BLEU is a benchmarking framework for comparing LLMs across standardised tasks.
BLEU measures semantic similarity between a generated response and a reference answer.
BLEU evaluates the factual accuracy of generated text against a knowledge base.
===
What is "LLM-as-judge" evaluation and what are its failure modes?
A technique where the evaluated model judges its own outputs to self-improve.
A method where multiple LLMs vote on the best response, and the majority opinion is taken as ground truth.
An evaluation approach that uses an LLM to generate the evaluation rubric from task description.
*Using a capable LLM to score or rank other LLM outputs against defined criteria — failure modes include position bias, verbosity bias, self-enhancement bias, and sensitivity to evaluation prompt wording.
===
What is "MMLU" and what does it assess?
A benchmark specifically designed to test model performance on multilingual tasks.
*Massive Multitask Language Understanding — a benchmark covering 57 academic subjects used to assess broad general knowledge and reasoning across disciplines.
A framework for measuring LLM output quality across multiple evaluation dimensions simultaneously.
A benchmark for evaluating multi-modal models on image and text understanding jointly.
===
What is "human evaluation" and when is it irreplaceable in LLM assessment?
Human evaluation is the gold standard for all LLM tasks and should always be preferred over automated metrics.
Human evaluation is used only for compliance checking — automated metrics are preferred for quality assessment.
*Having humans directly assess model outputs — irreplaceable for subjective qualities like tone, appropriateness, nuance, and real-world usefulness that automated metrics cannot capture.
Human evaluation is replaced by LLM-as-judge in all modern evaluation frameworks.
===
What is "task-specific evaluation" and why is it preferred over general benchmarks for production systems?
Evaluating the model on every possible task to ensure generalisation before deployment.
A technique that automatically selects relevant benchmarks based on the system's configuration.
Evaluating each component of an AI pipeline separately rather than end-to-end.
*Evaluating a deployed model on representative samples from its actual use case — more predictive of production performance than general benchmarks which test capabilities the system may never use.
===
What is "win rate" as an evaluation metric for comparing AI systems?
*The proportion of pairwise comparisons where one system's output is preferred over another's — used when there is no single correct answer and quality is comparative.
The percentage of tasks a model completes successfully without error.
A metric that measures how often the AI system's recommendation is accepted by users.
The rate at which one model's outputs match the outputs of a reference model.
===
What is "benchmark contamination" and why does it undermine model comparison?
A testing artefact where models perform differently on the same benchmark across different runs.
*When benchmark questions or answers appear in the model's training data, inflating its measured performance above its true generalisation ability.
The inclusion of culturally biased questions that advantage models trained on Western data.
A technical issue where benchmark evaluation tools produce incorrect scores due to tokenisation differences.
===
What is a "golden test set" in AI evaluation?
The training data used by the model provider, considered the gold standard for model capabilities.
An automatically generated set of test cases derived from the system's most common queries.
A set of adversarial inputs specifically designed to maximise model failures.
*A curated set of representative inputs with expert-verified expected outputs used as the stable reference for evaluating and comparing system versions over time.
===
What is "inter-annotator agreement" in AI evaluation and why is it important?
Agreement between the evaluated model and a reference model on task outputs.
A measure of how consistently the same annotator scores similar outputs over time.
*The degree to which different human evaluators agree on quality scores — low agreement means the evaluation criteria are ambiguous, making scores unreliable benchmarks.
Agreement between automated metrics and human evaluators on the same dataset.
===
What is "evals" in the context of LLM application development?
Manual evaluation sessions where domain experts review model outputs before each release.
*Automated test suites that measure whether an AI system meets defined quality criteria — treated as code, versioned, and run continuously as part of the development process.
A provider-specific term for the accuracy metrics reported in model documentation.
The process of selecting which benchmarks to use for model capability assessment.
===
What is "precision at k" (P@k) and when is it used in AI evaluation?
*The proportion of the top-k results that are relevant — used in retrieval evaluation to measure how many retrieved items are actually useful.
A metric that measures whether the model's k-th generation attempt is correct.
The accuracy of the model on the first k examples in a test set.
A measure of how many of the top-k benchmark tasks a model completes correctly.
===
What is "normalised discounted cumulative gain" (NDCG) and when is it used?
A metric that measures how much a model's performance degrades on normalised (cleaned) test data.
A gain metric that measures information extracted per token in model outputs.
*A rank-weighted retrieval metric that gives higher credit to relevant results appearing earlier in the ranked list — used when the position of relevant results matters.
A normalised version of BLEU that accounts for different response lengths.
===
What is "automated evaluation at scale" and what trade-offs does it involve?
Running the same evaluation simultaneously across many model instances to parallelise testing.
Automatically generating evaluation test cases from production traffic to scale the test set.
A technique for evaluating models without labelled data by measuring distributional properties.
*Using automated metrics (LLM-as-judge, rule-based checks, embedding similarity) to evaluate large volumes of outputs — trading measurement accuracy for coverage and cost.
===
What is "evaluation for safety" as distinct from "evaluation for quality"?
Safety evaluation is done by the model provider; quality evaluation is done by the application developer.
*Safety evaluation tests whether the system produces harmful, biased, or inappropriate outputs; quality evaluation tests whether outputs are accurate, relevant, and useful — these require different test sets and rubrics.
Safety evaluation is a one-time assessment before launch; quality evaluation is continuous.
Safety evaluation applies to the model; quality evaluation applies to the application.
===
What is a "guardrail" in an AI system and what problem does it solve?
*A constraint or check — either pre-generation, inline, or post-generation — that prevents the AI from producing harmful, incorrect, or out-of-scope outputs.
A hardware limit that prevents the AI system from using more compute than allocated.
A legal disclaimer added to AI outputs to limit organisational liability.
A rate limiting mechanism that prevents users from querying the AI too frequently.
===
What is an "input guardrail" and what types of inputs does it typically handle?
A validation that checks whether the user's input is correctly formatted before API submission.
A rate limiter that prevents individual users from sending too many queries per minute.
*A check applied to user input before it reaches the model — handling prompt injection attempts, out-of-scope queries, PII detection, and inappropriate content.
An authentication check that verifies the user's identity before processing their input.
===
What is an "output guardrail" and how does it differ from input filtering?
A post-processing step that formats the model's raw output into the application's display format.
*A check applied to model output before it reaches the user — detecting harmful content, PII leakage, format violations, or grounding failures in the generated response.
A citation requirement that ensures every factual claim in the output has a source.
A response length check that truncates outputs exceeding a defined word limit.
===
What is a "fallback system" in AI application design?
A backup model that activates automatically when the primary model's API is unavailable.
A secondary retrieval system that provides additional context when initial retrieval returns insufficient results.
A logging mechanism that records failed AI interactions for later review and improvement.
*A predefined response or alternative action triggered when the primary AI system fails, produces low-confidence output, or encounters an out-of-scope query.
===
What is "confidence-based routing" and how does it improve reliability?
*Routing queries to different handling paths based on the AI system's assessed confidence — high-confidence queries get automated responses; low-confidence ones get human review or escalation.
Routing different query types to different models based on their measured accuracy for that task.
A load-balancing technique that directs traffic to the highest-confidence model instance.
A technique for choosing between multiple retrieved chunks based on similarity scores.
===
What is a "system prompt guardrail" and how reliable is it as the sole safety mechanism?
A system-level access control that prevents certain users from modifying the system prompt.
*Instructions in the system prompt that tell the model to refuse or handle certain request types — effective as a first layer but insufficient alone, as models can be jailbroken or misled.
A validation that checks the system prompt for prohibited keywords before deployment.
An automated test that verifies the system prompt produces safe outputs before launch.
===
What is a "constitutional AI" approach to guardrails?
A legal framework for AI governance that defines acceptable use policies for AI systems.
A system prompt template structured as a numbered list of rules the model must follow.
A human review process that checks AI outputs against a defined set of ethical guidelines.
*Training a model with a set of principles ("constitution") that it uses to self-critique and revise its outputs — building safety constraints into the model's weights rather than relying only on prompt instructions.
===
What is "PII detection" as a guardrail and why is it critical in enterprise AI?
A technique for verifying that users querying the AI system are who they claim to be.
A monitoring system that alerts administrators when users share personal information with the AI.
*Identifying and redacting personally identifiable information in user inputs or model outputs before it is processed or delivered — critical for privacy compliance (GDPR, DPDP Act) and data governance.
A filter that removes employee names from retrieved documents before they enter the AI context.
===
What is a "topic boundary guardrail" and when is it needed?
A guardrail that prevents the model from generating content on sensitive topics defined in the system prompt.
*A constraint that prevents the model from responding to queries outside the defined scope of the application — redirecting out-of-scope queries rather than attempting to answer them.
A keyword filter that blocks specific terms from appearing in model outputs.
A retrieval filter that excludes documents outside the application's defined knowledge domain.
===
What is "graceful degradation" in AI system design?
*Ensuring that when components fail or confidence is low, the system fails safely — providing partial help, clear uncertainty statements, or human escalation rather than silent failure or unreliable output.
A technique for reducing model capability progressively under high load to maintain availability.
Designing AI outputs to degrade in visual formatting gracefully across different display contexts.
A failover architecture where a simpler model activates when the primary model's API is unavailable.
===
What is "rate limiting" as an AI system guardrail?
A technique for limiting the length of model outputs to reduce latency and cost.
A guardrail that prevents the model from generating more than a defined number of claims per response.
*Restricting the number of queries a user or application can send per time period — preventing abuse, managing cost, and protecting against denial-of-service attacks.
A constraint that limits how many retrieved chunks are included in each LLM context.
===
What is "output validation" as distinct from "output guardrails"?
Output validation is automated; output guardrails require human review.
Output validation applies to generation; guardrails apply to retrieval.
Output validation and guardrails are synonymous — different terms for the same process.
*Output validation checks whether the response meets structural requirements (valid JSON, required fields present, length within bounds); guardrails check whether the content is safe and appropriate.
===
What is "jailbreaking" and why does it matter for guardrail design?
A technique for extracting the system prompt from an AI application to reveal its configuration.
*Crafting adversarial prompts that cause an AI system to bypass its safety instructions and produce content it was configured not to produce.
An attack that exploits vulnerabilities in the API infrastructure rather than the model itself.
A method for accessing premium model capabilities without proper authorisation.
===
What is "monitoring-as-a-guardrail" and how does it complement preventive controls?
A passive safety approach that relies entirely on monitoring rather than implementing active guardrails.
A compliance mechanism that records all AI interactions for regulatory audit purposes.
*Using continuous logging, anomaly detection, and alerting to detect guardrail bypass and quality failures that preventive controls missed — enabling rapid response to emergent issues.
A performance monitoring system that tracks model latency and error rates in production.
===
What is "human-in-the-loop" (HITL) as a reliability mechanism and when is it appropriate?
*Inserting human review at decision points where AI confidence is low or stakes are high — appropriate for high-risk decisions, low-confidence outputs, or novel situations outside the AI's training distribution.
A development practice where humans write all prompts and review all outputs before deployment.
A training technique where human feedback is used to improve the model's quality iteratively.
A safety requirement mandating human approval for every AI output before it is delivered.
===
What is "production monitoring" for an AI system and what metrics should be tracked?
A pre-launch testing phase that simulates production traffic to identify performance bottlenecks.
Manual review of a random sample of production outputs by quality assurance analysts.
A compliance audit that checks whether the AI system's outputs meet regulatory requirements.
*Continuously measuring system health in live deployment — tracking output quality, user satisfaction, guardrail trigger rates, latency, error rates, and hallucination indicators.
===
What is "A/B testing" for AI systems and what makes it valid?
Testing two model versions simultaneously and selecting the one with lower error rate.
*Comparing two system variants with random assignment of real traffic — valid when there is a pre-defined success metric, sufficient sample size, and only the tested variable differs between conditions.
Running the same test twice — once in development and once in production — and comparing results.
Presenting users with two AI responses and asking them to choose the better one.
===
What is "shadow testing" for AI system deployment?
A testing approach where the development team tests the system without telling the client.
A technique for testing the AI system against adversarial inputs without the knowledge of the model provider.
*Running the new system in parallel with the production system on the same live traffic, comparing outputs without exposing users to the new system's responses.
Running a simplified version of the system in a lower-cost environment to simulate production.
===
What is "canary deployment" in the context of AI systems?
*Gradually rolling out a new system version to a small percentage of users, monitoring quality metrics, before full deployment — limiting exposure if the new version underperforms.
A technique for testing the AI system on a small subset of the training data before full evaluation.
Deploying a simplified version of the system to test infrastructure performance under load.
A monitoring approach that uses a small set of "canary" test queries run continuously against production.
===
What is "regression testing" for AI systems and what triggers it?
Testing the system on tasks it previously failed to verify that the failures have been fixed.
A scheduled monthly evaluation of system quality against industry benchmarks.
A test that measures whether the system's performance degrades as the knowledge base grows.
*Running a fixed test suite after any change (prompt update, model version change, retrieval change) to verify that previously passing cases still pass — triggered by any system modification.
===
What is "latency monitoring" for AI applications and why does it matter for user experience?
A technique for measuring how quickly the model generates tokens per second.
Monitoring API rate limit errors caused by exceeding the provider's request quota.
*Tracking time-to-first-token, total generation time, and end-to-end response time — slow responses directly reduce user engagement and perceived quality.
Tracking how quickly new documents are indexed into the vector database.
===
What is "semantic drift" monitoring and when is it triggered?
*Tracking whether the distribution of topics and intents in user queries shifts over time — triggered when queries increasingly fall outside the system's designed domain.
Monitoring whether the model's response style drifts from the defined persona over time.
Detecting when the embedding model's representation of the same text changes after a model update.
Tracking whether users increasingly phrase queries in ways that cause retrieval to fail.
===
What is "cost monitoring" for AI applications and what should it alert on?
Monitoring the computational resources consumed by the model provider's infrastructure.
*Tracking token consumption, API costs, and cost per user interaction — alerting on unexpected spikes that may indicate misuse, runaway sessions, or system prompt changes with unintended cost implications.
Tracking whether the organisation is within its contracted API usage tier.
A procurement process for reviewing and approving AI service spending.
===
What is "error rate monitoring" for AI applications?
Monitoring the number of factually incorrect responses produced per day.
A metric for measuring how often the AI system fails to retrieve relevant documents.
*Tracking the frequency of API errors, timeout failures, parsing errors in structured outputs, and guardrail trigger events — essential for distinguishing systemic from transient failures.
Tracking the rate at which users report dissatisfaction with AI responses.
===
What is "user feedback collection" in AI application monitoring?
A compliance mechanism that requires users to confirm they understand AI responses may be inaccurate.
A technique for using user conversations to create fine-tuning training data.
A survey sent to users after each session to collect overall satisfaction scores.
*Capturing explicit signals (thumbs up/down, ratings, reports) and implicit signals (session abandonment, follow-up queries) from users to identify output quality issues at scale.
===
What is "chaos testing" for AI systems?
*Deliberately injecting failures — API timeouts, malformed retrieved chunks, context window overflows, guardrail triggers — to verify that the system handles failures gracefully and reliably.
A technique for testing AI safety by deliberately providing dangerous prompts to assess guardrail effectiveness.
A random query generation approach for discovering unexpected model failure modes.
A load testing methodology that simulates peak traffic to assess system stability.
===
What is "output consistency testing" and why is it important for structured outputs?
Testing whether the model produces the same response to the same query across multiple runs.
*Testing whether the system produces structurally valid outputs (valid JSON, required fields, correct types) across diverse inputs — critical for downstream systems that parse model outputs.
Checking that all responses share the same tone and style as defined in the system prompt.
Verifying that citation formatting in responses is consistent across different document types.
===
What is "end-to-end testing" for a RAG pipeline?
Testing each component of the pipeline independently before integration.
A performance test that measures total pipeline latency from input to output.
A compliance test that verifies the pipeline meets data processing regulations end-to-end.
*Testing the complete system from user query to final response — including retrieval, context assembly, generation, and output validation — using representative real-world queries.
===
What is "load testing" for AI applications and what does it reveal?
*Simulating high-traffic conditions to identify performance degradation, rate limit failures, increased latency, and cost spikes that only appear under load — distinct from nominal performance.
Testing the model's performance on a large number of diverse test cases.
A benchmark that measures how many tokens per second the model can process.
A technique for testing the knowledge base's capacity as the number of indexed documents grows.
===
What is "observability" for AI systems and how does it differ from monitoring?
Observability is a compliance term for audit logging; monitoring is a technical term for performance tracking.
Observability applies to the model provider's infrastructure; monitoring applies to the application layer.
*Observability provides the ability to understand system behaviour from its outputs — through logging, tracing, and metrics — enabling debugging of novel failures; monitoring tracks predefined metrics for known failure modes.
Observability and monitoring are the same concept — used interchangeably in AI system design.
===
What is the role of human oversight in high-stakes AI applications?
*Providing a review and approval mechanism for AI outputs where errors have significant consequences — ensuring that AI recommendations are verified by qualified humans before action is taken.
Monitoring AI systems for compliance violations on behalf of regulatory bodies.
Reviewing and approving AI system design before deployment to verify safety properties.
A legal requirement mandating that humans review every AI output before delivery.
===
What is "red-teaming" an AI system and what does it accomplish?
A performance review process where internal teams compete to identify the most efficient prompts.
An evaluation methodology that uses red (bad) and green (good) labels to classify model outputs.
A regulatory requirement for AI systems operating in certain industries.
*Structured adversarial testing by a dedicated team that attempts to find failure modes, safety gaps, and misuse vectors — producing a documented inventory of vulnerabilities before deployment.
===
What is "adversarial robustness" and why is it evaluated separately from general accuracy?
A measure of how accurately the system performs on difficult but naturally occurring test cases.
*The system's ability to maintain correct and safe behaviour under deliberate adversarial inputs — a distinct capability from performing well on standard or representative inputs.
The system's ability to maintain performance as the volume of adversarial competitors increases.
A benchmark for systems deployed in security-critical environments like cybersecurity.
===
What is "bias evaluation" in AI systems and what types of bias are tested?
An evaluation of whether the model's training data contains balanced representation across all topics.
A technique for removing biased language from model outputs in post-processing.
*Systematically testing whether the system produces different quality outputs for different demographic groups, topics, or phrasings in ways that reflect discriminatory patterns.
A regulatory assessment of whether the AI system was built with diverse team representation.
===
What is "prompt injection testing" and why is it critical for RAG systems?
*Testing whether adversarial content in retrieved documents can override system prompt instructions — critical for RAG systems that retrieve from untrusted or user-supplied content.
A technique for testing whether the system prompt can be extracted by users through targeted queries.
Testing whether the model can resist attempts to change its output format through user prompts.
A security audit of the API infrastructure for injection vulnerabilities in the HTTP layer.
===
What is the "alignment tax" and why does it create evaluation trade-offs?
A cost charged by model providers for access to safety features like content filtering.
The time investment required to implement safety alignment in an AI system.
*The reduction in raw task performance that safety-aligned models sometimes exhibit compared to unaligned models — evaluating aligned systems requires balancing safety and capability metrics.
The performance overhead of running safety classifiers in parallel with the main model.
===
What is "scalable oversight" as an AI safety concept relevant to evaluation?
Scaling the number of human reviewers proportionally as AI output volume increases.
A technique for automating the oversight of AI systems to reduce human review requirements.
The practice of delegating AI oversight to external auditors as systems become too complex for internal teams.
*Methods for maintaining meaningful human oversight as AI systems become more capable and produce outputs that are increasingly difficult for humans to evaluate directly.
===
What is a "safety benchmark" for LLMs and what does it measure?
A benchmark that measures a model's ability to reason about safety scenarios presented in text.
*A structured evaluation of whether a model reliably refuses harmful requests, avoids producing dangerous content, and behaves in accordance with safety guidelines across diverse adversarial inputs.
An industry certification that verifies an AI system has passed minimum safety requirements.
A benchmark for measuring the probability that a model will generate harmful content during normal use.
===
What is "out-of-distribution" (OOD) testing and why is it important for AI reliability?
Testing a model on data from a different organisation or domain than the one it was deployed for.
A technique for evaluating model performance when the evaluation dataset is different from the training dataset.
*Testing model behaviour on inputs significantly different from those seen during training or evaluation — revealing how the system handles real-world variation and edge cases.
Testing the system on queries that fall outside the intended topic scope of the application.
===
What is "evaluation versioning" and why does it matter?
*Keeping evaluation test sets and scoring rubrics stable across system versions so that improvements and regressions can be measured consistently over time.
A technique for automatically updating evaluation criteria as the system evolves.
Maintaining separate evaluation frameworks for different model versions.
A data management practice for archiving historical evaluation results.
===
What is "multi-stakeholder evaluation" in enterprise AI deployment?
A governance process where multiple teams jointly approve AI system design before deployment.
*Evaluating AI system quality from the perspectives of multiple stakeholders — users, administrators, domain experts, compliance teams — who may have different and sometimes conflicting quality requirements.
An evaluation methodology that weights different test cases by their business importance.
A technique for collecting evaluation feedback from a diverse representative sample of users.
===
What is "pre-deployment safety review" and what does it involve?
A performance review process that validates the system meets speed and cost requirements before launch.
A compliance check that verifies the system's data handling practices meet regulatory requirements.
An internal approval process where senior management signs off on AI system deployment.
*A structured assessment of an AI system's safety properties before release — including red-teaming, bias evaluation, guardrail testing, and documentation of residual risks.
===
What is the difference between "safety" and "alignment" in AI evaluation?
Safety is evaluated by external auditors; alignment is evaluated by the development team.
Safety applies to the model; alignment applies to the application layer built on top of the model.
*Safety evaluates whether the system avoids causing harm; alignment evaluates whether the system does what its designers intended — a system can be safe but misaligned, or aligned but unsafe.
Safety and alignment are synonymous terms used in different research communities.
===
What is "human preference evaluation" and what are its limitations?
A technique for using human preferences to define the gold standard for AI quality.
*Measuring which AI outputs humans prefer in pairwise or rating evaluations — useful for quality assessment but biased toward confident, fluent, long responses regardless of accuracy.
An evaluation approach that aggregates user satisfaction scores from production interactions.
Human preference evaluation is the most reliable method for all AI quality assessment tasks.
===
What is the "evaluation flywheel" in AI product development?
A technique for automating the full evaluation pipeline to reduce manual evaluation effort over time.
A metric that measures how quickly the AI system improves over successive model versions.
A team structure where evaluation responsibilities rotate across product, engineering, and data science.
*The continuous improvement cycle: evaluate → identify failures → improve system → evaluate again — where each cycle produces better evaluations, better systems, and better understanding of remaining gaps.
===
A product team ships an AI feature that gives confidently worded answers but is wrong 20% of the time. What UX pattern best mitigates trust erosion?
Remove the feature until accuracy reaches 100%
*Show confidence scores or hedged language so users calibrate trust appropriately
Add a disclaimer in the terms of service
Increase font size of outputs to appear more authoritative
===
Which design principle best describes showing users why an AI made a specific recommendation?
Latency optimisation
A/B testing
Feature gating
*Explainability
===
A user completes a task using an AI assistant but cannot remember if the AI did it or they did. This is a failure of:
*Agency transparency
Latency management
Prompt injection prevention
Output formatting
===
What is the primary purpose of an undo or revert affordance in an AI-powered product?
Reducing API costs
Improving model accuracy
*Restoring user control after AI-initiated actions
Satisfying GDPR requirements
===
A language learning app uses AI to grade essays. Students report feeling judged rather than helped. The most effective UX fix is:
Remove AI grading entirely
*Frame AI feedback as suggestions with a growth-oriented tone
Switch to a different model
Add more correction categories
===
When is progressive disclosure most valuable in an AI product interface?
*When AI outputs are complex and users may only need a summary initially
When the AI has low latency
When the model is fine-tuned
When the product is in beta
===
A PM notices users frequently edit AI-generated content before using it. This behavior most likely indicates:
The model needs to be replaced
Users do not trust AI in principle
The feature should be removed
*The AI output is directionally useful but not precise enough for direct use
===
What does appropriate reliance mean in the context of AI-assisted decision-making?
Users always follow AI recommendations
Users ignore AI and make independent decisions
*Users trust AI when it is correct and override it when it is wrong
Users rate AI outputs before acting on them
===
An AI product shows users a generated by AI label on all outputs. The main benefit of this label is:
*Setting accurate expectations and enabling informed verification
Increasing click-through rates
Reducing model inference costs
Satisfying animation guidelines
===
Which user segment is most likely to experience automation bias when using an AI product?
Expert users with deep domain knowledge
Users who dislike technology
Users who frequently edit AI outputs
*Users under time pressure with limited domain expertise
===
A product team wants to measure user trust in their AI feature. The most direct behavioral metric is:
Daily active users
*Rate at which users act on AI suggestions without modification
Time to first interaction
Net Promoter Score
===
What is the risk of making AI features invisible or seamlessly integrated with no indication to users?
Latency increases significantly
Model fine-tuning becomes more expensive
*Users cannot calibrate trust or know when to verify outputs
API rate limits are more likely to be hit
===
A fintech product uses AI to flag suspicious transactions. False positives frustrate users. The best UX approach is:
Remove the flagging feature
Increase the flagging threshold to reduce all flags
Add more flags to balance the false positives
*Show the reason for the flag and provide a clear dispute path
===
A product manager wants to build user confidence in a new AI writing assistant. The most effective early onboarding move is:
Displaying model benchmarks on the landing page
*Showing users a before and after example of a task the AI improved
Requiring users to complete a tutorial before using the product
Adding a disclaimer about AI limitations
===
Which of the following is a signal that users have developed appropriate mental models of an AI product?
*Users choose when to use the AI feature and when to handle tasks manually
Users always use the AI feature for every task
Users never override AI suggestions
Users spend more time on the product
===
A PM must decide whether to build a custom model or use a third-party LLM API. The most critical factor in this decision is:
Whether the CEO prefers open-source or proprietary models
Whether the team has Python skills
*Whether the required capability gap justifies the cost and maintenance overhead of custom development
Whether competitors are using custom models
===
When evaluating AI features for a product roadmap, which framework best captures the unique risks of AI?
*Impact-effort matrix weighted for failure mode severity
Story point estimation
Velocity tracking
RICE scoring without modification
===
A product team receives a request to add a generative AI chatbot to a healthcare app. The first decision gate should be:
Choosing between GPT-4 and Claude
Designing the chat UI
Estimating development time
*Assessing regulatory requirements and liability for AI-generated health information
===
A PM sees that an AI feature has high usage but low satisfaction scores. The most productive next step is:
Increasing inference speed
*Qualitative research to understand the gap between usage intent and output quality
Switching the underlying model
Adding more features to the same surface
===
Which metric best signals that an AI feature is creating genuine product value rather than just generating engagement?
Session duration
Number of AI queries per session
*Task completion rate for outcomes users could not achieve before the feature
Feature discovery rate
===
A PM is deciding whether to launch an AI feature in beta or full release. The strongest argument for beta is:
Beta features are free to build
Beta reduces API costs
Full release requires board approval
*The failure mode of AI errors in production requires real user feedback before full exposure
===
A startup wants to use AI to automate customer support. The most important pre-launch question is:
*What happens when the AI gives an incorrect or harmful response to a customer?
Which LLM has the lowest per-token cost?
How fast can we ship the chatbot?
Should the chatbot have a name?
===
A product decision to remove human review from an AI-powered loan decisioning system should be gated on:
Speed improvement metrics alone
*Demonstrated accuracy across demographic segments and regulatory clearance
Cost savings projections
Model benchmark scores on public datasets
===
Which of the following is the strongest signal that a product team has underinvested in AI product quality?
The team uses a third-party API
The product has a free tier
The team ships weekly
*Users frequently screenshot AI outputs and manually share them to get corrections
===
When should a PM introduce model versioning as a product requirement?
Only when enterprise customers request it
After reaching 1 million users
*When the product core experience depends on consistent AI behaviour across releases
When switching from one provider to another
===
A team ships an AI feature and notices a drop in retention among a specific user cohort. The most likely AI-specific cause is:
The feature is too slow
*The feature produces outputs that do not match that cohort context, language, or needs
The feature is too cheap
The feature was not announced in release notes
===
A PM wants to reduce AI hallucinations without waiting for model improvements. The best product-level intervention is:
*Constraining the AI to only answer within a verified knowledge base and surfacing citations
Increasing the temperature parameter
Adding more tokens to the context window
Switching to a larger model
===
A product team is debating whether to show AI-generated content inline or in a separate review panel. The main variable determining the right answer is:
Which design pattern is more common in the market
The team design preferences
*How consequential errors would be if users act on them without reviewing
The number of tokens in each output
===
Which of the following is a product-level solution to AI bias in a hiring tool?
Using a larger model
Adding more training data
Reducing the temperature
*Auditing output distributions across candidate demographic groups before launch
===
A PM must decide between two AI features: one that delights 10% of users intensely and one that mildly improves the experience for 80%. The decision framework should prioritise:
The feature with the larger user count always
*Strategic fit with the product core value proposition and retention impact
The feature with the higher NPS lift always
The feature that is cheaper to build
===
A product team has three AI feature requests: faster inference, better accuracy, and an explainability panel. How should they prioritise?
*By mapping each to the top user pain point identified in research
Accuracy first, always
Ship all three simultaneously
Start with explainability because it is cheapest
===
Which prioritisation signal most directly indicates that an AI feature should be deprioritised?
The feature takes more than two sprints to build
The feature requires a new model
*Users who discover the feature do not return to use it a second time
The feature has no competitor equivalent
===
A PM has limited engineering capacity. An AI feature is requested by the top 5 enterprise customers but not by any self-serve users. The best response is:
Immediately prioritise it because enterprise revenue is higher
*Evaluate whether the enterprise use case is a leading indicator of broader need
Ignore it because it has no self-serve demand
Ask the customers to pay for custom development
===
A product team is using a jobs-to-be-done framework to evaluate AI features. What does this approach prioritise?
Technical capability benchmarks
The frequency with which a feature is used
Revenue per feature
*The functional progress users are trying to make, not the features themselves
===
When should AI personalisation be prioritised over a general-purpose AI feature?
*When there is strong evidence that user context meaningfully changes the optimal output
Always, because personalisation is always better
Only for enterprise tiers
When the team has idle ML engineers
===
A team is building an AI product. They can invest in either model accuracy improvements or UI improvements for the same cost. Research shows users blame the UI when they distrust outputs. What should they prioritise?
Model accuracy, because ground truth matters more
*UI improvements, because trust perception is currently the binding constraint
Neither, wait for user feedback
Build both in parallel
===
A product manager receives conflicting feature requests from power users and new users for the same AI surface. The right approach is:
Prioritise power users because they generate more revenue
Prioritise new users because they represent growth
Build two separate products
*Design for progressive complexity - simple defaults with power user controls accessible on demand
===
Which type of AI feature should be given the highest priority for early kill decision-making?
Features with low usage rates
Features that are technically complex to maintain
*Features that produce harmful or misleading outputs even in edge cases
Features that exceed budget
===
A startup AI product has 10 feature ideas and 3 months of runway. The correct prioritisation lens is:
Which feature users mentioned most in surveys
*Which single feature most increases the probability of survival through retention or revenue
Which feature is easiest to build
Which feature the founder finds most interesting
===
A PM is evaluating two AI features: one with high ceiling impact but high variance, and one with moderate but reliable impact. Which is preferable in a mature product with a large user base?
*The reliable impact feature, because variance at scale creates unpredictable user experience
The high ceiling feature, because ambition signals product leadership
The feature that ships first
The feature preferred by the design team
===
A PM must decide when to sunset an AI feature. The strongest signal is:
The feature has been live for more than one year
A competitor has shipped a similar feature
*Maintenance cost exceeds the value delivered relative to alternative uses of the same engineering time
The original PM who built it has left
===
A team has data showing that 90% of users only use 20% of the AI features. What should the roadmap prioritise?
Marketing the unused 80% to increase adoption
Removing the 20% and rebuilding with new features
Adding even more features to increase surface area
*Deepening the 20% of features most used, not expanding the unused 80%
===
Which of the following is the best leading indicator for an AI feature long-term retention impact?
Feature launch day traffic
*Whether users who adopt the feature have higher 30-day retention than those who do not
Number of press mentions at launch
Internal team excitement about the feature
===
A product team is prioritising between an AI feature that improves the core workflow and one that is novel but peripheral. The correct default is:
Novel feature, because it generates press coverage
Peripheral feature, because it differentiates from competitors
*Core workflow improvement, because retention impact is higher for features on the critical path
Whichever is cheaper to build
===
A PM receives a request to add an AI feature that would require collecting additional user data. The first question is:
*Whether the value the feature delivers justifies the privacy cost and user consent requirement
Whether the data is available to purchase
Whether the feature has a competitor equivalent
Whether the model supports the data type
===
A PM is mapping user workflows to identify where AI can add the most value. The highest-value AI insertion point is typically:
Steps that users enjoy the most
Steps that happen at the end of the workflow
Steps that require no data
*Steps that are high-frequency, cognitively demanding, and have predictable structure
===
A user research session reveals that users complete a workflow faster with AI but feel less ownership over the output. This is a signal to:
Remove the AI feature
*Redesign the AI interaction to give users meaningful editorial control at key steps
Add more AI automation to reduce effort further
Change the underlying model
===
Which workflow insertion pattern is most appropriate when AI errors are costly and hard to reverse?
Full automation with post-hoc audit
AI acting autonomously and logging decisions
*AI as a drafting assistant with mandatory human review before any action is taken
Removing AI from the workflow until errors reach zero
===
A product team notices that users skip the AI suggestion step in a workflow and complete the task manually. The most likely reason is:
*The AI suggestion is too generic and does not save meaningful time for this workflow
Users prefer typing
The AI is too slow
The feature is not visible enough
===
In a document editing product, AI suggestions are shown inline but users report feeling distracted. The best UX fix is:
Increasing the font size of suggestions
Making suggestions appear faster
Requiring users to accept all suggestions before proceeding
*Moving AI suggestions to a sidebar or making them opt-in rather than always-on
===
A PM is designing an AI onboarding flow. The most effective early moment is:
Showing a feature list video
Asking users to rate the AI before using it
*Having the AI complete a real task for the user using their actual data
Requiring users to complete a quiz about AI
===
A workflow automation product allows AI to take multi-step actions on behalf of users. The most important design requirement is:
*A clear audit trail showing every action the AI took and why
Minimising the number of steps shown to the user
Hiding AI decision points to avoid confusion
Allowing the AI to modify its own instructions
===
When designing an AI-assisted research workflow, which principle most improves output quality?
Removing user control to reduce decision fatigue
*Giving users control over what sources the AI searches and how results are filtered
Maximising the number of results returned
Hiding source information to simplify the display
===
A team notices that AI-generated summaries are used directly without review in 70% of cases. This observation most warrants:
Improving the summary model
Reducing the length of summaries
*Adding inline quality signals and encouraging review for high-stakes summaries
Removing the human review option
===
A support tool uses AI to draft responses for agents. Agents report copying AI drafts verbatim without reading them. The product risk is:
Agents becoming too fast
Support costs dropping too quickly
AI drafts becoming longer over time
*Harmful or incorrect responses reaching customers without human verification
===
A PM is designing a feedback mechanism for AI workflow outputs. The most useful feedback type for model improvement is:
*Specific inline edits made by users, captured as diff data
Star ratings after task completion
Binary thumbs up or down without context
NPS surveys sent monthly
===
A product manager is evaluating whether to add AI to a simple, well-understood workflow. The key question is:
Whether the team has the AI budget
*Whether AI reduces friction enough to justify the added complexity and failure risk
Whether competitors have AI in this workflow
Whether the design team prefers AI interfaces
===
A product allows users to delegate tasks to an AI agent. Users hesitate to delegate high-stakes tasks. The best product response is:
Increasing the AI agent autonomy
Marketing the agent accuracy more aggressively
Restricting agent use to low-stakes tasks only
*Providing transparency into agent actions and an easy recall or cancel mechanism
===
A workflow product tracks that AI-assisted tasks take 40% less time but user satisfaction is flat. The most likely explanation is:
*Speed improvement alone does not address the quality or confidence gap users experience with AI outputs
Users prefer slower workflows
The feature has not been marketed enough
The AI is using the wrong model
===
A PM wants to design an AI feature that helps users make better decisions rather than making decisions for them. The correct design pattern is:
Full automation - letting the AI decide and notifying the user
Removing the decision step entirely from the workflow
*Decision support - surfacing relevant information, options, and tradeoffs without prescribing a choice
Adding more data fields for users to fill in before the AI acts
===
A PM wants to measure the ROI of an AI feature for an internal operations team. The most direct metric is:
*Time saved per task multiplied by the number of tasks and loaded staff cost
Number of AI requests made per day
Model accuracy on internal benchmarks
Number of features shipped using AI
===
An operations team adopts an AI tool but usage drops after week 2. The most likely cause is:
The tool is too expensive
The team lacks technical skills
The model version changed
*Initial novelty wore off and the tool does not save enough time to justify the behaviour change
===
Which operational AI use case has the highest value threshold for accuracy?
Email subject line generation
*Medical diagnosis support, where errors directly affect patient outcomes
Blog post summarisation
Social media caption writing
===
A team deploys an AI tool for internal knowledge retrieval. After launch, employees report using it less than the old search system. The most productive diagnostic question is:
Is the AI model large enough?
Was there sufficient marketing for the new tool?
*Are users finding what they need faster with the old system, and why does the AI fail to match that?
Is the system deployed in the cloud?
===
An AI coding assistant is deployed to a 50-person engineering team. What is the most important operational metric to track after 30 days?
*Change in pull request review cycles and defect rates, not just lines of code generated
Number of AI code suggestions accepted
Total tokens consumed by the team
How often engineers open the tool
===
A PM is building the business case for an internal AI tool. Stakeholders ask for the payback period. What inputs are required?
Model benchmark scores and API latency
Number of AI features available in the tool
*Total implementation cost, ongoing API cost, and measurable time saved per user per week
Competitor adoption rates
===
An internal AI assistant is deployed across departments with different workflows. Adoption is high in marketing but low in finance. The most likely reason is:
Finance employees are less technically sophisticated
Marketing has a larger team
Finance did not receive the announcement email
*The AI outputs are better calibrated for unstructured creative tasks than for the precise, regulated outputs finance requires
===
A company deploys AI to handle tier-1 customer support. The correct escalation design is:
AI handles all queries including complaints and legal threats
*AI handles routine queries and escalates to humans when confidence is low or the issue is sensitive
AI only handles queries when human agents are unavailable
Humans handle all queries and AI only logs them
===
A product manager wants to track whether an AI tool improves employee productivity without creating new risks. Which metric pair is most complete?
Usage frequency plus session length
Tokens consumed plus model version
*Output quality maintained plus time per task reduced
Number of prompts submitted plus acceptance rate
===
A PM launches an AI feature that automates a manual data entry workflow. Six months later the team reports the manual workflow has atrophied and no one remembers how to do it. This is a risk of:
*Over-automation creating single points of failure and skill degradation
Successful adoption
High user satisfaction
Strong retention metrics
===
A PM is evaluating three AI vendors for an internal HR tool. Beyond accuracy and cost, the most important evaluation criterion is:
The vendor market share
*Data privacy terms, including who owns training rights over submitted employee data
Whether the vendor offers a free trial
Whether the vendor has a mobile app
===
A PM notices that AI-generated reports are used in board presentations without any human editing. The correct product response is:
Improving model quality to match human-level writing
Disabling the export function
Removing the report generation feature
*Adding a mandatory review checklist and clearly marking content as AI-generated before export
===
Which of the following best describes the operational risk of prompt injection in an enterprise AI tool?
The model runs out of context window during a long prompt
Users ask the AI questions outside its intended domain
*Malicious input in user-submitted data causes the AI to take unauthorised actions or leak information
The AI produces outputs that are too long for the UI to display
===
An internal AI tool is being used by employees to generate external-facing content. The biggest operational governance risk is:
Employees spending too much time using the tool
*AI-generated content being published without review, creating accuracy or brand-voice issues
The tool generating content faster than the marketing team can review
The tool learning from employee writing style
===
A PM is writing success criteria for an AI operational tool six months post-launch. Which set of criteria is most complete?
Adoption rate plus number of features shipped
API uptime plus token cost within budget
Number of support tickets raised about the tool
*Adoption rate plus measurable time saved plus error rate maintained below threshold plus positive user feedback
===
A founder wants to build a working web app prototype in 48 hours without a development team. The best AI-native approach is:
Hire a contractor to write the spec first
*Use a natural language-to-code tool to generate a working prototype from a plain English spec, then iterate
Wait until the team can properly architect the backend
Build in Figma only and call it a prototype
===
What is vibe coding as a practise in AI-native product development?
Writing code while listening to music to improve focus
Using AI-generated music as a backend for audio apps
A style of pair programming where both engineers code simultaneously
*Using conversational AI to iterate on code through natural language instructions, accepting imperfect output and steering toward the goal
===
A non-engineer founder is building a Chrome extension using Claude. They get a working build on the third iteration. What is the most important practise to maintain momentum?
*Test each iteration against the specific use case before requesting the next change
Accept all AI output without testing to move faster
Switch to a different AI tool for each iteration
Hire an engineer to review every AI output
===
When building a rapid AI prototype, which type of input gives an AI coding tool the most useful starting point?
A list of all desired features
A database schema
*A concrete user story describing what a specific user does, not what the system does
An architecture diagram
===
A team uses AI to generate a prototype in 2 days. A stakeholder asks them to clean it up before showing investors. The AI-native approach to this request is:
Rewrite the entire codebase from scratch
*Ask the AI to refactor for readability and add comments, then review the key interaction paths manually
Decline the request because prototypes should not be cleaned up
Hand off to a senior engineer to rewrite
===
What is the primary risk of using AI-generated code in production without review?
*Security vulnerabilities and logic errors that the AI introduced but did not flag
The code will be too slow
The code will not run on all browsers
AI licensing restrictions prevent production use
===
A solo founder uses AI to build a working SaaS MVP. The first feature they should prioritise shipping is:
The admin dashboard
The settings page
The onboarding email sequence
*The one feature that allows a real user to complete the core job-to-be-done end to end
===
When should a rapid AI prototype be discarded rather than refactored into a production codebase?
After every prototype, always
Only if the prototype did not work
*When the prototype was built with speed-first decisions that create architectural debt incompatible with production requirements
When it takes longer than one week to build
===
A developer uses an AI tool to generate a database schema from a natural language description. The most important post-generation step is:
*Validating that the schema reflects actual data relationships and will support the required queries
Accepting the schema immediately to save time
Asking the AI to generate the schema again with different words
Converting the schema to a different database engine
===
What does context window as a scratchpad mean in AI-native development practise?
Storing code snippets in a text file
Using the terminal as the primary development environment
Keeping AI outputs in a separate document for later review
*Using the conversation history with the AI to maintain project state, decisions, and constraints across a session
===
A team prototyping with AI notices the AI frequently forgets earlier constraints as the conversation grows. The best mitigation is:
Starting a new conversation for every change
*Re-stating key constraints at the start of each new prompt and using a system prompt or pinned context
Reducing the length of prompts
Switching to a different AI tool
===
Which describes the correct sequencing in AI-native rapid prototyping?
Idea to architecture document to engineering sprint to AI review to launch
Idea to design in Figma to engineer the design to add AI later
*Idea to spec in natural language to AI generates working code to test with real users to iterate
Idea to hire a team to write a PRD to AI assists with documentation
===
A developer wants to add authentication to an AI-generated app. The safest approach is:
Ask the AI to generate a custom authentication system
Skip authentication for the MVP
Copy auth code from a GitHub repository without review
*Use a battle-tested auth library or service such as Auth0 or Clerk rather than asking the AI to generate custom auth code
===
What is the value of maintaining a decision log when prototyping with AI?
It satisfies compliance requirements
*It captures why choices were made, enabling the AI to stay consistent and the team to onboard faster
It improves AI response speed
It is required for deploying to production
===
A non-technical founder builds an MVP with AI assistance and gets their first paying customer. The next highest-leverage AI use is:
*Using AI to automate the manual parts of onboarding and fulfilment before hiring anyone
Using AI to redesign the landing page
Using AI to write investor pitch decks
Using AI to generate more code features immediately
===
A startup uses AI to generate their first landing page, waitlist form, and email sequence. What does this demonstrate about AI-native execution?
AI can fully replace a marketing team
AI is only useful after product-market fit
*AI compresses the cost and time of go-to-market assets, enabling solo founders to test demand before building
AI-generated landing pages convert better than human-written ones
===
When building an MVP with AI assistance, which deliverable should be AI-generated last?
*The core data model, which should be designed by a human to avoid structural errors that compound
The landing page copy
The email templates
The FAQ section
===
A team of two uses AI tools to ship a product in 3 weeks that would have taken a 10-person team 6 months traditionally. The primary leverage factor is:
The team worked 24 hours a day
The product had fewer features than normal
The team used a no-code tool instead of AI
*AI handling execution tasks that previously required specialist headcount across design, code, copy, and QA
===
A PM is building an MVP and must decide what to do manually vs what to delegate to AI. The correct filter is:
Delegate everything that takes more than one hour to AI
*Delegate execution tasks to AI; retain human judgment for strategy, validation, and decisions with irreversible consequences
Keep all code tasks human and delegate only writing tasks to AI
Use AI for external tasks and humans for internal tasks
===
An AI-assisted MVP is live and getting traction. The founder wants to scale. The AI-native scaling principle is:
Hire first and then use AI to make hires more productive
Stop using AI and build a proper engineering team
*Identify the highest-friction manual operations and automate them with AI before hiring for those roles
Replace all AI tooling with custom-built internal systems
===
What is the primary role of AI in the build, measure, learn lean startup loop for an AI-native team?
Replacing the measure phase with AI analytics
Automating the learn phase by having AI interpret all data
Making the loop unnecessary by getting it right the first time
*Compressing the build phase from weeks to days, enabling faster iteration through the full loop
===
A founder uses AI to build an MVP in 2 weeks. A VC asks whether this is defensible. The most honest AI-native answer is:
*The build speed is not the moat - the data, distribution, and user insight accumulated through rapid iteration are
Yes, because AI tools are expensive and competitors cannot afford them
Yes, because the code is proprietary
No, and the product should not be shown to investors yet
===
A non-technical founder is building a B2B SaaS MVP with AI. The first technical decision they must make correctly is:
Which programming language to use
*Which hosting and database platform will allow them to iterate without refactoring the stack later
Which AI model to integrate first
How many engineers to hire
===
A team builds an MVP in 3 weeks and launches to 100 beta users. After 2 weeks, 80% have churned. The AI-native response is:
Shut down and rebuild from scratch
Wait for more data before making changes
Add more features to retain remaining users
*Use AI to rapidly analyse qualitative feedback, identify the core failure, and iterate within days
===
A PM is building a B2C app MVP. Which AI-generated asset directly reduces time-to-first-user the most?
A detailed technical specification document
A competitive analysis report
*A working landing page with a clear value proposition and email capture
A 12-month roadmap
===
A founder instructs Claude to build a payment integration. What must they verify before going live?
That the code was written in under 10 minutes
*That the integration correctly handles edge cases like failed payments, refunds, and webhook retries
That the AI chose the cheapest payment processor
That the code uses the latest programming language version
===
Which of the following best describes an AI-native team relationship with documentation?
*Documentation is AI-generated alongside the code and kept in sync via the same AI workflow
Documentation is written manually after the product ships
Documentation is not needed because the AI knows what the code does
Documentation is only written for enterprise customers
===
A startup wants to test three different product concepts. The AI-native approach is:
Spend six months researching which concept is best before building
Build the most technically complex concept first
*Build all three as lightweight prototypes using AI in parallel, then test each with users before committing to one
Test only one concept at a time to keep focus
===
A PM is using AI to generate user interview scripts for MVP validation. The most important human contribution to this process is:
Editing the grammar of the AI-generated script
Translating the script into different languages
Recording the AI-generated script as an audio file
*Selecting which questions to prioritise based on what assumptions are most critical to test
===
Which metric most directly validates an AI-native MVP after the first 30 days?
Total number of AI prompts used to build the product
*Whether users return to complete a second session without being prompted
Number of features shipped
Landing page conversion rate
===
A developer uses an AI coding assistant to write a function. The most effective review practise is:
*Testing the function against the full range of expected inputs including edge cases before merging
Reading the AI explanation of what the code does and accepting it
Running the code once to see if it produces output
Asking the AI if the code is correct
===
When using an AI to debug code, the most effective prompt structure is:
Describing the bug in general terms and asking the AI to find it
Asking the AI to rewrite the entire file
*Pasting the exact error message, the relevant code block, and the expected vs actual behavior
Running all tests and sending the output without context
===
An engineer uses AI to generate test cases. What is the primary limitation of AI-generated tests?
AI-generated tests are always too slow
*AI tends to generate tests that validate the code it wrote rather than testing genuinely adversarial inputs
AI cannot write tests in Python
AI-generated tests require separate licensing
===
A team integrates an AI coding assistant into their CI/CD pipeline to auto-generate code review comments. The key governance requirement is:
The AI must review all pull requests without human override
The AI must use the same style guide as the team
The AI must be trained on the team codebase first
*Human engineers must retain final approval authority before any suggested change is merged
===
A developer is working with an AI assistant on a large codebase. The most important context to provide at the start of each session is:
*The relevant module architecture, the specific task being worked on, and any constraints or conventions in use
The full codebase pasted into the prompt
A list of all features the product has
The team org chart
===
A team uses AI to migrate a legacy codebase from one framework to another. What is the highest-risk phase of this process?
Converting syntax from one language to another
*Validating that migrated code preserves all business logic and edge case behaviour from the original
Renaming variables and functions
Updating import statements
===
An AI generates a 200-line function to implement a feature. A senior engineer says it should be broken into 5 smaller functions. The correct response is:
Accept the 200-line function because the AI wrote it
Reject AI assistance entirely because the output was wrong
Manually refactor without using AI
*Ask the AI to refactor the function with a clear instruction about desired modularity and maximum function length
===
A developer uses AI to generate a SQL query. Before running it on production data, the most critical check is:
Checking the query length
Confirming the AI generated the query in under 5 seconds
*Verifying the query against a schema diagram to confirm it targets the correct tables and relationships
Ensuring the query uses uppercase keywords
===
A PM asks an AI to generate API documentation from the codebase. The most important post-generation step is:
Publishing the documentation immediately
*Having an engineer verify that generated descriptions match actual API behaviour, especially for error responses
Translating the documentation into other languages
Asking the AI to make the documentation shorter
===
Which practise most increases the long-term productivity of a team using AI-assisted development?
*Maintaining a shared prompt library for common tasks so the team benefits from each other prompt iterations
Each engineer developing their own private AI workflow
Using only one AI tool to avoid confusion
Limiting AI assistance to junior engineers
===
A developer is using an AI assistant to implement a feature described in a ticket. The ticket is ambiguous. The correct first step is:
Asking the AI to interpret the ambiguous ticket and implement its interpretation
Implementing both interpretations and asking the PM to choose
*Clarifying the ambiguity with the PM before asking the AI to implement, to avoid building the wrong thing correctly
Closing the ticket and asking for a rewrite
===
An AI coding assistant suggests using a deprecated library. The correct response is:
Using the deprecated library because the AI chose it
Asking the AI if the library is deprecated
Switching to a different AI coding tool
*Rejecting the suggestion and specifying the current library version before regenerating
===
A company deploys an AI coding assistant to its engineering team. The most important policy to establish is:
AI-generated code may be merged directly without review to maximise speed
*All AI-generated code must be reviewed and understood by the engineer before merging
AI must only be used for test files, not production code
Engineers must disclose to the AI that they are professionals
===
A team uses AI to write code and AI to write tests for that code. Which external check best validates both?
Running AI-generated unit tests only
Asking the AI to review both the code and tests
*End-to-end testing with real user flows and production-like data
Checking that the code compiles without errors
===
Which describes the correct use of AI in a code review process?
*AI surfaces potential issues and style violations as a first pass; human reviewers evaluate logic, architecture, and context
AI replaces human code reviewers entirely
AI only reviews documentation, not code
AI approves pull requests after running tests
===
A founder uses AI to compress a task that previously took 3 hours to 20 minutes. The most important follow-up action is:
Using AI for even more tasks to save more time
Documenting the time saved for investor reporting
Telling team members to do the same task manually to keep skills sharp
*Reinvesting the saved time into higher-leverage strategic work that AI cannot do
===
A content team uses AI to produce first drafts. The correct role for human editors in this workflow is:
Rewriting all AI drafts entirely
*Fact-checking, adding unique insight, and ensuring brand voice - not rewriting AI drafts from scratch
Publishing AI drafts without review
Using AI only for titles, not full drafts
===
A PM uses AI to prepare for a board meeting. The highest-leverage AI use in this scenario is:
Using AI to take notes during the meeting
Using AI to email board members after the meeting
*Generating the first draft of the board deck and narrative, which the PM then refines with insider context
Using AI to research board members on LinkedIn
===
A sales team uses AI to personalise outreach at scale. The most important human oversight in this workflow is:
*Reviewing a sample of AI-generated messages before sending to ensure accuracy and appropriate tone
Reviewing every message before sending
Letting AI send all messages without review
Having the AI send messages only to warm leads
===
A team uses AI to generate weekly status reports from raw data. After two months, leadership stops reading them. The most likely cause is:
Leadership prefers verbal updates
The reports are too long
The AI is using the wrong template
*AI-generated reports lack the editorial judgment to surface what actually matters to leadership
===
A company uses AI to summarise all customer support tickets daily. The correct use of these summaries is:
As a replacement for reading any individual tickets
As the sole basis for product roadmap decisions
*As an input to the PM and support lead for trend spotting, not as a replacement for reading individual tickets on critical issues
As a public-facing customer communication
===
An operations team uses AI to automate weekly report generation. The process saves 8 hours per week. Which risk must be actively managed?
*The AI silently propagating an error in source data across multiple weeks of reports before detection
The reports being generated too quickly
The AI choosing the wrong font in the report
The AI generating more reports than requested
===
A PM uses AI to analyse qualitative user interview transcripts. What should they validate in the AI output?
Whether the AI completed the analysis in under 2 minutes
*Whether the themes the AI identified match what stood out to the human interviewer during the sessions
Whether the AI used the correct summary format
Whether the AI mentioned all interviewees by name
===
An AI is used to triage and categorise 500 inbound leads per week. What is the highest-risk failure mode to monitor?
The AI taking too long to categorise each lead
The AI generating too many categories
*High-value leads being systematically miscategorised into a low-priority bucket
The AI sending automatic responses to leads
===
A team uses AI to generate 30 social media posts per week. After 4 weeks, engagement drops significantly. The most productive diagnostic is:
Increasing the number of posts per week
Switching to a different AI tool
Changing the posting time
*Comparing engagement on AI-generated posts vs posts that had significant human editing
===
A company rolls out AI tools to all employees. Productivity gains are strong in some teams and absent in others. The most likely structural cause is:
*Different task types - AI accelerates execution tasks but adds friction to judgment-heavy tasks
Some teams are less intelligent
Some teams received better laptops
AI tools were not available in all office locations
===
A product team uses AI to write sprint tickets. The main risk of this workflow is:
Tickets that are too long
*Tickets that are complete and well-formatted but describe the wrong work if the PM brief was imprecise
Tickets that do not use the correct Jira format
The AI assigning tickets to the wrong engineers
===
A team uses AI to produce meeting summaries with action items. The most common failure mode is:
Summaries that are too long
Summaries that miss the date of the meeting
AI including off-topic comments in the summary
*Action items assigned to the wrong owner or with the wrong due date because the AI misidentified who said what
===
Which AI workflow acceleration practise has the highest compounding return over time?
*Building reusable prompt templates for recurring tasks that encode organisational context and standards
Using AI for as many different tasks as possible each week
Switching to a new AI tool every quarter
Limiting AI use to one task type to build depth
===
A founder uses AI to run their company for 3 months with no employees. Which function is hardest for AI to fully replace?
Drafting contracts
Writing marketing copy
*Relationship-building with customers, partners, and investors
Generating financial projections
===
What distinguishes an AI-first company from a company that uses AI tools?
*AI-first companies design their workflows, org structure, and decision-making around AI as the primary execution layer
AI-first companies use more AI tools than others
AI-first companies hire only AI engineers
AI-first companies have no human employees
===
A startup is designing its operations from scratch with AI-first principles. What is the first decision to make?
Which AI tools are cheapest
How many AI tools to subscribe to
Whether to use open-source or proprietary AI
*Which workflows will remain human-led and why, before designing AI automation for everything else
===
A company adopts AI-first operations and finds that middle management roles are changing significantly. The most accurate description of this change is:
Middle managers are fully replaced by AI
*Middle managers shift from coordinating information flow to curating AI outputs and making judgment calls
Middle managers spend more time in meetings
Middle managers become AI engineers
===
An AI-first operations team uses AI agents to execute multi-step workflows. The critical human responsibility is:
Monitoring token usage in real time
Ensuring the AI uses the correct output format
*Defining the scope, reviewing outputs, and intervening when the agent exceeds its intended remit
Rotating which AI tool the agent uses each week
===
A company runs its customer onboarding entirely on AI. A new enterprise client has a complex, non-standard setup. The correct operational response is:
*Escalating to a human CS team immediately rather than forcing the non-standard case through an AI-only flow
Asking the AI to handle the complex setup anyway
Declining the enterprise client
Redesigning the entire onboarding flow for this one client
===
A company measures operational efficiency as cost per task completed. After deploying AI, cost per task drops 60%. What secondary metric must be tracked?
Number of tasks completed per week
Number of AI tools used
*Quality per task, to ensure cost reduction is not coming from lower-quality outputs
Time the AI takes per task
===
A company uses AI to handle all internal knowledge queries. Employees stop documenting processes because the AI knows everything. The long-term risk is:
Employees becoming too fast at finding information
The AI becoming too powerful
Employees spending less time searching for information
*Institutional knowledge degrading as undocumented processes exist only in conversation history that may not be retained
===
An AI-first company wants to hire its first employee. The role that generates the highest marginal value is:
A data entry specialist
*Someone who can direct and improve AI systems - a judgment and orchestration role, not a pure execution role
A social media manager
A generalist who can do everything manually
===
A company runs all its marketing on AI-generated content for 6 months. Organic reach declines. The most likely cause is:
The AI is generating too much content
The AI is using outdated social media algorithms
*AI-generated content lacks the specificity, authenticity, and novelty that audiences respond to over time
Competitors have larger budgets
===
A PM wants to build an AI-first onboarding workflow. The correct starting point is:
*Mapping the current manual onboarding steps and identifying which are highest-volume and most rule-based
Choosing which AI tool to use first
Building the AI onboarding before the manual version exists
Outsourcing onboarding to a third-party AI vendor immediately
===
An AI-first company tracks AI coverage - the percentage of workflow steps handled by AI. At 90% AI coverage, the most important human focus is:
Increasing AI coverage to 100%
*The 10% of steps that remain human - which are there because they require judgment, relationships, or accountability
Reducing the number of workflow steps
Documenting the AI coverage metric for investors
===
A company uses AI to draft all legal agreements. The non-negotiable human role in this workflow is:
Having the AI verify its own draft
Using AI to negotiate the terms after drafting
Sending AI drafts directly to counterparties without legal review
*A qualified lawyer reviewing every agreement before execution, regardless of how good the AI draft appears
===
An AI-first ops team is building a new internal tool. The correct build sequence is:
Choose an AI tool, give it instructions, then launch
Hire an engineer, write code, then add AI later
*Define the workflow in plain language, then identify AI automation points, then build the human exception path, then deploy
Launch with full AI automation, then add human steps if problems emerge
===
A company has replaced most of its customer support with AI. Customer satisfaction scores are up but escalation volume is also up. What does this signal?
The escalation team is too small
*AI handles routine queries well but is creating friction on complex or sensitive issues that quickly exhaust users
Customers prefer to speak to humans regardless of AI quality
The AI is answering too quickly
===
A founder builds a company that reaches 1000 customers with a team of 3 people using AI. The most accurate description of this business model is:
An understaffed company that will collapse at scale
A company that has replaced all human judgment with AI
A company that uses AI for marketing only
*AI-leveraged operations where automation handles a volume of work that would traditionally require 20 to 50 headcount
`;

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

export const ENGINEERING_POOL_SIZE = ITEMS.length;

// A fresh random session: `count` questions from the full pool, options shuffled.
export function getEngineeringSession(count = 15) {
  return shuffle(ITEMS).slice(0, count).map((it) => ({ q: it.q, options: shuffle(it.options) }));
}

// The bank's named sets (11 domains, in source order), 75 questions each.
export const ENGINEERING_SETS = [
  'AI Engineering',
  'AI Agents & Workflows',
  'AI Networks & Infrastructure',
  'AI Tools Ecosystem',
  'AI Judgment',
  'LLM Fundamentals',
  'Prompt Engineering',
  'RAG & Knowledge Systems',
  'AI Reliability & Evaluation',
  'AI Product Thinking',
  'AI Native Execution',
];

// A fresh session for one set: `count` questions drawn from that domain's block, options shuffled.
export function getEngineeringSet(setIdx, count = 15) {
  const per = Math.floor(ITEMS.length / ENGINEERING_SETS.length);
  const start = setIdx * per;
  return shuffle(ITEMS.slice(start, start + per)).slice(0, count)
    .map((it) => ({ q: it.q, options: shuffle(it.options) }));
}
