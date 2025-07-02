// AnimatedSection.jsx
// Import React and animation utilities.
import React from "react";
import { motion } from "framer-motion";

// Import centralized animation variants and custom hook
import { defaultVariants } from "./animations";
import { useScrollAnimation } from "./hooks/useScrollAnimation";

/**
 * AnimatedSection Component: Wraps children in a motion.div for scroll-triggered animations.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be animated.
 * @param {string} [props.className=""] - Optional CSS classes for the wrapper div.
 * @param {string} props.id - A unique ID for the section (optional, but good for targeting).
 * @param {object} [props.variants=defaultVariants] - Framer Motion animation variants.
 * @param {number} [props.delay=0] - Animation delay in seconds.
 * @param {number} [props.threshold=0.1] - Percentage of the element that needs to be in view to trigger the animation.
 * @param {boolean} [props.reduceMotion=false] - Whether to respect prefers-reduced-motion
 * @param {string} [props.ariaLabel] - ARIA label for accessibility
 */
const AnimatedSection = ({
  children,
  className = "",
  id,
  variants = defaultVariants,
  delay = 0,
  threshold = 0.1,
  reduceMotion = false,
  ariaLabel,
}) => {
  // Use our optimized scroll animation hook
  const { ref, controls, prefersReducedMotion } = useScrollAnimation({
    threshold,
    delay,
    reduceMotion,
  });

  return (
    // `motion.div` is a Framer Motion component that enables animations on a div.
    <motion.div
      ref={ref} // Assign the ref from `useInView` to this element.
      id={id} // HTML id attribute.
      className={className} // CSS classes.
      initial={prefersReducedMotion || reduceMotion ? { opacity: 1, x: 0, y: 0 } : "hidden"} // Initial animation state.
      animate={controls} // Link animation controls.
      variants={variants} // Animation variants to use.
      transition={{ 
        duration: prefersReducedMotion || reduceMotion ? 0 : 0.6, 
        delay: prefersReducedMotion || reduceMotion ? 0 : delay 
      }} // Animation transition properties.
      aria-label={ariaLabel}
      role={ariaLabel ? "region" : undefined}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
