import { format, isWeekend, addDays, eachDayOfInterval } from 'date-fns';
import { supabase, PROPERTY_ID, CustomPricing, Availability } from '@/lib/supabase';

// Format date to display
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

// Format date for database
export const formatDateForDB = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Check if date is a weekend
export const isWeekendDate = (date: Date): boolean => {
  return isWeekend(date);
};

// Get all dates between start and end dates
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
};

// For development purposes, let's block out some mock unavailable dates
const MOCK_UNAVAILABLE_DATES: string[] = [
  '2023-12-24', '2023-12-25', '2023-12-26', // Christmas
  '2023-12-31', '2024-01-01', // New Year's
  '2024-02-14', // Valentine's Day
];

// Get custom pricing for a specific date
export const getCustomPriceForDate = async (date: Date): Promise<number | null> => {
  try {
    const formattedDate = formatDateForDB(date);
    
    // For demo purposes, just add some price variation for weekends
    if (isWeekendDate(date)) {
      return 349; // Weekend price
    }
    
    // Mock some special dates with custom pricing
    if (['2023-12-24', '2023-12-25'].includes(formattedDate)) {
      return 399; // Christmas pricing
    }
    
    return null; // No custom pricing
  } catch (error) {
    console.warn('Error getting custom price:', error);
    return null;
  }
};

// Check if a date is available
export const isDateAvailable = async (date: Date): Promise<boolean> => {
  try {
    const formattedDate = formatDateForDB(date);
    // Check against our mock unavailable dates
    return !MOCK_UNAVAILABLE_DATES.includes(formattedDate);
  } catch (error) {
    console.warn('Error checking date availability:', error);
    return true; // Default to available if error
  }
};

// Get unavailable dates for a given month
export const getUnavailableDatesForMonth = async (year: number, month: number): Promise<Date[]> => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Filter mock unavailable dates for this month
    return MOCK_UNAVAILABLE_DATES
      .filter(dateStr => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() === month - 1;
      })
      .map(dateStr => new Date(dateStr));
  } catch (error) {
    console.warn('Error getting unavailable dates for month:', error);
    return []; // Return empty array if error
  }
};

// Check if a date range is available
export const isDateRangeAvailable = async (startDate: Date, endDate: Date): Promise<boolean> => {
  try {
    const dates = getDatesInRange(startDate, endDate);
    
    for (const date of dates) {
      const isAvailable = await isDateAvailable(date);
      if (!isAvailable) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Error checking date range availability:', error);
    return true; // Default to available if error
  }
}; 