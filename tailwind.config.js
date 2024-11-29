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
            'gris-claro': '#ffffff',          
            'cafe-oscuro': "#382110ff",
            'cafe-intermedio': '#baac9a',
            'cafe-claro': '#f4f1ea',
            'beige': '#ebebe4',
            'oliva': '#616f54',
            'verde': '#409970',
            'amarillo': '#ffd767'
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
  plugins: [
    require('@tailwindcss/line-clamp'),
  ]
}