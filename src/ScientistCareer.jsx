// ScientistCareer.jsx
// Import React, hooks, motion, Section, AnimatedSection, and Lucide icons.
import React, { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import {
  Briefcase,
  FlaskConical,
  GraduationCap,
  Brain,
  Building,
  Anchor,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
// Import UI components
import { Article, Button, Container, TextPrimary, TextSecondary, TextMuted } from "./components/UI";

/**
 * ScientistCareer Component: Details career and education.
 */
const ScientistCareer = () => {
  // State for expanded details.
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  // Career milestones data.
  const careerMilestones = [
    {
      id: 1,
      role: "Post-doctoral Researcher",
      institution: "University of Nottingham, UK",
      duration: "September 2021 - Present",
      description:
        "Research associate with Prof. Philip Moriarty's nanoscience group, focusing on atomic manipulation, DFT and machine learning applications in SPM.",
      icon: FlaskConical,
      moreDetails: `Key responsibilities and achievements:
      - Designed and executed advanced NC-AFM/STM experiments for single-atom manipulation.
      - Developed Python/bash-based analysis scripts, improving data processing efficiency.
      - Contributed to pre and post analysis DFT software (Tetr, writen in Fortran).
      - Investigating novel paths for creating 3D atomic structures.
      - Applied deep learning models for real-time image recognition in microscopy, enhancing feature identification speed.`,
    },
    {
      id: 2,
      role: "Physics PhD Researcher",
      institution: "University of Nottingham & King's College London, UK",
      duration: "2016-2019, 2022-Present (Expected Submission: Late 2025)",
      description:
        "Thesis: 'Towards 3D printing with atoms: Integrating machine learning with scanning probe microscopy for automated atomic assembly.'",
      icon: GraduationCap,
      moreDetails: `Research focus and key contributions:
      - Explored the intersection of nanoscience, DFT, and AI for atomic-scale fabrication.
      - Operated and maintained complex UHV SPM systems.
      - Performed DFT simulations (VASP) to model atomic interactions and guide experimental design.
      - Developed bespoke machine learning algorithms (Python, TensorFlow) for several tasks, including image classification.
      - Experience with cyclotron in particular, x-ray standing waves at Diamond Light Source, UK.`,
    },
    {
      id: 3,
      role: "Intelligence Analyst",
      institution: "Cortex-Intelligence, São Paulo, Brazil",
      duration: "Feb 2015 - Jul 2015",
      description:
        "Analysed big data for clients in various sectors, providing actionable insights through statistical modeling and data visualization.",
      icon: Brain,
      moreDetails: `Key projects and responsibilities:
      - Data mining, statistical analysis, and predictive modeling.
      - Designed and implemented custom dashboards (e.g., using Plotly/Dash) along with proprietary tools for clients to monitor KPIs and identify trends.
      - Delivered market analysis and BI for Globo (Largest broadcaster in Brazil), Votorantim and BASF among others.
      - Developed prediction models that identified customer sentiment.
      - Collaborated directly with clients to understand their data needs. Was the first to implement Machine Learning models in the company, in particular Support Vector Machines.`,
    },
    {
      id: 4,
      role: "Partner - Real Estate Project",
      institution: "Family Business, São Paulo, Brazil",
      duration: "Jun 2013 - Dec 2014",
      description:
        "Responsible for financial analysis, project viability assessment, negotiations and due diligence for a closed residential development in Anapolis, Brazil.",
      icon: Building,
      moreDetails: `Contributions and outcomes:
      - Managed project budgets and cash flow projections.
      - Conducted thorough market research and competitor analysis to inform pricing and development strategies.
      - Conducted Negotiations and due diligence.
      - Successfully contributed to securing the deal which later became Nature Home Resort at Anapolis Brazil`,
    },
    {
      id: 5,
      role: "Investment and Intelligence Analyst",
      institution: "BR Properties S.A., São Paulo, Brazil",
      duration: "Feb 2011 - May 2013",
      description:
        "Investment and finantiall viability analysis for commercial real estate acquisitions and development. Created the intelligence department.",
      icon: Briefcase,
      moreDetails: `Key responsibilities and achievements:
      - Developed and refined complex financial models (DCF, IRR, sensitivity analysis) for valuing commercial properties, exceeding $20 million.
      - Conducted in-depth due diligence on potential acquisitions, identifying key risks and opportunities.
      - Negotiated deals, both investment and development, and collaborated with the merge with BTG Pactual, the leading investment bank in Brazil. 
      - Played an instrumental role in establishing data collection methodologies and market analysis protocols for the new intelligence department. This includes the creation (from scratch) of databases and analysis tools.`,
    },
    {
      id: 6,
      role: "Engineering Degree - Civil/Electrical Emphasis",
      institution:
        "POLI (Polytechnic School of Engineering, University of São Paulo), Brazil",
      duration: "Jan 2006 - Jun 2012",
      description:
        "Comprehensive 5-7 year engineering course with a strong foundation in mathematics, physics, and specialized engineering disciplines.",
      icon: GraduationCap,
      moreDetails: `Relevant coursework and projects:
      - Key Modules: Structural Analysis, Electromagnetism, Control Systems, Signal Processing, Thermodynamics, Fluid Mechanics.
      - Graduated in the top 10% (as per professors evaluations).`,
    },
    {
      id: 7,
      role: "Science Internship - Naval Engineering",
      institution: "POLI-USP, São Paulo, Brazil",
      duration: "Jan 2009 - Jan 2010",
      description:
        "Supervisor: Prof. Bernardo Luis Rodrigues de Andrade. Research on hydrofoil design and hydrodynamic efficiency.",
      icon: Anchor,
      moreDetails: `Project details and contributions:
      - Utilized computational fluid dynamics (CFD) software to simulate and optimize hydrofoil shapes for reduced drag and improved lift characteristics.
      - Assisted in the setup and execution of experimental tests in a water tunnel facility, collecting and analyzing performance data.`,
    },
    {
      id: 8,
      role: "Science Internship - Mathematics",
      institution: "Math Department - USP, São Paulo, Brazil",
      duration: "Jan 2007 - Jul 2009",
      description:
        "Supervisor: Prof. Elói Medina Galego. Studied advanced topics in abstract algebra and number theory.",
      icon: Brain,
      moreDetails: `Areas of study and engagement:
      - Focused on Group Theory, Ring Theory, and Galois Theory.
      - Actively participated in weekly advanced seminars and problem-solving sessions.
      - Developed a deeper understanding of mathematical proofs, abstract structures`,
    },
  ];

  // Toggles expanded state for milestone details.
  const handleToggleDetail = (milestoneId) =>
    setExpandedDetailId((prevId) =>
      prevId === milestoneId ? null : milestoneId,
    );

  return (
    <Section title="Career & Education" icon={Briefcase} id="scientist">
      <TextSecondary 
        as="p" 
        className="text-center text-base md:text-lg mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed"
      >
        A journey through academia and industry, driven by a passion for
        physics, data, and problem-solving. Each step has been a building block
        towards new discoveries and innovations.
      </TextSecondary>
      <div className="space-y-8">
        {careerMilestones.map((milestone, index) => {
          const MilestoneIcon = milestone.icon;
          const isExpanded = expandedDetailId === milestone.id;
          return (
            <AnimatedSection
              key={milestone.id}
              delay={index * 0.1}
              threshold={0.05}
            >
              <Article
                className="shadow-lg"
                aria-labelledby={`career-title-${milestone.id}`}
              >
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 pt-1">
                    {MilestoneIcon && (
                      <MilestoneIcon
                        className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 dark:text-emerald-400 strokeWidth={1.5}"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <TextPrimary
                      as="h3"
                      id={`career-title-${milestone.id}`}
                      className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300"
                    >
                      {milestone.role}
                    </TextPrimary>
                    <TextPrimary as="div" className="text-base text-emerald-700 dark:text-emerald-400 font-normal mt-1">
                      {milestone.institution}
                    </TextPrimary>
                    <TextMuted as="div" className="text-sm mb-2 mt-0.5">
                      {milestone.duration}
                    </TextMuted>
                    <TextSecondary as="div" className="leading-relaxed text-base">
                      {milestone.description}
                    </TextSecondary>
                    {milestone.moreDetails && (
                      <Button
                        onClick={() => handleToggleDetail(milestone.id)}
                        variant="ghost"
                        size="sm"
                        className="mt-4 uppercase tracking-wider"
                        aria-expanded={isExpanded}
                        aria-controls={`career-details-${milestone.id}`}
                      >
                        {isExpanded ? "Show Less" : "View More"}
                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                            className="ml-1"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="ml-1"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                {isExpanded && milestone.moreDetails && (
                  <motion.div
                    id={`career-details-${milestone.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700"
                  >
                    <TextSecondary className="leading-relaxed text-sm whitespace-pre-line">
                      {milestone.moreDetails}
                    </TextSecondary>
                  </motion.div>
                )}
              </Article>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
};

export default ScientistCareer;
