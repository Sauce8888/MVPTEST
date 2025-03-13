import React from 'react';
import { 
  Wifi, 
  Tv, 
  Car, 
  Coffee, 
  Snowflake, 
  Waves, 
  Apple, 
  Utensils, 
  ShowerHead,
  Baby,
  Dumbbell,
  PawPrint,
  Check
} from 'lucide-react';
import { Property } from '@/lib/supabase';

interface AmenitiesSectionProps {
  property: Property;
}

// Map of possible amenities to their icons and display names
const amenityMap: Record<string, { icon: React.ReactNode; name: string }> = {
  wifi: { icon: <Wifi className="h-6 w-6" />, name: 'Free WiFi' },
  tv: { icon: <Tv className="h-6 w-6" />, name: 'Smart TV' },
  parking: { icon: <Car className="h-6 w-6" />, name: 'Free Parking' },
  'coffee-maker': { icon: <Coffee className="h-6 w-6" />, name: 'Coffee Maker' },
  'air-conditioning': { icon: <Snowflake className="h-6 w-6" />, name: 'Air Conditioning' },
  pool: { icon: <Waves className="h-6 w-6" />, name: 'Swimming Pool' },
  kitchen: { icon: <Utensils className="h-6 w-6" />, name: 'Fully Equipped Kitchen' },
  'apple-tv': { icon: <Apple className="h-6 w-6" />, name: 'Apple TV' },
  'rainfall-shower': { icon: <ShowerHead className="h-6 w-6" />, name: 'Rainfall Shower' },
  'baby-friendly': { icon: <Baby className="h-6 w-6" />, name: 'Baby Friendly' },
  gym: { icon: <Dumbbell className="h-6 w-6" />, name: 'Fitness Center' },
  'pet-friendly': { icon: <PawPrint className="h-6 w-6" />, name: 'Pet Friendly' },
};

// Default amenities if none are provided
const defaultAmenities = [
  'wifi',
  'tv',
  'parking',
  'coffee-maker',
  'air-conditioning'
];

const AmenitiesSection = ({ property }: AmenitiesSectionProps) => {
  // Use the property's amenities or fall back to defaults
  const amenities = property.amenities?.length ? property.amenities : defaultAmenities;
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Amenities</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            // Get the amenity details from our map, or create a generic one
            const amenityDetails = amenityMap[amenity] || {
              icon: <Check className="h-6 w-6" />,
              name: amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/-/g, ' ')
            };
            
            return (
              <div 
                key={`amenity-${index}`}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 text-primary mr-4">
                  {amenityDetails.icon}
                </div>
                <span className="text-gray-700">{amenityDetails.name}</span>
              </div>
            );
          })}
        </div>
        
        {property.amenities?.length > 8 && (
          <div className="mt-6 text-center">
            <button 
              className="text-primary hover:text-primary/80 font-medium"
              tabIndex={0}
              aria-label="Show all amenities"
            >
              Show all amenities
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AmenitiesSection; 