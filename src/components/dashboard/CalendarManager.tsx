'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Tag, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Property {
  id: string;
  name: string;
}

interface Availability {
  id: string;
  date: string;
  is_available: boolean;
  reason?: string | null;
}

interface CustomPrice {
  id: string;
  date: string;
  price: number;
}

interface CalendarManagerProps {
  hostId: string;
  properties: Property[];
}

const CalendarManager = ({ hostId, properties }: CalendarManagerProps) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [customPrices, setCustomPrices] = useState<CustomPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [unavailableReason, setUnavailableReason] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);
  
  useEffect(() => {
    if (selectedPropertyId) {
      fetchPropertyData();
    }
  }, [selectedPropertyId, currentMonth]);
  
  const fetchPropertyData = async () => {
    setLoading(true);
    
    try {
      // Fetch property info including base price
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('base_price')
        .eq('id', selectedPropertyId)
        .single();
      
      if (propertyError) throw propertyError;
      
      setBasePrice(propertyData.base_price);
      
      // Fetch availability for the month
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const { data: availData, error: availError } = await supabase
        .from('availability')
        .select('id, date, is_available, reason')
        .eq('property_id', selectedPropertyId)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));
      
      if (availError) throw availError;
      
      // Fetch custom prices for the month
      const { data: priceData, error: priceError } = await supabase
        .from('custom_pricing')
        .select('id, date, price')
        .eq('property_id', selectedPropertyId)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));
      
      if (priceError) throw priceError;
      
      setAvailability(availData || []);
      setCustomPrices(priceData || []);
      
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyId(e.target.value);
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Find if date has availability data
    const dateString = format(date, 'yyyy-MM-dd');
    const availabilityForDate = availability.find(a => a.date === dateString);
    const customPriceForDate = customPrices.find(p => p.date === dateString);
    
    // Set form values based on existing data
    setIsAvailable(availabilityForDate ? availabilityForDate.is_available : true);
    setUnavailableReason(availabilityForDate?.reason || '');
    setCustomPrice(customPriceForDate ? customPriceForDate.price.toString() : '');
  };
  
  const handleSaveChanges = async () => {
    if (!selectedDate || !selectedPropertyId) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    setIsUpdating(true);
    
    try {
      // Update availability
      const existingAvailability = availability.find(a => a.date === dateString);
      
      if (existingAvailability) {
        // Update existing record
        await supabase
          .from('availability')
          .update({
            is_available: isAvailable,
            reason: isAvailable ? null : unavailableReason,
          })
          .eq('id', existingAvailability.id);
      } else {
        // Insert new record
        await supabase
          .from('availability')
          .insert({
            property_id: selectedPropertyId,
            date: dateString,
            is_available: isAvailable,
            reason: isAvailable ? null : unavailableReason,
          });
      }
      
      // Update custom price if provided
      if (customPrice) {
        const priceValue = parseFloat(customPrice);
        const existingCustomPrice = customPrices.find(p => p.date === dateString);
        
        if (existingCustomPrice) {
          // Update existing price
          await supabase
            .from('custom_pricing')
            .update({ price: priceValue })
            .eq('id', existingCustomPrice.id);
        } else {
          // Insert new price
          await supabase
            .from('custom_pricing')
            .insert({
              property_id: selectedPropertyId,
              date: dateString,
              price: priceValue,
            });
        }
      } else if (!customPrice) {
        // Delete custom price if it exists and field is empty
        const existingCustomPrice = customPrices.find(p => p.date === dateString);
        if (existingCustomPrice) {
          await supabase
            .from('custom_pricing')
            .delete()
            .eq('id', existingCustomPrice.id);
        }
      }
      
      // Refresh data
      fetchPropertyData();
      toast.success('Calendar updated successfully');
      setSelectedDate(null);
      
    } catch (error) {
      console.error('Error updating calendar:', error);
      toast.error('Failed to update calendar');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const closeModal = () => {
    setSelectedDate(null);
  };
  
  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getDateStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const availData = availability.find(a => a.date === dateString);
    const priceData = customPrices.find(p => p.date === dateString);
    
    return {
      isAvailable: availData ? availData.is_available : true,
      hasCustomPrice: !!priceData,
      price: priceData ? priceData.price : basePrice,
    };
  };
  
  if (!properties.length) {
    return <div>No properties available</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-64">
            <label htmlFor="property-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Property
            </label>
            <select
              id="property-select"
              value={selectedPropertyId}
              onChange={handlePropertyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Previous month"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePreviousMonth()}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Next month"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNextMonth()}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading calendar...</p>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {daysInMonth.map((date) => {
              const { isAvailable, hasCustomPrice, price } = getDateStatus(date);
              
              return (
                <div
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    min-h-24 p-2 border border-gray-200 ${isAvailable ? 'bg-white' : 'bg-red-50'} 
                    hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors
                    rounded-md flex flex-col
                  `}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleDateClick(date)}
                >
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium">{format(date, 'd')}</span>
                  </div>
                  <div className="mt-auto">
                    {!isAvailable && (
                      <div className="flex items-center text-xs text-red-600">
                        <X size={12} className="mr-1" />
                        <span>Unavailable</span>
                      </div>
                    )}
                    {price && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Tag size={12} className="mr-1" />
                        <span className={hasCustomPrice ? 'font-medium text-blue-600' : ''}>
                          ${price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Edit modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && closeModal()}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="is-available"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-available" className="ml-2 text-sm text-gray-700">
                    Available for booking
                  </label>
                </div>
                
                {!isAvailable && (
                  <div>
                    <label htmlFor="unavailable-reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason (optional)
                    </label>
                    <input
                      type="text"
                      id="unavailable-reason"
                      value={unavailableReason}
                      onChange={(e) => setUnavailableReason(e.target.value)}
                      placeholder="e.g., Personal use, Maintenance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="custom-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Price (leave empty for default)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="custom-price"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder={basePrice?.toString() || ''}
                    className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">per night</span>
                  </div>
                </div>
                {basePrice && (
                  <p className="mt-1 text-xs text-gray-500">
                    Default price: ${basePrice}
                  </p>
                )}
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t rounded-b-lg">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager; 