import { motion } from "framer-motion";

/* ─── Agent cards ─── */
const AGENTS = [
    {
        id: "planning",
        name: "🧠 Planning Agent",
        role: "Goal decomp · CoT · Task routing",
        status: "ORCHESTRATING",
        statusActive: true,
        color: "#00d4ff",
        style: { top: "4%", left: "calc(50% - 72px)" },
    },
    {
        id: "coding",
        name: "⚙️ Coding Agent",
        role: "Python codegen · Sandbox · Error fix",
        status: "RUNNING",
        statusActive: true,
        color: "#8b5cf6",
        style: { top: "44%", left: "2%" },
    },
    {
        id: "analysis",
        name: "📊 Analysis Agent",
        role: "Tensor parsing · Stats · Summary",
        status: "WAITING",
        statusActive: false,
        color: "#10b981",
        style: { top: "44%", right: "2%" },
    },
    {
        id: "ltsm",
        name: "🔮 LEAP LTSM Sandbox",
        role: "77M params · Patch tokens",
        status: "INFERRING",
        statusActive: true,
        color: "#f43f5e",
        style: { bottom: "4%", left: "calc(50% - 82px)" },
    },
];

/* ─── ReAct steps ─── */
const REACT_STEPS = [
    {
        icon: "💭",
        label: "REASON",
        desc: 'Task: "Forecast Q3 + macro correlation." Decomposing: (A) LTSM forecast, (B) exogenous correlation. Routing to specialised agents in parallel.',
    },
    {
        icon: "🎯",
        label: "ACT: CODING AGENT INVOKED",
        desc: "write_tool(\"ltsm_forecast\", series=\"crude_v2\", horizon=96) → Executing in Docker sandbox PID:4821.",
        codeColor: true,
    },
    {
        icon: "👁️",
        label: "OBSERVE: ERROR",
        desc: "RuntimeError: ctx_len=7200 exceeds LTSM max 4096. Tensor shape mismatch.",
        isError: true,
    },
    {
        icon: "🔄",
        label: "REASON: SELF-REFLECT",
        desc: "Context overflow. Applying regime-detection heuristic → new window: 14d post regime shift at 2024-03-01. Rewriting tool.",
    },
    {
        icon: "✅",
        label: "ACT → OBSERVE: SUCCESS",
        desc: "Tensor(96,1) returned. MAPE: 3.2%. Handing off to Analysis Agent for NL synthesis.",
        isSuccess: true,
    },
];

export default function SlideAgenticOrchestration() {
    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-14 py-10">
            {/* Tag */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <span className="font-mono text-xs tracking-widest uppercase px-3 py-1 mb-4 inline-block"
                    style={{ color: "var(--teal)", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)" }}>
                    ▸ MULTI-AGENT SYSTEMS
                </span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="font-syne font-extrabold mb-1"
                style={{ fontSize: "1.95rem", color: "#fff", lineHeight: 1.1 }}
            >
                Multi-Agent <span style={{ color: "var(--teal)" }}>Orchestration</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="font-mono text-xs mb-5" style={{ color: "var(--muted)" }}
            >
                // Decentralised task decomposition — ReAct + Chain-of-Thought
            </motion.p>

            <div className="flex flex-1 gap-8 min-h-0">
                {/* ── LEFT: Agent Map ── */}
                <div className="relative" style={{ width: "48%", flexShrink: 0 }}>
                    {/* SVG connection lines + animated circles */}
                    <svg
                        viewBox="0 0 400 310"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                    >
                        {/* Line: Planning → Coding */}
                        <line x1="140" y1="68" x2="72" y2="155" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite" />
                        </line>
                        {/* Line: Planning → Analysis */}
                        <line x1="210" y1="68" x2="318" y2="155" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                        </line>
                        {/* Line: Coding → LTSM */}
                        <line x1="72" y1="215" x2="170" y2="262" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="0.8s" repeatCount="indefinite" />
                        </line>
                        {/* Line: Analysis → LTSM */}
                        <line x1="255" y1="262" x2="318" y2="215" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="0.9s" repeatCount="indefinite" />
                        </line>

                        {/* Animated moving packets */}
                        <circle r="5" fill="#00d4ff">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M140,68 L72,155" />
                            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5" fill="#10b981">
                            <animateMotion dur="2.4s" repeatCount="indefinite" path="M210,68 L318,155" />
                            <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                        <circle r="4" fill="#8b5cf6">
                            <animateMotion dur="1.8s" repeatCount="indefinite" path="M72,215 L170,262" />
                            <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                        <circle r="4" fill="#f43f5e">
                            <animateMotion dur="1.6s" repeatCount="indefinite" path="M255,262 L318,215" />
                            <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Agent cards */}
                    {AGENTS.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.18 }}
                            style={{
                                position: "absolute",
                                ...agent.style,
                                minWidth: 134,
                                padding: "9px 13px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderTop: `2px solid ${agent.color}`,
                            }}
                        >
                            <div className="font-mono font-bold text-xs mb-1" style={{ color: agent.color }}>
                                {agent.name}
                            </div>
                            <div className="font-mono text-[0.52rem]" style={{ color: "var(--muted)" }}>
                                {agent.role}
                            </div>
                            {agent.statusActive ? (
                                <motion.div
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="font-mono text-[0.45rem] mt-1 inline-block px-2 py-px border"
                                    style={{ color: agent.color, borderColor: agent.color }}
                                >
                                    {agent.status}
                                </motion.div>
                            ) : (
                                <div className="font-mono text-[0.45rem] mt-1 inline-block px-2 py-px border"
                                    style={{ color: "var(--muted)", borderColor: "var(--muted)" }}>
                                    {agent.status}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* ── RIGHT: ReAct Loop ── */}
                <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        flex: 1,
                        minHeight: 0,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(0,212,255,0.12)",
                        padding: 16,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                        ▸ REACT LOOP — CHAIN-OF-THOUGHT TRACE
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                        {REACT_STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.22 }}
                                style={{ display: "flex", gap: 9, alignItems: "flex-start", flex: 1 }}
                            >
                                <span style={{ fontSize: "0.95rem", flexShrink: 0, width: 20 }}>{step.icon}</span>
                                <div>
                                    <div className="font-mono text-[0.5rem] tracking-wider mb-1"
                                        style={{ color: step.isError ? "var(--rose)" : step.isSuccess ? "var(--green)" : "var(--gold)" }}>
                                        {step.label}
                                    </div>
                                    <div className="font-mono text-[0.57rem] leading-relaxed"
                                        style={{ color: step.isError ? "var(--rose)" : step.isSuccess ? "var(--green)" : "var(--muted)" }}>
                                        {step.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
