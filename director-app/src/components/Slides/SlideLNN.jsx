import { useEffect, useRef } from "react";

export default function SlideLNN() {
    const waveCanvasRef = useRef(null);
    const robotCanvasRef = useRef(null);

    // Liquid Wave Simulation
    useEffect(() => {
        const canvas = waveCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lTime = 0;

        const drawLiquidWave = () => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            lTime += 0.03;

            const waves = [
                { freq: 1.2, amp: 30, phase: 0, color: 'rgba(74,222,128,0.9)', width: 2.5 },
                { freq: 2.1, amp: 16, phase: 1.2, color: 'rgba(74,222,128,0.45)', width: 1.5 },
                { freq: 0.5, amp: 22, phase: 2.8, color: 'rgba(134,239,172,0.3)', width: 1.5 },
            ];

            waves.forEach(w => {
                ctx.strokeStyle = w.color; ctx.lineWidth = w.width; ctx.beginPath();
                let first = true;
                for (let x = 0; x < W; x++) {
                    const t = x / W * Math.PI * 4;
                    const decay = Math.exp(-x / W * 1.2);
                    const y = H / 2 - (Math.sin(t * w.freq + lTime + w.phase) * w.amp * decay + Math.sin(t * 0.3 + lTime * 0.5) * 8);
                    first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false;
                }
                ctx.stroke();
            });

            for (let i = 0; i < 8; i++) {
                const x = (i + 0.5) / 8 * W;
                const t = (i + 0.5) / 8 * Math.PI * 4;
                const y = H / 2 - (Math.sin(t * 1.2 + lTime) * 30 * Math.exp(-x / W * 1.2) + 8);
                ctx.fillStyle = `rgba(74,222,128,${0.5 + 0.5 * Math.sin(lTime + i)})`;
                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = 'rgba(74,222,128,0.4)'; ctx.font = '10px JetBrains Mono';
            ctx.fillText('neuron state flowing through continuous time →', 10, H - 10);
            animationFrameId = requestAnimationFrame(drawLiquidWave);
        };
        drawLiquidWave();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Robot Adaptive Control Simulation
    useEffect(() => {
        const canvas = robotCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let rTime = 0;
        let robotX = 100, robotY = 100;

        const drawRobot = () => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            rTime += 0.02;

            const tX = W / 2 + Math.sin(rTime * 0.8) * W * 0.3;
            const tY = H / 2 + Math.cos(rTime * 0.6) * H * 0.3;

            // LNN tracking logic
            robotX += (tX - robotX) * 0.04;
            robotY += (tY - robotY) * 0.04;

            ctx.strokeStyle = 'rgba(74,222,128,0.15)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(robotX, robotY, 80, 0, Math.PI * 2); ctx.stroke();

            const dist = Math.sqrt((tX - robotX) ** 2 + (tY - robotY) ** 2);
            const alpha = Math.max(0.1, Math.min(0.6, 1 - dist / 200));
            ctx.strokeStyle = `rgba(74,222,128,${alpha})`; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(robotX, robotY); ctx.lineTo(tX, tY); ctx.stroke(); ctx.setLineDash([]);

            const pulsR = 8 + 3 * Math.sin(rTime * 3);
            ctx.fillStyle = `rgba(251,191,36,${0.3 + 0.2 * Math.sin(rTime * 3)})`;
            ctx.beginPath(); ctx.arc(tX, tY, pulsR + 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(251,191,36,0.9)';
            ctx.beginPath(); ctx.arc(tX, tY, pulsR, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.font = '14px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('●', tX, tY);

            ctx.fillStyle = 'rgba(74,222,128,0.15)';
            ctx.beginPath(); ctx.arc(robotX, robotY, 20, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(74,222,128,0.6)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(robotX, robotY, 20, 0, Math.PI * 2); ctx.stroke();
            ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText('🤖', robotX, robotY);

            for (let i = 0; i < 3; i++) {
                const angle = rTime * 2 + i * (Math.PI * 2 / 3);
                const r = 30 + i * 12;
                ctx.strokeStyle = `rgba(74,222,128,${0.15 - i * 0.04})`; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(robotX, robotY, r, angle, angle + Math.PI); ctx.stroke();
            }

            ctx.fillStyle = 'rgba(74,222,128,0.5)'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
            ctx.fillText('LNN adapting trajectory…', 10, H - 10);
            ctx.fillStyle = 'rgba(251,191,36,0.5)';
            ctx.fillText('moving target', tX + 15, tY - 5);
            ctx.textAlign = 'left';

            animationFrameId = requestAnimationFrame(drawRobot);
        };
        drawRobot();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto py-8">
            <div className="w-full text-center">
                <span className="chapter-label text-l">Chapter 04 · Architecture Three</span>
                <h2 className="chapter-title text-l mb-2">Liquid Neural Networks</h2>
                <p className="text-[1.05rem] text-muted max-w-3xl mx-auto leading-relaxed mb-8">
                    Adaptive intelligence. Born at MIT, inspired by the 302 neurons of the C. elegans worm. Tiny networks, extraordinary adaptability.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full mb-6">
                {/* Fixed Networks Card */}
                <div className="bg-card border border-rose-500/20 rounded-lg p-8 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <div className="text-lg font-semibold mb-2">Traditional Networks</div>
                    <div className="text-sm text-muted leading-relaxed">
                        Fixed after training. Weights locked. Behavior predetermined. When the real world changes — they fail silently, confidently wrong.
                    </div>
                </div>

                {/* Liquid Networks Card */}
                <div className="bg-card border border-l/20 rounded-lg p-8 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">🌊</div>
                    <div className="text-lg font-semibold mb-2 text-white">Liquid Networks</div>
                    <div className="text-sm text-muted leading-relaxed">
                        Neurons that flow and adapt. Internal dynamics shift based on the input <em className="text-l">right now</em>. The network rewires itself with every new experience.
                    </div>
                </div>
            </div>

            {/* Simulations Container */}
            <div className="grid grid-cols-2 gap-6 w-full h-[220px]">
                {/* Liquid Wave Sim */}
                <div className="bg-card border border-l/20 rounded-lg p-5 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-l mb-2">Continuous Time Dynamics</div>
                    <div className="font-mono text-xs bg-l/5 rounded p-2 mb-3 leading-relaxed">
                        <span className="text-l">dh/dt</span> = <span className="text-l/70">−h/τ</span> + <span className="text-ts/80">f(h, x, t)</span>
                    </div>
                    <canvas ref={waveCanvasRef} width="450" height="120" className="w-full flex-1 block -mx-2" />
                </div>

                {/* Robot Sim */}
                <div className="bg-card border border-l/20 rounded-lg p-5 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-l mb-2">✦ Liquid Network Controlling a Robot</div>
                    <canvas ref={robotCanvasRef} width="450" height="160" className="w-full flex-1 block bg-[#020a06] rounded" />
                    <p className="text-[0.65rem] text-muted mt-2 leading-relaxed">
                        The robot continuously adjusts its path to follow the moving target using a Liquid Neural Network controller. The wiring adapts in real-time — no pre-programmed path.
                    </p>
                </div>
            </div>
        </div>
    );
}
