import { motion } from "framer-motion";

export default function SlideClassical({ isExportMode }) {
    const methods = [
        {
            label: "ARIMA",
            pros: ["Interpretable, fast", "Works for stationary data"],
            cons: ["Linear assumptions only", "Manual differencing", "No multivariate"],
            color: "ts",
            context: 15
        },
        {
            label: "LSTM / GRU",
            pros: ["Non-linear, flexible", "Sequential memory"],
            cons: ["Vanishing gradients", "Slow sequential training", "Local focus"],
            color: "x",
            context: 40
        },
        {
            label: "CNN / TCN",
            pros: ["Parallelizable", "Local pattern extraction"],
            cons: ["Fixed receptive field", "Needs deep stacking", "No temporal ordering"],
            color: "t",
            context: 65
        }
    ];

    const getColor = (c) => {
        if (c === 'ts') return 'text-ts border-ts bg-ts/10';
        if (c === 'x') return 'text-x border-x bg-x/10';
        if (c === 't') return 'text-t border-t bg-t/10';
        return 'text-white border-white';
    };

    const getBarColor = (c) => {
        if (c === 'ts') return 'bg-ts';
        if (c === 'x') return 'bg-x';
        if (c === 't') return 'bg-t';
        return 'bg-text';
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-[1400px] mx-auto px-6 relative z-10 font-outfit">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-t font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
                // 02 — Classical Limits
            </motion.div>

            <motion.h2
                initial={isExportMode ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-playfair font-bold text-4xl mb-8 text-center text-text"
            >
                Classical Approaches & Where They <span className="text-x text-transparent bg-clip-text bg-gradient-to-r from-x to-red-500">Break</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {methods.map((method, i) => (
                    <motion.div
                        key={i}
                        initial={isExportMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: isExportMode ? 0 : i * 0.2 }}
                        className="bg-card border border-border p-6 rounded-xl flex flex-col shadow-xl relative overflow-hidden group"
                    >
                        <div className={`font-playfair font-bold text-2xl mb-4 ${method.color === 'ts' ? 'text-ts' : method.color === 'x' ? 'text-x' : 'text-t'}`}>
                            {method.label}
                        </div>

                        <div className="flex-grow space-y-2 mb-6">
                            {method.pros.map((p, idx) => (
                                <div key={idx} className="flex gap-2 text-xs text-l font-medium">
                                    <span>✓</span> {p}
                                </div>
                            ))}
                            {method.cons.map((c, idx) => (
                                <div key={idx} className="flex gap-2 text-xs text-rose-400 font-medium">
                                    <span>✗</span> {c}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between text-[10px] uppercase text-muted mb-2 font-mono">
                                <span>Context Window</span>
                                <span>~{method.context * 8} steps</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                                <motion.div
                                    initial={isExportMode ? { width: `${method.context}%` } : { width: 0 }}
                                    animate={{ width: `${method.context}%` }}
                                    transition={{ delay: isExportMode ? 0 : 1 + i * 0.2, duration: isExportMode ? 0 : 1 }}
                                    className={`h-full rounded-full ${getBarColor(method.color)}`}
                                />
                            </div>
                        </div>

                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${method.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
