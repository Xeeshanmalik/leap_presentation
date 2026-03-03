import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useGameState } from "../../hooks/useGameState";

export default function SlidePositionalEncoding({ isExportMode }) {
    const { slideData, setSlideData, role } = useGameState();
    const synthesized = slideData?.[5]?.synthesized || false;

    // Export Mode: Force final view
    useEffect(() => {
        if (isExportMode && role === 'presenter') {
            setSlideData(5, { synthesized: true });
        }
    }, [isExportMode, role, setSlideData]);

    // Generate Wave Data
    // We need precise paths for Framer Motion to morph between
    const { rawPath, pePath, combinedPath, points } = useMemo(() => {
        const count = 100;
        const width = 800;
        const height = 300;

        // Data: High freq sine (repeating daily)
        // PE: Low freq cosine (weekly trend)

        let pathD_raw = "M";
        let pathD_pe = "M";
        let pathD_combined = "M";
        const pts = [];

        for (let i = 0; i <= count; i++) {
            const x = (i / count) * width;
            const t = i * 0.2; // time factor

            // Raw Signal (identical peaks)
            // sin(t) peaks at pi/2, 5pi/2...
            const rawVal = Math.sin(t) * 40;

            // PE Signal (variation)
            const peVal = Math.cos(t * 0.15) * 30; // Slower freq

            const combinedVal = rawVal + peVal;

            // Y coordinates (inverted for SVG)
            const yCenter = height / 2;
            const yRaw = yCenter - rawVal;
            const yPE = yCenter - peVal + 60; // PE sits below initially

            // Construct paths
            pathD_raw += ` ${x} ${yRaw}`;
            pathD_pe += ` ${x} ${yPE}`;
            pathD_combined += ` ${x} ${yCenter - combinedVal}`; // Final state

            pts.push({ x, yRaw, yPE, yCombined: yCenter - combinedVal, rawVal, peVal, combinedVal });
        }

        return {
            rawPath: pathD_raw,
            pePath: pathD_pe,
            combinedPath: pathD_combined,
            points: pts
        };
    }, []);

    // Peak Indices for labels (approximate peaks of sin(i*0.2))
    // Peaks at i ~ 8 and i ~ 39
    const p1 = 8;
    const p2 = 39;

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
                // 05 — The Seasonality Paradox
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-2 text-center">
                Harmonic Signal Synthesis
            </motion.h2>

            <p className="text-muted text-sm mb-8 max-w-2xl text-center">
                By synthesizing the <span className="text-teal">Content Signal</span> with the <span className="text-gold">Time Signal</span>,
                we create a unique <span className="text-purple">Contextual Embedding</span>.
            </p>

            {/* The Lab Stage */}
            <div className="relative w-full max-w-5xl h-[500px] bg-[#0a0f1e]/80 border border-teal/20 rounded-2xl p-8 flex flex-col items-center overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.05)]">

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* Main HUD Display */}
                <div className="relative w-[800px] h-[300px] mt-12">
                    <svg className="w-full h-full overflow-visible">

                        {/* 1. The PE Wave (Gold) - Animates Up and Fades Out */}
                        <motion.path
                            d={pePath}
                            fill="none"
                            stroke="#f59e0b" // Gold
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={{ opacity: 0.6, y: 0 }}
                            animate={{
                                opacity: synthesized ? 0 : 0.6,
                                y: synthesized ? -60 : 0 // Moves up to merge
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* 2. The Raw Wave (Teal) - Morphs into Combined (Purple) */}
                        <motion.path
                            d={synthesized ? combinedPath : rawPath}
                            fill="none"
                            stroke={synthesized ? "#8b5cf6" : "#00d4ff"} // Teal -> Purple
                            strokeWidth="4"
                            initial={{ pathLength: 1 }}
                            animate={{
                                stroke: synthesized ? "#8b5cf6" : "#00d4ff",
                                d: synthesized ? combinedPath : rawPath,
                                filter: synthesized ? "drop-shadow(0 0 10px rgba(139,92,246,0.6))" : "drop-shadow(0 0 8px rgba(0,212,255,0.4))"
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Markers & Labels */}
                        {/* Peak 1 */}
                        <Marker
                            x={points[p1].x}
                            yStart={points[p1].yRaw}
                            yEnd={points[p1].yCombined}
                            valRaw={points[p1].rawVal}
                            valCombined={points[p1].combinedVal}
                            synthesized={synthesized}
                            label="Peak A (Mon)"
                            delay={0}
                        />

                        {/* Peak 2 */}
                        <Marker
                            x={points[p2].x}
                            yStart={points[p2].yRaw}
                            yEnd={points[p2].yCombined}
                            valRaw={points[p2].rawVal}
                            valCombined={points[p2].combinedVal}
                            synthesized={synthesized}
                            label="Peak B (Tue)"
                            delay={0.2}
                        />

                    </svg>

                    {/* HUD Overlay Text */}
                    <div className="absolute top-0 right-0 font-mono text-[10px] text-teal/50 flex flex-col gap-1 items-end">
                        <div>SIGNAL_FREQ: 5.0 Hz</div>
                        <div>POS_ENC_FREQ: 0.15 Hz</div>
                        <div>STATUS: <span className={synthesized ? "text-purple font-bold" : "text-teal"}>{synthesized ? "SYNTHESIZED" : "RAW_INPUT"}</span></div>
                    </div>
                </div>

                {/* Legend / Controls */}
                <div className="mt-12 w-full flex justify-between items-center px-8 border-t border-white/5 pt-6">
                    <div className="flex gap-8 text-xs font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-teal rounded-full shadow-[0_0_10px_teal]"></div>
                            <span className="text-teal">CONTENT (X)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_gold] opacity-80"></div>
                            <span className="text-gold/80">POSITION (P)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 bg-purple rounded-full shadow-[0_0_10px_purple] transition-opacity duration-500 ${synthesized ? 'opacity-100' : 'opacity-20'}`}></div>
                            <span className={synthesized ? "text-purple" : "text-gray-600"}>EMBEDDING (E = X + P)</span>
                        </div>
                    </div>

                    {!isExportMode && role === 'presenter' && (
                        <button
                            onClick={() => setSlideData(5, { synthesized: !synthesized })}
                            className={`px-8 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-300 shadow-lg ${synthesized
                                ? "bg-purple/20 border border-purple text-purple hover:bg-purple/30 shadow-purple/20"
                                : "bg-teal/10 border border-teal text-teal hover:bg-teal/20 shadow-teal/20"
                                }`}
                        >
                            {synthesized ? "RESET SIGNAL" : "INITIATE SYNTHESIS"}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

// Subcomponent for the holographic markers
function Marker({ x, yStart, yEnd, valRaw, valCombined, synthesized, label, delay }) {
    return (
        <motion.g animate={{ x, y: synthesized ? yEnd : yStart }} transition={{ duration: 1.5, ease: "easeInOut" }}>
            <motion.circle r="6" fill="#0a0f1e" stroke={synthesized ? "#8b5cf6" : "#00d4ff"} strokeWidth="2" />

            {/* Holographic Line */}
            <motion.line
                x1="0" y1="0" x2="0" y2="-40"
                stroke={synthesized ? "#8b5cf6" : "#00d4ff"}
                strokeWidth="1"
                strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />

            {/* Label Box */}
            <foreignObject x="-60" y="-95" width="120" height="50">
                <motion.div
                    className={`text-center p-1 rounded border backdrop-blur-md text-[10px] font-mono shadow-lg ${synthesized
                        ? "border-purple text-purple bg-purple/10"
                        : "border-teal text-teal bg-teal/10"
                        }`}
                >
                    <div className="font-bold mb-[1px]">{label}</div>
                    <div className="flex justify-center gap-1">
                        opacity: 0.8
                        <span>{synthesized ? valCombined.toFixed(0) : valRaw.toFixed(0)}</span>
                    </div>
                    {synthesized && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-[8px] opacity-70"
                        >
                            ({valRaw.toFixed(0)} + {(valCombined - valRaw).toFixed(0)})
                        </motion.div>
                    )}
                </motion.div>
            </foreignObject>
        </motion.g>
    );
}
