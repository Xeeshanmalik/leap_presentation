import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, useParams } from "react-router-dom";
import { GameStateProvider } from "./hooks/useGameState";
import AudienceView from "./components/Audience/AudienceView";
import PresenterView from "./components/Presenter/PresenterView";
import SlideRenderer from "./components/Shared/SlideRenderer";

const TestView = () => {
    const { id } = useParams();
    return (
        <div className="w-screen h-screen bg-bg text-text">
            <SlideRenderer slideIndex={parseInt(id) || 0} />
        </div>
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("presentationAuth") === "true";
    });
    const [passwordInput, setPasswordInput] = useState("");

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput.toLowerCase() === "future") {
            setIsAuthenticated(true);
            sessionStorage.setItem("presentationAuth", "true");
        } else {
            alert("Incorrect password. Hint: Try 'future'");
            setPasswordInput("");
        }
    };

    const isTestRoute = window.location.hash.startsWith('#/test') || window.location.pathname.startsWith('/test');

    if (!isAuthenticated && !isTestRoute) {
        return (
            <div className="w-full h-screen bg-bg text-text font-outfit flex items-center justify-center p-8">
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6 max-w-sm w-full bg-card p-10 rounded-xl border border-border shadow-2xl">
                    <div className="text-center mb-4">
                        <div className="font-playfair text-2xl font-bold mb-2 text-t">Future of AI</div>
                        <p className="text-muted text-sm">Protected Access</p>
                    </div>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password"
                        className="bg-black/50 border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-t transition-colors text-center text-lg tracking-widest"
                        autoFocus
                    />
                    <button type="submit" className="bg-t/20 hover:bg-t/30 text-t border border-t/30 rounded-lg px-4 py-3 font-medium transition-colors uppercase tracking-widest text-sm">
                        Unlock Presentation
                    </button>
                </form>
            </div>
        );
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/test/:id" element={<TestView />} />
                <Route path="/presenter" element={
                    <GameStateProvider role="presenter">
                        <PresenterView />
                    </GameStateProvider>
                } />
                <Route path="/" element={
                    <GameStateProvider role="audience">
                        <AudienceView />
                    </GameStateProvider>
                } />
            </Routes>
        </HashRouter>
    );
}

export default App;
