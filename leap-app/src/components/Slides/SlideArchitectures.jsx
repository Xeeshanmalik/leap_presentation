import { motion } from "framer-motion";
import { useState } from "react";

const FlipCard = ({ title, meta, icon, backTitle, backDesc, isExportMode, isFlipped, onToggle }) => {
    // In export mode, never flip (or maybe we could show side-by-side, but keep simple for now)
    const active = isExportMode ? false : isFlipped;

    return (
        <div
            className="group perspective w-full h-64 cursor-pointer"
            onClick={onToggle}
        >
            <motion.div
                className="w-full h-full relative transition-all duration-500"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: active ? 180 : 0 }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 bg-navy border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:border-teal/50 transition-colors"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    <div className="text-4xl mb-4 text-white opacity-80">{icon}</div>
                    <h3 className="text-xl font-syne font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-muted">{meta}</p>
                    <div className="mt-auto text-xs text-teal opacity-60">Click to flip ↻</div>
                </div>

                {/* Back */}
                {!isExportMode && (
                    <div
                        className="absolute inset-0 bg-teal text-navy rounded-xl p-6 flex flex-col items-center justify-center text-center"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)"
                        }}
                    >
                        <h4 className="text-lg font-bold font-syne mb-3">{backTitle}</h4>
                        <p className="text-sm font-medium leading-relaxed opacity-90">{backDesc}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

import { useGameState } from "../../hooks/useGameState";

export default function SlideArchitectures({ isExportMode }) {
    const { slideData, setSlideData, role } = useGameState();
    const flippedCards = slideData?.[10]?.flippedCards || {};

    const handleToggle = (index) => {
        if (!isExportMode && role === 'presenter') {
            setSlideData(10, {
                ...slideData?.[10],
                flippedCards: { ...flippedCards, [index]: !flippedCards[index] }
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 10 — Key Architectures
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                The <span className="text-purple">Landscape</span> of Large TST Models
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <FlipCard
                    title="PatchTST"
                    meta="(2023)"
                    icon="🧩"
                    backTitle="Why it wins:"
                    backDesc="Channel Independence + Patching. Beats DLinear significantly in benchmarks."
                    isExportMode={isExportMode}
                    isFlipped={!!flippedCards[0]}
                    onToggle={() => handleToggle(0)}
                />
                <FlipCard
                    title="TimesFM"
                    meta="(Google)"
                    icon="📊"
                    backTitle="Why it wins:"
                    backDesc="Decoder-only architecture trained on 100B real & synthetic points."
                    isExportMode={isExportMode}
                    isFlipped={!!flippedCards[1]}
                    onToggle={() => handleToggle(1)}
                />
                <FlipCard
                    title="Chronos"
                    meta="(Amazon)"
                    icon="⏳"
                    backTitle="Why it wins:"
                    backDesc="Tokenizes values into buckets. Uses T5 LLM architecture to treat time as language."
                    isExportMode={isExportMode}
                    isFlipped={!!flippedCards[2]}
                    onToggle={() => handleToggle(2)}
                />
                <FlipCard
                    title="Moirai"
                    meta="(Salesforce)"
                    icon="🎭"
                    backTitle="Why it wins:"
                    backDesc="Universal Masked Encoder. Handles multi-variate data with any frequency."
                    isExportMode={isExportMode}
                    isFlipped={!!flippedCards[3]}
                    onToggle={() => handleToggle(3)}
                />
            </div>
        </div>
    );
}
