import { motion } from "framer-motion";

export default function SlideAttentionIntuition({ isExportMode }) {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 03 — Transformer Intuition
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                Self-Attention: <span className="text-teal">Every Token Talks to Every Token</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
                {/* SVG Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: isExportMode ? 0 : 0.8 }}
                    className="w-full aspect-video bg-white/5 rounded-xl border border-white/10 relative p-8"
                >
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Nodes */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <g key={i}>
                                <circle cx={50 + i * 75} cy={250} r={15} fill="#0d1528" stroke="#00d4ff" strokeWidth="2" />
                                <text x={50 + i * 75} y={255} textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">t{i}</text>
                            </g>
                        ))}

                        {/* Attention Lines (from t4 to all others) */}
                        {[0, 1, 2, 3].map((i) => (
                            <motion.path
                                key={i}
                                d={`M ${50 + 4 * 75} 230 Q ${(50 + 4 * 75 + 50 + i * 75) / 2} ${50 + i * 20} ${50 + i * 75} 230`}
                                fill="none"
                                stroke="#00d4ff"
                                strokeWidth="1"
                                initial={isExportMode ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                                animate={isExportMode ? { pathLength: 1, opacity: 0.5 } : { pathLength: 1, opacity: [0.2, 0.8, 0.2] }}
                                transition={isExportMode ? { duration: 0 } : { duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}

                        {/* Highlight t4 */}
                        <circle cx={50 + 4 * 75} cy={250} r={20} fill="none" stroke="#f59e0b" strokeWidth="2" className={isExportMode ? "" : "animate-pulse"} />
                    </svg>
                    <div className="absolute bottom-4 right-4 text-xs font-mono text-gold bg-black/50 px-2 py-1 rounded">
                        Focus: t4
                    </div>
                </motion.div>

                {/* Text Description */}
                <div className="space-y-6">
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: isExportMode ? 0 : 0.3 }}
                        className="text-lg text-muted leading-relaxed"
                    >
                        In a transformer, every position can directly attend to every other position in a single operation — <span className="text-white font-bold">regardless of distance</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: isExportMode ? 0 : 0.5 }}
                        className="bg-teal/10 border-l-4 border-teal p-4 rounded-r-lg font-mono text-sm text-teal"
                    >
                        Attention(Q,K,V) = softmax(QKᵀ/√dₖ)·V
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: isExportMode ? 0 : 0.7 }}
                        className="text-sm text-muted"
                    >
                        Unlike RNNs that process tokens sequentially, attention computes <span className="text-teal font-bold">all pairwise relationships in parallel</span> — enabling both faster training and longer context windows.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
