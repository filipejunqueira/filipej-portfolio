// OptimizedImage.jsx
import React, { useState } from "react";

/**
 * OptimizedImage Component: Handles responsive images with WebP fallback
 * @param {object} props - Component props
 * @param {string} props.src - Image source URL (fallback format)
 * @param {string} [props.webpSrc] - WebP source URL (if available)
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} [props.className] - CSS classes
 * @param {string} [props.loading="lazy"] - Loading strategy
 * @param {function} [props.onClick] - Click handler
 * @param {function} [props.onError] - Error handler
 * @param {string} [props.sizes] - Responsive sizes attribute
 * @param {boolean} [props.priority=false] - Whether image is above fold
 */
const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  className = "",
  loading = "lazy",
  onClick,
  onError,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use provided WebP source or auto-generate from original src
  const getWebPSrc = (originalSrc) => {
    if (webpSrc) return webpSrc;
    
    const lastDotIndex = originalSrc.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return originalSrc.substring(0, lastDotIndex) + '.webp';
    }
    return originalSrc;
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // For priority images, use eager loading
  const loadingStrategy = priority ? "eager" : loading;

  return (
    <div className="relative">
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse rounded ${className}`}
          aria-hidden="true"
        />
      )}
      
      <picture>
        {/* WebP source for modern browsers */}
        <source 
          srcSet={getWebPSrc(src)} 
          type="image/webp"
          sizes={sizes}
        />
        
        {/* Fallback to original format */}
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading={loadingStrategy}
          onClick={onClick}
          onError={handleError}
          onLoad={handleLoad}
          sizes={sizes}
          {...props}
        />
      </picture>
      
      {hasError && (
        <div 
          className={`absolute inset-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center ${className}`}
          role="img"
          aria-label={`Failed to load image: ${alt}`}
        >
          <span className="text-gray-400 dark:text-slate-500 text-sm text-center px-2">
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;