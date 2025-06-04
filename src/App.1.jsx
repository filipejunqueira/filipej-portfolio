// Import React and necessary hooks from the 'react' library.
// useState: For managing component-level state.
// useEffect: For handling side effects (e.g., data fetching, subscriptions, manual DOM manipulations).
// useCallback: For memoizing functions, preventing unnecessary re-creations.
import React, { useState, useEffect, useCallback } from "react";

// Import animation utilities from 'framer-motion'.
// motion: A prefix for HTML/SVG elements to enable animations.
// useAnimation: A hook to manually control animation sequences.
import { motion, useAnimation } from "framer-motion";

// Import 'useInView' hook from 'react-intersection-observer'.
// This hook detects when an element enters or leaves the viewport.
import { useInView } from "react-intersection-observer";

// Import 'Helmet' from 'react-helmet-async' for managing document head elements (SEO).
// This allows dynamic updates to <title>, <meta>, <script type="application/ld+json">, etc.
import { Helmet } from "react-helmet-async";

// --- Firebase Imports ---
// These are for integrating Firebase services (authentication, database).
import { initializeApp } from "firebase/app"; // Core Firebase app initialization.
import {
  getAuth, // Firebase Authentication service.
  signInAnonymously, // Method for anonymous user sign-in.
  onAuthStateChanged, // Listener for changes in user authentication state.
  signInWithCustomToken, // Method for signing in with a custom token.
} from "firebase/auth";
import {
  getFirestore, // Firestore database service.
  doc, // Reference to a document in Firestore.
  setDoc, // Method to write or overwrite a document.
  getDoc, // Method to read a document.
} from "firebase/firestore";

// --- Lucide Icons ---
// Import specific icons from the 'lucide-react' library for UI elements.
// These are SVG icons, generally good for performance and scalability.
import {
  Briefcase, // Icon for career/work.
  Code, // Icon for coding/skills.
  Linkedin, // LinkedIn social icon.
  Github, // GitHub social icon.
  Mail, // Email icon.
  ExternalLink, // Icon indicating an external link.
  ChevronDown, // Down arrow icon.
  ChevronUp, // Up arrow icon.
  ArrowLeftCircle, // Left arrow for carousels/navigation.
  ArrowRightCircle, // Right arrow for carousels/navigation.
  Image as ImageIcon, // Image icon (renamed to avoid conflict with <img>).
  BookOpen, // Icon for publications.
  Palette, // Icon for art/design.
  Anchor, // Icon for specific internships/projects.
  Brain, // Icon for skills/intelligence.
  Users, // Icon for contact/collaboration.
  Building, // Icon for company/real estate.
  GraduationCap, // Icon for education.
  FlaskConical, // Icon for science/research.
  Sparkles, // Icon for AI features/highlights.
  Loader2, // Loading spinner icon.
  AlertTriangle, // Warning/error icon.
  Terminal, // Icon for CLI tools.
  BarChart3, // Icon for data analysis/visualization.
  Zap, // Icon for speed/quick tools.
  FileCode, // Icon for code files/scripts.
  Sun, // Icon for light mode.
  Moon, // Icon for dark mode.
  User, // Generic user icon.
  MessageSquare, // Icon for languages/communication.
  HardDrive, // Icon for computer skills/storage.
  Atom, // Icon for scientific tools/physics.
  Globe, // Icon for languages/global.
  Lightbulb, // Icon for skills/ideas.
  Presentation, // Icon for teaching.
  Twitter, // Twitter/X social icon.
  Send, // Send icon for form submit button
} from "lucide-react";

// --- Asset Imports ---
// Import static assets like images and documents.
// These are typically located in the 'src/assets' folder or 'public' folder.
import profilePic from "./assets/captainbroccoli.png"; // Main profile picture.
import filipeCv from "./assets/filipecv.pdf"; // Link to the CV PDF.

// Import Blender Art Images for the gallery.
import blenderA from "./assets/blenderA.png";
import blenderA1 from "./assets/blenderA1.png";
import blenderA2 from "./assets/blenderA2.png";
import blenderA3 from "./assets/blenderA3.png";
import blenderB from "./assets/blenderB.png";
import blenderB1 from "./assets/blenderB1.png";
import blenderB2 from "./assets/blenderB2.png";
import blenderB3 from "./assets/blenderB3.png";
import blenderB4 from "./assets/blenderB4.png";
import blenderB5 from "./assets/blenderB5.png";
import blenderC from "./assets/blenderC.png";
import blenderC1 from "./assets/blenderC1.png";
import blenderC2 from "./assets/blenderC2.png";
import blenderC3 from "./assets/blenderC3.png";

// --- Firebase Configuration ---
// Attempt to load Firebase configuration from global variables (often injected by a CI/CD environment or a specific setup like Canvas LMS).
const firebaseConfigString =
  typeof __firebase_config !== "undefined" ? __firebase_config : "{}"; // Default to an empty JSON string if not found.
let firebaseConfig = {}; // Initialize as an empty object.

// Try to parse the Firebase config string.
try {
  firebaseConfig = JSON.parse(firebaseConfigString);
  // Warn if the parsed config is empty, indicating Firebase might not work as expected.
  if (Object.keys(firebaseConfig).length === 0) {
    console.warn(
      "Firebase config is empty. Dark mode preference will use localStorage primarily.",
    );
  }
} catch (e) {
  // Log an error if parsing fails and keep firebaseConfig as an empty object.
  console.error("Error parsing Firebase config:", e);
  firebaseConfig = {}; // Ensure it's an object to prevent further errors.
}
// Get App ID, also potentially from a global variable, with a fallback.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- AnimatedSection Component ---
// A reusable component that animates its children when they scroll into view.
// It uses Framer Motion for animation and React Intersection Observer to detect visibility.

// Default animation variants for Framer Motion.
// 'hidden': Initial state (opacity 0, slightly offset on Y-axis).
// 'visible': Target state (opacity 1, original Y position).
const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * AnimatedSection Component: Wraps children in a motion.div for scroll-triggered animations.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be animated.
 * @param {string} [props.className=""] - Optional CSS classes for the wrapper div.
 * @param {string} props.id - A unique ID for the section (optional, but good for targeting).
 * @param {object} [props.variants=defaultVariants] - Framer Motion animation variants.
 * @param {number} [props.delay=0] - Animation delay in seconds.
 * @param {number} [props.threshold=0.1] - Percentage of the element that needs to be in view to trigger the animation.
 */
const AnimatedSection = ({
  children,
  className = "",
  id,
  variants = defaultVariants,
  delay = 0,
  threshold = 0.1,
}) => {
  // `useAnimation` hook from Framer Motion to programmatically control animations.
  const controls = useAnimation();
  // `useInView` hook to track if the component is visible in the viewport.
  // `triggerOnce: true` ensures the animation only runs once.
  // `threshold` determines how much of the element must be visible to trigger.
  const [ref, inView] = useInView({ triggerOnce: true, threshold: threshold });

  // `useEffect` hook to start the animation when the component comes into view.
  useEffect(() => {
    if (inView) {
      controls.start("visible"); // Start the 'visible' animation variant.
    }
  }, [controls, inView]); // Dependencies: re-run effect if 'controls' or 'inView' changes.

  return (
    // `motion.div` is a Framer Motion component that enables animations on a div.
    <motion.div
      ref={ref} // Assign the ref from `useInView` to this element.
      id={id} // HTML id attribute.
      className={className} // CSS classes.
      initial="hidden" // Initial animation state.
      animate={controls} // Link animation controls.
      variants={variants} // Animation variants to use.
      transition={{ duration: 0.6, delay }} // Animation transition properties.
    >
      {children}
    </motion.div>
  );
};

// --- Reusable Helper Components ---

/**
 * Section Component: A styled container for main content sections of the page.
 * Provides consistent padding, background, shadow, and a title structure.
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the section.
 * @param {React.ElementType} props.icon - Lucide icon component to display next to the title.
 * @param {React.ReactNode} props.children - Content of the section.
 * @param {string} props.id - HTML ID for the section, used for navigation and ARIA.
 * @param {string} [props.titleClassName="text-3xl sm:text-4xl"] - Optional CSS classes for the title.
 */
const Section = ({
  title,
  icon: IconComponent, // Destructure and rename 'icon' prop to 'IconComponent'.
  children,
  id,
  titleClassName = "text-3xl sm:text-4xl", // Default styling for the title.
}) => (
  // Using <section> HTML5 semantic tag for better document structure and SEO.
  <section
    id={id} // HTML ID for direct navigation (e.g., #about).
    className="py-16 md:py-20 bg-white dark:bg-slate-800/80 rounded-xl shadow-xl dark:shadow-black/30 mb-12 md:mb-16 px-6 md:px-10"
    // ARIA attribute to associate the section with its title for accessibility.
    aria-labelledby={`${id}-title`}
  >
    <div className="container mx-auto">
      {" "}
      {/* Centering content with a max-width. */}
      {/* Section Title */}
      <h2
        id={`${id}-title`} // ID for the ARIA association.
        className={`${titleClassName} font-medium text-emerald-700 dark:text-emerald-400 mb-10 md:mb-14 text-center flex items-center justify-center`}
      >
        {/* Conditionally render the icon if provided. */}
        {IconComponent && (
          <IconComponent
            className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-emerald-500 dark:text-emerald-400"
            strokeWidth={2}
            aria-hidden="true" // Decorative icon, so hide from screen readers.
          />
        )}
        {title}
      </h2>
      {/* Content of the section. */}
      {children}
    </div>
  </section>
);

/**
 * ProjectCard Component: Displays details for a single project, typically used for Blender art or code projects.
 * Includes an image, title, description, artistic statement (optional), and an image gallery.
 * @param {object} props - Component props.
 * @param {string} props.title - Project title.
 * @param {string} props.description - Project description.
 * @param {string} [props.artisticStatement] - Optional artistic statement or additional context.
 * @param {string} props.mainImage - URL for the main project image.
 * @param {string[]} props.galleryImages - Array of URLs for gallery images.
 * @param {string} [props.imagePlaceholderColor] - Background color for image placeholder if image fails to load.
 * @param {string} [props.link] - Optional external link for the project.
 * @param {string} props.type - Type of project (e.g., "blender", "code"), can influence styling or icons.
 * @param {boolean} props.isGalleryOpen - State indicating if the image gallery is expanded.
 * @param {function} props.onToggleGallery - Callback function to toggle gallery visibility.
 */
const ProjectCard = ({
  title,
  description,
  artisticStatement,
  mainImage,
  galleryImages,
  imagePlaceholderColor,
  link,
  type,
  isGalleryOpen,
  onToggleGallery,
}) => {
  // State for expanding/collapsing the description text.
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // State for the currently displayed image index in the gallery.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Toggles the 'isDescriptionExpanded' state.
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  // Moves to the next image in the gallery.
  const nextImage = (e) => {
    e.stopPropagation(); // Prevent card click or other underlying events.
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length); // Loop back to start.
  };

  // Moves to the previous image in the gallery.
  const prevImage = (e) => {
    e.stopPropagation();
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex(
        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length, // Loop back to end.
      );
  };

  // Effect to reset the gallery to the first image when it's closed.
  useEffect(() => {
    if (type === "blender" && !isGalleryOpen) {
      setCurrentImageIndex(0);
    }
  }, [isGalleryOpen, type]); // Dependencies: runs when gallery visibility or type changes.

  // Error handler for images. If an image fails to load, it shows a placeholder.
  const imageErrorHandler = (e) => {
    e.target.onerror = null; // Prevents an infinite loop if the placeholder image also fails.
    e.target.src = `https://placehold.co/600x400/E0E0E0/BDBDBD?text=Image+Not+Found`;
  };

  return (
    // Using <article> HTML5 semantic tag for self-contained content, beneficial for SEO.
    <article className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-all duration-300 flex flex-col h-full">
      {/* Main project image or placeholder */}
      {type === "blender" && mainImage ? (
        <img
          src={mainImage}
          // SEO: Descriptive alt text, marked for review.
          alt={`Main image for ${title} - ${type} project [Review and finalize description]`}
          className="w-full h-52 md:h-60 rounded-md object-cover mb-5 shadow-sm"
          onError={imageErrorHandler} // Fallback for broken images.
          loading="lazy" // SEO: Lazy load images below the fold for better performance.
        />
      ) : (
        // Placeholder if no image is available or if it's not a Blender project with a main image.
        <div
          className={`w-full h-52 md:h-60 rounded-md flex items-center justify-center text-white dark:text-slate-300 text-xl font-semibold mb-5 ${imagePlaceholderColor || "bg-gray-300 dark:bg-slate-700"}`}
          role="img" // Accessibility: Indicate this div acts as an image.
          aria-label={`${title} project placeholder image`} // Accessibility: Provide a label for the placeholder.
        >
          {/* Display different icons based on the project type. */}
          {type === "blender" ? (
            <Palette size={52} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Code size={52} strokeWidth={1.5} aria-hidden="true" />
          )}
        </div>
      )}

      {/* Project Title - Using <h3>, assuming it's within a section with an <h2>. */}
      <h3 className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300 mb-3">
        {title}
      </h3>

      {/* Project Description and Artistic Statement */}
      <div className="flex-grow">
        {" "}
        {/* Ensures this part takes available space, pushing buttons to the bottom. */}
        <p
          // Dynamically applies line-clamping if description is not expanded and an artistic statement exists.
          className={`text-gray-700 dark:text-slate-300 text-sm md:text-base mb-2 ${isDescriptionExpanded || !artisticStatement ? "" : "line-clamp-3"}`}
        >
          {description}
        </p>
        {artisticStatement && (
          <p
            className={`text-emerald-700/80 dark:text-emerald-400/80 text-xs italic mt-1 mb-4 ${isDescriptionExpanded ? "" : "line-clamp-2"}`}
          >
            {artisticStatement}
          </p>
        )}
      </div>

      {/* "Show More/Less" button for long descriptions. */}
      {(description.length > 100 ||
        (artisticStatement && artisticStatement.length > 50)) && (
        <button
          onClick={toggleDescription}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center mb-4 text-sm font-medium self-start uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          aria-expanded={isDescriptionExpanded} // Accessibility: Indicates expanded state.
        >
          {isDescriptionExpanded ? "Show Less" : "Show More"}
          {isDescriptionExpanded ? (
            <ChevronUp size={18} className="ml-1" aria-hidden="true" />
          ) : (
            <ChevronDown size={18} className="ml-1" aria-hidden="true" />
          )}
        </button>
      )}

      {/* Action buttons (View Gallery, View Project) */}
      <div className="mt-auto">
        {" "}
        {/* Pushes these buttons to the bottom of the card. */}
        {/* "View/Hide Images" button for Blender projects with galleries. */}
        {type === "blender" &&
          galleryImages &&
          galleryImages.length > 0 &&
          onToggleGallery && (
            <button
              onClick={onToggleGallery}
              className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 self-start mr-4 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
              aria-expanded={isGalleryOpen} // Accessibility: Indicates gallery expanded state.
              // Accessibility: Controls the gallery element.
              aria-controls={`${title.replace(/\s+/g, "-").toLowerCase()}-gallery`}
            >
              {isGalleryOpen ? "Hide Images" : "View Images"}
              {isGalleryOpen ? (
                <ChevronUp size={18} className="ml-2" aria-hidden="true" />
              ) : (
                <ImageIcon size={18} className="ml-2" aria-hidden="true" />
              )}
            </button>
          )}
        {/* Optional external link for the project. */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer" // Security for external links.
            className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 self-start text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          >
            View Project <ExternalLink size={16} className="ml-1.5" />
          </a>
        )}
      </div>

      {/* Image Gallery (conditionally rendered) */}
      {type === "blender" &&
        isGalleryOpen &&
        galleryImages &&
        galleryImages.length > 0 && (
          // ID for ARIA controls.
          <div
            id={`${title.replace(/\s+/g, "-").toLowerCase()}-gallery`}
            className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700"
          >
            <div className="relative mb-2">
              {" "}
              {/* Relative positioning for arrow buttons. */}
              <img
                src={galleryImages[currentImageIndex]}
                // SEO: Descriptive alt text for gallery images, marked for review.
                alt={`${title} - Gallery Image ${currentImageIndex + 1} of ${galleryImages.length} [Review and finalize description]`}
                className="w-full h-60 md:h-72 rounded-md object-cover shadow-inner bg-gray-100 dark:bg-slate-700"
                onError={imageErrorHandler}
                loading="lazy" // SEO: Lazy load gallery images.
              />
              {/* Navigation buttons for the gallery (if more than one image). */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black/50 focus:ring-white"
                    aria-label="Previous Image"
                  >
                    <ArrowLeftCircle size={22} aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black/50 focus:ring-white"
                    aria-label="Next Image"
                  >
                    <ArrowRightCircle size={22} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            {/* Image counter for the gallery. */}
            {galleryImages.length > 1 && (
              <p className="text-center text-xs text-gray-600 dark:text-slate-400">
                Image {currentImageIndex + 1} of {galleryImages.length}
              </p>
            )}
          </div>
        )}
    </article>
  );
};

// --- Page Sections ---
// These components define the major content areas of the portfolio.

/**
 * Navbar Component: Site navigation bar, sticky at the top.
 * Includes branding, navigation links, and a dark mode toggle.
 * @param {object} props - Component props.
 * @param {function} props.setActiveSection - Callback to set the currently active section for scrolling.
 * @param {function} props.toggleDarkMode - Callback to toggle dark mode.
 * @param {boolean} props.isDarkMode - Current dark mode state.
 */
const Navbar = ({ setActiveSection, toggleDarkMode, isDarkMode }) => {
  // State for controlling the visibility of the mobile menu.
  const [isOpen, setIsOpen] = useState(false);
  // Array of navigation links with their IDs (for href) and labels.
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

  // Framer Motion animation variants for hover effects on nav links and brand.
  const navLinkHoverAnimation = {
    rotate: [0, -1.5, 1.5, -1.5, 1.5, 0], // Subtle rotation.
    scale: 1.03, // Slight scale up.
    transition: { duration: 0.35, ease: "easeInOut" },
  };
  const brandHoverAnimation = {
    scale: [1, 1.02, 1, 1.02, 1], // Pulsing scale.
    color: isDarkMode // Dynamic color change based on dark mode.
      ? ["#e2e8f0", "#6ee7b7", "#e2e8f0"] // slate-200, emerald-300, slate-200
      : ["#FFFFFF", "#A7F3D0", "#FFFFFF"], // white, emerald-200, white
    transition: { duration: 0.5, ease: "easeInOut" },
  };

  return (
    // Using <nav> HTML5 semantic tag for the main navigation structure.
    <nav
      className="bg-emerald-600 dark:bg-slate-800 text-white sticky top-0 z-50 shadow-lg dark:shadow-black/30"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Main navbar container. */}
          {/* Left side: Profile picture and Brand name/link. */}
          <div className="flex items-center">
            <motion.img
              src={profilePic}
              // SEO: Descriptive alt text, marked for review.
              alt="Filipe L. Q. Junqueira - Profile Picture [Review and finalize description]"
              className="w-10 h-10 rounded-full mr-3 object-cover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800"
              whileHover={{ scale: 1.1, rotate: 5 }} // Hover animation for the image.
              transition={{ type: "spring", stiffness: 300 }}
              loading="lazy" // SEO: Can be lazy as it's small and repeated.
            />
            <motion.a
              href="#home" // Links to the top of the page.
              onClick={() => setActiveSection("home")} // Sets 'home' as the active section.
              className="flex-shrink-0 text-xl md:text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 rounded-sm"
              whileHover={brandHoverAnimation} // Hover animation for the brand name.
            >
              Filipe L. Q. Junqueira
            </motion.a>
          </div>
          {/* Right side: Desktop navigation links and dark mode toggle. */}
          <div className="hidden md:flex items-center">
            {" "}
            {/* Hidden on small screens. */}
            <div className="ml-10 flex items-baseline space-x-1">
              {/* Map through navLinks to create navigation items. */}
              {navLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`} // Anchor link to the section ID.
                  onClick={() => {
                    setActiveSection(link.id); // Set active section for scrolling.
                    setIsOpen(false); // Close mobile menu if it was open.
                  }}
                  className="hover:bg-emerald-700/50 dark:hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800"
                  whileHover={navLinkHoverAnimation} // Hover animation.
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            {/* Dark Mode Toggle Button (Desktop) */}
            <motion.button
              onClick={toggleDarkMode}
              className="ml-6 p-2 rounded-full hover:bg-emerald-700/50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-slate-300 focus:ring-offset-emerald-600 dark:focus:ring-offset-slate-800 transition-colors duration-200"
              // Accessibility: Dynamic aria-label based on current mode.
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              whileHover={{ scale: 1.15, rotate: isDarkMode ? -15 : 15 }} // Hover animation.
              whileTap={{ scale: 0.9 }} // Tap animation.
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon size={20} className="text-slate-300" aria-hidden="true" />
              )}
            </motion.button>
          </div>
          {/* Mobile Menu Button and Dark Mode Toggle (visible on small screens) */}
          <div className="-mr-2 flex md:hidden items-center">
            {/* Dark Mode Toggle Button (Mobile) */}
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
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)} // Toggles mobile menu visibility.
              type="button"
              className="bg-emerald-700 dark:bg-slate-700/50 inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-600 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 dark:focus:ring-offset-slate-800 focus:ring-white"
              aria-controls="mobile-menu" // Associates button with the mobile menu content.
              aria-expanded={isOpen} // Indicates if the menu is open or closed.
            >
              <span className="sr-only">Open main menu</span>{" "}
              {/* For screen readers. */}
              {/* Dynamically display hamburger or close icon. */}
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

      {/* Mobile Menu (Dropdown) */}
      {isOpen && ( // Conditionally render if 'isOpen' is true.
        <div className="md:hidden" id="mobile-menu">
          {" "}
          {/* ID for ARIA association. */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setIsOpen(false); // Close menu after clicking a link.
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

/**
 * HeroSection Component: The main landing/introduction section at the top of the page.
 * Typically contains the main heading (H1), a short bio, and a call to action (e.g., View CV).
 */
const HeroSection = () => (
  // Using <header> HTML5 semantic tag as this is the primary introduction.
  // It could also be a <section> if <Navbar> is considered the main <header>.
  <header
    id="home" // ID for navigation.
    className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-slate-800 dark:to-slate-900 text-white py-24 md:py-32"
    aria-labelledby="main-heading" // Associates this landmark with its main heading for accessibility.
  >
    <div className="container mx-auto text-center px-6 flex flex-col items-center">
      <motion.img
        src={profilePic}
        // SEO: Descriptive alt text, marked for review. Critical for this prominent image.
        alt="Filipe L. Q. Junqueira - Main Profile Picture [Review and finalize description]"
        className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover mb-8 shadow-2xl border-4 border-white/80 dark:border-slate-400/50"
        // Framer Motion animation properties.
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring", // Spring animation for a bouncier feel.
          stiffness: 120,
        }}
        loading="eager" // SEO: Eager load critical, above-the-fold images.
      />
      {/* SEO: The single most important heading (H1) for the entire page. */}
      <motion.h1
        id="main-heading" // ID for ARIA association.
        className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 dark:text-slate-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Filipe L. Q. Junqueira
      </motion.h1>
      {/* Sub-heading or tagline. */}
      <motion.p
        className="text-lg sm:text-xl md:text-2xl font-normal mb-4 text-emerald-100 dark:text-slate-300 opacity-95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Research Associate, School of Physics and Astronomy, University of
        Nottingham
      </motion.p>
      {/* Brief introductory paragraph. */}
      <motion.p
        className="text-base sm:text-lg md:text-xl mb-10 text-emerald-200 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Exploring 3D printing with atoms, NC-AFM & STM studies, DFT, and Machine
        Learning in nanoscience.
      </motion.p>
      {/* Call to action button to view the CV. */}
      <motion.a
        href={filipeCv} // Links to the imported CV PDF.
        target="_blank" // Opens link in a new tab.
        rel="noopener noreferrer" // Security measure for target="_blank".
        className="bg-white text-emerald-600 dark:bg-emerald-500 dark:text-white font-medium py-3 px-8 rounded-md text-base uppercase tracking-wider hover:bg-emerald-50 dark:hover:bg-emerald-600 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-300 focus:ring-offset-white dark:focus:ring-offset-emerald-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        // Hover animation for the button.
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

/**
 * AboutMeSection Component: Contains a narrative or biographical information.
 */
const AboutMeSection = () => {
  // Array of paragraphs for the "About Me" narrative.
  const aboutMeNarrative = [
    "Driven by an insatiable curiosity for the quantum realm and a passion for computational problem-solving, I thrive at the intersection of nanoscience, data science, and creative technology.",
    "My journey has taken me from fundamental physics research and complex simulations to crafting intuitive command-line tools and exploring the artistic potential of 3D visualization.",
    "I'm dedicated to leveraging cutting-edge techniques, including machine learning and advanced microscopy, to push the boundaries of what's possible at the atomic scale and to communicate these complex ideas effectively.",
    "I'm always eager to connect with fellow innovators and explore opportunities where my diverse skill set can contribute to impactful projects and new discoveries.",
  ];
  return (
    // Uses the reusable Section component for consistent styling.
    <Section
      title="About Me"
      icon={User} // User icon for this section.
      id="about" // HTML ID for navigation.
      titleClassName="text-3xl sm:text-4xl md:text-5xl" // Custom title size.
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {" "}
        {/* Content container. */}
        {/* Map through the narrative paragraphs and render them with animation. */}
        {aboutMeNarrative.map((paragraph, index) => (
          <motion.p
            key={index} // Unique key for each paragraph.
            className="text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed text-center md:text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            // Staggered animation delay for each paragraph.
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </Section>
  );
};

/**
 * SkillsSection Component: Displays various skills categorized into groups.
 */
const SkillsSection = () => {
  // Data object containing skills categorized into computer skills, scientific tools, and languages.
  const skillsData = {
    computerSkills: [
      { name: "Python", icon: Code },
      { name: "JavaScript (React, Node.js)", icon: Code },
      { name: "Tailwind CSS", icon: Code },
      { name: "Framer Motion", icon: Code },
      { name: "Git & GitHub", icon: Github },
      { name: "Bash/Shell Scripting", icon: Terminal },
      { name: "SQL", icon: HardDrive },
      { name: "C/C++ (Basic)", icon: Code },
    ],
    scientificTools: [
      { name: "DFT (VASP, Quantum Espresso)", icon: Atom },
      { name: "SPM (AFM/STM) Analysis", icon: BarChart3 },
      { name: "Pymatgen", icon: FileCode },
      { name: "ASE (Atomic Simulation Environment)", icon: Atom },
      {
        name: "Machine Learning (Scikit-learn, TensorFlow/Keras Basics)",
        icon: Brain,
      },
      {
        name: "Data Visualization (Matplotlib, Seaborn, Plotly)",
        icon: BarChart3,
      },
      { name: "Blender (3D Modeling & Visualization)", icon: Palette },
    ],
    languages: [
      { name: "English", proficiency: "Fluent/C2" },
      { name: "Portuguese", proficiency: "Native" },
      { name: "French", proficiency: "Beginner/A2" },
      { name: "Italian", proficiency: "Beginner/A1" },
    ],
  };

  /**
   * SkillItem Component: Renders a single skill item with an icon and optional proficiency level.
   * @param {object} props - Component props.
   * @param {string} props.name - Name of the skill.
   * @param {React.ElementType} props.icon - Lucide icon component for the skill.
   * @param {string} [props.proficiency] - Optional proficiency level string.
   */
  const SkillItem = ({ name, icon: Icon, proficiency }) => (
    <motion.li
      className="bg-emerald-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow"
      whileHover={{ y: -3 }} // Subtle lift animation on hover.
    >
      {Icon && (
        <Icon
          className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
          strokeWidth={2}
          aria-hidden="true" // Decorative icon.
        />
      )}
      <span className="text-sm font-medium text-gray-800 dark:text-slate-200">
        {name}
      </span>
      {proficiency && ( // Display proficiency if available.
        <span className="text-xs text-gray-500 dark:text-slate-400 ml-auto">
          ({proficiency})
        </span>
      )}
    </motion.li>
  );

  return (
    <Section title="Core Competencies & Skills" icon={Lightbulb} id="skills">
      {/* Grid layout for skill categories. */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Computer Skills Column */}
        <div>
          {/* Sub-section heading (H3). */}
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <HardDrive
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />{" "}
            Computer Skills
          </h3>
          <ul className="space-y-3">
            {" "}
            {/* List of skills. */}
            {skillsData.computerSkills.map((skill, index) => (
              // Each skill item is wrapped in AnimatedSection for scroll animation.
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem name={skill.name} icon={skill.icon} />
              </AnimatedSection>
            ))}
          </ul>
        </div>

        {/* Scientific Software & Tools Column */}
        <div>
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <Atom
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />{" "}
            Scientific Software & Tools
          </h3>
          <ul className="space-y-3">
            {skillsData.scientificTools.map((skill, index) => (
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem name={skill.name} icon={skill.icon} />
              </AnimatedSection>
            ))}
          </ul>
        </div>

        {/* Languages Column */}
        <div>
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <Globe
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />{" "}
            Languages
          </h3>
          <ul className="space-y-3">
            {skillsData.languages.map((lang, index) => (
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem
                  name={lang.name}
                  proficiency={lang.proficiency}
                  icon={MessageSquare} // Using a generic icon for languages.
                />
              </AnimatedSection>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

/**
 * TeachingSection Component: Details teaching and tutoring experience.
 */
const TeachingSection = () => {
  // Array of key points about teaching experience.
  const teachingPoints = [
    "Extensive experience tutoring students for International Mathematics Olympiads (IMO), focusing on advanced problem-solving techniques in Number Theory, Combinatorics, Algebra, and Geometry.",
    "Provided tailored coaching for IB (International Baccalaureate) Mathematics (HL/SL) and Physics (HL/SL), helping students achieve top grades and develop a deep understanding of core concepts.",
    "Developed custom learning materials and practice sets to address individual student needs and learning styles.",
    "Passionate about fostering critical thinking and a love for mathematics and physics in young minds.",
  ];

  return (
    <Section title="Teaching & Tutoring" icon={Presentation} id="teaching">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.p
          className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Beyond my research and creative projects, I am deeply committed to
          education and mentorship. I have a rewarding side-venture in tutoring,
          primarily focused on preparing students for high-level mathematics
          competitions and rigorous academic programs.
        </motion.p>

        {/* List of teaching points. */}
        <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-slate-300 text-base md:text-lg">
          {teachingPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }} // Animates in from the left.
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }} // Staggered delay.
              className="ml-4"
            >
              {point}
            </motion.li>
          ))}
        </ul>

        {/* Link to external tutoring site. */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + teachingPoints.length * 0.1, // Delay after list items animate.
          }}
        >
          <a
            href="http://filipej.com" // Ensure this link is correct.
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-slate-800"
          >
            Visit My Tutoring Site <ExternalLink size={18} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </Section>
  );
};

/**
 * BlenderCreations Component: Showcases Blender 3D art projects using ProjectCard.
 */
const BlenderCreations = () => {
  // State to manage which project's gallery is currently expanded.
  const [expandedGalleryId, setExpandedGalleryId] = useState(null);
  // Array of Blender project data.
  const blenderProjects = [
    {
      id: 1,
      title: "Abstract 3D Art",
      description:
        "Exploring forms, textures, and lighting using Blender for creating visually compelling abstract scenes. This involves procedural texturing and complex node setups for dynamic and intricate results.",
      artisticStatement:
        "Focus: Procedural generation, photorealism in abstract contexts.",
      mainImage: blenderA,
      galleryImages: [blenderA1, blenderA2, blenderA3],
    },
    {
      id: 2,
      title: "Scientific Visualization",
      description:
        "Using Blender to create visualizations for complex scientific concepts, such as molecular structures, quantum phenomena, or astrophysical simulations, making them accessible and understandable to a broader audience.",
      artisticStatement:
        "Goal: To accurately and beautifully convey complex scientific data.",
      mainImage: blenderB,
      galleryImages: [blenderB1, blenderB2, blenderB3, blenderB4, blenderB5],
    },
    {
      id: 3,
      title: "Character/Concept Design",
      description:
        "Developing unique characters and concepts in 3D, from initial sculpting and retopology to final texturing, rigging for animation, or preparing for 3D printing.",
      artisticStatement:
        "Exploration: Character storytelling through form and detail.",
      mainImage: blenderC,
      galleryImages: [blenderC1, blenderC2, blenderC3],
    },
  ];

  // Toggles the expanded state of a project's gallery.
  const handleToggleGallery = (projectId) =>
    setExpandedGalleryId((prevId) => (prevId === projectId ? null : projectId));

  return (
    <Section title="Blender Art & 3D Visualization" icon={Palette} id="blender">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        Leveraging Blender for creative 3D projects, scientific visualization,
        and concept art. Each piece is a journey into form, light, and
        narrative, aiming to bridge the gap between the technical and the
        aesthetic.
      </p>
      {/* Grid layout for Blender project cards. */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {blenderProjects.map((project, index) => (
          // Each project card is animated.
          <AnimatedSection
            key={project.id}
            delay={index * 0.15} // Staggered animation.
            threshold={0.1}
          >
            <ProjectCard
              {...project} // Spread project data as props.
              type="blender" // Specify project type.
              isGalleryOpen={expandedGalleryId === project.id} // Pass gallery open state.
              onToggleGallery={() => handleToggleGallery(project.id)} // Pass toggle handler.
            />
          </AnimatedSection>
        ))}
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-12 md:mt-16">
        More creations and visualizations coming soon! Stay tuned for updates on
        new projects and explorations.
      </p>
    </Section>
  );
};

/**
 * CLIToolsSection Component: Highlights command-line interface tools developed.
 */
const CLIToolsSection = () => {
  // Data for CLI tools.
  const cliToolsData = [
    {
      id: 1,
      title: "DFT Automation Suite",
      description:
        "A Python-based CLI tool to streamline Density Functional Theory (DFT) calculations, manage input/output files for software like VASP or Quantum Espresso, and automate job submissions to HPC clusters using SLURM or PBS.",
      problemSolved:
        "Reduces manual intervention and potential for errors in complex DFT workflows, significantly speeding up research cycles for materials simulation.",
      icon: FileCode,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">
            dft-suite run
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --job_type relax
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --struct Si.vasp
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Initializing calculation for Si.vasp...
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Input files generated.
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Submitting job to SLURM ID:{" "}
          </span>
          <span className="text-green-500 dark:text-green-400">12345</span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Monitoring status... Job completed successfully.
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Final energy:{" "}
          </span>
          <span className="text-green-500 dark:text-green-400">
            -5.42 eV/atom
          </span>
        </>
      ),
      tags: ["Python", "CLI", "DFT", "VASP", "HPC", "Automation", "SLURM"],
      githubLink: "https://github.com/filipejunqueira/dft-suite",
    },
    {
      id: 2,
      title: "SPM Data Analyzer",
      description:
        "Command-line utilities for processing and analyzing Scanning Probe Microscopy (SPM) data (AFM/STM). Features include drift correction, plane fitting, noise filtering, tip deconvolution, and basic statistical analysis of surface features.",
      problemSolved:
        "Provides a consistent and scriptable way to perform common SPM data processing tasks, ensuring reproducibility and enabling batch processing of large datasets.",
      icon: BarChart3,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">
            spm-analyzer process
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --file afm_scan.xyz
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --drift_correct --plane_fit
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Processing scan data: afm_scan.xyz
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Applying 2D polynomial drift correction...
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Performing plane fitting (order 1)...
          </span>
          <br />
          <span className="text-green-500 dark:text-green-400">
            Drift corrected. RMS roughness: 0.15 nm
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Saving processed_afm_scan.dat
          </span>
        </>
      ),
      tags: [
        "Python",
        "CLI",
        "SPM",
        "AFM",
        "STM",
        "Data Analysis",
        "Nanoscience",
      ],
      githubLink: "https://github.com/filipejunqueira/spm-analyzer",
    },
    {
      id: 3,
      title: "Quick Plotter CLI",
      description:
        "A rapid plotting tool for generating publication-quality graphs from CSV or text files directly from the terminal. Supports various plot types, custom labels, legends, and output formats, powered by Matplotlib.",
      problemSolved:
        "Eliminates the need to write repetitive plotting scripts for common data visualization tasks, allowing for quick insights and figure generation from the command line.",
      icon: Zap,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">quickplot</span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --file results.csv
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --x_col "Voltage"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --y_col "Current"
          </span>
          <span>{" \\"}</span>
          <br />
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            -t "I-V Curve for Device X"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --xlabel "Voltage (V)"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --ylabel "Current (nA)"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --save plot.png
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Generating plot 'I-V Curve for Device X'...
          </span>
          <br />
          <span className="text-green-500 dark:text-green-400">
            Saved to plot_Voltage_vs_Current.png
          </span>
        </>
      ),
      tags: [
        "Python",
        "CLI",
        "Plotting",
        "Matplotlib",
        "Data Viz",
        "Automation",
      ],
      githubLink: "https://github.com/filipejunqueira/quickplot",
    },
  ];

  // Animation variants for the CLI tool cards.
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      // `i` is a custom prop for staggering.
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: "easeInOut" },
    }),
    hover: {
      // Hover state animation.
      y: -6,
      scale: 1.02,
      boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.12)", // Emerald shadow.
    },
  };

  return (
    <Section title="CLI Tools & Scripts" icon={Terminal} id="cli">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        Crafting efficient command-line interfaces to accelerate research and
        automate complex tasks in nanoscience and data analysis. These tools are
        designed for robustness and ease of use.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {cliToolsData.map((tool, index) => {
          const ToolIcon = tool.icon; // Dynamically render the icon specified in data.
          return (
            // Using <motion.article> for semantic structure and animation.
            <motion.article
              key={tool.id}
              className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-all duration-300 flex flex-col cursor-default"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible" // Animate when the card scrolls into view.
              whileHover="hover" // Apply hover animation.
              viewport={{ once: true, amount: 0.1 }} // Intersection observer options.
              custom={index} // Pass index to `visible` variant for staggered animation.
              aria-labelledby={`cli-tool-title-${tool.id}`} // Accessibility.
            >
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ToolIcon
                  className="h-9 w-9 mr-3.5 stroke-[1.75] flex-shrink-0"
                  aria-hidden="true"
                />
                {/* CLI Tool Title (H3) */}
                <h3
                  id={`cli-tool-title-${tool.id}`}
                  className="text-lg lg:text-xl font-medium text-emerald-800 dark:text-emerald-300"
                >
                  {tool.title}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-slate-300 text-sm mb-3 leading-relaxed">
                {tool.description}
              </p>
              {tool.problemSolved && (
                <p className="text-emerald-700/80 dark:text-emerald-400/80 text-xs italic mt-1 mb-4">
                  <span className="font-semibold">Impact: </span>
                  {tool.problemSolved}
                </p>
              )}
              {/* Tags for the CLI tool. */}
              <div className="mb-5 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-emerald-100 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Simulated code example. */}
              {tool.codeExample && (
                <div className="bg-gray-800 dark:bg-slate-900/80 p-4 rounded-lg font-mono text-xs mb-5 overflow-x-auto shadow-inner">
                  {/* Using <pre> for preformatted text, good for code examples. */}
                  <pre className="whitespace-pre-wrap leading-relaxed text-sm">
                    {tool.codeExample}
                  </pre>
                </div>
              )}
              {/* Link to GitHub repository. */}
              <motion.a
                href={tool.githubLink || "https://github.com/filipejunqueira"} // Fallback link.
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white font-medium py-2.5 px-5 rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-slate-800"
                whileHover={{
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Github size={18} aria-hidden="true" /> View on GitHub
              </motion.a>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
};

/**
 * ScientistCareer Component: Details career milestones and educational background.
 */
const ScientistCareer = () => {
  // State to track which career milestone's details are expanded.
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  // Array of career and education milestones.
  const careerMilestones = [
    {
      id: 1,
      role: "Post-doctoral Researcher",
      institution: "University of Nottingham, UK",
      duration: "Jan 2022 - Present",
      description:
        "Research associate with Prof. Philip Moriarty's nanoscience group, focusing on atomic manipulation and machine learning applications in SPM.",
      icon: FlaskConical,
      moreDetails: `Key responsibilities and achievements:
      - Designed and executed advanced NC-AFM/STM experiments for single-atom/molecule manipulation.
      - Developed Python-based analysis scripts, improving data processing efficiency by ~30%.
      - Mentored 2 PhD students on experimental techniques and data interpretation.
      - Investigating novel methodologies for creating 3D atomic structures.
      - Applied deep learning models for real-time image recognition in microscopy, enhancing feature identification speed.`,
    },
    {
      id: 2,
      role: "Physics PhD Researcher",
      institution: "University of Nottingham & King's College London, UK",
      duration: "2016-2019, 2022-Present (Expected Submission: Mid 2025)",
      description:
        "Thesis: 'Towards 3D printing with atoms: Integrating machine learning with scanning probe microscopy for automated atomic assembly.'",
      icon: GraduationCap,
      moreDetails: `Research focus and key contributions:
      - Explored the intersection of nanoscience, DFT, and AI for atomic-scale fabrication.
      - Operated and maintained complex UHV SPM systems.
      - Performed DFT simulations (VASP) to model atomic interactions and guide experimental design.
      - Developed bespoke machine learning algorithms (Python, TensorFlow) to control AFM tip movement for precise atomic placement, achieving X% improvement in placement accuracy.`,
    },
    {
      id: 3,
      role: "Intelligence Analyst",
      institution: "Cortex-Intelligence, São Paulo, Brazil",
      duration: "Feb 2015 - Jul 2015",
      description:
        "Analysed big data for clients in various sectors, providing actionable insights through statistical modeling and data visualization.",
      icon: Brain,
      moreDetails: `Key projects and responsibilities:
      - Utilized R and Python (Pandas, Scikit-learn) for data mining, statistical analysis, and predictive modeling.
      - Designed and implemented custom dashboards (e.g., using Plotly/Dash) for clients to monitor KPIs and identify trends.
      - Delivered market segmentation analysis for a major retail client, leading to a Y% targeted marketing campaign improvement.
      - Developed customer churn prediction models that identified at-risk customers with Z% accuracy.`,
    },
    {
      id: 4,
      role: "Partner - Real Estate Project",
      institution: "Family Business, São Paulo, Brazil",
      duration: "Jun 2013 - Dec 2014",
      description:
        "Responsible for financial analysis, project viability assessment, and investor relations for a residential development project.",
      icon: Building,
      moreDetails: `Contributions and outcomes:
      - Managed project budgets and cash flow projections for a multi-unit residential development.
      - Conducted thorough market research and competitor analysis to inform pricing and development strategies.
      - Prepared comprehensive financial reports and presentations for stakeholders and potential investors.
      - Successfully contributed to securing X amount in partial funding through targeted investor outreach.`,
    },
    {
      id: 5,
      role: "Investment and Intelligence Analyst",
      institution: "BR Properties S.A., São Paulo, Brazil",
      duration: "Feb 2011 - May 2013",
      description:
        "Financial viability analysis for commercial real estate acquisitions and development. Contributed to the creation of the intelligence department.",
      icon: Briefcase,
      moreDetails: `Key responsibilities and achievements:
      - Developed and refined complex financial models (DCF, IRR, sensitivity analysis) for valuing commercial properties exceeding $Y million.
      - Conducted in-depth due diligence on potential acquisitions, identifying key risks and opportunities.
      - Played an instrumental role in establishing data collection methodologies and market analysis protocols for the newly formed intelligence unit, improving reporting accuracy by Z%.`,
    },
    {
      id: 6,
      role: "Engineering Degree - Civil/Electrical Emphasis",
      institution:
        "POLI (Polytechnic School of Engineering, University of São Paulo), Brazil",
      duration: "Jan 2006 - Jun 2012",
      description:
        "Comprehensive 5-7 year engineering course with a strong foundation in mathematics, physics, and specialized engineering disciplines.",
      icon: GraduationCap,
      moreDetails: `Relevant coursework and projects:
      - Key Modules: Structural Analysis, Electromagnetism, Control Systems, Signal Processing, Thermodynamics, Fluid Mechanics.
      - Final Year Project: Focused on the design and simulation of a sustainable urban infrastructure element, achieving X in [metric].
      - Consistently ranked in the top Y% of the cohort in [specific relevant area].`,
    },
    {
      id: 7,
      role: "Science Internship - Naval Engineering",
      institution: "POLI-USP, São Paulo, Brazil",
      duration: "Jan 2009 - Jan 2010",
      description:
        "Supervisor: Prof. Bernardo Luis Rodrigues de Andrade. Research on hydrofoil design and hydrodynamic efficiency.",
      icon: Anchor,
      moreDetails: `Project details and contributions:
      - Utilized computational fluid dynamics (CFD) software to simulate and optimize hydrofoil shapes for reduced drag and improved lift characteristics.
      - Assisted in the setup and execution of experimental tests in a water tunnel facility, collecting and analyzing performance data.
      - Contributed to a research paper/report on [specific finding or aspect of the project].`,
    },
    {
      id: 8,
      role: "Science Internship - Mathematics",
      institution: "Math Department - USP, São Paulo, Brazil",
      duration: "Jan 2007 - Jul 2009",
      description:
        "Supervisor: Prof. Elói Medina Galego. Studied advanced topics in abstract algebra and number theory.",
      icon: Brain,
      moreDetails: `Areas of study and engagement:
      - Focused on Group Theory, Ring Theory, and Galois Theory.
      - Actively participated in weekly advanced seminars and problem-solving sessions.
      - Developed a deeper understanding of mathematical proofs, abstract structures, and their applications in other scientific fields.`,
    },
  ];

  // Toggles the expanded state for a specific milestone's details.
  const handleToggleDetail = (milestoneId) =>
    setExpandedDetailId((prevId) =>
      prevId === milestoneId ? null : milestoneId,
    );

  return (
    <Section title="Career & Education" icon={Briefcase} id="scientist">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        A journey through academia and industry, driven by a passion for
        physics, data, and problem-solving. Each step has been a building block
        towards new discoveries and innovations.
      </p>
      <div className="space-y-8">
        {" "}
        {/* Container for milestones. */}
        {careerMilestones.map((milestone, index) => {
          const MilestoneIcon = milestone.icon;
          const isExpanded = expandedDetailId === milestone.id; // Check if current milestone is expanded.
          return (
            <AnimatedSection
              key={milestone.id}
              delay={index * 0.1} // Staggered animation.
              threshold={0.05} // Trigger animation when 5% is visible.
            >
              {/* Using <article> for each career milestone. */}
              <article
                className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-700/60 dark:border dark:border-slate-700"
                aria-labelledby={`career-title-${milestone.id}`}
              >
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 pt-1">
                    {MilestoneIcon && (
                      <MilestoneIcon
                        className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 dark:text-emerald-400 strokeWidth={1.5}"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    {/* Milestone Title (H3) */}
                    <h3
                      id={`career-title-${milestone.id}`}
                      className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300"
                    >
                      {milestone.role}
                    </h3>
                    <p className="text-base text-emerald-700 dark:text-emerald-400 font-normal mt-1">
                      {milestone.institution}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2 mt-0.5">
                      {milestone.duration}
                    </p>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-base">
                      {milestone.description}
                    </p>
                    {/* "View More/Less" button for milestones with extra details. */}
                    {milestone.moreDetails && (
                      <button
                        onClick={() => handleToggleDetail(milestone.id)}
                        className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
                        aria-expanded={isExpanded} // Accessibility.
                        aria-controls={`career-details-${milestone.id}`} // Accessibility.
                      >
                        {isExpanded ? "Show Less" : "View More"}
                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                            className="ml-1"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="ml-1"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {/* Collapsible section for additional details. */}
                {isExpanded && milestone.moreDetails && (
                  <motion.div
                    id={`career-details-${milestone.id}`} // For ARIA controls.
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700"
                  >
                    {/* `whitespace-pre-line` preserves line breaks from the `moreDetails` string. */}
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                      {milestone.moreDetails}
                    </p>
                  </motion.div>
                )}
              </article>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
};

/**
 * PublicationItem Component: Displays a single publication with an option to get an AI-generated explanation.
 * @param {object} props - Component props.
 * @param {object} props.pub - Publication data object.
 */
const PublicationItem = ({ pub }) => {
  // State for storing the AI-generated summary.
  const [summary, setSummary] = useState("");
  // State to indicate if the summary is currently being loaded.
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  // State for storing any error messages during summary generation.
  const [summaryError, setSummaryError] = useState("");
  // State to control the visibility of the summary/explanation area.
  const [showSummary, setShowSummary] = useState(false);

  // Async function to handle the generation of the AI summary.
  const handleGenerateSummary = async () => {
    // If summary exists and is hidden, just show it.
    if (summary && !showSummary) {
      setShowSummary(true);
      return;
    }
    // If summary is shown, hide it.
    if (showSummary && summary) {
      setShowSummary(false);
      return;
    }

    // Start loading state.
    setIsLoadingSummary(true);
    setSummaryError("");
    setSummary(""); // Clear any previous summary.
    setShowSummary(true); // Make the summary area visible (for loader/error/content).

    // Construct the prompt for the Gemini API.
    const prompt = `Please provide a concise summary or explain the significance of the following scientific publication in 2-3 sentences, suitable for a general audience. Focus on the key findings or impact:\nTitle: "${pub.title}"\nAuthors: ${pub.authors}\nJournal: ${pub.journal}\nYear: ${pub.year}\n${pub.note ? `Note: ${pub.note}` : ""}\nWhat are the main takeaways or importance of this research?`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKeyGen = ""; // IMPORTANT: API Key should be handled securely, typically via environment variables, not hardcoded.
    // This empty string is a placeholder. The actual key might be injected by the environment.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGen}`;

    try {
      // Make the API request.
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Handle non-successful responses.
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error details from API.
        console.error("Gemini API Error:", errorData);
        throw new Error(
          `API request failed: ${errorData?.error?.message || response.status}`,
        );
      }
      const result = await response.json(); // Parse successful response.
      // Extract the summary text from the API response.
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setSummary(result.candidates[0].content.parts[0].text);
      } else {
        // Handle cases where the response structure is not as expected.
        console.error("Unexpected API response structure:", result);
        throw new Error("Failed to extract summary from API response.");
      }
    } catch (error) {
      // Handle any errors during the fetch or processing.
      console.error("Summary generation error:", error);
      setSummaryError(
        error.message ||
          "An unknown error occurred while generating the summary.",
      );
    } finally {
      // Ensure loading state is turned off regardless of success or failure.
      setIsLoadingSummary(false);
    }
  };

  return (
    // Using <article> for each publication item.
    <article
      className="bg-emerald-50 dark:bg-slate-800 p-5 rounded-lg shadow-md hover:shadow-lg dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-shadow duration-300"
      aria-labelledby={`pub-title-${pub.id}`}
    >
      {/* Publication Title (H3) */}
      <h3
        id={`pub-title-${pub.id}`}
        className="text-lg md:text-xl font-medium text-emerald-800 dark:text-emerald-300 mb-1.5"
      >
        {pub.title}
      </h3>
      <p className="text-sm text-gray-700 dark:text-slate-400 italic mb-1 truncate-authors">
        {" "}
        {/* Truncate long author lists visually. */}
        {pub.authors}
      </p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
        {pub.journal} ({pub.year})
      </p>
      {pub.note && ( // Display note if available.
        <p className="text-xs text-gray-600 dark:text-slate-500 mb-3">
          {pub.note}
        </p>
      )}
      {/* Action buttons: View Publication and AI Explanation. */}
      <div className="flex flex-wrap items-center space-x-4 mt-3">
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center mb-2 sm:mb-0 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
        >
          View Publication{" "}
          <ExternalLink size={16} className="ml-1.5" aria-hidden="true" />
        </a>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary} // Disable button while loading.
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          aria-controls={`pub-summary-${pub.id}`} // Associates button with the summary area.
          aria-expanded={showSummary} // Indicates if summary is visible.
        >
          <Sparkles size={16} className="mr-1.5" aria-hidden="true" />{" "}
          {/* AI sparkle icon. */}
          {/* Dynamically change button text based on state. */}
          {isLoadingSummary
            ? "Thinking..."
            : showSummary && summary
              ? "Hide AI Explanation"
              : "✨ Explain with AI"}
        </button>
      </div>

      {/* AI Generated Summary Area (conditionally rendered). */}
      {showSummary && (
        <motion.div
          id={`pub-summary-${pub.id}`} // For ARIA controls.
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-emerald-200 dark:border-slate-700"
        >
          {/* Loading state display. */}
          {isLoadingSummary && (
            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
              <Loader2
                size={18}
                className="animate-spin mr-2"
                aria-hidden="true"
              />
              Generating explanation...
            </div>
          )}
          {/* Error state display. */}
          {summaryError && !isLoadingSummary && (
            <div
              className="flex items-start text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md"
              role="alert"
            >
              {" "}
              {/* ARIA role for error messages. */}
              <AlertTriangle
                size={18}
                className="mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <strong>Error:</strong> {summaryError}
                <p className="text-xs mt-1">Please try again later.</p>
              </div>
            </div>
          )}
          {/* Success state: Display the summary. */}
          {summary && !isLoadingSummary && !summaryError && (
            <div>
              {/* Summary Title (H4) */}
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                AI Explanation:
              </h4>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                {" "}
                {/* `whitespace-pre-wrap` preserves line breaks in the summary. */}
                {summary}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </article>
  );
};

/**
 * PublicationsSection Component: Lists selected scientific publications.
 */
const PublicationsSection = () => {
  // Array of publication data.
  const publications = [
    {
      id: 1,
      title:
        "Embedding human heuristics in machine-learning-enabled probe microscopy",
      authors: "Oliver M Gordon and Filipe LQ Junqueira and Philip J Moriarty.",
      journal: "MACHINE LEARNING: SCIENCE AND TECHNOLOGY-IOP PUBLISHING",
      year: "2020",
      doi: "10.1088/2632-2153/AB42EC",
      link: "https://doi.org/10.1088/2632-2153/AB42EC",
    },
    {
      id: 2,
      title:
        "Scanning tunneling state recognition with multi-class neural network ensembles",
      authors:
        "O. Gordon and P. D'Hondt and L. Knijff and S. E. Freeney and F. Junqueira and P. Moriarty and I. Swart.",
      journal: "REVIEW OF SCIENTIFIC INSTRUMENTS - AIP PUBLISHING",
      year: "2019",
      doi: "10.1063/1.5099590",
      link: "https://doi.org/10.1063/1.5099590",
    },
    {
      id: 3,
      title: "Chemical shielding of H2O and HF encapsulated inside a C60 cage",
      authors:
        "Samuel P. Jarvis, Filipe Junqueira, Alex Saywell, Philipp Rahe, Salvatore Mamone, Simon Taylor, Adam Sweetman, Jeremy Leaf, Hongqian Sang, Lev Kantorovich, David Duncan, Tien-Lin Lee, Pardeep Kumar, Richard Whitby, Philip Moriarty, and Robert G Jones.",
      journal: "NATURE COMMUNICATIONS CHEMISTRY",
      year: "2021",
      doi: "10.1038/s42004-021-00569-0",
      link: "https://doi.org/10.1038/s42004-021-00569-0",
      note: "An STM and XWS study. XWS performed at 109 hut at Diamond Light Source.",
    },
    {
      id: 4,
      title: "Atomic cranes for cyclic single vertical atom manipulations",
      authors:
        "David Abbasi-Pérez, Hongqian Sang, Filipe Junqueira, Adam Sweetman, J. Manuel Recio, Philip Moriarty and Lev Kantorovich.",
      journal: "THE JOURNAL OF PHYSICAL CHEMISTRY LETTERS",
      year: "2021",
      doi: "10.1021/acs.jpclett.1c02271",
      link: "https://doi.org/10.1021/acs.jpclett.1c02271",
      note: "A DFT study.",
    },
  ];
  return (
    <Section title="Selected Publications" icon={BookOpen} id="publications">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        Contributing to the body of scientific knowledge through peer-reviewed
        research. These works explore topics from machine learning in microscopy
        to fundamental studies of molecular interactions. Click "Explain with
        AI" for a quick summary!
      </p>
      <div className="space-y-6">
        {" "}
        {/* Container for publication items. */}
        {publications.map((pub, index) => (
          // Each publication item is animated.
          <AnimatedSection key={pub.id} delay={index * 0.1} threshold={0.05}>
            <PublicationItem pub={pub} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

/**
 * HoverFlipButton Component: A reusable button with a text/icon flip animation on hover.
 * @param {object} props - Component props.
 * @param {string} props.href - URL the button links to.
 * @param {React.ElementType} props.IconInitial - Lucide icon for the initial state.
 * @param {string} props.textInitial - Text for the initial state.
 * @param {string} props.textHover - Text for the hover state.
 * @param {string} props.bgColorInitial - Tailwind CSS background color class for initial state.
 * @param {string} props.bgColorHover - Tailwind CSS background color class for hover state (e.g., 'hover:bg-blue-700').
 * @param {boolean} [props.isExternal=true] - If true, opens link in a new tab with 'noopener noreferrer'.
 * @param {string} props.ariaLabel - ARIA label for accessibility.
 */
const HoverFlipButton = ({
  href,
  IconInitial,
  textInitial,
  textHover,
  bgColorInitial,
  bgColorHover,
  isExternal = true,
  ariaLabel,
}) => {
  // State to track if the button is currently being hovered over.
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"} // Open in new tab if external.
      rel={isExternal ? "noopener noreferrer" : ""} // Security for external links.
      className={`flex items-center justify-center font-medium py-2.5 px-5 rounded-md text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-h-[48px] text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/80 ${bgColorInitial} ${bgColorHover}`}
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true.
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false.
      aria-label={ariaLabel || textInitial} // Accessibility: Provides a meaningful label.
    >
      {/* Container for the flipping animation. */}
      <div className="relative w-full text-center overflow-hidden h-5">
        {" "}
        {/* `overflow-hidden` is key for the flip effect. */}
        {/* Initial Text and Icon (visible by default) */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}`}
          aria-hidden={isHovered} // Hide from screen readers if not visible.
        >
          {IconInitial && (
            <IconInitial
              size={18}
              className="mr-2 flex-shrink-0"
              aria-hidden="true"
            />
          )}{" "}
          <span className="truncate">{textInitial}</span>{" "}
          {/* `truncate` prevents text overflow. */}
        </span>
        {/* Hover Text (hidden by default, slides in on hover) */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}
          aria-hidden={!isHovered} // Hide from screen readers if not visible.
        >
          <span className="truncate">{textHover}</span>
        </span>
      </div>
    </a>
  );
};

/**
 * ContactSection Component: Displays contact information and a contact form.
 */
const ContactSection = () => {
  // Initial state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for displaying messages after submission (e.g., success or error)
  const [formMessage, setFormMessage] = useState("");

  // Handles changes in form input fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevents default browser form submission
    setIsSubmitting(true);
    setFormMessage(""); // Clear previous messages

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormMessage("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Placeholder for actual email sending logic
    // In a real application, you would make an API call here to your backend or an email service
    console.log("Form data submitted:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setFormMessage("Thank you for your message! I'll get back to you soon.");
    // Optionally clear the form
    setFormData({ name: "", email: "", message: "" });

    // Hide the message after a few seconds
    setTimeout(() => setFormMessage(""), 5000);
  };

  // Array of contact buttons, excluding email buttons
  const socialContactButtons = [
    {
      href: "https://linkedin.com/in/filipejunqueira",
      IconInitial: Linkedin,
      textInitial: "LinkedIn",
      textHover: "View Profile",
      bgColorInitial: "bg-sky-600 dark:bg-sky-700",
      bgColorHover: "hover:bg-sky-700 dark:hover:bg-sky-800",
      ariaLabel: "Filipe Junqueira on LinkedIn",
    },
    {
      href: "https://github.com/filipejunqueira",
      IconInitial: Github,
      textInitial: "GitHub",
      textHover: "View Repos",
      bgColorInitial: "bg-gray-700 dark:bg-slate-700",
      bgColorHover: "hover:bg-gray-800 dark:hover:bg-slate-600",
      ariaLabel: "Filipe Junqueira on GitHub",
    },
    {
      href: "https://x.com/CaptBroccoli",
      IconInitial: Twitter,
      textInitial: "Twitter / X",
      textHover: "@CaptBroccoli",
      bgColorInitial: "bg-sky-500 dark:bg-sky-600", // Twitter blue
      bgColorHover: "hover:bg-sky-600 dark:hover:bg-sky-700",
      ariaLabel: "Filipe Junqueira (Captain Broccoli) on Twitter/X",
    },
  ];

  return (
    <Section title="Get In Touch" icon={Users} id="contact">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed">
        I'm always open to discussing new projects, collaborations, or just
        connecting with like-minded individuals. Send me a message using the
        form below, or connect via social media!
      </p>

      {/* Contact Form */}
      <motion.div
        className="max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-lg dark:shadow-slate-700/70 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-slate-100 sm:text-sm transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-slate-100 sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleFormChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-slate-100 sm:text-sm transition-colors"
              placeholder="Your message..."
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
          {formMessage && (
            <p
              className={`text-sm mt-3 text-center ${formMessage.includes("Thank you") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {formMessage}
            </p>
          )}
        </form>
      </motion.div>

      {/* Social Contact Buttons Grid */}
      <p className="text-center text-base text-gray-700 dark:text-slate-300 mb-6 md:mb-8">
        Or connect with me on social media:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
        {socialContactButtons.map((button, index) => (
          <AnimatedSection key={index} delay={index * 0.1} threshold={0.1}>
            <HoverFlipButton {...button} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

/**
 * Footer Component: The standard site footer.
 */
const Footer = () => (
  // Using <footer> HTML5 semantic tag.
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

// --- Main App Component ---
/**
 * App Component: The root component of the application.
 * Manages global state like dark mode, Firebase auth, and active navigation section.
 * Renders all other sections and components.
 */
function App() {
  // State for dark mode toggle.
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for Firestore database instance.
  const [db, setDb] = useState(null);
  // State for Firebase Authentication instance.
  // const [auth, setAuth] = useState(null); // `auth` was initialized but not used elsewhere. Removed for now.
  // If needed for other Firebase auth operations, it can be reinstated.
  // State for the current user's ID (from Firebase Auth).
  const [userId, setUserId] = useState(null);
  // State to track if Firebase authentication has been initialized and resolved.
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- SEO: Structured Data (JSON-LD) for Person schema ---
  // This object provides detailed information about the person (Filipe) to search engines.
  // It helps in generating rich snippets in search results.
  const personStructuredData = {
    "@context": "https://schema.org", // Specifies the vocabulary (Schema.org).
    "@type": "Person", // Defines the type of entity.
    name: "Filipe L. Q. Junqueira",
    url: "https://filipej.dev", // Canonical URL of the portfolio.
    image: "https://filipej.dev/og-image.png", // URL to a representative image (e.g., profile or OG image).
    jobTitle: "Research Associate",
    worksFor: {
      "@type": "Organization",
      name: "University of Nottingham",
      sameAs: "https://www.nottingham.ac.uk/physics/", // Optional: Link to the organization/department.
    },
    alumniOf: [
      // Array of educational institutions.
      {
        "@type": "CollegeOrUniversity",
        name: "University of Nottingham",
        sameAs: "https://www.nottingham.ac.uk",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "King's College London",
        sameAs: "https://www.kcl.ac.uk/",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Polytechnic School of Engineering, University of São Paulo",
        sameAs: "https://www.poli.usp.br/",
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
      // Array of URLs to social media and other relevant profiles.
      "https://www.linkedin.com/in/filipejunqueira/",
      "https://github.com/filipejunqueira",
      "https://x.com/CaptBroccoli",
      // Example: "https://scholar.google.com/citations?user=YOUR_GOOGLE_SCHOLAR_ID",
      // Example: "https://www.researchgate.net/profile/YOUR_RESEARCHGATE_PROFILE",
    ],
    description:
      "Portfolio of Filipe L. Q. Junqueira, showcasing research in nanoscience, 3D atomic printing, advanced microscopy (NC-AFM/STM), Density Functional Theory (DFT), machine learning applications, Blender 3D art, and custom CLI tool development for scientific workflows.",
    nationality: {
      "@type": "Country",
      name: "Brazilian",
    },
  };

  // --- Firebase Initialization and Authentication Effect ---
  // This useEffect hook runs once on component mount to initialize Firebase and set up auth listeners.
  useEffect(() => {
    // Proceed only if Firebase config is available and valid.
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0 && appId) {
      try {
        // Initialize Firebase app with the provided configuration.
        const app = initializeApp(firebaseConfig);
        // Get Firestore and Auth service instances.
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app); // `auth` variable was here, if needed reinstate setAuth(firebaseAuth)
        setDb(firestoreDb);
        // setAuth(firebaseAuth); // Store auth instance if needed elsewhere.

        // Set up an observer for authentication state changes.
        // This callback fires when a user signs in, signs out, or token changes.
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in (either anonymously or via custom token).
            setUserId(user.uid);
          } else {
            // No user is signed in. Attempt to sign in.
            // Try with initial auth token if provided (e.g., from Canvas environment).
            if (
              typeof __initial_auth_token !== "undefined" &&
              __initial_auth_token
            ) {
              try {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                // `onAuthStateChanged` will be triggered again with the new user state.
              } catch (customTokenError) {
                console.warn(
                  "Custom token sign-in failed, trying anonymous sign-in:",
                  customTokenError,
                );
                // Fallback to anonymous sign-in if custom token fails.
                try {
                  await signInAnonymously(firebaseAuth);
                } catch (anonError) {
                  console.error("Anonymous sign-in also failed:", anonError);
                  // As a last resort, use a localStorage-backed or random UID.
                  setUserId(
                    localStorage.getItem("portfolio-fallback-uid") ||
                      crypto.randomUUID(), // Generates a random UUID if nothing in localStorage.
                  );
                }
              }
            } else {
              // If no initial token, try anonymous sign-in directly.
              try {
                await signInAnonymously(firebaseAuth);
              } catch (anonError) {
                console.error("Anonymous sign-in failed:", anonError);
                // Fallback UID generation if anonymous sign-in fails.
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
          setIsAuthReady(true); // Mark authentication process as complete.
        });
        // Cleanup function: Unsubscribe the auth listener when the component unmounts.
        return () => unsubscribe();
      } catch (error) {
        // Handle errors during Firebase initialization.
        console.error("Firebase initialization error:", error);
        setIsAuthReady(true); // Still mark as ready to allow UI to render.
        let fallbackUid = localStorage.getItem("portfolio-fallback-uid");
        if (!fallbackUid) {
          fallbackUid = crypto.randomUUID();
          localStorage.setItem("portfolio-fallback-uid", fallbackUid);
        }
        setUserId(fallbackUid); // Use fallback UID.
      }
    } else {
      // If Firebase config is missing or invalid.
      console.warn(
        "Firebase config is missing or empty. Dark mode preference will use localStorage only.",
      );
      setIsAuthReady(true); // Mark as ready.
      let fallbackUid = localStorage.getItem("portfolio-fallback-uid");
      if (!fallbackUid) {
        fallbackUid = crypto.randomUUID();
        localStorage.setItem("portfolio-fallback-uid", fallbackUid);
      }
      setUserId(fallbackUid); // Use fallback UID.
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // --- Dark Mode Preference Loading Effect ---
  // This useEffect hook loads the dark mode preference when auth is ready and a userId is available.
  useEffect(() => {
    // Don't run if auth isn't ready or if there's no userId.
    if (!isAuthReady || !userId) return;

    const loadPreference = async () => {
      let darkModeEnabled = false; // Default to light mode.

      // 1. Try to load from localStorage (quickest method).
      const localPreference = localStorage.getItem(`darkMode-${userId}`);
      if (localPreference !== null) {
        darkModeEnabled = JSON.parse(localPreference);
      }

      // 2. If Firestore is available, try to load from there (can override localStorage if values differ).
      if (db) {
        // Construct the path to the user's dark mode preference document in Firestore.
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
            // Check if the document exists.
            const prefData = docSnap.data();
            if (typeof prefData.enabled === "boolean") {
              // Ensure 'enabled' field is a boolean.
              darkModeEnabled = prefData.enabled;
            }
          }
        } catch (error) {
          console.error(
            "Error loading dark mode preference from Firestore:",
            error,
          );
          // If Firestore loading fails, the value from localStorage (or default) will be used.
        }
      }
      setIsDarkMode(darkModeEnabled); // Set the dark mode state.
    };
    loadPreference();
  }, [isAuthReady, db, userId]); // Dependencies: Re-run if any of these change. (Removed appId as it's constant after init)

  // --- Dark Mode Apply and Save Effect ---
  // This useEffect hook applies the dark mode class to the HTML document and saves the preference.
  useEffect(() => {
    // Apply/remove 'dark' class to the root <html> element for Tailwind CSS styling.
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save the dark mode preference if auth is ready and userId exists.
    if (isAuthReady && userId) {
      // 1. Save to localStorage.
      localStorage.setItem(`darkMode-${userId}`, JSON.stringify(isDarkMode));
      // 2. Save to Firestore if available.
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
        // Use `merge: true` to avoid overwriting other preferences if they exist in the same document.
        setDoc(prefDocRef, { enabled: isDarkMode }, { merge: true }).catch(
          (error) =>
            console.error(
              "Error saving dark mode preference to Firestore:",
              error,
            ),
        );
      }
    }
  }, [isDarkMode, isAuthReady, db, userId, appId]); // Dependencies.

  // Function to toggle dark mode state.
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  // State for the currently active navigation section (used for smooth scrolling).
  const [activeSection, setActiveSection] = useState("home");

  // --- Section Scrolling Effect ---
  // This useEffect hook handles smooth scrolling to sections when `activeSection` changes or when a URL hash is present.
  useEffect(() => {
    // Get section ID from URL hash (e.g., #about -> "about").
    const hash = window.location.hash.substring(1);
    // Determine which section to scroll to: either from hash or from `activeSection` state.
    const sectionIdToScroll =
      hash || (activeSection !== "home" ? activeSection : null);

    if (sectionIdToScroll) {
      const element = document.getElementById(sectionIdToScroll);
      if (element) {
        // Calculate offset position considering navbar height and some padding.
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset; // Element's top relative to document.
        const offsetPosition = elementPosition - navbarHeight - 24; // 24px additional offset.
        // Scroll smoothly to the calculated position.
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        // Update activeSection state if scrolling due to hash, to keep nav in sync
        if (hash && hash !== activeSection) {
          setActiveSection(hash);
        }
      }
    } else if (activeSection === "home" && !hash) {
      // If activeSection is 'home' and no hash in URL, scroll to the top of the page.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    activeSection,
    typeof window !== "undefined" ? window.location.hash : "",
  ]); // Dependency: Re-run this effect when `activeSection` or hash changes.

  // Framer Motion animation variants for specific sections.
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

  // --- Loading State Display ---
  // Show a loading spinner while Firebase authentication is being resolved (if config is present).
  if (
    !isAuthReady && // If auth is not yet ready
    firebaseConfig &&
    Object.keys(firebaseConfig).length > 0 &&
    appId // And Firebase is configured
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

  // --- Main App Render ---
  return (
    // Root container for the entire application.
    <div className="font-sans bg-emerald-50/50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 min-h-screen transition-colors duration-300">
      {/* SEO: Helmet component to inject elements into the document's <head>. */}
      <Helmet>
        {/* JSON-LD Structured Data script for Person schema. */}
        {/* This helps search engines understand the content of the page better. */}
        <script type="application/ld+json">
          {JSON.stringify(personStructuredData)}
        </script>
        {/* Optionally, manage <title> and <meta name="description"> here if they need to be dynamic 
          based on component state or routes. For a single-page scrolling site, these are often
          sufficiently handled in index.html for the primary view.
          Example:
          <title>Filipe L. Q. Junqueira - Portfolio | Nanoscience & Development</title>
          <meta name="description" content={personStructuredData.description} />
        */}
      </Helmet>

      {/* Site Navigation Bar */}
      <Navbar
        setActiveSection={setActiveSection}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      {/* Hero/Introduction Section */}
      <HeroSection />

      {/* Main content area of the page, using <main> HTML5 semantic tag. */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Each major section is wrapped in AnimatedSection for scroll-triggered animations. */}
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

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

// Export the App component as the default export of this module.
export default App;
