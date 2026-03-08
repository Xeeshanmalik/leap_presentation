import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SlideTransformerArchitecture({ isExportMode }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || isExportMode) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let t = 0;
        let rafId;

        const NODES = Array.from({ length: 22 }, (_, i) => ({
            x: 0.05 + (i % 7) * 0.14 + (Math.floor(i / 7) % 2) * 0.07,
            y: 0.15 + Math.floor(i / 7) * 0.35,
            phase: i * 1.3,
        }));

        const EDGES = [];
        for (let a = 0; a < NODES.length; a++) {
            for (let b = a + 1; b < NODES.length; b++) {
                if (Math.random() < 0.15) EDGES.push({ a, b, phase: Math.random() * Math.PI * 2 });
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
            t += 0.01;

            EDGES.forEach(e => {
                const na = NODES[e.a], nb = NODES[e.b];
                const alpha = 0.04 + 0.08 * Math.abs(Math.sin(t + e.phase));
                ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(na.x * W, na.y * H);
                ctx.lineTo(nb.x * W, nb.y * H);
                ctx.stroke();
            });

            NODES.forEach(n => {
                const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + n.phase);
                const r = 3 + pulse * 2.5;
                ctx.beginPath();
                ctx.arc(n.x * W, n.y * H, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52,211,153,${0.2 + 0.4 * pulse})`;
                ctx.fill();
            });

            ctx.restore();
            rafId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(rafId);
    }, [isExportMode]);

    return (
        <div className="relative flex flex-col items-center justify-center h-full font-outfit text-text overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.5 }}
            />

            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 text-center"
            >
                <h2 className="font-playfair font-bold text-7xl leading-tight text-white">
                    Transformer architecture
                </h2>
            </motion.div>
        </div>
    );
}
