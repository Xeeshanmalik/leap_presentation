import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SlidePretraining({ isExportMode }) {
    const [tokens, setTokens] = useState(
        isExportMode
            ? Array.from({ length: 12 }, (_, i) => ({ id: i, val: Math.floor(Math.random() * 100), masked: i % 3 === 0 }))
            : Array.from({ length: 12 }, (_, i) => ({ id: i, val: Math.floor(Math.random() * 100), masked: false }))
    );

    useEffect(() => {
        if (isExportMode) return;

        const interval = setInterval(() => {
            setTokens(prev => prev.map(t => ({
                ...t,
                masked: Math.random() > 0.7 // 30% mask rate
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, [isExportMode]);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 11 — Self-Supervised Pretraining
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-4 text-center">
                Learning from <span className="text-teal">Missing Data</span>
            </motion.h2>

            <p className="text-muted text-sm mb-12 text-center max-w-2xl">
                Masked Modeling: The model learns the underlying physics by trying to reconstruct hidden patches.
            </p>

            <div className="flex gap-4 mb-8">
                {tokens.map((t, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            backgroundColor: t.masked ? '#1a1a1a' : '#00d4ff1a',
                            borderColor: t.masked ? '#333' : '#00d4ff',
                            scale: t.masked ? 0.9 : 1
                        }}
                        transition={isExportMode ? { duration: 0 } : {}}
                        className="w-16 h-24 border rounded-lg flex flex-col items-center justify-center relative"
                    >
                        {t.masked ? (
                            <span className="text-2xl text-muted">?</span>
                        ) : (
                            <span className="text-xl font-mono font-bold text-teal">{t.val}</span>
                        )}
                        <span className="text-[9px] text-muted absolute bottom-2">t{i}</span>
                    </motion.div>
                ))}
            </div>

            <motion.div
                animate={isExportMode ? { opacity: 1 } : { opacity: [0, 1, 0] }}
                transition={isExportMode ? { duration: 0 } : { duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                className="text-gold font-mono text-sm mb-12"
            >
                Reconstructing... Loss: 0.034
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-syne font-bold font-white mb-2">Contrastive Learning</h3>
                    <p className="text-xs text-muted leading-relaxed">
                        Pulling together positive pairs (same series, different augmentation) and pushing apart negatives.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-syne font-bold font-white mb-2">Masked Modeling</h3>
                    <p className="text-xs text-muted leading-relaxed">
                        Example: BERT for Time Series. Randomly mask 40% of patches and predict them. Forces model to learn local context.
                    </p>
                </div>
            </div>

        </div>
    );
}
