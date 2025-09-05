"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { PostContent } from "@/types/post";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoPostContentProps {
  content: PostContent;
}

// Animation Variants
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const PhotoPostContent: React.FC<PhotoPostContentProps> = ({ content }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  if (!content.images || content.images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const nextImage = () => {
    if (selectedImageIndex !== null && content.images) {
      setDirection(1);
      setSelectedImageIndex((selectedImageIndex + 1) % content.images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && content.images) {
      setDirection(-1);
      setSelectedImageIndex(
        (selectedImageIndex + content.images.length - 1) % content.images.length
      );
    }
  };

  const getGridClass = () => {
    const imageCount = content.images?.length || 0;
    if (imageCount === 1) return "grid-cols-1";
    if (imageCount === 2) return "grid-cols-1 sm:grid-cols-2";
    if (imageCount === 3) return "grid-cols-1 sm:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2";
  };

  return (
    <LayoutGroup>
      <div className="space-y-6">
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 ${getGridClass()}`}
        >
          {content.images.map((image, index) => (
            <motion.div
              key={index}
              variants={gridItemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              layoutId={`image-${index}`} // For shared layout animation
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-surface"
              onClick={() => openLightbox(index)}
            >
              <motion.img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {(content.images?.length || 0) > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1} / {content.images?.length}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {content.caption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-secondary italic text-center bg-surface p-4 rounded-lg"
          >
            {content.caption}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImageIndex !== null && content.images && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </motion.button>

              {content.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}

              <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={selectedImageIndex}
                    layoutId={`image-${selectedImageIndex}`} // For shared layout animation
                    src={content.images[selectedImageIndex]}
                    alt={`Photo ${selectedImageIndex + 1}`}
                    variants={slideVariants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </AnimatePresence>
              </div>

              {content.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {content.images.length}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default PhotoPostContent;
