import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const COMING_UP = [
    { num: '07', title: 'Attention Mechanism', desc: 'How the model learns to focus on what matters most across thousands of time steps.' },
    { num: '08', title: 'Positional Encoding', desc: 'Injecting the concept of time and order into a model that naturally ignores sequence.' },
    { num: '09', title: 'Multi-Head Attention', desc: 'Running multiple attention patterns in parallel to capture diverse physical relationships.' },
    { num: '10', title: 'Encoder & Decoder', desc: 'The full Transformer pipeline from raw sensor input to high-confidence prediction.' },
];

export default function SlideTransformerSection({ isExportMode }) {
    const canvasRef = useRef(null);

    // Animated attention-head network background
    useEffect(() => {
        if (!canvasRef.current || isExportMode) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let t = 0;
        let rafId;

        const NODES = Array.from({ length: 18 }, (_, i) => ({
            x: 0.05 + (i % 6) * 0.18 + (Math.floor(i / 6) % 2) * 0.09,
            y: 0.2 + Math.floor(i / 6) * 0.3,
            phase: i * 1.1,
        }));

        const EDGES = [];
        for (let a = 0; a < NODES.length; a++) {
            for (let b = a + 1; b < NODES.length; b++) {
                if (Math.random() < 0.18) EDGES.push({ a, b, phase: Math.random() * Math.PI * 2 });
            }
        }

        const render = () => {
            const W = canvas.clientWidth;
            const H = canvas.clientHeight;
            const dpr = window.devicePixelRatio || 2;
            if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
                canvas.width = W * dpr;
                canvas.height = H * dpr;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);

            t += 0.012;

            // Edges
            EDGES.forEach(e => {
                const na = NODES[e.a], nb = NODES[e.b];
                const alpha = 0.06 + 0.10 * Math.abs(Math.sin(t + e.phase));
                const grad = ctx.createLinearGradient(na.x * W, na.y * H, nb.x * W, nb.y * H);
                grad.addColorStop(0, `rgba(52,211,153,${alpha})`);
                grad.addColorStop(1, `rgba(56,189,248,${alpha})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(na.x * W, na.y * H);
                ctx.lineTo(nb.x * W, nb.y * H);
                ctx.stroke();
            });

            // Nodes
            NODES.forEach(n => {
                const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + n.phase);
                const r = 4 + pulse * 3;
                const alpha = 0.3 + 0.5 * pulse;
                ctx.beginPath();
                ctx.arc(n.x * W, n.y * H, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52,211,153,${alpha})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(n.x * W, n.y * H, r + 5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(52,211,153,${alpha * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            ctx.restore();
            rafId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(rafId);
    }, [isExportMode]);

    return (
        <div className="relative flex flex-col h-full max-w-[1400px] mx-auto px-8 py-6 font-outfit text-text overflow-hidden">
            {/* Animated canvas background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.6 }}
            />

            {/* Top label */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex items-center gap-3 mb-6"
            >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/40" />
                <span className="font-mono text-xs tracking-[4px] uppercase text-emerald-400">
                    Section 02 — Deep Dive
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/40" />
            </motion.div>

            {/* Main hero text */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative z-10 text-center mb-8"
            >
                <p className="font-mono text-emerald-400 text-sm tracking-widest uppercase mb-3">Coming Up Next</p>
                <h2 className="font-playfair font-bold text-5xl leading-tight mb-4">
                    Transformer<br />
                    <span className="text-emerald-400">Architecture</span>
                </h2>
                <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
                    The engine behind every modern foundation model. We'll unpack how raw sensor streams
                    become deep contextual understanding — step by step.
                </p>
            </motion.div>

            {/* Coming up cards */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 flex-grow">
                {COMING_UP.map((item, i) => (
                    <motion.div
                        key={item.num}
                        initial={isExportMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        className="bg-card/80 backdrop-blur border border-border hover:border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2 transition-colors group"
                    >
                        <div className="font-mono text-[10px] tracking-[3px] text-emerald-500/60 uppercase">
                            Slide {item.num}
                        </div>
                        <h3 className="font-playfair font-bold text-base text-emerald-300 group-hover:text-emerald-200 transition-colors leading-snug">
                            {item.title}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed flex-grow">
                            {item.desc}
                        </p>
                        <div className="mt-auto pt-2 border-t border-border/50">
                            <div className="h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent rounded-full w-0 group-hover:w-full transition-all duration-500" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom prompt */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative z-10 text-center mt-4"
            >
                <p className="font-mono text-xs text-muted/50 tracking-widest uppercase">
                    ↓ &nbsp; advance to continue
                </p>
            </motion.div>
        </div>
    );
}
