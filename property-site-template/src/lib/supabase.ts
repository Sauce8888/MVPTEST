import { createClient } from '@supabase/supabase-js';

// Create a mock Supabase client for development
const createMockClient = () => {
  // Mock property data
  const mockProperty = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    host_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Luxury Beach House',
    description: 'Beautiful beachfront property with amazing views',
    location: 'Malibu, CA',
    address: '123 Ocean Drive, Malibu, CA 90265',
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    base_price: 300,
    weekend_price: 350,
    cleaning_fee: 150,
    minimum_nights: 2,
    check_in_time: '15:00',
    check_out_time: '11:00',
    house_rules: 'No pets, no smoking, no parties',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen'],
    images: ['/images/property1.jpg', '/images/property2.jpg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Mock host data
  const mockHost = {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'host@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '555-123-4567',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            // If querying properties table with our mock ID, return mock data
            if (table === 'properties' && column === 'id' && value === process.env.NEXT_PUBLIC_PROPERTY_ID) {
              return Promise.resolve({ data: mockProperty, error: null });
            }
            // If querying hosts table with our mock ID, return mock host
            if (table === 'hosts' && column === 'id' && value === mockProperty.host_id) {
              return Promise.resolve({ data: mockHost, error: null });
            }
            // Otherwise return null data
            return Promise.resolve({ data: null, error: null });
          },
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: (data: any) => Promise.resolve({ 
        data: { ...data, id: 'new-mock-id-' + Date.now() },
        error: null 
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, session: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
};

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a single supabase client for interacting with your database
let supabase: any;
let adminSupabase: any;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isBrowser && (!supabaseUrl || supabaseUrl === 'https://example.supabase.co')) {
    // Use mock client in browser if no real URL is provided
    supabase = createMockClient();
    adminSupabase = createMockClient();
  } else {
    // Client-side supabase client (limited permissions)
    supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Server-side admin client with service role (full access)
    adminSupabase = supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
      : supabase;
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client, using mock client instead', error);
  supabase = createMockClient();
  adminSupabase = createMockClient();
}

// Export the clients
export { supabase, adminSupabase };

// Property ID for the current site
export const PROPERTY_ID = process.env.NEXT_PUBLIC_PROPERTY_ID || '123';

// Types based on our schema
export type Host = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  host_id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  base_price: number;
  weekend_price?: number;
  cleaning_fee?: number;
  minimum_nights: number;
  check_in_time: string;
  check_out_time: string;
  house_rules?: string;
  amenities: string[];
  images: string[];
  google_calendar_id?: string;
  stripe_account_id?: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  property_id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  number_of_guests: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripe_payment_id?: string;
  special_requests?: string;
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
};

export type Availability = {
  id: string;
  property_id: string;
  date: string;
  is_available: boolean;
  reason?: string;
  created_at: string;
  updated_at: string;
};

export type CustomPricing = {
  id: string;
  property_id: string;
  date: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type SeasonalPricing = {
  id: string;
  property_id: string;
  name: string;
  start_date: string;
  end_date: string;
  price: number;
  minimum_nights?: number;
  created_at: string;
  updated_at: string;
};

export type WebsiteSettings = {
  id: string;
  property_id: string;
  site_title: string;
  theme_color: string;
  about_host?: string;
  custom_domain?: string;
  created_at: string;
  updated_at: string;
}; 