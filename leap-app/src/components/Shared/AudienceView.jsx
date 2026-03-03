import { useGameState } from "../../hooks/useGameState";
import SlideRenderer from "./SlideRenderer";
import Background from "./Background";
import Header from "./Header";
import QuizOverlay from "../Quiz/QuizOverlay";

export default function AudienceView() {
    const { currentSlideIndex } = useGameState();

    return (
        <div className="w-full h-full relative overflow-hidden">
            <Background />
            <Header totalSlides={25} />
            <div className="relative z-10 w-full h-full">
                <SlideRenderer slideIndex={currentSlideIndex} />
            </div>
            <QuizOverlay />
        </div>
    );
}
