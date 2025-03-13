'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Host = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  price_per_night: z.coerce.number().min(1, 'Price per night must be at least 1'),
  max_guests: z.coerce.number().min(1, 'Maximum guests must be at least 1'),
  bedrooms: z.coerce.number().min(1, 'Bedrooms must be at least 1'),
  bathrooms: z.coerce.number().min(1, 'Bathrooms must be at least 0.5').step(0.5),
  amenities: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
  const router = useRouter();
  const [host, setHost] = useState<Host | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      price_per_night: 100,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: '',
    },
  });
  
  useEffect(() => {
    // Check if user is logged in
    const hostData = localStorage.getItem('currentHost');
    
    if (!hostData) {
      router.push('/login');
      return;
    }
    
    const hostObj = JSON.parse(hostData) as Host;
    setHost(hostObj);
    setIsLoading(false);
  }, [router]);
  
  const onSubmit = async (data: PropertyFormValues) => {
    if (!host) {
      setError('You must be logged in to add a property');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert amenities string to array
      const amenitiesArray = data.amenities 
        ? data.amenities.split(',').map(item => item.trim()).filter(Boolean) 
        : [];
        
      // Add the property to the database
      const { data: newProperty, error: insertError } = await supabase
        .from('properties')
        .insert({
          host_id: host.id,
          name: data.name,
          description: data.description,
          location: data.location,
          price_per_night: data.price_per_night,
          max_guests: data.max_guests,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          amenities: amenitiesArray,
        })
        .select();
      
      if (insertError) throw insertError;
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to dashboard
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h1 className="text-lg leading-6 font-medium text-gray-900">Add New Property</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new property to your listings.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Beach House, Mountain Cabin, etc."
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your property in detail..."
                  {...register('description')}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Miami, FL; New York, NY; etc."
                  {...register('location')}
                  disabled={isSubmitting}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Night ($)
                  </label>
                  <input
                    id="price_per_night"
                    type="number"
                    min="1"
                    step="1"
                    className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price_per_night ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('price_per_night')}
                    disabled={isSubmitting}
                  />
                  {errors.price_per_night && (
                    <p className="mt-1 text-sm text-red-600">{errors.price_per_night.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Guests
                  </label>
                  <input
                    id="max_guests"
                    type="number"
                    min="1"
                    step="1"
                    className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.max_guests ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('max_guests')}
                    disabled={isSubmitting}
                  />
                  {errors.max_guests && (
                    <p className="mt-1 text-sm text-red-600">{errors.max_guests.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    id="bedrooms"
                    type="number"
                    min="1"
                    step="1"
                    className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.bedrooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('bedrooms')}
                    disabled={isSubmitting}
                  />
                  {errors.bedrooms && (
                    <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    id="bathrooms"
                    type="number"
                    min="0.5"
                    step="0.5"
                    className={`w-full px-4 py-2 border rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('bathrooms')}
                    disabled={isSubmitting}
                  />
                  {errors.bathrooms && (
                    <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  id="amenities"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Wifi, Pool, Kitchen, etc."
                  {...register('amenities')}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">Separate each amenity with a comma</p>
              </div>
              
              <div className="flex justify-end">
                <Link
                  href="/dashboard"
                  className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding Property...' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 