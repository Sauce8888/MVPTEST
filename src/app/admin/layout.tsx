'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for admin authentication from localStorage
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAdminAuthenticated(adminAuth);
    setIsLoading(false);
  }, []);

  // Admin logout function
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading admin dashboard...</p>
      </div>
    );
  }

  // If on the main admin page, just render the children (login form or dashboard)
  // We'll determine this with a useEffect on the client side to avoid hydration issues
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin';
  if (isAdminPage) {
    return <>{children}</>;
  }

  // If not authenticated on subpages, redirect to main admin page
  if (!isAdminAuthenticated && !isAdminPage) {
    // Use router to redirect
    useEffect(() => {
      router.push('/admin');
    }, [router]);
    
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3">Redirecting to admin login...</p>
      </div>
    );
  }

  // Main admin layout when authenticated
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-blue-600">
                  Admin Portal
                </Link>
              </div>
              <nav className="ml-6 flex items-center space-x-4">
                <Link 
                  href="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/clients"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Clients
                </Link>
                <Link 
                  href="/admin/properties"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Properties
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                Logged in as Admin
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
              <Link
                href="/dashboard"
                className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 