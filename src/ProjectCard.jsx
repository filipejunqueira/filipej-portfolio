// ProjectCard.jsx
// Import React and necessary hooks from the 'react' library.
import React, { useState, useEffect } from "react";
// Import specific icons from 'lucide-react'.
import {
  Image as ImageIcon,
  Palette,
  Code,
  ChevronUp,
  ChevronDown,
  ArrowLeftCircle,
  ArrowRightCircle,
  ExternalLink,
} from "lucide-react";
// Import LazyImage component for dynamic loading
import LazyImage from "./LazyImage";
// Import UI components for consistency
import { Article, Button, IconButton, Link, TextPrimary, TextSecondary, focusRing } from "./components/UI";

/**
 * ProjectCard Component: Displays details for a single project.
 * @param {object} props - Component props.
 * @param {string} props.title - Project title.
 * @param {string} props.description - Project description.
 * @param {string} [props.artisticStatement] - Optional artistic statement.
 * @param {string} props.mainImage - Name of the main project image.
 * @param {string[]} props.galleryImages - Array of image names for gallery images.
 * @param {string} [props.imagePlaceholderColor] - Background for image placeholder.
 * @param {string} [props.link] - Optional external link.
 * @param {string} props.type - Type of project (e.g., "blender", "code").
 * @param {boolean} props.isGalleryOpen - State if gallery is expanded.
 * @param {function} props.onImageClick - Callback to open an image in the lightbox.
 */
const ProjectCard = ({
  title,
  description,
  artisticStatement,
  mainImage,
  galleryImages,
  imagePlaceholderColor,
  link,
  type,
  isGalleryOpen, // This prop remains, but is now controlled globally
  onImageClick,
}) => {
  // State for expanding/collapsing the description text.
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // State for the currently displayed image index in the gallery.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Toggles the 'isDescriptionExpanded' state.
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  // Moves to the next image in the gallery.
  const nextImage = (e) => {
    e.stopPropagation();
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  // Moves to the previous image in the gallery.
  const prevImage = (e) => {
    e.stopPropagation();
    if (galleryImages && galleryImages.length > 0)
      setCurrentImageIndex(
        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
      );
  };

  // Effect to reset gallery to first image when closed.
  useEffect(() => {
    if (type === "blender" && !isGalleryOpen) {
      setCurrentImageIndex(0);
    }
  }, [isGalleryOpen, type]);

  // Error handler for images.
  const imageErrorHandler = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/600x400/E0E0E0/BDBDBD?text=Image+Not+Found`;
  };

  return (
    <Article>
      {type === "blender" && mainImage ? (
        <div className="overflow-hidden rounded-md mb-5 shadow-sm">
          <LazyImage
            imageName={mainImage}
            alt={`Main image for ${title} - ${type} project`}
            className="w-full h-52 md:h-60 object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onError={imageErrorHandler}
            onClick={onImageClick}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
        </div>
      ) : (
        <div
          className={`w-full h-52 md:h-60 rounded-md flex items-center justify-center text-white dark:text-slate-300 text-xl font-semibold mb-5 ${imagePlaceholderColor || "bg-gray-300 dark:bg-slate-700"}`}
          role="img"
          aria-label={`${title} project placeholder image`}
        >
          {type === "blender" ? (
            <Palette size={52} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Code size={52} strokeWidth={1.5} aria-hidden="true" />
          )}
        </div>
      )}

      <TextPrimary 
        as="h3" 
        className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300 mb-3"
      >
        {title}
      </TextPrimary>

      <div className="flex-grow">
        <TextSecondary 
          as="p"
          className={`text-sm md:text-base mb-2 ${isDescriptionExpanded || !artisticStatement ? "" : "line-clamp-3"}`}
        >
          {description}
        </TextSecondary>
        {artisticStatement && (
          <p
            className={`text-emerald-700/80 dark:text-emerald-400/80 text-xs italic mt-1 mb-4 ${isDescriptionExpanded ? "" : "line-clamp-2"}`}
          >
            {artisticStatement}
          </p>
        )}
      </div>

      {(description.length > 100 ||
        (artisticStatement && artisticStatement.length > 50)) && (
        <Button
          onClick={toggleDescription}
          variant="outline"
          size="sm"
          className="mb-4 self-start"
          aria-expanded={isDescriptionExpanded}
        >
          {isDescriptionExpanded ? "Show Less" : "Show More"}
          {isDescriptionExpanded ? (
            <ChevronUp size={18} className="ml-1" aria-hidden="true" />
          ) : (
            <ChevronDown size={18} className="ml-1" aria-hidden="true" />
          )}
        </Button>
      )}

      <div className="mt-auto">
        {/* The "View/Hide Images" button has been REMOVED from here */}
        {link && (
          <Link
            href={link}
            external={true}
            variant="button"
            className="self-start"
          >
            View Project <ExternalLink size={16} className="ml-1.5" />
          </Link>
        )}
      </div>

      {/* This gallery display logic now depends on the globally controlled isGalleryOpen prop */}
      {type === "blender" &&
        isGalleryOpen &&
        galleryImages &&
        galleryImages.length > 0 && (
          <div
            id={`${title.replace(/\s+/g, "-").toLowerCase()}-gallery`}
            className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700"
          >
            <div className="relative mb-2">
              <div className="overflow-hidden rounded-md">
                <LazyImage
                  imageName={galleryImages[currentImageIndex]}
                  alt={`${title} - Gallery Image ${currentImageIndex + 1} of ${galleryImages.length}`}
                  className="w-full h-60 md:h-72 object-cover shadow-inner bg-gray-100 dark:bg-slate-700 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                  onError={imageErrorHandler}
                  onClick={onImageClick}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  shouldLoad={isGalleryOpen}
                />
              </div>
              {galleryImages.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                    aria-label="Previous Image"
                    icon={ArrowLeftCircle}
                  />
                  <IconButton
                    onClick={nextImage}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                    aria-label="Next Image"
                    icon={ArrowRightCircle}
                  />
                </>
              )}
            </div>
            {galleryImages.length > 1 && (
              <TextSecondary as="p" className="text-center text-xs">
                Image {currentImageIndex + 1} of {galleryImages.length}
              </TextSecondary>
            )}
          </div>
        )}
    </Article>
  );
};

export default ProjectCard;
