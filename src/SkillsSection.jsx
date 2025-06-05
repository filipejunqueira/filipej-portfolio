// SkillsSection.jsx
// Import React, helper components, and Lucide icons.
import React from "react";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import SkillItem from "./SkillItem"; // Import the SkillItem component
import {
  Code,
  Github,
  Terminal,
  HardDrive,
  Atom,
  BarChart3,
  FileCode,
  Brain,
  Palette,
  Globe,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

/**
 * SkillsSection Component: Displays various skills.
 */
const SkillsSection = () => {
  // Skills data.
  const skillsData = {
    computerSkills: [
      { name: "C", icon: Code },
      { name: "Python", icon: Code },
      { name: "Fortran", icon: Code },
      { name: "Lua", icon: Code },
      { name: "Bash/Shell Scripting", icon: Terminal },
      { name: "JavaScript (React, Node.js)", icon: Code },
      { name: "C++(Basic)", icon: Code },
      { name: "Tailwind CSS", icon: Code },
      { name: "Git & GitHub", icon: Github },
      { name: "SQL", icon: HardDrive },
      { name: "Docker (Basic)", icon: HardDrive },
      { name: "Linux", icon: HardDrive },
    ],
    scientificTools: [
      { name: "DFT (VASP, CP2K, Tetr, Lev00)", icon: Atom },
      { name: "SPM (AFM/STM) Analysis", icon: BarChart3 },
      { name: "Pymatgen", icon: FileCode },
      { name: "ASE (Atomic Simulation Environment)", icon: Atom },
      {
        name: "Machine Learning (Scikit-learn, TensorFlow/Keras Basics, PyTorch Basics)",
        icon: Brain,
      },
      {
        name: "Data Visualization (Matplotlib, Seaborn, Plotly etc)",
        icon: BarChart3,
      },
      { name: "Blender (3D Modeling & Visualization)", icon: Palette },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Portuguese", proficiency: "Native" },
      { name: "Spanish", proficiency: "Conversational" },
      { name: "French", proficiency: "Beginner" },
      { name: "Italian", proficiency: "Beginner" },
    ],
  };

  return (
    <Section title="Core Competencies & Skills" icon={Lightbulb} id="skills">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <HardDrive
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />
            Computer Skills
          </h3>
          <ul className="space-y-3">
            {skillsData.computerSkills.map((skill, index) => (
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem name={skill.name} icon={skill.icon} />
              </AnimatedSection>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <Atom
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />
            Scientific Software & Tools
          </h3>
          <ul className="space-y-3">
            {skillsData.scientificTools.map((skill, index) => (
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem name={skill.name} icon={skill.icon} />
              </AnimatedSection>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
            <Globe
              className="w-6 h-6 mr-2 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />
            Languages
          </h3>
          <ul className="space-y-3">
            {skillsData.languages.map((lang, index) => (
              <AnimatedSection key={index} delay={index * 0.05} threshold={0.1}>
                <SkillItem
                  name={lang.name}
                  proficiency={lang.proficiency}
                  icon={MessageSquare}
                />
              </AnimatedSection>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default SkillsSection;
