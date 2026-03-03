import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "../../hooks/useGameState";
import { questions } from "../../data/questions";
import { ref, push, serverTimestamp } from "firebase/database";
import { db } from "../../lib/firebase";

export default function QuizOverlay() {
    const { quizStatus, currentSlideIndex, role } = useGameState();
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Reset local state when slide changes
    useEffect(() => {
        setSelectedOption(null);
        setHasSubmitted(false);
    }, [currentSlideIndex]);

    if (quizStatus !== "active") return null;

    const currentQuestion = questions[currentSlideIndex];
    if (!currentQuestion) return null;

    const handleOptionClick = async (index) => {
        if (hasSubmitted) return;

        setSelectedOption(index);
        setHasSubmitted(true);

        // Send answer to Firebase
        // Assuming an anonymous user ID or generating one stored in localStorage
        const userId = localStorage.getItem("userId") || Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);

        const isCorrect = index === currentQuestion.correct;

        // Push answer
        try {
            await push(ref(db, `quizAnswers/${currentQuestion.id}`), {
                userId,
                answerIndex: index,
                isCorrect,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Error submitting answer:", e);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white"
            >
                <div className="text-teal font-mono text-sm tracking-[3px] uppercase mb-8 animate-pulse">
                    // LIVE INTERACTIVE QUIZ
                </div>

                <h1 className="text-3xl md:text-5xl font-syne font-bold text-center mb-12 max-w-4xl leading-tight">
                    {currentQuestion.question}
                </h1>

                <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            disabled={hasSubmitted}
                            className={`p-6 rounded-xl text-lg font-medium transition-all border ${hasSubmitted
                                ? (index === selectedOption
                                    ? (index === currentQuestion.correct
                                        ? "bg-teal/20 border-teal text-teal shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                                        : "bg-rose/20 border-rose text-rose")
                                    : "bg-white/5 border-transparent opacity-30")
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-teal/50 hover:shadow-lg"
                                }`}
                        >
                            <span className="font-mono opacity-50 mr-4">{String.fromCharCode(65 + index)}.</span>
                            {option}
                        </button>
                    ))}
                </div>

                {hasSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 text-2xl font-bold font-syne"
                    >
                        {selectedOption === currentQuestion.correct ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-5xl">🎉</span>
                                <span className="text-teal drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">Correct! +100pts</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-5xl">❌</span>
                                <span className="text-rose">Incorrect</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
