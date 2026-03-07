import { useGameState } from "../../hooks/useGameState";
import SlideRenderer from "../Shared/SlideRenderer";

export default function AudienceView() {
    const { currentSlideIndex } = useGameState();

    return (
        <div className="w-full h-screen relative overflow-hidden bg-bg text-text font-outfit">
            <div className="absolute inset-0 z-0">
                {/* Optional global background animations go here */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(56,189,248,0.06)_0%,transparent_70%),radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(192,132,252,0.05)_0%,transparent_70%),radial-gradient(ellipse_50%_50%_at_20%_70%,rgba(74,222,128,0.04)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(rgba(56,189,248,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col pt-14">
                {/* Header Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-bg/85 backdrop-blur-md border-b border-border">
                    <div className="font-playfair text-base font-bold text-text tracking-wider">How Modern AI Understands Data</div>
                </nav>

                <div className="flex-1 w-full h-full relative">
                    <SlideRenderer slideIndex={currentSlideIndex} />
                </div>
            </div>
        </div>
    );
}
