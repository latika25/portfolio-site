/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens for the constellation theme — deep space navy base,
        // one accent per node category so the graph is legible at a glance.
        space: {
          DEFAULT: '#0a0e17',
          surface: '#10151f',
          border: '#1e2733',
        },
        pulse: '#5eead4', // cyan — connections / data pulses / core
        amber: '#f0b429', // experience nodes
        coral: '#ec6a5e', // project nodes
        violet: '#8b5cf6', // skill nodes
        ink: {
          100: '#e6edf3',
          400: '#8b98a9',
          600: '#5b6675',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
