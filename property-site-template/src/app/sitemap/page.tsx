import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Home, 
  Image, 
  Star, 
  Map, 
  Coffee, 
  Calendar, 
  MessageSquare,
  Info,
  CheckCircle,
  FileText
} from 'lucide-react';

interface SitemapLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SitemapLink: React.FC<SitemapLinkProps> = ({ href, label, icon, description }) => {
  return (
    <Link 
      href={href}
      className="flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      tabIndex={0}
      aria-label={`Go to ${label} page`}
    >
      <div className="flex items-center mb-3">
        <div className="p-2 bg-primary bg-opacity-10 rounded-full mr-3">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default function SitemapPage() {
  const sitemapLinks: SitemapLinkProps[] = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      description: 'Main page with property overview, features, and highlights.'
    },
    {
      href: '/gallery',
      label: 'Photo Gallery',
      icon: <Image className="h-5 w-5" />,
      description: 'Browse all property photos organized by categories.'
    },
    {
      href: '/amenities',
      label: 'Amenities',
      icon: <Coffee className="h-5 w-5" />,
      description: 'Detailed list of all amenities and features available at the property.'
    },
    {
      href: '/reviews',
      label: 'Guest Reviews',
      icon: <Star className="h-5 w-5" />,
      description: 'Read reviews and ratings from previous guests who stayed at the property.'
    },
    {
      href: '/book',
      label: 'Book Now',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Check availability, prices, and make a reservation for your stay.'
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Get in touch with the property owner for questions or special requests.'
    },
    {
      href: '/booking-success',
      label: 'Booking Confirmation',
      icon: <CheckCircle className="h-5 w-5" />,
      description: 'Confirmation page after successfully completing a booking.'
    },
    {
      href: '/sitemap',
      label: 'Sitemap',
      icon: <FileText className="h-5 w-5" />,
      description: 'Overview of all pages available on the website (you are here).'
    }
  ];

  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sitemap</h1>
            <p className="text-lg text-gray-700 mt-1">
              Find all pages available on our website
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapLinks.map((link) => (
            <SitemapLink 
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              description={link.description}
            />
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
            <Info className="h-5 w-5 text-primary mr-2" />
            Additional Information
          </h2>
          <div className="prose max-w-none">
            <p>
              This website is designed to showcase the Beautiful Beachfront Villa property and provide
              potential guests with all the information they need to make a booking decision.
            </p>
            <p>
              If you cannot find what you're looking for, please visit our <Link href="/contact" className="text-primary hover:underline">Contact page</Link> to
              get in touch with the property owner directly.
            </p>
            <p>
              For technical issues with the website, please email <a href="mailto:support@beachvilla.com" className="text-primary hover:underline">support@beachvilla.com</a>.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 