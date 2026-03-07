import { Focus, BrainCircuit, Waves } from "lucide-react";

export default function SlideCompare() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-12">
            <span className="chapter-label text-muted">Chapter 06</span>
            <h2 className="chapter-title mb-16">Three Ways AI Learns</h2>

            <div className="grid grid-cols-3 gap-8 w-full max-w-6xl mb-16">
                <div className="p-10 rounded-xl border border-t/20 bg-t/5 relative overflow-hidden flex flex-col items-center">
                    <Focus size={48} className="text-t mb-6" />
                    <div className="text-3xl font-playfair font-bold text-t mb-2">Focus</div>
                    <div className="font-mono text-[0.65rem] tracking-widest uppercase text-muted/60 mb-6">Transformer</div>
                    <p className="text-sm text-muted leading-relaxed">Sees everything at once. Decides what matters. Draws invisible threads between distant ideas.</p>
                </div>

                <div className="p-10 rounded-xl border border-x/20 bg-x/5 relative overflow-hidden flex flex-col items-center">
                    <BrainCircuit size={48} className="text-x mb-6" />
                    <div className="text-3xl font-playfair font-bold text-x mb-2">Remember</div>
                    <div className="font-mono text-[0.65rem] tracking-widest uppercase text-muted/60 mb-6">xLSTM</div>
                    <p className="text-sm text-muted leading-relaxed">Keeps a perfect notebook. Never forgets what matters. Recalls events from 1000 steps ago as clearly as yesterday.</p>
                </div>

                <div className="p-10 rounded-xl border border-l/20 bg-l/5 relative overflow-hidden flex flex-col items-center">
                    <Waves size={48} className="text-l mb-6" />
                    <div className="text-3xl font-playfair font-bold text-l mb-2">Adapt</div>
                    <div className="font-mono text-[0.65rem] tracking-widest uppercase text-muted/60 mb-6">Liquid NN</div>
                    <p className="text-sm text-muted leading-relaxed">Flows like water. Changes with the world. Never gets stuck in a fixed response — always alive.</p>
                </div>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5 max-w-2xl w-full">
                <div className="text-4xl mb-4">✨</div>
                <div className="text-2xl font-playfair font-bold text-white mb-3">The Future: Multimodal AI</div>
                <p className="text-muted leading-relaxed text-sm">Unified intelligence — models that focus, remember, and adapt. Across time, language, and vision. Simultaneously.</p>
            </div>
        </div>
    );
}
