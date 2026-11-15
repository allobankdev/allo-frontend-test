/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Deep-space neutrals (navy-tinted blacks) for backgrounds, panels and hairlines.
        space: {
          950: '#04060b',
          900: '#080c16',
          850: '#0c1220',
          800: '#111a2c',
          700: '#1b2640',
          600: '#2a3754',
        },
        // Single accent: engine-flame orange.
        flare: {
          300: '#ffb48a',
          400: '#ff8a4c',
          500: '#ff6a1f',
          600: '#e5530c',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Barlow Condensed"', '"IBM Plex Sans"', 'sans-serif'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(250%)' },
        },
      },
      animation: {
        scan: 'scan 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
