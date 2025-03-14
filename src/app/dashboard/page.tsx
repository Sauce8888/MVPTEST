'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Property = {
  id: string;
  name: string;
  description: string;
  location: string;
  base_price: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      // Fetch properties based on user type
      const fetchProperties = async () => {
        try {
          let data: Property[] = [];
          let fetchError = null;

          if (user.isAdmin) {
            // Admin sees all properties
            const result = await supabase
              .from('properties')
              .select('*');
              
            data = result.data || [];
            fetchError = result.error;
          } else {
            // Check if this is a client user by looking for them in the clients table
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('id', user.id)
              .single();

            if (clientData) {
              // This is a client user, fetch their assigned properties
              const { data: relationsData, error: relationsError } = await supabase
                .from('property_client_relations')
                .select('*, property:property_id(*)')
                .eq('client_id', user.id);
                
              if (relationsError) {
                fetchError = relationsError;
              } else {
                // Extract properties from relations
                data = relationsData?.map((relation: any) => relation.property) || [];
              }
            } else {
              // Regular host user, fetch their own properties
              const result = await supabase
                .from('properties')
                .select('*')
                .eq('host_id', user.id);
                
              data = result.data || [];
              fetchError = result.error;
            }
          }
            
          if (fetchError) throw fetchError;
          
          setProperties(data);
        } catch (err) {
          console.error('Error fetching properties:', err);
          setError('Failed to load your properties. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProperties();
    }
  }, [router, user, authLoading]);
  
  const handleLogout = async () => {
    await signOut();
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Extract first name from the full name
  const userName = user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            {user?.isAdmin ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {userName}
            </span>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{properties.length}</dd>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Bookings</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">$0</dd>
            </div>
          </div>
        </div>
        
        {/* Properties section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your Properties</h2>
            {!user?.isAdmin && (
              <Link 
                href="/properties/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add property
              </Link>
            )}
          </div>
          
          {properties.length === 0 ? (
            <div className="px-4 py-10 sm:px-6 text-center">
              <p className="text-gray-500 mb-4">You don't have any properties yet.</p>
              {!user?.isAdmin && (
                <Link 
                  href="/properties/new" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add your first property
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {properties.map((property) => (
                <li key={property.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{property.location}</p>
                      <p className="mt-1 text-sm text-gray-700">${property.base_price} per night • {property.bedrooms} bedrooms • {property.bathrooms} bathrooms</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </Link>
                      {!user?.isAdmin && (
                        <Link
                          href={`/properties/${property.id}/edit`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
} 