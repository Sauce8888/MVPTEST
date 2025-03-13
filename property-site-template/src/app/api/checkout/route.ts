import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase, PROPERTY_ID } from '@/lib/supabase';
import { formatDateForDB } from '@/utils/dates';
import { createGuestBookingConfirmationEmail, createHostBookingNotificationEmail, sendEmail } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    // Get booking data from request
    const bookingData = await request.json();
    
    // Validate required fields
    if (
      !bookingData.firstName ||
      !bookingData.lastName ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.guests ||
      !bookingData.checkInDate ||
      !bookingData.checkOutDate ||
      !bookingData.totalPrice
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', PROPERTY_ID)
      .single();
    
    if (propertyError || !property) {
      console.error('Error fetching property:', propertyError);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Create a booking record in the database
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: PROPERTY_ID,
        guest_first_name: bookingData.firstName,
        guest_last_name: bookingData.lastName,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        number_of_guests: bookingData.guests,
        check_in_date: formatDateForDB(new Date(bookingData.checkInDate)),
        check_out_date: formatDateForDB(new Date(bookingData.checkOutDate)),
        total_price: bookingData.totalPrice,
        status: 'pending',
        special_requests: bookingData.specialRequests || null,
      })
      .select()
      .single();
    
    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }
    
    // Initialize Stripe
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking for ${property.name}`,
              description: `${bookingData.checkInDate} to ${bookingData.checkOutDate}`,
            },
            unit_amount: Math.round(bookingData.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/book`,
      metadata: {
        booking_id: booking.id,
        property_id: PROPERTY_ID,
      },
    });
    
    // Update booking with Stripe session ID
    await supabase
      .from('bookings')
      .update({ stripe_payment_id: session.id })
      .eq('id', booking.id);
    
    // Return the checkout URL
    return NextResponse.json({ checkoutUrl: session.url });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}

// Handle successful payment webhook
export async function handlePaymentSuccess(sessionId: string) {
  try {
    // Get booking by Stripe session ID
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_payment_id', sessionId)
      .single();
    
    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      return false;
    }
    
    // Update booking status
    await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id);
    
    // Get property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*, hosts(email)')
      .eq('id', booking.property_id)
      .single();
    
    if (propertyError || !property) {
      console.error('Error fetching property:', propertyError);
      return false;
    }
    
    // Send confirmation email to guest
    const guestEmailContent = createGuestBookingConfirmationEmail(booking, property);
    await sendEmail(
      booking.guest_email,
      `Booking Confirmation - ${property.name}`,
      guestEmailContent
    );
    
    // Send notification email to host
    const hostEmailContent = createHostBookingNotificationEmail(booking, property);
    await sendEmail(
      property.hosts.email,
      `New Booking - ${property.name}`,
      hostEmailContent
    );
    
    // Update availability for the booked dates
    // This would be implemented in a real application
    
    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    return false;
  }
} 