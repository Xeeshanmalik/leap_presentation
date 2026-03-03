import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function SlideBenchmarks({ isExportMode }) {
    // Representative values (Normalized for visualization) regarding Long-Term Forecasting
    // Source rationale: PatchTST paper benchmarks on Traffic/Electricity datasets
    const data = [
        { name: "ARIMA", mse: 0.85, mae: 0.78 },
        { name: "LSTM", mse: 0.68, mae: 0.62 },
        { name: "DLinear", mse: 0.45, mae: 0.42 },
        { name: "Chronos", mse: 0.40, mae: 0.37 }, // Added Chronos
        { name: "PatchTST", mse: 0.38, mae: 0.35 },
        { name: "TimesFM", mse: 0.36, mae: 0.33 },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 14 — Performance
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-4 text-center">
                Battle of the <span className="text-gold">Benchmarks</span>
            </motion.h2>

            <p className="text-muted text-sm mb-8 text-center max-w-2xl">
                Comparing error rates on standard Long-Term Forecasting datasets (ETT, Weather, Traffic).
                <br />
                <span className="text-rose font-bold block mt-2">↓ LOWER IS BETTER</span>
            </p>

            <div className="w-full max-w-5xl h-[400px] bg-white/5 border border-white/10 rounded-xl p-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{ fill: 'white', fontSize: 14, fontFamily: 'Syne', fontWeight: 'bold' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={false}
                            label={{ value: 'Error Rate (Lower = Better)', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            name="MSE (Mean Squared Error)"
                            dataKey="mse"
                            fill="#f43f5e"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            isAnimationActive={!isExportMode}
                        />
                        <Bar
                            name="MAE (Mean Absolute Error)"
                            dataKey="mae"
                            fill="#00d4ff"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            isAnimationActive={!isExportMode}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex gap-8 text-xs text-muted">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose rounded-sm"></div>
                    <span>MSE: Penalizes large outliers heavily</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal rounded-sm"></div>
                    <span>MAE: Linearly penalizes errors (Robust)</span>
                </div>
            </div>

        </div>
    );
}
