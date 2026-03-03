import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useGameState } from "../../hooks/useGameState";

export default function SlideAttentionMechanism({ isExportMode }) {
    const { slideData, setSlideData, role } = useGameState();

    // Slide 6 state from global context
    const currentData = slideData?.[6] || { activeStep: 0, hoveredCell: null };
    const { activeStep, hoveredCell } = currentData;

    // Export Mode: Force final view
    useEffect(() => {
        if (isExportMode) {
            if (role === 'presenter') {
                setSlideData(6, { activeStep: 3, hoveredCell: null });
            }
        }
    }, [isExportMode, role, setSlideData]);

    const handleStepClick = (i) => {
        if (!isExportMode && role === 'presenter') {
            setSlideData(6, { ...currentData, activeStep: i });
        }
    };

    const handleCellHover = (cell) => {
        if (!isExportMode && role === 'presenter') {
            setSlideData(6, { ...currentData, hoveredCell: cell });
        }
    };

    const steps = [
        { title: "Input Projection", desc: "Each patch token X is linearly projected into three matrices: Query (Q), Key (K), and Value (V)." },
        { title: "Score Computation", desc: "Attention scores = QKᵀ. Each query vector 'asks' how relevant every key vector is." },
        { title: "Scaled Softmax", desc: "Scores are divided by √dₖ then passed through softmax to get probabilities." },
        { title: "Weighted Aggregation", desc: "Final output is the softmax weights multiplied by V (values)." }
    ];

    // Deterministic scores matching reference logic
    // Reference: random*0.4, if |i-j|<=1 += 0.4, if i===j = 0.95
    const attentionData = useMemo(() => {
        const size = 6;
        const matrix = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                let val = 0.1 + Math.random() * 0.3; // Base noise
                if (Math.abs(i - j) <= 1) val += 0.4; // Near diagonal
                if (i === j) val = 0.95; // Self-attention strong
                row.push(Math.min(val, 0.99)); // Cap at 0.99
            }
            matrix.push(row);
        }
        return matrix;
    }, []);

    const labels = ["t₁", "t₂", "t₃", "t₄", "t₅", "t₆"];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
                // 06 — Attention Deep Dive
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                The <span className="text-gold">Q / K / V</span> Mechanism
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-start">
                {/* Heatmap Visualization */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 aspect-square relative flex flex-col items-center justify-center">
                    <div className="absolute top-4 left-4 text-xs font-mono text-muted">Attention Matrix (Score Heatmap)</div>

                    {/* Grid Container */}
                    <div
                        className="grid grid-cols-6 gap-2"
                        onMouseLeave={() => handleCellHover(null)}
                    >
                        {attentionData.map((row, r) => (
                            row.map((score, c) => {
                                const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                                const isRowColMatch = hoveredCell && (hoveredCell.r === r || hoveredCell.c === c);
                                const isDimmed = hoveredCell && !isRowColMatch;

                                // Always visible
                                const opacity = isDimmed ? 0.3 : 1;

                                // Color logic matching reference (R=0, G=s*180, B=s*255) approx
                                // We'll use teal-based scale
                                const intensity = score;
                                const bgColor = `rgba(0, ${Math.round(intensity * 180 + 75)}, ${Math.round(intensity * 255)}, ${0.2 + intensity * 0.7})`;

                                return (
                                    <motion.div
                                        key={`${r}-${c}`}
                                        className="w-12 h-12 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all duration-200 border border-transparent"
                                        style={{
                                            background: bgColor,
                                            color: score > 0.6 ? "#0a0f1e" : "rgba(255,255,255,0.7)",
                                            borderColor: isHovered ? "#00d4ff" : "transparent",
                                            zIndex: isHovered ? 10 : 1
                                        }}
                                        animate={{
                                            opacity: opacity,
                                            scale: isHovered ? 1.15 : 1,
                                            boxShadow: isHovered ? "0 0 15px rgba(0,212,255,0.5)" : "none"
                                        }}
                                        onMouseEnter={() => handleCellHover({ r, c })}
                                    >
                                        {score.toFixed(2)}
                                    </motion.div>
                                );
                            })
                        ))}
                    </div>

                    {/* Axis Labels (Optional, if needed for clarity) */}
                    <div className="absolute bottom-4 right-4 text-xs font-mono text-muted opacity-50">
                        HOVER CELLS
                    </div>
                </div>

                {/* Stepper Steps */}
                <div className="flex flex-col gap-4 justify-center pt-4">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            onClick={() => handleStepClick(i)}
                            className={`p-6 rounded-r-xl border-l-4 transition-all cursor-pointer ${activeStep === i
                                ? 'bg-teal/10 border-teal'
                                : 'bg-white/5 border-transparent opacity-50 hover:opacity-80'
                                }`}
                        >
                            <h4 className={`text-lg font-bold font-syne mb-2 ${activeStep === i ? 'text-teal' : 'text-white'}`}>
                                {i + 1}. {step.title}
                            </h4>
                            <p className="text-sm text-muted leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
