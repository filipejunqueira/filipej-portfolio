// components/SkipToContent.jsx
import React from "react";

/**
 * SkipToContent Component: Provides a skip link for screen readers and keyboard users
 * @param {object} props - Component props
 * @param {string} [props.targetId="main"] - ID of the main content element
 */
const SkipToContent = ({ targetId = "main" }) => {
  const handleSkip = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;