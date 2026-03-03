import { useState } from "react";
import { motion } from "framer-motion";

const milestones = [
    {
        year: "1970s",
        title: "ARIMA",
        desc: "Statistical foundations. Great for linear patterns, struggles with complexity.",
        color: "bg-blue-500",
    },
    {
        year: "1980s",
        title: "RNNs",
        desc: "Recurrent Neural Networks introduced memory, but suffered from vanishing gradients.",
        color: "bg-purple-500",
    },
    {
        year: "1997",
        title: "LSTMs",
        desc: "Long Short-Term Memory. Solved vanishing gradients, enabled long-range dependencies.",
        color: "bg-green-500",
    },
    {
        year: "2017",
        title: "Transformers",
        desc: "Attention is All You Need. Parallelization and massive scale processing.",
        color: "bg-yellow-500",
    },
    {
        year: "2024+",
        title: "LTSMs (Modern)",
        desc: "Foundation Models for Time Series. Large-scale pre-training, zero-shot forecasting.",
        color: "bg-red-500",
    },
];

export default function SlideEvolution({ isExportMode }) {

    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 relative">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-16"
            >
                The Evolution of Time Series Models
            </motion.h1>

            <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 -z-10 rounded-full" />

                {milestones.map((item, index) => {
                    // Export Logic: Show all cards. Alternate up/down to prevent overlap if needed, 
                    // but standard spacing usually works. Let's stick to up for consistency, 
                    // or toggle if we fear overlap.
                    // Given 5 items in wide container, 'up' (-180) should be safe.
                    const isVisible = isExportMode || hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center cursor-pointer group"
                            onMouseEnter={() => !isExportMode && setHoveredIndex(index)}
                            onMouseLeave={() => !isExportMode && setHoveredIndex(null)}
                        >
                            {/* Timeline Node */}
                            <motion.div
                                className={`w-12 h-12 rounded-full ${item.color} border-4 border-gray-900 z-10 shadow-lg shadow-${item.color}/50`}
                                whileHover={!isExportMode ? { scale: 1.5, rotate: 45 } : {}}
                                transition={{ type: "spring", stiffness: 300 }}
                            />

                            {/* Year Label */}
                            <div className="absolute top-16 font-mono text-xl text-gray-400 group-hover:text-white transition-colors">
                                {item.year}
                            </div>

                            {/* Content Card (Visible on Hover or Export) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{
                                    opacity: isVisible ? 1 : 0,
                                    y: isVisible ? -190 : 20, // Move up slightly more to clear
                                    scale: isVisible ? 1 : 0.8,
                                }}
                                className={`absolute w-60 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-center pointer-events-none z-20`}
                            >
                                <h3 className={`text-xl font-bold mb-2 ${item.color.replace('bg-', 'text-')}`}>
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-200 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
