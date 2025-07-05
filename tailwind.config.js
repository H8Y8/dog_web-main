/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf8e9',
          100: '#f9ecc8',
          200: '#f5dfa7',
          300: '#f0d286',
          400: '#ecc565',
          500: '#e8b744', // 更明亮的金黃色
          600: '#ba9236',
          700: '#8b6e29',
          800: '#5d491b',
          900: '#ffffff',
        },
        earth: {
          50: '#fcf9f5',
          100: '#f5ece0',
          200: '#eddfcc',
          300: '#e6d2b7',
          400: '#dfc5a3',
          500: '#d8b88e', // 更柔和的大地色
          600: '#ad9371',
          700: '#826e55',
          800: '#564938',
          900: '#2b251c',
        },
        nature: {
          50: '#f4f9e8',
          100: '#e3efc3',
          200: '#d2e59e',
          300: '#c1db79',
          400: '#b0d154',
          500: '#9fc72f', // 更鮮豔的自然綠
          600: '#7f9f26',
          700: '#5f771c',
          800: '#404f13',
          900: '#202809',
        },
      },
    },
  },
  plugins: [],
}; 