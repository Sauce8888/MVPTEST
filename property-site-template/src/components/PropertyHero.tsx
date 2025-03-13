import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Users, Bed, Bath, MapPin } from 'lucide-react';
import { Property } from '@/lib/supabase';

interface PropertyHeroProps {
  property: Property;
}

const PropertyHero = ({ property }: PropertyHeroProps) => {
  // Assuming the first image is the main hero image
  const heroImage = property.images[0] || '/default-property.jpg';
  
  return (
    <section className="relative">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[70vh] w-full">
        <Image
          src={heroImage}
          alt={property.name}
          className="object-cover"
          priority
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
      
      {/* Property Info */}
      <div className="container mx-auto px-4 relative -mt-32 md:-mt-48 z-10">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{property.name}</h1>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-gray-700">
                  <Bed className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Bath className="h-5 w-5 mr-2 text-primary" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span>Up to {property.max_guests} Guests</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>4.9 (128 reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-700 mt-4 line-clamp-3 md:line-clamp-none">
                {property.description}
              </p>
            </div>
            
            <div className="flex flex-col justify-center items-center md:items-end gap-4 bg-gray-50 p-6 rounded-lg md:min-w-[300px]">
              <div className="text-center md:text-right">
                <p className="text-lg text-gray-600">From</p>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  ${property.base_price}<span className="text-lg font-normal text-gray-600">/night</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {property.cleaning_fee ? `+$${property.cleaning_fee} cleaning fee` : 'No cleaning fee'}
                </p>
              </div>
              
              <Button
                asChild
                className="w-full md:w-auto mt-4"
                size="lg"
              >
                <Link 
                  href="/book" 
                  tabIndex={0}
                  aria-label="Book your stay now"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Link>
              </Button>
              
              <p className="text-sm text-gray-500 mt-2">
                {property.minimum_nights > 1 
                  ? `Minimum stay: ${property.minimum_nights} nights`
                  : 'No minimum stay required'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyHero; 