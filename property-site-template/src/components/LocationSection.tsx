"use client";

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Property } from '@/lib/supabase';

interface LocationSectionProps {
  property: Property;
}

const LocationSection = ({ property }: LocationSectionProps) => {
  // Example points of interest
  const pointsOfInterest = [
    { name: 'Downtown Area', distance: '1.2 miles', time: '5 min drive' },
    { name: 'Beach Access', distance: '0.3 miles', time: '5 min walk' },
    { name: 'Grocery Store', distance: '0.7 miles', time: '3 min drive' },
    { name: 'Airport', distance: '12 miles', time: '25 min drive' },
    { name: 'Local Restaurants', distance: '0.5 miles', time: '10 min walk' },
    { name: 'Shopping Mall', distance: '3.2 miles', time: '10 min drive' },
  ];
  
  const handleGetDirections = () => {
    // Redirect to Google Maps directions
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.address)}`, '_blank');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleGetDirections();
    }
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Location</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Placeholder - In production, integrate Google Maps or Mapbox */}
          <div className="w-full md:w-2/3 relative min-h-[400px] bg-gray-200 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* This is a placeholder. In production, use an actual map */}
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Map view would go here.</p>
                <p className="text-gray-800 font-medium mb-4">{property.address}</p>
                <button
                  onClick={handleGetDirections}
                  onKeyDown={handleKeyDown}
                  className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  tabIndex={0}
                  aria-label="Get directions to property"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
          
          {/* Location Information */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Area</h3>
              <p className="text-gray-700 mb-6">
                Located in a peaceful neighborhood with easy access to local attractions.
                The property is situated in {property.location} with convenient proximity to shops,
                restaurants, and outdoor activities.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Nearby</h4>
              <ul className="space-y-3">
                {pointsOfInterest.map((poi, index) => (
                  <li key={`poi-${index}`} className="flex justify-between">
                    <span className="text-gray-700">{poi.name}</span>
                    <span className="text-gray-500 text-sm">
                      {poi.distance} ({poi.time})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection; 