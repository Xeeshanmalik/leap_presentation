import SlideTitle from "../Slides/SlideTitle";
import SlideProblem from "../Slides/SlideProblem";
import SlideClassical from "../Slides/SlideClassical";
import SlideAttentionIntuition from "../Slides/SlideAttentionIntuition";
import SlideTokenization from "../Slides/SlideTokenization";
import SlidePositionalEncoding from "../Slides/SlidePositionalEncoding";
import SlideQA from "../Slides/SlideQA";
import SlideAttentionMechanism from "../Slides/SlideAttentionMechanism";
import SlideMultiHeadAttention from "../Slides/SlideMultiHeadAttention";
import SlideFFN from "../Slides/SlideFFN";
import SlideScaling from "../Slides/SlideScaling";
import SlideArchitectures from "../Slides/SlideArchitectures";
import SlidePretraining from "../Slides/SlidePretraining";
import SlideForecasting from "../Slides/SlideForecasting";
import SlideFailureModes from "../Slides/SlideFailureModes";
import SlideBenchmarks from "../Slides/SlideBenchmarks";
import SlideDecisionTree from "../Slides/SlideDecisionTree";
import SlideAgenticIntro from "../Slides/SlideAgenticIntro";
import SlideAgenticArch from "../Slides/SlideAgenticArch";
import SlideAgenticOrchestration from "../Slides/SlideAgenticOrchestration";
import SlideAgenticDemo from "../Slides/SlideAgenticDemo";
import SlideLeaderboard from "../Slides/SlideLeaderboard";
import SlideSummary from "../Slides/SlideSummary";

/**
 * 25-slide structure — 3 sections content, then all Q&A, then Leaderboard:
 *
 * SECTION 1 — Introduction (slides 0–5)
 *   0  SlideTitle
 *   1  SlideProblem
 *   2  SlideClassical
 *   3  SlideAttentionIntuition
 *   4  SlideTokenization
 *   5  SlidePositionalEncoding
 *
 * SECTION 2 — Large Time Series Models (slides 6–15)
 *   6  SlideAttentionMechanism
 *   7  SlideMultiHeadAttention
 *   8  SlideFFN
 *   9  SlideScaling
 *   10 SlideArchitectures
 *   11 SlidePretraining
 *   12 SlideForecasting
 *   13 SlideFailureModes
 *   14 SlideBenchmarks
 *   15 SlideDecisionTree
 *
 * SECTION 3 — Agentic AI (slides 16–19)
 *   16 SlideAgenticIntro
 *   17 SlideAgenticArch
 *   18 SlideAgenticOrchestration
 *   19 SlideAgenticDemo
 *   
 * Q&A SECTIONS (slides 20-22)
 *   20 SlideQA sectionIdx=0  ← Q&A 1
 *   21 SlideQA sectionIdx=1  ← Q&A 2
 *   22 SlideQA sectionIdx=2  ← Q&A 3
 *
 * closing
 *   23 SlideLeaderboard      ← Top-10 winners
 *   24 SlideSummary
 */

const slides = [
    SlideTitle,                // 0
    SlideProblem,              // 1
    SlideClassical,            // 2
    SlideAttentionIntuition,   // 3
    SlideTokenization,         // 4
    SlidePositionalEncoding,   // 5
    SlideAttentionMechanism,   // 6
    SlideMultiHeadAttention,   // 7
    SlideFFN,                  // 8
    SlideScaling,              // 9
    SlideArchitectures,        // 10
    SlidePretraining,          // 11
    SlideForecasting,          // 12
    SlideFailureModes,         // 13
    SlideBenchmarks,           // 14
    SlideDecisionTree,         // 15
    SlideAgenticIntro,         // 16
    SlideAgenticArch,          // 17
    SlideAgenticOrchestration, // 18
    SlideAgenticDemo,          // 19
    null,                      // 20  → Q&A sectionIdx=0
    null,                      // 21  → Q&A sectionIdx=1
    null,                      // 22  → Q&A sectionIdx=2
    SlideLeaderboard,          // 23 — Top-10 winners 🏆
    SlideSummary,              // 24
];

const QA_SLIDE_MAP = { 20: 0, 21: 1, 22: 2 };

const PlaceholderSlide = ({ index }) => (
    <div className="flex items-center justify-center h-full text-2xl text-muted font-mono">
        Slide {index + 1} (Under Construction)
    </div>
);

export default function SlideRenderer({ slideIndex, ...props }) {
    if (slideIndex >= slides.length) {
        return <PlaceholderSlide index={slideIndex} />;
    }

    if (QA_SLIDE_MAP[slideIndex] !== undefined) {
        return (
            <div className="w-full h-full">
                <SlideQA key={`qa-${slideIndex}`} sectionIdx={QA_SLIDE_MAP[slideIndex]} />
            </div>
        );
    }

    const SlideComponent = slides[slideIndex];

    const urlParams = new URLSearchParams(window.location.search);
    const isExportPreview = urlParams.get('exportPreview') === 'true';
    const effectiveExportMode = props.isExportMode || isExportPreview;

    return (
        <div className="w-full h-full">
            <SlideComponent {...props} isExportMode={effectiveExportMode} />
        </div>
    );
}
