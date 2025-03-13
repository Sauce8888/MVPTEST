import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase';
import { Home, CreditCard, Users, Activity } from 'lucide-react';
import Link from 'next/link';

interface DashboardMetric {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color: string;
}

async function getAdminDashboardData() {
  // Get counts of entities
  const { count: hostCount, error: hostError } = await adminSupabase
    .from('hosts')
    .select('*', { count: 'exact', head: true });
  
  const { count: propertyCount, error: propertyError } = await adminSupabase
    .from('properties')
    .select('*', { count: 'exact', head: true });
  
  const { count: bookingCount, error: bookingError } = await adminSupabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  
  // Get recent hosts
  const { data: recentHosts, error: recentHostsError } = await adminSupabase
    .from('hosts')
    .select('id, email, first_name, last_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  
  // Get recent properties
  const { data: recentProperties, error: recentPropertiesError } = await adminSupabase
    .from('properties')
    .select(`
      id, 
      name, 
      location, 
      created_at,
      hosts(id, first_name, last_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (hostError || propertyError || bookingError || recentHostsError || recentPropertiesError) {
    console.error('Error fetching admin dashboard data:', 
      hostError || propertyError || bookingError || recentHostsError || recentPropertiesError);
  }
  
  return {
    hostCount: hostCount || 0,
    propertyCount: propertyCount || 0,
    bookingCount: bookingCount || 0,
    recentHosts: recentHosts || [],
    recentProperties: recentProperties || []
  };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (!user.isAdmin) {
    redirect('/host');
  }
  
  const { hostCount, propertyCount, bookingCount, recentHosts, recentProperties } = 
    await getAdminDashboardData();
  
  // Calculate a simple estimated revenue - just for display purposes
  const estimatedRevenue = bookingCount * 50; // $50 avg commission per booking
  
  const metrics: DashboardMetric[] = [
    {
      title: 'Hosts',
      value: hostCount,
      description: 'Total registered hosts',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Properties',
      value: propertyCount,
      description: 'Total properties listed',
      icon: Home,
      color: 'bg-green-500',
    },
    {
      title: 'Bookings',
      value: bookingCount,
      description: 'Total bookings made',
      icon: CreditCard,
      color: 'bg-amber-500',
    },
    {
      title: 'Est. Revenue',
      value: `$${estimatedRevenue.toLocaleString()}`,
      description: 'Based on avg. commission',
      icon: Activity,
      color: 'bg-purple-500',
    },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </div>
              <div className={`${metric.color} h-12 w-12 rounded-full flex items-center justify-center text-white`}>
                <metric.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hosts */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Recent Hosts</h2>
              <p className="text-sm text-gray-500">Latest host registrations</p>
            </div>
            <Link href="/admin/hosts" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {recentHosts && recentHosts.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Host</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Joined</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                  {recentHosts.map((host: any) => (
                    <tr key={host.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {host.first_name} {host.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {host.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(host.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/hosts/${host.id}`}
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
                No hosts found
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Recent Properties</h2>
              <p className="text-sm text-gray-500">Latest property listings</p>
            </div>
            <Link href="/admin/properties" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {recentProperties && recentProperties.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Property</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Host</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                  {recentProperties.map((property: any) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {property.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {property.hosts?.first_name} {property.hosts?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/properties/${property.id}`}
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
                No properties found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 