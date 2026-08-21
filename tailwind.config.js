/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "sv-black": "#1E1E1E",
        "sv-white": "#FAF7F2",
        "sv-sky": "#9CCCFB",
        "sv-bloom": "#E9A0A7",
        "sv-shine": "#FCD4A8",
      },
      fontFamily: {
        display: ["Marcellus", "Georgia", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
