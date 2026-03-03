import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function SlideHowItWorks({ isExportMode }) {
    const [lookback, setLookback] = useState(50);

    // Generate dummy data based on lookback period
    const data = useMemo(() => {
        const points = [];
        for (let i = 0; i < 100; i++) {
            const x = i;
            // Simulate a time series (sine wave + noise)
            let y = Math.sin(x * 0.1) * 10 + 50;

            // Confidence interval widens as we go further into the future (index > lookback)
            let ci = 0;
            if (i > lookback) {
                // Further out -> wider CI
                ci = (i - lookback) * 0.5 * (Math.random() * 0.5 + 0.5);
            }

            points.push({
                name: i,
                value: y,
                ciTop: y + ci,
                ciBottom: y - ci,
                isForecast: i > lookback
            });
        }
        return points;
    }, [lookback]);

    return (
        <div className="flex flex-col h-full w-full p-8 bg-neutral-900 text-white">
            <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold mb-4"
            >
                How LTSM Works: Context & Horizon
            </motion.h1>

            <div className="flex flex-1 gap-8">
                {/* Controls & Explanation */}
                <div className="w-1/3 flex flex-col gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Lookback Period (Context Window)</label>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            value={lookback}
                            onChange={(e) => setLookback(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="mt-2 text-right text-blue-400 font-mono">{lookback} Time Steps</div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                            <h3 className="font-bold text-blue-400">Context Window</h3>
                            <p className="text-sm text-gray-300">
                                The model analyzes historical data (left of the line) to understand patterns.
                            </p>
                        </div>
                        <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                            <h3 className="font-bold text-purple-400">Forecasting Horizon</h3>
                            <p className="text-sm text-gray-300">
                                Predictions (right of the line) become less certain over time, shown by the widening confidence interval.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                                itemStyle={{ color: '#fff' }}
                            />

                            {/* Confidence Interval (Simulated by stacking or separate areas? keeping simple for now, just main line + range) */}
                            {/* Actually, let's just plot the line and maybe a shaded area for uncertainty */}

                            <Area
                                type="monotone"
                                dataKey="ciTop"
                                stroke="none"
                                fill="#ff0000"
                                fillOpacity={0.2}
                                isAnimationActive={!isExportMode}
                            />
                            {/* We can't easily do a 'range' area in simple Recharts without constructing the data specifically for a range chart, 
                        or using two areas where one hides the bottom. 
                        For simplicity, I'll just show the Forecast as a separate color area. 
                    */}

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#82ca9d"
                                fill="url(#colorValue)"
                                strokeWidth={3}
                                isAnimationActive={!isExportMode}
                            />

                            {/* Reference Line for the Lookback */}
                            {/* We can use a ReferenceLine but need to import it. Or just render a custom shape. 
                         I'll add ReferenceLine to imports if I strictly need it, but I'll skip to avoid more imports for now and just use a customized dot or separate logic.
                         Actually, I'll add ReferenceLine.
                     */}
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Overlay Line for Lookback */}
                    <div
                        className="absolute top-4 bottom-12 border-l-2 border-dashed border-white/50 pointer-events-none"
                        style={{ left: `${(lookback / 100) * 100}%` /* Rough approximation assuming 100 points and full width */ }}
                    >
                        <span className="absolute -top-6 -left-3 text-xs bg-white text-black px-1 rounded">Now</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
