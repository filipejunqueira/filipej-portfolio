// PublicationsSection.jsx
// Import React, Section, AnimatedSection, PublicationItem, and Lucide icon.
import React from "react";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import PublicationItem from "./PublicationItem"; // Assuming PublicationItem.jsx is in the same directory
import { BookOpen } from "lucide-react";

/**
 * PublicationsSection Component: Lists selected scientific publications.
 */
const PublicationsSection = () => {
  // Publication data.
  const publications = [
    {
      id: 1,
      title:
        "Embedding human heuristics in machine-learning-enabled probe microscopy",
      authors: "Oliver M Gordon and Filipe LQ Junqueira and Philip J Moriarty.",
      journal: "MACHINE LEARNING: SCIENCE AND TECHNOLOGY-IOP PUBLISHING",
      year: "2020",
      doi: "10.1088/2632-2153/AB42EC",
      link: "https://doi.org/10.1088/2632-2153/AB42EC",
    },
    {
      id: 2,
      title:
        "Scanning tunneling state recognition with multi-class neural network ensembles",
      authors:
        "O. Gordon and P. D'Hondt and L. Knijff and S. E. Freeney and F. Junqueira and P. Moriarty and I. Swart.",
      journal: "REVIEW OF SCIENTIFIC INSTRUMENTS - AIP PUBLISHING",
      year: "2019",
      doi: "10.1063/1.5099590",
      link: "https://doi.org/10.1063/1.5099590",
    },
    {
      id: 3,
      title: "Chemical shielding of H2O and HF encapsulated inside a C60 cage",
      authors:
        "Samuel P. Jarvis, Filipe Junqueira, Alex Saywell, Philipp Rahe, Salvatore Mamone, Simon Taylor, Adam Sweetman, Jeremy Leaf, Hongqian Sang, Lev Kantorovich, David Duncan, Tien-Lin Lee, Pardeep Kumar, Richard Whitby, Philip Moriarty, and Robert G Jones.",
      journal: "NATURE COMMUNICATIONS CHEMISTRY",
      year: "2021",
      doi: "10.1038/s42004-021-00569-0",
      link: "https://doi.org/10.1038/s42004-021-00569-0",
      note: "An STM and XWS study. XWS performed at 109 hut at Diamond Light Source.",
    },
    {
      id: 4,
      title: "Atomic cranes for cyclic single vertical atom manipulations",
      authors:
        "David Abbasi-Pérez, Hongqian Sang, Filipe Junqueira, Adam Sweetman, J. Manuel Recio, Philip Moriarty and Lev Kantorovich.",
      journal: "THE JOURNAL OF PHYSICAL CHEMISTRY LETTERS",
      year: "2021",
      doi: "10.1021/acs.jpclett.1c02271",
      link: "https://doi.org/10.1021/acs.jpclett.1c02271",
      note: "A DFT study.",
    },
  ];
  return (
    <Section title="Selected Publications" icon={BookOpen} id="publications">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        Contributing to the body of scientific knowledge through peer-reviewed
        research. These works explore topics from machine learning in microscopy
        to fundamental studies of molecular interactions. Click "Explain with
        AI" for a quick summary!
      </p>
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <AnimatedSection key={pub.id} delay={index * 0.1} threshold={0.05}>
            <PublicationItem pub={pub} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

export default PublicationsSection;
