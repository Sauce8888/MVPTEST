import { createClient, type User } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log Supabase configuration status (without exposing sensitive keys)
if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Client-side supabase client (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side admin client with service role (full access)
export const adminSupabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : (() => {
      console.warn('⚠️ Using public client for admin operations because SUPABASE_SERVICE_ROLE_KEY is not set');
      return supabase;
    })();

// Log the initialization status
console.log('✅ Supabase clients initialized');

// Export Supabase types
export type { User as SupabaseUser } from '@supabase/supabase-js';

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

export type Client = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PropertyClientRelation = {
  id: string;
  property_id: string;
  client_id: string;
  assigned_by: string;
  notes?: string;
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