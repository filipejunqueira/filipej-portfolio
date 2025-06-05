// BlenderCreations.jsx
// Import React, hooks, Section, AnimatedSection, ProjectCard, and Lucide icon.
import React, { useState } from "react";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import ProjectCard from "./ProjectCard"; // Assuming ProjectCard.jsx is in the same directory
import { Palette } from "lucide-react";

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
 * BlenderCreations Component: Showcases Blender 3D art projects.
 */
const BlenderCreations = () => {
  // State for expanded gallery.
  const [expandedGalleryId, setExpandedGalleryId] = useState(null);
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
    <Section title="Blender Art & 3D Visualization" icon={Palette} id="blender">
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
            />
          </AnimatedSection>
        ))}
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-12 md:mt-16">
        More creations and visualizations coming soon! Stay tuned for updates on
        new projects and explorations.
      </p>
    </Section>
  );
};

export default BlenderCreations;
