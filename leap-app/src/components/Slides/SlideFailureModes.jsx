import { motion } from "framer-motion";
import { useState } from "react";

const FlipCard = ({ icon, title, desc, color, mitigationTitle, mitigationDesc, isExportMode, isFlipped, onToggle }) => {
    // active state
    const active = isExportMode ? false : isFlipped;

    return (
        <div
            className="group perspective w-full h-80 cursor-pointer"
            onClick={onToggle}
        >
            <motion.div
                className="w-full h-full relative transition-all duration-500"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: active ? 180 : 0 }}
            >
                {/* Front: Failure Mode */}
                <div
                    className={`absolute inset-0 bg-navy border ${color} rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />

                    <div className="text-6xl mb-6">{icon}</div>
                    <h3 className={`text-2xl font-syne font-bold mb-4 ${color.split(' ')[1]}`}>{title}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-4">
                        {desc}
                    </p>
                    <div className="mt-auto text-xs text-rose opacity-60 font-mono uppercase tracking-widest">
                        Tap for Fix ↻
                    </div>
                </div>

                {/* Back: Mitigation */}
                {!isExportMode && (
                    <div
                        className="absolute inset-0 border border-teal/30 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-navy"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)"
                        }}
                    >
                        <div className="text-teal text-xs font-mono uppercase tracking-widest mb-4">Mitigation Strategy</div>
                        <h3 className="text-2xl font-syne font-bold text-white mb-4">{mitigationTitle}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {mitigationDesc}
                        </p>
                        <div className="mt-8 text-teal text-4xl">🛠️</div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

import { useGameState } from "../../hooks/useGameState";

export default function SlideFailureModes({ isExportMode }) {
    const { slideData, setSlideData, role } = useGameState();
    const flippedCards = slideData?.[13]?.flippedCards || {};

    const handleToggle = (index) => {
        if (!isExportMode && role === 'presenter') {
            setSlideData(13, {
                ...slideData?.[13],
                flippedCards: { ...flippedCards, [index]: !flippedCards[index] }
            });
        }
    };

    const cards = [
        {
            icon: "⚠️",
            title: "Hallucinations",
            desc: "Generating plausible but fake patterns in sparse data regions.",
            color: "border-rose text-rose",
            mitigationTitle: "RAG & Constraints",
            mitigationDesc: "Retrieval-Augmented Generation anchors outputs to real data. Hard constraints prevent physically impossible predictions."
        },
        {
            icon: "🐢",
            title: "Inference Latency",
            desc: "Transformers differ from RNNs. O(L²) complexity makes real-time huge.",
            color: "border-orange-500 text-orange-500",
            mitigationTitle: "Quantization & Speculative Decoding",
            mitigationDesc: "Running 4-bit quantized models or using small draft models to speed up token generation."
        },
        {
            icon: "🔄",
            title: "Distribution Shift",
            desc: "2026 data looks different from 2024. Zero-shot often fails on new regimes.",
            color: "border-purple text-purple",
            mitigationTitle: "Online Learning / Adapters",
            mitigationDesc: "Lightweight LoRA adapters trained on recent windows allow the model to adapt without full retraining."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 13 — Failure Modes & Fixes
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                Where Large Models <span className="text-rose">Fail</span> (And How We Fix It)
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {cards.map((card, i) => (
                    <FlipCard
                        key={i}
                        {...card}
                        isExportMode={isExportMode}
                        isFlipped={!!flippedCards[i]}
                        onToggle={() => handleToggle(i)}
                    />
                ))}
            </div>
        </div>
    );
}
