import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, PROPERTY_ID, Property } from '@/lib/supabase';
import { Star, Calendar, User } from 'lucide-react';

// Sample property data for development
const sampleProperty: Property = {
  id: '123',
  host_id: '456',
  name: 'Beautiful Beachfront Villa',
  description: 'Experience luxury living in this stunning beachfront villa with panoramic ocean views.',
  location: 'Malibu, California',
  address: '123 Ocean Drive, Malibu, CA 90265',
  bedrooms: 3,
  bathrooms: 2,
  max_guests: 6,
  base_price: 299,
  weekend_price: 349,
  cleaning_fee: 150,
  minimum_nights: 2,
  check_in_time: '15:00',
  check_out_time: '11:00',
  house_rules: 'No smoking. No parties or events. Pets allowed with prior approval.',
  amenities: [
    'wifi',
    'pool',
    'kitchen',
    'parking',
    'air-conditioning',
    'tv',
    'coffee-maker',
    'rainfall-shower',
    'pet-friendly',
    'baby-friendly'
  ],
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

// Sample reviews data
const sampleReviews = [
  {
    id: '1',
    property_id: '123',
    guest_name: 'Sarah Johnson',
    guest_avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
    date: '2023-06-15',
    comment: 'Absolutely stunning property! The views are even better than the pictures. We loved waking up to the sound of the ocean every morning. The kitchen was well-equipped, and the beds were incredibly comfortable. The host was very responsive and provided excellent recommendations for local restaurants. We will definitely be back!',
    categories: {
      cleanliness: 5,
      communication: 5,
      check_in: 5,
      accuracy: 5,
      location: 5,
      value: 4
    }
  },
  {
    id: '2',
    property_id: '123',
    guest_name: 'Michael Chen',
    guest_avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 4,
    date: '2023-05-28',
    comment: 'Great location and beautiful property. The pool was perfect for our kids, and we loved being so close to the beach. The only minor issue was that the air conditioning in one bedroom wasn\'t working properly, but the host sent someone to fix it the same day we reported it. Overall, a wonderful stay!',
    categories: {
      cleanliness: 4,
      communication: 5,
      check_in: 5,
      accuracy: 4,
      location: 5,
      value: 4
    }
  },
  {
    id: '3',
    property_id: '123',
    guest_name: 'Emma Wilson',
    guest_avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    date: '2023-04-10',
    comment: 'This villa exceeded all our expectations! The interior design is gorgeous, and everything was spotlessly clean. We particularly enjoyed the outdoor patio area for morning coffee and evening drinks. The location is perfect - quiet and private but still close to restaurants and shops. The host provided a detailed guide to the area which was very helpful.',
    categories: {
      cleanliness: 5,
      communication: 5,
      check_in: 5,
      accuracy: 5,
      location: 5,
      value: 5
    }
  },
  {
    id: '4',
    property_id: '123',
    guest_name: 'David Rodriguez',
    guest_avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    rating: 4,
    date: '2023-03-22',
    comment: 'We had a wonderful family vacation at this beautiful beachfront villa. The property is spacious and well-maintained. The kitchen had everything we needed to cook meals, and we loved having breakfast on the terrace with ocean views. The host was very accommodating with our late check-in. Would definitely recommend!',
    categories: {
      cleanliness: 4,
      communication: 5,
      check_in: 4,
      accuracy: 4,
      location: 5,
      value: 4
    }
  },
  {
    id: '5',
    property_id: '123',
    guest_name: 'Jennifer Taylor',
    guest_avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    rating: 5,
    date: '2023-02-14',
    comment: 'Perfect romantic getaway! We stayed here for Valentine\'s Day and it was magical. The sunset views from the master bedroom are incredible. The property was immaculate and exactly as described. The host even left us a bottle of champagne as a welcome gift. We\'re already planning our next visit!',
    categories: {
      cleanliness: 5,
      communication: 5,
      check_in: 5,
      accuracy: 5,
      location: 5,
      value: 5
    }
  },
  {
    id: '6',
    property_id: '123',
    guest_name: 'Robert Kim',
    guest_avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 4,
    date: '2023-01-05',
    comment: 'Great property in an amazing location. We enjoyed our stay and made good use of the pool and beach access. The kitchen was well-stocked, and the beds were comfortable. The only reason I\'m not giving 5 stars is because the WiFi was a bit spotty during our stay, but that might have been due to the weather.',
    categories: {
      cleanliness: 5,
      communication: 4,
      check_in: 5,
      accuracy: 4,
      location: 5,
      value: 4
    }
  }
];

// Calculate average ratings
const calculateAverageRatings = (reviews: any[]) => {
  if (reviews.length === 0) return { overall: 0, categories: {} };
  
  let overallSum = 0;
  const categorySums: Record<string, number> = {
    cleanliness: 0,
    communication: 0,
    check_in: 0,
    accuracy: 0,
    location: 0,
    value: 0
  };
  
  reviews.forEach(review => {
    overallSum += review.rating;
    
    Object.entries(review.categories).forEach(([key, value]) => {
      categorySums[key] += value as number;
    });
  });
  
  const categoryAverages: Record<string, number> = {};
  Object.entries(categorySums).forEach(([key, sum]) => {
    categoryAverages[key] = parseFloat((sum / reviews.length).toFixed(1));
  });
  
  return {
    overall: parseFloat((overallSum / reviews.length).toFixed(1)),
    categories: categoryAverages
  };
};

// Format date to readable string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default async function ReviewsPage() {
  // In production, we would fetch the property and reviews data from Supabase
  // const { data: property, error } = await supabase
  //   .from('properties')
  //   .select('*')
  //   .eq('id', PROPERTY_ID)
  //   .single();
  
  // const { data: reviews, error: reviewsError } = await supabase
  //   .from('reviews')
  //   .select('*')
  //   .eq('property_id', PROPERTY_ID)
  //   .order('date', { ascending: false });
  
  // For development, use the sample data
  const property = sampleProperty;
  const reviews = sampleReviews;
  
  const averageRatings = calculateAverageRatings(reviews);
  
  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Guest Reviews</h1>
        <p className="text-lg text-gray-700 mb-8">
          See what our guests have to say about their stay at {property.name}.
        </p>
        
        {/* Ratings Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-gray-900 mr-2">{averageRatings.overall}</span>
                <div>
                  <StarRating rating={averageRatings.overall} />
                  <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {Object.entries(averageRatings.categories).map(([category, rating]) => (
                <div key={category} className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 capitalize">{category.replace('_', ' ')}</span>
                    <span className="text-sm font-medium">{rating}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${(rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start">
                <img 
                  src={review.guest_avatar} 
                  alt={review.guest_name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{review.guest_name}</h3>
                    <div className="flex items-center mt-1 sm:mt-0">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {Object.entries(review.categories).map(([category, rating]) => (
                      <div key={category} className="flex items-center">
                        <span className="text-xs text-gray-500 capitalize w-24">{category.replace('_', ' ')}:</span>
                        <StarRating rating={rating as number} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Leave a Review CTA */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stayed at {property.name}?</h2>
          <p className="text-gray-700 mb-6">Share your experience and help future guests make their decision.</p>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <User className="h-5 w-5 mr-2" />
            Leave a Review
          </a>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 