import { useState, useEffect } from "react";
import { useGameState } from "../../hooks/useGameState";
import { slideNotes } from "../../data/slideNotes";
import SlideRenderer from "../Shared/SlideRenderer";
import Background from "../Shared/Background";
import Header from "../Shared/Header";
import Navigation from "./Navigation";
import PPTExportOverlay from "./PPTExportOverlay";

export default function PresenterView() {
    const { currentSlideIndex, quizStatus, setQuizState, setSlide } = useGameState();

    const [showNotes, setShowNotes] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const toggleNotes = () => setShowNotes(!showNotes);

    const changeSlide = (delta) => {
        setSlide(Math.max(0, currentSlideIndex + delta));
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log("Key pressed:", e.key); // DEBUG
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault(); // Prevent scrolling
                changeSlide(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                changeSlide(-1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlideIndex]); // Dependency on currentSlideIndex is ensuring fresh closure

    const currentNote = slideNotes[currentSlideIndex] || "No notes for this slide.";

    return (
        <div className="w-full h-full relative overflow-hidden bg-navy text-white">
            <Background />
            <Header totalSlides={25} role="presenter" />

            {/* Slide Preview Area */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center p-12 transition-all duration-300 ${showNotes ? 'pr-[400px]' : ''}`}>
                <div className="w-full h-full max-w-[1600px] border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-navy/50 backdrop-blur-sm">
                    <SlideRenderer slideIndex={currentSlideIndex} />
                </div>
            </div>

            {/* Speaker Notes Panel */}
            <div
                className={`fixed right-0 top-20 bottom-24 w-[350px] bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 z-40 transition-transform duration-300 transform ${showNotes ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="text-gold font-mono text-xs uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
                    Speaker Notes
                </div>
                <div className="text-lg font-sans leading-relaxed text-gray-200 whitespace-pre-line overflow-y-auto h-[calc(100%-40px)]">
                    {currentNote}
                </div>
            </div>

            {/* Floating Navigation */}
            <Navigation toggleNotes={toggleNotes} showNotes={showNotes} onExport={() => setIsExporting(true)} />

            {/* Quiz Status Indicator */}
            {quizStatus === "active" && (
                <div className="fixed top-24 right-8 bg-rose text-white px-4 py-2 rounded-lg font-bold animate-pulse z-50">
                    QUIZ ACTIVE
                </div>
            )}

            {/* PPT Export Overlay */}
            {isExporting && (
                <PPTExportOverlay onClose={() => setIsExporting(false)} />
            )}
        </div>
    );
}
