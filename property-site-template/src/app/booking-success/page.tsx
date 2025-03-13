import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Thank you for your booking. We've sent a confirmation email with all the details.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
            
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Check your email for booking confirmation and details</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>The property owner will contact you with check-in instructions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Save the property details and contact information for your trip</span>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600">
              If you have any questions, please contact the property owner directly.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline">
              <Link 
                href="/" 
                tabIndex={0}
                aria-label="Return to homepage"
              >
                Return to Homepage
              </Link>
            </Button>
            
            <Button asChild>
              <Link 
                href="/contact" 
                tabIndex={0}
                aria-label="Contact host"
              >
                Contact Host
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 