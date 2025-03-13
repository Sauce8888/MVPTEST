// Mock data for testing the application without a real database

import { Host, Property, Booking, Availability, CustomPricing, SeasonalPricing, WebsiteSettings } from './supabase';

// Mock Hosts
export const mockHosts: Host[] = [
  {
    id: '1',
    email: 'host@example.com',
    first_name: 'John',
    last_name: 'Smith',
    phone: '+1234567890',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'host2@example.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '+0987654321',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
  // Admin user
  {
    id: '3',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    phone: '+1122334455',
    created_at: '2022-12-01T00:00:00Z',
    updated_at: '2022-12-01T00:00:00Z',
  }
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: '1',
    host_id: '1',
    name: 'Beach House',
    description: 'Beautiful beach house with ocean views',
    location: 'Malibu, CA',
    address: '123 Ocean View Dr, Malibu, CA 90210',
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    base_price: 250,
    weekend_price: 300,
    cleaning_fee: 100,
    minimum_nights: 2,
    check_in_time: '15:00',
    check_out_time: '11:00',
    house_rules: 'No parties, No smoking',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Free parking'],
    images: ['/property1.jpg', '/property1-2.jpg'],
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2023-01-10T00:00:00Z',
  },
  {
    id: '2',
    host_id: '1',
    name: 'Mountain Cabin',
    description: 'Cozy cabin in the mountains',
    location: 'Lake Tahoe, CA',
    address: '456 Pine Tree Ln, Lake Tahoe, CA 96150',
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 4,
    base_price: 180,
    weekend_price: 220,
    cleaning_fee: 80,
    minimum_nights: 2,
    check_in_time: '16:00',
    check_out_time: '10:00',
    house_rules: 'No pets, No smoking',
    amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen', 'Free parking'],
    images: ['/property2.jpg', '/property2-2.jpg'],
    created_at: '2023-02-15T00:00:00Z',
    updated_at: '2023-02-15T00:00:00Z',
  },
  {
    id: '3',
    host_id: '2',
    name: 'Downtown Loft',
    description: 'Modern loft in the heart of downtown',
    location: 'San Francisco, CA',
    address: '789 Market St, San Francisco, CA 94103',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    base_price: 200,
    weekend_price: 250,
    cleaning_fee: 75,
    minimum_nights: 3,
    check_in_time: '15:00',
    check_out_time: '11:00',
    house_rules: 'No parties, No pets',
    amenities: ['WiFi', 'Gym', 'Rooftop Terrace', 'Kitchen', 'Washer/Dryer'],
    images: ['/property3.jpg', '/property3-2.jpg'],
    created_at: '2023-03-20T00:00:00Z',
    updated_at: '2023-03-20T00:00:00Z',
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    property_id: '1',
    guest_first_name: 'Michael',
    guest_last_name: 'Brown',
    guest_email: 'michael@example.com',
    guest_phone: '+1234567890',
    number_of_guests: 4,
    check_in_date: '2023-06-15',
    check_out_date: '2023-06-20',
    total_price: 1450,
    status: 'confirmed',
    stripe_payment_id: 'pi_123456789',
    special_requests: 'Early check-in if possible',
    created_at: '2023-05-01T00:00:00Z',
    updated_at: '2023-05-01T00:00:00Z',
  },
  {
    id: '2',
    property_id: '1',
    guest_first_name: 'Emily',
    guest_last_name: 'Davis',
    guest_email: 'emily@example.com',
    guest_phone: '+0987654321',
    number_of_guests: 2,
    check_in_date: '2023-07-10',
    check_out_date: '2023-07-15',
    total_price: 1300,
    status: 'pending',
    special_requests: 'Late check-out if possible',
    created_at: '2023-05-15T00:00:00Z',
    updated_at: '2023-05-15T00:00:00Z',
  },
  {
    id: '3',
    property_id: '2',
    guest_first_name: 'David',
    guest_last_name: 'Wilson',
    guest_email: 'david@example.com',
    guest_phone: '+1122334455',
    number_of_guests: 3,
    check_in_date: '2023-08-05',
    check_out_date: '2023-08-10',
    total_price: 980,
    status: 'confirmed',
    stripe_payment_id: 'pi_987654321',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
  }
];

// Generate upcoming bookings for the next 14 days (for testing)
const generateUpcomingBookings = (): Booking[] => {
  const upcomingBookings: Booking[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 5; i++) {
    const checkInDate = new Date();
    checkInDate.setDate(today.getDate() + i * 2);
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 3);
    
    upcomingBookings.push({
      id: `upcoming-${i}`,
      property_id: i % 2 === 0 ? '1' : '2',
      guest_first_name: `Guest${i}`,
      guest_last_name: `Family`,
      guest_email: `guest${i}@example.com`,
      guest_phone: `+1${String(i).padStart(10, '0')}`,
      number_of_guests: (i % 3) + 2,
      check_in_date: checkInDate.toISOString().split('T')[0],
      check_out_date: checkOutDate.toISOString().split('T')[0],
      total_price: 200 * ((i % 3) + 3),
      status: i % 3 === 0 ? 'pending' : 'confirmed',
      created_at: today.toISOString(),
      updated_at: today.toISOString(),
    });
  }
  
  return upcomingBookings;
};

export const mockUpcomingBookings = generateUpcomingBookings();

// Mock Availability
export const mockAvailability: Availability[] = [
  {
    id: '1',
    property_id: '1',
    date: '2023-06-14',
    is_available: false,
    reason: 'Maintenance',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
  // More availability entries would be generated dynamically
];

// Mock Custom Pricing
export const mockCustomPricing: CustomPricing[] = [
  {
    id: '1',
    property_id: '1',
    date: '2023-07-04',
    price: 350, // Holiday pricing
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    property_id: '1',
    date: '2023-07-05',
    price: 350,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
];

// Mock Seasonal Pricing
export const mockSeasonalPricing: SeasonalPricing[] = [
  {
    id: '1',
    property_id: '1',
    name: 'Summer Season',
    start_date: '2023-06-01',
    end_date: '2023-08-31',
    price: 275,
    minimum_nights: 3,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    property_id: '1',
    name: 'Winter Holidays',
    start_date: '2023-12-15',
    end_date: '2024-01-05',
    price: 400,
    minimum_nights: 4,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
];

// Mock Website Settings
export const mockWebsiteSettings: WebsiteSettings[] = [
  {
    id: '1',
    property_id: '1',
    site_title: 'Beach House Getaway',
    theme_color: '#3b82f6',
    about_host: 'We\'re a family who loves to share our beach house with guests.',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    property_id: '2',
    site_title: 'Mountain Retreat',
    theme_color: '#10b981',
    about_host: 'I\'ve been hosting for 5 years and love to help guests enjoy the mountains.',
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2023-02-20T00:00:00Z',
  },
];

// Helper function to get a host by email (for auth testing)
export const getHostByEmail = (email: string) => {
  return mockHosts.find(host => host.email === email);
};

// Helper function to get properties by host ID
export const getPropertiesByHostId = (hostId: string) => {
  return mockProperties.filter(property => property.host_id === hostId);
};

// Helper function to get bookings by property ID
export const getBookingsByPropertyId = (propertyId: string) => {
  return [...mockBookings, ...mockUpcomingBookings].filter(booking => booking.property_id === propertyId);
}; 