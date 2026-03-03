export const slideNotes = [
    // Slide 1: Title
    `[TIMING: 0:00 - 3:00]
    
    **The Hook:**
    "Good morning. I want you to imagine a world where your data—the heartbeat of your servers, the flux of your supply chain, the pulse of the financial markets—validates a universal law."
    
    "For decades, we treated Time Series analysis like a craft. Every sensor was unique. Every stock ticker needed its own bespoke equation. We were artisans, hand-carving models for every single problem. And frankly? It didn't scale."
    
    "Today, that changes. We are witnessing the 'Industrial Revolution' of forecasting. We are moving from the Craftsman Era to the Era of General Intelligence."
    
    "I'm Dr. Zeeshan Malik, and today we're going to explore the 'Physics of Intelligence'. We'll see how the exact same architecture that writes poetry (GPT) is now being used to predict the next storm, the next market crash, and the next energy spike."
    
    "This presentation is interactive. Please scan the QR code to join me. You aren't just watching; you're part of the simulation."
    `,

    // Slide 2: The Problem
    `[TIMING: 3:00 - 6:00]
    
    **The Antagonist: Time Itself**
    
    "Why is this hard? Why haven't we solved this yet? Because Time is a difficult adversary."
    
    "In language, an 'Apple' is an 'Apple'—whether Shakespeare wrote it in 1600 or I say it today. The meaning is stable."
    
    "But in Time Series? The rules change while you're playing the game. This is **Non-Stationarity**. What a stock price of $100 meant in 1990 is very different from what it means today. The statistical distribution drifts."
    
    "And then there's the **Memory Problem**. An event that happened six months ago—a tiny glint of warm water in the Pacific—can cause a torrential flood in California today. Classical models have amnesia; they forget. We need a model with the memory of an elephant and the adaptability of a chameleon."
    `,

    // Slide 3: Classical Limits
    `[TIMING: 6:00 - 9:00]
    
    **The Ghosts of Models Past**
    
    "Let's walk through the graveyard of our previous attempts."
    
    "First, we had **ARIMA**. The reliable sedan. Great for linear, predictable roads. But throw it into a chaotic nonlinear system? It stalls. It requires you to manually tune it, to tell it 'differencing is needed here'. It doesn't learn; it obeys."
    
    "Then came Deep Learning 1.0: **LSTMs**. They promised to solve the memory problem. And they did—partially. But they were slow. Sequential. To understand step 1000, you had to compute step 999, then 998... It was like reading a book by spelling out every letter. You can't skim. You can't scale."
    
    "The tragedy of these models? They were lonely. A model trained on Walmart sales knew nothing about Target sales. They couldn't transfer knowledge. We needed a hive mind."
    `,

    // Slide 4: Transformer Intuition
    `[TIMING: 9:00 - 12:00]
    
    **The Pivot: A New Perspective**
    
    "Then, in 2017, everything changed with a paper titled 'Attention is All You Need'. It was meant for translation, but the physics of it are universal."
    
    "Imagine a room full of people talking. An LSTM goes person to person, listening to one whisper at a time. A **Transformer** stands in the center and listens to everyone simultaneously."
    
    "This is **Global Attention**. It connects the first data point to the last instantly. The distance between 'January' and 'December' becomes zero. This collapsed the timeline. Suddenly, looking back 5 years was as cheap as looking back 5 minutes."
    
    "But there was a catch. The cost. The computation grew quadratically. For every extra second of history, the effort exploded. We needed a trick to tame this beast for continuous time."
    `,

    // Slide 5: Tokenization
    `[TIMING: 12:00 - 15:00]
    
    ** The Transformation: Patching**
    
    "How do we feed a continuous stream of voltage or temperature into a model built for words?"
    
    "We use **Patching**. Think of it as 'Fast Reading'. Instead of looking at every millisecond (which is noisy and meaningless), we group time into chunks—say, an hour at a time."
    
    "Look at the animation. See how those 16 raw points become one 'Token'? That token contains the *shape* of the data—the slope, the curve, the spike. We stopped feeding the model letters and started feeding it concepts."
    
    "This did two things: It made the model 250x faster, and shockingly, it made it smarter. It forced the model to look at the local geometry, not just the point value."
    `,

    // Slide 6: Positional Encoding
    `[TIMING: 15:00 - 18:00]
    
    **Ordering the Chaos**
    
    "Here's the paradox of the Transformer: It's so powerful it sees everything at once, but it loses the concept of 'order'. To a Transformer, 'Breakfast, Lunch, Dinner' is the same as 'Dinner, Breakfast, Lunch'."
    
    "We have to teach it time. We inject **Positional Encodings**."
    
    "Think of this as stamping a timestamp on every packet of information. But we've gotten smarter. We don't just say 'Step 1, Step 2'. We use frequencies—sines and cosines—so the model understands cycles. It knows that 'Step 1' and 'Step 25' are related if the cycle is 24 hours. It learns the rhythm of the universe before it even sees the data."
    `,

    // Slide 21 (index 20): Q&A — Section 1
    `[TIMING: 18:00 - 20:00]

    **Facilitator Notes — Q&A Round 1**

    "Alright, let's put the first section to the test. Five questions — click to choose your answer, then we'll reveal together."

    QUESTION THEMES (in order on screen):
    1. Non-stationarity — why time series drift makes forecasting hard
    2. LSTM sequential bottleneck — why parallelism matters
    3. Transformer attention — temporal distance collapses to zero
    4. Patching — two benefits: speed AND geometric shape learning
    5. Positional encoding — sinusoidal frequencies vs integer step indices

    FACILITATOR TIPS:
    • Use Q1 to anchor the 'why is this hard' narrative — non-stationarity is the core antagonist.
    • Q3 is the big insight moment — ask the audience 'what does connecting any two time steps mean for a model trained on 1990s data?'
    • Q5 trips people up — let the audience debate 'why not just use 1,2,3…' before revealing.
    • Pause after each explanation to let the insight land before moving on.
    `,

    // Slide 7 (index 6): Attention Mechanism
    `[TIMING: 18:00 - 21:00]
    
    **The Heartbeat: Attention**
    
    "Let's look under the hood. What is the model actually 'thinking'?"
    
    "This heatmap you see? This is the brain scan of the AI. It's asking three questions:
    1. **Query:** What is happening right now? (e.g., 'It's a hot Friday afternoon').
    2. **Key:** What matches this in history? (e.g., 'Other hot Friday afternoons').
    3. **Value:** What happened next back then?"
    
    "When you see a diagonal line on this map, the model has discovered a Trend. When you see a grid pattern, it has discovered Seasonality. It's not magic; it's pattern matching at a scale no human can achieve."
    `,

    // Slide 8 (index 7): Multi-Head Attention
    `[TIMING: 21:00 - 24:00]
    
    **The Council of Experts**
    
    "One perspective isn't enough. Complex systems have layers. So we give the model **Multi-Head Attention**."
    
    "Imagine a council of experts analyzing a stock chart.
    • Expert 1 (Head 1) is obsessed with the last hour of trading (High Frequency).
    • Expert 2 (Head 2) looks at the yearly cycle (Low Frequency).
    • Expert 3 (Head 3) looks for Black Swan events (Anomalies)."
    
    "They all look at the same data, but they see different things. The model combines their insights into a single, rich representation. This is why it works on chaotic real-world data where simple rules fail."
    `,

    // Slide 9 (index 8): FFN & LayerNorm
    `[TIMING: 24:00 - 27:00]
    
    **Stabilizing the Signal**
    
    "Now, we pass this insight through the Feed-Forward Network. This is where the 'memory' lives. If Attention is the eyes, the FFN is the cortex processing what it sees."
    
    "But remember the enemy? **Non-Stationarity**. The world changes. 
    To fight this, we use **RevIN** (Reversible Instance Normalization). It's a simple but profound trick:
    Before we look at the data, we normalize it—remove the mean, scale the variance. We look at the *relative shape* only. We make the prediction. Then, we add the mean back."
    
    "This allows a model trained on 1990s prices (when coffee was $1) to predict 2024 prices (when coffee is $5). It learns the *dynamics*, not the *prices*."
    `,

    // Slide 10 (index 9): Scaling
    `[TIMING: 27:00 - 30:00]
    
    **The Industrial Scale**
    
    "In 2020, we learned a terrifying truth in NLP: Scale is all you need. Does it hold for Time Series?"
    
    "Yes. We are now building the 'GPTs' of Time Series.
    • **200 Billion** Parameters.
    • **1 Trillion** Data Points.
    • Context windows of **512,000 steps**."
    
    "Imagine looking at a vibration sensor on a jet engine. 512k steps means we can see every shudder and shake for the last hour at high resolution, looking for the faintest whisper of a crack. Simple models see the noise; these models hear the signal."
    `,

    // Slide 11 (index 10): Key Architectures
    `[TIMING: 30:00 - 33:00]
    
    **The Titans: Meet the Models**
    
    "Who are the players in this new arena?"
    
    "**PatchTST** (IBM): The structural engineer. It separates variables (Channel Independence) to ensure robustness. It's the current reliable workhorse."
    
    "**TimesFM** (Google): The decoder giant. Trained on 100 Billion real-world points. It's built to forecast *anything* straight out of the box."
    
    "**Chronos** (Amazon): The radical. It says, 'Why reinvent the wheel?' It turns time series into literal text tokens and feeds them into T5 (a language model). It treats a stock chart like a sentence. And it works brilliantly."
    
    "**Moirai** (Salesforce): The universalist. It handles any frequency, any number of variables. It's the Swiss Army Knife."
    `,

    // Slide 12 (index 11): Pretraining
    `[TIMING: 33:00 - 36:00]
    
    **How It Learns physics**
    
    "How do we teach these models without human labels? We play a game."
    
    "It's called **Masked Modeling**. We take a sequence of data and delete random chunks. We tell the model: 'Fill in the blank.'"
    
    "To fill in the blank correctly, the model *must* understand the physics. It must understand gravity to predict a falling ball's trajectory. It must understand thermal dynamics to predict a temperature curve."
    
    "By solving millions of these puzzles, the model doesn't just memorize data; it internalizes the laws of temporal dynamics. It creates a 'World Model' of how things change over time."
    `,

    // Slide 13 (index 12): Forecasting
    `[TIMING: 36:00 - 39:00]
    
    **The Holy Grail: Zero-Shot**
    
    "And here is the promise realized: **Zero-Shot Forecasting**."
    
    "Historically, if you wanted to predict sales for a new product, you were stuck. 'Cold Start' problem. No history, no model."
    
    "Now? You take TimesFM. It has seen sales data from thousands of other companies. It has seen seasonality in weather, in energy, in web traffic."
    
    "You show it *just a sliver* of your new data, and it says: 'Ah, I know this pattern. This looks like a retail launch curve.' And it predicts it. Instantly. No training. This is the death of the 'Cold Start' problem."
    `,

    // Slide 14 (index 13): Failure Modes & Mitigations
    `[TIMING: 39:00 - 42:00]
    
    **The Warning Label: Risks & Fixes**
    
    "However... I am an engineer, not a salesman. We must talk about the risks. And more importantly, how we fix them."
    
    "**1. Hallucinations (Risk):** Yes, Time Series models hallucinate. If you feed them sparse data, they might confidently invent a seasonal pattern that doesn't exist. They 'dream' a future that fits the curve but defies reality."
    "**The Fix (RAG):** We use **Retrieval Augmented Generation**. We don't just ask the model to guess; we allow it to 'look up' similar historical periods from a database. We also verify outputs against hard constraints (e.g., probability cannot be negative)."

    "**2. Latency (Risk):** These models are massive. Generating a forecast token-by-token is slow."
    "**The Fix (Quantization):** We shrink the model using 4-bit quantization. We also use **Speculative Decoding**—letting a tiny, fast model draft the prediction, and the large model just verifies it."

    "**3. Concept Drift (Risk):** The world changes. A model trained on pre-pandemic data might fail today."
    "**The Fix (Adapters):** We use **LoRA (Low-Rank Adapters)**. Instead of retraining the 100B parameter brain, we just retrain a tiny 'shim' layer on the last month of data. It adapts instantly."
    `,

    // Slide 15 (index 14): Benchmarks
    `[TIMING: 42:00 - 45:00]
    
    **Validation**
    
    "Does it work? Show me the data."
    
    "On the Monash Archive—the toughest collection of time series datasets in the world—Foundation Models are dominating. They are beating the bespoke, hand-tuned models."
    
    "But a note of caution: On very simple, very clean data? A simple linear model is often competitive and 1000x cheaper. Intelligence is expensive. Use it where complexity demands it."
    `,

    // Slide 16 (index 15): Decision Tree
    `[TIMING: 45:00 - 48:00]
    
    **The Engineer's Playbook**
    
    "So, you go back to work tomorrow. What do you do?"
    
    "**Scenario A:** You have clean, simple data. Use **ARIMA** or **XGBoost**. Keep it simple."
    
    "**Scenario B:** You have thousands of related series (e.g., retail SKUs). Use a Global Model like **LightGBM** or **DeepAR**."
    
    "**Scenario C:** You have a new problem, limited history, or complex multi-modal data. **This** is where you deploy the Foundation Models. Use **TimesFM** or **Moirai**. Use the cannon only when you need to breach the wall."
    `,

    // Slide 22 (index 21): Q&A — Section 2
    `[TIMING: 48:00 - 50:00]

    **Facilitator Notes — Q&A Round 2**

    "Section 2 covered a lot of ground — from attention mechanics to billion-parameter scaling. Let's see what stuck."

    QUESTION THEMES (in order on screen):
    1. Multi-Head Attention — parallel expert heads capturing different temporal scales
    2. RevIN — normalise before, denormalise after — distribution-agnostic inference
    3. Chronos (Amazon) — quantises values into text tokens, feeds into T5
    4. Masked Modelling — model must infer governing physics to fill hidden chunks
    5. LoRA vs full fine-tuning — adapters are 0.1% of parameters, catastrophic forgetting risk

    FACILITATOR TIPS:
    • Q1 is a crowd-pleaser — ask 'what if you only had one expert vs a council of specialists?'
    • Q2: RevIN is the most practical insight. Ask 'how many of you have retrained models when prices changed?'
    • Q3 (Chronos) usually surprises people — let them react to 'treating a stock chart like a sentence.'
    • Q5: LoRA is highly relevant for enterprise users — note that full retraining a 100B model costs ~$2M at current GPU prices.
    `,

    // Slide 17 (index 16): Agentic Intro — Paradigm Shift
    `[TIMING: 48:00 - 51:00]

    **The Paradigm Shift: From Prediction to Action**

    "We've spent this session building up to a moment. Every slide has been scaffolding for this one idea."

    "Prediction is passive. A crystal ball. But what if the model didn't just *tell* you the storm was coming—it *closed the windows*, *rerouted the ships*, and *called the port authority*?"

    "This is the Agentic paradigm. We don't just forecast—we act. The model becomes a reasoning engine: it breaks down a complex goal, writes code to solve it, executes that code in a sandbox, reads the error, fixes it, and retries. All autonomously."

    "THINK → CODE → EXEC → ERROR → FIX → OK. You're watching an AI debug itself in real time. This replaces weeks of analyst work with seconds of inference."

    "The terminal on this slide is live. Every line is an actual step our LEAP LTSM agent runs when it receives a natural language query."
    `,

    // Slide 18 (index 17): Agentic Architecture
    `[TIMING: 51:00 - 54:00]

    **The Architecture: Five Stages of Agentic Intelligence**

    "Let's open the hood. How does a natural language question become a LTSM forecast tensor?"

    "Stage 1: **User Text** — the raw query arrives. 'Forecast Q3 demand with macro context.'"

    "Stage 2: **LLM Brain** — a frontier language model (GPT-4 class) interprets intent. It doesn't just parse keywords; it reasons about *what data is needed* and *what tools to invoke*."

    "Stage 3: **Tool Router** — the brain emits a structured tool call. It says: load this series, apply this exogenous vector, run inference on LEAP LTSM."

    "Stage 4: **Python Sandbox** — the code is generated and executed in an isolated Docker container. If it fails with a RuntimeError, the agent reads the traceback and rewrites the code. Self-healing."

    "Stage 5: **LEAP LTSM** — the 77M parameter model performs patch-token inference on the refined context window. The output is a Tensor(96,1): 96 hours of forecasted values, ready for your dashboard."

    "Notice: no human is in this loop. The analyst becomes the architect, not the operator."
    `,

    // Slide 19 (index 18): Multi-Agent Orchestration
    `[TIMING: 54:00 - 57:00]

    **Multi-Agent: Division of Labour at Machine Speed**

    "Single agents are powerful. Multi-agent systems are transformative."

    "Look at the map. We have four specialised agents running concurrently:"
    "• **Planning Agent** — the orchestrator. It decomposes the goal and routes sub-tasks. Chain-of-Thought reasoning happens here."
    "• **Coding Agent** — writes, tests, and self-fixes Python. It has write access to the sandbox."
    "• **Analysis Agent** — receives the raw tensor and produces human-readable synthesised insights."
    "• **LEAP LTSM Sandbox** — the inference engine. Stateless, containerised, reset between runs."

    "The dashed lines you see are live message channels. Packets flow between agents in real time."

    "On the right: the **ReAct loop**. REASON → ACT → OBSERVE. This is the formal framework. The agent doesn't just execute blindly; it reflects on each result before deciding the next action. When it hits a RuntimeError, it Reasons about the cause, Acts with a fix, Observes the new output. It loops until success or exhaustion."

    "This is not science fiction. This is running in production. The average query resolves in under 8 seconds."
    `,

    // Slide 20 (index 19): Interactive Live Demo
    `[TIMING: 57:00 - 60:00]

    **Live Demo: You Are the Analyst**

    "This is the moment you've been waiting for. This is not a pre-recorded video. This is a live simulation of the actual agent loop."

    "On the left: four preset queries, each representing a real-world energy analyst workflow."
    "• Q1 Variance Analysis — decomposing a complex multi-signal correlation."
    "• 96h Crude Forecast — regime-aware, OPEC-integrated."
    "• Anomaly Detection — root cause identification with causal metadata."
    "• Multi-Series Correlation — cross-asset Granger causality."

    "Click any preset. Watch the agent THINK in real time. Watch it write code. Watch it hit an error and fix itself. Watch the result panel populate with metrics, a chart, and a natural language synthesis."

    "The system status panel on the left tracks: LTSM Core health, Sandbox state, live context token count, and active agent count."

    "The key message: every one of these workflows used to take an analyst 2–4 hours. With the agentic LEAP system, it's under 10 seconds. That is the compounding return on this investment."

    "Questions? I'll take them now, or you can scan the QR code on the final slide to access the repo and run this yourself."
    `,

    // Slide 23 (index 22): Q&A — Section 3
    `[TIMING: 60:00 - 62:00]

    **Facilitator Notes — Q&A Round 3**

    "The final five. This section covered the most cutting-edge material — agentic systems, ReAct loops, multi-agent orchestration, and the live LEAP demo you just saw."

    QUESTION THEMES (in order on screen):
    1. ReAct vs chain-of-thought — ReAct adds Act and Observe steps, grounding in real execution
    2. Regime-aware lookback — why truncating pre-regime-shift data improves forecast quality
    3. Stateless containerised sandbox — isolation prevents data leakage between agent runs
    4. Pearson −0.67 PMI correlation — economically meaningful, not a bug: counter-cyclical signal
    5. 8-second resolution — compound removal of human wait times, not just hardware speed

    FACILITATOR TIPS:
    • Q1: Ask 'who has used ChatGPT with a tool?' — most have; contrast with pure CoT.
    • Q2: The regime-shift insight is subtle but powerful — 'the smart truncation is smarter than any truncation.'
    • Q4 is the analyst question — energy/commodity professionals will immediately recognise the PMI signal.
    • Q5: Close with the '1000× latency reduction' frame. The question is not 'can AI do this?' but 'who builds it first?'
    `,

    // Slide 24 (index 23): Summary & QR
    `[TIMING: 60:00 - 63:00]

    **The Close: The Future is Agentic**

    "Let me leave you with one thought."

    "Every technology revolution in history has followed the same arc: a new primitive appears, people debate whether it's real, then it becomes invisible infrastructure."

    "Electricity. The Internet. The smartphone. Each time, the winners were not the ones who waited for certainty—they were the ones who built while others deliberated."

    "The Foundation Model for Time Series is here. The Agentic layer on top of it is here. LEAP LTSM is live."

    "The question is not 'will this change our industry?' The question is 'who builds it first?'"

    "Scan the QR code. The repository is open. The API is documented. You can run your first LTSM-powered agent query tonight."

    "Thank you. I'm Dr. Zeeshan Malik. Let's build something extraordinary."
    `
];

