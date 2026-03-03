/**
 * SlideQA — Presenter-side Q&A slide.
 *
 * Shows question to the presenter + live audience response count.
 * Buttons:
 *   PUSH QUESTION → activates this question on all /quiz tabs (audience phones)
 *   REVEAL ANSWER → flips to reveal mode on all audience tabs + shows explanation
 *   NEXT QUESTION → advances; right-arrow key also works
 *   VIEW RESULTS  → on final question, shown as "VIEW RESULTS →"
 *
 * sectionIdx: 0 | 1 | 2  (passed from SlideRenderer via QA_SLIDE_MAP)
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QA_SECTIONS } from "../../data/qa-data";
import {
    subscribeToAnswers,
    subscribeToPayers,
    setActiveQuestion,
    revealAnswer,
    setIdle,
    readState,
} from "../../lib/useQuizStore";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function SlideQA({ sectionIdx }) {
    const section = QA_SECTIONS[sectionIdx] ?? QA_SECTIONS[0];
    const qs = section.questions;
    const color = section.color;

    // Local UI state
    const [qIdx, setQIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [pushed, setPushed] = useState(false); // whether this q was pushed to audience
    const [pushCount, setPushCount] = useState(0); // how many audience answered

    // Audience stats
    const [answers, setAnswers] = useState({});
    const [players, setPlayers] = useState({});

    useEffect(() => {
        const u1 = subscribeToAnswers(setAnswers);
        const u2 = subscribeToPayers(setPlayers);
        return () => { u1(); u2(); };
    }, []);

    // Count how many answered this specific question
    useEffect(() => {
        const key = `${sectionIdx}_${qIdx}`;
        const count = Object.values(answers).filter(a => a.answers?.[key] !== undefined).length;
        setPushCount(count);
    }, [answers, sectionIdx, qIdx]);

    // Reset push/reveal state when question changes
    useEffect(() => {
        setPushed(false);
        setIdle();
    }, [qIdx]);

    const q = qs[qIdx];

    // ── Right arrow key handler ──
    const handleKey = useCallback((e) => {
        if (e.key === "ArrowRight" && revealed && !done) advance();
    }, [revealed, done, qIdx]); // eslint-disable-line

    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    function choose(i) {
        if (revealed) return;
        setSelected(i);
    }

    function pushQuestion() {
        setActiveQuestion(sectionIdx, qIdx);
        setPushed(true);
    }

    function handleReveal() {
        if (selected === null) return;
        if (!revealed) {
            if (selected === q.answer) setScore(s => s + 1);
            setRevealed(true);
            revealAnswer(); // push to audience tabs
        }
    }

    function advance() {
        if (qIdx < qs.length - 1) {
            setQIdx(qIdx + 1);
            setSelected(null);
            setRevealed(false);
        } else {
            setDone(true);
        }
    }

    function restart() {
        setQIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); setPushed(false);
    }

    const totalPlayers = Object.keys(players).length;

    /* ── Score screen ── */
    if (done) {
        const pct = Math.round((score / qs.length) * 100);
        const grade = score === 5 ? "Perfect!" : score >= 4 ? "Excellent" : score >= 3 ? "Good" : "Keep studying";
        return (
            <div className="flex flex-col items-center justify-center h-full w-full px-14" style={{ gap: 24 }}>
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180 }}>
                    <div className="font-syne font-extrabold text-center" style={{ fontSize: "5rem", color }}>
                        {score}/{qs.length}
                    </div>
                    <div className="font-mono text-center mt-1" style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
                        {pct}% · {grade}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ display: "grid", gridTemplateColumns: `repeat(${qs.length}, 1fr)`, gap: 10, marginTop: 16 }}>
                    {qs.map((_, i) => (
                        <div key={i} style={{
                            width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: i < score ? `${color}22` : "rgba(255,255,255,0.04)",
                            border: `2px solid ${i < score ? color : "rgba(255,255,255,0.12)"}`,
                            color: i < score ? color : "var(--muted)", fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "0.9rem",
                        }}>
                            {i < score ? "✓" : "✗"}
                        </div>
                    ))}
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    onClick={restart}
                    className="font-mono tracking-widest text-xs border px-8 py-3 transition-all mt-6"
                    style={{ borderColor: color, color, background: "transparent", cursor: "pointer" }}
                    whileHover={{ background: `${color}18` }}>
                    ↺ RETRY QUIZ
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full px-14 py-10" style={{ gap: 0 }}>
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-4 flex-shrink-0">
                <span className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                    style={{ color, border: `1px solid ${color}55`, background: `${color}0d` }}>
                    ▸ Q&amp;A — {section.sectionTitle.toUpperCase()}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                    {section.sectionSubtitle}
                </span>
                <span className="font-mono text-xs ml-auto" style={{ color: "var(--muted)" }}>
                    {qIdx + 1} / {qs.length}
                </span>
            </motion.div>

            {/* ── Live audience stats ── */}
            <div style={{ display: "flex", gap: 14, marginBottom: 10, flexShrink: 0 }}>
                <div className="font-mono text-xs px-3 py-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>
                    👥 {totalPlayers} in room
                </div>
                {pushed && (
                    <div className="font-mono text-xs px-3 py-1" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
                        📱 {pushCount}/{totalPlayers} answered
                    </div>
                )}
            </div>

            {/* ── Progress bar ── */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden", marginBottom: 22, flexShrink: 0 }}>
                <motion.div
                    animate={{ width: `${((qIdx + 1) / qs.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ height: "100%", background: color, borderRadius: 2 }}
                />
            </div>

            {/* ── Question ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={qIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.28 }}
                    className="flex-1 flex flex-col min-h-0"
                >
                    <h2 className="font-syne font-bold mb-6"
                        style={{ fontSize: "1.22rem", color: "#fff", lineHeight: 1.35, flexShrink: 0 }}>
                        {q.q}
                    </h2>

                    {/* ── Options ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                        {q.opts.map((opt, i) => {
                            const isSelected = selected === i;
                            const isCorrect = i === q.answer;
                            let bg = "rgba(255,255,255,0.02)";
                            let border = "rgba(255,255,255,0.1)";
                            let labelColor = "var(--muted)";
                            let optColor = "#b8d4f0";
                            if (revealed) {
                                if (isCorrect) { bg = "rgba(16,185,129,0.09)"; border = "#10b981"; labelColor = "#10b981"; optColor = "#10b981"; }
                                else if (isSelected && !isCorrect) { bg = "rgba(244,63,94,0.09)"; border = "#f43f5e"; labelColor = "#f43f5e"; optColor = "#f43f5e"; }
                            } else if (isSelected) {
                                bg = `${color}10`; border = color; labelColor = color; optColor = "#fff";
                            }
                            return (
                                <motion.button
                                    key={i}
                                    onClick={() => choose(i)}
                                    whileHover={!revealed ? { scale: 1.008, x: 3 } : {}}
                                    transition={{ duration: 0.12 }}
                                    style={{
                                        display: "flex", alignItems: "flex-start", gap: 14,
                                        background: bg, border: `1.5px solid ${border}`,
                                        padding: "12px 16px", textAlign: "left", cursor: revealed ? "default" : "pointer",
                                        borderRadius: 2,
                                    }}
                                >
                                    <span className="font-mono font-bold text-sm flex-shrink-0" style={{ color: labelColor, minWidth: 20 }}>
                                        {OPTION_LABELS[i]}
                                    </span>
                                    <span className="font-mono text-sm leading-snug" style={{ color: optColor }}>
                                        {opt}
                                    </span>
                                    {revealed && isCorrect && (
                                        <span className="ml-auto flex-shrink-0 font-mono text-xs" style={{ color: "#10b981" }}>✓ CORRECT</span>
                                    )}
                                    {revealed && isSelected && !isCorrect && (
                                        <span className="ml-auto flex-shrink-0 font-mono text-xs" style={{ color: "#f43f5e" }}>✗ WRONG</span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* ── Explanation ── */}
                    <AnimatePresence>
                        {revealed && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    marginTop: 14, background: "rgba(255,255,255,0.02)",
                                    borderLeft: `3px solid ${color}`, padding: "10px 14px", overflow: "hidden", flexShrink: 0,
                                }}>
                                <div className="font-mono text-xs tracking-widest mb-1" style={{ color }}>▸ EXPLANATION</div>
                                <div className="font-mono text-xs leading-relaxed" style={{ color: "#b8d4f0" }}>{q.explain}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Action buttons ── */}
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexShrink: 0, flexWrap: "wrap" }}>
                        {/* Push to audience */}
                        {!pushed && (
                            <motion.button
                                onClick={pushQuestion}
                                whileHover={{ scale: 1.03 }}
                                className="font-mono text-xs tracking-widest px-5 py-2"
                                style={{ background: "rgba(0,212,255,0.08)", color: "#00d4ff", border: "1px solid #00d4ff55", cursor: "pointer" }}>
                                📱 PUSH TO PHONES
                            </motion.button>
                        )}

                        {!revealed ? (
                            <motion.button
                                onClick={handleReveal}
                                disabled={selected === null}
                                whileHover={selected !== null ? { scale: 1.03 } : {}}
                                className="font-mono text-xs tracking-widest px-6 py-2"
                                style={{
                                    background: selected !== null ? color : "transparent",
                                    color: selected !== null ? "#000" : "var(--muted)",
                                    border: `1px solid ${selected !== null ? color : "rgba(255,255,255,0.1)"}`,
                                    cursor: selected !== null ? "pointer" : "not-allowed",
                                }}>
                                REVEAL ANSWER
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={advance}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.03 }}
                                className="font-mono text-xs tracking-widest px-6 py-2"
                                style={{ background: color, color: "#000", border: `1px solid ${color}`, cursor: "pointer" }}>
                                {qIdx < qs.length - 1 ? "NEXT QUESTION → (or →)" : "VIEW RESULTS →"}
                            </motion.button>
                        )}

                        {/* Live score pill */}
                        <div className="font-mono text-xs flex items-center gap-2 ml-auto"
                            style={{ color: "var(--muted)" }}>
                            Score:&nbsp;<span style={{ color, fontWeight: 700 }}>{score}</span>&nbsp;/ {qIdx + (revealed ? 1 : 0)}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
