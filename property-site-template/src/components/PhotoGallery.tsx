"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/supabase';

interface PhotoGalleryProps {
  property: Property;
}

const PhotoGallery = ({ property }: PhotoGalleryProps) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Default images if none are provided
  const defaultImages = [
    '/living-room.jpg',
    '/bedroom.jpg',
    '/kitchen.jpg',
    '/bathroom.jpg',
    '/exterior.jpg',
  ];
  
  const images = property.images?.length ? property.images : defaultImages;
  
  const handleOpenLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };
  
  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseLightbox();
    } else if (e.key === 'ArrowLeft') {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={`gallery-image-${index}`} 
              className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleOpenLightbox(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenLightbox(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <Image
                src={image}
                alt={`${property.name} - Image ${index + 1}`}
                className="object-cover"
                fill
              />
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {showLightbox && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={handleCloseLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button 
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={handleCloseLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute left-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image
                src={images[currentImageIndex]}
                alt={`${property.name} - Image ${currentImageIndex + 1}`}
                className="object-contain"
                fill
              />
            </div>
            
            <div className="absolute bottom-4 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery; 