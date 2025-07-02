// hooks/useScrollAnimation.js
// Reusable hook for scroll-triggered animations

import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (default: 0.1)
 * @param {number} options.delay - Animation delay in seconds (default: 0)
 * @param {boolean} options.triggerOnce - Whether to trigger only once (default: true)
 * @param {boolean} options.reduceMotion - Whether to respect reduced motion (default: false)
 * @returns {Object} - { ref, controls, inView }
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  delay = 0,
  triggerOnce = true,
  reduceMotion = false,
} = {}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ 
    triggerOnce, 
    threshold,
    rootMargin: '50px 0px', // Start animation slightly before element enters view
  });

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (inView) {
      if (prefersReducedMotion || reduceMotion) {
        // Skip animation, just show content immediately
        controls.start({ opacity: 1, x: 0, y: 0, scale: 1 });
      } else {
        // Start animation with specified delay
        const timeoutId = setTimeout(() => {
          controls.start("visible");
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [controls, inView, prefersReducedMotion, reduceMotion, delay]);

  return { ref, controls, inView, prefersReducedMotion: prefersReducedMotion || reduceMotion };
};