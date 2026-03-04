import { useState, useRef, useCallback, useEffect } from "react";
import { useGameState } from "../../hooks/useGameState";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Preset queries ─── */
const PRESETS = [
    "📊 Analyze Q1 variance and correlate with external metadata",
    "🔮 Forecast crude production next 96h with OPEC context",
    "⚠️ Detect refinery throughput anomalies — explain root cause",
    "🌐 Multi-series correlation: crude, natgas, PMI signals",
];

/* ─── Trace sequences ─── */
const TRACES = [
    [
        { d: 0, t: "info", m: '<span style="color:var(--teal)">Query received:</span> "Analyze Q1 variance and correlate with external metadata"' },
        { d: 420, t: "think", m: '<span style="color:#8b5cf6">Planning Agent →</span> Decomposing: (A) load Q1 slice, (B) fetch metadata, (C) variance analysis, (D) correlation matrix' },
        { d: 900, t: "think", m: 'Routing: <span style="color:#8b5cf6">Coding Agent</span> → tasks A,C | <span style="color:#10b981">Analysis Agent</span> → task D. Running in parallel.' },
        { d: 1400, t: "code", m: '<span style="color:var(--teal)">Coding Agent →</span> Writing tool: <code style="color:#10b981">query_ts("crude_v2", start="2024-01-01", end="2024-03-31")</code>' },
        { d: 1950, t: "code", m: 'Injecting exogenous context: OPEC_cuts=-1.2M, EIA_build=+8.4M, PMI_china=49.1, weather_anom=+2.1°C' },
        { d: 2550, t: "exec", m: '<span style="color:#10b981">Sandbox PID:5291 →</span> Loading 77M LEAP LTSM weights from checkpoint v2.1...' },
        { d: 3150, t: "exec", m: 'Context assembly: ts_slice=3820 tok + exo_vec=248 tok = <span style="color:#10b981">4068 / 4096 ✓</span>' },
        { d: 3800, t: "error", m: '<span style="color:#f43f5e">RuntimeError:</span> NaN detected in range [2024-02-14 → 2024-02-16]. Missing data window (holiday gap).' },
        { d: 4400, t: "fix", m: '<span style="color:#f59e0b">Self-reflect →</span> 3-day missing window. Applying linear interpolation. Retrying.' },
        { d: 5000, t: "code", m: 'Rewriting: <code style="color:#f59e0b">fill_gaps(method="linear", limit=72h)</code> + re-tokenising slice...' },
        { d: 5600, t: "exec", m: 'LEAP LTSM inference complete. <span style="color:#10b981">Tensor(96,1) returned.</span> Forwarding to Analysis Agent.' },
        { d: 6200, t: "ok", m: '<span style="color:#10b981">Analysis Agent →</span> Q1 σ²=142.7 | Peak: 2024-03-12 | Pearson(crude,OPEC)=0.84 | Pearson(crude,PMI)=-0.67' },
        { d: 6750, t: "ok", m: '<span style="color:#10b981">Synthesis complete.</span> MAPE: 3.2% · 2 exogenous signals significant (p&lt;0.01)' },
    ],
    [
        { d: 0, t: "info", m: '<span style="color:var(--teal)">Query:</span> "Forecast crude production next 96h with OPEC context"' },
        { d: 480, t: "think", m: '<span style="color:#8b5cf6">Planning Agent →</span> horizon=96h · Need latest OPEC bulletin · Apply supply-side regime adjustment' },
        { d: 1050, t: "code", m: '<span style="color:var(--teal)">Coding Agent →</span> <code style="color:#10b981">fetch_opec_bulletin(date="latest")</code> → Production delta: -1.2M bbl/day effective 2024-03-01' },
        { d: 1680, t: "exec", m: 'Regime shift confirmed at 2024-03-01. Setting lookback_start = regime_ts - 14d (regime-aware window)' },
        { d: 2250, t: "exec", m: '<span style="color:#10b981">LEAP LTSM Sandbox →</span> ctx_len=3991 tok ✓ · Running patch-token batch inference...' },
        { d: 3050, t: "ok", m: '<span style="color:#10b981">Forecast tensor:</span> shape(96,1) · μ=84.2 $/bbl · σ=2.1 · 95% CI: [80.1, 88.3]' },
        { d: 3650, t: "ok", m: 'OPEC risk premium applied: +$4.2/bbl. <span style="color:#10b981">Final MAPE: 2.8% — top-decile accuracy.</span>' },
    ],
    [
        { d: 0, t: "info", m: '<span style="color:var(--teal)">Query:</span> "Detect refinery throughput anomalies — explain root cause"' },
        { d: 500, t: "think", m: '<span style="color:#8b5cf6">Planning Agent →</span> Anomaly task: IQR baseline + LTSM residual analysis + causal metadata cross-ref' },
        { d: 1100, t: "code", m: '<span style="color:var(--teal)">Coding Agent →</span> <code style="color:#10b981">detect_anomalies(method="ltsm_residual", sigma_threshold=2.5, window=180)</code>' },
        { d: 1750, t: "exec", m: '<span style="color:#10b981">Sandbox →</span> Computing expected vs actual throughput across 180-day window...' },
        { d: 2450, t: "error", m: '<span style="color:#f43f5e">Warning: 3 anomaly clusters detected.</span> Residuals exceed 2.5σ at: Jan-08, Feb-21, Mar-14.' },
        { d: 3050, t: "fix", m: '<span style="color:#f59e0b">Causal lookup →</span> Cross-referencing maintenance logs + weather events + demand shocks...' },
        { d: 3750, t: "ok", m: 'Jan-08: Unplanned outage (log match). Feb-21: Arctic cold snap (-15°C). Mar-14: PMI demand surge.' },
        { d: 4350, t: "ok", m: '<span style="color:#10b981">Root cause synthesis:</span> 2/3 anomalies preventable. Proactive scheduling recommendation generated.' },
    ],
    [
        { d: 0, t: "info", m: '<span style="color:var(--teal)">Query:</span> "Multi-series correlation: crude, natgas, PMI signals"' },
        { d: 500, t: "think", m: '<span style="color:#8b5cf6">Planning Agent →</span> Multi-variate task. Spawning 3 parallel LTSM queries with regime-aligned windows.' },
        { d: 1000, t: "code", m: 'Coding Agent spawning 3 threads: <span style="color:#10b981">crude_v2</span> · <span style="color:#8b5cf6">natgas_v1</span> · <span style="color:#f59e0b">pmi_composite</span>' },
        { d: 1700, t: "exec", m: '<span style="color:#10b981">Sandbox →</span> Parallel inference · crude:4012tok · natgas:3890tok · PMI:310tok' },
        { d: 2450, t: "exec", m: 'Tensors received. Computing Pearson + Granger causality matrix...' },
        { d: 3200, t: "ok", m: 'Pearson(crude,natgas)=0.71 · Granger: natgas → crude lag 3d (p&lt;0.01) · PMI leads crude by 14d' },
        { d: 3900, t: "ok", m: '<span style="color:#10b981">Cross-asset correlation complete.</span> Lead-lag signals quantified. Trading signal framework generated.' },
    ],
];

const RESULTS = [
    {
        metrics: [{ v: "+12.4%", c: "#10b981", k: "Q1 YoY Variance" }, { v: "3.2%", c: "#00d4ff", k: "LTSM MAPE" }, { v: "0.84", c: "#10b981", k: "OPEC Correlation" }],
        bars: [28, 34, 42, 37, 50, 44, 52, 47],
        barColors: ["#f43f5e", "#8b5cf6", "#00d4ff", "#f59e0b", "#10b981", "#00d4ff", "#10b981", "#00d4ff"],
        summary: "✓ Q1 crude variance peaked March 12 (+12.4% YoY), strongly correlated with OPEC cut (r=0.84). EIA surplus created a -0.67 counter-signal. LTSM forecast indicates normalization by Q2-W6. Recommendation: trim lookback to post-March-1 regime for all Q2 runs.",
    },
    {
        metrics: [{ v: "84.2 $/bbl", c: "#10b981", k: "96h Forecast μ" }, { v: "2.8%", c: "#00d4ff", k: "LTSM MAPE" }, { v: "+$4.2/bbl", c: "#10b981", k: "OPEC Risk Premium" }],
        bars: [38, 40, 43, 42, 45, 44, 46, 48],
        barColors: ["#00d4ff", "#00d4ff", "#10b981", "#10b981", "#10b981", "#f59e0b", "#f59e0b", "#10b981"],
        summary: "✓ 96h crude forecast μ=84.2 $/bbl (95% CI: 80.1–88.3) with OPEC constraint integrated. Regime-aware 14d lookback reduced pre-cut price noise. Risk premium +$4.2/bbl for Hormuz tension. Highest confidence window: 0–48h (MAPE 2.1%).",
    },
    {
        metrics: [{ v: "3 clusters", c: "#f43f5e", k: "Anomalies Detected" }, { v: "67%", c: "#10b981", k: "Preventable Rate" }, { v: "2.5σ", c: "#00d4ff", k: "Detection Threshold" }],
        bars: [20, 22, 48, 25, 30, 45, 28, 42],
        barColors: ["#64748b", "#64748b", "#f43f5e", "#64748b", "#64748b", "#f43f5e", "#64748b", "#f43f5e"],
        summary: "✓ 3 anomaly clusters in refinery throughput (180d, 2.5σ). Root causes: Jan-08 unplanned outage, Feb-21 Arctic cold snap (-15°C), Mar-14 PMI demand surge. 2/3 preventable via predictive scheduling + 72h weather + calendar integration.",
    },
    {
        metrics: [{ v: "0.71", c: "#10b981", k: "Crude↔NatGas r" }, { v: "3d lag", c: "#00d4ff", k: "Granger Lead" }, { v: "14 days", c: "#10b981", k: "PMI Lead Time" }],
        bars: [35, 40, 38, 44, 42, 46, 48, 50],
        barColors: ["#00d4ff", "#8b5cf6", "#00d4ff", "#8b5cf6", "#00d4ff", "#10b981", "#10b981", "#00d4ff"],
        summary: "✓ NatGas Granger-causes crude with 3d lag (p<0.01) — actionable lead signal. PMI composite leads crude by 14 days, enabling demand-side early warning. Recommended: integrate natgas+PMI as exogenous inputs to all future LEAP LTSM crude runs.",
    },
];

const TAG_STYLES = {
    think: { bg: "rgba(139,92,246,0.2)", color: "#8b5cf6", label: "THINK" },
    code: { bg: "rgba(0,212,255,0.2)", color: "#00d4ff", label: "CODE" },
    exec: { bg: "rgba(16,185,129,0.2)", color: "#10b981", label: "EXEC" },
    error: { bg: "rgba(244,63,94,0.2)", color: "#f43f5e", label: "ERROR" },
    fix: { bg: "rgba(245,158,11,0.2)", color: "#f59e0b", label: "REFLECT" },
    ok: { bg: "rgba(16,185,129,0.2)", color: "#10b981", label: "SUCCESS" },
    info: { bg: "rgba(180,200,220,0.08)", color: "#94a3b8", label: "INFO" },
};

function TraceEntry({ type, msg, ts }) {
    const tag = TAG_STYLES[type] || TAG_STYLES.info;
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex", gap: 7, marginBottom: 2, alignItems: "flex-start" }}
        >
            <span className="font-mono text-[0.48rem] shrink-0" style={{ color: "var(--muted)", paddingTop: 1 }}>{ts}</span>
            <span className="font-mono text-[0.46rem] font-bold tracking-wider px-1 shrink-0 mt-px"
                style={{ background: tag.bg, color: tag.color }}>
                {tag.label}
            </span>
            <span className="font-mono text-[0.56rem] leading-relaxed" style={{ color: "#b8d4f0", flex: 1 }}
                dangerouslySetInnerHTML={{ __html: msg }} />
        </motion.div>
    );
}

export default function SlideAgenticDemo() {
    const { slideData, setSlideData, role } = useGameState();
    const [entries, setEntries] = useState([]);
    const [result, setResult] = useState(null);
    const [running, setRunning] = useState(false);
    const [activePreset, setActivePreset] = useState(null);
    const [systemStatus, setSystemStatus] = useState({ ltsm: "ONLINE", sandbox: "READY", ctx: "0 / 4096", agents: "3 IDLE" });
    const timers = useRef([]);
    const logRef = useRef(null);
    const lastTrigger = useRef(null);
    const [inputVal, setInputVal] = useState(PRESETS[0].replace(/^[^\s]+\s/, ""));

    const runTrace = useCallback((idx) => {
        if (running) return;
        setRunning(true);
        setEntries([]);
        setResult(null);
        setActivePreset(idx);
        setSystemStatus({ ltsm: "ACTIVE", sandbox: "RUNNING", ctx: "0 / 4096", agents: "3 ACTIVE" });

        timers.current.forEach(clearTimeout);
        timers.current = [];

        const trace = TRACES[idx] || TRACES[0];

        /* context token ticker */
        const ticker = setInterval(() => {
            setSystemStatus(s => ({ ...s, ctx: Math.floor(Math.random() * 4096) + " / 4096" }));
        }, 380);
        timers.current.push(ticker);

        trace.forEach(({ d, t, m }) => {
            const tid = setTimeout(() => {
                const now = new Date();
                const ts = [now.getHours(), now.getMinutes(), now.getSeconds()]
                    .map(v => String(v).padStart(2, "0")).join(":") +
                    "." + String(now.getMilliseconds()).padStart(3, "0");
                setEntries(prev => [...prev, { t, m, ts }]);
                if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
            }, d);
            timers.current.push(tid);
        });

        const last = trace[trace.length - 1].d + 700;
        const done = setTimeout(() => {
            clearInterval(ticker);
            setSystemStatus({ ltsm: "ONLINE", sandbox: "READY", ctx: "4068 / 4096", agents: "3 IDLE" });
            setResult(RESULTS[idx] || RESULTS[0]);
            setRunning(false);
        }, last + 500);
        timers.current.push(done);
    }, [running]);

    useEffect(() => {
        if (slideData?.trigger && slideData.trigger !== lastTrigger.current) {
            lastTrigger.current = slideData.trigger;
            setInputVal(PRESETS[slideData.activePreset].replace(/^[^\s]+\s/, ""));
            runTrace(slideData.activePreset);
        }
    }, [slideData?.trigger, slideData?.activePreset, runTrace]);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-10 py-8" style={{ fontSize: "0.65rem" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <span className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                    style={{ color: "var(--teal)", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)" }}>
                    ▸ LIVE SIMULATION
                </span>
                <h2 className="font-syne font-extrabold" style={{ fontSize: "1.15rem", color: "#fff" }}>
                    Interactive Agent <span style={{ color: "var(--teal)" }}>Demo</span>
                </h2>
                <span className="font-mono ml-auto" style={{ color: "var(--muted)", fontSize: "0.56rem" }}>
                    LEAP LTSM Core v2.1 · 77M params
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 10, flex: 1, minHeight: 0 }}>
                {/* ── Sidebar ── */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,255,0.12)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div className="font-mono text-[0.52rem] tracking-widest px-3 py-2" style={{ color: "var(--muted)", borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
                        PRESET QUERIES
                    </div>
                    {PRESETS.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const trigger = Date.now();
                                if (role === "presenter") {
                                    setSlideData({ activePreset: i, trigger });
                                    lastTrigger.current = trigger;
                                }
                                setInputVal(p.replace(/^[^\s]+\s/, ""));
                                runTrace(i);
                            }}
                            className="font-mono text-[0.57rem] text-left px-3 py-2 transition-all"
                            style={{
                                background: activePreset === i && running ? "rgba(0,212,255,0.05)" : "transparent",
                                color: activePreset === i && running ? "var(--teal)" : "#b8d4f0",
                                borderBottom: "1px solid rgba(0,212,255,0.08)",
                                lineHeight: 1.5,
                                cursor: "pointer",
                            }}
                        >
                            {p}
                        </button>
                    ))}

                    {/* System status */}
                    <div style={{ marginTop: "auto", borderTop: "1px solid rgba(0,212,255,0.1)", padding: "10px 12px" }}>
                        <div className="font-mono text-[0.48rem] tracking-widest mb-2" style={{ color: "var(--gold)" }}>SYSTEM STATUS</div>
                        {[
                            ["LTSM Core", systemStatus.ltsm],
                            ["Sandbox", systemStatus.sandbox],
                            ["Context Tokens", systemStatus.ctx],
                            ["Agents Active", systemStatus.agents],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                <span className="font-mono text-[0.5rem]" style={{ color: "var(--muted)" }}>{k}</span>
                                <span className="font-mono text-[0.5rem]" style={{ color: "var(--green)" }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Main Panel ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
                    {/* Input row */}
                    <div style={{ display: "flex", gap: 8 }}>
                        <input
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            className="font-mono text-[0.6rem]"
                            style={{
                                flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.18)",
                                padding: "8px 12px", color: "#b8d4f0", outline: "none"
                            }}
                            placeholder="Type natural language query..."
                        />
                        <button
                            onClick={() => {
                                const idx = PRESETS.findIndex(p => inputVal.toLowerCase().includes(p.slice(2, 20).toLowerCase()));
                                const finalIdx = idx >= 0 ? idx : 0;
                                const trigger = Date.now();
                                if (role === "presenter") {
                                    setSlideData({ activePreset: finalIdx, trigger });
                                    lastTrigger.current = trigger;
                                }
                                runTrace(finalIdx);
                            }}
                            disabled={running}
                            className="font-mono text-[0.58rem] tracking-widest transition-all"
                            style={{
                                background: "transparent", border: "1px solid var(--teal)", color: "var(--teal)",
                                padding: "8px 18px", cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.45 : 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {running ? "RUNNING…" : "▶ EXECUTE"}
                        </button>
                    </div>

                    {/* Trace log */}
                    <div
                        ref={logRef}
                        style={{
                            flex: result ? "0 0 130px" : 1,
                            background: "#01060f",
                            border: "1px solid rgba(0,212,255,0.12)",
                            overflowY: "auto",
                            padding: "10px 10px",
                            transition: "flex 0.3s",
                            minHeight: 80,
                        }}
                    >
                        {entries.length === 0 && (
                            <div className="font-mono text-[0.56rem]" style={{ color: "var(--muted)" }}>
                                // Agent execution trace will appear here.<br />
                                // Select a preset query or type your own, then press EXECUTE.
                            </div>
                        )}
                        {entries.map((e, i) => <TraceEntry key={i} type={e.t} msg={e.m} ts={e.ts} />)}
                    </div>

                    {/* Result area */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,255,0.12)", padding: "10px 12px", overflow: "hidden" }}
                            >
                                <div className="font-mono text-[0.5rem] tracking-widest mb-2" style={{ color: "var(--muted)" }}>▸ AGENT OUTPUT — SYNTHESISED RESULT</div>
                                {/* Metrics */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                                    {result.metrics.map((m, i) => (
                                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "6px 10px" }}>
                                            <div className="font-mono font-bold" style={{ fontSize: "0.9rem", color: m.c }}>{m.v}</div>
                                            <div className="font-mono text-[0.48rem] mt-1" style={{ color: "var(--muted)" }}>{m.k}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Chart + summary */}
                                <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 46, padding: "0 3px" }}>
                                        {result.bars.map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: h }}
                                                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                                                style={{ width: 14, borderRadius: "2px 2px 0 0", background: result.barColors[i], flexShrink: 0 }}
                                            />
                                        ))}
                                    </div>
                                    <div className="font-mono text-[0.57rem] leading-relaxed flex-1"
                                        style={{ background: "rgba(255,255,255,0.03)", borderLeft: "3px solid var(--green)", padding: "6px 10px", color: "#b8d4f0" }}>
                                        {result.summary}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
