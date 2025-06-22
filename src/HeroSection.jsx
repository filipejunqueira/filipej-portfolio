// HeroSection.jsx
// Import React and motion.
import React from "react";
import { motion } from "framer-motion";
// Import assets.
import profilePic from "./assets/captainbroccoli.png"; // Ensure this path is correct
import profilePicWebP from "./assets/captainbroccoli.webp"; // WebP version for optimization
import filipeCv from "./assets/filipecv.pdf"; // Ensure this path is correct
// Import OptimizedImage component
import OptimizedImage from "./OptimizedImage";

/**
 * HeroSection Component: The main landing/introduction section.
 */
const HeroSection = () => (
  <header
    id="home"
    className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-slate-800 dark:to-slate-900 text-white py-24 md:py-32"
    aria-labelledby="main-heading"
  >
    <div className="container mx-auto text-center px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 120,
        }}
        className="mb-8"
      >
        <OptimizedImage
          src={profilePic}
          webpSrc={profilePicWebP}
          alt="Filipe L. Q. Junqueira - Main Profile Picture"
          className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover shadow-2xl border-4 border-white/80 dark:border-slate-400/50"
          priority={true}
          sizes="(max-width: 768px) 144px, 176px"
        />
      </motion.div>
      <motion.h1
        id="main-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 dark:text-slate-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Filipe L. Q. Junqueira
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl md:text-2xl font-normal mb-4 text-emerald-100 dark:text-slate-300 opacity-95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Research Associate, School of Physics and Astronomy, University of
        Nottingham
      </motion.p>
      <motion.p
        className="text-base sm:text-lg md:text-xl mb-10 text-emerald-200 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Density Functional Theory, 3D printing with atoms, NC-AFM & STM, and
        Machine Learning in nanoscience.
      </motion.p>
      <motion.a
        href={filipeCv}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-emerald-600 dark:bg-emerald-500 dark:text-white font-medium py-3 px-8 rounded-md text-base uppercase tracking-wider hover:bg-emerald-50 dark:hover:bg-emerald-600 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-300 focus:ring-offset-white dark:focus:ring-offset-emerald-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        whileHover={{
          scale: 1.05,
          rotate: [0, -1, 1, -1, 1, 0],
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          transition: { rotate: { duration: 0.3, ease: "easeInOut" } },
        }}
      >
        View Full CV
      </motion.a>
    </div>
  </header>
);

export default HeroSection;
