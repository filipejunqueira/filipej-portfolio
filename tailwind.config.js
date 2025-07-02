/** @type {import('tailwindcss').Config} */

// Import the defaultTheme to access Tailwind's default font stack
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  // Add darkMode strategy: 'class'
  // This tells Tailwind to apply dark mode styles when a 'dark' class
  // is present on the <html> element (which we'll manage with JavaScript).
  darkMode: "class",
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    // Safelist ensures UI components always work
    { pattern: /^(bg|text|border)-(slate|emerald|gray|sky)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /^(focus|hover):(ring|bg|border|text)-(emerald|slate)-(300|400|500|600)/ },
  ],
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
      // Add CSS custom properties for theme switching optimization
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        },
        surface: {
          50: 'rgb(var(--color-surface-50) / <alpha-value>)',
          100: 'rgb(var(--color-surface-100) / <alpha-value>)',
          800: 'rgb(var(--color-surface-800) / <alpha-value>)',
          900: 'rgb(var(--color-surface-900) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
