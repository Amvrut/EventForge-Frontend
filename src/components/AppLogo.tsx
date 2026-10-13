import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Custom Vector Brand Emblem: Interlocking Modern Ticket & Forge Star */}
      <div
        className={`${iconDimensions} rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-500/20"></div>

          {/* Precision SVG Brandmark */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5/6 h-5/6 drop-shadow-sm"
          >
            {/* Ticket Outer Shell */}
            <path
              d="M6 9C6 7.89543 6.89543 7 8 7H24C25.1046 7 26 7.89543 26 9V13.5C24.6193 13.5 23.5 14.6193 23.5 16C23.5 17.3807 24.6193 18.5 26 18.5V23C26 24.1046 25.1046 25 24 25H8C6.89543 25 6 24.1046 6 23V18.5C7.38071 18.5 8.5 17.3807 8.5 16C8.5 14.6193 7.38071 13.5 6 13.5V9Z"
              fill="url(#logo-grad)"
              stroke="#818cf8"
              strokeWidth="1.2"
            />
            {/* Forge Spark / Anvil Diamond in center */}
            <path
              d="M16 11L18.5 16L16 21L13.5 16L16 11Z"
              fill="#fbbf24"
              className="animate-pulse"
            />
            {/* Barcode dash lines */}
            <line x1="10" y1="12" x2="10" y2="20" stroke="#c7d2fe" strokeWidth="1" strokeLinecap="round" />
            <line x1="12" y1="13" x2="12" y2="19" stroke="#c7d2fe" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="20" y1="13" x2="20" y2="19" stroke="#c7d2fe" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="22" y1="12" x2="22" y2="20" stroke="#c7d2fe" strokeWidth="1" strokeLinecap="round" />

            <defs>
              <linearGradient id="logo-grad" x1="6" y1="7" x2="26" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4338ca" />
                <stop offset="0.5" stopColor="#4f46e5" />
                <stop offset="1" stopColor="#312e81" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="text-left">
        <div className={`font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none ${titleSizes}`}>
          <span>Event<span className="text-indigo-400">Forge</span></span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-400 block mt-1 hidden sm:block">
            Event Ticketing & Academic Suite
          </span>
        )}
      </div>
    </div>
  );
};
