'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, type SupabaseUser } from './supabase';
import { useRouter } from 'next/navigation';
import { createHostRecord } from './auth-actions';

interface UserData {
  id: string;
  email: string | null;
  name?: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone?: string }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Transform Supabase user into our app's user format
  const formatUser = async (supabaseUser: SupabaseUser | null): Promise<UserData | null> => {
    if (!supabaseUser) return null;

    // Fetch additional user data from hosts table
    let hostData = null;
    try {
      const { data, error } = await supabase
        .from('hosts')
        .select('first_name, last_name')
        .eq('id', supabaseUser.id)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors when no record exists
      
      if (error) {
        console.error('Error fetching host data:', error);
      } else {
        hostData = data;
      }
    } catch (err) {
      console.error('Exception fetching host data:', err);
    }

    // Check if this is an admin user
    const isAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL === supabaseUser.email;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || null,
      name: hostData ? `${hostData.first_name} ${hostData.last_name}` : null,
      isAdmin: Boolean(isAdmin),
    };
  };

  // Initial auth state check
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const formattedUser = await formatUser(session.user);
          setUser(formattedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const formattedUser = await formatUser(session.user);
        setUser(formattedUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const formattedUser = await formatUser(data.user);
        setUser(formattedUser);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; phone?: string }) => {
    try {
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Create a record in the hosts table using server action
        const result = await createHostRecord({
          id: data.user.id,
          email: data.user.email || '',
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
        });

        if (!result.success) {
          // Clean up auth user if host creation fails
          console.error('Error creating host record:', result.error);
          await supabase.auth.signOut();
          return { error: result.error };
        }

        // Add a delay to allow the database to propagate the new record
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now format the user
        const formattedUser = await formatUser(data.user);
        setUser(formattedUser);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  // Refresh user data
  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    const formattedUser = await formatUser(supabaseUser);
    setUser(formattedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 