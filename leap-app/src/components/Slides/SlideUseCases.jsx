import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cases = [
    {
        id: 1,
        title: "Energy Grid Optimization",
        desc: "Predicting peak loads to balance renewable energy sources.",
        color: "bg-blue-600",
        chart: "Energy Demand Chart Placeholder"
    },
    {
        id: 2,
        title: "Supply Chain Demand",
        desc: "Forecasting inventory needs across global logistics networks.",
        color: "bg-orange-600",
        chart: "Supply Chain Chart Placeholder"
    },
    {
        id: 3,
        title: "Financial Forecasting",
        desc: "High-frequency trading signals driven by multi-modal inputs.",
        color: "bg-green-600",
        chart: "Financial Chart Placeholder"
    },
];

export default function SlideUseCases() {
    const [activeId, setActiveId] = useState(2); // Center item active by default

    const handleCardClick = (id) => {
        setActiveId(id);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 text-white overflow-hidden perspective-1000">
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold mb-16"
            >
                Real-World Applications
            </motion.h1>

            <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
                <AnimatePresence>
                    {cases.map((item) => {
                        const isActive = item.id === activeId;
                        // Calculate position based on relative index

                        const position = item.id - activeId; // -1, 0, 1 ideally
                        // If activeId changes, we want smooth transition.

                        return (
                            <motion.div
                                key={item.id}
                                onClick={() => handleCardClick(item.id)}
                                className={`absolute w-64 h-80 ${item.color} rounded-2xl p-6 cursor-pointer flex flex-col justify-between shadow-2xl border border-white/20`}
                                animate={{
                                    x: position * 320, // Simple linear spacing for now, or 3D?
                                    scale: isActive ? 1.1 : 0.8,
                                    zIndex: isActive ? 20 : 10,
                                    opacity: Math.abs(position) > 1 ? 0 : 1, // Hide if not adjacent
                                    rotateY: position * -15
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{
                                    // Manual override specifically for 3-item carousel logic if needed
                                    // But layout based on `position` works for 1, 2, 3
                                }}
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                                    <p className="text-sm opacity-90">{item.desc}</p>
                                </div>

                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-black/20 p-2 rounded mt-4 h-32 flex items-center justify-center font-mono text-xs"
                                    >
                                        {item.chart}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <p className="mt-12 text-gray-500">Click a card to focus</p>
        </div>
    );
}
