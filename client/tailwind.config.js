/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        base: '#070A12',
        'base-2': '#0D111C',
        card: '#111827',
        'card-hover': '#151E2E',
        border: 'rgba(255,255,255,0.08)',
        'border-hi': 'rgba(255,255,255,0.16)',
        ink: '#F8FAFC',
        'ink-dim': '#94A3B8',
        'ink-faint': '#5B6577',
        blue: '#3E7BFA',
        'blue-2': '#2F5FD6',
        violet: '#7C5CFC',
        cyan: '#5EEAD4',
        risk: {
          low: '#34D399',
          medium: '#FBBF24',
          high: '#F87171',
        },
        // --- Legacy aliases (old light "law-firm" theme) mapped onto the
        // new dark palette, so pages not yet fully rebuilt still render on-brand.
        ink: '#F8FAFC',
        slate: '#94A3B8',
        'slate-light': '#5B6577',
        action: '#3E7BFA',
        'action-2': '#2F5FD6',
        'action-50': 'rgba(62,123,250,0.12)',
        paper: '#070A12',
        gold: '#FBBF24',
        'gold-50': 'rgba(251,191,36,0.12)',
      },
      borderColor: {
        hairline: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['Manrope', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #3E7BFA 0%, #7C5CFC 100%)',
        'grad-radial': 'radial-gradient(circle at 30% 20%, rgba(62,123,250,0.16), transparent 60%)',
        'grad-glow': 'radial-gradient(circle, rgba(124,92,252,0.25), transparent 70%)',
        grid: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(62,123,250,0.3), 0 0 40px rgba(62,123,250,0.18)',
        'glow-violet': '0 0 0 1px rgba(124,92,252,0.3), 0 0 40px rgba(124,92,252,0.18)',
        float: '0 30px 60px -20px rgba(0,0,0,0.55)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-14px) rotateX(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(6px,-10px)' },
          '100%': { transform: 'translate(0,0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
=======
        ink: '#0a1a2e',
        'ink-2': '#14294a',
        action: '#2a5cdb',
        'action-2': '#2049b8',
        'action-50': '#eef3fc',
        paper: '#fafbfd',
        slate: '#56607a',
        'slate-light': '#8892a8',
        hairline: '#e1e6ef',
        gold: '#b8863a',
        'gold-50': '#fbf3e7',
      },
      fontFamily: {
        display: ['Times New Roman', 'Times', 'serif'],
        sans: ['Times New Roman', 'Times', 'serif'],
        mono: ['Times New Roman', 'Times', 'serif'],
>>>>>>> dc4d7f1e8e60cacd1884e15adc15a1307b3ec04a
      },
    },
  },
  plugins: [],
<<<<<<< HEAD
}
=======
}
>>>>>>> dc4d7f1e8e60cacd1884e15adc15a1307b3ec04a
