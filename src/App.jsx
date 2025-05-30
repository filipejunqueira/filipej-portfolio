import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import {
  Briefcase,
  Code,
  Cpu,
  Linkedin,
  Github,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Box,
  ArrowLeftCircle,
  ArrowRightCircle,
  Image as ImageIcon,
  BookOpen,
  Award,
  Palette,
  Anchor,
  Brain,
  Music,
  Coffee,
  Users,
  Building,
  GraduationCap,
  FlaskConical,
  Sparkles,
  Loader2,
  AlertTriangle,
  UserCircle,
  Terminal,
  BarChart3,
  Zap,
  FileCode,
  Sun,
  Moon, // Added Sun and Moon icons
} from "lucide-react";

import profilePic from "./assets/captainbroccoli.png";
import filipeCv from "./assets/filipecv.pdf";

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

// Firebase configuration (from Canvas environment)
const firebaseConfigString =
  typeof __firebase_config !== "undefined" ? __firebase_config : "{}";
let firebaseConfig = {};
try {
  firebaseConfig = JSON.parse(firebaseConfigString);
  if (Object.keys(firebaseConfig).length === 0) {
    console.warn(
      "Firebase config is empty. Dark mode preference will use localStorage.",
    );
  }
} catch (e) {
  console.error("Error parsing Firebase config:", e);
  // Set to empty object so Firebase related checks fail gracefully
  firebaseConfig = {};
}
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- AnimatedSection Component ---
const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const AnimatedSection = ({
  children,
  className = "",
  id,
  variants = defaultVariants,
  delay = 0,
  threshold = 0.1,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: threshold });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// --- Reusable Helper Components ---
const Section = ({ title, icon: IconComponent, children, id }) => (
  <section
    id={id}
    className="py-16 md:py-20 bg-white dark:bg-slate-800/80 rounded-xl shadow-xl dark:shadow-black/20 mb-12 md:mb-16 px-6 md:px-10"
  >
    <div className="container mx-auto">
      <h2 className="text-3xl sm:text-4xl font-medium text-emerald-700 dark:text-emerald-400 mb-10 md:mb-14 text-center flex items-center justify-center">
        {IconComponent && (
          <IconComponent
            className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-emerald-500 dark:text-emerald-400"
            strokeWidth={2}
          />
        )}
        {title}
      </h2>
      {children}
    </div>
  </section>
);

const ProjectCard = ({
  title,
  description,
  mainImage,
  galleryImages,
  imagePlaceholderColor,
  link,
  type,
  isGalleryOpen,
  onToggleGallery,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);
  const nextImage = (e) => {
    e.stopPropagation();
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex(
        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
      );
  };
  useEffect(() => {
    if (type === "blender" && !isGalleryOpen) setCurrentImageIndex(0);
  }, [isGalleryOpen, type]);
  const imageErrorHandler = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/600x400/E0E0E0/BDBDBD?text=Image+Not+Found`;
  };

  return (
    <div className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 transition-all duration-300 flex flex-col h-full">
      {type === "blender" && mainImage ? (
        <img
          src={mainImage}
          alt={title}
          className="w-full h-52 md:h-60 rounded-md object-cover mb-5 shadow-sm"
          onError={imageErrorHandler}
        />
      ) : (
        <div
          className={`w-full h-52 md:h-60 rounded-md flex items-center justify-center text-white dark:text-slate-300 text-xl font-semibold mb-5 ${imagePlaceholderColor || "bg-gray-300 dark:bg-slate-700"}`}
        >
          {type === "blender" ? (
            <Palette size={52} strokeWidth={1.5} />
          ) : (
            <Code size={52} strokeWidth={1.5} />
          )}
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300 mb-3">
        {title}
      </h3>
      <div className="flex-grow">
        <p
          className={`text-gray-700 dark:text-slate-300 text-sm md:text-base mb-4 ${isDescriptionExpanded ? "" : "line-clamp-3"}`}
        >
          {description}
        </p>
      </div>
      {description.length > 100 && (
        <button
          onClick={toggleDescription}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center mb-4 text-sm font-medium self-start"
        >
          {isDescriptionExpanded ? "Show Less" : "Show More"}
          {isDescriptionExpanded ? (
            <ChevronUp size={18} className="ml-1" />
          ) : (
            <ChevronDown size={18} className="ml-1" />
          )}
        </button>
      )}
      <div className="mt-auto">
        {type === "blender" &&
          galleryImages &&
          galleryImages.length > 0 &&
          onToggleGallery && (
            <button
              onClick={onToggleGallery}
              className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 self-start mr-4 text-sm"
            >
              {isGalleryOpen ? "Hide Images" : "View Images"}
              {isGalleryOpen ? (
                <ChevronUp size={18} className="ml-2" />
              ) : (
                <ImageIcon size={18} className="ml-2" />
              )}
            </button>
          )}
      </div>
      {type === "blender" &&
        isGalleryOpen &&
        galleryImages &&
        galleryImages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700">
            <div className="relative mb-2">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`${title} - Gallery Image ${currentImageIndex + 1}`}
                className="w-full h-60 md:h-72 rounded-md object-cover shadow-inner bg-gray-100 dark:bg-slate-700"
                onError={imageErrorHandler}
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    aria-label="Previous Image"
                  >
                    <ArrowLeftCircle size={22} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    aria-label="Next Image"
                  >
                    <ArrowRightCircle size={22} />
                  </button>
                </>
              )}
            </div>
            {galleryImages.length > 1 && (
              <p className="text-center text-xs text-gray-600 dark:text-slate-400">
                Image {currentImageIndex + 1} of {galleryImages.length}
              </p>
            )}
          </div>
        )}
    </div>
  );
};

// --- Page Sections ---
const Navbar = ({ setActiveSection, toggleDarkMode, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "scientist", label: "Career & Education" },
    { id: "publications", label: "Publications" },
    { id: "blender", label: "Blender Art" },
    { id: "cli", label: "CLI Tools" },
    { id: "contact", label: "Contact" },
  ];
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
  }; // Adjusted brand hover for dark mode

  return (
    <nav className="bg-emerald-600 dark:bg-slate-800 text-white sticky top-0 z-50 shadow-lg dark:shadow-black/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.img
              src={profilePic}
              alt="Filipe L. Q. Junqueira"
              className="w-10 h-10 rounded-full mr-3 object-cover"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.a
              href="#home"
              onClick={() => setActiveSection("home")}
              className="flex-shrink-0 text-xl md:text-2xl font-medium"
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
                  className="hover:bg-emerald-700/50 dark:hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium tracking-wide"
                  whileHover={navLinkHoverAnimation}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className="ml-6 p-2 rounded-full hover:bg-emerald-700/50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-slate-500 transition-colors duration-200"
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.15, rotate: isDarkMode ? -15 : 15 }} // Different rotation for sun/moon
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-slate-300" />
              )}
            </motion.button>
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-emerald-100 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-emerald-700/50 dark:hover:bg-slate-700 focus:outline-none mr-2"
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.15, rotate: isDarkMode ? -15 : 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isDarkMode ? (
                <Sun size={22} className="text-yellow-400" />
              ) : (
                <Moon size={22} />
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
                className="hover:bg-emerald-700/50 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium tracking-wide"
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

const HeroSection = () => (
  <section
    id="home"
    className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-slate-800 dark:to-slate-900 text-white py-24 md:py-32"
  >
    <div className="container mx-auto text-center px-6 flex flex-col items-center">
      <motion.img
        src={profilePic}
        alt="Filipe L. Q. Junqueira profile"
        className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover mb-8 shadow-2xl border-4 border-white/80 dark:border-slate-400/50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 120,
        }}
      />
      <motion.h1
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
        Exploring 3D printing with atoms, NC-AFM & STM studies, DFT, and Machine
        Learning in nanoscience.
      </motion.p>
      <motion.a
        href={filipeCv}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-emerald-600 dark:bg-emerald-500 dark:text-white font-medium py-3 px-8 rounded-md text-base uppercase tracking-wider hover:bg-emerald-50 dark:hover:bg-emerald-600 transition-colors duration-300 shadow-md hover:shadow-lg"
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
  </section>
);

const BlenderCreations = () => {
  const [expandedGalleryId, setExpandedGalleryId] = useState(null);
  const blenderProjects = [
    {
      id: 1,
      title: "Abstract 3D Art",
      description:
        "Exploring forms, textures, and lighting using Blender for creating visually compelling abstract scenes. This involves procedural texturing and complex node setups for dynamic and intricate results.",
      mainImage: blenderA,
      galleryImages: [blenderA1, blenderA2, blenderA3],
    },
    {
      id: 2,
      title: "Scientific Visualization",
      description:
        "Using Blender to create visualizations for complex scientific concepts, such as molecular structures, quantum phenomena, or astrophysical simulations, making them accessible and understandable to a broader audience.",
      mainImage: blenderB,
      galleryImages: [blenderB1, blenderB2, blenderB3, blenderB4, blenderB5],
    },
    {
      id: 3,
      title: "Character/Concept Design",
      description:
        "Developing unique characters and concepts in 3D, from initial sculpting and retopology to final texturing, rigging for animation, or preparing for 3D printing.",
      mainImage: blenderC,
      galleryImages: [blenderC1, blenderC2, blenderC3],
    },
  ];
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {blenderProjects.map((project, index) => (
          <AnimatedSection
            key={project.id}
            delay={index * 0.15}
            threshold={0.1}
          >
            <ProjectCard
              {...project}
              type="blender"
              isGalleryOpen={expandedGalleryId === project.id}
              onToggleGallery={() => handleToggleGallery(project.id)}
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

const CLIToolsSection = () => {
  const cliToolsData = [
    {
      id: 1,
      title: "DFT Automation Suite",
      description:
        "A Python-based CLI tool to streamline Density Functional Theory (DFT) calculations, manage input/output files for software like VASP or Quantum Espresso, and automate job submissions to HPC clusters using SLURM or PBS.",
      icon: FileCode,
      codeExample: `> dft-suite run --job_type relax --struct Si.vasp\nInitializing calculation for Si.vasp...\nInput files generated.\nSubmitting job to SLURM ID: 12345\nMonitoring status... Job completed successfully.\nFinal energy: -5.42 eV/atom`,
      tags: ["Python", "CLI", "DFT", "VASP", "HPC", "Automation", "SLURM"],
      githubLink: "https://github.com/filipejunqueira/dft-suite",
    },
    {
      id: 2,
      title: "SPM Data Analyzer",
      description:
        "Command-line utilities for processing and analyzing Scanning Probe Microscopy (SPM) data (AFM/STM). Features include drift correction, plane fitting, noise filtering, tip deconvolution, and basic statistical analysis of surface features.",
      icon: BarChart3,
      codeExample: `> spm-analyzer process --file afm_scan.xyz --drift_correct --plane_fit\nProcessing scan data: afm_scan.xyz\nApplying 2D polynomial drift correction...\nPerforming plane fitting (order 1)...\nDrift corrected. RMS roughness: 0.15 nm\nSaving processed_afm_scan.dat`,
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
      icon: Zap,
      codeExample: `> quickplot --file results.csv --x_col "Voltage" --y_col "Current" \\ \n  -t "I-V Curve for Device X" --xlabel "Voltage (V)" --ylabel "Current (nA)" --save plot.png\nGenerating plot 'I-V Curve for Device X'...\nSaved to plot_Voltage_vs_Current.png`,
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
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: "easeInOut" },
    }),
    hover: {
      y: -6,
      scale: 1.02,
      boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.12)",
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
          const ToolIcon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 transition-all duration-300 flex flex-col cursor-default border border-gray-200/80 dark:border-slate-700"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.1 }}
              custom={index}
            >
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ToolIcon className="h-9 w-9 mr-3.5 stroke-[1.75] flex-shrink-0" />
                <h3 className="text-lg lg:text-xl font-medium text-emerald-800 dark:text-emerald-300">
                  {tool.title}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-slate-300 text-sm mb-5 flex-grow leading-relaxed">
                {tool.description}
              </p>
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
              {tool.codeExample && (
                <div className="bg-gray-800 dark:bg-slate-900/70 text-gray-300 dark:text-slate-300 p-4 rounded-lg font-mono text-xs mb-5 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre-wrap text-emerald-400 dark:text-sky-400">
                    {tool.codeExample}
                  </pre>
                </div>
              )}
              <motion.a
                href={tool.githubLink || "https://github.com/filipejunqueira"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white font-medium py-2.5 px-5 rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-300 shadow-sm hover:shadow-md text-sm uppercase tracking-wider"
                whileHover={{
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Github size={18} /> View on GitHub
              </motion.a>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

const ScientistCareer = () => {
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  const careerMilestones = [
    {
      id: 1,
      role: "Post-doctoral Researcher",
      institution: "University of Nottingham, UK",
      duration: "Jan 2022 - Present",
      description:
        "Research associate with Prof. Philip Moriarty's nanoscience group, focusing on atomic manipulation and machine learning applications in SPM.",
      icon: FlaskConical,
      moreDetails:
        "Key responsibilities include designing and conducting experiments using NC-AFM/STM, developing Python scripts for data analysis and instrument control, and mentoring PhD students. Currently investigating novel methods for 3D atomic assembly and applying deep learning for real-time image recognition in microscopy.",
    },
    {
      id: 2,
      role: "Physics PhD Researcher",
      institution: "University of Nottingham & King's College London, UK",
      duration: "2016-2019, 2022-Present (Expected Submission: Mid 2025)",
      description:
        "Thesis: 'Towards 3D printing with atoms: Integrating machine learning with scanning probe microscopy for automated atomic assembly.'",
      icon: GraduationCap,
      moreDetails:
        "My PhD research explores the intersection of nanoscience and artificial intelligence. This involves extensive work with ultra-high vacuum (UHV) systems, DFT simulations to understand atomic interactions, and the development of bespoke machine learning models to guide the AFM tip for precise atomic manipulation.",
    },
    {
      id: 3,
      role: "Intelligence Analyst",
      institution: "Cortex-Intelligence, São Paulo, Brazil",
      duration: "Feb 2015 - Jul 2015",
      description:
        "Analysed big data for clients in various sectors, providing actionable insights through statistical modeling and data visualization.",
      icon: Brain,
      moreDetails:
        "Utilized R and Python for data mining and predictive analytics. Developed custom dashboards for clients to monitor KPIs and trends. Projects included market segmentation analysis, customer churn prediction, and sales forecasting.",
    },
    {
      id: 4,
      role: "Partner - Real Estate Project",
      institution: "Family Business, São Paulo, Brazil",
      duration: "Jun 2013 - Dec 2014",
      description:
        "Responsible for financial analysis, project viability assessment, and investor relations for a residential development project.",
      icon: Building,
      moreDetails:
        "Managed budgets, conducted market research to inform pricing strategies, and prepared financial reports for stakeholders. Successfully secured partial funding through presentations to private investors.",
    },
    {
      id: 5,
      role: "Investment and Intelligence Analyst",
      institution: "BR Properties S.A., São Paulo, Brazil",
      duration: "Feb 2011 - May 2013",
      description:
        "Financial viability analysis for commercial real estate acquisitions and development. Contributed to the creation of the intelligence department.",
      icon: Briefcase,
      moreDetails:
        "Developed complex financial models (DCF, IRR) for property valuation. Conducted due diligence on potential investments. Played a key role in establishing data collection and market analysis protocols for the newly formed intelligence unit.",
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
      moreDetails:
        "Key modules included: Structural Analysis, Electromagnetism, Control Systems, Thermodynamics, and Fluid Mechanics. Final year project focused on sustainable urban infrastructure.",
    },
    {
      id: 7,
      role: "Science Internship - Naval Engineering",
      institution: "POLI-USP, São Paulo, Brazil",
      duration: "Jan 2009 - Jan 2010",
      description:
        "Supervisor: Prof. Bernardo Luis Rodrigues de Andrade. Research on hydrofoil design and hydrodynamic efficiency.",
      icon: Anchor,
      moreDetails:
        "Involved computational fluid dynamics (CFD) simulations to optimize hydrofoil shapes for reduced drag and improved stability. Assisted in experimental testing in a water tunnel facility.",
    },
    {
      id: 8,
      role: "Science Internship - Mathematics",
      institution: "Math Department - USP, São Paulo, Brazil",
      duration: "Jan 2007 - Jul 2009",
      description:
        "Supervisor: Prof. Elói Medina Galego. Studied advanced topics in abstract algebra and number theory.",
      icon: Brain,
      moreDetails:
        "Focused on Group Theory and Galois Theory. Participated in weekly seminars and worked on problem sets that extended beyond the standard undergraduate curriculum, fostering a deeper understanding of mathematical proofs and structures.",
    },
  ];
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
        {careerMilestones.map((milestone, index) => {
          const MilestoneIcon = milestone.icon;
          const isExpanded = expandedDetailId === milestone.id;
          return (
            <AnimatedSection
              key={milestone.id}
              delay={index * 0.1}
              threshold={0.05}
            >
              <div className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-700/60">
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 pt-1">
                    {MilestoneIcon && (
                      <MilestoneIcon className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 dark:text-emerald-400 strokeWidth={1.5}" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300">
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
                    {milestone.moreDetails && (
                      <button
                        onClick={() => handleToggleDetail(milestone.id)}
                        className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center uppercase tracking-wider"
                      >
                        {" "}
                        {isExpanded ? "Show Less" : "View More"}
                        {isExpanded ? (
                          <ChevronUp size={18} className="ml-1" />
                        ) : (
                          <ChevronDown size={18} className="ml-1" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {isExpanded && milestone.moreDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700"
                  >
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                      {milestone.moreDetails}
                    </p>
                  </motion.div>
                )}
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
};

const PublicationItem = ({ pub }) => {
  const [summary, setSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const handleGenerateSummary = async () => {
    if (summary && !showSummary) {
      setShowSummary(true);
      return;
    }
    if (showSummary && summary) {
      setShowSummary(false);
      return;
    }
    setIsLoadingSummary(true);
    setSummaryError("");
    setSummary("");
    setShowSummary(true);
    const prompt = `Please provide a concise summary or explain the significance of the following scientific publication in 2-3 sentences, suitable for a general audience. Focus on the key findings or impact:\nTitle: "${pub.title}"\nAuthors: ${pub.authors}\nJournal: ${pub.journal}\nYear: ${pub.year}\n${pub.note ? `Note: ${pub.note}` : ""}\nWhat are the main takeaways or importance of this research?`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKeyGen = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGen}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(
          `API request failed: ${errorData?.error?.message || response.status}`,
        );
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setSummary(result.candidates[0].content.parts[0].text);
      } else {
        console.error("Unexpected API response:", result);
        throw new Error("Failed to extract summary.");
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      setSummaryError(error.message || "Error generating summary.");
    } finally {
      setIsLoadingSummary(false);
    }
  };
  return (
    <div className="bg-emerald-50 dark:bg-slate-800 p-5 rounded-lg shadow-md hover:shadow-lg dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 transition-shadow duration-300">
      <h3 className="text-lg md:text-xl font-medium text-emerald-800 dark:text-emerald-300 mb-1.5">
        {pub.title}
      </h3>
      <p className="text-sm text-gray-700 dark:text-slate-400 italic mb-1 truncate-authors">
        {pub.authors}
      </p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
        {pub.journal} ({pub.year})
      </p>
      {pub.note && (
        <p className="text-xs text-gray-600 dark:text-slate-500 mb-3">
          {pub.note}
        </p>
      )}
      <div className="flex flex-wrap items-center space-x-4 mt-3">
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center mb-2 sm:mb-0 uppercase tracking-wider"
        >
          View Publication <ExternalLink size={16} className="ml-1.5" />
        </a>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          <Sparkles size={16} className="mr-1.5" />
          {isLoadingSummary
            ? "Thinking..."
            : showSummary && summary
              ? "Hide AI Explanation"
              : "✨ Explain with AI"}
        </button>
      </div>
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-emerald-200 dark:border-slate-700"
        >
          {isLoadingSummary && (
            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
              <Loader2 size={18} className="animate-spin mr-2" />
              Generating explanation...
            </div>
          )}
          {summaryError && !isLoadingSummary && (
            <div className="flex items-start text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <div>
                <strong>Error:</strong> {summaryError}
                <p className="text-xs mt-1">Please try again later.</p>
              </div>
            </div>
          )}
          {summary && !isLoadingSummary && !summaryError && (
            <div>
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                AI Explanation:
              </h4>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const PublicationsSection = () => {
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
        {publications.map((pub, index) => (
          <AnimatedSection key={pub.id} delay={index * 0.1} threshold={0.05}>
            <PublicationItem pub={pub} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

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
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
      className={`flex items-center justify-center font-medium py-2.5 px-5 rounded-md text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-h-[48px] text-sm uppercase tracking-wider ${bgColorInitial} ${bgColorHover}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel || textInitial}
    >
      <div className="relative w-full text-center overflow-hidden h-5">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}`}
          aria-hidden={isHovered}
        >
          {IconInitial && (
            <IconInitial size={18} className="mr-2 flex-shrink-0" />
          )}{" "}
          <span className="truncate">{textInitial}</span>
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}
          aria-hidden={!isHovered}
        >
          <span className="truncate">{textHover}</span>
        </span>
      </div>
    </a>
  );
};

const ContactSection = () => {
  const contactButtons = [
    {
      href: "mailto:filipelqj@gmail.com",
      IconInitial: Mail,
      textInitial: "Personal Email",
      textHover: "filipelqj@gmail.com",
      bgColorInitial: "bg-red-500 dark:bg-red-600",
      bgColorHover: "hover:bg-red-600 dark:hover:bg-red-700",
      isExternal: false,
      ariaLabel: "Email Filipe (Personal)",
    },
    {
      href: "mailto:filipe.junqueira@nottingham.ac.uk",
      IconInitial: Mail,
      textInitial: "Nottingham Email",
      textHover: "filipe.junqueira@nottingham.ac.uk",
      bgColorInitial: "bg-emerald-500 dark:bg-emerald-600",
      bgColorHover: "hover:bg-emerald-600 dark:hover:bg-emerald-700",
      isExternal: false,
      ariaLabel: "Email Filipe (Nottingham)",
    },
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
  ];
  return (
    <Section title="Get In Touch" icon={Users} id="contact">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed">
        I'm always open to discussing new projects, collaborations, or just
        connecting with like-minded individuals. Whether it's about nanoscience,
        3D art, or software development, feel free to reach out!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {contactButtons.map((button, index) => (
          <AnimatedSection key={index} delay={index * 0.1} threshold={0.1}>
            <HoverFlipButton {...button} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

const Footer = () => (
  <footer className="bg-emerald-700 dark:bg-slate-800 text-emerald-100 dark:text-slate-300 py-10 text-center">
    <div className="container mx-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Filipe L. Q. Junqueira. All rights
        reserved.
      </p>
      <p className="text-xs mt-2 opacity-80 dark:opacity-70">
        Crafted with React, Tailwind CSS, Framer Motion & Love :-)
      </p>
    </div>
  </footer>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // Tracks if initial auth check is done

  // Initialize Firebase and Auth
  useEffect(() => {
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
      try {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            // Try custom token first if available (Canvas environment)
            if (
              typeof __initial_auth_token !== "undefined" &&
              __initial_auth_token
            ) {
              try {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                // onAuthStateChanged will run again and set the user
              } catch (customTokenError) {
                console.error(
                  "Error signing in with custom token, trying anonymous:",
                  customTokenError,
                );
                try {
                  await signInAnonymously(firebaseAuth);
                } catch (anonError) {
                  console.error("Error signing in anonymously:", anonError);
                  setUserId(crypto.randomUUID()); // Fallback to random UUID if anonymous also fails
                }
              }
            } else {
              try {
                await signInAnonymously(firebaseAuth);
              } catch (anonError) {
                console.error("Error signing in anonymously:", anonError);
                setUserId(crypto.randomUUID()); // Fallback to random UUID
              }
            }
          }
          setIsAuthReady(true);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setIsAuthReady(true);
        setUserId(crypto.randomUUID()); // Fallback userId if Firebase fails to init
      }
    } else {
      console.warn(
        "Firebase config is missing or empty. Dark mode preference will use localStorage and a random user ID.",
      );
      setIsAuthReady(true);
      setUserId(crypto.randomUUID()); // Generate a random UUID if no Firebase
    }
  }, []);

  // Load dark mode preference
  useEffect(() => {
    // Only attempt to load after auth is ready and we have a userId
    if (!isAuthReady || !userId) return;

    const loadPreference = async () => {
      if (db) {
        // Try Firestore first
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
              setIsDarkMode(prefData.enabled);
              return; // Preference loaded from Firestore
            }
          }
        } catch (error) {
          console.error(
            "Error loading dark mode preference from Firestore:",
            error,
          );
        }
      }
      // Fallback to localStorage if Firestore fails or is not available
      const localPreference = localStorage.getItem("darkMode");
      if (localPreference !== null) {
        setIsDarkMode(JSON.parse(localPreference));
      } else {
        // Optional: Check system preference if no user preference is found
        // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // setIsDarkMode(prefersDark);
      }
    };
    loadPreference();
  }, [isAuthReady, db, userId]); // Rerun when auth status or userId changes

  // Effect to apply/remove 'dark' class and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Only save after initial auth check and if userId is available
    if (isAuthReady && userId) {
      if (db) {
        // Try Firestore first
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
            console.error(
              "Error saving dark mode preference to Firestore:",
              error,
            ),
        );
      } else {
        // Fallback to localStorage
        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
      }
    }
  }, [isDarkMode, isAuthReady, db, userId]); // Rerun when dark mode or auth status changes

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const [activeSection, setActiveSection] = useState("home");
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
      }
    } else if (activeSection === "home" && !hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

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

  // Show loading indicator only if Firebase is configured and auth is not ready yet.
  // If Firebase is not configured, we proceed without a loading screen for auth.
  if (
    !isAuthReady &&
    firebaseConfig &&
    Object.keys(firebaseConfig).length > 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-slate-900">
        <Loader2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans bg-emerald-50/50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 min-h-screen transition-colors duration-300">
      <Navbar
        setActiveSection={setActiveSection}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <HeroSection />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <AnimatedSection
          id="scientist-animated-wrapper"
          variants={fadeInFromLeft}
          delay={0.1}
        >
          <ScientistCareer />
        </AnimatedSection>
        <AnimatedSection
          id="publications-animated-wrapper"
          variants={defaultVariants}
          delay={0.2}
        >
          <PublicationsSection />
        </AnimatedSection>
        <AnimatedSection
          id="blender-animated-wrapper"
          variants={fadeInFromRight}
          delay={0.1}
        >
          <BlenderCreations />
        </AnimatedSection>
        <AnimatedSection
          id="cli-animated-wrapper"
          variants={defaultVariants}
          delay={0.2}
        >
          <CLIToolsSection />
        </AnimatedSection>
        <AnimatedSection
          id="contact-animated-wrapper"
          variants={fadeInFromLeft}
          delay={0.1}
        >
          <ContactSection />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}

export default App;
