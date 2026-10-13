import { EventItem, Booking, User, TicketTier } from '../types';
import { INITIAL_EVENTS, INITIAL_BOOKINGS, INITIAL_USERS } from '../data/initialEvents';

const STORAGE_KEYS = {
  EVENTS: 'eventforge_events_v1',
  BOOKINGS: 'eventforge_bookings_v1',
  CURRENT_USER: 'eventforge_current_user_v1',
  USERS: 'eventforge_users_v1',
};

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const registerNewUser = (user: User): { success: boolean; message?: string } => {
  const users = getStoredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const updated = [...users, user];
  saveStoredUsers(updated);
  return { success: true };
};

export const deleteUserAccount = (userId: string): { success: boolean; message: string } => {
  // 1. Remove from users list
  const users = getStoredUsers().filter((u) => u.id !== userId);
  saveStoredUsers(users);

  // 2. Clear current user if it's the deleted user
  const currentUser = getStoredCurrentUser();
  if (currentUser?.id === userId) {
    saveStoredCurrentUser(null);
  }

  // 3. Roll back seats for active confirmed bookings of this user (Foreign key ON DELETE CASCADE simulation)
  const bookings = getStoredBookings();
  const userBookings = bookings.filter((b) => b.userId === userId && b.bookingStatus === 'confirmed');

  if (userBookings.length > 0) {
    const events = getStoredEvents();
    userBookings.forEach((bkg) => {
      const evt = events.find((e) => e.id === bkg.eventId);
      if (evt) {
        evt.availableSeats = Math.min(evt.totalSeats, evt.availableSeats + bkg.quantity);
        const tier = evt.tiers.find((t) => t.id === bkg.tierId);
        if (tier) {
          tier.available = Math.min(tier.total, tier.available + bkg.quantity);
        }
      }
    });
    saveStoredEvents(events);
  }

  // 4. Remove all bookings belonging to this deleted user
  const remainingBookings = bookings.filter((b) => b.userId !== userId);
  saveStoredBookings(remainingBookings);

  return { success: true, message: 'Account and associated bookings deleted successfully.' };
};

export const getStoredEvents = (): EventItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (events: EventItem[]) => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const getStoredBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveStoredBookings = (bookings: Booking[]) => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const getStoredCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      return INITIAL_USERS[0];
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS[0];
  }
};

export const saveStoredCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const resetToSeedData = () => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
};
