import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

export default function SlideStart() {
    const url = window.location.href.split('/presenter')[0]; // Current host

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 text-white relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black animate-spin-slow" />
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="z-10 flex flex-col items-center"
            >
                <h1 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    LEAP 2026
                </h1>
                <h2 className="text-2xl font-light text-gray-300 mb-12">
                    The Future of Time Series & Agents
                </h2>

                <div className="p-4 bg-white rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                    <QRCodeSVG value={url} size={256} />
                </div>

                <p className="mt-8 text-xl font-mono text-blue-300 animate-pulse">
                    Scan to Join Interactive Session
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    {url}
                </p>
            </motion.div>
        </div>
    );
}
