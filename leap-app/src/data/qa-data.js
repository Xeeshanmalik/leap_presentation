/**
 * Q&A question sets — one per section.
 * Each question has: q (question), opts ([A,B,C,D]), answer (0-indexed), explain (shown after reveal)
 *
 * Section 1: Introduction — Why Time Series, Classical Models, Transformers, Tokenization, Positional Encoding
 * Section 2: Large Time Series Models — Attention, Scaling, Architectures, Pretraining, Failure Modes
 * Section 3: Agentic AI — ReAct loop, Architecture, Multi-Agent, LEAP LTSM, Demo
 */

export const QA_SECTIONS = [
    {
        // ── SECTION 1 ─────────────────────────────────────────────────────────
        sectionTitle: "Introduction",
        sectionSubtitle: "Why Time Series · Classical Limits · Transformers",
        color: "#00d4ff",
        questions: [
            {
                q: "What fundamental property of raw time series data makes forecasting far harder than language modelling?",
                opts: [
                    "The sequences are always too short to learn from",
                    "Non-stationarity — the statistical distribution itself drifts over time",
                    "Time series cannot be stored in floating-point format",
                    "Deep learning models were designed for images, not sequences",
                ],
                answer: 1,
                explain:
                    "Non-stationarity means the mean, variance, and covariance structure change over time. A $100 stock price in 1990 has very different context from the same price today. Classical models that assume a fixed distribution silently degrade as the world evolves.",
            },
            {
                q: "LSTMs promised to fix the 'memory problem' of RNNs, but they introduced a critical scalability bottleneck. What was it?",
                opts: [
                    "LSTMs require labelled data, making unsupervised training impossible",
                    "Sequential computation — to process step N you must first process step N-1, eliminating parallelism",
                    "LSTMs can only handle univariate series, not multi-variate data",
                    "LSTMs are limited to a context window of exactly 512 steps",
                ],
                answer: 1,
                explain:
                    "Sequential processing is the core bottleneck. Unlike Transformers which attend to all positions simultaneously, LSTMs must step through data one token at a time — making both training and inference effectively serial and preventing GPU parallelism at scale.",
            },
            {
                q: "The 2017 paper 'Attention is All You Need' introduced a key idea for time series: temporal distance collapses to zero. What does that mean practically?",
                opts: [
                    "The model compresses two years of data into a single embedding vector",
                    "Any two time steps — whether separated by minutes or years — can attend to each other in a single operation",
                    "The model removes timestamps and treats all data as simultaneous",
                    "The model only looks at the most recent data point to make a forecast",
                ],
                answer: 1,
                explain:
                    "In a Transformer, the Q-K-V attention operation connects step 1 and step 10,000 with the same computational cost as connecting consecutive steps. An event six months ago (e.g. a warm Pacific current) can directly influence today's prediction — something LSTMs struggle to preserve across very long gaps.",
            },
            {
                q: "LTSM uses 'Patching' to tokenise continuous time series. Besides a 250× speed improvement, what accuracy benefit does patching provide?",
                opts: [
                    "It reduces noise by averaging duplicate sensor readings",
                    "It forces the model to capture local geometric shape (slope, curve, spike) rather than raw point values",
                    "It converts multi-variate data into a single channel, simplifying attention",
                    "It automatically detects and removes seasonal patterns before training",
                ],
                answer: 1,
                explain:
                    "By grouping 16 raw time steps into one patch token, the model learns the local geometry — the shape and curvature — of the signal, not just a single noisy value. This acts as a built-in low-pass filter and forces the model toward semantically richer representations.",
            },
            {
                q: "Positional Encodings inject time-order awareness into Transformers using sine and cosine functions at different frequencies. Why frequencies — not just step indices like 1, 2, 3…?",
                opts: [
                    "Step indices would overflow 32-bit floating point for very long sequences",
                    "Sinusoidal frequencies encode both absolute position AND relative periodicity, letting the model learn that hour 1 and hour 25 are related in a 24-hour cycle",
                    "Frequencies are faster to compute than integer increments on GPU",
                    "Regulatory standards require sinusoidal encoding for financial applications",
                ],
                answer: 1,
                explain:
                    "Integer step indices carry no notion of cyclicality. Sinusoidal encodings at varying frequencies let the model recognise that 'Monday morning' recurs weekly, 'Q4' recurs annually, and intraday peaks recur hourly — all encoded in the same vector without any explicit calendar features.",
            },
        ],
    },

    {
        // ── SECTION 2 ─────────────────────────────────────────────────────────
        sectionTitle: "Large Time Series Models",
        sectionSubtitle: "Attention · Scaling · Architectures · Pretraining · Failure Modes",
        color: "#a78bfa",
        questions: [
            {
                q: "Multi-Head Attention runs several attention heads in parallel on the same data. What is the conceptual advantage over a single, wider attention head?",
                opts: [
                    "It reduces memory usage by splitting the computation across GPUs",
                    "Each head independently specialises on a different temporal pattern — e.g. high-frequency spikes, low-frequency trends, anomalies — and the model merges these perspectives",
                    "Multiple heads allow the model to process multiple time series simultaneously",
                    "It prevents overfitting by randomly dropping attention weights during training",
                ],
                answer: 1,
                explain:
                    "Think of each head as a domain expert. Head 1 might focus on the last hour (intraday noise); Head 2 on 52-week seasonality; Head 3 on black-swan volatility clusters. The combined representation is far richer than what a single head could capture — this is why multi-head attention scales to complex real-world data.",
            },
            {
                q: "RevIN (Reversible Instance Normalization) is the key trick that makes a model trained on 1990s data useful in 2024. How does it work?",
                opts: [
                    "It retrains the model every time the data distribution changes",
                    "It converts all time series into z-scores and stores the mean and variance, removing them before inference and restoring them after prediction",
                    "It uses a second model to reverse the output of the first model",
                    "It normalises across all training series to learn a universal scale",
                ],
                answer: 1,
                explain:
                    "RevIN normalises each instance (each series at inference time) by removing its mean and scaling by its variance. The model then reasons purely about relative dynamics — slopes and shapes — not absolute values. After the prediction is made, the stored mean and variance are re-applied. This makes the model distribution-agnostic across vastly different price levels and units.",
            },
            {
                q: "Amazon's Chronos treats time series forecasting as a pure language modelling problem. What is the radical design choice that makes this work?",
                opts: [
                    "It trains on text descriptions of the data rather than the data itself",
                    "It quantises continuous time-series values into discrete text tokens and feeds them into a standard T5 language model",
                    "It uses GPT-4 to generate synthetic time series and trains on those",
                    "It encodes each data point as a single word in the model's vocabulary",
                ],
                answer: 1,
                explain:
                    "Chronos converts floating-point values into discrete vocabulary tokens (e.g. mapping value ranges to token IDs), then treats the sequence exactly like a sentence. A standard T5 seq2seq model predicts the next tokens. This reuses the entire language modelling infrastructure — training, decoding, scaling — for time series without any architectural changes.",
            },
            {
                q: "Foundation Models are pretrained using Masked Modelling — they are never given explicit labels. How does this teach the model to understand temporal physics?",
                opts: [
                    "Random masking forces the model to memorise the training data exactly",
                    "To fill in a masked chunk correctly, the model must infer the underlying process (gravity, thermal dynamics, seasonality) linking visible time steps — effectively learning the governing equations unsupervised",
                    "Masking is purely a denoising technique that removes sensor noise",
                    "The masked tokens are predicted by a separate discriminator model in a GAN setup",
                ],
                answer: 1,
                explain:
                    "Masked modelling is a form of self-supervised learning. The model has no labels — only context and the masked target. To reconstruct a hidden 3-day temperature dip, the model must learn atmospheric dynamics. To reconstruct a hidden earnings shock, it must learn market microstructure. It internalises the 'physics' of real-world systems purely from data patterns.",
            },
            {
                q: "LoRA (Low-Rank Adaptation) is the recommended mitigation for Concept Drift in large LTSM models. Why is full fine-tuning NOT the preferred solution?",
                opts: [
                    "Full fine-tuning is illegal under data sovereignty regulations",
                    "Retraining 100B parameters on new data is computationally prohibitive; LoRA trains only a tiny low-rank adapter (~0.1% of parameters) on recent data, adapting the model in minutes",
                    "Full fine-tuning causes the model to forget how to do language modelling",
                    "LoRA uses less memory and therefore fits on consumer hardware",
                ],
                answer: 1,
                explain:
                    "Full fine-tuning of a 100B+ parameter model requires massive compute and risks catastrophic forgetting of pre-trained knowledge. LoRA instead freezes the original weights and trains a tiny pair of low-rank matrices injected at each layer. This captures the distribution shift with a fraction of the cost — and can be swapped out when the regime changes again.",
            },
        ],
    },

    {
        // ── SECTION 3 ─────────────────────────────────────────────────────────
        sectionTitle: "Agentic AI",
        sectionSubtitle: "ReAct Loop · Multi-Agent Orchestration · LEAP LTSM in Production",
        color: "#10b981",
        questions: [
            {
                q: "The ReAct framework powers autonomous agent reasoning. What distinguishes ReAct from simple 'chain-of-thought' prompting?",
                opts: [
                    "ReAct uses reinforcement learning; chain-of-thought uses supervised learning",
                    "ReAct interleaves natural language Reasoning with concrete external Actions (tool calls) and Observations (results), creating a closed feedback loop that self-corrects",
                    "ReAct is faster because it skips the thinking step",
                    "Chain-of-thought generates code; ReAct only generates text explanations",
                ],
                answer: 1,
                explain:
                    "Chain-of-thought produces reasoning text in a single forward pass with no external verification. ReAct adds the ACT and OBSERVE steps: the agent executes code, reads the actual output (including errors), and uses that to update its next reasoning step. This grounding in real execution results is what enables autonomous self-correction.",
            },
            {
                q: "In the LEAP LTSM agent, a 7,200-token context exceeds the model's 4,096-token limit. What does the agent's self-reflection step conclude, and how does it fix it?",
                opts: [
                    "It truncates the oldest data and retries with the same window",
                    "It detects a regime shift in the data and narrows the lookback window to post-regime-shift data only, reducing context length while improving relevance",
                    "It reduces the model from 77M to 7M parameters to accept more tokens",
                    "It splits the series into two parallel inference calls and averages the results",
                ],
                answer: 1,
                explain:
                    "A naive truncation would remove the most relevant recent data. Instead the agent applies a regime-detection heuristic: it identifies the structural break (e.g. OPEC cut at 2024-03-01) and sets the lookback start to 14 days before that event. This dramatically reduces context length — from 7,200 to ~3,991 tokens — while actually improving forecast quality by removing pre-regime noise.",
            },
            {
                q: "In the multi-agent LEAP architecture, why is the LEAP LTSM Sandbox designed to be stateless and containerised (Docker) for each run?",
                opts: [
                    "Docker is required by financial compliance regulations",
                    "Statefulness would cause memory leaks across runs, and containerisation ensures each inference gets a clean, isolated environment — preventing one agent's data from contaminating another's",
                    "The 77M parameter model is too large to fit in persistent memory",
                    "Containers allow the model to run on mobile devices",
                ],
                answer: 1,
                explain:
                    "In a multi-agent system where many agents may invoke the LTSM sandbox concurrently or in rapid succession, shared state would cause data leakage between runs (e.g. one user's series context persisting into another's inference). Stateless containers guarantee reproducibility, isolation, and horizontal scalability — each invocation is a clean slice.",
            },
            {
                q: "The Analysis Agent synthesises raw LTSM output into a natural-language insight. For Q1 crude variance, it reports Pearson(crude, OPEC) = 0.84 and Pearson(crude, PMI) = −0.67. What does the negative PMI correlation tell an analyst?",
                opts: [
                    "The data pipeline has a bug causing the PMI signal to be inverted",
                    "PMI (a demand indicator) moves inversely to crude price — when manufacturing contracts (PMI falls), crude demand drops, pulling price down — a counter-cyclical relationship useful for macro-hedging",
                    "The PMI signal should be excluded from future models as it reduces accuracy",
                    "Negative correlation means there is no statistically significant relationship",
                ],
                answer: 1,
                explain:
                    "A negative Pearson correlation of −0.67 between crude price and the PMI composite is economically meaningful: falling manufacturing activity signals reduced industrial energy demand, which depresses crude prices. This is a classic counter-cyclical signal. Far from a bug, it is actionable intelligence — an analyst could use PMI as an early-warning leading indicator for energy price softness.",
            },
            {
                q: "The agentic LEAP system compresses analyst workflows from 2–4 hours to under 8 seconds. Which combination of capabilities drives this compression?",
                opts: [
                    "Faster hardware (GPU clusters) and larger batch sizes",
                    "Autonomous code generation + sandboxed execution + self-correcting error handling + parallel multi-agent task routing — eliminating all human-in-the-loop steps except problem framing",
                    "Pre-computing all possible forecasts overnight and caching the results",
                    "Using a smaller, faster 7B parameter model instead of the full 77M LTSM",
                ],
                answer: 1,
                explain:
                    "The 8-second resolution time comes from removing human latency at every step: the Planning Agent decomposes the goal in milliseconds, the Coding Agent generates and executes tool code in seconds, self-correction handles errors without human review, and the Analysis Agent synthesises findings immediately. The compound removal of human wait times — not just hardware speed — is what drives the 1000× latency reduction.",
            },
        ],
    },
];
