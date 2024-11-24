/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
      screens: {
          sm: "340px",
          md: "540px",
          lg: "768px",
          xl: "1180px"
      },
      extend: {
        colors: {
            'gris-claro': '#f7fafb',          
            'cafe-oscuro': '#392b1b',
            'cafe-intermedio': '#8d6f5b',
            'cafe-claro': '#c1b09d',
            'beige': '#ebebe4',
      }
    },
      fontFamily: {
          Jost: ["Jost", "sans-serif"],
          Lobster: ["Lobster", "sans-serif"]
      },
      container: {
          center: true,
          padding: {
              DEFAULT: "12px",
              md: "32px"
          }
      }
  },
  plugins: [],
}