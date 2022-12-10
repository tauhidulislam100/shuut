/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
      mdMax: {
        max: "1023px",
      },
    },
    extend: {
      colors: {
        primary: "#090F47",
        "primary-100": "#0A2429",
        "primary-200": "#1B1C20",
        secondary: "#4436AC",
        body: "#383A47",
        "body-light": "#E8E8E8",
        "body-50": "#444444",
        "body-100": "#133240",
        "body-200": "#263238",
      },
      fontFamily: {
        outfit: ["'Outfit'", "sans-serif"],
        "sofia-pro": ["'Sofia Pro'", "sans-serif"],
        lota: ["'Lota Grotesque'", "sans-serif"],
        "lota-it": ["'Lota Grotesque It'", "sans-serif"],
        "lota-light-it": ["'Lota Grotesque Light It'", "sans-serif"],
        "lota-extra-light-it": [
          "'Lota Grotesque Extra Light It'",
          "sans-serif",
        ],
        "lota-semibold-it": ["'Lota Grotesque Semi Bold It'", "sans-serif"],
        "lota-semibold": ["'Lota Grotesque Semi'", "sans-serif"],
        "lota-thin-it": ["'Lota Grotesque Thin It'", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "profile-bg": "url('/images/profile_bg.png')",
        "activity-strip": "url('/images/strip.svg')",
      },
    },
  },
  plugins: [],
};
