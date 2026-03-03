import { motion } from "framer-motion";

const APP_BASE = import.meta.env.VITE_APP_URL || "http://localhost:5173";
const QUIZ_URL = `${APP_BASE}/quiz`;

export default function SlideSummary() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center h-full max-w-7xl mx-auto px-8 gap-12 relative z-10">

            {/* Left: Takeaways */}
            <div className="flex-1 space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-syne font-bold text-5xl mb-8"
                >
                    <span className="text-teal">Summary</span> & Key Takeaways
                </motion.h2>

                <ul className="space-y-6">
                    {[
                        "Time Series problems are moving from specific to general.",
                        "Transformers handle long dependencies & irregular sampling.",
                        "Pre-trained Foundation Models (TimesFM, Moirai) enable zero-shot forecasting.",
                        "The future is Agentic: Models that don't just predict, but act."
                    ].map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="flex items-start gap-4 text-lg text-gray-300"
                        >
                            <span className="text-gold font-bold">0{i + 1}.</span>
                            {item}
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Right: QR Code / Call to Action */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-4 rounded-2xl shadow-2xl relative"
                >
                    {/* We can re-use the QR code component or just the image generated in SlideStart */}
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-xl">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(QUIZ_URL)}`} alt="Scan to join quiz" className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-16 w-full text-center">
                        <div className="text-white font-syne font-bold text-xl">Join the Q&amp;A 📱</div>
                        <div className="font-mono text-xs mt-1" style={{ color: "#00d4ff" }}>{QUIZ_URL}</div>
                    </div>
                </motion.div>

                <div className="mt-20 flex gap-4">
                    <a href="#" className="px-6 py-3 border border-teal text-teal rounded-lg hover:bg-teal hover:text-navy transition font-mono text-sm">
                        github.com/zmalik/leap2026
                    </a>
                    <a href="#" className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition font-mono text-sm">
                        @DrZeeshanMalik
                    </a>
                </div>
            </div>

        </div>
    );
}
