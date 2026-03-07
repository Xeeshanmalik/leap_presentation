import { useEffect, useRef, useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import dogImg from "../../assets/dog.png";

const sentence = ['The', 'doctor', 'told', 'the', 'patient', 'she', 'needed', 'rest'];
const attnMap = {
    0: { rel: [3, 7], desc: '"The" connects to the other "the" and end of sentence — articles cluster together.' },
    1: { rel: [4, 5, 7], desc: '"doctor" attends strongly to "patient" and "she" — who is the subject of care?' },
    2: { rel: [1, 5, 7], desc: '"told" looks at who spoke (doctor) and what was communicated (rest).' },
    3: { rel: [0, 4], desc: '"the" before "patient" links back to the opening article — structural mirroring.' },
    4: { rel: [1, 3, 5], desc: '"patient" is the focus — it attends to who treats it (doctor) and the pronoun referring to it.' },
    5: { rel: [1, 4, 7], desc: '"she" is ambiguous — the model attends to both "doctor" and "patient" to resolve the reference.' },
    6: { rel: [2, 7], desc: '"needed" connects to "told" (the verb chain) and "rest" (what was needed).' },
    7: { rel: [1, 5, 6], desc: '"rest" attends to doctor, she, and needed — the full recommendation chain.' }
};

const patchWeights = [
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.1,
    0.1, 0.2, 0.4, 0.5, 0.5, 0.4, 0.2, 0.1,
    0.1, 0.3, 0.9, 0.6, 0.6, 0.9, 0.3, 0.1,
    0.1, 0.3, 0.5, 1.0, 1.0, 0.5, 0.3, 0.1,
    0.1, 0.2, 0.4, 0.8, 0.8, 0.4, 0.2, 0.1,
    0.1, 0.1, 0.2, 0.4, 0.4, 0.2, 0.1, 0.1,
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1
];

export default function SlideTransformer() {
    const { role, slideData, setSlideData } = useGameState();
    const tsCanvasRef = useRef(null);
    const svgRef = useRef(null);

    const activeWord = slideData[1]?.activeWord ?? -1;
    const activePatch = slideData[1]?.activePatch ?? -1;

    const handleWordClick = (idx) => {
        if (role === 'presenter') {
            setSlideData(1, { ...slideData[1], activeWord: activeWord === idx ? -1 : idx });
        }
    };

    const handlePatchHover = (idx) => {
        if (role === 'presenter' && activePatch !== idx) {
            setSlideData(1, { ...slideData[1], activePatch: idx });
        }
    };

    // Time Series Canvas
    useEffect(() => {
        const canvas = tsCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let tsTime = 0;

        const drawTST = () => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            tsTime += 0.02;

            ctx.strokeStyle = 'rgba(56,189,248,0.06)'; ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

            ctx.strokeStyle = 'rgba(244,114,182,0.85)'; ctx.lineWidth = 2; ctx.beginPath();
            let firstTS = true;
            for (let x = 0; x < W; x++) {
                const t = x / W * 10;
                const spike = (x > W * 0.25 && x < W * 0.3) ? -50 : 0;
                const spike2 = (x > W * 0.75 && x < W * 0.78) ? -40 : 0;
                const y = H / 2 - (Math.sin(t * 1.8) * 20 + Math.sin(t * 0.5) * 10 + spike + spike2);
                if (firstTS) { ctx.moveTo(x, y); firstTS = false; } else ctx.lineTo(x, y);
            }
            ctx.stroke();

            const predX = W * 0.9, spikeX = W * 0.275;
            const predY = H * 0.48, spikeY = H * 0.18;
            const alpha = 0.4 + 0.25 * Math.sin(tsTime);
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(predX, predY);
            ctx.quadraticCurveTo(W * 0.6, 10, spikeX, spikeY);
            ctx.stroke(); ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(244,114,182,0.8)'; ctx.font = '10px JetBrains Mono';
            ctx.fillText('PAST SPIKE', spikeX - 30, spikeY - 8);
            ctx.fillStyle = 'rgba(56,189,248,0.8)';
            ctx.fillText('PREDICTING NOW', predX - 80, predY + 18);
            ctx.fillStyle = 'rgba(56,189,248,0.6)'; ctx.font = '9px JetBrains Mono';
            ctx.fillText('attention arc', W * 0.6 - 40, 25);

            animationFrameId = requestAnimationFrame(drawTST);
        };
        drawTST();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // SVG Arcs for Attention
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Clear old paths
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        if (activeWord === -1) return;

        const rel = attnMap[activeWord].rel;
        const wordEls = document.querySelectorAll('.attn-word');
        const svgRect = svg.getBoundingClientRect();

        const getX = (i) => {
            const el = wordEls[i];
            if (!el) return 0;
            const r = el.getBoundingClientRect();
            return r.left + r.width / 2 - svgRect.left;
        };

        const srcX = getX(activeWord);
        rel.forEach((t, ti) => {
            const tX = getX(t);
            const opacity = 0.4 + 0.3 * ((ti + 1) / rel.length);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const mid = (srcX + tX) / 2;
            path.setAttribute('d', `M ${srcX} 5 Q ${mid} 65 ${tX} 5`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', `rgba(56,189,248,${opacity})`);
            path.setAttribute('stroke-width', '2');
            svg.appendChild(path);

            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', tX); dot.setAttribute('cy', '5'); dot.setAttribute('r', '5');
            dot.setAttribute('fill', 'rgba(56,189,248,0.8)');
            svg.appendChild(dot);
        });

        const srcDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        srcDot.setAttribute('cx', srcX); srcDot.setAttribute('cy', '5'); srcDot.setAttribute('r', '7');
        srcDot.setAttribute('fill', '#38bdf8');
        svg.appendChild(srcDot);

    }, [activeWord]);

    return (
        <div className="flex flex-col h-full items-center text-left max-w-6xl mx-auto py-8">
            <div className="w-full">
                <span className="chapter-label text-t">Chapter 02 · Architecture One</span>
                <h2 className="chapter-title text-t mb-2">Transformer</h2>
                <p className="text-[1.1rem] text-muted max-w-4xl leading-relaxed mb-6">
                    The architecture that changed modern AI. Instead of reading left-to-right, it looks at the <em>whole picture simultaneously</em> and decides what to focus on using Attention.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
                {/* Text Attention Heatmap */}
                <div className="col-span-2 bg-card border border-t/20 rounded-lg p-6 relative overflow-visible">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-t mb-6">
                        ✦ Interactive Attention Heatmap {role === 'presenter' ? '— click any word' : ''}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10 w-full justify-start">
                        {sentence.map((w, i) => (
                            <button
                                key={i}
                                onClick={() => handleWordClick(i)}
                                className={`attn-word px-3 py-1.5 rounded text-sm font-medium border transition-all select-none
                                    ${activeWord === i ? 'bg-t/20 border-t/50 text-t' :
                                        (activeWord !== -1 && !attnMap[activeWord].rel.includes(i)) ? 'opacity-30 border-transparent text-t bg-transparent' :
                                            'bg-t/5 border-t/20 text-t hover:bg-t/20 hover:border-t/50 cursor-pointer'} 
                                    ${role !== 'presenter' && 'pointer-events-none'}`}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full h-[70px] overflow-visible pointer-events-none">
                        <svg ref={svgRef} className="w-full h-full overflow-visible absolute top-0 left-0" />
                    </div>
                    <div className="text-sm text-muted italic mt-4 min-h-[36px]">
                        {activeWord === -1 ? '← Click a word to see which others it "attends to" most strongly' : attnMap[activeWord].desc}
                    </div>
                </div>

                {/* Time Series Canvas */}
                <div className="bg-card border border-ts/20 rounded-lg p-6">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-ts mb-4">
                        ⏱ Time Series Attention
                    </div>
                    <canvas ref={tsCanvasRef} width="400" height="100" className="w-full h-[100px] block" />
                    <p className="text-xs text-muted mt-4 leading-relaxed">
                        The model skips nearby noise and "jumps" to attend the critical past spike that predicts today's anomaly.
                    </p>
                </div>

                {/* Vision Patch Grid */}
                <div className="bg-card border border-vis/20 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-vis">
                            🖼 Vision Patch Attention
                        </div>
                        {role === 'presenter' && <div className="font-mono text-[0.5rem] tracking-widest text-vis/60 uppercase animate-pulse">Hover Patches to Sync</div>}
                    </div>

                    <div
                        className="relative grid grid-cols-8 gap-[1px] w-full max-w-[240px] aspect-square mx-auto bg-black border border-vis/30 rounded overflow-visible"
                        style={{ backgroundImage: `url(${dogImg})`, backgroundSize: 'cover' }}
                        onMouseLeave={() => handlePatchHover(-1)}
                    >
                        {patchWeights.map((w, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => handlePatchHover(i)}
                                className={`w-full h-full relative cursor-crosshair transition-all duration-300
                                    ${activePatch === i ? 'ring-2 ring-vis z-10 scale-125 shadow-[0_0_20px_rgba(251,191,36,0.8)] rounded-sm' : 'border border-transparent'}
                                    ${role !== 'presenter' && 'pointer-events-none'}`}
                                style={{
                                    backgroundColor: `rgba(4,7,15,${0.85 - w * 0.85})`,
                                }}
                            >
                                {activePatch === i && (
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 border border-vis text-vis font-mono text-[9px] px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                                        W: {w.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted mt-5 leading-relaxed text-center">
                        The image is split into patches. The Transformer learns that patches containing core features (like eyes and nose) carry the highest attention weights for understanding the scene.
                    </p>
                </div>
            </div>
        </div >
    );
}
