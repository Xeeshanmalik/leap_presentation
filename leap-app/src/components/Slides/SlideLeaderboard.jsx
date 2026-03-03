/**
 * SlideLeaderboard — shown at the end of the presentation (index 24).
 * Displays top-10 audience members by score (tiebreaker: fastest cumulative answer time).
 * Reads from the same localStorage quiz store that the audience page writes to.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToAnswers, subscribeToPayers, getLeaderboard, showLeaderboard } from "../../lib/useQuizStore";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7f32", "#00d4ff", "#00d4ff",
    "#00d4ff", "#00d4ff", "#00d4ff", "#00d4ff", "#00d4ff"];

export default function SlideLeaderboard() {
    const [board, setBoard] = useState([]);
    const [answers, setAnswers] = useState({});
    const [players, setPlayers] = useState({});
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const u1 = subscribeToAnswers(a => { setAnswers(a); });
        const u2 = subscribeToPayers(p => { setPlayers(p); });
        return () => { u1(); u2(); };
    }, []);

    useEffect(() => {
        setBoard(getLeaderboard(answers, players));
    }, [answers, players]);

    function handleReveal() {
        showLeaderboard(); // push to audience phones
        setRevealed(true);
    }

    const totalPlayers = Object.keys(players).length;

    return (
        <div className="flex flex-col h-full w-full px-14 py-8" style={{ gap: 0 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-4 flex-shrink-0">
                <span className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                    style={{ color: "#f59e0b", border: "1px solid #f59e0b55", background: "#f59e0b0d" }}>
                    🏆 LEADERBOARD
                </span>
                <span className="font-mono text-xs" style={{ color: "#64748b" }}>
                    Top 10 — All 3 Sections · 15 Questions
                </span>
                <span className="font-mono text-xs ml-auto" style={{ color: "#64748b" }}>
                    {totalPlayers} player{totalPlayers !== 1 ? "s" : ""} participated
                </span>
            </motion.div>

            {/* Gold divider */}
            <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
                style={{ height: 2, background: "linear-gradient(90deg, #f59e0b, transparent)", marginBottom: 24, transformOrigin: "left" }}
            />

            {/* Board */}
            {board.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "#384252" }}>
                        NO PARTICIPANTS YET
                    </div>
                    <div className="font-mono text-xs" style={{ color: "#2d3748" }}>
                        Ask the audience to scan the QR code and join the quiz
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                    <AnimatePresence>
                        {board.map((entry, i) => (
                            <motion.div
                                key={entry.playerId}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 16,
                                    background: i === 0 ? "rgba(245,158,11,0.08)" : i === 1 ? "rgba(148,163,184,0.05)" : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${i < 3 ? RANK_COLORS[i] + "44" : "rgba(255,255,255,0.06)"}`,
                                    padding: "12px 18px",
                                }}
                            >
                                {/* Rank */}
                                <div className="font-mono font-bold text-lg flex-shrink-0 w-10 text-center"
                                    style={{ color: RANK_COLORS[i] }}>
                                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                                </div>

                                {/* Name */}
                                <div className="font-syne font-bold flex-1 truncate" style={{ color: "#fff", fontSize: "1rem" }}>
                                    {entry.name}
                                </div>

                                {/* Score bar */}
                                <div style={{ flex: 2, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(entry.score / 15) * 100}%` }}
                                        transition={{ delay: i * 0.07 + 0.3, duration: 0.5 }}
                                        style={{ height: "100%", background: RANK_COLORS[i], borderRadius: 3 }}
                                    />
                                </div>

                                {/* Score */}
                                <div className="font-mono font-bold text-lg flex-shrink-0"
                                    style={{ color: RANK_COLORS[i], minWidth: 42, textAlign: "right" }}>
                                    {entry.score}<span className="text-xs font-normal" style={{ color: "#64748b" }}>/15</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Reveal button */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                {!revealed ? (
                    <motion.button
                        onClick={handleReveal}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="font-mono text-xs tracking-widest px-8 py-3"
                        style={{ background: "#f59e0b", color: "#000", border: "none", cursor: "pointer" }}>
                        📱 PUSH TO AUDIENCE PHONES
                    </motion.button>
                ) : (
                    <div className="font-mono text-xs" style={{ color: "#10b981" }}>
                        ✓ Leaderboard pushed to all audience devices
                    </div>
                )}
                <div className="font-mono text-xs ml-auto" style={{ color: "#384252" }}>
                    Fastest tiebreaker · Scores auto-refresh
                </div>
            </motion.div>
        </div>
    );
}
