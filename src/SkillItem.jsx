// SkillItem.jsx
// Import React and motion from framer-motion.
import React from "react";
import { motion } from "framer-motion";

/**
 * SkillItem Component: Renders a single skill item.
 * @param {object} props - Component props.
 * @param {string} props.name - Name of the skill.
 * @param {React.ElementType} props.icon - Lucide icon component.
 * @param {string} [props.proficiency] - Optional proficiency level.
 */
const SkillItem = ({ name, icon: Icon, proficiency }) => (
  <motion.li
    className="bg-emerald-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow"
    whileHover={{ y: -3 }} // Subtle lift animation on hover.
  >
    {Icon && (
      <Icon
        className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
    )}
    <span className="text-sm font-medium text-gray-800 dark:text-slate-200">
      {name}
    </span>
    {proficiency && (
      <span className="text-xs text-gray-500 dark:text-slate-400 ml-auto">
        ({proficiency})
      </span>
    )}
  </motion.li>
);

export default SkillItem;
