const typography = require('@tailwindcss/typography');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  important: 'html',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    typography,
  ],
};
