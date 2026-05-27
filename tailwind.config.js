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
        // ── Brand colors — Espressolab identity, veri görsellerinde kullanılır ──
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
          light:   '#E8C479',
          dark:    '#A67820',
        },
        // ── System UI palette — Palantir intelligence aesthetic ───────────────
        navy: {
          DEFAULT: '#050810',
          light:   '#0a0f1e',
          lighter: '#0f1729',
          border:  '#1e2d4a',
          accent:  '#1e3a5f',
        },
        surface:  '#0a0f1e',
        surface2: '#0f1729',
        muted:    '#475569',
        // ── Accent system ─────────────────────────────────────────────────────
        accent:  '#0ea5e9',
        info:    '#0ea5e9',
        cyan:    '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger:  '#ef4444',
        intel:   '#818cf8',
        cream:   '#F5E6D3',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
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
        'gradient-navy':     'linear-gradient(180deg, #050810 0%, #0a0f1e 100%)',
        'gradient-card':     'linear-gradient(145deg, #0a0f1e 0%, #0f1729 100%)',
        'gradient-intel':    'linear-gradient(135deg, #0ea5e9 0%, #818cf8 100%)',
      },
    },
  },
  plugins: [],
}
