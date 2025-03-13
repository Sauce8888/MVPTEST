import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Stripe client-side
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Stripe server-side
let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia', // Latest stable API version
    });
  }
  return stripeInstance;
};

// Helper function to calculate the total price
export const calculateTotalPrice = (
  basePrice: number,
  weekendPrice: number | undefined,
  cleaningFee: number | undefined,
  checkInDate: Date,
  checkOutDate: Date
): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(
    Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / oneDay)
  );

  let totalPrice = 0;
  
  // Calculate price for each day of stay
  const currentDate = new Date(checkInDate);
  
  for (let i = 0; i < diffDays; i++) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    
    if (isWeekend && weekendPrice) {
      totalPrice += weekendPrice;
    } else {
      totalPrice += basePrice;
    }
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add cleaning fee if applicable
  if (cleaningFee) {
    totalPrice += cleaningFee;
  }
  
  return totalPrice;
}; 