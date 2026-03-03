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
 * 25-slide structure — 3 sections + Q&A after each + Leaderboard before Summary:
 *
 * SECTION 1 — Introduction (slides 0–5)
 *   0  SlideTitle
 *   1  SlideProblem
 *   2  SlideClassical
 *   3  SlideAttentionIntuition
 *   4  SlideTokenization
 *   5  SlidePositionalEncoding
 *   6  SlideQA sectionIdx=0  ← Q&A
 *
 * SECTION 2 — Large Time Series Models (slides 7–16)
 *   7  SlideAttentionMechanism
 *   8  SlideMultiHeadAttention
 *   9  SlideFFN
 *   10 SlideScaling
 *   11 SlideArchitectures
 *   12 SlidePretraining
 *   13 SlideForecasting
 *   14 SlideFailureModes
 *   15 SlideBenchmarks
 *   16 SlideDecisionTree
 *   17 SlideQA sectionIdx=1  ← Q&A
 *
 * SECTION 3 — Agentic AI (slides 18–21)
 *   18 SlideAgenticIntro
 *   19 SlideAgenticArch
 *   20 SlideAgenticOrchestration
 *   21 SlideAgenticDemo
 *   22 SlideQA sectionIdx=2  ← Q&A
 *
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
    null,                      // 6  → Q&A sectionIdx=0
    SlideAttentionMechanism,   // 7
    SlideMultiHeadAttention,   // 8
    SlideFFN,                  // 9
    SlideScaling,              // 10
    SlideArchitectures,        // 11
    SlidePretraining,          // 12
    SlideForecasting,          // 13
    SlideFailureModes,         // 14
    SlideBenchmarks,           // 15
    SlideDecisionTree,         // 16
    null,                      // 17 → Q&A sectionIdx=1
    SlideAgenticIntro,         // 18
    SlideAgenticArch,          // 19
    SlideAgenticOrchestration, // 20
    SlideAgenticDemo,          // 21
    null,                      // 22 → Q&A sectionIdx=2
    SlideLeaderboard,          // 23 — Top-10 winners 🏆
    SlideSummary,              // 24
];

const QA_SLIDE_MAP = { 6: 0, 17: 1, 22: 2 };

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
                <SlideQA sectionIdx={QA_SLIDE_MAP[slideIndex]} />
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
