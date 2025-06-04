// App.jsx
// Import React and necessary hooks.
import React, { useState, useEffect, useCallback } from "react";
// Import Helmet for managing document head.
import { Helmet } from "react-helmet-async";

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- Lucide Icons (only those directly used in App.jsx, like Loader2) ---
import { Loader2 } from "lucide-react";

// --- Component Imports ---
// Helper Components (if not directly used by App.jsx but by its children, they are imported by those children)
import AnimatedSection from "./AnimatedSection"; // Or from './components/AnimatedSection'

// Main Section Components
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

// --- Firebase Configuration ---
const firebaseConfigString =
  typeof __firebase_config !== "undefined" ? __firebase_config : "{}";
let firebaseConfig = {};
try {
  firebaseConfig = JSON.parse(firebaseConfigString);
  if (Object.keys(firebaseConfig).length === 0) {
    console.warn(
      "Firebase config is empty. Dark mode preference will use localStorage primarily.",
    );
  }
} catch (e) {
  console.error("Error parsing Firebase config:", e);
  firebaseConfig = {};
}
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- Animation Variants (used by App.jsx for AnimatedSection wrappers) ---
const defaultVariants = {
  // This can be defined here or imported if AnimatedSection needs it externally
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
  // State for dark mode.
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for Firestore instance.
  const [db, setDb] = useState(null);
  // State for user ID.
  const [userId, setUserId] = useState(null);
  // State for auth readiness.
  const [isAuthReady, setIsAuthReady] = useState(false);

  // SEO: Structured Data
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Filipe L. Q. Junqueira",
    url: "https://filipej.dev",
    image: "https://filipej.dev/og-image.png", // Replace with your actual OG image URL
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

  // Firebase Initialization and Auth Effect
  useEffect(() => {
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0 && appId) {
      try {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestoreDb);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            if (
              typeof __initial_auth_token !== "undefined" &&
              __initial_auth_token
            ) {
              try {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
              } catch (customTokenError) {
                console.warn(
                  "Custom token sign-in failed, trying anonymous.",
                  customTokenError,
                );
                try {
                  await signInAnonymously(firebaseAuth);
                } catch (anonError) {
                  console.error("Anonymous sign-in also failed:", anonError);
                  setUserId(
                    localStorage.getItem("portfolio-fallback-uid") ||
                      crypto.randomUUID(),
                  );
                }
              }
            } else {
              try {
                await signInAnonymously(firebaseAuth);
              } catch (anonError) {
                console.error("Anonymous sign-in failed:", anonError);
                let fallbackUid = localStorage.getItem(
                  "portfolio-fallback-uid",
                );
                if (!fallbackUid) {
                  fallbackUid = crypto.randomUUID();
                  localStorage.setItem("portfolio-fallback-uid", fallbackUid);
                }
                setUserId(fallbackUid);
              }
            }
          }
          setIsAuthReady(true);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setIsAuthReady(true);
        let fallbackUid = localStorage.getItem("portfolio-fallback-uid");
        if (!fallbackUid) {
          fallbackUid = crypto.randomUUID();
          localStorage.setItem("portfolio-fallback-uid", fallbackUid);
        }
        setUserId(fallbackUid);
      }
    } else {
      console.warn(
        "Firebase config missing. Using localStorage for dark mode.",
      );
      setIsAuthReady(true);
      let fallbackUid = localStorage.getItem("portfolio-fallback-uid");
      if (!fallbackUid) {
        fallbackUid = crypto.randomUUID();
        localStorage.setItem("portfolio-fallback-uid", fallbackUid);
      }
      setUserId(fallbackUid);
    }
  }, []); // appId is effectively constant after init, not needed in deps if not changing

  // Dark Mode Preference Loading Effect
  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const loadPreference = async () => {
      let darkModeEnabled = false;
      const localPreference = localStorage.getItem(`darkMode-${userId}`);
      if (localPreference !== null) {
        darkModeEnabled = JSON.parse(localPreference);
      }

      if (db) {
        const prefDocRef = doc(
          db,
          "artifacts",
          appId,
          "users",
          userId,
          "preferences",
          "darkMode",
        );
        try {
          const docSnap = await getDoc(prefDocRef);
          if (docSnap.exists()) {
            const prefData = docSnap.data();
            if (typeof prefData.enabled === "boolean") {
              darkModeEnabled = prefData.enabled;
            }
          }
        } catch (error) {
          console.error("Error loading dark mode from Firestore:", error);
        }
      }
      setIsDarkMode(darkModeEnabled);
    };
    loadPreference();
  }, [isAuthReady, db, userId, appId]); // Added appId here as it's used in doc path

  // Dark Mode Apply and Save Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (isAuthReady && userId) {
      localStorage.setItem(`darkMode-${userId}`, JSON.stringify(isDarkMode));
      if (db) {
        const prefDocRef = doc(
          db,
          "artifacts",
          appId,
          "users",
          userId,
          "preferences",
          "darkMode",
        );
        setDoc(prefDocRef, { enabled: isDarkMode }, { merge: true }).catch(
          (error) =>
            console.error("Error saving dark mode to Firestore:", error),
        );
      }
    }
  }, [isDarkMode, isAuthReady, db, userId, appId]);

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
  }, [
    activeSection,
    typeof window !== "undefined" ? window.location.hash : "",
  ]);

  // Loading State Display
  if (
    !isAuthReady &&
    firebaseConfig &&
    Object.keys(firebaseConfig).length > 0 &&
    appId
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-slate-900">
        <Loader2
          className="w-12 h-12 text-emerald-500 dark:text-emerald-400 animate-spin"
          aria-label="Loading content"
        />
      </div>
    );
  }

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
