import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { supabase, PROPERTY_ID, Property } from '@/lib/supabase';

// Sample property data for development (same as in the home page)
const sampleProperty: Property = {
  id: '123',
  host_id: '456',
  name: 'Beautiful Beachfront Villa',
  description: 'Experience luxury living in this stunning beachfront villa with panoramic ocean views. This spacious property offers modern amenities, a private pool, and direct beach access. Perfect for families or groups looking for a relaxing getaway in a prime location.',
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
  amenities: ['wifi', 'pool', 'kitchen', 'parking', 'air-conditioning', 'tv'],
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

export default async function BookingPage() {
  // In production, we would fetch the property data from Supabase
  // const { data: property, error } = await supabase
  //   .from('properties')
  //   .select('*')
  //   .eq('id', PROPERTY_ID)
  //   .single();
  
  // For development, use the sample property data
  const property = sampleProperty;
  
  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Book Your Stay</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm property={property} />
          </div>
          
          {/* Property Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={property.images[0]} 
                  alt={property.name}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h2>
                <p className="text-gray-600 mb-4">{property.location}</p>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base price per night</span>
                    <span className="font-semibold">${property.base_price}</span>
                  </div>
                  
                  {property.weekend_price && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Weekend price per night</span>
                      <span className="font-semibold">${property.weekend_price}</span>
                    </div>
                  )}
                  
                  {property.cleaning_fee && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span className="font-semibold">${property.cleaning_fee}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Minimum stay</span>
                    <span className="font-semibold">{property.minimum_nights} nights</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">House Rules</h3>
                  <p className="text-gray-600 text-sm">{property.house_rules}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold">After {property.check_in_time}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold">Before {property.check_out_time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 