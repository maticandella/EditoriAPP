/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}" // Cambiado para incluir todos los archivos dentro de src
  ],
  theme: {
      screens: {
          sm: "340px",
          md: "540px",
          lg: "768px",
          xl: "1180px"
      },
      extend: {},
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