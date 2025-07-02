// animations.js
// Centralized animation variants for consistent motion design

export const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

export const fadeInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 20 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Stagger animations for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

// Hero section specific animations
export const heroProfileImage = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
      type: "spring",
      stiffness: 120,
    },
  },
};

// Hover animations
export const buttonHover = {
  scale: 1.05,
  rotate: [0, -1, 1, -1, 1, 0],
  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
  transition: { 
    rotate: { duration: 0.3, ease: "easeInOut" },
    scale: { duration: 0.2 },
    boxShadow: { duration: 0.2 }
  },
};

export const cardHover = {
  y: -6,
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeOut" },
};

export const subtleHover = {
  y: -3,
  transition: { duration: 0.2, ease: "easeOut" },
};