import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase';
import Link from 'next/link';

import CalendarManager from '@/components/dashboard/CalendarManager';

async function getHostProperties(hostId: string) {
  const { data: properties, error } = await adminSupabase
    .from('properties')
    .select('id, name')
    .eq('host_id', hostId)
    .order('name');
  
  if (error) {
    console.error('Error fetching host properties:', error);
    return [];
  }
  
  return properties || [];
}

export default async function CalendarPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.isAdmin) {
    redirect('/admin');
  }
  
  const properties = await getHostProperties(user.id);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
        <p className="text-gray-600">Manage availability and pricing for your properties</p>
      </div>
      
      {properties.length > 0 ? (
        <CalendarManager hostId={user.id} properties={properties} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">No properties found</h2>
          <p className="text-gray-600 mb-4">
            You don't have any properties set up yet. Contact the administrator to add your property.
          </p>
        </div>
      )}
    </div>
  );
} 