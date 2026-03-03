import { motion } from "framer-motion";
import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function SlideForecasting() {
    const [domain, setDomain] = useState('Energy');

    const generateData = (type) => {
        return Array.from({ length: 30 }, (_, i) => {
            let val = 50;
            if (type === 'Energy') val = 50 + Math.sin(i * 0.5) * 30 + (i > 24 ? Math.random() * 10 : 0);
            if (type === 'Finance') val = 100 + i * 2 + (Math.random() - 0.5) * 20;
            if (type === 'Weather') val = 20 + Math.sin(i * 0.3) * 10 + (Math.random() * 5);

            return {
                day: i,
                past: i < 24 ? val : null,
                forecast: i >= 24 ? val : null,
                lower: i >= 24 ? val - 10 : null,
                upper: i >= 24 ? val + 10 : null
            };
        });
    };

    const data = generateData(domain);
    const color = domain === 'Energy' ? '#00d4ff' : domain === 'Finance' ? '#f59e0b' : '#8b5cf6';

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 12 — Zero-Shot Forecasting
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-4 text-center">
                One Model, <span style={{ color: color }}>Many Domains</span>
            </motion.h2>

            <div className="flex gap-4 mb-8">
                {['Energy', 'Finance', 'Weather'].map(d => (
                    <button
                        key={d}
                        onClick={() => setDomain(d)}
                        className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${domain === d
                                ? `bg-white/10 border-white text-white shadow`
                                : 'bg-transparent border-white/20 text-muted hover:border-white/40'
                            }`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-4xl h-80 bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                            <pattern id="diagonalHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <rect width="4" height="8" fill={color} opacity="0.1" />
                            </pattern>
                        </defs>

                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#333' }}
                            itemStyle={{ color: '#fff' }}
                        />

                        <Area type="monotone" dataKey="past" stroke={color} fill="url(#splitColor)" strokeWidth={3} />

                        {/* Forecast Area */}
                        <Area type="monotone" dataKey="forecast" stroke={color} strokeDasharray="5 5" fill="none" strokeWidth={3} />

                        {/* Uncertainty Bounds (Simulated visually) */}
                        <Area type="monotone" dataKey="upper" stroke="none" fill="url(#diagonalHatch)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <p className="text-sm text-center text-muted max-w-2xl">
                The foundation model adapts to different distributions without fine-tuning, leveraging patterns learned from 1B+ training series.
            </p>

        </div>
    );
}
