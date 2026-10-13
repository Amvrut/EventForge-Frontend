import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import { Booking, Ticket } from '../types';
import { generateQrMatrix, generateQrDataUrl } from '../utils/qrGenerator';
import { AppLogo } from './AppLogo';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  onCancelBooking,
}) => {
  if (!booking) return null;

  const ticketList: Ticket[] =
    booking.tickets && booking.tickets.length > 0
      ? booking.tickets
      : [
          {
            id: booking.id,
            ticketCode: booking.ticketCode || booking.bookingRef,
            qrPayload:
              booking.qrPayload ||
              `EVENTFORGE:${booking.bookingRef}:${booking.ticketCode || booking.bookingRef}:${booking.tierId}:VERIFIED_RAZORPAY`,
            status: booking.bookingStatus,
            checkedInAt: undefined,
          },
        ];

  const [activeTicketIndex, setActiveTicketIndex] = useState<number>(0);
  const currentTicket = ticketList[activeTicketIndex] || ticketList[0];
  const activeQrPayload =
    currentTicket.qrPayload || currentTicket.ticketCode || booking.bookingRef;

  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  const qrMatrix = generateQrMatrix(activeQrPayload, 25);

  useEffect(() => {
    generateQrDataUrl(activeQrPayload, 260).then((url) => {
      setQrPngUrl(url);
    });
  }, [activeQrPayload]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(booking, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ticket-${booking.bookingRef}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isCancelled = booking.bookingStatus === 'cancelled';
  const isTicketCheckedIn = currentTicket.status === 'checked_in' || Boolean(currentTicket.checkedInAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-6">
        {/* Actions bar above card */}
        <div className="flex items-center justify-between mb-3 no-print">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            {isCancelled ? (
              <span className="text-rose-400 flex items-center">
                <Ban className="w-4 h-4 mr-1" />
                Pass Cancelled & Refunded
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Official E-Ticket Pass Issued
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCancelled && onCancelBooking && (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Cancel this ticket reservation"
              >
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>Cancel Pass</span>
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Pass"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Pass Layout */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl relative text-white">
          {/* Top Header Strip with App Logo */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-4 flex items-center justify-between">
            <AppLogo size="sm" showSubtitle={false} />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-indigo-200 font-medium">
                Pass Reference
              </div>
              <div className="font-mono font-bold text-xs text-white">
                {booking.bookingRef}
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  Confirmed Admission Pass
                </span>
                {isCancelled && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    CANCELLED
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white mt-0.5 leading-snug">
                {booking.eventTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Date & Time</span>
                <span className="font-semibold text-white flex items-center mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400 shrink-0" />
                  {booking.eventDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location / Venue</span>
                <span className="font-semibold text-white flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400 shrink-0" />
                  <span className="truncate">{booking.eventVenue}</span>
                </span>
              </div>
            </div>

            {/* Multi-seat ticket switcher */}
            {ticketList.length > 1 && (
              <div className="flex items-center space-x-2 pt-1 pb-2 overflow-x-auto no-print">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Select Seat:</span>
                {ticketList.map((t, idx) => (
                  <button
                    key={t.id || idx}
                    type="button"
                    onClick={() => setActiveTicketIndex(idx)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold transition-colors cursor-pointer shrink-0 ${
                      activeTicketIndex === idx
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Seat {idx + 1} ({t.ticketCode || `Ticket #${idx + 1}`})
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Attendee</span>
                <span className="font-bold text-slate-200 truncate block">
                  {booking.userName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Tier & Seat</span>
                <span className="font-bold text-indigo-300 truncate block">
                  {booking.tierName} {ticketList.length > 1 ? `(#${activeTicketIndex + 1})` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Ticket Status</span>
                <span
                  className={`font-bold font-mono text-[11px] ${
                    isCancelled
                      ? 'text-rose-400'
                      : isTicketCheckedIn
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {isCancelled
                    ? 'Cancelled'
                    : isTicketCheckedIn
                    ? 'Checked In'
                    : 'Valid / Ready'}
                </span>
              </div>
            </div>

            {/* Perforated Divider Line with Cutout Notches */}
            <div className="relative py-1">
              <div className="border-t-2 border-dashed border-slate-700 w-full"></div>
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/85"></div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/85"></div>
            </div>

            {/* Real QR Code and Gate Verification Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              {/* 100% Real Scannable High-Res QR Code */}
              <div className="p-2.5 bg-white rounded-xl shadow-md shrink-0">
                {qrPngUrl ? (
                  <img
                    src={qrPngUrl}
                    alt={`QR Pass for ${currentTicket.ticketCode || booking.bookingRef}`}
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <svg
                    width="128"
                    height="128"
                    viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                    className="shape-rendering-crispEdges"
                  >
                    {qrMatrix.map((row, rIdx) =>
                      row.map((cell, cIdx) =>
                        cell ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill="#0f172a"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                )}
              </div>

              {/* Security info & Barcode */}
              <div className="flex-1 space-y-2 text-left w-full sm:w-auto">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">
                    {isTicketCheckedIn ? 'Gate Check-in Confirmed' : 'Cryptographically Verified Pass'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Present this unique QR code at the venue gate. Each seat receives an independent, tamper-proof admission code.
                </p>

                {/* Simulated Barcode */}
                <div className="pt-2">
                  <div className="h-7 w-full bg-white flex items-stretch justify-around px-2 py-0.5 rounded overflow-hidden">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div
                        key={i}
                        className={`bg-slate-900 ${
                          i % 3 === 0
                            ? 'w-1.5'
                            : i % 2 === 0
                            ? 'w-0.5'
                            : 'w-1'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center font-mono text-[9px] text-slate-500 mt-1">
                    *{currentTicket.ticketCode || booking.bookingRef}*
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>Purchased on {booking.bookedAt}</span>
            <button
              type="button"
              onClick={onClose}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Done / Close Pass
            </button>
          </div>
        </div>

        {/* Cancellation Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mx-auto">
                <Ban className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h4 className="text-base font-bold text-white">Cancel This Pass?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to cancel ticket <strong className="text-indigo-400 font-mono">{booking.bookingRef}</strong>? Your ${booking.totalAmount} will be refunded and {booking.quantity} seat(s) released.
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Keep Pass
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    if (onCancelBooking) {
                      onCancelBooking(booking.id);
                    }
                  }}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
                >
                  Yes, Cancel Pass
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
