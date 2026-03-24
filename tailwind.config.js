/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020304',
        surface: 'rgba(4,12,8,0.55)',
        surface2: 'rgba(8,18,12,0.6)',
        border: 'rgba(0,255,80,0.12)',
        'border-bright': 'rgba(0,255,80,0.3)',
        accent: '#00ff52',
        accent2: '#00d4ff',
        accent3: '#ff3355',
        gold: '#f0c040',
        txt: '#c8e0d0',
        'txt-dim': '#3a5a44',
        'txt-bright': '#e0ffe8',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
        scanDown: 'scanDown 5s linear infinite',
        fadeUp: 'fadeUp 0.8s ease forwards',
        tickerScroll: 'tickerScroll 30s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        scanDown: {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
        fadeUp: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
