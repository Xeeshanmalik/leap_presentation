import { Link } from "react-router-dom";
import { useGameState } from "../../hooks/useGameState";

export default function Header({ totalSlides, role = "audience" }) {
    const { currentSlideIndex } = useGameState();
    const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
                <div
                    className="h-full bg-gradient-to-r from-teal to-gold transition-all duration-500 ease-out shadow-[0_0_10px_var(--teal)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 pointer-events-auto">
                <div className="flex items-center gap-4">
                    <div className="text-teal font-syne font-extrabold text-sm tracking-[3px] opacity-80 uppercase">
                        LEAP 2026
                    </div>
                    {role === "presenter" && (
                        <Link
                            to="/"
                            className="text-[10px] font-mono tracking-widest text-gold hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/10 hover:border-gold/50"
                        >
                            ▸ VIEW AS AUDIENCE
                        </Link>
                    )}
                </div>
                <div className="text-muted font-mono text-xs tracking-widest">
                    {String(currentSlideIndex + 1).padStart(2, '0')} / {totalSlides}
                </div>
            </div>

            <div className="fixed top-5 left-8 font-syne font-extrabold text-lg text-teal/20 pointer-events-none z-0 select-none">
                LEAP
            </div>
        </>
    );
}
