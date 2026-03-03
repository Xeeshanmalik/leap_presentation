import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TERMINAL_LINES = [
    { delay: 300, type: "prompt", text: "agent.query(\"Forecast Q3 demand — macro context\")" },
    { delay: 900, type: "comment", text: "# Planning tool selection..." },
    { delay: 1400, type: "think", text: "▸ [THINK]  Parsing intent → forecast + correlation task" },
    { delay: 2000, type: "code", text: "▸ [CODE]   Writing temporal slice query tool..." },
    { delay: 2700, type: "exec", text: "▸ [EXEC]   Running in 77M-param LTSM sandbox" },
    { delay: 3500, type: "error", text: "✗ [ERROR]  ctx_len=7200 exceeds budget 4096 tokens" },
    { delay: 4200, type: "fix", text: "▸ [FIX]    Trimming to regime-change lookback window" },
    { delay: 5000, type: "success", text: "✓ [OK]     Tensor(96,1) returned  |  MAPE: 3.2%" },
];

const TYPE_COLORS = {
    prompt: "text-emerald-400",
    comment: "text-slate-500",
    think: "text-purple-400",
    code: "text-[var(--teal)]",
    exec: "text-[var(--teal)]",
    error: "text-rose-400",
    fix: "text-amber-400",
    success: "text-emerald-400",
};

const STATS = [
    { val: "77M", label: "PARAM LTSM" },
    { val: "O(n²)", label: "ATTN COMPLEXITY" },
    { val: "<1s", label: "INFERENCE LATENCY" },
    { val: "~99.998%", label: "COMPUTE REDUCTION" },
];

/* Animated floating node dots */
const NODE_POSITIONS = [
    { top: "12%", left: "8%", color: "#8b5cf6", delay: 0 },
    { top: "45%", left: "3%", color: "#00d4ff", delay: 0.4 },
    { top: "78%", left: "10%", color: "#10b981", delay: 0.8 },
    { top: "15%", right: "12%", color: "#f43f5e", delay: 0.6 },
    { top: "60%", right: "6%", color: "#f59e0b", delay: 1.2 },
];

function FloatDot({ style, color, delay }) {
    return (
        <motion.div
            style={{ ...style, backgroundColor: color, position: "absolute", width: 8, height: 8, borderRadius: "50%", boxShadow: `0 0 14px ${color}` }}
            animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        />
    );
}

export default function SlideAgenticIntro() {
    const [visibleLines, setVisibleLines] = useState([]);
    const [showCursor, setShowCursor] = useState(false);
    const timers = useRef([]);

    useEffect(() => {
        // Clear any previous timers on re-mount
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setVisibleLines([]);
        setShowCursor(false);

        TERMINAL_LINES.forEach((line) => {
            const t = setTimeout(() => {
                setVisibleLines((prev) => [...prev, line]);
            }, line.delay);
            timers.current.push(t);
        });

        const cursorTimer = setTimeout(() => setShowCursor(true), 5400);
        timers.current.push(cursorTimer);

        return () => timers.current.forEach(clearTimeout);
    }, []);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-14 py-10">
            {/* Section tag */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 mb-6 self-start"
            >
                <span
                    className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                    style={{ color: "var(--teal)", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)" }}
                >
                    ▸ CHAPTER IV — AGENTIC AI
                </span>
            </motion.div>

            <div className="flex flex-1 gap-10 min-h-0">
                {/* ── LEFT: Headline & Stats ── */}
                <div className="flex flex-col justify-center w-5/12 shrink-0">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="font-syne font-extrabold leading-[1.05]"
                        style={{ fontSize: "2.6rem", color: "#fff" }}
                    >
                        From{" "}
                        <span style={{ color: "var(--teal)" }}>Prediction</span>
                        <br />
                        to{" "}
                        <span style={{ color: "var(--gold)" }}>Action</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="font-mono text-xs mt-4 mb-8"
                        style={{ color: "var(--muted)", letterSpacing: "0.04em" }}
                    >
                        // Natural Language → Code Gen → LTSM Inference → Synthesis
                    </motion.p>

                    {/* Stats grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {STATS.map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-col p-3"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.12)" }}
                            >
                                <span className="font-mono font-bold text-2xl" style={{ color: "var(--teal)", textShadow: "0 0 18px rgba(0,212,255,0.5)" }}>
                                    {s.val}
                                </span>
                                <span className="font-mono text-[0.55rem] tracking-widest mt-1" style={{ color: "var(--muted)" }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── RIGHT: Terminal ── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.55 }}
                    className="flex-1 flex flex-col overflow-hidden rounded-md relative"
                    style={{ border: "1px solid rgba(0,212,255,0.18)", background: "#060e1c", boxShadow: "0 0 50px rgba(0,212,255,0.06), 0 0 90px rgba(139,92,246,0.04)" }}
                >
                    {/* Floating nodes overlay */}
                    {NODE_POSITIONS.map((n, i) => {
                        const { delay, color, ...pos } = n;
                        return <FloatDot key={i} style={pos} color={color} delay={delay} />;
                    })}

                    {/* Scan line */}
                    <motion.div
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg,transparent,var(--teal),transparent)", zIndex: 1 }}
                    />

                    {/* Title bar */}
                    <div
                        className="flex items-center gap-2 px-4 py-2 shrink-0"
                        style={{ background: "#0a1628", borderBottom: "1px solid rgba(0,212,255,0.12)" }}
                    >
                        <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-90" />
                        <span className="w-3 h-3 rounded-full bg-green-500 opacity-90" />
                        <span className="font-mono text-[0.5rem] ml-3" style={{ color: "var(--muted)" }}>
                            agent@leap-ltsm ~ zsh
                        </span>
                    </div>

                    {/* Terminal body */}
                    <div className="flex-1 overflow-hidden font-mono text-[0.64rem] leading-[1.85] p-4" style={{ color: "#b8d4f0" }}>
                        <div>
                            <span style={{ color: "var(--green)" }}>❯ </span>
                            <span style={{ color: "#fff" }}>
                                agent.query(
                                <span style={{ color: "var(--gold)" }}>&quot;Forecast Q3 demand — macro context&quot;</span>
                                )
                            </span>
                        </div>
                        {visibleLines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.18 }}
                                className={TYPE_COLORS[line.type] || "text-[#b8d4f0]"}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        {showCursor && (
                            <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                                style={{ display: "inline-block", width: 8, height: 14, background: "var(--teal)", verticalAlign: "text-bottom" }}
                            />
                        )}
                    </div>

                    {/* Bottom glow strip */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(transparent, rgba(0,212,255,0.04))", pointerEvents: "none" }} />
                </motion.div>
            </div>
        </div>
    );
}
