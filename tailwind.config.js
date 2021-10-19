const typography = require('@tailwindcss/typography');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4db6ac',
        secondary: '#3c938b',
        'dark-primary': '#f00',
        'dark-secondary': '#0f0',
      },
      typography: (theme) => ({
        light: {
          css: [
            {
              color: theme('colors.gray.300'),
              h1: {
                color: theme('colors.white'),
                marginTop: 0,
              },
              h2: {
                color: theme('colors.white'),
                marginTop: 0,
              },
              h3: {
                color: theme('colors.white'),
                marginTop: 0,
              },
              h4: {
                color: theme('colors.white'),
                marginTop: 0,
              },
              b: {
                color: theme('colors.white'),
              }
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [
    typography,
  ],
};
