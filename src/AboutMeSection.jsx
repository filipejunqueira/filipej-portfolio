// AboutMeSection.jsx
// Import React, motion, and Section component.
import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react"; // Icon for this section
import Section from "./Section"; // Assuming Section.jsx is in the same directory

/**
 * AboutMeSection Component: Contains biographical information.
 */
const AboutMeSection = () => {
  // Narrative paragraphs.
  const aboutMeNarrative = [
    "Driven by an insatiable curiosity for the quantum realm and a passion for computational problem-solving, I thrive at the intersection of nanoscience, data science, and creative technology.",
    "My journey has taken me from fundamental physics research and complex simulations to crafting intuitive command-line tools and exploring the artistic potential of 3D visualization.",
    "I'm dedicated to leveraging cutting-edge techniques, including machine learning and advanced microscopy, to push the boundaries of what's possible at the atomic scale and to communicate these complex ideas effectively.",
    "I'm always eager to connect with fellow innovators and explore opportunities where my diverse skill set can contribute to impactful projects and new discoveries.",
  ];
  return (
    <Section
      title="About Me"
      icon={User}
      id="about"
      titleClassName="text-3xl sm:text-4xl md:text-5xl"
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {aboutMeNarrative.map((paragraph, index) => (
          <motion.p
            key={index}
            className="text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed text-center md:text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </Section>
  );
};

export default AboutMeSection;
