'use server';

import { revalidatePath } from 'next/cache';
import { adminSupabase } from './supabase';
import { z } from 'zod';

const clientSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

// Define return types for our actions
type FieldErrors = { [key: string]: string | string[] };
type ServerError = { message: string };

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string | ServerError | FieldErrors };

export async function createClient(formData: ClientFormData, adminId: string): Promise<ActionResult> {
  const validation = clientSchema.safeParse(formData);
  
  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.flatten().fieldErrors 
    };
  }

  const { email, first_name, last_name, phone, notes } = validation.data;
  
  // Generate a temporary password (in a real app, you might want to send this via email)
  const tempPassword = Math.random().toString(36).slice(-8);
  
  try {
    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError) {
      return { 
        success: false, 
        error: { message: authError.message }
      };
    }

    // Create client record
    const { data: clientData, error: clientError } = await adminSupabase
      .from('clients')
      .insert({
        id: authData.user.id,
        email,
        password_hash: 'hashed-in-auth-table', // We don't actually store this here in production
        first_name,
        last_name,
        phone,
        notes,
        created_by: adminId
      })
      .select()
      .single();

    if (clientError) {
      // Attempt to clean up auth user if client record creation failed
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      
      return { 
        success: false, 
        error: { message: clientError.message }
      };
    }

    revalidatePath('/admin/clients');
    return { 
      success: true, 
      data: { 
        client: clientData,
        tempPassword // In a real app, you'd want to send this securely to the user
      } 
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' }
    };
  }
}

export async function updateClient(clientId: string, formData: Partial<ClientFormData>): Promise<ActionResult> {
  // Allow partial updates with validation
  const partialSchema = clientSchema.partial();
  const validation = partialSchema.safeParse(formData);
  
  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.flatten().fieldErrors 
    };
  }

  try {
    const { data, error } = await adminSupabase
      .from('clients')
      .update(validation.data)
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      return { 
        success: false, 
        error: { message: error.message }
      };
    }

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${clientId}`);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating client:', error);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' }
    };
  }
}

export async function deleteClient(clientId: string): Promise<ActionResult> {
  try {
    // First, remove any property-client relations
    const { error: relationsError } = await adminSupabase
      .from('property_client_relations')
      .delete()
      .eq('client_id', clientId);

    if (relationsError) {
      return { 
        success: false, 
        error: { message: relationsError.message }
      };
    }

    // Then delete the client record
    const { error: clientError } = await adminSupabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (clientError) {
      return { 
        success: false, 
        error: { message: clientError.message }
      };
    }

    // Finally, delete the auth user
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(clientId);

    if (authError) {
      return { 
        success: false, 
        error: { message: authError.message }
      };
    }

    revalidatePath('/admin/clients');
    return { success: true, data: null };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' }
    };
  }
}

export async function assignPropertyToClient(propertyId: string, clientId: string, adminId: string, notes?: string): Promise<ActionResult> {
  try {
    const { data, error } = await adminSupabase
      .from('property_client_relations')
      .insert({
        property_id: propertyId,
        client_id: clientId,
        assigned_by: adminId,
        notes
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { 
          success: false, 
          error: { message: 'This property is already assigned to this client' }
        };
      }
      
      return { 
        success: false, 
        error: { message: error.message }
      };
    }

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${clientId}`);
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error) {
    console.error('Error assigning property to client:', error);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' }
    };
  }
}

export async function removePropertyFromClient(propertyId: string, clientId: string): Promise<ActionResult> {
  try {
    const { error } = await adminSupabase
      .from('property_client_relations')
      .delete()
      .eq('property_id', propertyId)
      .eq('client_id', clientId);

    if (error) {
      return { 
        success: false, 
        error: { message: error.message }
      };
    }

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${clientId}`);
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: null };
  } catch (error) {
    console.error('Error removing property from client:', error);
    return { 
      success: false, 
      error: { message: 'An unexpected error occurred' }
    };
  }
} 