'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreateHostForm from '@/components/CreateHostForm';

export default function HostsManagement() {
  const [showCreateForm, setShowCreateForm] = useState(true);

  // Toggle create form visibility
  const toggleCreateForm = () => {
    setShowCreateForm(prev => !prev);
  };
  
  // Handle after host is created
  const handleHostCreated = () => {
    // Show a success message but keep the form open for additional hosts
    setShowCreateForm(true);
  };
  
  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Hosts</h2>
            <p className="text-gray-500 mt-1">Create new host accounts</p>
          </div>
          <div>
            <Link 
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center mr-4"
              tabIndex={0}
              aria-label="Return to dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Host Accounts</h3>
          <button
            onClick={toggleCreateForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Toggle host creation form"
            tabIndex={0}
          >
            {showCreateForm ? 'Hide Form' : 'Create New Host'}
          </button>
        </div>
        
        {/* Create Host Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateHostForm onHostCreated={handleHostCreated} />
          </div>
        )}
        
        {/* Information Panel - Replacing the hosts list */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Create New Hosts</h3>
          <p className="mt-1 text-sm text-gray-500">
            Use the form above to create new host accounts.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Host accounts will have their own login to manage properties and bookings.
          </p>
        </div>
      </div>
    </div>
  );
} 