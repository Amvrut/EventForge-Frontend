import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Sparkles,
  Ticket,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketPassModal } from './components/TicketPassModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AcademicHub } from './components/academic/AcademicHub';
import { AuthModal } from './components/AuthModal';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { EventItem, Booking, User } from './types';
import {
  getStoredEvents,
  saveStoredEvents,
  getStoredBookings,
  saveStoredBookings,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  deleteUserAccount,
  resetToSeedData,
} from './utils/storage';
import { backendApi } from './services/backendApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'academic'>('app');
  const [currentAppView, setCurrentAppView] = useState<'catalog' | 'my-bookings' | 'admin'>('catalog');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredCurrentUser());

  // Backend connection & loading states
  const [backendStatus, setBackendStatus] = useState<{
    isOnline: boolean;
    engine?: string;
    totalEvents?: number;
  }>({ isOnline: false });
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'price-low' | 'price-high'>('date');

  // Modals
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [viewingTicketBooking, setViewingTicketBooking] = useState<Booking | null>(null);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Mobile QR scan checkout portal (when attendee scans QR with their phone camera)
  const [mobilePayParams, setMobilePayParams] = useState<{
    session: string;
    amount: string;
    inr: string;
    event: string;
  } | null>(null);
  const [mobilePayApproved, setMobilePayApproved] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'mobile_pay' && params.get('session')) {
        setMobilePayParams({
          session: params.get('session') || '',
          amount: params.get('amount') || '0.00',
          inr: params.get('inr') || '0',
          event: params.get('event') || 'Event Ticket',
        });
      }
    } catch {
      // ignore URL parsing errors
    }
  }, []);

  // Sync data from Backend API (with local storage resilience fallback)
  const syncEventsFromBackend = async () => {
    setIsLoadingEvents(true);
    try {
      const health = await backendApi.checkHealth();
      if (health.isOnline) {
        setBackendStatus({
          isOnline: true,
          engine: health.database?.engine || 'SQLite DatabaseSync',
          totalEvents: health.database?.totalEvents,
        });
        const liveEvents = await backendApi.getEvents();
        if (liveEvents && liveEvents.length > 0) {
          setEvents(liveEvents);
          saveStoredEvents(liveEvents);
          setIsLoadingEvents(false);
          return;
        }
      } else {
        setBackendStatus({ isOnline: false });
      }
    } catch (err) {
      console.warn('[App] Backend sync error, falling back to cached events:', err);
      setBackendStatus({ isOnline: false });
    }
    // Fallback to local storage cache
    setEvents(getStoredEvents());
    setIsLoadingEvents(false);
  };

  useEffect(() => {
    syncEventsFromBackend();
    setBookings(getStoredBookings());
    setCurrentUser(getStoredCurrentUser());
  }, []);

  // Save changes
  const updateEventsState = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    saveStoredEvents(newEvents);
  };

  const updateBookingsState = (newBookings: Booking[]) => {
    setBookings(newBookings);
    saveStoredBookings(newBookings);
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
    setBannerNotice(`Switched persona to ${user.name} (${user.role})`);
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
    setBannerNotice(`Logged in as ${user.name} (${user.role})`);
    setTimeout(() => setBannerNotice(null), 4000);
    if (user.role === 'admin') {
      setCurrentAppView('admin');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    saveStoredCurrentUser(null);
    setCurrentAppView('catalog');
    setBannerNotice('You have been signed out to Guest mode.');
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleConfirmDeleteAccount = (userId: string) => {
    deleteUserAccount(userId);
    setEvents(getStoredEvents());
    setBookings(getStoredBookings());
    setCurrentUser(null);
    setCurrentAppView('catalog');
    setBannerNotice('Your account and associated bookings have been permanently deleted.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Booking confirmed handler
  const handleConfirmBooking = async (newBooking: Booking) => {
    // 1. Add booking
    const updatedBookings = [newBooking, ...bookings];
    updateBookingsState(updatedBookings);

    // 2. Refresh event inventory from SQLite database to sync seat decrement!
    try {
      const freshEvents = await backendApi.getEvents();
      if (freshEvents && freshEvents.length > 0) {
        setEvents(freshEvents);
        saveStoredEvents(freshEvents);
      }
    } catch {
      // Local fallback seat decrement
      const updatedEvents = events.map((e) => {
        if (e.id === newBooking.eventId) {
          const newAvailable = Math.max(0, e.availableSeats - newBooking.quantity);
          const updatedTiers = e.tiers.map((t) => {
            if (t.id === newBooking.tierId) {
              return { ...t, available: Math.max(0, t.available - newBooking.quantity) };
            }
            return t;
          });
          return {
            ...e,
            availableSeats: newAvailable,
            tiers: updatedTiers,
          };
        }
        return e;
      });
      updateEventsState(updatedEvents);
    }

    // Close booking modal and open issued ticket pass
    setSelectedEventForBooking(null);
    setViewingTicketBooking(newBooking);
    setBannerNotice(`🎉 Ticket confirmed & verified! Reference: ${newBooking.bookingRef}`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Cancel booking handler
  const handleCancelBooking = async (bookingId: string) => {
    const bookingToCancel = bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
    if (!bookingToCancel) return;

    // Call backend API to cancel booking and restore database seat inventory
    try {
      await backendApi.cancelBooking(bookingToCancel.id);
      const freshEvents = await backendApi.getEvents();
      if (freshEvents && freshEvents.length > 0) {
        setEvents(freshEvents);
        saveStoredEvents(freshEvents);
      }
    } catch {
      // Local rollback fallback
      const updatedEvents = events.map((e) => {
        if (e.id === bookingToCancel.eventId) {
          const newAvailable = Math.min(e.totalSeats, e.availableSeats + bookingToCancel.quantity);
          const updatedTiers = e.tiers.map((t) => {
            if (t.id === bookingToCancel.tierId) {
              return { ...t, available: Math.min(t.total, t.available + bookingToCancel.quantity) };
            }
            return t;
          });
          return { ...e, availableSeats: newAvailable, tiers: updatedTiers };
        }
        return e;
      });
      updateEventsState(updatedEvents);
    }

    // Mark as cancelled
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId || b.bookingRef === bookingId) {
        return {
          ...b,
          bookingStatus: 'cancelled' as const,
          paymentStatus: 'refunded' as const,
        };
      }
      return b;
    });
    updateBookingsState(updatedBookings);

    setBannerNotice(`Reservation ${bookingToCancel.bookingRef} has been cancelled and seats restored to inventory.`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Admin Event CRUD
  const handleCreateEvent = (newEvent: EventItem) => {
    const updated = [newEvent, ...events];
    updateEventsState(updated);
    setBannerNotice(`Event "${newEvent.title}" published successfully!`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleUpdateEvent = (updatedEvent: EventItem) => {
    const updated = events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
    updateEventsState(updated);
    setBannerNotice(`Event "${updatedEvent.title}" updated.`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter((e) => e.id !== eventId);
    updateEventsState(updated);
    setBannerNotice('Event deleted from system.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Toggle Gate Check In
  const handleToggleCheckIn = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const newStatus = b.bookingStatus === 'checked_in' ? 'confirmed' : 'checked_in';
        return { ...b, bookingStatus: newStatus as any };
      }
      return b;
    });
    updateBookingsState(updated);
  };

  // Reset demo seed state
  const handleResetData = () => {
    resetToSeedData();
    setEvents(getStoredEvents());
    setBookings(getStoredBookings());
    setCurrentUser(getStoredCurrentUser());
    setBannerNotice('Database state restored to clean initial seed data.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Filtered & sorted events for catalog
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'price-low') {
      const minA = Math.min(...a.tiers.map((t) => t.price));
      const minB = Math.min(...b.tiers.map((t) => t.price));
      return minA - minB;
    }
    if (sortBy === 'price-high') {
      const maxA = Math.max(...a.tiers.map((t) => t.price));
      const maxB = Math.max(...b.tiers.map((t) => t.price));
      return maxB - maxA;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const userBookingsCount = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && b.bookingStatus === 'confirmed').length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onDeleteAccount={() => setIsDeleteModalOpen(true)}
        bookingCount={userBookingsCount}
        currentAppView={currentAppView}
        setCurrentAppView={setCurrentAppView}
        onResetData={handleResetData}
        backendOnline={backendStatus.isOnline}
      />

      {/* Floating Notice Banner */}
      {bannerNotice && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-xs font-semibold text-center sticky top-16 z-30 shadow-md flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'academic' ? (
          /* 16-Step Academic Blueprint & Code Dossier */
          <AcademicHub />
        ) : (
          /* Live Interactive Event Booking App */
          <div>
            {currentAppView === 'catalog' && (
              <div>
                {/* Hero Showcase Section */}
                <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
                  <div className="max-w-7xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Real-Time ACID Concurrency Ticketing Engine</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
                      Reserve Exclusive Seats for Premier Conferences, Summits & Concerts
                    </h1>

                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                      Instant verified QR e-ticket passes, zero race conditions, and automatic seat inventory locking powered by our 3-tier architecture.
                    </p>

                    {/* Quick Search & Filter Bar */}
                    <div className="pt-4 max-w-3xl mx-auto">
                      <div className="p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by event title, technology, city, or venue..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full sm:w-auto px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="date">Sort: Soonest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                          </select>
                        </div>
                      </div>

                      {/* Category Pills */}
                      <div className="flex items-center justify-center flex-wrap gap-1.5 mt-4">
                        {[
                          'All',
                          'Tech',
                          'Music',
                          'Workshop',
                          'Business',
                          'Sports',
                          'Cultural',
                        ].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                              selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Event Cards Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {selectedCategory === 'All' ? 'Upcoming Live Events' : `${selectedCategory} Events`}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Showing {sortedEvents.length} events with available seat quotas
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5"></span>
                        Live Seat Inventory
                      </span>
                    </div>
                  </div>

                  {sortedEvents.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
                      <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <h3 className="text-sm font-bold text-white">No Events Found</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Try clearing your search query or choosing another category.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedEvents.map((evt) => (
                        <EventCard
                          key={evt.id}
                          event={evt}
                          onSelectEvent={(e) => setSelectedEventForBooking(e)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {currentAppView === 'my-bookings' && (
              <MyBookingsView
                bookings={bookings}
                currentUser={currentUser}
                onViewTicket={(bkg) => setViewingTicketBooking(bkg)}
                onCancelBooking={handleCancelBooking}
                onBrowseEvents={() => setCurrentAppView('catalog')}
                onOpenAuth={handleOpenAuth}
                onSignOut={handleSignOut}
              />
            )}

            {currentAppView === 'admin' && (
              <AdminDashboardView
                events={events}
                bookings={bookings}
                onCreateEvent={handleCreateEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onToggleCheckIn={handleToggleCheckIn}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <EventDetailModal
          event={selectedEventForBooking}
          currentUser={currentUser}
          onClose={() => setSelectedEventForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
          onPromptLogin={() => handleOpenAuth('signin')}
        />
      )}

      {/* E-Ticket Pass Modal */}
      {viewingTicketBooking && (
        <TicketPassModal
          booking={viewingTicketBooking}
          onClose={() => setViewingTicketBooking(null)}
          onCancelBooking={(id) => {
            handleCancelBooking(id);
            setViewingTicketBooking((prev) => (prev ? { ...prev, bookingStatus: 'cancelled' } : null));
          }}
        />
      )}

      {/* Authentication Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        currentUser={currentUser}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDeleteAccount}
      />

      {/* Mobile QR Scan Checkout Screen (When phone camera scans universal QR) */}
      {mobilePayParams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-white text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Mobile QR Checkout
              </span>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {mobilePayParams.event}
              </h3>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Amount to Pay</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                ${mobilePayParams.amount} USD
              </div>
              <div className="text-xs text-indigo-300 font-mono">
                ₹{mobilePayParams.inr} INR
              </div>
            </div>

            {mobilePayApproved ? (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <div className="text-sm font-bold text-white">Payment Confirmed!</div>
                <div className="text-[11px] text-emerald-300">
                  Your payment has been approved. The primary screen has received the confirmation and issued your e-ticket pass.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(`eventforge_paid_${mobilePayParams.session}`, 'true');
                    setMobilePayApproved(true);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  Approve & Pay (${mobilePayParams.amount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.history.replaceState({}, '', window.location.pathname);
                    setMobilePayParams(null);
                  }}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Dismiss / Back to App
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">EventForge Enterprise System</span>
            <span>· Academic Capstone & Live Implementation</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('academic')}
              className="hover:text-indigo-400 transition-colors"
            >
              16-Step Blueprint
            </button>
            <button
              onClick={() => {
                setActiveTab('academic');
                // launch step 16
              }}
              className="hover:text-amber-400 transition-colors"
            >
              Viva Voce (40 Questions)
            </button>
            <button
              onClick={() => setCurrentAppView('admin')}
              className="hover:text-slate-300 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
