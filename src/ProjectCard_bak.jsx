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

/**
 * ProjectCard Component: Displays details for a single project.
 * @param {object} props - Component props.
 * @param {string} props.title - Project title.
 * @param {string} props.description - Project description.
 * @param {string} [props.artisticStatement] - Optional artistic statement.
 * @param {string} props.mainImage - URL for the main project image.
 * @param {string[]} props.galleryImages - Array of URLs for gallery images.
 * @param {string} [props.imagePlaceholderColor] - Background for image placeholder.
 * @param {string} [props.link] - Optional external link.
 * @param {string} props.type - Type of project (e.g., "blender", "code").
 * @param {boolean} props.isGalleryOpen - State if gallery is expanded.
 * @param {function} props.onToggleGallery - Callback to toggle gallery.
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
  isGalleryOpen,
  onToggleGallery,
  onImageClick, // New prop to handle image clicks for the lightbox
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
    <article className="bg-emerald-50 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:shadow-slate-700/60 dark:hover:shadow-slate-600/70 dark:border dark:border-slate-700 transition-all duration-300 flex flex-col h-full">
      {type === "blender" && mainImage ? (
        <div className="overflow-hidden rounded-md mb-5 shadow-sm">
          <img
            src={mainImage}
            alt={`Main image for ${title} - ${type} project`}
            className="w-full h-52 md:h-60 object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer" // Added hover/cursor classes
            onError={imageErrorHandler}
            loading="lazy"
            onClick={() => onImageClick(mainImage)} // Added onClick for lightbox
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

      <h3 className="text-xl md:text-2xl font-medium text-emerald-800 dark:text-emerald-300 mb-3">
        {title}
      </h3>

      <div className="flex-grow">
        <p
          className={`text-gray-700 dark:text-slate-300 text-sm md:text-base mb-2 ${isDescriptionExpanded || !artisticStatement ? "" : "line-clamp-3"}`}
        >
          {description}
        </p>
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
        <button
          onClick={toggleDescription}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center mb-4 text-sm font-medium self-start uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          aria-expanded={isDescriptionExpanded}
        >
          {isDescriptionExpanded ? "Show Less" : "Show More"}
          {isDescriptionExpanded ? (
            <ChevronUp size={18} className="ml-1" aria-hidden="true" />
          ) : (
            <ChevronDown size={18} className="ml-1" aria-hidden="true" />
          )}
        </button>
      )}

      <div className="mt-auto">
        {type === "blender" &&
          galleryImages &&
          galleryImages.length > 0 &&
          onToggleGallery && (
            <button
              onClick={onToggleGallery}
              className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 self-start mr-4 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
              aria-expanded={isGalleryOpen}
              aria-controls={`${title.replace(/\s+/g, "-").toLowerCase()}-gallery`}
            >
              {isGalleryOpen ? "Hide Images" : "View Images"}
              {isGalleryOpen ? (
                <ChevronUp size={18} className="ml-2" aria-hidden="true" />
              ) : (
                <ImageIcon size={18} className="ml-2" aria-hidden="true" />
              )}
            </button>
          )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors duration-300 self-start text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-800 rounded-sm"
          >
            View Project <ExternalLink size={16} className="ml-1.5" />
          </a>
        )}
      </div>

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
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={`${title} - Gallery Image ${currentImageIndex + 1} of ${galleryImages.length}`}
                  className="w-full h-60 md:h-72 object-cover shadow-inner bg-gray-100 dark:bg-slate-700 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer" // Added hover/cursor classes
                  onError={imageErrorHandler}
                  loading="lazy"
                  onClick={() => onImageClick(galleryImages[currentImageIndex])} // Added onClick for lightbox
                />
              </div>
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black/50 focus:ring-white"
                    aria-label="Previous Image"
                  >
                    <ArrowLeftCircle size={22} aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black/50 focus:ring-white"
                    aria-label="Next Image"
                  >
                    <ArrowRightCircle size={22} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            {galleryImages.length > 1 && (
              <p className="text-center text-xs text-gray-600 dark:text-slate-400">
                Image {currentImageIndex + 1} of {galleryImages.length}
              </p>
            )}
          </div>
        )}
    </article>
  );
};

export default ProjectCard;
