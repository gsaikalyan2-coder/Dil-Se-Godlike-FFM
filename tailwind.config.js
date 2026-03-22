/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        'dark-card': '#111111',
        'dark-border': '#1a1a1a',
        accent: '#FF6B00',
        'accent-dark': '#cc5500',
        grey: '#888888',
        'grey-light': '#aaaaaa',
        win: '#22c55e',
        loss: '#ef4444',
        'upcoming-blue': '#3b82f6',
        gold: '#c9a84c',
        'gold-dark': '#a68a3e',
        'gold-light': '#e0c872',
        brown: '#8b6914',
        'brown-light': '#b8860b',
        'roster-bg': '#0d0d0f',
        'roster-card': '#141416',
        'roster-border': '#2a2520',
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FF6B00, 0 0 10px #FF6B00' },
          '100%': { boxShadow: '0 0 20px #FF6B00, 0 0 40px #FF6B00' },
        },
      },
    },
  },
  plugins: [],
};
