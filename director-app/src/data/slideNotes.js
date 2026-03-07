export const slideNotes = {
    0: `LARGE TIME SERIES MODEL

[INTRO]
Welcome to the BI-50 Project update.
Today we're exploring how modern AI actually understands the data it's given, moving into the Large Foundation Model Era.`,

    1: `THE PROBLEM: WHY IS THIS HARD?

[INTRO]
"Why is this hard? Why haven't we solved this yet? Because Time is a difficult adversary."

[NON-STATIONARITY]
"In language, an 'Apple' is an 'Apple'—whether Shakespeare wrote it in 1600 or I say it today. The meaning is stable.
But in Time Series? The rules change while you're playing the game. What a stock price of $100 meant in 1990 is very different from what it means today. The statistical distribution drifts."

[LONG-RANGE DEPENDENCIES & IRREGULAR SAMPLING]
"And then there's the Memory Problem. An event that happened six months ago—a tiny glint of warm water in the Pacific—can cause a torrential flood in California today. Classical models have amnesia; they forget. We need a model with the memory of an elephant and the adaptability of a chameleon."`,

    2: `CLASSICAL LIMITS: GHOSTS OF MODELS PAST

[INTRO]
"Let's walk through the graveyard of our previous attempts."

[ARIMA]
"First, we had ARIMA. The reliable sedan. Great for linear, predictable roads. But throw it into a chaotic nonlinear system? It stalls. It requires you to manually tune it, to tell it 'differencing is needed here'. It doesn't learn; it obeys."

[LSTMs & CNNs]
"Then came Deep Learning 1.0: LSTMs and TCNs. They promised to solve the memory problem. And they did—partially. But they were slow. Sequential. To understand step 1000, you had to compute step 999, then 998... It was like reading a book by spelling out every letter. You can't skim. You can't scale.
The tragedy of these models? They were lonely. A model trained on Walmart sales knew nothing about Target sales. They couldn't transfer knowledge. We needed a hive mind."`,

    3: `THE FRAGMENTATION CRISIS (EXECUTIVE VIEW)

[INTRO]
"Every department has built its own model. Every model only does one thing. The result: hundreds of brittle, expensive, siloed systems."

[SILOS INTERACTION]
"Click through the silos on screen. Look at what happens across manufacturing, energy, and supply chain. They are trapped in endless cycles of retraining. When a regime changes—a new season, a market shift—the models fail silently."

[LIVE DRIFT SIMULATION]
"Look at the simulation below. This is Distribution Drift. Traditional models (in red, blue, yellow) collapse when the regime shifts. They must be rebuilt. The LTSM (in green) remains stable because it has learned the underlying physics of the data, not just memorized the past."`,

    4: `THE LTSM SOLUTION

[INTRO]
"LTSM is the GPT moment for operational data. A single pre-trained foundation model that understands time."

[ONE MODEL, EVERY TASK]
"Watch the simulation. I can select Predictive Maintenance, Load Forecasting, or Anomaly Detection. The underlying model doesn't change. It requires zero retraining. Notice how it instantly adapts to the different signal types: producing confidence intervals, detecting spikes, tracing attention arcs back to the root cause."

[CAPABILITIES]
"This gives us zero-shot generalization, instant cold start capabilities for new assets, and unified cross-domain intelligence. Most importantly, it reduces the models we need to maintain by 90%."`,

    5: `EXECUTIVE SUMMARY: VALIDATION & ROI

[INTRO]
"So, how does this translate to business value?"

[HEAD TO HEAD]
"Traditional ML gives us a 6-18 month cold start. LTSM gives us instant predictions. Traditional ML consumes 80% of our budget purely on maintenance. LTSM reduces that maintenance by 90%, freeing our teams to innovate."

[ROI TABLE]
"Look at the numbers. In manufacturing, we go from 71% to 91% accuracy—stable across retools. In Supply Chain, we eliminate the 6-month cold start period for new SKUs. Across 5 domains, we are looking at over $29M in annual value creation."

[RADAR & CLOSE]
"The radar chart speaks for itself. The organizations that deploy LTSM first will have a 3-5 year compounding advantage. This is the ChatGPT moment for operational intelligence."`
};
