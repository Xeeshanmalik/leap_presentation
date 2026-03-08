import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function SlideMultiHeadAttention({ isExportMode }) {
    const generateData = (freq) => Array.from({ length: 40 }, (_, i) => ({ val: Math.sin(i * freq) * 10 + 20 }));

    const heads = [
        { id: 1, name: "Head 1: Daily", data: generateData(0.8), color: "#00d4ff" },
        { id: 2, name: "Head 2: Weekly", data: generateData(0.2), color: "#f59e0b" },
        { id: 3, name: "Head 3: Seasonal", data: generateData(0.05), color: "#8b5cf6" },
        { id: 4, name: "Head 4: Trend", data: Array.from({ length: 40 }, (_, i) => ({ val: i * 0.5 + 10 })), color: "#f43f5e" }
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 07 — Multi-Head Attention
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-4 text-center">
                Each Head Captures a <span className="text-gold">Different Temporal Pattern</span>
            </motion.h2>

            <p className="text-muted text-sm mb-12 text-center max-w-2xl">
                Just as CNN filters learn different edges/textures, Attention Heads specialize in different frequencies and relationships.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {heads.map((head, i) => (
                    <motion.div
                        key={head.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: isExportMode ? 0 : i * 0.15 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col h-48"
                    >
                        <div className="text-xs font-bold uppercase mb-2 flex items-center gap-2" style={{ color: head.color }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: head.color }} />
                            {head.name}
                        </div>
                        <div className="flex-grow w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={head.data}>
                                    <Line
                                        type="monotone"
                                        dataKey="val"
                                        stroke={head.color}
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={!isExportMode}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isExportMode ? 0 : 1 }}
                className="mt-12 p-6 bg-teal/5 border border-teal rounded-lg text-center"
            >
                <p className="text-teal font-bold font-syne text-lg">Parallel Feature Extraction</p>
                <p className="text-sm text-muted mt-2">The model doesn't just look at "the past" — it looks at daily cycles, weekly trends, and yearly seasons <span className="text-white italic">simultaneously</span>.</p>
            </motion.div>

        </div>
    );
}
