'use server';

import { adminSupabase } from './supabase';

type DashboardStats = {
  totalHosts: number;
  totalProperties: number;
  totalBookings: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total hosts count
    const { count: hostsCount, error: hostsError } = await adminSupabase
      .from('hosts')
      .select('*', { count: 'exact', head: true });
    
    if (hostsError) {
      console.error('Error fetching hosts count:', hostsError);
      throw new Error('Failed to fetch hosts count');
    }
    
    // Get total properties count
    const { count: propertiesCount, error: propertiesError } = await adminSupabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    if (propertiesError) {
      console.error('Error fetching properties count:', propertiesError);
      throw new Error('Failed to fetch properties count');
    }
    
    // Get total bookings count
    const { count: bookingsCount, error: bookingsError } = await adminSupabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (bookingsError) {
      console.error('Error fetching bookings count:', bookingsError);
      throw new Error('Failed to fetch bookings count');
    }
    
    return {
      totalHosts: hostsCount || 0,
      totalProperties: propertiesCount || 0,
      totalBookings: bookingsCount || 0
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalHosts: 0,
      totalProperties: 0,
      totalBookings: 0
    };
  }
} 