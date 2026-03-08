import React, { useRef, useState, useEffect } from 'react';
import SlideTitle from "../Slides/SlideTitle";
import SlideProblem from "../Slides/SlideProblem";
import SlideClassical from "../Slides/SlideClassical";
import SlideExecutiveProblem from "../Slides/SlideExecutiveProblem";
import SlideExecutiveSolution from "../Slides/SlideExecutiveSolution";
import SlideExecutiveCompare from "../Slides/SlideExecutiveCompare";
import SlideTransformerSection from "../Slides/SlideTransformerSection";
import SlideTransformerArchitecture from "../Slides/SlideTransformerArchitecture";

const slides = [
    SlideTitle,               // 0 - Title Slide
    SlideProblem,             // 1 - The Problem
    SlideClassical,           // 2 - Classical Limits
    SlideExecutiveProblem,    // 3 - The Fragmentation Crisis
    SlideExecutiveSolution,   // 4 - The LTSM Solution
    SlideExecutiveCompare,      // 5 - Executive Compare
    SlideTransformerSection,    // 6 - Section Break: Transformer Architecture
    SlideTransformerArchitecture, // 7 - Section Break: Transformer architecture
];

const PlaceholderSlide = ({ index }) => (
    <div className="flex items-center justify-center w-full h-full text-2xl text-muted font-mono bg-surface">
        Slide {index + 1} (Under Construction)
    </div>
);

export default function SlideRenderer({ slideIndex, ...props }) {
    if (slideIndex >= slides.length) {
        return <PlaceholderSlide index={slideIndex} />;
    }

    const SlideComponent = slides[slideIndex];
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                const targetW = 1600;
                const targetH = 900;

                const scaleW = clientWidth / targetW;
                const scaleH = clientHeight / targetH;

                setScale(Math.min(scaleW, scaleH));
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        updateScale(); // Initial call

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div
                className="absolute flex items-center justify-center transform origin-center transition-transform duration-75 ease-out"
                style={{
                    width: '1600px',
                    height: '900px',
                    transform: `scale(${scale})`
                }}
            >
                <div className="w-full h-full p-12">
                    <SlideComponent {...props} />
                </div>
            </div>
        </div>
    );
}
