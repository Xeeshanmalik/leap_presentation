import { motion } from "framer-motion";

export default function SlideDecisionTree() {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 15 — Strategic Selection
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                Which Model Should You <span className="text-teal">Choose?</span>
            </motion.h2>

            <div className="w-full max-w-5xl h-[500px] relative bg-white/5 border border-white/10 rounded-xl p-8 overflow-hidden">
                {/* SVG Flowchart */}
                <svg className="w-full h-full" viewBox="0 0 800 500">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>

                    {/* Root */}
                    <g transform="translate(400, 50)">
                        <rect x="-100" y="-25" width="200" height="50" rx="25" fill="#1e293b" stroke="#00d4ff" strokeWidth="2" />
                        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Do you have huge data?</text>
                    </g>

                    {/* Left Branch (No) */}
                    <path d="M 300 75 Q 200 150 200 200" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <text x="230" y="140" fill="#f43f5e" fontSize="12" fontWeight="bold">No</text>
                    <g transform="translate(200, 225)">
                        <rect x="-80" y="-20" width="160" height="40" rx="10" fill="#1e293b" stroke="#f43f5e" />
                        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12">Small / Noisy?</text>
                    </g>

                    {/* Right Branch (Yes) */}
                    <path d="M 500 75 Q 600 150 600 200" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <text x="570" y="140" fill="#00d4ff" fontSize="12" fontWeight="bold">Yes</text>
                    <g transform="translate(600, 225)">
                        <rect x="-80" y="-20" width="160" height="40" rx="10" fill="#1e293b" stroke="#00d4ff" />
                        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12">Multiple Variates?</text>
                    </g>

                    {/* Decisions */}
                    <path d="M 200 245 L 200 320" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <g transform="translate(200, 350)">
                        <rect x="-80" y="-30" width="160" height="60" rx="5" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" />
                        <text x="0" y="-5" textAnchor="middle" fill="#f43f5e" fontSize="16" fontWeight="bold">ARIMA / XGBoost</text>
                        <text x="0" y="15" textAnchor="middle" fill="#f43f5e" fontSize="10">Don't overcomplicate it.</text>
                    </g>

                    <path d="M 550 245 L 500 320" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <g transform="translate(480, 350)">
                        <rect x="-70" y="-30" width="140" height="60" rx="5" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" />
                        <text x="0" y="-5" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">TimesFM</text>
                        <text x="0" y="15" textAnchor="middle" fill="#f59e0b" fontSize="10">Univariate Foundation</text>
                    </g>

                    <path d="M 650 245 L 700 320" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <g transform="translate(720, 350)">
                        <rect x="-70" y="-30" width="140" height="60" rx="5" fill="#00d4ff" fillOpacity="0.2" stroke="#00d4ff" />
                        <text x="0" y="-5" textAnchor="middle" fill="#00d4ff" fontSize="16" fontWeight="bold">Moirai</text>
                        <text x="0" y="15" textAnchor="middle" fill="#00d4ff" fontSize="10">Multivariate King</text>
                    </g>
                </svg>

                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded text-xs text-muted font-mono">
                    Pro Tip: Start simple.
                </div>
            </div>
        </div>
    );
}
