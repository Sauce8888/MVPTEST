"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Image, 
  Star, 
  Map, 
  Coffee, 
  Calendar, 
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleToggleMenu();
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/gallery', label: 'Gallery', icon: <Image className="h-5 w-5" /> },
    { href: '/amenities', label: 'Amenities', icon: <Coffee className="h-5 w-5" /> },
    { href: '/reviews', label: 'Reviews', icon: <Star className="h-5 w-5" /> },
    { href: '/book', label: 'Book Now', icon: <Calendar className="h-5 w-5" /> },
    { href: '/contact', label: 'Contact', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Open main menu"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 inset-x-0 z-10 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-100">
              <div className="pt-5 pb-6 px-5">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 