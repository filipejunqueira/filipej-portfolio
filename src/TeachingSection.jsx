// TeachingSection.jsx
// Import React, motion, Section, and Lucide icons.
import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { Presentation, ExternalLink } from "lucide-react";
// Import centralized animations
import { defaultVariants, fadeInFromLeft } from "./animations";

/**
 * TeachingSection Component: Details teaching and tutoring experience.
 */
const TeachingSection = () => {
  // Teaching experience points.
  const teachingPoints = [
    "Extensive experience tutoring students for Mathematics Olympiads (including IMO), focusing on advanced problem-solving techniques in Number Theory, Combinatorics, Algebra, and Geometry.",
    "Provided tailored coaching for IB (International Baccalaureate) Mathematics (HL/SL) and Physics (HL/SL), helping students achieve top grades and develop a deep understanding of core concepts.",
    "Developed custom learning materials and practice sets to address individual student needs and learning styles.",
    "Passionate about fostering critical thinking and a love for mathematics and physics in young minds.",
  ];

  return (
    <Section title="Teaching & Tutoring" icon={Presentation} id="teaching">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.p
          className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={defaultVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Beyond my research and creative projects, I am deeply committed to
          education and mentorship. I have a rewarding side-venture in tutoring,
          primarily focused on preparing students for high-level mathematics
          competitions and rigorous academic programs.
        </motion.p>

        <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-slate-300 text-base md:text-lg">
          {teachingPoints.map((point, index) => (
            <motion.li
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeInFromLeft}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="ml-4"
            >
              {point}
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="text-center mt-8"
          initial="hidden"
          animate="visible"
          variants={defaultVariants}
          transition={{
            duration: 0.5,
            delay: 0.3 + teachingPoints.length * 0.1,
          }}
        >
          <a
            href="http://filipej.com"
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

export default TeachingSection;
