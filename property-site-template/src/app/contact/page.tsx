import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase, PROPERTY_ID, Property } from '@/lib/supabase';

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
  amenities: ['wifi', 'pool', 'kitchen', 'parking', 'air-conditioning', 'tv'],
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

export default async function ContactPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-700">+1 (123) 456-7890</p>
                    <p className="text-sm text-gray-500 mt-1">Available 9am - 5pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700">host@example.com</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond as soon as possible</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-700">{property.address}</p>
                    <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Check-in:</span> After {property.check_in_time}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Check-out:</span> Before {property.check_out_time}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">House Rules:</span> {property.house_rules}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Booking Inquiry"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="I'm interested in booking your property..."
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  We'll get back to you as soon as possible.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 