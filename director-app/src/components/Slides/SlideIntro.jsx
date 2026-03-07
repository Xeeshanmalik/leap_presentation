import { useEffect, useRef, useState } from "react";
import { useGameState } from "../../hooks/useGameState";

const descMap = {
    ts: 'Time Series: data points collected over time. Each point depends on what came before. The challenge: patterns may span thousands of time steps.',
    lang: 'Language: words flow in sequence. Each word\'s meaning shifts based on surrounding context. "It was so cold" — what does "it" refer to?',
    vis: 'Vision: pixels form edges, edges form shapes, shapes form objects. The challenge: recognizing a cat whether it\'s facing left or right, big or small.'
};

const langWords = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'and', 'runs', 'away'];
const langColors = ['rgba(56,189,248,', 'rgba(74,222,128,', 'rgba(244,114,182,', 'rgba(251,191,36,'];

export default function SlideIntro() {
    const { role, slideData, setSlideData } = useGameState();
    const canvasRef = useRef(null);

    // Global toggle state
    const currentTab = slideData[0]?.activeTab || 'ts';

    const handleTabChange = (tab) => {
        if (role === 'presenter') {
            setSlideData(0, { ...slideData[0], activeTab: tab });
        }
    };

    // Canvas rendering port
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let dvTime = 0;

        const drawDataViz = () => {
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            dvTime += 0.025;

            if (currentTab === 'ts') {
                ctx.strokeStyle = 'rgba(56,189,248,0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

                ctx.strokeStyle = 'rgba(244,114,182,0.9)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                let first = true;
                for (let x = 0; x < W; x++) {
                    const t = x / W * 8 + dvTime * 0.3;
                    const y = H / 2 - (Math.sin(t * 2.1) * 28 + Math.sin(t * 0.7) * 18 + Math.sin(t * 5.3) * 8) - (x > W * 0.6 && x < W * 0.65 ? 40 : 0);
                    if (first) { ctx.moveTo(x, y); first = false; } else { ctx.lineTo(x, y); }
                }
                ctx.stroke();

                for (let i = 0; i < 20; i++) {
                    const x = i / 19 * W;
                    const t = x / W * 8 + dvTime * 0.3;
                    const y = H / 2 - (Math.sin(t * 2.1) * 28 + Math.sin(t * 0.7) * 18 + Math.sin(t * 5.3) * 8) - (x > W * 0.6 && x < W * 0.65 ? 40 : 0);
                    ctx.fillStyle = `rgba(244,114,182,${0.4 + 0.4 * Math.sin(dvTime + i)})`;
                    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
                }

                const spike = W * 0.625, query = W * 0.85;
                const sY = H * 0.25, qY = H * 0.6;
                const alpha = 0.4 + 0.3 * Math.sin(dvTime);
                ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(spike, sY); ctx.quadraticCurveTo((spike + query) / 2, 20, query, qY);
                ctx.stroke(); ctx.setLineDash([]);

                ctx.fillStyle = 'rgba(244,114,182,0.8)'; ctx.font = '11px JetBrains Mono';
                ctx.fillText('temperature spike', spike - 60, sY - 10);
                ctx.fillStyle = 'rgba(56,189,248,0.7)';
                ctx.fillText('prediction point', query - 70, qY + 20);

            } else if (currentTab === 'lang') {
                const cols = langWords.length;
                const cellW = W / cols;
                langWords.forEach((w, i) => {
                    const cx = i * cellW + cellW / 2;
                    const cy = H / 2;
                    const pulse = Math.sin(dvTime + i * 0.5);
                    const alpha = 0.3 + 0.4 * Math.abs(pulse);
                    const cIdx = i % langColors.length;
                    ctx.fillStyle = langColors[cIdx] + alpha + ')';
                    ctx.fillRect(i * cellW + 4, cy - 25, cellW - 8, 50);
                    ctx.fillStyle = 'rgba(220,232,255,0.9)';
                    ctx.font = `${12 + Math.abs(pulse) * 3}px Outfit`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(w, cx, cy);
                });
                const active = Math.floor(dvTime * 0.8) % langWords.length;
                const targets = [0, 3, 7].filter(t => t !== active);
                targets.forEach(t => {
                    const x1 = active * (W / cols) + W / cols / 2;
                    const x2 = t * (W / cols) + W / cols / 2;
                    const alpha = 0.3 + 0.3 * Math.sin(dvTime);
                    ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(x1, H / 2 - 25);
                    ctx.quadraticCurveTo((x1 + x2) / 2, 20, x2, H / 2 - 25);
                    ctx.stroke();
                });
                ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

            } else {
                const rows = 8, cols = 10;
                const cw = W / cols, ch = H / rows;
                const facePattern = [
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
                    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
                    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
                ];
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const val = facePattern[r][c];
                        const reveal = Math.sin(dvTime * 1.5 - (r + c) * 0.2) > 0.2;
                        const alpha = val ? (0.4 + 0.5 * Math.sin(dvTime * 0.8 + r * 0.3 + c * 0.2)) : (0.05 + 0.04 * Math.sin(dvTime + r + c));
                        ctx.fillStyle = val ? `rgba(251,191,36,${reveal ? alpha : 0.1})` : `rgba(56,189,248,${alpha})`;
                        ctx.fillRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
                        if (val && reveal) {
                            ctx.fillStyle = 'rgba(0,0,0,0.5)';
                            ctx.font = '8px JetBrains Mono';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(Math.floor(180 + Math.sin(dvTime + r + c) * 30).toString(), (c + 0.5) * cw, (r + 0.5) * ch);
                        }
                    }
                }
                ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
                ctx.fillStyle = 'rgba(251,191,36,0.7)';
                ctx.font = '12px Outfit';
                ctx.fillText('pixels → edges → objects → meaning', 10, H - 10);
            }
            animationFrameId = requestAnimationFrame(drawDataViz);
        };

        drawDataViz();

        return () => cancelAnimationFrame(animationFrameId);
    }, [currentTab]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto w-full">
            <div className="hero-tag mt-8">A Visual Journey · For Curious Minds</div>
            <h1 className="chapter-title mb-4">
                How Modern AI<br />
                <em className="bg-clip-text text-transparent bg-gradient-to-br from-t via-d to-l not-italic">Understands Data</em>
            </h1>
            <p className="text-lg text-muted max-w-2xl leading-relaxed mb-12">
                Transformers · xLSTM · Liquid Neural Networks<br />
                Learning from Time Series, Language, and Vision
            </p>

            <div className="w-full bg-card border border-border rounded-lg overflow-hidden relative shadow-2xl flex flex-col">
                <div className="flex items-center gap-6 px-6 py-3 border-b border-border bg-black/20">
                    <button
                        onClick={() => handleTabChange('ts')}
                        className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors px-2 py-1 ${currentTab === 'ts' ? 'text-t' : 'text-muted hover:text-white cursor-pointer'} ${role !== 'presenter' && 'pointer-events-none'}`}
                    >
                        ⏱ Time Series
                    </button>
                    <button
                        onClick={() => handleTabChange('lang')}
                        className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors px-2 py-1 ${currentTab === 'lang' ? 'text-lang' : 'text-muted hover:text-white cursor-pointer'} ${role !== 'presenter' && 'pointer-events-none'}`}
                    >
                        💬 Language
                    </button>
                    <button
                        onClick={() => handleTabChange('vis')}
                        className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors px-2 py-1 ${currentTab === 'vis' ? 'text-vis' : 'text-muted hover:text-white cursor-pointer'} ${role !== 'presenter' && 'pointer-events-none'}`}
                    >
                        🖼 Vision
                    </button>
                    {role === 'presenter' && (
                        <span className="ml-auto font-mono text-[0.55rem] text-dim tracking-widest uppercase">Presenter Controls Active</span>
                    )}
                </div>

                <div className="w-full relative h-[220px]">
                    <canvas ref={canvasRef} width="900" height="220" className="w-full h-full block bg-black/30" />
                </div>

                <div className="p-4 px-6 text-[0.85rem] text-left text-muted border-t border-border bg-black/10 leading-relaxed min-h-[60px]">
                    {descMap[currentTab]}
                </div>
            </div>
        </div>
    );
}
