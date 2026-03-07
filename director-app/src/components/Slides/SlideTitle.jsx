import { motion } from "framer-motion";

export default function SlideTitle() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center relative z-10 font-outfit">

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-t/50 text-t px-6 py-2 rounded-full font-mono text-xs tracking-[4px] uppercase mb-12 shadow-[0_0_15px_rgba(56,189,248,0.3)] bg-card/50 backdrop-blur-md"
            >
                BI-50 Project
            </motion.div>

            {/* Main Title */}
            <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-playfair font-black text-[clamp(3rem,6vw,5.5rem)] leading-[1.1] mb-8 text-text drop-shadow-[0_0_40px_rgba(56,189,248,0.3)]"
            >
                Large Time Series<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-t to-text">Model</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[clamp(1.2rem,2vw,1.5rem)] text-muted font-light mb-16 tracking-wide"
            >
                Large Foundation Model Era
            </motion.p>

            {/* Presenter Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6 bg-white/5 border border-white/10 pr-8 pl-2 py-2 rounded-full backdrop-blur-md"
            >
                <div className="w-12 h-12 rounded-full bg-t/20 border-2 border-t flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-t flex items-center justify-center text-bg font-bold text-xl">
                        ZM
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-text font-playfair font-bold text-sm tracking-wide">Dr. Zeeshan Malik</div>
                    <div className="text-vis font-mono text-xs uppercase tracking-wider mt-1">Senior AI Scientist</div>
                </div>
            </motion.div>

            {/* Decorative Wave */}
            <div className="absolute bottom-24 flex gap-1 h-12 items-end opacity-50">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-t rounded-full"
                        animate={{ height: [8, 48, 8], opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

        </div>
    );
}
