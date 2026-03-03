import { motion } from "framer-motion";

export default function SlideProblem() {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70"
            >
        // 01 — The Problem
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-syne font-bold text-5xl mb-12 text-center"
            >
                Why is Time Series Data <span className="text-teal">Uniquely Hard?</span>
            </motion.h2>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            >
                {/* Card 1 */}
                <motion.div variants={item} className="glass-panel p-8 rounded-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">📉</div>
                    <h3 className="text-teal font-syne font-bold text-xl mb-3">Non-Stationarity</h3>
                    <p className="text-muted text-sm leading-relaxed">
                        Statistical properties shift over time — mean, variance, and distribution all drift. Models trained on past windows fail silently on future windows.
                    </p>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" />
                </motion.div>

                {/* Card 2 */}
                <motion.div variants={item} className="glass-panel p-8 rounded-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">🔗</div>
                    <h3 className="text-teal font-syne font-bold text-xl mb-3">Long-Range Dependencies</h3>
                    <p className="text-muted text-sm leading-relaxed">
                        An event from 2 years ago may strongly influence today. Traditional windowed models can't reach far enough to capture these causal chains.
                    </p>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" />
                </motion.div>

                {/* Card 3 */}
                <motion.div variants={item} className="glass-panel p-8 rounded-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">⏱️</div>
                    <h3 className="text-teal font-syne font-bold text-xl mb-3">Irregular Sampling</h3>
                    <p className="text-muted text-sm leading-relaxed">
                        Sensor data, financial ticks, medical readings — real-world time series arrive at uneven intervals, breaking fixed-stride assumptions.
                    </p>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" />
                </motion.div>
            </motion.div>

            {/* Decorative Distribution Shift Animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full max-w-4xl h-32 mt-12 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden flex items-end"
            >
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <motion.path
                        d="M0,100 Q100,50 200,80 T400,60 T600,90 T800,40 T1000,70 V128 H0 Z"
                        fill="url(#grad1)"
                        initial={{ d: "M0,100 Q100,80 200,90 T400,85 T600,95 T800,80 T1000,90 V128 H0 Z" }}
                        animate={{ d: "M0,100 Q100,20 200,80 T400,10 T600,100 T800,20 T1000,60 V128 H0 Z" }}
                        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(0, 212, 255, 0.2)" />
                            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute bottom-2 right-4 font-mono text-xs text-gold animate-pulse">
                    Warning: Distribution Drift Detected
                </div>
            </motion.div>

        </div>
    );
}
