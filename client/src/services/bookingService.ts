const API_BASE_URL = "http://localhost:5000/api";

export interface Booking {
  id: string;
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  preferredLocation: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  preferredLocation: string;
  message: string;
  propertyId?: string;
}

export class BookingService {
  
  static async getAllBookings(): Promise<Booking[]> {
    try {
      console.log('Fetching bookings from:', `${API_BASE_URL}/bookings`);
      const response = await fetch(`${API_BASE_URL}/bookings`);
      const data = await response.json();
      console.log('Raw API response:', data);
      
      if (data.success) {
        console.log('Bookings data:', data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  static async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch booking');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  static async createBooking(bookingData: BookingFormData): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          propertyId: bookingData.propertyId || '1', // Default property ID
          status: 'pending'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async updateBooking(id: string, bookingData: Partial<BookingFormData>): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async updateBookingStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async deleteBooking(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Filter bookings by date range
  static filterBookingsByDateRange(bookings: Booking[], startDate: string, endDate: string): Booking[] {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.preferredDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return bookingDate >= start && bookingDate <= end;
    });
  }

  // Filter bookings by status
  static filterBookingsByStatus(bookings: Booking[], status: string): Booking[] {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  }

  // Get bookings for a specific date
  static getBookingsForDate(bookings: Booking[], date: string): Booking[] {
    return bookings.filter(booking => booking.preferredDate === date);
  }

  // Get upcoming bookings (next 7 days)
  static getUpcomingBookings(bookings: Booking[]): Booking[] {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.preferredDate);
      return bookingDate >= today && bookingDate <= nextWeek && booking.status !== 'cancelled';
    });
  }
}
