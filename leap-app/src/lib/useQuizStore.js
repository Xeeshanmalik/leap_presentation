/**
 * useQuizStore — Real-time quiz state sync.
 *
 * MODE SELECTION (automatic):
 *   - If VITE_FIREBASE_API_KEY is a real key (not placeholder) → Firebase RTDB
 *   - Otherwise → localStorage + BroadcastChannel (same-device demo)
 *
 * Firebase RTDB paths:
 *   quiz/state          — presenter writes { sectionIdx, questionIdx, status }
 *   quiz/players/{id}   — audience registers { name, joinedAt }
 *   quiz/answers/{id}   — audience submits  { score, answers:{}, answeredAt:{} }
 */

import { ref, set, get, onValue, off, push } from "firebase/database";
import { db } from "./firebase";

const CHANNEL_NAME = "leap_quiz_channel";
const STATE_KEY = "leap_quiz_state";
const ANSWERS_KEY = "leap_quiz_answers";
const PLAYERS_KEY = "leap_quiz_players";

// Detect if Firebase is actually configured (not placeholder values)
const isFirebaseConfigured = () => {
    const key = import.meta.env.VITE_FIREBASE_API_KEY || "";
    return key.length > 10 && !key.startsWith("your-");
};

let broadcastChannel = null;
if (typeof BroadcastChannel !== "undefined") {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
}

function broadcast(type, payload) {
    if (broadcastChannel) broadcastChannel.postMessage({ type, payload });
}

/* ═══════════════════════════════════════════════════
   LOCAL (same-device) IMPLEMENTATION
   ═══════════════════════════════════════════════════ */
function readLocal(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function readState() { return readLocal(STATE_KEY); }
export function readAnswers() { return readLocal(ANSWERS_KEY, {}); }
export function readPlayers() { return readLocal(PLAYERS_KEY, {}); }

/* ═══════════════════════════════════════════════════
   QUIZ ACTIONS — auto-route to Firebase or local
   ═══════════════════════════════════════════════════ */

async function writeState(patch) {
    const current = readState() || {};
    const next = { ...current, ...patch };
    writeLocal(STATE_KEY, next);
    broadcast("STATE_CHANGED", next);
    if (isFirebaseConfigured()) {
        await set(ref(db, "quiz/state"), next).catch(console.warn);
    }
}

export async function startSession() {
    const sessionId = Math.random().toString(36).slice(2, 10).toUpperCase();
    // Clear old answers/players
    writeLocal(ANSWERS_KEY, {});
    if (isFirebaseConfigured()) {
        await Promise.all([
            set(ref(db, "quiz/state"), { sessionId, status: "idle", sectionIdx: 0, questionIdx: 0 }),
            set(ref(db, "quiz/answers"), {}),
        ]).catch(console.warn);
    }
    writeLocal(STATE_KEY, { sessionId, status: "idle", sectionIdx: 0, questionIdx: 0 });
    broadcast("STATE_CHANGED", readState());
    return sessionId;
}

export function setActiveQuestion(sectionIdx, questionIdx) {
    return writeState({ status: "question", sectionIdx, questionIdx });
}

export function revealAnswer() {
    return writeState({ status: "revealing" });
}

export function setIdle() {
    return writeState({ status: "idle" });
}

export function showLeaderboard() {
    return writeState({ status: "leaderboard" });
}

export function resetSession() {
    writeLocal(STATE_KEY, null);
    writeLocal(ANSWERS_KEY, {});
    writeLocal(PLAYERS_KEY, {});
    broadcast("RESET", {});
    if (isFirebaseConfigured()) {
        set(ref(db, "quiz"), null).catch(console.warn);
    }
}

/* ─── Audience: join ─── */
export async function joinQuiz(playerId, name) {
    const players = readPlayers();
    players[playerId] = { name, joinedAt: Date.now() };
    writeLocal(PLAYERS_KEY, players);
    broadcast("PLAYER_JOINED", { playerId, name });
    if (isFirebaseConfigured()) {
        await set(ref(db, `quiz/players/${playerId}`), { name, joinedAt: Date.now() }).catch(console.warn);
    }
}

/* ─── Audience: submit answer ─── */
export async function submitAnswer(playerId, sectionIdx, questionIdx, optionIdx, isCorrect) {
    const answers = readAnswers();
    if (!answers[playerId]) answers[playerId] = { score: 0, answers: {}, answeredAt: {} };
    const key = `${sectionIdx}_${questionIdx}`;
    if (answers[playerId].answers[key] !== undefined) return false;
    answers[playerId].answers[key] = optionIdx;
    answers[playerId].answeredAt[key] = Date.now();
    if (isCorrect) answers[playerId].score = (answers[playerId].score || 0) + 1;
    writeLocal(ANSWERS_KEY, answers);
    broadcast("ANSWER_SUBMITTED", { playerId, key, optionIdx, isCorrect });
    if (isFirebaseConfigured()) {
        await set(ref(db, `quiz/answers/${playerId}`), answers[playerId]).catch(console.warn);
    }
    return true;
}

/* ─── Compute leaderboard from live data ─── */
export function getLeaderboard(liveAnswers, livePlayers) {
    // Use passed-in live data (from Firebase subscriptions) if available,
    // otherwise fall back to localStorage (local demo mode)
    const answers = liveAnswers ?? readAnswers();
    const players = livePlayers ?? readPlayers();
    return Object.entries(answers)
        .map(([pid, data]) => ({
            playerId: pid,
            name: players[pid]?.name || "Anonymous",
            score: data.score || 0,
            tiebreak: Object.values(data.answeredAt || {}).reduce((a, b) => a + b, 0),
        }))
        .sort((a, b) => b.score - a.score || a.tiebreak - b.tiebreak)
        .slice(0, 10);
}

/* ═══════════════════════════════════════════════════
   SUBSCRIPTIONS — localStorage+BroadcastChannel OR Firebase
   ═══════════════════════════════════════════════════ */

export function subscribeToState(cb) {
    if (isFirebaseConfigured()) {
        const r = ref(db, "quiz/state");
        onValue(r, snap => {
            const val = snap.val();
            if (val) { writeLocal(STATE_KEY, val); cb(val); }
        });
        return () => off(r);
    }
    // Local mode
    function fromStorage(e) { if (e?.key === STATE_KEY) cb(readState()); }
    function fromChannel(e) { if (["STATE_CHANGED", "RESET"].includes(e.data?.type)) cb(readState()); }
    window.addEventListener("storage", fromStorage);
    if (broadcastChannel) broadcastChannel.addEventListener("message", fromChannel);
    cb(readState());
    return () => {
        window.removeEventListener("storage", fromStorage);
        if (broadcastChannel) broadcastChannel.removeEventListener("message", fromChannel);
    };
}

export function subscribeToAnswers(cb) {
    if (isFirebaseConfigured()) {
        const r = ref(db, "quiz/answers");
        onValue(r, snap => {
            const val = snap.val() || {};
            writeLocal(ANSWERS_KEY, val);
            cb(val);
        });
        return () => off(r);
    }
    function fromStorage(e) { if (e?.key === ANSWERS_KEY) cb(readAnswers()); }
    function fromChannel(e) { if (e.data?.type === "ANSWER_SUBMITTED") cb(readAnswers()); }
    window.addEventListener("storage", fromStorage);
    if (broadcastChannel) broadcastChannel.addEventListener("message", fromChannel);
    cb(readAnswers());
    return () => {
        window.removeEventListener("storage", fromStorage);
        if (broadcastChannel) broadcastChannel.removeEventListener("message", fromChannel);
    };
}

export function subscribeToPayers(cb) {
    if (isFirebaseConfigured()) {
        const r = ref(db, "quiz/players");
        onValue(r, snap => {
            const val = snap.val() || {};
            writeLocal(PLAYERS_KEY, val);
            cb(val);
        });
        return () => off(r);
    }
    function fromStorage(e) { if (e?.key === PLAYERS_KEY) cb(readPlayers()); }
    function fromChannel(e) { if (e.data?.type === "PLAYER_JOINED") cb(readPlayers()); }
    window.addEventListener("storage", fromStorage);
    if (broadcastChannel) broadcastChannel.addEventListener("message", fromChannel);
    cb(readPlayers());
    return () => {
        window.removeEventListener("storage", fromStorage);
        if (broadcastChannel) broadcastChannel.removeEventListener("message", fromChannel);
    };
}
