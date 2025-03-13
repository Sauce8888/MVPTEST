'use server';

import { createClient } from '@supabase/supabase-js';

// Server-side admin client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface HostData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  password_hash?: string;
}

export async function createHostRecord(hostData: HostData) {
  try {
    const now = new Date().toISOString();
    
    const hostDataWithHash = {
      ...hostData,
      password_hash: hostData.password_hash || 'managed_by_supabase_auth',
      created_at: now,
      updated_at: now
    };

    const { data, error } = await adminSupabase
      .from('hosts')
      .insert(hostDataWithHash)
      .select('id')
      .single();
    
    if (error) {
      console.error('Server action error creating host record:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error in createHostRecord:', error);
    return { 
      success: false, 
      error: { message: 'Server error creating host record' } 
    };
  }
} 