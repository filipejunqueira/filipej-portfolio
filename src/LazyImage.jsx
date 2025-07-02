// LazyImage.jsx
import React, { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";

/**
 * LazyImage Component: Dynamically loads images on demand
 * @param {object} props - Component props
 * @param {string} props.imageName - Name of the image to load (without extension)
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} [props.className] - CSS classes
 * @param {function} [props.onClick] - Click handler
 * @param {function} [props.onError] - Error handler
 * @param {string} [props.sizes] - Responsive sizes attribute
 * @param {boolean} [props.priority=false] - Whether image is above fold
 * @param {boolean} [props.shouldLoad=true] - Whether to trigger loading
 */
const LazyImage = ({
  imageName,
  alt,
  className = "",
  onClick,
  onError,
  sizes,
  priority = false,
  shouldLoad = true,
  ...props
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!shouldLoad || !imageName) return;

    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Try WebP first
        try {
          const webpModule = await import(`./assets/${imageName}.webp`);
          setImageUrl(webpModule.default);
        } catch (webpError) {
          // Fallback to PNG
          const pngModule = await import(`./assets/${imageName}.png`);
          setImageUrl(pngModule.default);
        }
      } catch (error) {
        console.warn(`Failed to load image: ${imageName}`, error);
        setHasError(true);
        if (onError) onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imageName, shouldLoad, onError]);

  // Show loading state
  if (isLoading || !imageUrl) {
    return (
      <div 
        className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse rounded ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-slate-800 flex items-center justify-center ${className}`}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-gray-400 dark:text-slate-500 text-sm text-center px-2">
          Image unavailable
        </span>
      </div>
    );
  }

  // Render loaded image
  return (
    <OptimizedImage
      src={imageUrl}
      alt={alt}
      className={className}
      onClick={() => onClick && onClick(imageUrl)}
      onError={onError}
      sizes={sizes}
      priority={priority}
      {...props}
    />
  );
};

export default LazyImage;