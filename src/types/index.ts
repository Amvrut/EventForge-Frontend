export type UserRole = 'attendee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  available: number;
  total: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Tech' | 'Music' | 'Business' | 'Sports' | 'Workshop' | 'Cultural';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm AM/PM
  venue: string;
  city: string;
  imageUrl: string;
  organizer: string;
  totalSeats: number;
  availableSeats: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tiers: TicketTier[];
  featured?: boolean;
  agenda?: { time: string; activity: string }[];
}

export interface Ticket {
  id: string;
  bookingId?: string;
  bookingRef?: string;
  ticketCode: string;
  qrPayload: string;
  issuedAt?: string;
  status: string;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. EVT-2026-9481
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled' | 'checked_in';
  bookedAt: string;
  qrPayload: string;
  ticketCode?: string;
  tickets?: Ticket[];
}

export interface AcademicStep {
  stepNumber: number;
  title: string;
  shortTitle: string;
  iconName: string;
  category: 'Concept & Design' | 'Database' | 'Frontend' | 'Java Backend' | 'Business Logic' | 'Testing & Defense';
  summary: string;
  sections: {
    heading: string;
    description?: string;
    content?: string;
    codeLanguage?: string;
    codeSnippet?: string;
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export interface VivaQuestion {
  id: number;
  category: 'Core Java' | 'Servlets & JSP' | 'JDBC & Database' | 'System Design & Concurrency' | 'Web Security';
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  commonFollowUp?: string;
}

export interface PPTSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  keyHighlight: string;
  speakerNotes: string;
}
