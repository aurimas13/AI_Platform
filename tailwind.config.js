/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // Atelier paper palette — warm cream paper
        paper: {
          DEFAULT: '#F1E8CE',
          light: '#F7EEDA',
          edge: '#E5D9B6',
          deep: '#D8C99E',
        },
        // Ink — the deep stone-black for type
        ink: {
          DEFAULT: '#1C1714',
          soft: '#3A3026',
        },
        stone: {
          DEFAULT: '#6B5F4F',
          light: '#8C8071',
          mute: '#A89C88',
        },
        // Brass — primary accent (with legacy shade aliases for compat)
        brass: {
          DEFAULT: '#9C6A1F',
          bright: '#C8943B',
          deep: '#6B4612',
          tint: '#F5E6C7',
          foil: '#E8CD8B',
          // Legacy shades — preserved so older surfaces keep working
          50: '#FBF5E9',
          100: '#F5E6C7',
          200: '#EACD8F',
          300: '#DBB05B',
          400: '#C8943B',
          500: '#A87627',
          600: '#9C6A1F',
          700: '#6B4612',
        },
        rule: {
          DEFAULT: '#C7B786',
          soft: 'rgba(199, 183, 134, 0.45)',
        },
        // Sharp accents — use sparingly
        vermilion: '#B8412A',
        ember: '#E37A52',
        // Workspace dark theme
        void: {
          DEFAULT: '#14110D',
          soft: '#1F1A14',
          elev: '#2A241B',
        },
        bone: {
          DEFAULT: '#E8DFC9',
          soft: '#B8AC92',
        },
        // Legacy aliases — kept so older components keep working during phased redesign.
        cream: {
          50: '#F8F1E0',
          100: '#F1E8CE',
          200: '#E5D9B6',
          300: '#D8C99E',
          400: '#C7B786',
        },
      },
      borderRadius: {
        // Editorial = sharp corners. Override defaults.
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '3px',
        xl: '4px',
        '2xl': '6px',
      },
      boxShadow: {
        press: '0 1px 0 0 rgba(28, 23, 20, 0.04), 0 2px 8px -2px rgba(28, 23, 20, 0.06)',
        'press-hover':
          '0 1px 0 0 rgba(28, 23, 20, 0.06), 0 6px 18px -3px rgba(28, 23, 20, 0.10), 0 2px 4px -1px rgba(28, 23, 20, 0.05)',
        // Legacy aliases
        card: '0 1px 0 0 rgba(28, 23, 20, 0.04), 0 2px 8px -2px rgba(28, 23, 20, 0.06)',
        'card-hover':
          '0 1px 0 0 rgba(28, 23, 20, 0.06), 0 6px 18px -3px rgba(28, 23, 20, 0.10)',
        'card-lg':
          '0 2px 0 0 rgba(28, 23, 20, 0.06), 0 12px 32px -6px rgba(28, 23, 20, 0.14)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};
