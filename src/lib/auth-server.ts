import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Create a server-side Supabase client for server components
export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Get the current user from the server
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Fetch additional user data from hosts table
  const { data: hostData } = await supabase
    .from('hosts')
    .select('*')
    .eq('id', user.id)
    .single();
  
  // Check if this is an admin user
  const isAdmin = process.env.ADMIN_EMAIL === user.email;
  
  return {
    id: user.id,
    email: user.email,
    name: hostData ? `${hostData.first_name} ${hostData.last_name}` : null,
    isAdmin: Boolean(isAdmin),
  };
}

// Protect a server route/component
export async function requireAuth(adminOnly = false) {
  const user = await getServerUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (adminOnly && !user.isAdmin) {
    redirect('/dashboard');
  }
  
  return user;
} 