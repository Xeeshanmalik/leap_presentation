import { motion } from "framer-motion";
// import { useCountUp } from 'react-use-count-up';
// I'll use a custom hook-like approach for number animation.

const Counter = ({ end, suffix = "", duration = 2 }) => {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {end}{suffix}
        </motion.span>
    ); // Placeholder for actual counting animation which is complex to write inline. Static for now is safer.
};

export default function SlideScaling({ isExportMode }) {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 09 — Scaling to "Large"
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-6 text-center">
                What Makes a Time Series Model <span className="text-gold">"Large"?</span>
            </motion.h2>

            <p className="text-gray-400 text-sm mb-16 text-center">Three orthogonal axes of scale — each matters differently</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {/* Stat 1 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: isExportMode ? 0 : 0.2 }}
                    className="flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="text-6xl font-syne font-extrabold text-white mb-2">200B</div>
                    <div className="text-teal font-mono text-sm tracking-widest uppercase mb-4">Parameters</div>
                    <p className="text-xs text-muted leading-relaxed">
                        Model capacity to capture complex temporal patterns. Requires massive compute.
                    </p>
                </motion.div>

                {/* Stat 2 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: isExportMode ? 0 : 0.4 }}
                    className="flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden"
                >
                    <div className={`absolute inset-0 bg-gold/10 mx-auto rounded-2xl ${isExportMode ? '' : 'animate-pulse'}`} />
                    <div className="text-6xl font-syne font-extrabold text-gold mb-2 relative z-10">1T+</div>
                    <div className="text-white font-mono text-sm tracking-widest uppercase mb-4 relative z-10">Training Tokens</div>
                    <p className="text-xs text-muted leading-relaxed relative z-10">
                        Diverse pretraining corpora: energy, weather, finance, IoT.
                    </p>
                </motion.div>

                {/* Stat 3 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: isExportMode ? 0 : 0.6 }}
                    className="flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="text-6xl font-syne font-extrabold text-purple mb-2">512K</div>
                    <div className="text-gold font-mono text-sm tracking-widest uppercase mb-4">Context Length</div>
                    <p className="text-xs text-muted leading-relaxed">
                        How many timesteps the model can attend to simultaneously.
                    </p>
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isExportMode ? 0 : 1 }}
                className="mt-12 text-center text-sm text-gray-500 max-w-2xl"
            >
                Moving from model-per-dataset to <strong className="text-white">Foundation Models</strong> pre-trained on diverse corpora (LOTSA, Monash, etc.).
            </motion.p>
        </div>
    );
}
