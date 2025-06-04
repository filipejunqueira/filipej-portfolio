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
      duration: "Jan 2022 - Present",
      description:
        "Research associate with Prof. Philip Moriarty's nanoscience group, focusing on atomic manipulation and machine learning applications in SPM.",
      icon: FlaskConical,
      moreDetails: `Key responsibilities and achievements:
      - Designed and executed advanced NC-AFM/STM experiments for single-atom/molecule manipulation.
      - Developed Python-based analysis scripts, improving data processing efficiency by ~30%.
      - Mentored 2 PhD students on experimental techniques and data interpretation.
      - Investigating novel methodologies for creating 3D atomic structures.
      - Applied deep learning models for real-time image recognition in microscopy, enhancing feature identification speed.`,
    },
    {
      id: 2,
      role: "Physics PhD Researcher",
      institution: "University of Nottingham & King's College London, UK",
      duration: "2016-2019, 2022-Present (Expected Submission: Mid 2025)",
      description:
        "Thesis: 'Towards 3D printing with atoms: Integrating machine learning with scanning probe microscopy for automated atomic assembly.'",
      icon: GraduationCap,
      moreDetails: `Research focus and key contributions:
      - Explored the intersection of nanoscience, DFT, and AI for atomic-scale fabrication.
      - Operated and maintained complex UHV SPM systems.
      - Performed DFT simulations (VASP) to model atomic interactions and guide experimental design.
      - Developed bespoke machine learning algorithms (Python, TensorFlow) to control AFM tip movement for precise atomic placement, achieving X% improvement in placement accuracy.`,
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
      - Utilized R and Python (Pandas, Scikit-learn) for data mining, statistical analysis, and predictive modeling.
      - Designed and implemented custom dashboards (e.g., using Plotly/Dash) for clients to monitor KPIs and identify trends.
      - Delivered market segmentation analysis for a major retail client, leading to a Y% targeted marketing campaign improvement.
      - Developed customer churn prediction models that identified at-risk customers with Z% accuracy.`,
    },
    {
      id: 4,
      role: "Partner - Real Estate Project",
      institution: "Family Business, São Paulo, Brazil",
      duration: "Jun 2013 - Dec 2014",
      description:
        "Responsible for financial analysis, project viability assessment, and investor relations for a residential development project.",
      icon: Building,
      moreDetails: `Contributions and outcomes:
      - Managed project budgets and cash flow projections for a multi-unit residential development.
      - Conducted thorough market research and competitor analysis to inform pricing and development strategies.
      - Prepared comprehensive financial reports and presentations for stakeholders and potential investors.
      - Successfully contributed to securing X amount in partial funding through targeted investor outreach.`,
    },
    {
      id: 5,
      role: "Investment and Intelligence Analyst",
      institution: "BR Properties S.A., São Paulo, Brazil",
      duration: "Feb 2011 - May 2013",
      description:
        "Financial viability analysis for commercial real estate acquisitions and development. Contributed to the creation of the intelligence department.",
      icon: Briefcase,
      moreDetails: `Key responsibilities and achievements:
      - Developed and refined complex financial models (DCF, IRR, sensitivity analysis) for valuing commercial properties exceeding $Y million.
      - Conducted in-depth due diligence on potential acquisitions, identifying key risks and opportunities.
      - Played an instrumental role in establishing data collection methodologies and market analysis protocols for the newly formed intelligence unit, improving reporting accuracy by Z%.`,
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
      - Final Year Project: Focused on the design and simulation of a sustainable urban infrastructure element, achieving X in [metric].
      - Consistently ranked in the top Y% of the cohort in [specific relevant area].`,
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
      - Assisted in the setup and execution of experimental tests in a water tunnel facility, collecting and analyzing performance data.
      - Contributed to a research paper/report on [specific finding or aspect of the project].`,
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
      - Developed a deeper understanding of mathematical proofs, abstract structures, and their applications in other scientific fields.`,
    },
  ];

  // Toggles expanded state for milestone details.
  const handleToggleDetail = (milestoneId) =>
    setExpandedDetailId((prevId) =>
      prevId === milestoneId ? null : milestoneId,
    );

  return (
    <Section title="Career & Education" icon={Briefcase} id="scientist">
      <p className="text-center text-base md:text-lg text-gray-700 dark:text-slate-300 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
        A journey through academia and industry, driven by a passion for
        physics, data, and problem-solving. Each step has been a building block
        towards new discoveries and innovations.
      </p>
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
              <article
                className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-700/60 dark:border dark:border-slate-700"
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
                    <h3
                      id={`career-title-${milestone.id}`}
                      className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300"
                    >
                      {milestone.role}
                    </h3>
                    <p className="text-base text-emerald-700 dark:text-emerald-400 font-normal mt-1">
                      {milestone.institution}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2 mt-0.5">
                      {milestone.duration}
                    </p>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-base">
                      {milestone.description}
                    </p>
                    {milestone.moreDetails && (
                      <button
                        onClick={() => handleToggleDetail(milestone.id)}
                        className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
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
                      </button>
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
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                      {milestone.moreDetails}
                    </p>
                  </motion.div>
                )}
              </article>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
};

export default ScientistCareer;
