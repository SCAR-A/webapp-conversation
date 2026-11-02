/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      colors: {
        gray: {
          50: '#F7F8FA',
          100: '#F5F6F8',
          200: '#E4E6EB',
          300: '#D0D2D8',
          400: '#9A9BA0',
          500: '#6A6B70',
          700: '#3A3B40',
          800: '#1A1B1E',
          900: '#1A1B1E',
        },
        primary: {
          50: '#EBEFFF',
          100: '#E0E7FF',
          200: '#C5CDFF',
          300: '#A4B2FE',
          600: '#4D6BFE',
          700: '#3B57E0',
        },
        blue: {
          500: '#EBEFFF',
          600: '#4D6BFE',
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',
        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
        purple: {
          50: '#F6F5FF',
        },
        indigo: {
          25: '#F7F8FA',
          100: '#E4E6EB',
          600: '#4D6BFE',
        },
        ds: {
          blue: '#4D6BFE',
          'blue-pressed': '#3B57E0',
          'blue-soft': '#EBEFFF',
          canvas: '#FFFFFF',
          surface: '#F5F6F8',
          divider: '#E4E6EB',
        },
      },
      screens: {
        mobile: '100px',
        // => @media (min-width: 100px) { ... }
        tablet: '640px',
        // => @media (min-width: 640px) { ... }
        pc: '769px',
        // => @media (min-width: 769px) { ... }
      },
      borderRadius: {
        'ds-bubble': '18px',
        'ds-pill': '24px',
      },
      maxWidth: {
        chat: '800px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
