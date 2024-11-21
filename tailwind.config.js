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
            'crema': '#F4F1E1',           
            'cafe-oscuro': '#4E3629',      
            'cafe-claro': '#8B6B4B',       
            'verde-oliva': '#6B8E23',      
            'azul-grisaceo': '#5F6A8C',    
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