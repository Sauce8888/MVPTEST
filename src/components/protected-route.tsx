'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function ProtectedRoute({ 
  children,
  adminOnly = false
}: { 
  children: React.ReactNode,
  adminOnly?: boolean
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && !user.isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router, adminOnly]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render children if authenticated (and admin if required)
  if (!user || (adminOnly && !user.isAdmin)) {
    return null;
  }

  return <>{children}</>;
} 