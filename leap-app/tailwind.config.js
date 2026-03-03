/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0a0f1e',
                    50: '#0d1528',
                    100: '#111c35',
                },
                teal: {
                    DEFAULT: '#00d4ff',
                    dark: '#00a8cc',
                },
                gold: {
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                rose: {
                    DEFAULT: '#f43f5e',
                },
                purple: {
                    DEFAULT: '#8b5cf6',
                },
            },
            fontFamily: {
                syne: ['Syne', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                dm: ['DM Sans', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
