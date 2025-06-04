// Footer.jsx
// Import React.
import React from "react";

/**
 * Footer Component: The standard site footer.
 */
const Footer = () => (
  <footer className="bg-emerald-700 dark:bg-slate-800 text-emerald-100 dark:text-slate-300 py-10 text-center">
    <div className="container mx-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Filipe L. Q. Junqueira. All rights
        reserved.
      </p>
      <p className="text-xs mt-2 opacity-80 dark:opacity-70">
        Crafted with React, Tailwind CSS, Framer Motion &amp; Love :-)
      </p>
    </div>
  </footer>
);

export default Footer;
