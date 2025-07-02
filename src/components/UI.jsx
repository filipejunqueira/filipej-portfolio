// UI.jsx - Reusable UI components to reduce Tailwind class duplication
import React from "react";

// Focus ring utility for consistent focus styles
export const focusRing = "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-emerald-300 dark:focus:ring-offset-emerald-500";

// Card component for consistent container styling
export const Card = ({ children, className = "", as: Component = "div", ...props }) => (
  <Component 
    className={`bg-white dark:bg-slate-800/50 rounded-lg shadow-lg dark:shadow-slate-700/70 p-6 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

// Button component with variants
export const Button = ({ 
  variant = "primary", 
  size = "md", 
  children, 
  className = "", 
  as: Component = "button",
  ...props 
}) => {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20",
    ghost: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const baseClasses = "rounded-md font-medium transition-colors duration-300 inline-flex items-center justify-center";
  
  return (
    <Component 
      className={`${baseClasses} ${focusRing} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Input component for forms
export const Input = ({ className = "", ...props }) => (
  <input 
    className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 transition-colors duration-300 ${focusRing} ${className}`}
    {...props}
  />
);

// Textarea component for forms
export const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 transition-colors duration-300 resize-vertical ${focusRing} ${className}`}
    {...props}
  />
);

// Text components for consistent typography
export const TextPrimary = ({ children, className = "", as: Component = "span", ...props }) => (
  <Component 
    className={`text-gray-800 dark:text-slate-200 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const TextSecondary = ({ children, className = "", as: Component = "span", ...props }) => (
  <Component 
    className={`text-gray-700 dark:text-slate-300 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const TextMuted = ({ children, className = "", as: Component = "span", ...props }) => (
  <Component 
    className={`text-gray-600 dark:text-slate-400 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

// Container component for consistent max-width and centering
export const Container = ({ children, size = "default", className = "" }) => {
  const sizes = {
    sm: "max-w-2xl",
    default: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl"
  };
  
  return (
    <div className={`container mx-auto px-6 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

// Skill/Tag component for consistent styling
export const Tag = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-50 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400",
    secondary: "bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300"
  };
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// IconButton component for consistent icon button styling
export const IconButton = ({ 
  icon: Icon, 
  children, 
  variant = "default", 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const variants = {
    default: "bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200",
    primary: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
    ghost: "hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-slate-400"
  };
  
  const sizes = {
    sm: "p-2 text-sm",
    md: "p-3 text-base", 
    lg: "p-4 text-lg"
  };
  
  const baseClasses = "rounded-full transition-colors duration-300 inline-flex items-center justify-center";
  
  return (
    <button 
      className={`${baseClasses} ${focusRing} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
      {children}
    </button>
  );
};

// Link component for consistent link styling
export const Link = ({ 
  children, 
  variant = "primary", 
  className = "", 
  external = false,
  ...props 
}) => {
  const variants = {
    primary: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300",
    secondary: "text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200",
    button: "inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 text-sm uppercase tracking-wider"
  };
  
  const baseClasses = "transition-colors duration-300";
  const focusClasses = external ? focusRing : "";
  
  return (
    <a 
      className={`${baseClasses} ${focusClasses} ${variants[variant]} ${className}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
};

// Code block component for consistent code display
export const CodeBlock = ({ children, className = "" }) => (
  <div className={`bg-gray-800 dark:bg-slate-900/80 p-4 rounded-lg font-mono text-xs overflow-x-auto shadow-inner ${className}`}>
    <pre className="whitespace-pre-wrap leading-relaxed text-sm">
      {children}
    </pre>
  </div>
);

// Article component for consistent article/card styling
export const Article = ({ children, className = "", ...props }) => (
  <article 
    className={`bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-all duration-300 flex flex-col h-full ${className}`}
    {...props}
  >
    {children}
  </article>
);