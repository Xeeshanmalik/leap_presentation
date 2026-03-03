import { motion } from "framer-motion";

const PIPELINE_NODES = [
    { label: "INPUT", name: "User Text", sub: '"Forecast Q3\nwith macro ctx"', color: "#8b5cf6", accentBg: "rgba(139,92,246,0.12)" },
    { label: "REASONING", name: "LLM Brain", sub: "Intent parsing\nChain-of-Thought", color: "#00d4ff", accentBg: "rgba(0,212,255,0.1)" },
    { label: "DISPATCH", name: "Tool Router", sub: "Function calls\nTool selection", color: "#f59e0b", accentBg: "rgba(245,158,11,0.1)" },
    { label: "EXECUTION", name: "Python Sandbox", sub: "Isolated runtime\nCode gen + exec", color: "#10b981", accentBg: "rgba(16,185,129,0.1)" },
    { label: "INFERENCE", name: "LEAP LTSM", sub: "77M params\nTensor output", color: "#f43f5e", accentBg: "rgba(244,63,94,0.1)" },
];

const CODE_LINES = [
    { type: "kw", text: "def " },
    { type: "fn", text: "ltsm_forecast_tool" },
    { type: "base", text: "(series_id: " },
    { type: "nm", text: "str" },
    { type: "base", text: ", horizon: " },
    { type: "nm", text: "int" },
    { type: "base", text: ") → " },
    { type: "nm", text: "dict" },
    { type: "base", text: ":" },
];

const CMP_ITEMS = [
    {
        ok: false,
        color: "var(--rose)",
        title: "✗  DIRECT LLM QUERY",
        desc: "Hallucinates numerical values. No live data access. Cannot execute code. Token limit collapses on long series.",
    },
    {
        ok: true,
        color: "var(--green)",
        title: "✓  AGENTIC TOOL WORKFLOW",
        desc: "Generates Python → executes in sandbox → calls specialised LTSM → returns verified tensor with evaluation metrics.",
    },
];

/* One animated data-packet dot travelling from left to right along an arrow */
function Packet({ color, delay }) {
    return (
        <motion.div
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
            }}
            initial={{ left: "0%" }}
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 1.6, delay, repeat: Infinity, ease: "linear", repeatDelay: 0.2 }}
        />
    );
}

/* Arrow connector */
function Arrow({ primaryColor, packets }) {
    return (
        <div style={{ flex: 1, position: "relative", height: 2, background: "rgba(0,212,255,0.18)", minWidth: 18, overflow: "visible" }}>
            {/* arrowhead */}
            <div style={{
                position: "absolute", right: -1, top: "50%", transform: "translateY(-50%) rotate(45deg)",
                width: 6, height: 6, borderTop: `2px solid rgba(0,212,255,0.35)`, borderRight: `2px solid rgba(0,212,255,0.35)`,
            }} />
            {packets.map((p, i) => (
                <Packet key={i} color={p.color} delay={p.delay} />
            ))}
        </div>
    );
}

const ARROW_PACKETS = [
    [{ color: "#00d4ff", delay: 0 }, { color: "#8b5cf6", delay: 0.5 }],
    [{ color: "#8b5cf6", delay: 0.2 }, { color: "#f59e0b", delay: 0.9 }],
    [{ color: "#f59e0b", delay: 0 }, { color: "#10b981", delay: 0.7 }],
    [{ color: "#10b981", delay: 0.3 }, { color: "#f43f5e", delay: 1.0 }],
];

export default function SlideAgenticArch() {
    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-14 py-10">
            {/* Tag */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <span className="font-mono text-xs tracking-widest uppercase px-3 py-1 mb-5 inline-block"
                    style={{ color: "var(--teal)", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)" }}>
                    ▸ ARCHITECTURE
                </span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="font-syne font-extrabold leading-tight mb-1"
                style={{ fontSize: "2rem", color: "#fff" }}
            >
                The <span style={{ color: "var(--teal)" }}>Agentic</span> Architecture <span style={{ color: "var(--purple)" }}>Shift</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="font-mono text-xs mb-6" style={{ color: "var(--muted)" }}
            >
                // Direct LLM querying → Tool-Augmented Agentic Workflows
            </motion.p>

            {/* ── Pipeline Flow ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                style={{ display: "flex", alignItems: "stretch", gap: 0 }}
                className="mb-5"
            >
                {PIPELINE_NODES.map((node, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i === 0 || i === 4 ? "0 0 auto" : "1 1 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.18 }}
                            style={{
                                padding: "10px 14px",
                                background: node.accentBg,
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderTop: `2px solid ${node.color}`,
                                minWidth: 110,
                                whiteSpace: "pre-line",
                            }}
                        >
                            <div className="font-mono text-[0.48rem] tracking-widest mb-1" style={{ color: "var(--muted)" }}>{node.label}</div>
                            <div className="font-syne font-bold text-sm" style={{ color: node.color }}>{node.name}</div>
                            <div className="font-mono text-[0.5rem] mt-1" style={{ color: "var(--muted)" }}>{node.sub}</div>
                        </motion.div>
                        {i < PIPELINE_NODES.length - 1 && (
                            <Arrow primaryColor={PIPELINE_NODES[i + 1].color} packets={ARROW_PACKETS[i]} />
                        )}
                    </div>
                ))}
            </motion.div>

            {/* ── Bottom: Code Panel + Comparison ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1, minHeight: 0 }}>
                {/* Code panel */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                    style={{
                        background: "#030a15",
                        border: "1px solid rgba(0,212,255,0.15)",
                        padding: "12px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        lineHeight: 1.85,
                        color: "#b8d4f0",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ position: "absolute", top: 0, right: 0, padding: "2px 10px", background: "rgba(0,212,255,0.1)", fontSize: "0.48rem", letterSpacing: "0.2em", color: "var(--muted)" }}>
                        AGENT-GENERATED TOOL
                    </div>
                    <div>
                        <span style={{ color: "#8b5cf6" }}>def </span>
                        <span style={{ color: "var(--teal)" }}>ltsm_forecast_tool</span>
                        <span>(series_id: </span>
                        <span style={{ color: "#f59e0b" }}>str</span>
                        <span>, horizon: </span>
                        <span style={{ color: "#f59e0b" }}>int</span>
                        <span>) → </span>
                        <span style={{ color: "#f59e0b" }}>dict</span>
                        <span>:</span>
                    </div>
                    <div>
                        &nbsp;&nbsp;<span style={{ color: "var(--muted)", fontStyle: "italic" }}># Agent-generated: never hardcoded, always contextual</span>
                    </div>
                    <div>
                        &nbsp;&nbsp;slice_df = <span style={{ color: "var(--teal)" }}>ts_store.query</span>(series_id, <span style={{ color: "#10b981" }}>lookback=regime_window</span>)
                    </div>
                    <div>
                        &nbsp;&nbsp;tensor_in = <span style={{ color: "var(--teal)" }}>tokenize_ts</span>(slice_df, ctx_len=<span style={{ color: "#f59e0b" }}>4096</span>)
                        &nbsp;<span style={{ color: "var(--muted)", fontStyle: "italic" }}># budget-aware</span>
                    </div>
                    <div>
                        &nbsp;&nbsp;forecast = <span style={{ color: "var(--teal)" }}>ltsm_77m.predict</span>(tensor_in, steps=horizon)
                    </div>
                    <div>
                        &nbsp;&nbsp;<span style={{ color: "#8b5cf6" }}>return</span>&nbsp;
                        {"{"}<span style={{ color: "#10b981" }}>"forecast"</span>: forecast.numpy(), <span style={{ color: "#10b981" }}>"mape"</span>: <span style={{ color: "var(--teal)" }}>eval_mape</span>(forecast){"}"}
                    </div>
                </motion.div>

                {/* Comparison */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {CMP_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3 + i * 0.22 }}
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderLeft: `3px solid ${item.color}`,
                            }}
                        >
                            <div className="font-mono text-[0.52rem] tracking-widest mb-2" style={{ color: item.color }}>
                                {item.title}
                            </div>
                            <div className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.62rem" }}>
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
