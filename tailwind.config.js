/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#22d3ee', // Cyan-400
                    hover: '#06b6d4',   // Cyan-500
                },
                dark: {
                    bg: '#0f172a',
                    card: '#1e293b',
                    text: '#f1f5f9',
                    muted: '#94a3b8'
                }
            },
            fontFamily: {
                sans: ['Quicksand', 'Nunito', 'sans-serif'],
                serif: ['Iowan Old Style', 'serif'],
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
