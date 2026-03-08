import { motion } from "framer-motion";

export default function SlideFFN({ isExportMode }) {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 08 — Feed-Forward & LayerNorm
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                Stabilizing <span className="text-teal">Deep Temporal Networks</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
                {/* Diagram */}
                <div className="flex flex-col items-center gap-4 relative">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={isExportMode ? { duration: 0 } : {}}
                        className="w-48 py-4 bg-white/5 border border-white/20 rounded-lg text-center font-mono text-sm"
                    >
                        Layer Normalization
                    </motion.div>
                    <motion.div
                        animate={isExportMode ? { y: 0 } : { y: [0, 5, 0] }}
                        transition={isExportMode ? { duration: 0 } : { repeat: Infinity, duration: 1.5 }}
                        className="text-white custom-arrow"
                    >
                        ↓
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={isExportMode ? { duration: 0, delay: 0 } : { delay: 0.2 }}
                        className="w-48 py-6 bg-teal text-navy font-bold rounded-lg text-center shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                    >
                        Feed Forward (MLP)
                    </motion.div>
                    <motion.div
                        animate={isExportMode ? { y: 0 } : { y: [0, 5, 0] }}
                        transition={isExportMode ? { duration: 0 } : { repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="text-white custom-arrow"
                    >
                        ↓
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={isExportMode ? { duration: 0, delay: 0 } : { delay: 0.4 }}
                        className="w-48 py-4 bg-white/5 border border-white/20 rounded-lg text-center font-mono text-sm"
                    >
                        Residual Connection
                    </motion.div>

                    {/* Residual Line */}
                    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full -z-10 overflow-visible">
                        <path d="M -24 20 C -60 20, -60 200, -24 200" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                        <text x="-70" y="110" fill="#8b5cf6" fontSize="10" transform="rotate(-90 -70 110)">Add & Norm</text>
                    </svg>
                </div>

                {/* Explanations */}
                <div className="space-y-6">
                    <div className="p-4 border-l-2 border-teal bg-teal/5 rounded-r-lg">
                        <h3 className="text-teal font-syne font-bold font-lg mb-2">Feed-Forward Network (FFN)</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            FFN(x) = max(0, xW₁ + b₁)W₂ + b₂. This adds non-linearity that attention alone cannot provide.
                        </p>
                    </div>

                    <div className="p-4 border-l-2 border-gold bg-gold/5 rounded-r-lg">
                        <h3 className="text-gold font-syne font-bold font-lg mb-2">Layer Normalization</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Normalizes across feature dimensions. Prevents internal covariate shift and enables training of 100-layer networks.
                        </p>
                    </div>

                    <div className="p-4 border-l-2 border-purple bg-purple/5 rounded-r-lg">
                        <h3 className="text-purple font-syne font-bold font-lg mb-2">Residual Connections</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Output(x) = x + Sublayer(LN(x)). shortcuts ensure gradients flow cleanly to early layers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
