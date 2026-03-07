import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const COMPARISON = [
    { old: 'One model per task — 200+ models to manage', new: 'One foundation model handles every task across the enterprise' },
    { old: 'Cannot generalize to new sensors, assets, or domains', new: 'Zero-shot transfer: apply to new assets with zero historical data' },
    { old: 'Silent accuracy collapse when conditions change', new: 'Drift-resilient: stays accurate across global distributions' },
    { old: '6–18 month cold start for new assets or facilities', new: 'Instant predictions from day one — no history needed' },
    { old: '70–80% of ML budget consumed by maintenance', new: '90% reduction in maintenance cost — focus on innovation' }
];

const ROI = [
    { domain: 'Drilling & Upstream', old: '71% (collapses after formation change)', ltsm: '91% (stable across diverse geology)', imp: '+28%', val: '$14.2M' },
    { domain: 'Midstream Flow', old: '68% (fails on unexpected pressure drops)', ltsm: '93% (detects leaks physically faster)', imp: '+37%', val: '$16.8M' },
    { domain: 'Refining Operations', old: '65% (6-month cold start for new blend)', ltsm: '88% (zero cold start modeling)', imp: '+35%', val: '$19.1M' },
    { facility: 'Supply & Logistics', old: '73% (breaks with new dispatch routes)', ltsm: '92% (generalizes routing instantly)', imp: '+26%', val: '$8.5M' },
    { domain: 'Energy Trading', old: '69% (high false positive volatility)', ltsm: '94% (73% fewer false positives)', imp: '+36%', val: '$15.7M' }
];

export default function SlideExecutiveCompare({ isExportMode }) {
    const radarRef = useRef(null);

    // Radar Canvas Animation
    useEffect(() => {
        if (!radarRef.current || isExportMode) return;
        const canvas = radarRef.current;
        const ctx = canvas.getContext('2d');

        const render = () => {
            const styleWidth = canvas.clientWidth || 800;
            const styleHeight = canvas.clientHeight || 500;
            const dpr = window.devicePixelRatio || 2;

            if (canvas.width !== styleWidth * dpr || canvas.height !== styleHeight * dpr) {
                canvas.width = styleWidth * dpr;
                canvas.height = styleHeight * dpr;
            }

            const W = styleWidth;
            const H = styleHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);

            const cx = W / 2;
            const cy = H / 2 + 10;
            const R = Math.min(W, H) * 0.30; // Shrink radius slightly to leave room for larger labels

            const axes = ['Generalization', 'Cold Start', 'Drift Resistance', 'Cross-Domain', 'Maintainability', 'Explainability', 'Accuracy', 'Scalability'];
            const N = axes.length;
            const oldScores = [0.15, 0.12, 0.2, 0.1, 0.18, 0.25, 0.65, 0.22];
            const newScores = [0.93, 0.95, 0.91, 0.88, 0.94, 0.87, 0.92, 0.97];

            const getPoint = (i, score) => {
                const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
                return { x: cx + Math.cos(angle) * R * score, y: cy + Math.sin(angle) * R * score };
            };

            // Grid rings
            [0.25, 0.5, 0.75, 1.0].forEach(r => {
                ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 0; i < N; i++) {
                    const p = getPoint(i, r);
                    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                }
                ctx.closePath(); ctx.stroke();
                if (r < 1) {
                    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.font = '14px "Outfit", sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText(Math.round(r * 100) + '%', cx + 4, cy - R * r + 5);
                }
            });

            // Axis lines + labels
            axes.forEach((ax, i) => {
                const p = getPoint(i, 1);
                ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();

                const lp = getPoint(i, 1.28); // Push labels further out
                ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = 'bold 16px "Outfit", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(ax, lp.x, lp.y);
            });

            // Old polygon
            ctx.fillStyle = 'rgba(220,38,38,0.15)'; ctx.strokeStyle = 'rgba(239,68,68,0.8)'; ctx.lineWidth = 2;
            ctx.beginPath();
            oldScores.forEach((s, i) => { const p = getPoint(i, s); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
            ctx.closePath(); ctx.fill(); ctx.stroke();

            // New polygon
            ctx.fillStyle = 'rgba(16,185,129,0.15)'; ctx.strokeStyle = 'rgba(52,211,153,0.8)'; ctx.lineWidth = 2.5;
            ctx.beginPath();
            newScores.forEach((s, i) => { const p = getPoint(i, s); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
            ctx.closePath(); ctx.fill(); ctx.stroke();

            // Dots
            oldScores.forEach((s, i) => { const p = getPoint(i, s); ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); });
            newScores.forEach((s, i) => { const p = getPoint(i, s); ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill(); });

            // Legend
            [{ c: '#ef4444', l: 'Traditional ML' }, { c: '#34d399', l: 'Large Time Series Model (LTSM)' }].forEach((item, i) => {
                const lx = cx - 250 + i * 300; const ly = H - 30;
                ctx.fillStyle = item.c; ctx.fillRect(lx, ly - 8, 20, 16);
                ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '16px "Outfit", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(item.l, lx + 30, ly);
            });

            ctx.restore();

        };
        // Render initially, then bind to resize observer because radar is static
        render();

        const ro = new ResizeObserver(() => {
            render();
        });
        if (canvas.parentElement) {
            ro.observe(canvas.parentElement);
        }

        return () => ro.disconnect();
    }, [isExportMode]);

    return (
        <div className="flex flex-col h-full max-w-[1400px] mx-auto px-8 py-2 relative z-10 font-outfit text-text">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 font-mono text-xs tracking-[3px] uppercase mb-1 opacity-80">
                // 06 — Executive Summary
            </motion.div>

            <motion.h2
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-playfair font-bold text-3xl mb-2 leading-tight"
            >
                Side-by-Side Validation: <br />
                <span className="text-emerald-400 border-b-2 border-emerald-500/50 pb-1">Traditional ML vs. LTSM</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2 flex-grow min-h-0">
                {/* Comparison Lists */}
                <motion.div
                    initial={isExportMode ? { opacity: 1 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-2 min-h-0"
                >
                    <div className="font-mono text-xs tracking-widest text-muted uppercase mb-2">Capabilities</div>
                    <div className="flex-grow flex flex-col gap-3">
                        {COMPARISON.map((row, i) => (
                            <div key={i} className="flex flex-col border border-border/50 rounded-lg overflow-hidden flex-grow bg-card transition-all hover:bg-surface hover:border-emerald-500/30 group">
                                <div className="flex items-center gap-3 p-2 text-sm text-muted border-b border-border/50">
                                    <XCircle size={16} className="text-red-400/70 shrink-0" />
                                    <span className="line-clamp-2 md:line-clamp-1">{row.old}</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 text-sm md:text-base text-emerald-100 bg-emerald-950/20 shadow-inner flex-grow">
                                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">{row.new}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Radar Chart */}
                <motion.div
                    initial={isExportMode ? { opacity: 1 } : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-xl p-3 shadow-xl flex flex-col h-full overflow-hidden min-h-0"
                >
                    <div className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase mb-1 text-center shrink-0">Capability Radar</div>
                    <div className="w-full relative flex-grow min-h-0 bg-bg/50 rounded-lg overflow-hidden border border-border/40">
                        <canvas
                            ref={radarRef}
                            className="absolute inset-0 w-full h-full"
                            style={{ touchAction: 'none' }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* ROI Table */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-xl"
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface border-b border-border">
                            <th className="p-1 font-mono text-[10px] tracking-widest uppercase text-muted">Business Domain</th>
                            <th className="p-1 font-mono text-[10px] tracking-widest uppercase text-muted">Traditional ML Result</th>
                            <th className="p-1 font-mono text-[10px] tracking-widest uppercase text-emerald-400">LTSM Result</th>
                            <th className="p-1 font-mono text-[10px] tracking-widest uppercase text-center text-muted">Improvement</th>
                            <th className="p-1 font-mono text-[10px] tracking-widest uppercase text-center text-amber-500">New Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {ROI.map((row, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors last:border-0">
                                <td className="p-1.5 font-semibold text-sm">{row.domain || row.facility}</td>
                                <td className="p-1.5 text-xs text-muted leading-tight">{row.old}</td>
                                <td className="p-1.5 text-xs text-emerald-300 font-medium leading-tight">{row.ltsm}</td>
                                <td className="p-1.5 text-center">
                                    <span className="inline-block bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">{row.imp}</span>
                                </td>
                                <td className="p-1.5 text-center">
                                    <span className="inline-block bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">{row.val}/yr</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
}
