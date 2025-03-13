"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, differenceInDays, isAfter, isBefore } from 'date-fns';
import { Property } from '@/lib/supabase';
import { calculateTotalPrice } from '@/lib/stripe';
import { isDateAvailable, isDateRangeAvailable } from '@/utils/dates';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Form validation schema
const bookingSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  guests: z.number().int().min(1).max(10),
  specialRequests: z.string().optional(),
  acceptTerms: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  property: Property;
}

const BookingForm = ({ property }: BookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [datesAvailable, setDatesAvailable] = useState<boolean | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      guests: 1,
      specialRequests: '',
      acceptTerms: false,
    }
  });

  // Calculate total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const price = calculateTotalPrice(
        property.base_price,
        property.weekend_price,
        property.cleaning_fee,
        checkInDate,
        checkOutDate
      );
      setTotalPrice(price);
    } else {
      setTotalPrice(null);
    }
  }, [checkInDate, checkOutDate, property]);

  // Check if selected dates are available
  useEffect(() => {
    const checkAvailability = async () => {
      if (checkInDate && checkOutDate) {
        setIsCheckingAvailability(true);
        try {
          const available = await isDateRangeAvailable(checkInDate, checkOutDate);
          setDatesAvailable(available);
        } catch (error) {
          console.error('Error checking availability:', error);
          setDatesAvailable(null);
        } finally {
          setIsCheckingAvailability(false);
        }
      } else {
        setDatesAvailable(null);
      }
    };

    checkAvailability();
  }, [checkInDate, checkOutDate]);

  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    if (date && checkOutDate && isAfter(date, checkOutDate)) {
      setCheckOutDate(addDays(date, 1));
    }
  };

  const handleCheckOutChange = (date: Date | null) => {
    if (date && checkInDate && isBefore(date, checkInDate)) {
      return;
    }
    setCheckOutDate(date);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!datesAvailable) {
      toast.error('Selected dates are not available');
      return;
    }

    const numberOfNights = differenceInDays(checkOutDate, checkInDate);
    if (numberOfNights < property.minimum_nights) {
      toast.error(`Minimum stay is ${property.minimum_nights} nights`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the booking to our API endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          guests: data.guests,
          checkInDate: checkInDate?.toISOString(),
          checkOutDate: checkOutDate?.toISOString(),
          totalPrice: totalPrice || 0,
          specialRequests: data.specialRequests,
        }),
      });

      // Parse the response
      const responseData = await response.json();

      // Check if the request failed
      if (!response.ok) {
        console.error('API response error:', responseData);
        throw new Error(responseData.error || `Failed with status: ${response.status}`);
      }

      // Check for checkout URL
      if (!responseData.checkoutUrl) {
        throw new Error('No checkout URL returned from the server');
      }
      
      toast.success('Booking submitted! Redirecting to payment...');
      
      // Redirect to Stripe checkout
      window.location.href = responseData.checkoutUrl;
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Show a more detailed error message
      let errorMessage = 'An error occurred while processing your booking';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <ReactDatePicker
              selected={checkInDate}
              onChange={handleCheckInChange}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date()}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholderText="Select check-in date"
              dateFormat="MMMM d, yyyy"
              required
              aria-label="Select check-in date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <ReactDatePicker
              selected={checkOutDate}
              onChange={handleCheckOutChange}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate ? addDays(checkInDate, property.minimum_nights - 1) : new Date()}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholderText="Select check-out date"
              dateFormat="MMMM d, yyyy"
              required
              aria-label="Select check-out date"
              disabled={!checkInDate}
            />
          </div>
        </div>
        
        {/* Availability Status */}
        {isCheckingAvailability && (
          <div className="text-gray-600 text-sm">Checking availability...</div>
        )}
        
        {datesAvailable === false && (
          <div className="text-red-600 text-sm">
            Sorry, these dates are not available. Please select different dates.
          </div>
        )}
        
        {datesAvailable === true && (
          <div className="text-green-600 text-sm">
            These dates are available! Proceed with your booking.
          </div>
        )}
        
        {/* Price Calculation */}
        {totalPrice && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-xl font-semibold text-gray-900">
              Total: ${totalPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              {checkInDate && checkOutDate ? (
                <span>
                  {differenceInDays(checkOutDate, checkInDate)} nights at ${property.base_price}/night
                  {property.cleaning_fee ? ` + $${property.cleaning_fee} cleaning fee` : ''}
                </span>
              ) : null}
            </div>
          </div>
        )}
        
        {/* Guest Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              id="firstName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('firstName')}
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            {errors.firstName && (
              <span className="text-red-600 text-sm">{errors.firstName.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('lastName')}
              aria-invalid={errors.lastName ? "true" : "false"}
            />
            {errors.lastName && (
              <span className="text-red-600 text-sm">{errors.lastName.message}</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('email')}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('phone')}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <span className="text-red-600 text-sm">{errors.phone.message}</span>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <select
            id="guests"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('guests', { valueAsNumber: true })}
            aria-invalid={errors.guests ? "true" : "false"}
          >
            {[...Array(property.max_guests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
          {errors.guests && (
            <span className="text-red-600 text-sm">{errors.guests.message}</span>
          )}
        </div>
        
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
          <textarea
            id="specialRequests"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('specialRequests')}
            aria-invalid={errors.specialRequests ? "true" : "false"}
          ></textarea>
          {errors.specialRequests && (
            <span className="text-red-600 text-sm">{errors.specialRequests.message}</span>
          )}
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              type="checkbox"
              className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              {...register('acceptTerms')}
              aria-invalid={errors.acceptTerms ? "true" : "false"}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="font-medium text-gray-700">
              I agree to the terms and conditions
            </label>
            {errors.acceptTerms && (
              <p className="text-red-600">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || isCheckingAvailability || datesAvailable === false || !checkInDate || !checkOutDate}
        >
          {isSubmitting ? 'Processing...' : 'Book Now'}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm; 