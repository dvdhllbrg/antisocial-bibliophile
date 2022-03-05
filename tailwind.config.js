const typography = require("@tailwindcss/typography");

module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4db6ac",
        secondary: "#3c938b",
        "dark-primary": "#f00",
        "dark-secondary": "#0f0",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              marginTop: 0,
            },
            h2: {
              marginTop: 0,
            },
            h3: {
              marginTop: 0,
            },
            h4: {
              marginTop: 0,
            },
          },
        },
        light: {
          css: [
            {
              color: theme("colors.gray.300"),
              h1: {
                color: theme("colors.white"),
              },
              h2: {
                color: theme("colors.white"),
              },
              h3: {
                color: theme("colors.white"),
              },
              h4: {
                color: theme("colors.white"),
              },
              b: {
                color: theme("colors.white"),
              },
            },
          ],
        },
      }),
    },
  },
  plugins: [typography],
};
