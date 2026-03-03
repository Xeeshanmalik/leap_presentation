import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameStateProvider } from "./hooks/useGameState";
import AudienceView from "./components/Shared/AudienceView";
import PresenterView from "./components/Presenter/PresenterView";
import AudienceQuizPage from "./pages/AudienceQuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/presenter" element={
          <GameStateProvider role="presenter">
            <PresenterView />
          </GameStateProvider>
        } />
        {/* Audience quiz page — scan QR code to join */}
        <Route path="/quiz" element={<AudienceQuizPage />} />
        <Route path="/" element={
          <GameStateProvider role="audience">
            <AudienceView />
          </GameStateProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
