// BlenderCreations.jsx
// Import React, hooks, Section, AnimatedSection, ProjectCard, and Lucide icon.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added motion and AnimatePresence
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import ProjectCard from "./ProjectCard";
import { Palette, X } from "lucide-react"; // Added X icon for the close button

// Import Blender Art Images for the gallery - Ensure paths are correct.
import blenderA from "./assets/blenderA.png";
import blenderA1 from "./assets/blenderA1.png";
import blenderA2 from "./assets/blenderA2.png";
import blenderA3 from "./assets/blenderA3.png";
import blenderB from "./assets/blenderB.png";
import blenderB1 from "./assets/blenderB1.png";
import blenderB2 from "./assets/blenderB2.png";
import blenderB3 from "./assets/blenderB3.png";
import blenderB4 from "./assets/blenderB4.png";
import blenderB5 from "./assets/blenderB5.png";
import blenderC from "./assets/blenderC.png";
import blenderC1 from "./assets/blenderC1.png";
import blenderC2 from "./assets/blenderC2.png";
import blenderC3 from "./assets/blenderC3.png";

/**
 * BlenderCreations Component: Showcases Blender 3D art projects with a lightbox.
 */
const BlenderCreations = () => {
  // State for expanded gallery.
  const [expandedGalleryId, setExpandedGalleryId] = useState(null);
  // State for the lightbox image. null = closed, string (URL) = open
  const [lightboxImage, setLightboxImage] = useState(null);

  // Blender project data.
  const blenderProjects = [
    {
      id: 1,
      title: "Abstract 3D Art",
      description:
        "Exploring forms, textures, and lighting using Blender for creating visually compelling abstract scenes. This involves procedural texturing and complex node setups for dynamic and intricate results.",
      artisticStatement:
        "Focus: Procedural generation, photorealism in abstract contexts.",
      mainImage: blenderA,
      galleryImages: [blenderA1, blenderA2, blenderA3],
    },
    {
      id: 2,
      title: "Scientific Visualization",
      description:
        "Using Blender to create visualizations for complex scientific concepts, such as molecular structures, quantum phenomena, or astrophysical simulations, making them accessible and understandable to a broader audience.",
      artisticStatement:
        "Goal: To accurately and beautifully convey complex scientific data.",
      mainImage: blenderB,
      galleryImages: [blenderB1, blenderB2, blenderB3, blenderB4, blenderB5],
    },
    {
      id: 3,
      title: "Character/Concept Design",
      description:
        "Developing unique characters and concepts in 3D, from initial sculpting and retopology to final texturing, rigging for animation, or preparing for 3D printing.",
      artisticStatement:
        "Exploration: Character storytelling through form and detail.",
      mainImage: blenderC,
      galleryImages: [blenderC1, blenderC2, blenderC3],
    },
  ];

  // Toggles gallery visibility.
  const handleToggleGallery = (projectId) =>
    setExpandedGalleryId((prevId) => (prevId === projectId ? null : projectId));

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
                isGalleryOpen={expandedGalleryId === project.id}
                onToggleGallery={() => handleToggleGallery(project.id)}
                onImageClick={setLightboxImage} // Pass the setter function to ProjectCard
              />
            </AnimatedSection>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-12 md:mt-16">
          More creations and visualizations coming soon! Stay tuned for updates
          on new projects and explorations.
        </p>
      </Section>

      {/* Lightbox Modal Implementation */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)} // Close lightbox when clicking the overlay
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            {/* Close Button */}
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

            {/* Enlarged Image */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing lightbox when clicking the image itself
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
