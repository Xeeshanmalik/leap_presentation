import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SlideTokenization({ isExportMode }) {
    const [scannedIndex, setScannedIndex] = useState(-1);
    const [tokens, setTokens] = useState([]);

    // Config
    const TOTAL_POINTS = 48;
    const PATCH_SIZE = 8;
    const STRIDE = 8;

    // Generate static data
    const dataPoints = Array.from({ length: TOTAL_POINTS }, (_, i) =>
        Math.sin(i * 0.2) * 20 + 40 + Math.random() * 5
    );

    // Calculate total patches
    const totalPatches = Math.floor((TOTAL_POINTS - PATCH_SIZE) / STRIDE) + 1;

    useEffect(() => {
        if (isExportMode) {
            // Instant final state
            setScannedIndex(totalPatches);
            setTokens(Array.from({ length: totalPatches }, (_, i) => i));
            return;
        }

        const interval = setInterval(() => {
            setScannedIndex(prev => {
                if (prev >= totalPatches) return prev; // Stop at end
                const next = prev + 1;
                if (next < totalPatches) {
                    setTokens(curr => [...curr, next]);
                }
                return next;
            });
        }, 800); // Scan speed

        return () => clearInterval(interval);
    }, [isExportMode, totalPatches]);

    const reset = () => {
        setScannedIndex(-1);
        setTokens([]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 04 — Patching & Tokenization
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-2 text-center">
                Visualizing <span className="text-teal">Patching</span>
            </motion.h2>

            <p className="text-muted text-sm mb-12 max-w-2xl text-center">
                Instead of processing one point at a time (like RNNs), we break the series into <span className="text-gold">patches</span>.
                Each patch becomes a single vector <span className="text-teal">token</span>.
            </p>

            <div className="flex flex-col gap-8 w-full items-center">

                {/* 1. Token Sequence (Transformer Input) */}
                <div className="flex gap-4 h-24 items-center justify-center w-full bg-white/5 rounded-xl border border-white/10 relative overflow-hidden px-8">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted rotate-[-90deg]">
                        TOKENS
                    </div>
                    <AnimatePresence>
                        {tokens.map((id) => (
                            <motion.div
                                key={id}
                                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={isExportMode ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 }}
                                className="w-16 h-16 bg-gradient-to-br from-teal to-blue-600 rounded-lg border border-teal/50 shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center text-white font-bold font-mono text-lg z-10"
                            >
                                T{id}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {tokens.length === 0 && (
                        <div className="text-muted/20 font-mono text-sm">Waiting for patches...</div>
                    )}
                </div>

                {/* Arrow */}
                <div className="text-muted text-2xl">↑ Projection (Linear Layer)</div>

                {/* 2. Raw Time Series with Scanning Window */}
                <div className="bg-navy/50 border border-white/10 rounded-xl p-8 relative h-48 w-full flex items-end justify-between overflow-hidden">
                    <div className="absolute top-4 left-4 text-xs font-mono text-muted">RAW SERIES (L={TOTAL_POINTS})</div>

                    {/* Data Bars */}
                    <div className="flex items-end justify-between w-full h-full gap-1 pt-8">
                        {dataPoints.map((val, i) => {
                            // Determine if this bar is currently inside the scan window
                            const currentWindowStart = scannedIndex * STRIDE;
                            const isInWindow = i >= currentWindowStart && i < currentWindowStart + PATCH_SIZE;
                            const isProcessed = i < scannedIndex * STRIDE;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: `${val}%`,
                                        backgroundColor: isInWindow ? '#f59e0b' : (isProcessed ? '#00d4ff' : '#334155'),
                                        opacity: isInWindow ? 1 : 0.5
                                    }}
                                    className="w-full rounded-t-sm transition-colors duration-300"
                                />
                            );
                        })}
                    </div>

                    {/* Scanning Window Overlay */}
                    {scannedIndex < totalPatches && scannedIndex >= 0 && (
                        <motion.div
                            layoutId="scanWindow"
                            className="absolute bottom-0 h-[80%] border-2 border-gold bg-gold/10 pointer-events-none z-20"
                            initial={false}
                            animate={{
                                left: `${(scannedIndex * STRIDE / TOTAL_POINTS) * 100}%`,
                                width: `${(PATCH_SIZE / TOTAL_POINTS) * 100}%`
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-gold text-[10px] font-bold whitespace-nowrap">
                                Patch {scannedIndex}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Controls */}
                {!isExportMode && (
                    <button
                        onClick={reset}
                        className="px-6 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition-colors"
                    >
                        Replay Animation
                    </button>
                )}
            </div>
        </div>
    );
}
