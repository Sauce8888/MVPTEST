'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Client, Property, PropertyClientRelation } from '@/lib/supabase';
import { assignPropertyToClient, removePropertyFromClient } from '@/lib/client-actions';

interface ClientWithProperties extends Client {
  properties?: Property[];
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [client, setClient] = useState<ClientWithProperties | null>(null);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientAndProperties = async () => {
      try {
        setIsLoading(true);
        
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', params.id)
          .single();
            
        if (clientError) throw clientError;
        
        if (!clientData) {
          router.push('/admin/clients');
          return;
        }

        // Fetch property-client relations for this client
        const { data: relationsData, error: relationsError } = await supabase
          .from('property_client_relations')
          .select('*, property:property_id(*)')
          .eq('client_id', params.id);
            
        if (relationsError) throw relationsError;
        
        // Extract properties from relations
        const properties = relationsData?.map((relation: any) => relation.property) as Property[] || [];
        
        // Fetch all properties for assignment dropdown
        const { data: allPropertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*');
            
        if (propertiesError) throw propertiesError;
        
        // Filter out properties that are already assigned to this client
        const assignedPropertyIds = new Set(properties.map(p => p.id));
        const unassignedProperties = allPropertiesData?.filter(
          (property: Property) => !assignedPropertyIds.has(property.id)
        ) || [];
        
        setClient({ ...clientData, properties });
        setAvailableProperties(unassignedProperties);
        
        if (unassignedProperties.length > 0) {
          setSelectedPropertyId(unassignedProperties[0].id);
        }
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.isAdmin) {
      fetchClientAndProperties();
    }
  }, [user, params.id, router]);

  const handleAssignProperty = async () => {
    if (!selectedPropertyId) {
      setAssignmentError('Please select a property to assign.');
      return;
    }

    if (!user?.id) {
      setAssignmentError('You must be logged in to assign properties.');
      return;
    }

    setIsAssigning(true);
    setAssignmentError(null);
    setAssignmentSuccess(null);

    try {
      const result = await assignPropertyToClient(selectedPropertyId, params.id, user.id);

      if (!result.success) {
        if (typeof result.error === 'string') {
          setAssignmentError(result.error);
        } else if (typeof result.error === 'object' && result.error !== null) {
          if ('message' in result.error) {
            // It's a server error with a message
            setAssignmentError((result.error as { message: string }).message);
          } else {
            // It's field validation errors
            setAssignmentError('Failed to assign property. Please try again.');
          }
        } else {
          setAssignmentError('Failed to assign property. Please try again.');
        }
        return;
      }

      // Refetch client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.id)
        .single();
      
      const { data: relationsData } = await supabase
        .from('property_client_relations')
        .select('*, property:property_id(*)')
        .eq('client_id', params.id);
        
      // Extract properties from relations
      const properties = relationsData?.map((relation: any) => relation.property) as Property[] || [];
      
      // Update available properties
      const { data: allPropertiesData } = await supabase
        .from('properties')
        .select('*');
        
      const assignedPropertyIds = new Set(properties.map(p => p.id));
      const unassignedProperties = allPropertiesData?.filter(
        (property: Property) => !assignedPropertyIds.has(property.id)
      ) || [];
      
      setClient({ ...clientData, properties });
      setAvailableProperties(unassignedProperties);
      
      if (unassignedProperties.length > 0) {
        setSelectedPropertyId(unassignedProperties[0].id);
      } else {
        setSelectedPropertyId('');
      }

      setAssignmentSuccess('Property assigned successfully!');
    } catch (err) {
      console.error('Error assigning property:', err);
      setAssignmentError('An unexpected error occurred. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveProperty = async (propertyId: string) => {
    if (!user?.id) {
      setError('You must be logged in to remove properties.');
      return;
    }

    setIsRemoving(true);
    setError(null);

    try {
      const result = await removePropertyFromClient(propertyId, params.id);

      if (!result.success) {
        if (typeof result.error === 'string') {
          setError(result.error);
        } else if (typeof result.error === 'object' && result.error !== null) {
          if ('message' in result.error) {
            // It's a server error with a message
            setError((result.error as { message: string }).message);
          } else {
            // It's field validation errors
            setError('Failed to remove property. Please try again.');
          }
        } else {
          setError('Failed to remove property. Please try again.');
        }
        return;
      }

      // Refetch client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.id)
        .single();
      
      const { data: relationsData } = await supabase
        .from('property_client_relations')
        .select('*, property:property_id(*)')
        .eq('client_id', params.id);
        
      // Extract properties from relations
      const properties = relationsData?.map((relation: any) => relation.property) as Property[] || [];
      
      // Update available properties
      const { data: allPropertiesData } = await supabase
        .from('properties')
        .select('*');
        
      const assignedPropertyIds = new Set(properties.map(p => p.id));
      const unassignedProperties = allPropertiesData?.filter(
        (property: Property) => !assignedPropertyIds.has(property.id)
      ) || [];
      
      setClient({ ...clientData, properties });
      setAvailableProperties(unassignedProperties);
      
      if (unassignedProperties.length > 0) {
        setSelectedPropertyId(unassignedProperties[0].id);
      } else {
        setSelectedPropertyId('');
      }
    } catch (err) {
      console.error('Error removing property:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <p className="text-gray-500">Client not found.</p>
        <Link 
          href="/admin/clients" 
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
        <Link
          href="/admin/clients"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Clients
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Client Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              {client.first_name} {client.last_name}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{client.email}</p>
          </div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {client.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.first_name} {client.last_name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.phone || 'Not provided'}
              </dd>
            </div>
            {client.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {client.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Property Assignment */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Assigned Properties</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Properties this client can access in their dashboard
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {assignmentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {assignmentError}
            </div>
          )}
          
          {assignmentSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {assignmentSuccess}
            </div>
          )}
          
          {availableProperties.length > 0 ? (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
                  Property to assign
                </label>
                <select
                  id="property"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                >
                  {availableProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAssignProperty}
                disabled={isAssigning || !selectedPropertyId}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning ? 'Assigning...' : 'Assign Property'}
              </button>
            </div>
          ) : (
            <p className="mb-4 text-sm text-gray-500 italic">
              No more properties available to assign.
            </p>
          )}
          
          {(!client.properties || client.properties.length === 0) ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500 mb-2">No properties assigned to this client yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {property.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {property.location}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveProperty(property.id)}
                          disabled={isRemoving}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 