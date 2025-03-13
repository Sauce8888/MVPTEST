'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  totalProperties: number;
  totalClients: number;
  totalPropertyClientRelations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalClients: 0,
    totalPropertyClientRelations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use local storage admin authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated via localStorage
    const adminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(adminAuth);
    
    if (!adminAuth) return;

    const fetchStats = async () => {
      try {
        console.log("Fetching admin stats...");
        setIsLoading(true);
        
        // Demo mode or real Supabase data
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          // In demo mode, use mock data
          setTimeout(() => {
            setStats({
              totalProperties: 12,
              totalClients: 25,
              totalPropertyClientRelations: 37,
            });
            setIsLoading(false);
          }, 800);
          return;
        }
        
        // Fetch total properties count
        const { count: propertiesCount, error: propertiesError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        console.log("Properties count:", propertiesCount, "Error:", propertiesError);

        if (propertiesError) throw propertiesError;

        // Fetch total clients count
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        console.log("Clients count:", clientsCount, "Error:", clientsError);
        
        if (clientsError) throw clientsError;

        // Fetch total property-client relations count
        const { count: relationsCount, error: relationsError } = await supabase
          .from('property_client_relations')
          .select('*', { count: 'exact', head: true });

        console.log("Relations count:", relationsCount, "Error:", relationsError);
        
        if (relationsError) throw relationsError;

        setStats({
          totalProperties: propertiesCount || 0,
          totalClients: clientsCount || 0,
          totalPropertyClientRelations: relationsCount || 0,
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Dashboard Overview</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Total Properties</h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalProperties}</p>
              </div>
              <span className="bg-blue-100 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/properties" 
                className="text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                View all properties →
              </Link>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-purple-800">Total Clients</h3>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalClients}</p>
              </div>
              <span className="bg-purple-100 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/clients" 
                className="text-sm text-purple-700 hover:text-purple-900 font-medium"
              >
                View all clients →
              </Link>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-green-800">Client-Property Connections</h3>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalPropertyClientRelations}</p>
              </div>
              <span className="bg-green-100 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/clients" 
                className="text-sm text-green-700 hover:text-green-900 font-medium"
              >
                Manage connections →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/admin/clients/new"
              className="bg-white border border-gray-300 rounded-md p-4 flex items-center hover:bg-gray-50"
            >
              <span className="bg-purple-100 p-2 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Add New Client</h4>
                <p className="text-xs text-gray-500 mt-1">Create a new client account</p>
              </div>
            </Link>
            
            <Link 
              href="/properties/new"
              className="bg-white border border-gray-300 rounded-md p-4 flex items-center hover:bg-gray-50"
            >
              <span className="bg-blue-100 p-2 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M3 3h18v18H3zM12 8v8"></path><path d="M8 12h8"></path></svg>
              </span>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Add New Property</h4>
                <p className="text-xs text-gray-500 mt-1">Create a new property listing</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 