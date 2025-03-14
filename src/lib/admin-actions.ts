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

// Type for creating a host account
export type CreateHostData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};

export async function createHostAccount(hostData: CreateHostData) {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: hostData.email,
      password: hostData.password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return { success: false, error: authError };
    }

    // Then create the host record
    const now = new Date().toISOString();
    const hostRecord = {
      id: authData.user.id,
      email: hostData.email,
      first_name: hostData.firstName,
      last_name: hostData.lastName,
      phone: hostData.phone || null,
      password_hash: 'managed_by_supabase_auth',
      created_at: now,
      updated_at: now
    };

    const { error: hostError } = await adminSupabase
      .from('hosts')
      .insert(hostRecord);
    
    if (hostError) {
      console.error('Error creating host record:', hostError);
      
      // Try to clean up the auth user if host record creation failed
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      
      return { success: false, error: hostError };
    }
    
    return { 
      success: true, 
      data: { 
        id: authData.user.id,
        email: hostData.email,
        firstName: hostData.firstName,
        lastName: hostData.lastName 
      } 
    };
  } catch (error) {
    console.error('Unexpected error in createHostAccount:', error);
    return { 
      success: false, 
      error: { message: 'Server error creating host account' } 
    };
  }
} 