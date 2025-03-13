"use client";

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center text-primary font-bold text-xl"
            tabIndex={0}
            aria-label="Go to homepage"
          >
            <Home className="h-6 w-6 mr-2" />
            <span>BeachVilla</span>
          </Link>
          
          {/* Navigation */}
          <Navigation />
          
          {/* Book Now Button (only visible on desktop) */}
          <div className="hidden md:block">
            <Link 
              href="/book" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              tabIndex={0}
              aria-label="Book your stay now"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 