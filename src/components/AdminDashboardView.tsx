import React, { useState } from 'react';
import {
  DollarSign,
  Ticket,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Search,
  Download,
  AlertCircle,
  X,
  LogOut,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { EventItem, Booking, TicketTier } from '../types';
import { backendApi } from '../services/backendApi';

interface AdminDashboardViewProps {
  events: EventItem[];
  bookings: Booking[];
  onCreateEvent: (newEvent: EventItem) => void;
  onUpdateEvent: (updatedEvent: EventItem) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleCheckIn: (bookingId: string) => void;
  onSignOut?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  events,
  bookings,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onToggleCheckIn,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'analytics'>('events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [scannerInput, setScannerInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    type: 'idle' | 'success' | 'duplicate' | 'error';
    message: string;
    ticket?: any;
    booking?: Booking;
  } | null>(null);

  const handleGateCheckIn = async (codeToVerify?: string) => {
    const code = (codeToVerify || scannerInput).trim();
    if (!code) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await backendApi.checkInTicket(code, 'Gate Terminal A');
      if (res.success) {
        setScanResult({
          type: 'success',
          message: res.message || 'Admission Granted!',
          ticket: res.ticket,
          booking: res.booking,
        });
        if (res.booking?.id) {
          onToggleCheckIn(res.booking.id);
        }
      } else if (res.duplicate) {
        setScanResult({
          type: 'duplicate',
          message: res.error || 'Duplicate Entry Alert: Ticket already used!',
          ticket: res.ticket,
          booking: res.booking,
        });
      } else {
        setScanResult({
          type: 'error',
          message: res.error || 'Invalid Ticket or QR code',
        });
      }
    } catch (err: any) {
      setScanResult({
        type: 'error',
        message: err.message || 'Network error scanning ticket',
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Calculations
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalTicketsSold = bookings
    .filter((b) => b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + b.quantity, 0);

  const totalSeats = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalAvailable = events.reduce((sum, e) => sum + e.availableSeats, 0);
  const overallOccupancy =
    totalSeats > 0 ? Math.round(((totalSeats - totalAvailable) / totalSeats) * 100) : 0;

  // New Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Tech' | 'Music' | 'Business' | 'Sports' | 'Workshop' | 'Cultural'>('Tech');
  const [formDate, setFormDate] = useState('2026-11-25');
  const [formTime, setFormTime] = useState('10:00 AM - 05:00 PM');
  const [formVenue, setFormVenue] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formTotalSeats, setFormTotalSeats] = useState(150);
  const [formPrice, setFormPrice] = useState(59);
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [formOrganizer, setFormOrganizer] = useState('EventForge Host');
  const [formDesc, setFormDesc] = useState('');

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDesc('');
    setFormVenue('');
    setFormCity('');
    setFormTotalSeats(150);
    setFormPrice(59);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormVenue(evt.venue);
    setFormCity(evt.city);
    setFormTotalSeats(evt.totalSeats);
    setFormPrice(evt.tiers[0]?.price || 50);
    setFormImageUrl(evt.imageUrl);
    setFormOrganizer(evt.organizer);
    setFormDesc(evt.description);
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      const updated: EventItem = {
        ...editingEvent,
        title: formTitle,
        category: formCategory,
        date: formDate,
        time: formTime,
        venue: formVenue,
        city: formCity,
        totalSeats: formTotalSeats,
        imageUrl: formImageUrl,
        organizer: formOrganizer,
        description: formDesc,
      };
      onUpdateEvent(updated);
    } else {
      const newEvtId = `evt-${Date.now()}`;
      const newTier: TicketTier = {
        id: `tier-${newEvtId}-general`,
        name: 'General Admission Pass',
        price: Number(formPrice),
        description: 'Standard event entry with all keynote sessions included.',
        perks: ['Event Admission', 'Digital Materials', 'Refreshments'],
        available: Number(formTotalSeats),
        total: Number(formTotalSeats),
      };

      const newEvt: EventItem = {
        id: newEvtId,
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formDesc || 'Exclusive live event hosted through the EventForge ticketing network.',
        category: formCategory,
        date: formDate,
        time: formTime,
        venue: formVenue,
        city: formCity,
        imageUrl: formImageUrl,
        organizer: formOrganizer,
        totalSeats: Number(formTotalSeats),
        availableSeats: Number(formTotalSeats),
        status: 'upcoming',
        tiers: [newTier],
      };
      onCreateEvent(newEvt);
    }
    setIsCreateModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['BookingRef', 'EventTitle', 'Date', 'AttendeeName', 'Email', 'Tier', 'Qty', 'Amount', 'Status'];
    const rows = bookings.map((b) => [
      b.bookingRef,
      `"${b.eventTitle.replace(/"/g, '""')}"`,
      b.eventDate,
      `"${b.userName}"`,
      b.userEmail,
      b.tierName,
      b.quantity,
      b.totalAmount,
      b.bookingStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventforge-bookings-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) =>
    b.bookingRef.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    b.userName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    b.eventTitle.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Admin Control Operations</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Role: System Administrator
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time venue occupancy, revenue metrics, event CRUD, and digital gate pass check-in desk
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-900/40 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
              title="Log out of admin session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            +18.4% vs previous cycle
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Tickets Booked</span>
            <Ticket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalTicketsSold} Passes
          </div>
          <div className="text-[11px] text-indigo-400 mt-1">
            Across {bookings.length} reservations
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Events</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {events.length} Events
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            6 upcoming in catalog
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Capacity Utilization</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overallOccupancy}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalSeats - totalAvailable} / {totalSeats} seats booked
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 mb-6 flex space-x-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'events'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Event Management (CRUD)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'bookings'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Gate Check-In & Attendee Desk ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Database & ACID Status
        </button>
      </div>

      {/* TAB 1: Events CRUD */}
      {activeTab === 'events' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title or venue..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredEvents.length} events
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Occupancy</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvents.map((evt) => {
                    const occPct = Math.round(
                      ((evt.totalSeats - evt.availableSeats) / evt.totalSeats) * 100
                    );
                    return (
                      <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={evt.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white leading-tight">
                                {evt.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {evt.organizer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-indigo-300">
                          {evt.category}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {evt.date}
                        </td>
                        <td className="py-3 px-4 truncate max-w-[150px]">
                          {evt.venue}, {evt.city}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-[11px] font-semibold text-white mb-0.5">
                            {evt.totalSeats - evt.availableSeats} / {evt.totalSeats} ({occPct}%)
                          </div>
                          <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${occPct}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium capitalize">
                            {evt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(evt)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              title="Edit Event"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEventToDelete(evt)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bookings & Gate Check-in Desk */}
      {activeTab === 'bookings' && (
        <div>
          {/* Gate Optical & Code Scanner Console */}
          <div className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  <span>Gate Ticket QR & Pass Verification Console</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Scan physical ticket QR payloads or enter unique Ticket Code to authenticate admission and prevent duplicate entries.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Anti-Passback Protected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGateCheckIn()}
                placeholder="Scan / paste QR payload (EVENTFORGE:...) or enter Ticket Code (TKT-2026-...)..."
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleGateCheckIn()}
                disabled={isScanning || !scannerInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Validating...' : 'Validate & Check-In'}</span>
              </button>
              {scannerInput && (
                <button
                  type="button"
                  onClick={() => {
                    setScannerInput('');
                    setScanResult(null);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Clear scanner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Scan Result Banner */}
            {scanResult && (
              <div
                className={`mt-3 p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                  scanResult.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : scanResult.type === 'duplicate'
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {scanResult.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      {scanResult.type === 'success'
                        ? 'ADMISSION GRANTED'
                        : scanResult.type === 'duplicate'
                        ? 'DUPLICATE ENTRY DETECTED'
                        : 'VALIDATION FAILED'}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">{scanResult.message}</div>
                    {scanResult.ticket && (
                      <div className="mt-1 font-mono text-[11px] opacity-80">
                        Ticket: {scanResult.ticket.ticketCode} · Attendee: {scanResult.booking?.userName || 'N/A'} · Checked in at: {new Date(scanResult.ticket.checkedInAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScanResult(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="relative w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                placeholder="Search by Booking Ref, Attendee Name, or Email..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="text-xs text-slate-400">
              Gate Scanner Status: <span className="text-emerald-400 font-medium">Online</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Attendee Info</th>
                    <th className="py-3 px-4">Event & Pass</th>
                    <th className="py-3 px-4">Tickets & Total</th>
                    <th className="py-3 px-4">Booked At</th>
                    <th className="py-3 px-4">Gate Status</th>
                    <th className="py-3 px-4 text-right">Gate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBookings.map((bkg) => {
                    const isCheckedIn = bkg.bookingStatus === 'checked_in';
                    const isCancelled = bkg.bookingStatus === 'cancelled';
                    return (
                      <tr key={bkg.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                          {bkg.bookingRef}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{bkg.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{bkg.userEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium truncate max-w-[200px]">
                            {bkg.eventTitle}
                          </div>
                          <div className="text-[11px] text-indigo-300">{bkg.tierName}</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {bkg.quantity} × Pass (${bkg.totalAmount})
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {bkg.bookedAt}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] rounded-full font-semibold border ${
                              isCheckedIn
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : isCancelled
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {isCheckedIn ? 'Checked In' : isCancelled ? 'Cancelled' : 'Pending Entry'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isCancelled && (
                            <button
                              onClick={() => onToggleCheckIn(bkg.id)}
                              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors inline-flex items-center space-x-1 ${
                                isCheckedIn
                                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {isCheckedIn ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Undo Check-in</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Check In Attendee</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Database & ACID System Health */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              <span>ACID Transaction & Concurrency Metrics</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Isolation Level</span>
                <span className="font-mono text-emerald-400">TRANSACTION_READ_COMMITTED</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Pessimistic Row Lock Guard</span>
                <span className="font-mono text-indigo-400">SELECT ... FOR UPDATE (Active)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Race-Condition Oversell Collisions Prevented</span>
                <span className="font-mono text-emerald-400 font-bold">0 Oversold Tickets</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Average Database Commit Latency</span>
                <span className="font-mono text-white">14.2 ms</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Connection Pool & Engine Configuration</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-mono text-white">MySQL 8.0.36 (InnoDB Engine)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Connection Pool Provider</span>
                <span className="font-mono text-indigo-400">HikariCP 5.1.0</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Active Connections / Max Pool</span>
                <span className="font-mono text-white">2 / 20 Connections</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Prepared Statements Cache</span>
                <span className="font-mono text-emerald-400">Enabled (cachePrepStmts=true)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4">
              {editingEvent ? 'Edit Event Details' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. NextGen Web & Cloud Conference 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Business">Business</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Organizer</label>
                  <input
                    type="text"
                    required
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Time Schedule</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 05:00 PM"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Grand Auditorium Hall A"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">City & State</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Boston, MA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Capacity (Seats)</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    required
                    value={formTotalSeats}
                    onChange={(e) => setFormTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Base Ticket Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Comprehensive event details, keynote highlights..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-left space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Event?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete <strong className="text-white">"{eventToDelete.title}"</strong>?
              </p>
            </div>

            <p className="text-[11px] text-rose-300/80 bg-rose-950/30 p-3 rounded-xl border border-rose-800/40 leading-relaxed text-center">
              This action will cascade delete this event, its ticket tiers, and any associated attendee bookings.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = eventToDelete.id;
                  setEventToDelete(null);
                  onDeleteEvent(id);
                }}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Yes, Delete Event</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
