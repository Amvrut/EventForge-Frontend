import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onSelectEvent: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectEvent }) => {
  const minPrice = Math.min(...event.tiers.map((t) => t.price));
  const maxPrice = Math.max(...event.tiers.map((t) => t.price));
  const occupancyPercent = Math.round(
    ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
  );
  const isSoldOut = event.availableSeats <= 0;

  // Category styling
  const categoryColors: Record<string, string> = {
    Tech: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Music: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Business: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Sports: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Workshop: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Cultural: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const badgeClass =
    categoryColors[event.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <div className="group bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Cover Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${badgeClass}`}
          >
            {event.category}
          </span>
          {event.featured && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              Featured
            </span>
          )}
        </div>

        {/* Pricing Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
          {minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center text-xs text-indigo-400 font-medium mb-1.5 space-x-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {event.date} · {event.time}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2 leading-snug">
            {event.title}
          </h3>

          {/* Venue & City */}
          <div className="flex items-center text-xs text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0 mr-1.5 text-slate-500" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Bottom Section: Seats & CTA */}
        <div className="pt-3 border-t border-slate-800/80 mt-auto">
          {/* Seat Inventory Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center text-slate-400 text-[11px]">
                <Users className="w-3 h-3 mr-1 text-slate-500" />
                Remaining Seats
              </span>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  isSoldOut
                    ? 'text-rose-400'
                    : event.availableSeats < 25
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {event.availableSeats} of {event.totalSeats} left
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isSoldOut
                    ? 'bg-rose-500'
                    : event.availableSeats < 25
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Button CTA */}
          <button
            onClick={() => onSelectEvent(event)}
            disabled={isSoldOut}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            <span>{isSoldOut ? 'Sold Out' : 'Book Tickets'}</span>
            {!isSoldOut && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
};
