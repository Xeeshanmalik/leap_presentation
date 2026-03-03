/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../lib/firebase";

const GameStateContext = createContext();

export const GameStateProvider = ({ children, role = "audience" }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [quizStatus, setQuizStatus] = useState("inactive"); // inactive, active, closed
    const [playerScores, setPlayerScores] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // MOCK MODE: Sync state via LocalStorage for same-device demo
        const handleStorageChange = (e) => {
            if (e.key === "leap_currentSlideIndex") {
                setCurrentSlideIndex(Number(e.newValue));
            }
            if (e.key === "leap_quizStatus") {
                setQuizStatus(e.newValue);
            }
            if (e.key === "leap_playerScores") {
                setPlayerScores(JSON.parse(e.newValue || "{}"));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Initialize from storage
        const savedSlide = localStorage.getItem("leap_currentSlideIndex");
        if (savedSlide) setCurrentSlideIndex(Number(savedSlide));

        setIsConnected(true);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Presenter actions
    const setSlide = async (index) => {
        if (role !== "presenter") return;
        localStorage.setItem("leap_currentSlideIndex", index);
        // Dispatch event manually for the current window (storage event only fires for OTHER windows)
        // Actually, we don't need to dispatch for current window if we update state directly in the component calling this?
        // But for consistency let's update local state too if we were relying on the hook.
        // However, standard React pattern: optimistic update or wait for single source of truth.
        // For LocalStorage, we must update state manually in the setter because 'storage' event doesn't fire on the tab that set the item.
        setCurrentSlideIndex(index);

        // Simulating Firebase 'set' - no async really needed but keeping signature
        return Promise.resolve();
    };

    const setQuizState = async (status) => {
        if (role !== "presenter") return;
        localStorage.setItem("leap_quizStatus", status);
        setQuizStatus(status);
        return Promise.resolve();
    };

    return (
        <GameStateContext.Provider
            value={{
                currentSlideIndex,
                quizStatus,
                playerScores,
                isConnected,
                setSlide,
                setQuizState,
                role,
            }}
        >
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error("useGameState must be used within a GameStateProvider");
    }
    return context;
};
