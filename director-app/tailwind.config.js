/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#04070f',
                surface: '#080f1e',
                card: '#0c1628',
                border: 'rgba(255,255,255,0.07)',
                text: '#dce8ff',
                muted: '#5b7499',
                dim: '#2a3a55',
                t: '#38bdf8', /* Transformer */
                x: '#fb923c', /* xLSTM */
                l: '#4ade80', /* LNN */
                d: '#c084fc', /* Dragon */
                ts: '#f472b6', /* Time series */
                lang: '#38bdf8', /* Language */
                vis: '#fbbf24', /* Vision */
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                playfair: ['"Playfair Display"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
