/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    
    extend: {
      colors: {
        "primary-white": "#Ffff",
        "secondary-light-blue": "#21529a",
        "third-blue": "#27c3f4",
        "frouth-red": "#FF0000",
      },
      fontFamily:{
        'primary_poppins': ['Poppins', 'sans-seri'],
        'secondary_roboto': ['Roboto', 'sans-seri'],
      }
    },
  },
  plugins: [],
};
