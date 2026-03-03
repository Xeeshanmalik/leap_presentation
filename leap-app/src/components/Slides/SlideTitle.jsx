import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const APP_BASE = import.meta.env.VITE_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");
const QUIZ_URL = `${APP_BASE}/quiz`;

export default function SlideTitle() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center relative z-10">

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-teal text-teal px-6 py-2 rounded-full font-mono text-xs tracking-[4px] uppercase mb-12 shadow-[0_0_15px_rgba(0,212,255,0.3)] bg-navy/50 backdrop-blur-md"
            >
                LEAP Conference 2026 · Riyadh
            </motion.div>

            {/* Main Title */}
            <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-syne font-extrabold text-[clamp(3rem,6vw,5.5rem)] leading-[1.1] mb-8 text-white drop-shadow-[0_0_40px_rgba(0,212,255,0.3)]"
            >
                Large Time Series<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-white">Transformer</span> Modeling
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[clamp(1.2rem,2vw,1.5rem)] text-muted font-light mb-16 tracking-wide"
            >
                Beyond Forecasting: The Foundation Model Era
            </motion.p>

            {/* Presenter Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6 bg-white/5 border border-white/10 pr-8 pl-2 py-2 rounded-full backdrop-blur-md"
            >
                <div className="w-12 h-12 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-teal flex items-center justify-center text-navy font-bold text-xl">
                        ZM
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-white font-syne font-bold text-sm">Dr. Zeeshan Malik</div>
                    <div className="text-gold font-mono text-xs uppercase tracking-wider">Sr. AI Lead Data Scientist</div>
                </div>
            </motion.div>

            {/* Decorative Wave */}
            <div className="absolute bottom-24 flex gap-1 h-12 items-end opacity-50">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-teal rounded-full"
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

            {/* ── QR Code Join Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{
                    position: "absolute",
                    bottom: 28,
                    right: 32,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.25)",
                    padding: "12px 18px 12px 14px",
                    backdropFilter: "blur(8px)",
                }}
            >
                {/* QR code */}
                <div style={{ background: "#fff", padding: 6, borderRadius: 4, flexShrink: 0 }}>
                    <QRCodeSVG
                        value={QUIZ_URL}
                        size={72}
                        bgColor="#ffffff"
                        fgColor="#020d1a"
                        level="M"
                    />
                </div>
                {/* Text */}
                <div style={{ textAlign: "left" }}>
                    <div className="font-mono text-xs tracking-widest mb-1" style={{ color: "#00d4ff" }}>
                        ▸ JOIN THE Q&amp;A
                    </div>
                    <div className="font-syne font-bold text-sm" style={{ color: "#fff" }}>
                        Scan to participate
                    </div>
                    <div className="font-mono text-xs mt-1" style={{ color: "#64748b", wordBreak: "break-all" }}>
                        {QUIZ_URL}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
