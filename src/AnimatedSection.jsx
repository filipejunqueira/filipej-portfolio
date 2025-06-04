// AnimatedSection.jsx
// Import React and necessary hooks from the 'react' library.
import React, { useEffect } from "react";
// Import animation utilities from 'framer-motion'.
import { motion, useAnimation } from "framer-motion";
// Import 'useInView' hook from 'react-intersection-observer'.
import { useInView } from "react-intersection-observer";

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

export default AnimatedSection;
