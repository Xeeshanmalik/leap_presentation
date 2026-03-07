import { Maximize, ChevronLeft, ChevronRight, Home, Monitor } from "lucide-react";

export default function Navigation({ toggleNotes, showNotes, currentSlideIndex, setSlide }) {
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-border px-4 py-3 rounded-full shadow-2xl z-50">
            <button
                onClick={() => setSlide(0)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white title='Go to Start (H)'"
            >
                <Home size={20} />
            </button>
            <div className="w-[1px] h-6 bg-border mx-2"></div>
            <button
                onClick={() => setSlide(Math.max(0, currentSlideIndex - 1))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
                <ChevronLeft size={24} />
            </button>
            <div className="px-4 font-mono text-sm tracking-widest text-muted">
                {String(currentSlideIndex + 1).padStart(2, '0')}<span className="opacity-50">/06</span>
            </div>
            <button
                onClick={() => setSlide(Math.min(5, currentSlideIndex + 1))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
                <ChevronRight size={24} />
            </button>
            <div className="w-[1px] h-6 bg-border mx-2"></div>
            <button
                onClick={toggleNotes}
                className={`p-2 rounded-full transition-colors ${showNotes ? 'bg-t/20 text-t' : 'hover:bg-white/10 text-muted hover:text-white'}`}
                title="Toggle Speaker Notes"
            >
                <Monitor size={20} />
            </button>
        </div>
    );
}
