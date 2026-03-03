import { motion } from "framer-motion";

export default function SlideClassical({ isExportMode }) {
    const methods = [
        {
            label: "ARIMA",
            pros: ["Interpretable, fast", "Works for stationary data"],
            cons: ["Linear assumptions only", "Manual differencing", "No multivariate"],
            color: "rose",
            context: 15
        },
        {
            label: "LSTM / GRU",
            pros: ["Non-linear, flexible", "Sequential memory"],
            cons: ["Vanishing gradients", "Slow sequential training", "Local focus"],
            color: "gold",
            context: 40
        },
        {
            label: "CNN / TCN",
            pros: ["Parallelizable", "Local pattern extraction"],
            cons: ["Fixed receptive field", "Needs deep stacking", "No temporal ordering"],
            color: "teal",
            context: 65
        }
    ];

    const getColor = (c) => {
        if (c === 'rose') return 'text-rose border-rose bg-rose/10';
        if (c === 'gold') return 'text-gold border-gold bg-gold/10';
        if (c === 'teal') return 'text-teal border-teal bg-teal/10';
        return 'text-white border-white';
    };

    const getBarColor = (c) => {
        if (c === 'rose') return 'bg-rose';
        if (c === 'gold') return 'bg-gold';
        if (c === 'teal') return 'bg-teal';
        return 'bg-white';
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 02 — Classical Limits
            </motion.div>

            <motion.h2
                initial={isExportMode ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-syne font-bold text-4xl mb-12 text-center"
            >
                Classical Approaches & Where They <span className="text-gold">Break</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {methods.map((method, i) => (
                    <motion.div
                        key={i}
                        initial={isExportMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: isExportMode ? 0 : i * 0.2 }}
                        className="glass-panel p-6 rounded-xl flex flex-col"
                    >
                        <div className={`font-syne font-bold text-2xl mb-4 ${method.color === 'rose' ? 'text-rose' : method.color === 'gold' ? 'text-gold' : 'text-teal'}`}>
                            {method.label}
                        </div>

                        <div className="flex-grow space-y-2 mb-6">
                            {method.pros.map((p, idx) => (
                                <div key={idx} className="flex gap-2 text-xs text-green font-medium">
                                    <span>✓</span> {p}
                                </div>
                            ))}
                            {method.cons.map((c, idx) => (
                                <div key={idx} className="flex gap-2 text-xs text-rose font-medium">
                                    <span>✗</span> {c}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between text-[10px] uppercase text-muted mb-2 font-mono">
                                <span>Context Window</span>
                                <span>~{method.context * 8} steps</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={isExportMode ? { width: `${method.context}%` } : { width: 0 }}
                                    animate={{ width: `${method.context}%` }}
                                    transition={{ delay: isExportMode ? 0 : 1 + i * 0.2, duration: isExportMode ? 0 : 1 }}
                                    className={`h-full rounded-full ${getBarColor(method.color)}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
