"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  FileText,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      callback();
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Property Info */}
          <div>
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 mr-2 text-primary" />
              <h3 className="text-xl font-bold">BeachVilla</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Experience luxury living in this stunning beachfront villa with panoramic ocean views.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Visit our Instagram"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => window.open('https://instagram.com', '_blank'))}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Visit our Facebook"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => window.open('https://facebook.com', '_blank'))}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Visit our Twitter"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => window.open('https://twitter.com', '_blank'))}
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link 
                  href="/amenities" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Amenities
                </Link>
              </li>
              <li>
                <Link 
                  href="/reviews" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Guest Reviews
                </Link>
              </li>
              <li>
                <Link 
                  href="/book" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">123 Ocean Drive, Malibu, CA 90265</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a 
                  href="mailto:info@beachvilla.com" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  info@beachvilla.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More Info</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/sitemap" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Sitemap
                  </span>
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} BeachVilla. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by BeachVilla Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 