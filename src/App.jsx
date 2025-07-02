// App.jsx
// Import React and necessary hooks.
import React, { useState, useEffect, Suspense, lazy } from "react";
// Import Helmet for managing document head.
import { Helmet } from "react-helmet-async";

// --- Component Imports ---
// Helper Components (if not directly used by App.jsx but by its children, they are imported by those children)
import AnimatedSection from "./AnimatedSection"; // Or from './components/AnimatedSection'

// Critical components (above the fold) - import normally
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

// Non-critical components (below the fold) - lazy load for performance
const AboutMeSection = lazy(() => import("./AboutMeSection"));
const SkillsSection = lazy(() => import("./SkillsSection"));
const TeachingSection = lazy(() => import("./TeachingSection"));
const ScientistCareer = lazy(() => import("./ScientistCareer"));
const PublicationsSection = lazy(() => import("./PublicationsSection"));
const BlenderCreations = lazy(() => import("./BlenderCreations"));
const CLIToolsSection = lazy(() => import("./CLIToolsSection"));
const ContactSection = lazy(() => import("./ContactSection"));

// --- Dark Mode Storage Key ---
const DARK_MODE_KEY = "darkMode";

// Import centralized animation variants
import { defaultVariants, fadeInFromLeft, fadeInFromRight } from "./animations";

/**
 * App Component: The root component of the application.
 */
function App() {
  // State for dark mode - initialize from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

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
      "Portfolio showcasing research in nanoscience, 3D atomic printing, microscopy, DFT, machine learning, plus Blender 3D art and software development projects.",
    nationality: { "@type": "Country", name: "Brazilian" },
  };

  // SEO: Website Structured Data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Filipe L. Q. Junqueira's Portfolio",
    url: "https://filipej.dev",
    description: personStructuredData.description,
    author: {
      "@type": "Person",
      name: "Filipe L. Q. Junqueira",
    },
    inLanguage: "en-US",
  };

  // Dark Mode Effect - Apply class to HTML and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode function.
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  // State for active navigation section.
  const [activeSection, setActiveSection] = useState("home");

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
  }, [activeSection]);


  // Main App Render
  return (
    <div className="font-sans bg-emerald-50/50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 min-h-screen transition-colors duration-300">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteStructuredData)}
        </script>
        <title>
          Filipe L. Q. Junqueira | Research, Nanoscience, 3D Art & Development
        </title>
        <meta name="description" content={personStructuredData.description} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Filipe L. Q. Junqueira | Research, Nanoscience, 3D Art & Development" />
        <meta property="og:description" content={personStructuredData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filipej.dev" />
        <meta property="og:image" content="https://filipej.dev/og-image.png" />
        <meta property="og:image:alt" content="Filipe L. Q. Junqueira - Research Portfolio Preview" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="Filipe L. Q. Junqueira's Portfolio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CaptBroccoli" />
        <meta name="twitter:creator" content="@CaptBroccoli" />
        <meta name="twitter:title" content="Filipe L. Q. Junqueira | Research, Nanoscience, 3D Art & Development" />
        <meta name="twitter:description" content={personStructuredData.description} />
        <meta name="twitter:image" content="https://filipej.dev/twitter-image.png" />
        <meta name="twitter:image:alt" content="Filipe L. Q. Junqueira - Research Portfolio Preview" />
      </Helmet>

      <Navbar
        setActiveSection={setActiveSection}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <HeroSection />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
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