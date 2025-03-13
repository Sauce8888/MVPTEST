import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase';
import { CalendarRange, CreditCard, Home, Users } from 'lucide-react';
import Link from 'next/link';

interface DashboardCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color: string;
}

async function getHostDashboardData(hostId: string) {
  // Get host's properties
  const { data: properties, error: propError } = await adminSupabase
    .from('properties')
    .select('id, name')
    .eq('host_id', hostId);
  
  if (propError) {
    console.error('Error fetching properties:', propError);
    return {
      properties: [],
      totalBookings: 0,
      pendingBookings: 0,
      upcomingBookings: []
    };
  }
  
  // If no properties, return empty data
  if (!properties || properties.length === 0) {
    return {
      properties: [],
      totalBookings: 0,
      pendingBookings: 0,
      upcomingBookings: []
    };
  }
  
  const propertyIds = properties.map(p => p.id);
  
  // Get total bookings
  const { count: totalBookings, error: countError } = await adminSupabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .in('property_id', propertyIds);
  
  // Get pending bookings
  const { count: pendingBookings, error: pendingError } = await adminSupabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .in('property_id', propertyIds)
    .eq('status', 'pending');
  
  // Get upcoming bookings (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const { data: upcomingBookings, error: upcomingError } = await adminSupabase
    .from('bookings')
    .select(`
      id,
      property_id,
      guest_first_name,
      guest_last_name,
      check_in_date,
      check_out_date,
      status,
      properties(name)
    `)
    .in('property_id', propertyIds)
    .gte('check_in_date', today.toISOString().split('T')[0])
    .lte('check_in_date', nextWeek.toISOString().split('T')[0])
    .order('check_in_date', { ascending: true });
  
  if (countError || pendingError || upcomingError) {
    console.error('Error fetching booking data:', countError || pendingError || upcomingError);
  }
  
  return {
    properties: properties || [],
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    upcomingBookings: upcomingBookings || []
  };
}

export default async function HostDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.isAdmin) {
    redirect('/admin');
  }
  
  const { properties, totalBookings, pendingBookings, upcomingBookings } = 
    await getHostDashboardData(user.id);
  
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Properties',
      value: properties.length,
      description: 'Total properties managed',
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      title: 'Bookings',
      value: totalBookings,
      description: 'Total bookings received',
      icon: CalendarRange,
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      description: 'Bookings awaiting confirmation',
      icon: CreditCard,
      color: 'bg-amber-500',
    },
    {
      title: 'Guests',
      value: totalBookings, // Simplification - using booking count as guest count
      description: 'Total guests hosted',
      icon: Users,
      color: 'bg-purple-500',
    },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0]}</h1>
        <p className="text-gray-600">Here's what's happening with your properties</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${card.color} h-12 w-12 rounded-full flex items-center justify-center text-white`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Check-ins</h2>
          <p className="text-sm text-gray-500">Guests arriving in the next 7 days</p>
        </div>
        
        <div className="overflow-x-auto">
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Guest</th>
                  <th className="px-6 py-3 text-left">Property</th>
                  <th className="px-6 py-3 text-left">Check-in</th>
                  <th className="px-6 py-3 text-left">Check-out</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                {upcomingBookings.map((booking: any) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.guest_first_name} {booking.guest_last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.properties?.name || 'Unknown property'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/host/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No upcoming check-ins in the next 7 days
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 