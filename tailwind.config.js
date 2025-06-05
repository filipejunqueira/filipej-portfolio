/** @type {import('tailwindcss').Config} */

// Import the defaultTheme to access Tailwind's default font stack
import defaultTheme from "tailwindcss/defaultTheme.js";

export default {
  // Add darkMode strategy: 'class'
  // This tells Tailwind to apply dark mode styles when a 'dark' class
  // is present on the <html> element (which we'll manage with JavaScript).
  darkMode: "class",
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
      // Optional: You can define some dark mode specific color palettes here if you want
      // to create reusable color names for your dark theme. For example:
      // colors: {
      //   'brand-dark-bg': '#1a202c', // A very dark gray/blue
      //   'brand-dark-card': '#2d3748', // A slightly lighter dark gray/blue for cards
      //   'brand-dark-text': '#e2e8f0', // A light gray for text in dark mode
      // }
    },
  },
  plugins: [],
};
