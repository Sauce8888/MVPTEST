import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, PROPERTY_ID, Property } from '@/lib/supabase';
import { Camera, Grid3X3, Grid, Image as ImageIcon } from 'lucide-react';

// Sample property data for development
const sampleProperty: Property = {
  id: '123',
  host_id: '456',
  name: 'Beautiful Beachfront Villa',
  description: 'Experience luxury living in this stunning beachfront villa with panoramic ocean views.',
  location: 'Malibu, California',
  address: '123 Ocean Drive, Malibu, CA 90265',
  bedrooms: 3,
  bathrooms: 2,
  max_guests: 6,
  base_price: 299,
  weekend_price: 349,
  cleaning_fee: 150,
  minimum_nights: 2,
  check_in_time: '15:00',
  check_out_time: '11:00',
  house_rules: 'No smoking. No parties or events. Pets allowed with prior approval.',
  amenities: [
    'wifi',
    'pool',
    'kitchen',
    'parking',
    'air-conditioning',
    'tv',
    'coffee-maker',
    'rainfall-shower',
    'pet-friendly',
    'baby-friendly'
  ],
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

// Extended sample images for the gallery
const sampleGalleryImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Beachfront villa exterior with pool',
    category: 'Exterior'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern living room with ocean view',
    category: 'Living Room'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Luxury kitchen with island',
    category: 'Kitchen'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Master bedroom with king bed',
    category: 'Bedroom'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Luxury bathroom with rainfall shower',
    category: 'Bathroom'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Infinity pool with ocean view',
    category: 'Pool'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Dining area with table for six',
    category: 'Dining'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Guest bedroom with queen bed',
    category: 'Bedroom'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Second bathroom with bathtub',
    category: 'Bathroom'
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Outdoor patio with seating',
    category: 'Exterior'
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c349279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Home office space',
    category: 'Office'
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    alt: 'Beachfront view from property',
    category: 'View'
  }
];

// Get unique categories from images
const getUniqueCategories = (images: any[]) => {
  const categories = images.map(image => image.category);
  return ['All', ...Array.from(new Set(categories))];
};

// Image component with lazy loading
const GalleryImage = ({ image }: { image: any }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md">
      <img 
        src={image.url} 
        alt={image.alt} 
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end">
        <div className="p-4 w-full text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="font-medium">{image.category}</p>
          <p className="text-sm opacity-90">{image.alt}</p>
        </div>
      </div>
    </div>
  );
};

export default async function GalleryPage() {
  // In production, we would fetch the property and gallery images from Supabase
  // const { data: property, error } = await supabase
  //   .from('properties')
  //   .select('*')
  //   .eq('id', PROPERTY_ID)
  //   .single();
  
  // const { data: galleryImages, error: galleryError } = await supabase
  //   .from('property_images')
  //   .select('*')
  //   .eq('property_id', PROPERTY_ID);
  
  // For development, use the sample data
  const property = sampleProperty;
  const galleryImages = sampleGalleryImages;
  
  const categories = getUniqueCategories(galleryImages);
  
  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{property.name} Photo Gallery</h1>
        <p className="text-lg text-gray-700 mb-8">
          Explore our beautiful property through these high-quality photos.
        </p>
        
        {/* Gallery Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-center md:justify-between gap-6">
            <div className="flex items-center">
              <Camera className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Photos</p>
                <p className="font-semibold">{galleryImages.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Grid3X3 className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="font-semibold">{categories.length - 1}</p> {/* Subtract 1 for 'All' */}
              </div>
            </div>
            
            <div className="flex items-center">
              <ImageIcon className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold">{new Date(property.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Filter - Client Component */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white shadow hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                data-category={category}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Note: Category filtering is handled by client-side JavaScript
          </p>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <GalleryImage key={image.id} image={image} />
          ))}
        </div>
        
        {/* Download All Photos CTA */}
        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Grid className="h-5 w-5 mr-2" />
            Download All Photos
          </button>
          <p className="text-sm text-gray-500 mt-2">
            High-resolution photos available for download (ZIP, 25MB)
          </p>
        </div>
      </div>
      
      {/* Client-side script for filtering */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const filterButtons = document.querySelectorAll('[data-category]');
          const galleryItems = document.querySelectorAll('.grid > div');
          
          filterButtons.forEach(button => {
            button.addEventListener('click', function() {
              const category = this.getAttribute('data-category');
              
              // Update active button
              filterButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
              this.classList.add('bg-primary', 'text-white');
              
              // Filter gallery items
              if (category === 'All') {
                galleryItems.forEach(item => item.style.display = 'block');
              } else {
                galleryItems.forEach(item => {
                  const itemCategory = item.querySelector('p').textContent;
                  if (itemCategory === category) {
                    item.style.display = 'block';
                  } else {
                    item.style.display = 'none';
                  }
                });
              }
            });
          });
          
          // Set 'All' as active by default
          filterButtons[0].classList.add('bg-primary', 'text-white');
        });
      ` }} />
      
      <Footer />
    </main>
  );
} 