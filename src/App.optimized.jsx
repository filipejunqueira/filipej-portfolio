// App.jsx - Optimized version without Firebase
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

// --- Component Imports ---
import AnimatedSection from "./AnimatedSection";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutMeSection from "./AboutMeSection";
import SkillsSection from "./SkillsSection";
import TeachingSection from "./TeachingSection";
import ScientistCareer from "./ScientistCareer";
import PublicationsSection from "./PublicationsSection";
import BlenderCreations from "./BlenderCreations";
import CLIToolsSection from "./CLIToolsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import SkipToContent from "./components/SkipToContent";

// --- Custom Hooks ---
import { useDarkMode } from "./hooks/useDarkMode";

// --- Animation Variants ---
const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

const fadeInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

/**
 * App Component: The root component of the application.
 */
function App() {
  // Use custom dark mode hook instead of Firebase
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  
  // State for active navigation section
  const [activeSection, setActiveSection] = useState("home");

  // SEO: Structured Data
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Filipe L. Q. Junqueira",
    url: "https://filipej.dev",
    image: "https://filipej.dev/og-image.png",
    jobTitle: "Research Associate",
    worksFor: {
      "@type": "Organization",
      name: "University of Nottingham",
      sameAs: "https://www.nottingham.ac.uk/physics/",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Nottingham" },
      { "@type": "CollegeOrUniversity", name: "King's College London" },
      {
        "@type": "CollegeOrUniversity",
        name: "Polytechnic School of Engineering, University of São Paulo",
      },
    ],
    knowsAbout: [
      "Nanoscience",
      "3D printing with atoms",
      "NC-AFM",
      "STM",
      "DFT",
      "Machine Learning",
      "Blender 3D Art",
      "Python",
      "Scientific Visualization",
      "Physics",
      "Computational Physics",
    ],
    sameAs: [
      "https://www.linkedin.com/in/filipejunqueira/",
      "https://github.com/filipejunqueira",
      "https://x.com/CaptBroccoli",
    ],
    description:
      "Portfolio of Filipe L. Q. Junqueira, showcasing research in nanoscience, 3D atomic printing, advanced microscopy (NC-AFM/STM), Density Functional Theory (DFT), machine learning applications, Blender 3D art, and custom CLI tool development for scientific workflows.",
    nationality: { "@type": "Country", name: "Brazilian" },
  };

  // Section Scrolling Effect
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const sectionIdToScroll =
      hash || (activeSection !== "home" ? activeSection : null);

    if (sectionIdToScroll) {
      const element = document.getElementById(sectionIdToScroll);
      if (element) {
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 24;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        if (hash && hash !== activeSection) {
          setActiveSection(hash);
        }
      }
    } else if (activeSection === "home" && !hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]); // Simplified dependency array

  // Main App Render
  return (
    <div className="font-sans bg-emerald-50/50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 min-h-screen transition-colors duration-300">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personStructuredData)}
        </script>
        <title>
          Filipe L. Q. Junqueira - Portfolio | Nanoscience & Development
        </title>
        <meta name="description" content={personStructuredData.description} />
      </Helmet>

      <SkipToContent targetId="main-content" />
      
      <Navbar
        setActiveSection={setActiveSection}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <HeroSection />

      <main 
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12"
        tabIndex="-1"
        role="main"
        aria-label="Main content"
      >
        <AnimatedSection
          id="about-animated-wrapper"
          variants={defaultVariants}
          delay={0.1}
        >
          <AboutMeSection />
        </AnimatedSection>
        <AnimatedSection
          id="skills-animated-wrapper"
          variants={defaultVariants}
          delay={0.15}
        >
          <SkillsSection />
        </AnimatedSection>
        <AnimatedSection
          id="teaching-animated-wrapper"
          variants={defaultVariants}
          delay={0.18}
        >
          <TeachingSection />
        </AnimatedSection>
        <AnimatedSection
          id="scientist-animated-wrapper"
          variants={fadeInFromLeft}
          delay={0.2}
        >
          <ScientistCareer />
        </AnimatedSection>
        <AnimatedSection
          id="publications-animated-wrapper"
          variants={defaultVariants}
          delay={0.25}
        >
          <PublicationsSection />
        </AnimatedSection>
        <AnimatedSection
          id="blender-animated-wrapper"
          variants={fadeInFromRight}
          delay={0.2}
        >
          <BlenderCreations />
        </AnimatedSection>
        <AnimatedSection
          id="cli-animated-wrapper"
          variants={defaultVariants}
          delay={0.25}
        >
          <CLIToolsSection />
        </AnimatedSection>
        <AnimatedSection
          id="contact-animated-wrapper"
          variants={fadeInFromLeft}
          delay={0.2}
        >
          <ContactSection />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}

export default App;