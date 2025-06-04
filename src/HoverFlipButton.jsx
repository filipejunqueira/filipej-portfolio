// HoverFlipButton.jsx
// Import React and useState hook.
import React, { useState } from "react";

/**
 * HoverFlipButton Component: A reusable button with a text/icon flip animation.
 * @param {object} props - Component props.
 * @param {string} props.href - URL the button links to.
 * @param {React.ElementType} props.IconInitial - Lucide icon for initial state.
 * @param {string} props.textInitial - Text for initial state.
 * @param {string} props.textHover - Text for hover state.
 * @param {string} props.bgColorInitial - Tailwind CSS bg color for initial state.
 * @param {string} props.bgColorHover - Tailwind CSS bg color for hover state.
 * @param {boolean} [props.isExternal=true] - If true, opens link in new tab.
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
  // State to track hover status.
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
      className={`flex items-center justify-center font-medium py-2.5 px-5 rounded-md text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-h-[48px] text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/80 ${bgColorInitial} ${bgColorHover}`}
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
            <IconInitial
              size={18}
              className="mr-2 flex-shrink-0"
              aria-hidden="true"
            />
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

export default HoverFlipButton;
