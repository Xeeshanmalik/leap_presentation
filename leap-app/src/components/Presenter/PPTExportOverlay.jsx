import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import PptxGenJS from "pptxgenjs";
import { MotionConfig } from "framer-motion";
import { saveAs } from "file-saver";
import SlideRenderer from "../Shared/SlideRenderer";
import { slideNotes } from "../../data/slideNotes";

export default function PPTExportOverlay({ onClose }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing...");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const captureRef = useRef(null);
    const pptxRef = useRef(null);
    const isCancelled = useRef(false);

    // Total slides to capture
    const TOTAL_SLIDES = 25;

    useEffect(() => {
        let active = true;
        isCancelled.current = false; // RESET for Strict Mode (vital!)

        const runExport = async () => {
            try {
                // Initial delay to ensure DOM is ready
                await new Promise(r => setTimeout(r, 100));

                if (!active || isCancelled.current) {
                    return;
                }

                setStatus("Starting Export Engine...");

                // Initialize PPTX
                try {
                    pptxRef.current = new PptxGenJS();

                    pptxRef.current.layout = "LAYOUT_16x9";
                    pptxRef.current.author = "LEAP 2026 App";
                    pptxRef.current.company = "GenAI Presentation";
                    pptxRef.current.title = "The Physics of Intelligence";
                } catch (e) {
                    throw new Error(`Failed to create PPTX instance: ${e.message}`);
                }


                // Process Loop
                for (let i = 0; i < TOTAL_SLIDES; i++) {
                    if (!active || isCancelled.current) break;

                    setCurrentSlide(i);
                    setStatus(`Rendering Slide ${i + 1}/${TOTAL_SLIDES}...`);
                    setProgress(Math.round((i / TOTAL_SLIDES) * 100));

                    // Wait for render (1.5s)
                    await new Promise(r => setTimeout(r, 1500));

                    if (!active || isCancelled.current) break;

                    const element = captureRef.current;
                    if (!element) throw new Error("Capture element not found in DOM");

                    // Capture
                    const imgData = await toPng(element, {
                        pixelRatio: 2,
                        cacheBust: true,
                        skipAutoScale: true,
                        backgroundColor: "#0a0f1e",
                    });

                    if (!imgData) throw new Error("Empty image data generated");

                    // Add to PPT
                    const slide = pptxRef.current.addSlide();
                    slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });

                    if (slideNotes[i]) slide.addNotes(slideNotes[i]);
                }

                // Finalize
                if (active && !isCancelled.current) {
                    setStatus("Presentation Ready!");
                    setProgress(100);
                    // Signal readiness
                    setDownloadUrl("ready");
                }

            } catch (err) {
                console.error("PPTExport Error:", err);
                if (active && !isCancelled.current) {
                    setStatus(`Error: ${err.message}`);
                }
            }
        };

        runExport();

        return () => {
            active = false;
            isCancelled.current = true;
        };
    }, []);

    const handleCancel = () => {
        isCancelled.current = true;
        onClose();
    };

    const handleDownloadClick = async () => {
        if (!downloadUrl) return;

        try {
            setStatus("Preparing Download...");

            // 1. Generate Blob with explicit config
            const blob = await pptxRef.current.write({
                outputType: "blob",
                compression: true
            });

            // 2. Create a new Blob to enforce the correct MIME type
            const pptxBlob = new Blob([blob], {
                type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            });

            // 3. Use file-saver to save with correct name
            saveAs(pptxBlob, "LEAP_2026_Presentation.pptx");

            setStatus("Done!");
            setTimeout(onClose, 1000);

        } catch (err) {
            console.error("Manual Download Failed:", err);
            setStatus("Download failed. Please try again.");
        }
    };

    return (
        <>
            {/* Capture Area */}
            <div className="fixed top-0 left-0 z-50 w-[1280px] h-[720px] bg-navy overflow-hidden">
                <div ref={captureRef} className="w-full h-full relative transform scale-[1]">
                    <MotionConfig transition={{ duration: 0 }}>
                        <SlideRenderer key={currentSlide} slideIndex={currentSlide} isExportMode={true} />
                    </MotionConfig>
                </div>
            </div>

            {/* Overlay */}
            <div
                className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center text-white backface-hidden transform-gpu"
                style={{ backgroundColor: '#0a0f1e' }}
            >
                <h2 className="text-3xl font-syne font-bold text-gold mb-8">Exporting to PowerPoint</h2>

                {/* Progress Bar */}
                <div className="w-[400px] h-2 bg-white/10 rounded-full overflow-hidden mb-8">
                    <div
                        className="h-full bg-teal transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="font-mono text-sm text-teal/80 mb-12">{status}</p>

                {downloadUrl ? (
                    <button
                        onClick={handleDownloadClick}
                        className="px-12 py-4 rounded-full bg-teal text-navy font-bold text-lg tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(45,212,191,0.3)] animate-bounce"
                    >
                        SAVE FILE
                    </button>
                ) : (
                    <button
                        onClick={handleCancel}
                        className="absolute bottom-24 px-8 py-3 rounded-full border border-rose text-rose font-mono text-sm uppercase tracking-widest hover:bg-rose/10 transition-all"
                    >
                        Cancel Export
                    </button>
                )}
            </div>
        </>
    );
}
