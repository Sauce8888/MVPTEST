import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AmenitiesSection from '@/components/AmenitiesSection';
import { supabase, PROPERTY_ID, Property } from '@/lib/supabase';
import { 
  Wifi, 
  Tv, 
  Car, 
  Coffee, 
  Snowflake, 
  Waves, 
  Utensils, 
  ShowerHead,
  Baby,
  Dumbbell,
  PawPrint,
  Bed,
  Bath,
  Users,
  Clock,
  Check
} from 'lucide-react';

// Sample property data for development (same as in the home page)
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

// Map of amenity categories
const amenityCategories = [
  {
    title: 'Basic',
    amenities: [
      { key: 'wifi', icon: <Wifi className="h-5 w-5" />, name: 'Free WiFi' },
      { key: 'tv', icon: <Tv className="h-5 w-5" />, name: 'Smart TV' },
      { key: 'air-conditioning', icon: <Snowflake className="h-5 w-5" />, name: 'Air Conditioning' },
      { key: 'parking', icon: <Car className="h-5 w-5" />, name: 'Free Parking' },
    ]
  },
  {
    title: 'Kitchen & Dining',
    amenities: [
      { key: 'kitchen', icon: <Utensils className="h-5 w-5" />, name: 'Fully Equipped Kitchen' },
      { key: 'coffee-maker', icon: <Coffee className="h-5 w-5" />, name: 'Coffee Maker' },
      { key: 'dishwasher', icon: <Check className="h-5 w-5" />, name: 'Dishwasher' },
      { key: 'microwave', icon: <Check className="h-5 w-5" />, name: 'Microwave' },
    ]
  },
  {
    title: 'Outdoor',
    amenities: [
      { key: 'pool', icon: <Waves className="h-5 w-5" />, name: 'Swimming Pool' },
      { key: 'bbq', icon: <Check className="h-5 w-5" />, name: 'BBQ Grill' },
      { key: 'patio', icon: <Check className="h-5 w-5" />, name: 'Patio' },
      { key: 'beach-access', icon: <Check className="h-5 w-5" />, name: 'Beach Access' },
    ]
  },
  {
    title: 'Bathroom',
    amenities: [
      { key: 'rainfall-shower', icon: <ShowerHead className="h-5 w-5" />, name: 'Rainfall Shower' },
      { key: 'hair-dryer', icon: <Check className="h-5 w-5" />, name: 'Hair Dryer' },
      { key: 'toiletries', icon: <Check className="h-5 w-5" />, name: 'Toiletries' },
      { key: 'bathtub', icon: <Bath className="h-5 w-5" />, name: 'Bathtub' },
    ]
  },
  {
    title: 'Bedroom',
    amenities: [
      { key: 'king-bed', icon: <Bed className="h-5 w-5" />, name: 'King Size Bed' },
      { key: 'queen-bed', icon: <Bed className="h-5 w-5" />, name: 'Queen Size Bed' },
      { key: 'linens', icon: <Check className="h-5 w-5" />, name: 'Premium Linens' },
      { key: 'iron', icon: <Check className="h-5 w-5" />, name: 'Iron & Ironing Board' },
    ]
  },
  {
    title: 'Family',
    amenities: [
      { key: 'baby-friendly', icon: <Baby className="h-5 w-5" />, name: 'Baby Friendly' },
      { key: 'pet-friendly', icon: <PawPrint className="h-5 w-5" />, name: 'Pet Friendly' },
      { key: 'high-chair', icon: <Check className="h-5 w-5" />, name: 'High Chair' },
      { key: 'crib', icon: <Check className="h-5 w-5" />, name: 'Crib' },
    ]
  },
  {
    title: 'Entertainment',
    amenities: [
      { key: 'gym', icon: <Dumbbell className="h-5 w-5" />, name: 'Fitness Center' },
      { key: 'games', icon: <Check className="h-5 w-5" />, name: 'Board Games' },
      { key: 'books', icon: <Check className="h-5 w-5" />, name: 'Books' },
      { key: 'streaming', icon: <Check className="h-5 w-5" />, name: 'Streaming Services' },
    ]
  },
  {
    title: 'Safety & Accessibility',
    amenities: [
      { key: 'smoke-detector', icon: <Check className="h-5 w-5" />, name: 'Smoke Detector' },
      { key: 'fire-extinguisher', icon: <Check className="h-5 w-5" />, name: 'Fire Extinguisher' },
      { key: 'first-aid', icon: <Check className="h-5 w-5" />, name: 'First Aid Kit' },
      { key: 'wheelchair-accessible', icon: <Check className="h-5 w-5" />, name: 'Wheelchair Accessible' },
    ]
  },
];

export default async function AmenitiesPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{property.name} Amenities</h1>
        <p className="text-lg text-gray-700 mb-8">
          Everything you need for a comfortable and enjoyable stay.
        </p>
        
        {/* Property Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Overview</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Bed className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Bath className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Max Guests</p>
                <p className="font-semibold">{property.max_guests}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Minimum Stay</p>
                <p className="font-semibold">{property.minimum_nights} nights</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Amenities by Category */}
        <div className="space-y-12">
          {amenityCategories.map((category, index) => (
            <div key={`category-${index}`} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.amenities.map((amenity, amenityIndex) => {
                  const isAvailable = property.amenities.includes(amenity.key);
                  
                  return (
                    <div 
                      key={`amenity-${amenityIndex}`}
                      className={`flex items-center p-4 rounded-lg ${
                        isAvailable 
                          ? 'bg-gray-50 text-gray-900' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <div className={`flex-shrink-0 mr-4 ${isAvailable ? 'text-primary' : 'text-gray-400'}`}>
                        {amenity.icon}
                      </div>
                      <span>{amenity.name}</span>
                      {!isAvailable && (
                        <span className="ml-auto text-xs text-gray-500">Not Available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* House Rules */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">{property.house_rules}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold">Check-in</p>
                  <p className="text-gray-700">After {property.check_in_time}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold">Check-out</p>
                  <p className="text-gray-700">Before {property.check_out_time}</p>
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