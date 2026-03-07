/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../lib/firebase";

const GameStateContext = createContext();

export const GameStateProvider = ({ children, role = "audience" }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [slideData, setSlideDataState] = useState({}); // Stores arbitrary slide states
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const isFirebaseConfigured = () => {
            const key = import.meta.env.VITE_FIREBASE_API_KEY || "";
            return key.length > 10 && !key.startsWith("your-");
        };

        let unsubscribe = () => { };

        if (isFirebaseConfigured()) {
            const stateRef = ref(db, "presentation/state");
            const unsubscribeHandler = onValue(stateRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (data.currentSlideIndex !== undefined) setCurrentSlideIndex(data.currentSlideIndex);
                    if (data.slideData !== undefined) setSlideDataState(data.slideData || {});
                }
            });
            unsubscribe = () => unsubscribeHandler();
        }

        // MOCK MODE: Sync state via LocalStorage for same-device demo
        const handleStorageChange = (e) => {
            if (e.key === "leap_currentSlideIndex") {
                setCurrentSlideIndex(Number(e.newValue));
            }
            if (e.key === "leap_slideData") {
                setSlideDataState(JSON.parse(e.newValue || "{}"));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Initialize from storage
        const savedSlide = localStorage.getItem("leap_currentSlideIndex");
        if (savedSlide) setCurrentSlideIndex(Number(savedSlide));

        const savedSlideData = localStorage.getItem("leap_slideData");
        if (savedSlideData) setSlideDataState(JSON.parse(savedSlideData));

        setIsConnected(true);

        return () => {
            unsubscribe();
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const isFirebaseConfigured = () => {
        const key = import.meta.env.VITE_FIREBASE_API_KEY || "";
        return key.length > 10 && !key.startsWith("your-");
    };

    // Presenter actions
    const setSlide = async (index) => {
        if (role !== "presenter") return;
        localStorage.setItem("leap_currentSlideIndex", index);
        localStorage.setItem("leap_slideData", "{}"); // Clear slide data on slide change

        setCurrentSlideIndex(index);
        setSlideDataState({});

        if (isFirebaseConfigured()) {
            await set(ref(db, "presentation/state"), {
                currentSlideIndex: index,
                slideData: {}
            }).catch(console.warn);
        }
    };

    const setSlideData = async (index, data) => {
        if (role !== "presenter") return;

        const newSlideData = { [index]: data };
        localStorage.setItem("leap_slideData", JSON.stringify(newSlideData));
        setSlideDataState(newSlideData);

        if (isFirebaseConfigured()) {
            await set(ref(db, "presentation/state/slideData"), newSlideData).catch(console.warn);
        }
    };

    return (
        <GameStateContext.Provider
            value={{
                currentSlideIndex,
                slideData,
                isConnected,
                setSlide,
                setSlideData,
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
