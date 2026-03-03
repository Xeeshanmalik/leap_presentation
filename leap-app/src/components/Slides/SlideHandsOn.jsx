import { motion } from "framer-motion";
import { useState } from "react";

export default function SlideHandsOn() {
    const [step, setStep] = useState(0);

    const codeBlocks = [
        {
            line: "from time_transformers import AutoModel",
            comment: "# 1. Import library"
        },
        {
            line: "model = AutoModel.load('google/timesfm-1.0-200m')",
            comment: "# 2. Load pre-trained weights"
        },
        {
            line: "data = load_csv('sales_data.csv')",
            comment: "# 3. Load your private data"
        },
        {
            line: "forecast = model.predict(data, horizon=96)",
            comment: "# 4. Zero-shot inference"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal font-mono text-sm tracking-[3px] uppercase mb-4 opacity-70">
        // 16 — Hands-On
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-syne font-bold text-4xl mb-12 text-center">
                Running Intelligence in <span className="text-teal">4 Lines of Code</span>
            </motion.h2>

            <div className="w-full max-w-3xl bg-[#0d1528] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="ml-auto text-xs text-muted">demo.py</div>
                </div>

                <div className="p-6 space-y-4">
                    {codeBlocks.map((block, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: step >= i ? 1 : 0.3, x: step === i ? 10 : 0 }}
                            onClick={() => setStep(i)}
                            className={`cursor-pointer transition-all duration-300 ${step === i ? 'bg-white/5 -mx-6 px-6 py-2 border-l-4 border-teal' : ''}`}
                        >
                            <span className="text-purple-400">{block.line.split(' ')[0]}</span>
                            <span className="text-gray-300">{block.line.substring(block.line.indexOf(' '))}</span>
                            <span className="text-gray-500 ml-4 italic">{block.comment}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-white/5 bg-black/20 text-xs text-muted">
                    {step === 0 && "Install via 'pip install time-transformers'..."}
                    {step === 1 && "Downloads ~800MB weights locally. No API calls needed."}
                    {step === 2 && "Pandas DataFrame or Numpy array. Handling missing values is automatic."}
                    {step === 3 && "Returns probabilistic forecast with confidence intervals."}
                </div>
            </div>

            <button
                onClick={() => setStep(prev => (prev + 1) % 4)}
                className="mt-8 px-6 py-3 bg-teal text-navy font-bold rounded-lg hover:bg-white transition-colors"
            >
                Next Step
            </button>

        </div>
    );
}
