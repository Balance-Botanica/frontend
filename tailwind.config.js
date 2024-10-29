/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "brand-grey": {
          300: "#828282",
          DEFAULT: "#898989",
          500: "#B5B5B5",
          600: "#5E5E5E",
          800: "#383838",
        },
        "brand-beige": {
          100: "#E5E5E5",
          200: "#E3D9CD",
          300: "#EAE5E0",
          DEFAULT: "#E9BA9E",
        },
        "brand-brown-500": "#EB7D0F",
        "secondary-green": "#5F9EA0",
        "primary-green": "#005C46",
        "primary-beige": "#ffebd8",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Poppins", "sans-serif"],
        action: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        "action-btn": "100px",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["group-hover"],
      display: ["group-hover"],
    },
  },
  // plugins: [require("@tailwindcss/aspect-ratio")],
};
