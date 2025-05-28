// This line imports the 'React' library and some specific tools from it.
// 'useState', 'useEffect', and 'useCallback' are "Hooks" – special functions that let you use React features in function components.
import React, { useState, useEffect, useCallback } from "react";

// This line imports various icon components from the 'lucide-react' library.
// Each name (Briefcase, Code, etc.) is an icon. 'Image as ImageIcon' renames 'Image' to 'ImageIcon' to avoid naming conflicts.
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
  UserCircle, // We might not need UserCircle anymore if replacing all placeholders
} from "lucide-react";

// Import your profile picture
// Make sure the path is correct. If 'assets' is in 'src', this should work.
import profilePic from "./assets/captainbroccoli.png";

// --- Reusable Helper Components ---
// Components are like custom HTML elements you can create and reuse.
// They make your code more organized and easier to manage.

/**
 * Section Component
 * This is a reusable component that creates a styled section on the page.
 * It takes 'title', 'icon', 'children', and 'id' as "props" (properties/settings).
 * 'children' is a special prop that refers to whatever content is placed between the opening and closing tags of this component.
 * Example: <Section title="My Title">This is the children content</Section>
 *
 * @param {string} title - The title to display for the section.
 * @param {React.ElementType} IconComponent - The icon component (from lucide-react) to display next to the title.
 * @param {React.ReactNode} children - The content that will be rendered inside this section.
 * @param {string} id - An HTML ID for this section, useful for navigation (e.g., clicking a link to jump to this section).
 */
const Section = ({ title, icon: IconComponent, children, id }) => (
  // 'section' is a standard HTML5 semantic tag.
  // 'className' is how you apply CSS classes in JSX (React's HTML-like syntax).
  // These classes are from Tailwind CSS, a utility-first CSS framework that makes styling faster.
  // e.g., 'py-12' means padding on the y-axis (top and bottom) of a certain amount.
  // 'md:py-16' means on medium-sized screens and up, the y-padding will be larger.
  <section
    id={id}
    className="py-12 md:py-16 bg-white rounded-xl shadow-lg mb-8 md:mb-12 px-6 md:px-10"
  >
    {/* 'div' is a standard HTML container. 'container mx-auto' centers the content. */}
    <div className="container mx-auto">
      {/* 'h2' is an HTML heading tag. */}
      <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-8 md:mb-12 text-center flex items-center justify-center">
        {/* This is a conditional render: If an 'IconComponent' prop was provided... */}
        {IconComponent && (
          // ...then render the IconComponent. This is how you use a component passed as a prop.
          <IconComponent className="w-8 h-8 md:w-10 md:h-10 mr-3 text-emerald-500" />
        )}
        {/* This displays the 'title' prop. */}
        {title}
      </h2>
      {/* This renders the 'children' prop – any content nested inside the <Section> tags when it's used. */}
      {children}
    </div>
  </section>
);

/**
 * ProjectCard Component
 * This component displays a card for a single project (either Blender or CLI).
 * It manages its own state for expanding the description and the inline image gallery.
 *
 * @param {string} title - The project's title.
 * @param {string} description - A description of the project.
 * @param {string} imagePlaceholderColor - A Tailwind CSS background color class for the main visual placeholder on the card.
 * @param {Array<string>} [images] - An optional array of image URLs (or placeholder color classes) for Blender projects.
 * @param {string} [link] - An optional URL for the project (e.g., GitHub link for CLI projects).
 * @param {'blender' | 'cli'} type - Indicates if the project is a 'blender' or 'cli' type, used for styling/icons.
 * @param {boolean} [isGalleryOpen] - Prop from parent (BlenderCreations) indicating if this card's gallery should be open.
 * @param {Function} [onToggleGallery] - Prop function from parent to call when the "View Images" button is clicked.
 */
const ProjectCard = ({
  title,
  description,
  imagePlaceholderColor,
  images,
  link,
  type,
  isGalleryOpen,
  onToggleGallery,
}) => {
  // 'useState' is a React Hook. It lets functional components have "state" (data that can change over time and re-render the component).
  // 'isDescriptionExpanded' is a state variable (boolean: true or false).
  // 'setIsDescriptionExpanded' is the function to update this state variable.
  // It's initialized to 'false' (description is not expanded by default).
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // State for the current image index in the inline gallery. Initialized to 0 (the first image).
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to toggle the 'isDescriptionExpanded' state.
  const toggleDescription = () => {
    // When called, it sets 'isDescriptionExpanded' to the opposite of its current value.
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Function to navigate to the next image in the gallery.
  const nextImage = (e) => {
    e.stopPropagation(); // Stops the click event from affecting parent elements.
    // Check if 'images' array exists and has items.
    if (images && images.length > 0) {
      // '% images.length' ensures the index wraps around to 0 if it goes past the last image.
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  // Function to navigate to the previous image in the gallery.
  const prevImage = (e) => {
    e.stopPropagation();
    if (images && images.length > 0) {
      // '+ images.length' is added before '%' to handle negative results correctly for wrapping around.
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    }
  };

  // 'useEffect' is another React Hook. It runs side effects after rendering.
  // This specific effect runs when 'isGalleryOpen' or 'type' changes.
  // It resets the 'currentImageIndex' to 0 if the gallery is closed for a Blender project.
  useEffect(() => {
    if (type === "blender" && !isGalleryOpen) {
      setCurrentImageIndex(0);
    }
  }, [isGalleryOpen, type]); // The array [isGalleryOpen, type] lists dependencies for this effect.

  // The 'return' statement contains the JSX (HTML-like syntax) that defines what this component looks like.
  return (
    <div className="bg-emerald-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Main visual placeholder for the project card */}
      <div
        className={`w-full h-48 md:h-56 rounded-md flex items-center justify-center text-white text-xl font-semibold mb-4 ${imagePlaceholderColor}`}
      >
        {/* Conditional rendering: If type is 'blender', show Palette icon, else show Code icon. */}
        {type === "blender" ? <Palette size={48} /> : <Code size={48} />}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-emerald-800 mb-2">
        {title}
      </h3>
      {/* Container for the description, 'flex-grow' allows it to take up available vertical space. */}
      <div className="flex-grow">
        {/* The description text. 'line-clamp-3' (Tailwind utility) limits it to 3 lines if not expanded. */}
        <p
          className={`text-emerald-600 mb-4 ${isDescriptionExpanded ? "" : "line-clamp-3"}`}
        >
          {description}
        </p>
      </div>
      {/* "Show More/Less" button for the description, only shown if description is long. */}
      {description.length > 100 && (
        <button
          onClick={toggleDescription} // Calls the toggleDescription function when clicked.
          className="text-emerald-500 hover:text-emerald-700 flex items-center mb-3 text-sm self-start"
        >
          {/* Text changes based on 'isDescriptionExpanded' state. */}
          {isDescriptionExpanded ? "Show Less" : "Show More"}
          {/* Icon also changes based on state. */}
          {isDescriptionExpanded ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </button>
      )}

      {/* Container for action buttons, 'mt-auto' pushes it to the bottom of the card. */}
      <div className="mt-auto">
        {/* "View Images" button, only for 'blender' type projects that have images and an onToggleGallery function. */}
        {type === "blender" &&
          images &&
          images.length > 0 &&
          onToggleGallery && (
            <button
              onClick={onToggleGallery} // Calls the function passed down from the BlenderCreations parent component.
              className="inline-flex items-center text-emerald-500 hover:text-emerald-700 font-medium transition-colors duration-300 self-start mr-4"
            >
              {/* Button text and icon change based on the 'isGalleryOpen' prop. */}
              {isGalleryOpen ? "Hide Images" : "View Images"}
              {isGalleryOpen ? (
                <ChevronUp size={18} className="ml-2" />
              ) : (
                <ImageIcon size={18} className="ml-2" />
              )}
            </button>
          )}
        {/* "View on GitHub" link, only for 'cli' type projects that have a 'link'. */}
        {type === "cli" && link && (
          <a // Standard HTML anchor tag for links.
            href={link} // The URL to link to.
            target="_blank" // Opens the link in a new browser tab.
            rel="noopener noreferrer" // Security best practice for target="_blank".
            className="inline-flex items-center text-emerald-500 hover:text-emerald-700 font-medium transition-colors duration-300 self-start"
          >
            View on GitHub <Github size={18} className="ml-2" />
          </a>
        )}
      </div>

      {/* Inline Image Gallery section, only shown for 'blender' type if 'isGalleryOpen' is true and images exist. */}
      {type === "blender" && isGalleryOpen && images && images.length > 0 && (
        <div className="mt-4 pt-4 border-t border-emerald-200">
          {" "}
          {/* Adds a top border for separation */}
          <div className="relative mb-2">
            {" "}
            {/* 'relative' positioning for placing arrow buttons. */}
            {/* Placeholder for the actual image. TODO: Replace this div with an <img> tag when you have real image URLs. */}
            <div
              className={`w-full h-56 md:h-72 rounded-md flex items-center justify-center text-white text-xl font-semibold ${images[currentImageIndex]} shadow-inner`}
            >
              Image {currentImageIndex + 1} <br /> (Placeholder:{" "}
              {images[currentImageIndex]})
            </div>
            {/* Navigation arrows, only shown if there's more than one image. */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1.5 rounded-full hover:bg-opacity-60 transition-opacity"
                  aria-label="Previous Image" // For accessibility.
                >
                  <ArrowLeftCircle size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-1.5 rounded-full hover:bg-opacity-60 transition-opacity"
                  aria-label="Next Image"
                >
                  <ArrowRightCircle size={20} />
                </button>
              </>
            )}
          </div>
          {/* Image counter, e.g., "Image 1 of 3". */}
          {images.length > 1 && (
            <p className="text-center text-xs text-emerald-500">
              Image {currentImageIndex + 1} of {images.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Page Sections ---
// These are larger components that make up the main parts of your portfolio page.

/**
 * Navbar Component
 * This creates the sticky navigation bar at the top of the page.
 * It includes the site title/logo and navigation links.
 * It also handles the mobile menu (hamburger menu).
 * @param {Function} setActiveSection - A function passed from the App component to update which section is considered "active" (for potential scrollspy or highlighting, and for smooth scrolling).
 */
const Navbar = ({ setActiveSection }) => {
  // 'isOpen' state controls whether the mobile menu is open or closed.
  const [isOpen, setIsOpen] = useState(false);

  // An array of objects, each representing a navigation link.
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "scientist", label: "Career & Education" },
    { id: "publications", label: "Publications" },
    { id: "blender", label: "Blender Art" },
    { id: "cli", label: "CLI Tools" },
    { id: "contact", label: "Contact" },
  ];

  return (
    // 'nav' is an HTML5 semantic tag for navigation sections.
    // 'sticky top-0 z-50' makes the navbar stick to the top of the screen and appear above other content.
    <nav className="bg-emerald-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* 'h-16' sets a fixed height. */}
          {/* Left side of the navbar: Photo placeholder and Site Name/Brand */}
          <div className="flex items-center">
            {/* MODIFIED: Replaced div with img tag for profile picture */}
            <img
              src={profilePic}
              alt="Filipe L. Q. Junqueira"
              className="w-10 h-10 rounded-full mr-3 object-cover shadow-inner"
            />
            {/* Site name, links to the 'home' section. */}
            <a
              href="#home"
              onClick={() => setActiveSection("home")}
              className="flex-shrink-0 text-xl md:text-2xl font-bold"
            >
              Filipe L. Q. Junqueira
            </a>
          </div>
          {/* Right side of the navbar: Desktop navigation links. 'hidden md:block' hides it on small screens and shows it on medium screens and up. */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* '.map()' is a JavaScript array method. It iterates over 'navLinks' and creates an '<a>' tag for each link. */}
              {navLinks.map((link) => (
                <a
                  key={link.id} // 'key' is a special React prop needed for lists of items, helps React identify each item.
                  href={`#${link.id}`} // Link destination (e.g., "#home", "#scientist").
                  onClick={() => {
                    // When a link is clicked:
                    setActiveSection(link.id); // Update the active section in the App component.
                    setIsOpen(false); // Close the mobile menu if it's open.
                  }}
                  className="hover:bg-emerald-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.label} {/* The text of the link. */}
                </a>
              ))}
            </div>
          </div>
          {/* Mobile menu button (hamburger icon). '-mr-2 flex md:hidden' shows it only on small screens. */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)} // Toggles the 'isOpen' state for the mobile menu.
              type="button"
              className="bg-emerald-700 inline-flex items-center justify-center p-2 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white"
              aria-controls="mobile-menu" // For accessibility, indicates which element this button controls.
              aria-expanded={isOpen} // For accessibility, indicates if the controlled element is expanded.
            >
              <span className="sr-only">Open main menu</span>{" "}
              {/* For screen readers. */}
              {/* Conditional icon: hamburger if menu is closed, 'X' if menu is open. */}
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

      {/* Mobile menu dropdown. Conditionally rendered based on 'isOpen' state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setIsOpen(false); // Close menu after clicking a link.
                }}
                className="hover:bg-emerald-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

/**
 * HeroSection Component
 * This is the main introductory section at the top of the page.
 * It includes a large photo placeholder, your name, title, and a call to action (View CV).
 */
const HeroSection = () => (
  <section
    id="home"
    className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white py-20 md:py-32"
  >
    <div className="container mx-auto text-center px-6 flex flex-col items-center">
      {" "}
      {/* 'flex flex-col items-center' helps center the content vertically. */}
      {/* MODIFIED: Replaced div with img tag for profile picture */}
      <img
        src={profilePic}
        alt="Filipe L. Q. Junqueira profile"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-6 shadow-lg border-4 border-white"
      />
      {/* Your name, styled as a large heading. */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
        Filipe L. Q. Junqueira
      </h1>
      {/* Your title/affiliation. */}
      <p className="text-lg sm:text-xl md:text-2xl mb-4 text-emerald-100 opacity-95">
        Research Associate, School of Physics and Astronomy, University of
        Nottingham
      </p>
      {/* A brief tagline about your work. */}
      <p className="text-md sm:text-lg md:text-xl mb-8 text-emerald-200 max-w-3xl mx-auto">
        Exploring 3D printing with atoms, NC-AFM & STM studies, DFT, and Machine
        Learning in nanoscience.
      </p>
      {/* Button to view/download your CV. TODO: Replace "#" with the actual link to your CV PDF. */}
      <a
        href="#" // Link destination.
        target="_blank" // Opens in a new tab.
        rel="noopener noreferrer" // Security measure for new tabs.
        className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
      >
        View Full CV
      </a>
    </div>
  </section>
);

/**
 * BlenderCreations Component
 * This section showcases your Blender projects using the ProjectCard component.
 * It manages which project's inline gallery is currently expanded.
 */
const BlenderCreations = () => {
  // 'expandedGalleryId' state stores the ID of the project whose gallery is open. 'null' means no gallery is open.
  const [expandedGalleryId, setExpandedGalleryId] = useState(null);

  // Placeholder data for your Blender projects.
  // TODO: Replace these with your actual project details and image URLs.
  const blenderProjects = [
    {
      id: 1,
      title: "Abstract 3D Art",
      description: "Exploring forms, textures, and lighting using Blender...",
      images: ["bg-sky-500", "bg-sky-600"],
      cardVisual: "bg-sky-400",
    },
    {
      id: 2,
      title: "Scientific Visualization",
      description:
        "Using Blender to create visualizations for complex scientific concepts...",
      images: ["bg-orange-500"],
      cardVisual: "bg-orange-400",
    },
    {
      id: 3,
      title: "Character/Concept Design",
      description: "Developing unique characters and concepts in 3D...",
      images: ["bg-purple-500", "bg-purple-600", "bg-purple-700"],
      cardVisual: "bg-purple-400",
    },
  ];

  /**
   * Toggles the visibility of a specific project's image gallery.
   * If the clicked project's gallery is already open, it closes it.
   * Otherwise, it opens the clicked project's gallery and closes any other that might be open.
   * @param {number | string} projectId The ID of the project whose gallery is to be toggled.
   */
  const handleToggleGallery = (projectId) => {
    // 'setExpandedGalleryId' updates the state.
    // It uses a function form to get the previous state value ('prevId').
    setExpandedGalleryId((prevId) => (prevId === projectId ? null : projectId));
  };

  return (
    <Section title="Blender Art & 3D Visualization" icon={Palette} id="blender">
      <p className="text-center text-lg text-emerald-600 mb-10 md:mb-12 max-w-2xl mx-auto">
        Leveraging Blender for creative 3D projects and scientific
        visualization.
      </p>
      {/* 'grid' creates a grid layout. 'md:grid-cols-2 lg:grid-cols-3' makes it responsive (1 col on small, 2 on medium, 3 on large screens). */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Loop through 'blenderProjects' and create a 'ProjectCard' for each. */}
        {blenderProjects.map((project) => (
          <ProjectCard
            key={project.id} // Unique key for React.
            title={project.title}
            description={project.description}
            imagePlaceholderColor={project.cardVisual}
            images={project.images}
            type="blender"
            // 'isGalleryOpen' is true if this project's ID matches the 'expandedGalleryId' state.
            isGalleryOpen={expandedGalleryId === project.id}
            // Pass the 'handleToggleGallery' function, specific to this project's ID.
            onToggleGallery={() => handleToggleGallery(project.id)}
          />
        ))}
      </div>
      <p className="text-center text-md text-emerald-500 mt-10 md:mt-12">
        More creations and visualizations coming soon!
      </p>
    </Section>
  );
};

/**
 * CLIPrograms Component
 * This section showcases your Command Line Interface (CLI) tools.
 */
const CLIPrograms = () => {
  // Placeholder data for CLI projects. TODO: Replace with your actual projects and GitHub links.
  const cliProjects = [
    {
      id: 1,
      title: "DFT & Simulation Scripts",
      description: "Custom Python and Bash scripts for DFT calculations...",
      imagePlaceholderColor: "bg-slate-500",
      githubLink: "#",
    },
    {
      id: 2,
      title: "Machine Learning Utilities",
      description: "Command-line tools for ML model training and evaluation...",
      imagePlaceholderColor: "bg-gray-500",
      githubLink: "#",
    },
    {
      id: 3,
      title: "Data Analysis & Plotting Tools",
      description: "CLI tools for quick data analysis and plotting...",
      imagePlaceholderColor: "bg-stone-500",
      githubLink: "#",
    },
  ];

  return (
    <Section title="CLI Tools & Scripts" icon={Cpu} id="cli">
      <p className="text-center text-lg text-emerald-600 mb-10 md:mb-12 max-w-2xl mx-auto">
        Developing efficient command-line tools using Python, Bash, and various
        data science libraries to streamline research workflows.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {cliProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imagePlaceholderColor={project.imagePlaceholderColor}
            link={project.githubLink} // This is the GitHub URL for the project.
            type="cli"
            // No gallery-related props are needed for CLI projects.
          />
        ))}
      </div>
      <p className="text-center text-md text-emerald-500 mt-10 md:mt-12">
        Explore more on my{" "}
        <a
          href="https://github.com/filipejunqueira"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:underline font-semibold"
        >
          GitHub
        </a>
        .
      </p>
    </Section>
  );
};

/**
 * ScientistCareer Component
 * This section details your career and education milestones.
 * Each milestone can have an expandable "View More" section for additional details.
 */
const ScientistCareer = () => {
  // 'expandedDetailId' state stores the ID of the milestone whose details are currently expanded.
  const [expandedDetailId, setExpandedDetailId] = useState(null);

  // Data for career milestones, populated from your CV.
  // TODO: Fill in the 'moreDetails' placeholders with your actual detailed information.
  const careerMilestones = [
    {
      id: 1,
      role: "Post-doctoral Researcher",
      institution: "University of Nottingham, UK",
      duration: "Jan 2022 - Present",
      description:
        "Research associate with Prof. Philip Moriarty's nanoscience group...",
      icon: FlaskConical,
      moreDetails:
        "Placeholder: Further details about my post-doctoral research...",
    },
    {
      id: 2,
      role: "Physics PhD Researcher",
      institution: "University of Nottingham & King's College London, UK",
      duration: "2016-2019, 2022-Present (Expected Submission: Mid 2025)",
      description: "Thesis: 'Towards 3D printing with atoms...'",
      icon: GraduationCap,
      moreDetails: "Placeholder: More about my PhD research focus...",
    },
    {
      id: 3,
      role: "Intelligence Analyst",
      institution: "Cortex-Intelligence, São Paulo, Brazil",
      duration: "Feb 2015 - Jul 2015",
      description: "Analysed big data for clients...",
      icon: Brain,
      moreDetails: "Placeholder: Details on data analysis performed...",
    },
    {
      id: 4,
      role: "Partner - Real Estate Project",
      institution: "Family Business, São Paulo, Brazil",
      duration: "Jun 2013 - Dec 2014",
      description: "Responsible for financial analysis...",
      icon: Building,
      moreDetails: "Placeholder: Specifics of the real estate project...",
    },
    {
      id: 5,
      role: "Investment and Intelligence Analyst",
      institution: "BR Properties S.A., São Paulo, Brazil",
      duration: "Feb 2011 - May 2013",
      description: "Financial viability analysis...",
      icon: Briefcase,
      moreDetails:
        "Placeholder: More on the scope of the intelligence department...",
    },
    {
      id: 6,
      role: "Engineering Degree - Civil/Electrical Emphasis",
      institution:
        "POLI (Polytechnic School of Engineering, University of São Paulo), Brazil",
      duration: "Jan 2006 - Jun 2012",
      description: "5-7 year engineering course...",
      icon: GraduationCap,
      moreDetails: "Placeholder: Key modules or projects undertaken...",
    },
    {
      id: 7,
      role: "Science Internship - Naval Engineering",
      institution: "POLI-USP, São Paulo, Brazil",
      duration: "Jan 2009 - Jan 2010",
      description: "Supervisor: Prof. Bernardo Luis Rodrigues de Andrade...",
      icon: Anchor,
      moreDetails: "Placeholder: More about the hydrofoil design project...",
    },
    {
      id: 8,
      role: "Science Internship - Mathematics",
      institution: "Math Department - USP, São Paulo, Brazil",
      duration: "Jan 2007 - Jul 2009",
      description: "Supervisor: Prof. Elói Medina Galego...",
      icon: Brain,
      moreDetails: "Placeholder: Specific topics covered in mathematics...",
    },
  ];

  /**
   * Toggles the visibility of the detailed description for a specific career milestone.
   * @param {number | string} milestoneId The ID of the milestone.
   */
  const handleToggleDetail = (milestoneId) => {
    setExpandedDetailId((prevId) =>
      prevId === milestoneId ? null : milestoneId,
    );
  };

  return (
    <Section title="Career & Education" icon={Briefcase} id="scientist">
      <p className="text-center text-lg text-emerald-600 mb-10 md:mb-12 max-w-2xl mx-auto">
        A journey through academia and industry, driven by a passion for
        physics, data, and problem-solving.
      </p>
      <div className="space-y-8">
        {" "}
        {/* 'space-y-8' adds vertical spacing between child elements. */}
        {careerMilestones.map((milestone) => {
          const MilestoneIcon = milestone.icon; // Assign prop to a capitalized variable for JSX.
          const isExpanded = expandedDetailId === milestone.id; // Check if this milestone's details should be shown.
          return (
            <div
              key={milestone.id}
              className="bg-emerald-50 p-6 rounded-lg shadow-md"
            >
              <div className="flex flex-col sm:flex-row items-start">
                {" "}
                {/* Responsive layout: column on small, row on medium+ screens. */}
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 pt-1">
                  {" "}
                  {/* Icon container. */}
                  {MilestoneIcon && (
                    <MilestoneIcon className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
                  )}
                </div>
                <div className="flex-grow">
                  {" "}
                  {/* Main content area for the milestone. */}
                  <h3 className="text-xl md:text-2xl font-semibold text-emerald-800">
                    {milestone.role}
                  </h3>
                  <p className="text-md text-emerald-700 font-medium">
                    {milestone.institution}
                  </p>
                  <p className="text-sm text-emerald-500 mb-2">
                    {milestone.duration}
                  </p>
                  <p className="text-emerald-600 leading-relaxed">
                    {milestone.description}
                  </p>
                  {/* "View More" button, only if 'moreDetails' exists for this milestone. */}
                  {milestone.moreDetails && (
                    <button
                      onClick={() => handleToggleDetail(milestone.id)} // Calls the toggle function for this specific milestone.
                      className="mt-3 text-sm text-emerald-500 hover:text-emerald-700 font-semibold inline-flex items-center"
                    >
                      {isExpanded ? "Show Less" : "View More"}
                      {isExpanded ? (
                        <ChevronUp size={16} className="ml-1" />
                      ) : (
                        <ChevronDown size={16} className="ml-1" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {/* Expandable details section, shown if 'isExpanded' is true and 'moreDetails' exists. */}
              {isExpanded && milestone.moreDetails && (
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  {" "}
                  {/* Separator line. */}
                  {/* 'whitespace-pre-line' preserves newlines from the 'moreDetails' string. */}
                  <p className="text-emerald-600 leading-relaxed text-sm whitespace-pre-line">
                    {milestone.moreDetails}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center mt-10 md:mt-12">
        {/* Link to download full CV. TODO: Replace "#" with actual CV file URL. */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
        >
          Download Full CV
        </a>
      </div>
    </Section>
  );
};

/**
 * PublicationItem Component
 * Renders a single publication entry, including a button to get an AI-generated explanation.
 * @param {object} pub - The publication data object.
 */
const PublicationItem = ({ pub }) => {
  // State variables for this specific publication item:
  const [summary, setSummary] = useState(""); // Stores the AI-generated summary.
  const [isLoadingSummary, setIsLoadingSummary] = useState(false); // True while waiting for the API.
  const [summaryError, setSummaryError] = useState(""); // Stores any error message from the API call.
  const [showSummary, setShowSummary] = useState(false); // Controls visibility of the summary/loading/error area.

  // Async function to handle the Gemini API call. 'async' allows using 'await'.
  const handleGenerateSummary = async () => {
    // If a summary already exists and is hidden, just show it.
    if (summary && !showSummary) {
      setShowSummary(true);
      return; // Exit the function.
    }
    // If a summary is already shown, hide it.
    if (showSummary && summary) {
      setShowSummary(false);
      return; // Exit the function.
    }

    // If no summary yet, or if we need to fetch a new one:
    setIsLoadingSummary(true); // Show loading indicator.
    setSummaryError(""); // Clear any previous errors.
    setSummary(""); // Clear any previous summary.
    setShowSummary(true); // Make the summary area visible (will show loading indicator).

    // Construct the prompt to send to the Gemini API.
    const prompt = `Please provide a concise summary or explain the significance of the following scientific publication in 2-3 sentences, suitable for a general audience. Focus on the key findings or impact:
Title: "${pub.title}"
Authors: ${pub.authors}
Journal: ${pub.journal}
Year: ${pub.year}
${pub.note ? `Note: ${pub.note}` : ""}
What are the main takeaways or importance of this research?`;

    // Prepare the payload for the API request.
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // IMPORTANT: This should be an empty string. Canvas will provide the key at runtime.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      // 'fetch' is a standard browser API for making network requests. 'await' pauses execution until the request completes.
      const response = await fetch(apiUrl, {
        method: "POST", // HTTP method.
        headers: { "Content-Type": "application/json" }, // Tells the API we're sending JSON.
        body: JSON.stringify(payload), // Convert the JavaScript payload object to a JSON string.
      });

      // Check if the API request was successful (HTTP status 200-299).
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the API response.
        console.error("Gemini API Error:", errorData); // Log the error for debugging.
        // Throw an error to be caught by the 'catch' block.
        throw new Error(
          `API request failed with status ${response.status}: ${errorData?.error?.message || "Unknown error"}`,
        );
      }

      // If successful, parse the JSON response from the API.
      const result = await response.json();

      // Extract the generated text from the API response structure.
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setSummary(text); // Update state with the AI-generated summary.
      } else {
        // If the response structure is not as expected.
        console.error("Unexpected API response structure:", result);
        throw new Error("Failed to extract summary from API response.");
      }
    } catch (error) {
      // This block runs if any error occurs in the 'try' block.
      console.error("Error generating summary:", error);
      setSummaryError(
        error.message || "An error occurred while generating the summary.",
      ); // Update state with the error message.
    } finally {
      // This block runs regardless of whether there was an error or not.
      setIsLoadingSummary(false); // Hide loading indicator.
    }
  };

  return (
    <div className="bg-emerald-50 p-5 rounded-lg shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-emerald-800 mb-1">
        {pub.title}
      </h3>
      <p className="text-sm text-emerald-600 italic mb-1 truncate-authors">
        {pub.authors}
      </p>
      <p className="text-sm text-emerald-700 mb-1">
        {pub.journal} ({pub.year})
      </p>
      {pub.note && <p className="text-xs text-emerald-500 mb-2">{pub.note}</p>}
      <div className="flex items-center space-x-4 mt-2">
        {/* Link to view the full publication. */}
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-500 hover:text-emerald-700 hover:underline font-medium inline-flex items-center"
        >
          View Publication <ExternalLink size={14} className="ml-1.5" />
        </a>
        {/* Button to trigger AI summary generation. */}
        <button
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary} // Disable button while loading.
          className="text-sm text-purple-600 hover:text-purple-800 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={16} className="mr-1.5" />
          {/* Dynamic button text based on loading and summary state. */}
          {isLoadingSummary
            ? "Thinking..."
            : showSummary && summary
              ? "Hide AI Explanation"
              : "✨ Explain with AI"}
        </button>
      </div>

      {/* Conditional rendering for the AI summary/loading/error area. */}
      {showSummary && (
        <div className="mt-3 pt-3 border-t border-emerald-200">
          {/* Show loading spinner if 'isLoadingSummary' is true. */}
          {isLoadingSummary && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin mr-2" />{" "}
              {/* Animated spinner icon. */}
              Generating explanation...
            </div>
          )}
          {/* Show error message if 'summaryError' exists and not loading. */}
          {summaryError && !isLoadingSummary && (
            <div className="flex items-start text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <div>
                <strong>Error:</strong> {summaryError}
                <p className="text-xs mt-1">
                  Please try again later. The AI might be busy or there was a
                  network issue.
                </p>
              </div>
            </div>
          )}
          {/* Show the AI-generated summary if it exists, not loading, and no error. */}
          {summary && !isLoadingSummary && !summaryError && (
            <div>
              <h4 className="text-sm font-semibold text-emerald-700 mb-1">
                AI Explanation:
              </h4>
              {/* 'whitespace-pre-wrap' preserves newlines and spaces from the AI's response. */}
              <p className="text-sm text-emerald-600 whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * PublicationsSection Component
 * This section lists your scientific publications.
 * Each publication uses the PublicationItem component, which includes AI summary functionality.
 */
const PublicationsSection = () => {
  // Data for your publications.
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
      year: "2020",
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
      <div className="space-y-6">
        {" "}
        {/* Adds vertical spacing between publication items. */}
        {/* Loop through the 'publications' array and render a 'PublicationItem' for each. */}
        {publications.map((pub) => (
          <PublicationItem key={pub.id} pub={pub} /> // Pass the publication data as a 'pub' prop.
        ))}
      </div>
      {/* This <style jsx global> tag allows writing CSS that can affect child components, useful for utility classes like 'truncate-authors'. */}
    </Section>
  );
};

/**
 * HoverFlipButton Component
 * A reusable button that changes its content (icon/text) on mouse hover.
 * @param {string} href - The URL the button links to.
 * @param {React.ElementType} IconInitial - The Lucide icon component for the initial (non-hovered) state.
 * @param {string} textInitial - The text for the initial state.
 * @param {string} textHover - The text to display when the button is hovered over.
 * @param {string} bgColorInitial - Tailwind CSS class for the button's initial background color.
 * @param {string} bgColorHover - Tailwind CSS class for the button's background color on hover.
 * @param {boolean} [isExternal=true] - If true, the link opens in a new tab. Defaults to true.
 * @param {string} [ariaLabel] - ARIA label for accessibility, describes the button's purpose.
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
  // 'isHovered' state tracks whether the mouse is currently over the button.
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"} // Open in new tab if 'isExternal' is true.
      rel={isExternal ? "noopener noreferrer" : ""} // Security for external links.
      className={`flex items-center justify-center font-semibold py-3 px-6 rounded-lg text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-h-[50px] ${bgColorInitial} ${bgColorHover}`}
      onMouseEnter={() => setIsHovered(true)} // Set 'isHovered' to true when mouse enters.
      onMouseLeave={() => setIsHovered(false)} // Set 'isHovered' to false when mouse leaves.
      aria-label={ariaLabel || textInitial} // Accessibility label.
    >
      {/* This div is a container for the two states of the button content (initial and hover).
          'relative' allows absolute positioning of its children. 'overflow-hidden' clips content.
          'h-6' gives a fixed height to prevent layout shifts when text changes. */}
      <div className="relative w-full text-center overflow-hidden h-6">
        {/* Initial State Content (Icon + Text) */}
        <span
          // 'absolute inset-0' makes it fill the parent 'div'.
          // Transitions for opacity and vertical movement create the "flip" effect.
          // Conditionally applies classes based on 'isHovered' state.
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}`}
          aria-hidden={isHovered} // Hide from screen readers when not visible.
        >
          {IconInitial && (
            <IconInitial size={20} className="mr-2 flex-shrink-0" />
          )}{" "}
          {/* Render icon if provided. */}
          <span className="truncate">{textInitial}</span>{" "}
          {/* Truncate text if too long. */}
        </span>
        {/* Hover State Content (Text Only) */}
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

/**
 * ContactSection Component
 * This section provides contact information using the HoverFlipButton component.
 */
const ContactSection = () => {
  return (
    <Section title="Get In Touch" icon={Users} id="contact">
      <p className="text-center text-lg text-emerald-600 mb-8 md:mb-10 max-w-xl mx-auto">
        I'm always open to discussing new projects, collaborations, or just
        connecting with like-minded individuals.
      </p>
      {/* Grid layout for the contact buttons. Responsive columns. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HoverFlipButton
          href="mailto:filipelqj@gmail.com"
          IconInitial={Mail}
          textInitial="Personal Email"
          textHover="filipelqj@gmail.com"
          bgColorInitial="bg-red-500"
          bgColorHover="hover:bg-red-600"
          isExternal={false}
          ariaLabel="Email Filipe at his personal email address"
        />
        <HoverFlipButton
          href="mailto:filipe.junqueira@nottingham.ac.uk"
          IconInitial={Mail}
          textInitial="Nottingham Email"
          textHover="filipe.junqueira@nottingham.ac.uk"
          bgColorInitial="bg-emerald-500"
          bgColorHover="hover:bg-emerald-600"
          isExternal={false}
          ariaLabel="Email Filipe at University of Nottingham"
        />
        <HoverFlipButton
          href="https://linkedin.com/in/filipejunqueira"
          IconInitial={Linkedin}
          textInitial="LinkedIn"
          textHover="View Profile"
          bgColorInitial="bg-sky-600"
          bgColorHover="hover:bg-sky-700"
          ariaLabel="Filipe Junqueira on LinkedIn"
        />
        <HoverFlipButton
          href="https://github.com/filipejunqueira"
          IconInitial={Github}
          textInitial="GitHub"
          textHover="View Repos"
          bgColorInitial="bg-gray-700"
          bgColorHover="hover:bg-gray-800"
          ariaLabel="Filipe Junqueira on GitHub"
        />
      </div>
    </Section>
  );
};

/**
 * Footer Component
 * The footer at the bottom of the page.
 */
const Footer = () => (
  <footer className="bg-emerald-700 text-emerald-100 py-8 text-center">
    <div className="container mx-auto">
      <p>
        &copy; {new Date().getFullYear()} Filipe L. Q. Junqueira. All rights
        reserved.
      </p>
      {/* Updated footer text as per user request */}
      <p className="text-sm mt-1">
        Crafted with React & Tailwind CSS & And Love :-)
      </p>
    </div>
  </footer>
);

// --- Main App Component ---
// This is the top-level component that brings everything together.
function App() {
  // 'activeSection' state tracks which section of the page is currently considered active (e.g., by navbar click).
  const [activeSection, setActiveSection] = useState("home"); // Default to 'home'.

  // 'useEffect' Hook for handling side effects. This one handles smooth scrolling.
  // It runs when 'activeSection' changes.
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Get the section ID from the URL hash (e.g., #contact -> "contact").
    // Determine which section to scroll to: prioritize the URL hash, otherwise use 'activeSection'.
    const sectionIdToScroll =
      hash || (activeSection !== "home" ? activeSection : null);

    if (sectionIdToScroll) {
      const element = document.getElementById(sectionIdToScroll); // Find the HTML element with that ID.
      if (element) {
        const navbarHeight = document.querySelector("nav")?.offsetHeight || 0; // Get the height of the sticky navbar.
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset; // Calculate element's position relative to the document.
        const offsetPosition = elementPosition - navbarHeight - 20; // Calculate final scroll position, offsetting for navbar and adding padding.

        // Scroll to the calculated position smoothly.
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else if (activeSection === "home" && !hash) {
      // If 'home' is active and there's no hash in URL, scroll to the top.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]); // This effect depends on 'activeSection'. It re-runs if 'activeSection' changes.

  // The main structure of the app.
  return (
    <div className="font-sans bg-emerald-100 min-h-screen">
      {" "}
      {/* Base styling for the whole page. */}
      {/* Render the Navbar, passing the 'setActiveSection' function as a prop. */}
      <Navbar setActiveSection={setActiveSection} />
      {/* Render the HeroSection. */}
      <HeroSection />
      {/* 'main' is an HTML5 semantic tag for the main content of the page. */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render all the content sections. */}
        <ScientistCareer />
        <PublicationsSection />
        <BlenderCreations />
        <CLIPrograms />
        <ContactSection />
      </main>
      {/* Render the Footer. */}
      <Footer />
    </div>
  );
}

// This line makes the 'App' component available to be imported and used in other files (typically 'main.jsx' or 'index.js').
export default App;
