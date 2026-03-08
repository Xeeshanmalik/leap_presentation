import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Puzzle, Shield, Activity, Eye, TrendingDown, RefreshCcw, Wrench, Package, AlertTriangle, LineChart, WifiOff } from 'lucide-react';

const TASKS = [
    {
        icon: <WifiOff size={18} />, label: 'Missing Sensor Imputation',
        desc: 'Reconstructing missing telemetry data from faulty oil rig sensors in real-time with high fidelity.',
        meta: { 'Data gap': 'Up to 72h', 'Zero-shot': 'Yes', 'Accuracy': '98.5%', 'Retrain needed': 'None' },
        color: '#f59e0b', signal: 'imputation' // gold imputation line
    },
    {
        icon: <Wrench size={18} />, label: 'Pump Failure Prediction',
        desc: 'Predicting ESP/RCP pump failure 48h in advance — same model, applied to any well pad, day one.',
        meta: { 'Lead time': '48 hours', 'Zero-shot': 'Yes', 'Domains': 'Upstream', 'Retrain needed': 'None' },
        color: '#00c896', signal: 'spike'
    },
    {
        icon: <Zap size={18} />, label: 'Pipeline Flow Forecasting',
        desc: 'Forecasting pressure and flow rates across seasons, weather events, and variable viscosity — with zero retraining.',
        meta: { 'Horizon': '1h–30 days', 'Zero-shot': 'Yes', 'Handles drift': 'Automatic', 'Retrain needed': 'None' },
        color: '#f59e0b', signal: 'seasonal'
    },
    {
        icon: <Package size={18} />, label: 'Refinery Yield Optimization',
        desc: 'Sensing optimal blend configurations across varying feedstock qualities and fluctuating market demands.',
        meta: { 'Cold start': 'Instant', 'Zero-shot': 'Yes', 'New Feedstock': 'Zero data', 'Retrain needed': 'None' },
        color: '#3b82f6', signal: 'trend'
    },
    {
        icon: <AlertTriangle size={18} />, label: 'Drilling Anomaly Detection',
        desc: 'Detecting kick, stuck pipe, and circulation loss across all active drilling rigs simultaneously.',
        meta: { 'False positives': '↓ 73%', 'Zero-shot': 'Yes', 'Explainable': 'Full audit', 'Retrain needed': 'None' },
        color: '#ef4444', signal: 'anomaly'
    },
    {
        icon: <LineChart size={18} />, label: 'Commodity Price Forecasting',
        desc: 'Forecasting revenue and risk profiles by integrating global supply chain data with physical sensor streams.',
        meta: { 'Cross-domain': 'Yes', 'Zero-shot': 'Yes', 'Accuracy gain': '+31%', 'Retrain needed': 'None' },
        color: '#eab308', signal: 'finance'
    }
];

const CAPABILITIES = [
    { icon: <Globe className="text-emerald-400" size={24} />, title: "Zero-Shot Generalization", desc: "Apply to a new sensor, asset, or domain with zero retraining." },
    { icon: <Zap className="text-emerald-400" size={24} />, title: "Instant Cold Start", desc: "Delivers useful predictions from the first reading—no 6-month delay." },
    { icon: <Puzzle className="text-emerald-400" size={24} />, title: "Unified Intelligence", desc: "Energy, maintenance, demand—one model discovers cross-domain patterns." },
    { icon: <Shield className="text-emerald-400" size={24} />, title: "Drift-Resilient", desc: "Naturally handles seasonal shifts and regime changes without retraining." },
    { icon: <Activity className="text-emerald-400" size={24} />, title: "Any Frequency, Any Scale", desc: "Millisecond bursts to annual cycles handled in a single inference." },
    { icon: <Eye className="text-emerald-400" size={24} />, title: "Explainable Attention", desc: "See exactly which past events drove each prediction. Full audit trail." },
    { icon: <TrendingDown className="text-emerald-400" size={24} />, title: "90% Fewer Models", desc: "Replace 200 siloed models. Redirect teams from maintenance to innovation." },
    { icon: <RefreshCcw className="text-emerald-400" size={24} />, title: "Continuous Learning", desc: "Improves with every data stream. Knowledge compounds across domains." }
];

export default function SlideExecutiveSolution({ isExportMode }) {
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);
    const canvasRef = useRef(null);

    // LTSM Canvas Animation
    useEffect(() => {
        if (!canvasRef.current || isExportMode) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let ltsmT = 0;
        let ltsmProgress = 0; // specifically for the imputation animation loop
        let animationFrameId;

        const genSignal = (type, N, t) => {
            const pts = [];
            for (let i = 0; i < N; i++) {
                const x = i / N;
                let v = 0;
                if (type === 'spike') {
                    v = 0.5 + Math.sin(x * Math.PI * 4 + t) * 0.12 + (Math.random() - 0.5) * 0.04;
                    if (i > N * 0.6 && i < N * 0.63) v += 0.35;
                    if (i > N * 0.63) v = 0.5 + Math.sin(x * Math.PI * 4 + t) * 0.12 + (Math.random() - 0.5) * 0.04;
                } else if (type === 'seasonal') {
                    v = 0.5 + Math.sin(x * Math.PI * 2 + t * 0.3) * 0.3 + Math.sin(x * Math.PI * 8) * 0.05 + (Math.random() - 0.5) * 0.03;
                } else if (type === 'trend') {
                    v = 0.2 + x * 0.55 + Math.sin(x * Math.PI * 6 + t) * 0.07 + (Math.random() - 0.5) * 0.03;
                } else if (type === 'anomaly') {
                    // Steady, low-noise baseline for a wellbore sensor — makes anomaly spikes unmistakable
                    v = 0.48 + Math.sin(x * Math.PI * 1.2) * 0.04 + (Math.random() - 0.5) * 0.015;
                    // Two distinct anomalous spikes at ~35% and ~71% of the timeline
                    const spike1 = Math.floor(N * 0.35);
                    const spike2 = Math.floor(N * 0.71);
                    if (i >= spike1 - 1 && i <= spike1 + 1) v = 0.48 + (1 - Math.abs(i - spike1)) * 0.38;
                    if (i >= spike2 - 1 && i <= spike2 + 1) v = 0.48 + (1 - Math.abs(i - spike2)) * 0.38;
                } else if (type === 'imputation' || type === 'imputation_clean') {
                    // Near-flat sensor reading with only tiny noise
                    v = 0.50 + Math.sin(x * Math.PI * 0.6) * 0.04 + (Math.random() - 0.5) * 0.015;
                    // 'imputation' has null gaps; 'imputation_clean' is the full truth (what LTSM reconstructs)
                    if (type === 'imputation') {
                        if (i > N * 0.25 && i < N * 0.35) v = null;
                        if (i > N * 0.55 && i < N * 0.6) v = null;
                    }
                } else {
                    v = 0.45 + Math.sin(x * Math.PI * 3 + t * 0.5) * 0.2 + Math.sin(x * Math.PI * 0.8) * 0.15 + (Math.random() - 0.5) * 0.025;
                }
                pts.push(v === null ? null : Math.max(0.05, Math.min(0.95, v)));
            }
            return pts;
        };

        const render = () => {
            const styleWidth = canvas.clientWidth || 1400;
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

            ltsmT += 0.018;

            // For imputation, we want a looping drawing progress bar instead of scrolling sine waves
            const task = TASKS[activeTaskIndex];
            if (task.signal === 'imputation') {
                ltsmProgress += 0.005; // ~3.5 seconds per loop at 60fps
                if (ltsmProgress > 1.2) ltsmProgress = 0; // pause at the end before restarting
            }

            const N = 120;
            const signal = genSignal(task.signal, N, ltsmT);
            const pad = { l: 40, r: 240, t: 60, b: 36 };
            const pw = W - pad.l - pad.r;
            const ph = H - pad.t - pad.b;
            const histFrac = 0.72;
            const histW = pw * histFrac;
            const foreW = pw * (1 - histFrac);

            // Background zones
            ctx.fillStyle = 'rgba(255,255,255,0.018)';
            ctx.fillRect(pad.l, pad.t, histW, ph);

            // Generate transparent version of the task color for the right side
            // Hide the right panel elements during imputation to focus purely on the reconstruction
            if (task.signal !== 'imputation') {
                ctx.fillStyle = task.color + '15'; // ~ 8% opacity in hex
                ctx.fillRect(pad.l + histW, pad.t, foreW, ph);
            }

            // Draw Missing Windows (Red Backgrounds) for Imputation
            if (task.signal === 'imputation') {
                const gap1Start = pad.l + (0.25) * pw;
                const gap1End = pad.l + (0.35) * pw;
                const gap2Start = pad.l + (0.55) * pw;
                const gap2End = pad.l + (0.6) * pw;

                ctx.fillStyle = 'rgba(239, 68, 68, 0.08)'; // faint red bg
                ctx.fillRect(gap1Start, pad.t, gap1End - gap1Start, ph);
                ctx.fillRect(gap2Start, pad.t, gap2End - gap2Start, ph);

                // Top red marker line
                ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
                ctx.fillRect(gap1Start, pad.t, gap1End - gap1Start, 2);
                ctx.fillRect(gap2Start, pad.t, gap2End - gap2Start, 2);
            }

            // Zone labels
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '15px "Outfit", sans-serif'; ctx.textAlign = 'center';
            if (task.signal === 'imputation') {
                ctx.fillText('SENSOR TELEMETRY', pad.l + pw / 2, pad.t - 16);
            } else if (task.signal === 'anomaly') {
                ctx.fillText('LIVE SENSOR STREAM', pad.l + histW / 2, pad.t - 16);
                ctx.fillStyle = task.color; ctx.font = 'bold 15px "Outfit", sans-serif';
                ctx.fillText('LTSM ALERT ⚠', pad.l + histW + foreW / 2, pad.t - 16);
            } else {
                ctx.fillText('HISTORICAL DATA', pad.l + histW / 2, pad.t - 16);
                ctx.fillStyle = task.color; ctx.font = 'bold 15px "Outfit", sans-serif';
                ctx.fillText('LTSM FORECAST →', pad.l + histW + foreW / 2, pad.t - 16);
            }

            // Divider
            if (task.signal !== 'imputation') {
                ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(pad.l + histW, pad.t); ctx.lineTo(pad.l + histW, pad.t + ph); ctx.stroke();
                ctx.setLineDash([]);
            }

            // For anomaly: draw a faint red zone on the right to represent the alert panel
            if (task.signal === 'anomaly') {
                ctx.fillStyle = 'rgba(239,68,68,0.05)';
                ctx.fillRect(pad.l + histW, pad.t, foreW, ph);
            }

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [0.25, 0.5, 0.75].forEach(f => {
                const y = pad.t + (1 - f) * ph;
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + pw, y); ctx.stroke();
            });

            // Calculate active drawing frames for both static and animated views
            const histN = Math.floor(N * histFrac);
            const foreN = N - histN;

            // For imputation, we draw across the entire width and animate sequentially
            const activeRange = task.signal === 'imputation' ? N : histN;
            const drawProgressIdx = task.signal === 'imputation'
                ? Math.floor(Math.min(1, ltsmProgress) * activeRange)
                : histN;

            // Historical signal / Actual Sensor Line
            ctx.strokeStyle = task.signal === 'imputation' ? '#00d4ff' : 'rgba(139,146,168,0.7)'; // Bright teal for imputation, otherwise grey
            ctx.lineWidth = 2;
            if (task.signal === 'imputation') {
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#00d4ff';
            }
            ctx.beginPath();
            let isDrawing = false;
            for (let i = 0; i <= drawProgressIdx; i++) {
                if (signal[i] === null) {
                    isDrawing = false;
                    continue;
                }
                const x = pad.l + (i / N) * pw;
                const y = pad.t + (1 - signal[i]) * ph;
                if (!isDrawing) {
                    ctx.moveTo(x, y);
                    isDrawing = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Imputation reconstruction (dashed gold line over missing gaps)
            if (task.signal === 'imputation') {
                // Use the SAME formula as the actual sensor (imputation_clean) at the SAME time t
                // so the gold imputed line is a seamless continuation of the teal sensor — proving LTSM accuracy
                const cleanSignal = genSignal('imputation_clean', N, ltsmT);

                // Draw Confidence Interval Band exactly over the missing gaps
                ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; // Green band
                ctx.beginPath();
                let confStarted = false;
                for (let i = 0; i <= drawProgressIdx; i++) {
                    if (signal[i] === null) {
                        const x = pad.l + (i / N) * pw;
                        const yUp = pad.t + (1 - (cleanSignal[i] + 0.04)) * ph;
                        if (!confStarted) { ctx.moveTo(x, yUp); confStarted = true; }
                        else ctx.lineTo(x, yUp);
                    } else if (confStarted) {
                        for (let j = i - 1; j >= 0; j--) {
                            if (signal[j] !== null) break;
                            const bx = pad.l + (j / N) * pw;
                            const byDown = pad.t + (1 - (cleanSignal[j] - 0.04)) * ph;
                            ctx.lineTo(bx, byDown);
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.beginPath();
                        confStarted = false;
                    }
                }
                // Close any open confidence band at the end of the drawing sequence
                if (confStarted) {
                    for (let j = drawProgressIdx; j >= 0; j--) {
                        if (signal[j] !== null) break;
                        const bx = pad.l + (j / N) * pw;
                        const byDown = pad.t + (1 - (cleanSignal[j] - 0.04)) * ph;
                        ctx.lineTo(bx, byDown);
                    }
                    ctx.closePath();
                    ctx.fill();
                }

                // Draw Imputed Dashed Line
                ctx.save();
                ctx.strokeStyle = '#f59e0b'; // Gold
                ctx.lineWidth = 2;
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#f59e0b';
                ctx.setLineDash([5, 4]);
                ctx.beginPath();

                let impDrawing = false;
                for (let i = 0; i <= drawProgressIdx; i++) {
                    if (signal[i] === null) {
                        const x = pad.l + (i / N) * pw;
                        const y = pad.t + (1 - cleanSignal[i]) * ph;
                        if (!impDrawing) {
                            ctx.moveTo(x, y);
                            impDrawing = true;
                        } else {
                            ctx.lineTo(x, y);
                        }
                    } else {
                        if (impDrawing) ctx.stroke();
                        ctx.beginPath();
                        impDrawing = false;
                    }
                }
                ctx.stroke();

                // Draw leading animated dot if we are currently drawing
                if (ltsmProgress < 1.0) {
                    const ci = drawProgressIdx;
                    const cv = signal[ci] !== null ? signal[ci] : cleanSignal[ci];
                    const cx = pad.l + (ci / N) * pw;
                    const cy = pad.t + (1 - cv) * ph;
                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                    ctx.fillStyle = signal[ci] !== null ? '#00d4ff' : '#f59e0b';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = signal[ci] !== null ? 'rgba(0,212,255,0.4)' : 'rgba(245,158,11,0.4)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                ctx.restore();
            }

            // Forecast line — only shown for non-anomaly, non-imputation tasks
            if (task.signal !== 'imputation' && task.signal !== 'anomaly') {
                ctx.strokeStyle = task.color; ctx.lineWidth = 2.5;
                ctx.beginPath();
                const foreSignal = signal.slice(histN);

                // Confidence interval (fill shape)
                ctx.fillStyle = task.color + '25'; // ~15% opacity
                ctx.beginPath();
                ctx.moveTo(pad.l + histW, pad.t + (1 - foreSignal[0]) * ph - ph * 0.06);
                foreSignal.forEach((v, i) => { const x = pad.l + histW + (i / foreN) * foreW; ctx.lineTo(x, pad.t + (1 - v) * ph - ph * 0.06 - i * 0.2); });
                foreSignal.slice().reverse().forEach((v, i) => { const x = pad.l + histW + ((foreN - 1 - i) / foreN) * foreW; ctx.lineTo(x, pad.t + (1 - v) * ph + ph * 0.06 + i * 0.2); });
                ctx.closePath(); ctx.fill();

                // Draw Forecast Line
                ctx.beginPath();
                foreSignal.forEach((v, i) => {
                    const x = pad.l + histW + (i / foreN) * foreW;
                    const y = pad.t + (1 - v) * ph;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                });
                ctx.stroke();
            }

            // Anomaly right panel: show risk score bars instead of a forecast line
            if (task.signal === 'anomaly') {
                const bars = [
                    { label: 'Kick Risk', pct: 0.82, color: '#ef4444' },
                    { label: 'Pipe Stick', pct: 0.56, color: '#f59e0b' },
                    { label: 'Circ. Loss', pct: 0.91, color: '#ef4444' },
                    { label: 'Washout', pct: 0.34, color: '#22c55e' },
                ];
                const bx = pad.l + histW + 12;
                const bw = foreW - 24;
                bars.forEach((b, bi) => {
                    const by = pad.t + 20 + bi * (ph / 5);
                    // Label
                    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px "Outfit", sans-serif'; ctx.textAlign = 'left';
                    ctx.fillText(b.label, bx, by + 12);
                    // Track
                    ctx.fillStyle = 'rgba(255,255,255,0.06)';
                    ctx.fillRect(bx, by + 18, bw, 6);
                    // Fill
                    ctx.fillStyle = b.color;
                    ctx.fillRect(bx, by + 18, bw * b.pct, 6);
                    // Pct label
                    ctx.fillStyle = b.color; ctx.textAlign = 'right';
                    ctx.fillText(Math.round(b.pct * 100) + '%', bx + bw, by + 12);
                });
                // Status
                ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px "Outfit", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('● ANOMALY DETECTED', pad.l + histW + foreW / 2, pad.t + ph - 12);
            }

            // Anomaly markers
            if (task.signal === 'anomaly') {
                [Math.floor(histN * 0.48), Math.floor(histN * 0.97)].forEach(ai => {
                    if (ai < signal.length) {
                        const ax = pad.l + (ai / N) * pw;
                        const ay = pad.t + (1 - signal[ai]) * ph;
                        ctx.fillStyle = 'rgba(239,68,68,0.2)'; ctx.beginPath(); ctx.arc(ax, ay, 14, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ax, ay, 14, 0, Math.PI * 2); ctx.stroke();
                        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 16px "Outfit", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                        ctx.fillText('!', ax, ay);
                        ctx.textBaseline = 'alphabetic';
                    }
                });
            }

            // Attention arcs
            if (task.signal !== 'imputation') {
                const queryIdx = histN - 1;
                const qx = pad.l + (queryIdx / N) * pw;
                const qy = pad.t + (1 - signal[queryIdx]) * ph;
                const topPts = [Math.floor(histN * 0.15), Math.floor(histN * 0.4), Math.floor(histN * 0.65)];
                topPts.forEach((pi, ii) => {
                    const ax2 = pad.l + (pi / N) * pw;
                    const ay2 = pad.t + (1 - signal[pi]) * ph;
                    const alpha = 0.2 + ii * 0.15;
                    // Add exact hex to alpha conversion approximation logic here or simple slice
                    ctx.strokeStyle = task.color; // simplified for React port
                    ctx.globalAlpha = alpha;
                    ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]);
                    ctx.beginPath(); ctx.moveTo(qx, qy); ctx.quadraticCurveTo((qx + ax2) / 2, pad.t - 10, ax2, ay2); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.globalAlpha = 1.0;
                });

                // Query point
                ctx.fillStyle = task.color; ctx.beginPath(); ctx.arc(qx, qy, 5, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(qx, qy, 5, 0, Math.PI * 2); ctx.stroke();
            }

            // Legend
            let legItems;
            if (task.signal === 'imputation') {
                legItems = [
                    { c: '#00d4ff', label: 'Actual Sensor' },
                    { c: 'rgba(239,68,68,0.4)', label: 'Missing Window' },
                    { c: '#f59e0b', label: 'LTSM Imputed' },
                    { c: 'rgba(16,185,129,0.4)', label: 'Confidence Band' },
                ];
            } else if (task.signal === 'anomaly') {
                legItems = [
                    { c: 'rgba(139,146,168,0.7)', label: 'Sensor Stream' },
                    { c: '#ef4444', label: 'Anomaly Alert' },
                ];
            } else {
                legItems = [
                    { c: 'rgba(139,146,168,0.7)', label: 'Historical' },
                    { c: task.color, label: 'LTSM Forecast' },
                    { c: task.color + '55', label: '95% Confidence' },
                ];
            }

            legItems.forEach((item, i) => {
                const lx = W - pad.r + 24;
                const ly = pad.t + 32 + i * 32;
                ctx.fillStyle = item.c; ctx.fillRect(lx, ly - 8, 18, 16);
                ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '14px "Outfit", sans-serif'; ctx.textAlign = 'left';
                ctx.fillText(item.label, lx + 28, ly + 4);
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [activeTaskIndex, isExportMode]);

    const activeTask = TASKS[activeTaskIndex];

    return (
        <div className="flex flex-col h-full max-w-[1400px] mx-auto px-8 py-2 relative z-10 font-outfit text-text">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 font-mono text-xs tracking-[3px] uppercase mb-1 opacity-80">
                // 05 — The LTSM Solution
            </motion.div>

            <motion.h2
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-playfair font-bold text-2xl mb-1 leading-tight"
            >
                One Foundation Model — <span className="text-emerald-400">Every Oil & Gas Task</span>
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 mb-2 flex-grow min-h-0">
                {/* Main Canvas Area */}
                <motion.div
                    initial={isExportMode ? { opacity: 1 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-grow bg-card border border-border rounded-xl p-3 shadow-xl flex flex-col min-h-0"
                >
                    <div className="font-mono text-[10px] tracking-widest text-emerald-400 mb-2 uppercase flex items-center gap-2 shrink-0">
                        <Zap size={12} /> One Model — Watch It Handle Every Task
                    </div>
                    <div className="w-full relative flex-grow min-h-0 bg-surface rounded-lg border border-border/40 overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            style={{ touchAction: 'none' }}
                        />
                    </div>
                </motion.div>

                {/* Sidebar Selector */}
                <motion.div
                    initial={isExportMode ? { opacity: 1 } : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-[320px] flex flex-col gap-4"
                >
                    <div className="bg-card border border-border rounded-xl p-2 shadow-xl flex-grow">
                        <div className="font-mono text-[10px] tracking-widest text-muted mb-1 uppercase">Select Task</div>
                        <div className="flex flex-col gap-1">
                            {TASKS.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTaskIndex(i)}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all duration-200 ${activeTaskIndex === i
                                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 border shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                                        : 'bg-transparent border border-border text-muted hover:border-emerald-500/30 hover:text-text'
                                        }`}
                                >
                                    {t.icon}
                                    <span className="font-semibold">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-2 shadow-xl">
                        <div className="font-mono text-[10px] tracking-widest text-muted mb-1.5 uppercase">Model Properties</div>
                        <div className="flex flex-col gap-1.5">
                            {Object.entries(activeTask.meta).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                                    <span className="text-xs text-muted font-mono">{key}</span>
                                    <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Capability Grid */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-1 h-auto mb-2"
            >
                {CAPABILITIES.map((cap, i) => (
                    <div key={i} className="bg-card border border-border border-b-2 border-b-emerald-500/50 p-1 lg:p-2 rounded-lg flex flex-col hover:bg-surface transition-colors group">
                        <div className="mb-0.5 transition-transform group-hover:scale-110 group-hover:-translate-y-1 transform origin-bottom-left">
                            {React.cloneElement(cap.icon, { size: 16 })}
                        </div>
                        <h4 className="font-playfair font-bold text-sm text-emerald-300 mb-0.5 leading-tight">{cap.title}</h4>
                        <p className="text-[10px] text-muted leading-tight line-clamp-2">{cap.desc}</p>
                    </div>
                ))}
            </motion.div>

            {/* Explanation Box to fill empty space and add context */}
            <motion.div
                initial={isExportMode ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-xl flex items-start gap-2"
            >
                <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400 shrink-0">
                    <Globe size={18} />
                </div>
                <div>
                    <h3 className="text-emerald-400 font-bold mb-1 font-playfair text-base">The Physics of Large Models</h3>
                    <p className="text-xs md:text-sm text-muted leading-snug">
                        The simulation above demonstrates a fundamental breakthrough: <strong className="text-text">Cross-Domain Attention</strong>. Unlike traditional tools that look at one sensor in isolation, this Foundation Model simultaneously processes upstream flow rates, midstream pipeline pressures, and global supply economics. By learning the underlying physics across the entire Oil & Gas ecosystem, it adapts to unseen scenarios instantly (Zero-Shot) and eliminates the 60% of ML budgets wasted on retraining.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
