// PublicationItem.jsx
// Import React and ExternalLink icon.
import React from "react";
import { ExternalLink } from "lucide-react";
// Removed: useState, motion, Sparkles, Loader2, AlertTriangle

/**
 * PublicationItem Component: Displays a single publication.
 * @param {object} props - Component props.
 * @param {object} props.pub - Publication data object.
 */
const PublicationItem = ({ pub }) => {
  // Removed state: summary, isLoadingSummary, summaryError, showSummary
  // Removed function: handleGenerateSummary

  return (
    <article
      className="bg-emerald-50 dark:bg-slate-800 p-5 rounded-lg shadow-md hover:shadow-lg dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-shadow duration-300"
      aria-labelledby={`pub-title-${pub.id}`}
    >
      <h3
        id={`pub-title-${pub.id}`}
        className="text-lg md:text-xl font-medium text-emerald-800 dark:text-emerald-300 mb-1.5"
      >
        {pub.title}
      </h3>
      <p className="text-sm text-gray-700 dark:text-slate-400 italic mb-1 truncate-authors">
        {pub.authors}
      </p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
        {pub.journal} ({pub.year})
      </p>
      {pub.note && (
        <p className="text-xs text-gray-600 dark:text-slate-500 mb-3">
          {pub.note}
        </p>
      )}
      {/* Action buttons: Only "View Publication" remains */}
      <div className="flex flex-wrap items-center mt-3">
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
        >
          View Publication{" "}
          <ExternalLink size={16} className="ml-1.5" aria-hidden="true" />
        </a>
        {/* Removed "Explain with AI" button */}
      </div>

      {/* Removed AI Generated Summary Area */}
    </article>
  );
};

export default PublicationItem;
