import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Truck, HeartPulse, CircleDollarSign, Ghost } from 'lucide-react';

const SILOS = [
    { id: 1, icon: <Database />, name: 'Manufacturing', task: 'Equipment Failure', models: '23 models', retrain: 'Every 6 weeks', accuracy: '71%', drift: 'Season change destroys accuracy. Needs full retrain.', color: 'text-rose-400', border: 'border-rose-500/30' },
    { id: 2, icon: <Zap />, name: 'Energy', task: 'Load Forecasting', models: '18 models', retrain: 'Monthly', accuracy: '68%', drift: 'Cold snap → model fails. 6-month cold start for new substations.', color: 'text-amber-400', border: 'border-amber-500/30' },
    { id: 3, icon: <Truck />, name: 'Supply Chain', task: 'Demand Sensing', models: '41 models', retrain: 'Every 4 weeks', accuracy: '65%', drift: 'New SKU = new model from scratch. Promotional spikes break it.', color: 'text-rose-400', border: 'border-rose-500/30' },
    { id: 4, icon: <HeartPulse />, name: 'Healthcare', task: 'Patient Risk', models: '12 models', retrain: 'Quarterly', accuracy: '73%', drift: 'Blind to post-COVID patterns. New devices need new models.', color: 'text-amber-400', border: 'border-amber-500/30' },
    { id: 5, icon: <CircleDollarSign />, name: 'Finance', task: 'Fraud Detection', models: '35 models', retrain: 'Weekly', accuracy: '69%', drift: 'Market regime change causes silent failures. Emergency retrains.', color: 'text-rose-400', border: 'border-rose-500/30' }
];

export default function SlideExecutiveProblem({ isExportMode }) {
    const driftCanvasRef = useRef(null);
    const [activeSilo, setActiveSilo] = useState(null);

    // Drift Canvas Animation
    useEffect(() => {
        if (!driftCanvasRef.current || isExportMode) return;
        const canvas = driftCanvasRef.current;
        const ctx = canvas.getContext('2d');
        let driftT = 0;
        let animationFrameId;

        const MODELS = [
            { name: 'Energy Load Model', color: '#f59e0b', driftAt: 0.38 },
            { name: 'Demand Forecasting', color: '#e03e3e', driftAt: 0.52 },
            { name: 'Equipment Health', color: '#3b82f6', driftAt: 0.44 },
        ];

        const render = () => {
            const styleWidth = canvas.clientWidth || 1200;
            const styleHeight = canvas.clientHeight || 400;
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

            driftT += 0.008;
            const t = (driftT % 1);
            const pad = { l: 80, r: 200, t: 24, b: 32 };
            const pw = W - pad.l - pad.r;
            const ph = H - pad.t - pad.b;

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
            [0.25, 0.5, 0.75, 1.0].forEach(f => {
                const y = pad.t + (1 - f) * ph;
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + pw, y); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '14px "Outfit", sans-serif'; ctx.textAlign = 'right';
                ctx.fillText(Math.round(f * 100) + '%', pad.l - 10, y + 5);
            });
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '16px "Outfit", sans-serif'; ctx.textAlign = 'right';
            ctx.fillText('Accuracy', pad.l - 10, pad.t - 8);

            // Regime change banner
            const rcX = pad.l + 0.38 * pw;
            const rcW = pw * 0.18;
            ctx.fillStyle = 'rgba(245,158,11,0.07)';
            ctx.fillRect(rcX, pad.t, rcW, ph);
            ctx.strokeStyle = 'rgba(245,158,11,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(rcX, pad.t); ctx.lineTo(rcX, pad.t + ph); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(245,158,11,0.7)'; ctx.font = 'bold 16px "Outfit", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('REGIME CHANGE', rcX + rcW / 2, pad.t + 16);
            ctx.font = '14px "Outfit", sans-serif'; ctx.fillText('(season / supplier shift)', rcX + rcW / 2, pad.t + 36);

            // Model lines
            MODELS.forEach((m, mi) => {
                ctx.strokeStyle = m.color; ctx.lineWidth = 2.2; ctx.beginPath();
                let first = true;
                for (let x = 0; x <= pw; x += 2) {
                    const frac = x / pw;
                    const noise = (Math.sin(frac * 40 + mi * 7 + driftT * 2) * 0.025 + Math.sin(frac * 13 + mi * 3) * 0.015);
                    let acc;
                    if (frac < m.driftAt) {
                        acc = 0.78 - mi * 0.04 + noise;
                    } else {
                        const drop = Math.min((frac - m.driftAt) * 1.8, 0.35);
                        acc = 0.78 - mi * 0.04 - drop + noise * 0.5;
                    }
                    acc = Math.max(0.28, Math.min(0.92, acc));
                    const px = pad.l + x;
                    const py = pad.t + (1 - acc) * ph;
                    first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                    first = false;
                }
                ctx.stroke();
                // label at end
                const endFrac = 0.99;
                const endAcc = Math.max(0.28, 0.78 - mi * 0.04 - 0.35);
                ctx.fillStyle = m.color; ctx.font = 'bold 16px "Outfit", sans-serif'; ctx.textAlign = 'left';
                ctx.fillText(m.name, pad.l + endFrac * pw - 200, pad.t + (1 - endAcc) * ph - 8 - mi * 20);
            });

            // LTSM line (stable)
            ctx.strokeStyle = '#00c896'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
            ctx.beginPath();
            for (let x = 0; x <= pw; x += 2) {
                const frac = x / pw;
                const acc = 0.91 + Math.sin(frac * 20 + driftT * 1.5) * 0.012;
                const px = pad.l + x; const py = pad.t + (1 - acc) * ph;
                x === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.fillStyle = '#00c896'; ctx.font = 'bold 16px "Outfit", sans-serif'; ctx.textAlign = 'left';
            ctx.fillText('✦ LTSM — stable across regimes', pad.l + pw * 0.4, pad.t + (1 - 0.91) * ph - 12);

            // Traveling cursor line
            if (t < 0.95) {
                const cx2 = pad.l + t * pw;
                ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(cx2, pad.t); ctx.lineTo(cx2, pad.t + ph); ctx.stroke();
            }

            // X axis
            ['Start', 'Q1', 'Q2', 'Q3 (Shift)', 'Q4', 'Now'].forEach((l, i, a) => {
                const x = pad.l + (i / (a.length - 1)) * pw;
                ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '14px "Outfit", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(l, x, pad.t + ph + 24);
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [isExportMode]);

    return (
        <div className="flex flex-col h-full max-w-[1400px] mx-auto px-8 py-4 relative z-10 font-outfit text-text">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-mono text-xs tracking-[3px] uppercase mb-2 opacity-80">
                // 04 — The Fragmentation Crisis
            </motion.div>

            <motion.h2
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-playfair font-bold text-4xl mb-4 leading-tight"
            >
                Why Traditional AI Is Costing Millions —<br />
                <span className="text-red-400">The Problem of Fragmented ML</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 h-auto lg:h-[220px]">
                {SILOS.map((silo, i) => (
                    <motion.div
                        key={silo.id}
                        initial={isExportMode ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: activeSilo === silo.id ? 1.05 : 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setActiveSilo(activeSilo === silo.id ? null : silo.id)}
                        className={`bg-card border ${activeSilo === silo.id ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-border hover:border-red-500/50'} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col`}
                    >
                        <div className="p-4 border-b border-border flex flex-col items-center justify-center text-center bg-surface/50">
                            <div className={`${silo.color} mb-2 scale-125`}>{silo.icon}</div>
                            <div className="font-mono text-[11px] tracking-widest uppercase text-muted mb-1">{silo.name}</div>
                            <div className="text-sm font-semibold whitespace-nowrap">{silo.task}</div>
                        </div>
                        <div className="p-4 flex-grow relative">
                            <AnimatePresence mode="wait">
                                {activeSilo === silo.id ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="h-full flex flex-col justify-center text-sm leading-relaxed text-red-300 bg-red-500/10 p-2 rounded border border-red-500/20"
                                    >
                                        <Ghost className="w-4 h-4 mb-2 opacity-50 inline-block mr-2" />
                                        {silo.drift}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="stats"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between text-[11px] mb-2"><span className="text-muted">Models</span><span className="font-mono text-red-400">{silo.models}</span></div>
                                        <div className="flex justify-between text-[11px] mb-2"><span className="text-muted">Retrain</span><span className="font-mono text-amber-400">{silo.retrain}</span></div>
                                        <div className="flex justify-between text-[11px]"><span className="text-muted">Accuracy</span><span className="font-mono text-emerald-400">{silo.accuracy}</span></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border rounded-xl p-6 relative overflow-hidden flex-grow flex flex-col"
            >
                <div className="font-mono text-xs tracking-widest text-red-500 mb-2 uppercase shrink-0">
                    ✦ Live Simulation: Accuracy Collapse Under Real-World Conditions (Distribution Drift)
                </div>
                {/* Canvas container stretches to fill remaining height */}
                <div className="w-full relative flex-grow min-h-0 bg-bg/50 rounded-lg border border-border/50">
                    <canvas
                        ref={driftCanvasRef}
                        className="absolute inset-0 w-full h-full rounded-lg"
                        style={{ touchAction: 'none' }}
                    />
                </div>
                <div className="text-sm text-muted mt-4 font-outfit italic text-center shrink-0">
                    Traditional models are calibrated on historical data. When conditions shift (season change, supply disruption), accuracy collapses silently.
                </div>
            </motion.div>
        </div>
    );
}
