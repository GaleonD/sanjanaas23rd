/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-gentle': 'bounce-gentle 3s ease-in-out infinite',
        'float': 'float 12s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'confetti-pop': 'confetti-pop 1.8s forwards',
        'reveal': 'reveal 2s forwards',
      },
    },
  },
  plugins: [],
}