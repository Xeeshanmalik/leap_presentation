import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SlideAgents({ isExportMode }) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (isExportMode) {
            setActive(true);
        }
    }, [isExportMode]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 text-white relative overflow-hidden">
            <h1 className="text-4xl font-bold mb-12 z-10">Agentic Frameworks & LTSM</h1>

            <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center">

                {/* Nodes */}
                {/* Agent Node */}
                <div className="absolute top-1/2 left-20 transform -translate-y-1/2 flex flex-col items-center z-10">
                    <div className="w-32 h-32 bg-blue-600 rounded-xl flex items-center justify-center border-4 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                        <span className="text-2xl font-bold">AI Agent</span>
                    </div>
                    <p className="mt-4 text-gray-400">Orchestrator</p>
                </div>

                {/* LTSM Node */}
                <div className="absolute top-20 right-40 flex flex-col items-center z-10">
                    <div className="w-28 h-28 bg-green-600 rounded-full flex items-center justify-center border-4 border-green-400 shadow-[0_0_30px_rgba(22,163,74,0.5)]">
                        <span className="text-xl font-bold">LTSM</span>
                    </div>
                    <p className="mt-4 text-gray-400">Forecasting Engine</p>
                </div>

                {/* Tool Node */}
                <div className="absolute bottom-20 right-40 flex flex-col items-center z-10">
                    <div className="w-28 h-28 bg-purple-600 rounded-lg flex items-center justify-center border-4 border-purple-400 shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                        <span className="text-xl font-bold">Tool</span>
                    </div>
                    <p className="mt-4 text-gray-400">Execution Sandbox</p>
                </div>

                {/* Connections (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Agent -> LTSM */}
                    <line x1="180" y1="250" x2="650" y2="150" stroke="#333" strokeWidth="4" />

                    {/* Agent -> Tool */}
                    <line x1="180" y1="250" x2="650" y2="350" stroke="#333" strokeWidth="4" />

                    {/* LTSM -> Agent (Return) */}
                    <line x1="650" y1="150" x2="180" y2="250" stroke="#333" strokeWidth="4" strokeDasharray="5,5" className="opacity-30" />
                </svg>

                {/* Animations */}
                {active && (
                    <>
                        {/* 1. Query: Agent -> LTSM */}
                        <motion.div
                            className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
                            initial={{ left: 180, top: 250 }}
                            animate={{ left: 650, top: 150 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />

                        {/* 2. Response: LTSM -> Agent (Delayed) */}
                        <motion.div
                            className="absolute w-6 h-6 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"
                            initial={{ left: 650, top: 150, opacity: 0 }}
                            animate={{ left: 180, top: 250, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                        />

                        {/* 3. Action: Agent -> Tool (Delayed more) */}
                        <motion.div
                            className="absolute w-6 h-6 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"
                            initial={{ left: 180, top: 250, opacity: 0 }}
                            animate={{ left: 650, top: 350, opacity: 1 }}
                            transition={{ duration: 1, delay: 2.5, ease: "easeInOut" }}
                        />
                    </>
                )}

            </div>

            <button
                onClick={() => setActive(!active)}
                className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
                {active ? "Reset Flow" : "Trigger Agent Workflow"}
            </button>
        </div>
    );
}
