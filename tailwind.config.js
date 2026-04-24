/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF6',
          100: '#FAF6ED',
          200: '#F4ECD9',
          300: '#EADDBE',
          400: '#DCC89A',
        },
        brass: {
          50: '#FBF5E9',
          100: '#F5E6C7',
          200: '#EACD8F',
          300: '#DBB05B',
          400: '#C8943B',
          500: '#A87627',
          600: '#845B1E',
          700: '#604316',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px 0 rgba(28, 25, 23, 0.03)',
        'card-hover': '0 4px 12px -2px rgba(28, 25, 23, 0.08), 0 2px 4px -1px rgba(28, 25, 23, 0.04)',
        'card-lg': '0 8px 24px -4px rgba(28, 25, 23, 0.10), 0 4px 8px -2px rgba(28, 25, 23, 0.05)',
      },
    },
  },
  plugins: [],
};
