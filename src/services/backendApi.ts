/**
 * ==============================================================================
 * EventForge Backend API Client Service
 * ==============================================================================
 * Connects frontend booking flow to the secure Node.js & Express backend.
 * Features:
 * - Fetches server-calculated order pricing (Never sends arbitrary amounts)
 * - Submits Razorpay signature for server-side HMAC verification
 * - Seamless fallback if the backend server is not running locally.
 * ==============================================================================
 */

import { Booking, EventItem } from '../types';

const rawApiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = String(rawApiUrl).trim().replace(/\/+$/, '');

export interface BackendOrderResponse {
  success: boolean;
  bookingRef: string;
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  isSimulation?: boolean;
  calculatedDetails: {
    unitPrice: number;
    quantity: number;
    subtotal: number;
    discount: number;
    totalAmount: number;
  };
  booking: Booking;
}

export interface BackendVerifyResponse {
  success: boolean;
  verified: boolean;
  message: string;
  booking: Booking;
}

export const backendApi = {
  /**
   * Check if the Node.js backend is reachable
   */
  async checkHealth(): Promise<{ isOnline: boolean; razorpayStatus?: any; database?: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return { isOnline: false };
      const data = await res.json();
      return { isOnline: true, razorpayStatus: data.razorpay, database: data.database };
    } catch {
      return { isOnline: false };
    }
  },

  /**
   * Fetch all events with live seat counts from the database
   */
  async getEvents(): Promise<EventItem[]> {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch events from backend (HTTP ${res.status})`);
    }
    const data = await res.json();
    if (!data.success || !Array.isArray(data.events)) {
      throw new Error('Invalid events payload received from backend');
    }
    return data.events;
  },

  /**
   * Fetch single event details with up-to-date ticket tiers
   */
  async getEventById(eventId: string): Promise<EventItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.event || null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch public Razorpay configuration (Key ID only - never secrets)
   */
  async getPublicConfig(): Promise<{ keyId: string; currency: string; isSimulation: boolean } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/config/public`, {
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Request backend to calculate price from database and create Razorpay order
   */
  async createPaymentOrder(params: {
    eventId: string;
    tierId: string;
    quantity: number;
    promoCode?: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone?: string;
    userId?: string;
  }): Promise<BackendOrderResponse> {
    const res = await fetch(`${API_BASE_URL}/bookings/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create payment order on server');
    }
    return data;
  },

  /**
   * Submit Razorpay payment signature to server for cryptographic verification and ticket issuance
   */
  async verifyPayment(params: {
    bookingRef: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<BackendVerifyResponse> {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Payment signature verification failed');
    }
    return data;
  },

  /**
   * Retrieve booking and ticket status from backend
   */
  async getBooking(bookingRef: string): Promise<Booking | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingRef}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.booking || null;
    } catch {
      return null;
    }
  },

  /**
   * Retrieve all bookings for a user from the backend
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.bookings || [];
    } catch {
      return [];
    }
  },

  /**
   * Cancel booking and restore seat inventory on backend database
   */
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message?: string; booking?: Booking; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error cancelling booking' };
    }
  },

  /**
   * Validate a ticket QR code payload or code with backend
   */
  async validateTicketQr(payloadOrCode: string): Promise<{
    success: boolean;
    valid: boolean;
    ticket?: any;
    booking?: Booking;
    event?: EventItem;
    alreadyCheckedIn?: boolean;
    checkedInAt?: string | null;
    checkedInBy?: string | null;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/validate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payloadOrCode }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, valid: false, error: err?.message || 'Network error validating ticket QR' };
    }
  },

  /**
   * Perform gate check-in and prevent duplicate entries
   */
  async checkInTicket(payloadOrCode: string, gateAgent: string = 'Gate Scanner 1'): Promise<{
    success: boolean;
    duplicate?: boolean;
    message?: string;
    ticket?: any;
    booking?: Booking;
    event?: EventItem;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payloadOrCode, gateAgent }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error checking in ticket' };
    }
  },
};

