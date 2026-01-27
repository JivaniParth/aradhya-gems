/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4AF37", // Gold
          hover: "#B5952F",
          light: "#E5C860"
        },
        secondary: {
          DEFAULT: "#0F172A", // Deep Blue/Black
          foreground: "#F8FAFC"
        },
        accent: "#F4F4F5",
        background: "#FFFFFF",
        foreground: "#0F172A",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
