// Navbar.jsx
// Import React, hooks, and motion.
import React, { useState } from "react";
import { motion } from "framer-motion";
// Import Lucide icons.
import { Sun, Moon } from "lucide-react";
// Import assets.
import profilePic from "./assets/captainbroccoli.png"; // Ensure this path is correct

/**
 * Navbar Component: Site navigation bar.
 * @param {object} props - Component props.
 * @param {function} props.setActiveSection - Callback to set active section.
 * @param {function} props.toggleDarkMode - Callback to toggle dark mode.
 * @param {boolean} props.isDarkMode - Current dark mode state.
 */
const Navbar = ({ setActiveSection, toggleDarkMode, isDarkMode }) => {
  // State for mobile menu visibility.
  const [isOpen, setIsOpen] = useState(false);
  // Navigation links data.
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "teaching", label: "Teaching" },
    { id: "scientist", label: "Career & Education" },
    { id: "publications", label: "Publications" },
    { id: "blender", label: "Blender Art" },
    { id: "cli", label: "CLI Tools" },
    { id: "contact", label: "Contact" },
  ];

  // Animation variants for hover effects.
  const navLinkHoverAnimation = {
    rotate: [0, -1.5, 1.5, -1.5, 1.5, 0],
    scale: 1.03,
    transition: { duration: 0.35, ease: "easeInOut" },
  };
  const brandHoverAnimation = {
    scale: [1, 1.02, 1, 1.02, 1],
    color: isDarkMode
      ? ["#e2e8f0", "#6ee7b7", "#e2e8f0"]
      : ["#FFFFFF", "#A7F3D0", "#FFFFFF"],
    transition: { duration: 0.5, ease: "easeInOut" },
  };

  return (
    <nav
      className="bg-emerald-600 dark:bg-slate-800 text-white sticky top-0 z-50 shadow-lg dark:shadow-black/30"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.img
              src={profilePic}
              alt="Filipe L. Q. Junqueira - Profile Picture"
              className="w-10 h-10 rounded-full mr-3 object-cover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              loading="lazy"
            />
            <motion.a
              href="#home"
              onClick={() => setActiveSection("home")}
              className="flex-shrink-0 text-xl md:text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 rounded-sm"
              whileHover={brandHoverAnimation}
            >
              Filipe L. Q. Junqueira
            </motion.a>
          </div>
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveSection(link.id);
                    setIsOpen(false);
                  }}
                  className="hover:bg-emerald-700/50 dark:hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800"
                  whileHover={navLinkHoverAnimation}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className="ml-6 p-2 rounded-full hover:bg-emerald-700/50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-slate-300 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800 transition-colors duration-200"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              whileHover={{ scale: 1.15, rotate: isDarkMode ? -15 : 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon size={20} className="text-slate-300" aria-hidden="true" />
              )}
            </motion.button>
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-emerald-100 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-emerald-700/50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-slate-300 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800 mr-2"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              whileHover={{ scale: 1.15, rotate: isDarkMode ? -15 : 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isDarkMode ? (
                <Sun size={22} className="text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon size={22} aria-hidden="true" />
              )}
            </motion.button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-emerald-700 dark:bg-slate-700/50 inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-600 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 dark:focus:ring-offset-slate-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setIsOpen(false);
                }}
                className="hover:bg-emerald-700/50 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800"
                whileHover={navLinkHoverAnimation}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
