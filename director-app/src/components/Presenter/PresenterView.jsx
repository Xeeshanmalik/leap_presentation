import { useState, useEffect } from "react";
import { useGameState } from "../../hooks/useGameState";
import { slideNotes } from "../../data/slideNotes";
import SlideRenderer from "../Shared/SlideRenderer";
import Navigation from "./Navigation";

export default function PresenterView() {
    const { currentSlideIndex, setSlide } = useGameState();
    const [showNotes, setShowNotes] = useState(true);
    const [isNotesAuthenticated, setIsNotesAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const toggleNotes = () => {
        if (showNotes) {
            setIsNotesAuthenticated(false);
            setPasswordInput("");
        }
        setShowNotes(!showNotes);
    };

    const changeSlide = (delta) => {
        setSlide(Math.max(0, currentSlideIndex + delta));
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                changeSlide(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                changeSlide(-1);
            } else if (e.key.toLowerCase() === "h" || e.key === "Home" || e.key === "0") {
                e.preventDefault();
                setSlide(0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlideIndex]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput.toLowerCase() === "future") {
            setIsNotesAuthenticated(true);
        } else {
            alert("Incorrect password");
            setPasswordInput("");
        }
    };

    const currentNote = slideNotes[currentSlideIndex] || "No notes for this slide.";

    return (
        <div className="w-full h-screen relative overflow-hidden bg-bg text-text font-outfit">
            {/* Header Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-bg/85 backdrop-blur-md border-b border-border">
                <div className="font-playfair text-base font-bold text-text tracking-wider">How Modern AI Understands Data <span className="text-muted ml-2 font-mono text-xs">(PRESENTER)</span></div>
                <div className="flex gap-4">
                    <div className="font-mono text-xs text-muted">SLIDE {currentSlideIndex + 1} / 12</div>
                </div>
            </nav>

            {/* Slide Preview Area */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center p-12 pt-20 transition-all duration-300 ${showNotes ? 'pr-[400px]' : ''}`}>
                <div className="w-full h-full max-w-[1600px] border border-border rounded-xl overflow-hidden shadow-2xl bg-surface">
                    <SlideRenderer slideIndex={currentSlideIndex} />
                </div>
            </div>

            {/* Speaker Notes Panel */}
            <div
                className={`fixed right-0 top-14 bottom-24 w-[350px] bg-card/95 backdrop-blur-xl border-l border-border p-6 z-40 transition-transform duration-300 transform ${showNotes ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="text-t font-mono text-xs uppercase mb-4 tracking-widest border-b border-border pb-2 flex justify-between">
                    <span>Speaker Notes</span>
                    <button onClick={toggleNotes} className="text-muted hover:text-white">✕</button>
                </div>

                {!isNotesAuthenticated ? (
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 mt-8">
                        <p className="text-sm text-muted">Please enter password to view notes</p>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Password"
                            className="bg-black/50 border border-border rounded px-3 py-2 text-white outline-none focus:border-t transition-colors"
                        />
                        <button type="submit" className="bg-t/20 hover:bg-t/30 text-t border border-t/30 rounded px-4 py-2 text-sm font-medium transition-colors">
                            Unlock Notes
                        </button>
                    </form>
                ) : (
                    <div className="text-[1.1rem] font-outfit font-light leading-relaxed text-text whitespace-pre-line overflow-y-auto h-[calc(100%-40px)] pr-2">
                        {currentNote}
                    </div>
                )}
            </div>

            {/* Floating Navigation */}
            <Navigation toggleNotes={toggleNotes} showNotes={showNotes} currentSlideIndex={currentSlideIndex} setSlide={setSlide} />
        </div>
    );
}
