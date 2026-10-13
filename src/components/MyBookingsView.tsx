import React, { useState } from 'react';
import { Calendar, MapPin, QrCode, Ban, Printer, Sparkles, LogOut } from 'lucide-react';
import { Booking, User } from '../types';

interface MyBookingsViewProps {
  bookings: Booking[];
  currentUser: User | null;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onBrowseEvents: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onSignOut?: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  currentUser,
  onViewTicket,
  onCancelBooking,
  onBrowseEvents,
  onOpenAuth,
  onSignOut,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  // Filter bookings for current user (or show all if guest/admin)
  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id)
    : bookings;

  const filtered = userBookings.filter((b) => {
    if (filter === 'all') return true;
    return b.bookingStatus === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>My Event Passes</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {userBookings.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser
              ? `Access, view, download or cancel your digital entry passes for ${currentUser.name}`
              : 'Viewing passes in guest mode. Sign in to link bookings directly to your verified account.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(['all', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Logged in Account Banner with explicit Logout button */}
      {currentUser && onSignOut && (
        <div className="mb-6 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition-colors flex items-center space-x-1.5"
            title="Log out of this account"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Bookings List or Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No Bookings Found in This View
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            You don't have any {filter !== 'all' ? filter : ''} bookings registered right now. Discover exciting live events and book your seats!
          </p>
          <button
            onClick={onBrowseEvents}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors inline-flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Upcoming Events</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            return (
              <div
                key={booking.id}
                className={`p-5 rounded-xl border transition-all ${
                  isCancelled
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block mb-0.5">
                      REF: {booking.bookingRef}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {booking.eventTitle}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border capitalize shrink-0 ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : booking.bookingStatus === 'checked_in'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {booking.bookingStatus === 'checked_in'
                      ? 'Checked In'
                      : booking.bookingStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center text-slate-300">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
                    <span>{booking.eventDate}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
                    <span className="truncate">{booking.eventVenue}</span>
                  </div>
                </div>

                {/* Ticket Details Strip */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Pass Type
                    </span>
                    <span className="font-semibold text-indigo-300">
                      {booking.tierName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Quantity
                    </span>
                    <span className="font-bold text-white font-mono">
                      {booking.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Total Paid
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${booking.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewTicket(booking)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass / QR</span>
                    </button>
                    <button
                      onClick={() => onViewTicket(booking)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Print Pass"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => setBookingToCancel(booking)}
                      className="text-xs text-rose-400 hover:text-white hover:bg-rose-600 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors font-medium border border-rose-900/50"
                      title="Cancel reservation & release tickets"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Pass</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Cancel Confirmation Modal (No window.confirm!) */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mx-auto">
              <Ban className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                Cancel Ticket Reservation?
              </h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to cancel pass <strong className="text-indigo-400 font-mono">{bookingToCancel.bookingRef}</strong>?
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{bookingToCancel.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tickets Released:</span>
                <span className="font-mono text-amber-400 font-semibold">{bookingToCancel.quantity} Seat(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="font-mono text-emerald-400 font-bold">${bookingToCancel.totalAmount} (Full Refund)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Your seats will be immediately returned to the event's available inventory for other attendees to book.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Keep My Pass
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = bookingToCancel.id;
                  setBookingToCancel(null);
                  onCancelBooking(id);
                }}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Yes, Cancel & Restock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
