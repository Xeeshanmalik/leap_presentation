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
import { useGameState } from "../../hooks/useGameState";
import {
    subscribeToState,
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

    const { slideData, setSlideData, role } = useGameState();
    const qaState = slideData?.[`qa_${sectionIdx}`] || { qIdx: 0, selected: null, revealed: false, score: 0, done: false };
    const { qIdx, selected, revealed, score, done } = qaState;

    const [pushCount, setPushCount] = useState(0); // how many audience answered
    // Audience stats
    const [answers, setAnswers] = useState({});
    const [players, setPlayers] = useState({});
    const [quizState, setQuizStateStore] = useState(null);

    useEffect(() => {
        const u1 = subscribeToAnswers(setAnswers);
        const u2 = subscribeToPayers(setPlayers);
        // Also subscribe to quiz store state to see what is currently pushed
        const u3 = subscribeToState(setQuizStateStore);
        return () => { u1(); u2(); u3(); };
    }, []);

    // Check if the current question is actively pushed to audience
    const pushed = quizState?.sectionIdx === sectionIdx && quizState?.questionIdx === qIdx && (quizState?.status === "question" || quizState?.status === "revealing");

    const updateQaState = (patch) => {
        if (role === 'presenter') {
            setSlideData(`qa_${sectionIdx}`, { ...qaState, ...patch });
        }
    };

    // Count how many answered this specific question
    useEffect(() => {
        const key = `${sectionIdx}_${qIdx}`;
        const count = Object.values(answers).filter(a => a.answers?.[key] !== undefined).length;
        setPushCount(count);
    }, [answers, sectionIdx, qIdx]);

    const q = qs[qIdx];

    // ── Right arrow key handler ──
    const handleKey = useCallback((e) => {
        if (e.key === "ArrowRight" && revealed && !done) {
            e.preventDefault();
            e.stopImmediatePropagation(); // Stops PresenterView from intercepting
            advance();
        }
    }, [revealed, done, qIdx, qs.length]);

    useEffect(() => {
        window.addEventListener("keydown", handleKey, { capture: true });
        return () => window.removeEventListener("keydown", handleKey, { capture: true });
    }, [handleKey]);

    function choose(i) {
        if (revealed) return;
        updateQaState({ selected: i });
    }

    function pushQuestion() {
        if (role !== 'presenter') return;
        setActiveQuestion(sectionIdx, qIdx);
        // The `pushed` boolean is automatically derived from `quizState Store`
    }

    function handleReveal() {
        if (selected === null || role !== 'presenter') return;
        if (!revealed) {
            updateQaState({
                score: selected === q.answer ? score + 1 : score,
                revealed: true
            });
            revealAnswer(); // push to audience tabs
        }
    }

    function advance() {
        if (role !== 'presenter') return;
        if (qIdx < qs.length - 1) {
            updateQaState({
                qIdx: qIdx + 1,
                selected: null,
                revealed: false
            });
            setIdle(); // Reset audience state
        } else {
            updateQaState({ done: true });
        }
    }

    function restart() {
        if (role !== 'presenter') return;
        updateQaState({
            qIdx: 0,
            selected: null,
            revealed: false,
            score: 0,
            done: false
        });
        setIdle();
    }

    const totalPlayers = Object.keys(players).length;

    /* ── Score screen ── */
    if (done) {
        const pct = Math.round((score / qs.length) * 100);
        const grade = score === 5 ? "Perfect!" : score >= 4 ? "Excellent" : score >= 3 ? "Good" : "Keep studying";
        return (
            <div
                className="flex flex-col items-center justify-center h-full w-full px-14"
                style={{ gap: 24 }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
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
        <div
            className="flex flex-col h-full w-full px-14 py-10"
            style={{ gap: 0 }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    advance();
                                }}
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
