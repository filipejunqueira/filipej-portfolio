// Section.jsx
// Import React from the 'react' library.
import React from "react";

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

export default Section;
