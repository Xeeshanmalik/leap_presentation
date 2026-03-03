import { useGameState } from "../../hooks/useGameState";

export default function Navigation({ toggleNotes, showNotes, onExport }) {
    const { currentSlideIndex, setSlide } = useGameState();

    const changeSlide = (delta) => {
        setSlide(Math.max(0, currentSlideIndex + delta));
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 items-center">
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSlide(0);
                }}
                className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all backdrop-blur-md"
                title="Go to Beginning"
            >
                🏠
            </button>

            <button
                onClick={() => changeSlide(-1)}
                className="w-11 h-11 rounded-full bg-teal/10 border border-teal/20 text-teal flex items-center justify-center hover:bg-teal/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all backdrop-blur-md"
            >
                ←
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onExport();
                }}
                className="w-11 h-11 rounded-full bg-purple/10 border border-purple/30 text-purple flex items-center justify-center hover:bg-purple/20 transition-all backdrop-blur-md"
                title="Download PPT"
            >
                ⬇
            </button>

            <button
                onClick={toggleNotes}
                className={`px-5 py-2 rounded-full border font-syne text-xs font-bold tracking-widest uppercase transition-all backdrop-blur-md ${showNotes
                    ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    : "bg-gold/10 text-gold border-gold/30 hover:bg-gold/20"
                    }`}
            >
                {showNotes ? "Hide Notes" : "Show Notes"}
            </button>

            <button
                onClick={() => changeSlide(1)}
                className="w-11 h-11 rounded-full bg-teal/10 border border-teal/20 text-teal flex items-center justify-center hover:bg-teal/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all backdrop-blur-md"
            >
                →
            </button>
        </div>
    );
}
