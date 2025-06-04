// PublicationItem.jsx
// Import React and necessary hooks/components.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles, Loader2, AlertTriangle } from "lucide-react";

/**
 * PublicationItem Component: Displays a single publication.
 * @param {object} props - Component props.
 * @param {object} props.pub - Publication data object.
 */
const PublicationItem = ({ pub }) => {
  // State for AI-generated summary.
  const [summary, setSummary] = useState("");
  // State for loading indicator.
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  // State for error messages.
  const [summaryError, setSummaryError] = useState("");
  // State to control summary visibility.
  const [showSummary, setShowSummary] = useState(false);

  // Async function to handle AI summary generation.
  const handleGenerateSummary = async () => {
    if (summary && !showSummary) {
      setShowSummary(true);
      return;
    }
    if (showSummary && summary) {
      setShowSummary(false);
      return;
    }

    setIsLoadingSummary(true);
    setSummaryError("");
    setSummary("");
    setShowSummary(true);

    const prompt = `Please provide a concise summary or explain the significance of the following scientific publication in 2-3 sentences, suitable for a general audience. Focus on the key findings or impact:\nTitle: "${pub.title}"\nAuthors: ${pub.authors}\nJournal: ${pub.journal}\nYear: ${pub.year}\n${pub.note ? `Note: ${pub.note}` : ""}\nWhat are the main takeaways or importance of this research?`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKeyGen = ""; // IMPORTANT: API Key should be handled securely.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGen}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(
          `API request failed: ${errorData?.error?.message || response.status}`,
        );
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setSummary(result.candidates[0].content.parts[0].text);
      } else {
        console.error("Unexpected API response structure:", result);
        throw new Error("Failed to extract summary from API response.");
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      setSummaryError(
        error.message ||
          "An unknown error occurred while generating the summary.",
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

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
      <div className="flex flex-wrap items-center space-x-4 mt-3">
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium inline-flex items-center mb-2 sm:mb-0 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
        >
          View Publication{" "}
          <ExternalLink size={16} className="ml-1.5" aria-hidden="true" />
        </a>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          aria-controls={`pub-summary-${pub.id}`}
          aria-expanded={showSummary}
        >
          <Sparkles size={16} className="mr-1.5" aria-hidden="true" />
          {isLoadingSummary
            ? "Thinking..."
            : showSummary && summary
              ? "Hide AI Explanation"
              : "✨ Explain with AI"}
        </button>
      </div>

      {showSummary && (
        <motion.div
          id={`pub-summary-${pub.id}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-emerald-200 dark:border-slate-700"
        >
          {isLoadingSummary && (
            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
              <Loader2
                size={18}
                className="animate-spin mr-2"
                aria-hidden="true"
              />
              Generating explanation...
            </div>
          )}
          {summaryError && !isLoadingSummary && (
            <div
              className="flex items-start text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md"
              role="alert"
            >
              <AlertTriangle
                size={18}
                className="mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <strong>Error:</strong> {summaryError}
                <p className="text-xs mt-1">Please try again later.</p>
              </div>
            </div>
          )}
          {summary && !isLoadingSummary && !summaryError && (
            <div>
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                AI Explanation:
              </h4>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </article>
  );
};

export default PublicationItem;
