/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: '#2C1810',
          50:  '#F5E6D3',
          100: '#E8C9A0',
          200: '#D4A96A',
          300: '#C4922A',
          400: '#A67820',
          500: '#2C1810',
          600: '#1E100A',
          700: '#140B07',
        },
        caramel: {
          DEFAULT: '#C4922A',
          light:   '#D9A83C',
          dark:    '#A67820',
        },
        navy: {
          DEFAULT: '#070B11',
          light:   '#0C1420',
          lighter: '#111C2E',
          border:  '#19263A',
        },
        cream:    '#F5E6D3',
        surface:  '#0C1420',
        surface2: '#111C2E',
        muted:    '#5C7094',
        accent:   '#C4922A',
        success:  '#22C55E',
        warning:  '#F59E0B',
        danger:   '#EF4444',
        info:     '#3B82F6',
      },
      fontFamily: {
        sans:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll-left': 'scrollLeft 40s linear infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-in':    'slideIn 0.3s ease-out',
      },
      keyframes: {
        scrollLeft: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-espresso': 'linear-gradient(135deg, #2C1810 0%, #C4922A 100%)',
        'gradient-navy':     'linear-gradient(180deg, #0F1624 0%, #1A2235 100%)',
        'gradient-card':     'linear-gradient(145deg, #1A2235 0%, #232F45 100%)',
      },
    },
  },
  plugins: [],
}
