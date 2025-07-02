// CLIToolsSection.jsx
// Import React, motion, Section, UI components, and Lucide icons.
import React from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { Card, Button, Tag, TextPrimary, TextSecondary, CodeBlock, Link, focusRing } from "./components/UI";
import { Terminal, FileCode, BarChart3, Zap, Github } from "lucide-react";

/**
 * CLIToolsSection Component: Highlights command-line interface tools.
 */
const CLIToolsSection = () => {
  // Data for CLI tools.
  const cliToolsData = [
    {
      id: 1,
      title: "DFT Automation Suite",
      description:
        "A Python-based CLI tool to streamline Density Functional Theory (DFT) calculations, manage input/output files for software like VASP or Quantum Espresso, and automate job submissions to HPC clusters using SLURM or PBS.",
      problemSolved:
        "Reduces manual intervention and potential for errors in complex DFT workflows, significantly speeding up research cycles for materials simulation.",
      icon: FileCode,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">
            dft-suite run
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --job_type relax
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --struct Si.vasp
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Initializing calculation for Si.vasp...
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Input files generated.
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Submitting job to SLURM ID:{" "}
          </span>
          <span className="text-green-500 dark:text-green-400">12345</span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Monitoring status... Job completed successfully.
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Final energy:{" "}
          </span>
          <span className="text-green-500 dark:text-green-400">
            -5.42 eV/atom
          </span>
        </>
      ),
      tags: ["Python", "CLI", "DFT", "VASP", "HPC", "Automation", "SLURM"],
      githubLink: "https://github.com/filipejunqueira/dft-suite",
    },
    {
      id: 2,
      title: "SPM Data Analyzer",
      description:
        "Command-line utilities for processing and analyzing Scanning Probe Microscopy (SPM) data (AFM/STM). Features include drift correction, plane fitting, noise filtering, tip deconvolution, and basic statistical analysis of surface features.",
      problemSolved:
        "Provides a consistent and scriptable way to perform common SPM data processing tasks, ensuring reproducibility and enabling batch processing of large datasets.",
      icon: BarChart3,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">
            spm-analyzer process
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --file afm_scan.xyz
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --drift_correct --plane_fit
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Processing scan data: afm_scan.xyz
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Applying 2D polynomial drift correction...
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Performing plane fitting (order 1)...
          </span>
          <br />
          <span className="text-green-500 dark:text-green-400">
            Drift corrected. RMS roughness: 0.15 nm
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Saving processed_afm_scan.dat
          </span>
        </>
      ),
      tags: [
        "Python",
        "CLI",
        "SPM",
        "AFM",
        "STM",
        "Data Analysis",
        "Nanoscience",
      ],
      githubLink: "https://github.com/filipejunqueira/spm-analyzer",
    },
    {
      id: 3,
      title: "Quick Plotter CLI",
      description:
        "A rapid plotting tool for generating publication-quality graphs from CSV or text files directly from the terminal. Supports various plot types, custom labels, legends, and output formats, powered by Matplotlib.",
      problemSolved:
        "Eliminates the need to write repetitive plotting scripts for common data visualization tasks, allowing for quick insights and figure generation from the command line.",
      icon: Zap,
      codeExample: (
        <>
          <span className="text-slate-500 dark:text-slate-400">&gt; </span>
          <span className="text-emerald-500 dark:text-sky-400">quickplot</span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --file results.csv
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --x_col "Voltage"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --y_col "Current"
          </span>
          <span>{" \\"}</span>
          <br />
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            -t "I-V Curve for Device X"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --xlabel "Voltage (V)"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --ylabel "Current (nA)"
          </span>
          <span className="text-yellow-500 dark:text-yellow-400">
            {" "}
            --save plot.png
          </span>
          <br />
          <span className="text-gray-500 dark:text-slate-500">
            Generating plot 'I-V Curve for Device X'...
          </span>
          <br />
          <span className="text-green-500 dark:text-green-400">
            Saved to plot_Voltage_vs_Current.png
          </span>
        </>
      ),
      tags: [
        "Python",
        "CLI",
        "Plotting",
        "Matplotlib",
        "Data Viz",
        "Automation",
      ],
      githubLink: "https://github.com/filipejunqueira/quickplot",
    },
  ];

  // Animation variants for cards.
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: "easeInOut" },
    }),
    hover: {
      y: -6,
      scale: 1.02,
      boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.12)",
    },
  };

  return (
    <Section title="CLI Tools & Scripts" icon={Terminal} id="cli">
      <TextSecondary 
        as="p" 
        className="text-center text-base md:text-lg mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed"
      >
        Crafting efficient command-line interfaces to accelerate research and
        automate complex tasks in nanoscience and data analysis. These tools are
        designed for robustness and ease of use.
      </TextSecondary>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {cliToolsData.map((tool, index) => {
          const ToolIcon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.1 }}
              custom={index}
            >
              <Card 
                className="h-full flex flex-col cursor-default border dark:border-slate-700 transition-all duration-300"
                as="article"
                aria-labelledby={`cli-tool-title-${tool.id}`}
              >
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ToolIcon
                  className="h-9 w-9 mr-3.5 stroke-[1.75] flex-shrink-0"
                  aria-hidden="true"
                />
                <h3
                  id={`cli-tool-title-${tool.id}`}
                  className="text-lg lg:text-xl font-medium text-emerald-800 dark:text-emerald-300"
                >
                  {tool.title}
                </h3>
              </div>
              <TextSecondary as="p" className="text-sm mb-3 leading-relaxed">
                {tool.description}
              </TextSecondary>
              {tool.problemSolved && (
                <p className="text-emerald-700/80 dark:text-emerald-400/80 text-xs italic mt-1 mb-4">
                  <span className="font-semibold">Impact: </span>
                  {tool.problemSolved}
                </p>
              )}
              <div className="mb-5 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Tag key={tag} variant="default">
                    {tag}
                  </Tag>
                ))}
              </div>
              {tool.codeExample && (
                <CodeBlock className="mb-5">
                  {tool.codeExample}
                </CodeBlock>
              )}
              <motion.div
                className="mt-auto"
                whileHover={{
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  as="a"
                  href={tool.githubLink || "https://github.com/filipejunqueira"}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full gap-2 text-sm uppercase tracking-wider shadow-sm hover:shadow-md"
                >
                  <Github size={18} aria-hidden="true" /> View on GitHub
                </Button>
              </motion.div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default CLIToolsSection;
