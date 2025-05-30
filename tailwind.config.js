/** @type {import('tailwindcss').Config} */

// Import the defaultTheme to access Tailwind's default font stack
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Your existing custom spacing
      spacing: {
        temp: "1px",
      },
      // Add the fontFamily extension here
      fontFamily: {
        // This sets 'Open Sans' as the primary sans-serif font.
        // The '...defaultTheme.fontFamily.sans' part adds Tailwind's default
        // sans-serif fonts as fallbacks, which is good practice.
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
