// SkeletonLoader.jsx
import React from "react";

/**
 * SkeletonLoader Component: Displays loading skeletons for various content types
 * @param {object} props - Component props
 * @param {string} [props.type="card"] - Type of skeleton (card, text, image, profile)
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.lines=3] - Number of text lines for text skeleton
 * @param {string} [props.height="auto"] - Custom height
 */
const SkeletonLoader = ({ 
  type = "card", 
  className = "", 
  lines = 3, 
  height = "auto" 
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700";
  
  switch (type) {
    case "profile":
      return (
        <div className={`flex items-center space-x-4 ${className}`}>
          <div className={`${baseClasses} w-16 h-16 rounded-full`} />
          <div className="flex-1 space-y-2">
            <div className={`${baseClasses} h-4 rounded w-3/4`} />
            <div className={`${baseClasses} h-3 rounded w-1/2`} />
          </div>
        </div>
      );
      
    case "image":
      return (
        <div 
          className={`${baseClasses} rounded-lg ${className}`}
          style={{ height: height !== "auto" ? height : "200px" }}
        />
      );
      
    case "text":
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }, (_, i) => (
            <div 
              key={i}
              className={`${baseClasses} h-4 rounded ${
                i === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>
      );
      
    case "card":
    default:
      return (
        <div className={`${className} p-6 rounded-lg border dark:border-slate-700`}>
          <div className={`${baseClasses} h-48 rounded-lg mb-4`} />
          <div className={`${baseClasses} h-6 rounded mb-2 w-3/4`} />
          <div className="space-y-2">
            <div className={`${baseClasses} h-4 rounded w-full`} />
            <div className={`${baseClasses} h-4 rounded w-5/6`} />
            <div className={`${baseClasses} h-4 rounded w-2/3`} />
          </div>
          <div className={`${baseClasses} h-10 rounded mt-4 w-1/3`} />
        </div>
      );
  }
};

/**
 * SkeletonGrid Component: Displays a grid of skeleton cards
 * @param {object} props - Component props
 * @param {number} [props.count=6] - Number of skeleton cards
 * @param {string} [props.className] - Grid container classes
 */
export const SkeletonGrid = ({ count = 6, className = "" }) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonLoader key={i} type="card" />
      ))}
    </div>
  );
};

/**
 * SkeletonSection Component: Displays a skeleton for a full section
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 */
export const SkeletonSection = ({ className = "" }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Title skeleton */}
      <div className="text-center">
        <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 h-8 rounded w-64 mx-auto mb-4" />
        <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 h-4 rounded w-96 mx-auto" />
      </div>
      
      {/* Content skeleton */}
      <SkeletonGrid count={3} className="md:grid-cols-2 lg:grid-cols-3" />
    </div>
  );
};

export default SkeletonLoader;