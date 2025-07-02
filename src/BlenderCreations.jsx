// BlenderCreations.jsx
// Import React, hooks, Section, AnimatedSection, ProjectCard, and Lucide icon.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import ProjectCard from "./ProjectCard";
import { Palette, X, ImageIcon, ChevronUp } from "lucide-react";


// Import LazyImage component
import LazyImage from "./LazyImage";

/**
 * BlenderCreations Component: Showcases Blender 3D art projects with a lightbox.
 */
const BlenderCreations = () => {
  // State to control the visibility of ALL galleries at once.
  const [areAllGalleriesOpen, setAreAllGalleriesOpen] = useState(false);
  // State for the lightbox image remains the same.
  const [lightboxImage, setLightboxImage] = useState(null);
  // Blender project data with image names for dynamic loading.
  const blenderProjects = [
    {
      id: 1,
      title: "Abstract 3D Art",
      description: "Exploring forms, textures, and lighting...",
      artisticStatement: "Focus: Procedural generation...",
      mainImage: "blenderA",
      galleryImages: ["blenderA1", "blenderA2", "blenderA3"],
    },
    {
      id: 2,
      title: "Scientific Visualization",
      description: "Using Blender to create visualizations...",
      artisticStatement: "Goal: To accurately and beautifully convey...",
      mainImage: "blenderB",
      galleryImages: ["blenderB1", "blenderB2", "blenderB3", "blenderB4", "blenderB5"],
    },
    {
      id: 3,
      title: "Character/Concept Design",
      description: "Developing unique characters and concepts...",
      artisticStatement: "Exploration: Character storytelling...",
      mainImage: "blenderC",
      galleryImages: ["blenderC1", "blenderC2", "blenderC3"],
    },
  ];

  // Function to toggle the state of all galleries.
  const toggleAllGalleries = () => {
    setAreAllGalleriesOpen((prevState) => !prevState);
  };

  return (
    <>
      <Section
        title="Blender Art & 3D Visualization"
        icon={Palette}
        id="blender"
      >
        <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
          Leveraging Blender for creative 3D projects, scientific visualization,
          and concept art. Each piece is a journey into form, light, and
          narrative, aiming to bridge the gap between the technical and the
          aesthetic.
        </p>

        {/* The Master Toggle Button has been MOVED from here. */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {blenderProjects.map((project, index) => (
            <AnimatedSection
              key={project.id}
              delay={index * 0.15}
              threshold={0.1}
            >
              <ProjectCard
                {...project}
                type="blender"
                isGalleryOpen={areAllGalleriesOpen}
                onImageClick={setLightboxImage}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* NEW POSITION: Master button to toggle all galleries is now here, below the cards. */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={toggleAllGalleries}
            className="inline-flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-slate-800"
            aria-expanded={areAllGalleriesOpen}
          >
            {areAllGalleriesOpen ? "Hide All Images" : "View All Images"}
            {areAllGalleriesOpen ? (
              <ChevronUp size={18} aria-hidden="true" />
            ) : (
              <ImageIcon size={18} aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-8">
          More creations and visualizations coming soon! Stay tuned for updates
          on new projects and explorations.
        </p>
      </Section>

      {/* Lightbox Modal Implementation (remains unchanged) */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <motion.button
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors"
              aria-label="Close image view"
            >
              <X size={30} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh]"
            >
              <img
                src={lightboxImage}
                alt="Enlarged view of Blender render"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlenderCreations;
