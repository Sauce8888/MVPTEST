import { formatDate } from './dates';
import { Property, Booking } from '@/lib/supabase';
import { Resend } from 'resend';

// Function to create a booking confirmation email for guests
export const createGuestBookingConfirmationEmail = (
  booking: Booking,
  property: Property
): string => {
  return `
    <html>
      <body>
        <h1>Booking Confirmation</h1>
        <p>Dear ${booking.guest_first_name} ${booking.guest_last_name},</p>
        <p>Thank you for booking your stay at ${property.name}!</p>
        
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Check-in:</strong> ${formatDate(new Date(booking.check_in_date))} (after ${property.check_in_time})</li>
          <li><strong>Check-out:</strong> ${formatDate(new Date(booking.check_out_date))} (before ${property.check_out_time})</li>
          <li><strong>Number of guests:</strong> ${booking.number_of_guests}</li>
          <li><strong>Total price:</strong> $${booking.total_price.toFixed(2)}</li>
        </ul>
        
        <h2>Property Details:</h2>
        <p><strong>Address:</strong> ${property.address}</p>
        <p><strong>Location:</strong> ${property.location}</p>
        
        <h2>House Rules:</h2>
        <p>${property.house_rules || 'Please treat our property with respect.'}</p>
        
        <p>If you have any questions or need to make changes to your reservation, please contact us directly.</p>
        
        <p>We look forward to hosting you!</p>
        
        <p>Best regards,<br />
        The Host</p>
      </body>
    </html>
  `;
};

// Function to create a booking notification email for hosts
export const createHostBookingNotificationEmail = (
  booking: Booking,
  property: Property
): string => {
  return `
    <html>
      <body>
        <h1>New Booking Notification</h1>
        <p>You have a new booking for ${property.name}!</p>
        
        <h2>Guest Information:</h2>
        <ul>
          <li><strong>Name:</strong> ${booking.guest_first_name} ${booking.guest_last_name}</li>
          <li><strong>Email:</strong> ${booking.guest_email}</li>
          <li><strong>Phone:</strong> ${booking.guest_phone}</li>
        </ul>
        
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Check-in:</strong> ${formatDate(new Date(booking.check_in_date))}</li>
          <li><strong>Check-out:</strong> ${formatDate(new Date(booking.check_out_date))}</li>
          <li><strong>Number of guests:</strong> ${booking.number_of_guests}</li>
          <li><strong>Total price:</strong> $${booking.total_price.toFixed(2)}</li>
        </ul>
        
        ${booking.special_requests ? `<h2>Special Requests:</h2><p>${booking.special_requests}</p>` : ''}
        
        <p>You can log in to your dashboard to manage this booking.</p>
      </body>
    </html>
  `;
};

// Send an email using Resend
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  try {
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send email
    const fromEmail = process.env.EMAIL_FROM || 'bookings@example.com';
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: htmlContent,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return false;
    }
    
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 