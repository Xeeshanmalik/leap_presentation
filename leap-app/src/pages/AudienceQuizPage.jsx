/**
 * Audience Quiz Page — /quiz
 *
 * Mobile-friendly page audience members open after scanning the QR code.
 * Flow:
 *   1. Enter your name
 *   2. Wait for a question to become active (presenter controls this)
 *   3. Select an answer — submitted immediately
 *   4. See correct/incorrect reveal when presenter reveals
 *   5. Track your running score
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QA_SECTIONS } from "../data/qa-data";
import {
    subscribeToState,
    subscribeToAnswers,
    subscribeToPayers,
    joinQuiz,
    submitAnswer,
    readState,
} from "../lib/useQuizStore";

const OPTION_LABELS = ["A", "B", "C", "D"];

function generatePlayerId() {
    return "p_" + Math.random().toString(36).slice(2, 10);
}

/* ───── Name Entry Screen ───── */
function JoinScreen({ onJoin }) {
    const [name, setName] = useState("");
    const inputRef = useRef(null);
    useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

    function handleJoin(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) return;
        onJoin(trimmed);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8"
            style={{ background: "#020d1a" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="font-mono text-xs tracking-widest mb-2" style={{ color: "#00d4ff" }}>
                    ▸ LEAP 2026 — AUDIENCE QUIZ
                </div>
                <h1 className="font-syne font-extrabold text-3xl mb-1" style={{ color: "#fff" }}>
                    Join the Q&amp;A
                </h1>
                <p className="font-mono text-xs mb-8" style={{ color: "#64748b" }}>
                    Answer 15 questions across 3 sections.<br />
                    Top 10 scorers win — speed is the tiebreaker.
                </p>

                <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <input
                        ref={inputRef}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name or handle"
                        maxLength={24}
                        className="font-mono text-sm"
                        style={{
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,212,255,0.3)",
                            color: "#fff", padding: "14px 16px", outline: "none", borderRadius: 2,
                        }}
                    />
                    <motion.button
                        type="submit"
                        disabled={name.trim().length < 2}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            background: name.trim().length >= 2 ? "#00d4ff" : "rgba(255,255,255,0.05)",
                            color: name.trim().length >= 2 ? "#000" : "#64748b",
                            border: "none", padding: "14px", fontFamily: "JetBrains Mono, monospace",
                            fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.75rem",
                            cursor: name.trim().length >= 2 ? "pointer" : "not-allowed", borderRadius: 2,
                        }}
                    >
                        ENTER ARENA →
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

/* ───── Waiting Screen ───── */
function WaitingScreen({ name, score, totalAnswered }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center"
            style={{ background: "#020d1a" }}>
            <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-mono text-xs tracking-widest mb-4" style={{ color: "#00d4ff" }}>
                ▸ WAITING FOR PRESENTER…
            </motion.div>
            <div className="font-syne font-bold text-xl mb-1" style={{ color: "#fff" }}>Hey, {name}! 👋</div>
            <div className="font-mono text-xs mb-6" style={{ color: "#64748b" }}>
                The presenter will push the next question shortly.
            </div>
            <div style={{
                display: "flex", gap: 24, background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,212,255,0.1)", padding: "16px 28px", borderRadius: 4,
            }}>
                <div className="text-center">
                    <div className="font-syne font-extrabold text-2xl" style={{ color: "#00d4ff" }}>{score}</div>
                    <div className="font-mono text-xs" style={{ color: "#64748b" }}>CORRECT</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div className="text-center">
                    <div className="font-syne font-extrabold text-2xl" style={{ color: "#a78bfa" }}>{totalAnswered}</div>
                    <div className="font-mono text-xs" style={{ color: "#64748b" }}>ANSWERED</div>
                </div>
            </div>
        </div>
    );
}

/* ───── Question Screen ───── */
function QuestionScreen({ question, sectionIdx, questionIdx, onAnswer, myAnswer, status, sectionColor }) {
    const revealed = status === "revealing";
    const isCorrect = myAnswer === question.answer;

    return (
        <div className="flex flex-col min-h-screen px-5 py-8" style={{ background: "#020d1a" }}>
            <div className="font-mono text-xs tracking-widest mb-1" style={{ color: sectionColor }}>
                {QA_SECTIONS[sectionIdx]?.sectionTitle} · Q{questionIdx + 1} of 5
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 20 }}>
                <div style={{ width: `${((questionIdx + 1) / 5) * 100}%`, height: "100%", background: sectionColor, borderRadius: 2 }} />
            </div>

            <h2 className="font-syne font-bold text-base leading-snug mb-6" style={{ color: "#fff" }}>
                {question.q}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                {question.opts.map((opt, i) => {
                    let bg = "rgba(255,255,255,0.03)";
                    let border = "rgba(255,255,255,0.1)";
                    let color = "#b8d4f0";
                    let labelColor = "#64748b";

                    if (myAnswer !== null && myAnswer !== undefined) {
                        if (revealed) {
                            if (i === question.answer) { bg = "rgba(16,185,129,0.12)"; border = "#10b981"; color = "#10b981"; labelColor = "#10b981"; }
                            else if (i === myAnswer && !isCorrect) { bg = "rgba(244,63,94,0.12)"; border = "#f43f5e"; color = "#f43f5e"; labelColor = "#f43f5e"; }
                        } else {
                            if (i === myAnswer) { bg = `${sectionColor}18`; border = sectionColor; color = "#fff"; labelColor = sectionColor; }
                        }
                    }

                    return (
                        <motion.button
                            key={i}
                            onClick={() => onAnswer(i)}
                            disabled={myAnswer !== null && myAnswer !== undefined}
                            whileTap={!myAnswer && myAnswer !== 0 ? { scale: 0.97 } : {}}
                            style={{
                                display: "flex", alignItems: "flex-start", gap: 14,
                                background: bg, border: `1.5px solid ${border}`,
                                padding: "14px 16px", textAlign: "left",
                                cursor: (myAnswer !== null && myAnswer !== undefined) ? "default" : "pointer",
                                borderRadius: 3, width: "100%",
                            }}
                        >
                            <span className="font-mono font-bold text-sm flex-shrink-0" style={{ color: labelColor }}>{OPTION_LABELS[i]}</span>
                            <span className="font-mono text-sm leading-snug" style={{ color }}>{opt}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Submitted status */}
            <div className="mt-6 text-center">
                {myAnswer !== null && myAnswer !== undefined && !revealed && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="font-mono text-xs" style={{ color: sectionColor }}>
                        ✓ Answer submitted — waiting for reveal…
                    </motion.div>
                )}
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-sm font-bold"
                        style={{ color: isCorrect ? "#10b981" : "#f43f5e" }}>
                        {isCorrect ? "✅ Correct! +1 point" : "❌ Wrong answer"}
                    </motion.div>
                )}
                {(myAnswer === null || myAnswer === undefined) && (
                    <div className="font-mono text-xs" style={{ color: "#64748b" }}>
                        Tap your answer above
                    </div>
                )}
            </div>
        </div>
    );
}

/* ───── Leaderboard Screen (audience side) ───── */
function LeaderboardScreen({ name, score }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center"
            style={{ background: "#020d1a" }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="font-syne font-extrabold text-5xl mb-2" style={{ color: "#00d4ff" }}>
                {score}<span className="text-2xl text-slate-400">/15</span>
            </motion.div>
            <div className="font-mono text-sm mb-1" style={{ color: "#fff" }}>{name}</div>
            <div className="font-mono text-xs mb-8" style={{ color: "#64748b" }}>
                Check the big screen for the top 10!
            </div>
            <div className="font-mono text-xs" style={{ color: "#475569" }}>
                Thanks for playing 🎉<br />
                LEAP LTSM · leap-ai.io
            </div>
        </div>
    );
}

/* ───── Main Component ───── */
export default function AudienceQuizPage() {
    const [playerId] = useState(() => {
        const stored = sessionStorage.getItem("quiz_player_id");
        if (stored) return stored;
        const id = generatePlayerId();
        sessionStorage.setItem("quiz_player_id", id);
        return id;
    });

    const [playerName, setPlayerName] = useState(() =>
        sessionStorage.getItem("quiz_player_name") || null
    );

    const [quizState, setQuizState] = useState(readState);
    const [myAnswers, setMyAnswers] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("quiz_my_answers")) || {}; } catch { return {}; }
    });

    // Subscribe to presenter state changes
    useEffect(() => {
        return subscribeToState(setQuizState);
    }, []);

    function handleJoin(name) {
        sessionStorage.setItem("quiz_player_name", name);
        setPlayerName(name);
        joinQuiz(playerId, name);
    }

    function handleAnswer(optionIdx) {
        if (!quizState) return;
        const { sectionIdx, questionIdx } = quizState;
        const key = `${sectionIdx}_${questionIdx}`;
        if (myAnswers[key] !== undefined) return; // already answered
        const question = QA_SECTIONS[sectionIdx]?.questions[questionIdx];
        const isCorrect = optionIdx === question?.answer;
        const ok = submitAnswer(playerId, sectionIdx, questionIdx, optionIdx, isCorrect);
        if (ok) {
            const updated = { ...myAnswers, [key]: optionIdx };
            setMyAnswers(updated);
            sessionStorage.setItem("quiz_my_answers", JSON.stringify(updated));
        }
    }

    // Compute running score
    const score = Object.entries(myAnswers).reduce((acc, [key, optIdx]) => {
        const [si, qi] = key.split("_").map(Number);
        const q = QA_SECTIONS[si]?.questions[qi];
        return acc + (q && optIdx === q.answer ? 1 : 0);
    }, 0);

    const totalAnswered = Object.keys(myAnswers).length;

    // ── Screens ──
    if (!playerName) return <JoinScreen onJoin={handleJoin} />;

    const status = quizState?.status || "idle";

    if (status === "leaderboard") {
        return <LeaderboardScreen name={playerName} score={score} />;
    }

    if (status === "question" || status === "revealing") {
        const { sectionIdx, questionIdx } = quizState;
        const section = QA_SECTIONS[sectionIdx];
        const question = section?.questions[questionIdx];
        if (!question) return <WaitingScreen name={playerName} score={score} totalAnswered={totalAnswered} />;
        const key = `${sectionIdx}_${questionIdx}`;
        const myAnswer = myAnswers[key] !== undefined ? myAnswers[key] : null;
        return (
            <QuestionScreen
                question={question}
                sectionIdx={sectionIdx}
                questionIdx={questionIdx}
                onAnswer={handleAnswer}
                myAnswer={myAnswer}
                status={status}
                sectionColor={section.color}
            />
        );
    }

    return <WaitingScreen name={playerName} score={score} totalAnswered={totalAnswered} />;
}
