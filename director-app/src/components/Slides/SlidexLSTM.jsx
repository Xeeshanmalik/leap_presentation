import { useEffect, useRef, useState } from "react";
import { useGameState } from "../../hooks/useGameState";

export default function SlidexLSTM() {
    const { role, slideData, setSlideData } = useGameState();
    const memCanvasRef = useRef(null);
    const mxRef = useRef(null);

    // Sync state for memory curves
    const showLSTM = slideData[2]?.showLSTM ?? true;
    const showXLSTM = slideData[2]?.showXLSTM ?? true;

    const toggleMemory = (type) => {
        if (role !== 'presenter') return;
        if (type === 'lstm') {
            setSlideData(2, { ...slideData[2], showLSTM: !showLSTM });
        } else {
            setSlideData(2, { ...slideData[2], showXLSTM: !showXLSTM });
        }
    };

    // Matrix Animation
    useEffect(() => {
        const mx = mxRef.current;
        if (!mx) return;

        let mTime = 0;
        let animationFrameId;
        const mColors = ['rgba(251,146,60,', 'rgba(251,191,36,', 'rgba(244,114,182,'];

        const divs = Array.from({ length: 30 }).map(() => {
            const div = document.createElement('div');
            div.className = 'h-7 rounded-sm transition-colors duration-500';
            mx.appendChild(div);
            return div;
        });

        const animMatrix = () => {
            mTime += 0.05;
            divs.forEach((c, i) => {
                const v = 0.2 + 0.8 * Math.abs(Math.sin(mTime + i * 0.4));
                c.style.backgroundColor = `${mColors[i % 3]}${v})`;
            });
            animationFrameId = requestAnimationFrame(animMatrix);
        };
        animMatrix();

        return () => {
            cancelAnimationFrame(animationFrameId);
            divs.forEach(div => div.remove());
        };
    }, []);

    // Timeline Graph Simulation
    useEffect(() => {
        const canvas = memCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let memTime = 0;

        const drawMemory = () => {
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            memTime += 0.03;
            const steps = 60;
            const events = [8, 20, 35, 50];

            // grid
            ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
            for (let x = 0; x <= W; x += W / steps) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

            // event markers
            events.forEach(ev => {
                const x = ev / steps * W;
                ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px JetBrains Mono';
                ctx.textAlign = 'center'; ctx.fillText('event', x, 12);
            });
            ctx.textAlign = 'left';

            // LSTM curve
            if (showLSTM) {
                ctx.strokeStyle = 'rgba(244,114,182,0.85)'; ctx.lineWidth = 2.5; ctx.beginPath();
                for (let s = 0; s <= steps; s++) {
                    const x = s / steps * W;
                    let mem = 0.05;
                    events.forEach(ev => { if (s >= ev) mem = Math.max(mem, Math.exp(-(s - ev) * 0.12)); });
                    const y = H * 0.85 - mem * (H * 0.65);
                    s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.fillStyle = 'rgba(244,114,182,0.7)'; ctx.font = 'bold 10px Outfit';
                ctx.fillText('LSTM — forgets over time', 10, H - 10);
            }

            // xLSTM curve
            if (showXLSTM) {
                ctx.strokeStyle = 'rgba(251,146,60,0.85)'; ctx.lineWidth = 2.5; ctx.beginPath();
                for (let s = 0; s <= steps; s++) {
                    const x = s / steps * W;
                    let mem = 0.05;
                    events.forEach(ev => { if (s >= ev) mem = Math.max(mem, 0.75 + 0.2 * Math.sin(memTime + ev)); });
                    const y = H * 0.85 - mem * (H * 0.65);
                    s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.fillStyle = 'rgba(251,146,60,0.7)'; ctx.font = 'bold 10px Outfit';
                ctx.fillText('xLSTM — remembers long-term', 10, 24);
            }

            // Y axis labels
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '9px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillText('HIGH', W - 6, 20); ctx.fillText('LOW', W - 6, H - 8);
            ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillText('MEMORY RETENTION →', W / 2 - 50, H - 8);

            animationFrameId = requestAnimationFrame(drawMemory);
        };
        drawMemory();
        return () => cancelAnimationFrame(animationFrameId);
    }, [showLSTM, showXLSTM]);

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto py-8">
            <div className="w-full text-center">
                <span className="chapter-label text-x">Chapter 03 · Architecture Two</span>
                <h2 className="chapter-title text-x mb-2">xLSTM</h2>
                <p className="text-[1.05rem] text-muted max-w-3xl mx-auto leading-relaxed mb-10">
                    AI with better memory. Extended LSTM by Sepp Hochreiter's team (2024) — the creator of the original LSTM comes back to reinvent it.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full mb-6">
                {/* sLSTM Card */}
                <div className="bg-card border border-x/20 rounded-lg p-6 flex flex-col">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-x mb-2">sLSTM — Scalar Memory</div>
                    <div className="text-lg font-semibold mb-2">Quick Notes</div>
                    <div className="text-sm text-muted mb-6 leading-relaxed flex-1">
                        One value per memory slot. Like a sticky note. Fast and lightweight. Uses <strong className="text-x ml-1">exponential gating</strong> to prevent saturation.
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 h-8 bg-x/70 rounded flex items-center justify-center font-mono text-xs font-bold text-black shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]">f - Forget</div>
                            <div className="text-xs text-muted">What to erase</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 h-8 bg-vis/70 rounded flex items-center justify-center font-mono text-xs font-bold text-black shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]">i - Input</div>
                            <div className="text-xs text-muted">What to store</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 h-8 bg-ts/70 rounded flex items-center justify-center font-mono text-xs font-bold text-black shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]">o - Output</div>
                            <div className="text-xs text-muted">What to reveal</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 h-8 bg-l/70 rounded flex items-center justify-center font-mono text-xs font-bold text-black shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]">m - Stabilizer</div>
                            <div className="text-xs text-x font-mono animate-pulse">NEW: exp() gating</div>
                        </div>
                    </div>
                </div>

                {/* mLSTM Card */}
                <div className="bg-card border border-x/20 rounded-lg p-6 flex flex-col">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-x mb-2">mLSTM — Matrix Memory</div>
                    <div className="text-lg font-semibold mb-2">The Indexed Spreadsheet</div>
                    <div className="text-sm text-muted mb-6 leading-relaxed flex-1">
                        A full matrix of values — stores <em>associations</em>. "Paris → France → Eiffel Tower" all in one memory slot. Far more expressive than scalars.
                    </div>

                    <div ref={mxRef} className="grid grid-cols-6 gap-[3px] w-full mt-auto mb-4" />

                    <div className="font-mono text-xs text-muted/70 tracking-widest text-center py-2 bg-black/40 rounded border border-border">
                        C_t = <span className="text-x font-bold">f · C_&#123;t-1&#125;</span> + <span className="text-vis font-bold">i · (v · k^T)</span>
                    </div>
                </div>
            </div>

            {/* Timeline Graph Simulation */}
            <div className="w-full bg-card border border-border rounded-lg overflow-hidden relative shadow-2xl flex flex-col">
                <div className="flex items-center gap-6 px-6 py-3 border-b border-border bg-black/20">
                    <span className="font-mono text-[0.6rem] text-muted tracking-widest uppercase items-center">Compare Timeline:</span>
                    <button
                        onClick={() => toggleMemory('lstm')}
                        className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded-md border transition-colors ${showLSTM ? 'bg-ts/20 border-ts/50 text-ts shadow-[0_0_10px_rgba(244,114,182,0.3)]' : 'bg-transparent border-ts/20 text-ts opacity-50'} ${role !== 'presenter' && 'pointer-events-none'}`}
                    >
                        LSTM
                    </button>
                    <button
                        onClick={() => toggleMemory('xlstm')}
                        className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded-md border transition-colors ${showXLSTM ? 'bg-x/20 border-x/50 text-x shadow-[0_0_10px_rgba(251,146,60,0.3)]' : 'bg-transparent border-x/20 text-x opacity-50'} ${role !== 'presenter' && 'pointer-events-none'}`}
                    >
                        xLSTM
                    </button>

                    {role === 'presenter' && (
                        <span className="ml-auto font-mono text-[0.55rem] text-dim tracking-widest uppercase">Presenter View</span>
                    )}
                </div>

                <div className="w-full relative h-[180px]">
                    <canvas ref={memCanvasRef} width="1000" height="180" className="w-full h-full block bg-black/30" />
                </div>
            </div>
        </div>
    );
}
