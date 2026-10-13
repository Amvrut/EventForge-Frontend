import React from 'react';
import {
  Ticket,
  BookOpen,
  ShieldCheck,
  UserCheck,
  Calendar,
  RotateCcw,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { User } from '../types';
import { getStoredUsers } from '../utils/storage';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  activeTab: 'app' | 'academic';
  setActiveTab: (tab: 'app' | 'academic') => void;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
  bookingCount: number;
  currentAppView: 'catalog' | 'my-bookings' | 'admin';
  setCurrentAppView: (view: 'catalog' | 'my-bookings' | 'admin') => void;
  onResetData: () => void;
  backendOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSelectUser,
  onOpenAuth,
  onSignOut,
  onDeleteAccount,
  bookingCount,
  currentAppView,
  setCurrentAppView,
  onResetData,
  backendOnline = false,
}) => {
  const registeredUsers = getStoredUsers();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActiveTab('app');
                setCurrentAppView('catalog');
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <AppLogo size="md" showSubtitle={true} />
            </button>
            {backendOnline ? (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Express & SQLite Live
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/80 text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Offline Cache Mode
              </span>
            )}
          </div>

          {/* Central Mode Switcher: Live App vs 16-Step Dossier */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'app'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Event App</span>
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'academic'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>16-Step Academic Blueprint</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </button>
          </div>

          {/* Right Section: Navigation Links & Auth Actions */}
          <div className="flex items-center space-x-3">
            {activeTab === 'app' && (
              <div className="hidden md:flex items-center space-x-1 border-r border-slate-800 pr-3 mr-1">
                <button
                  onClick={() => setCurrentAppView('catalog')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    currentAppView === 'catalog'
                      ? 'text-white bg-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                  Events
                </button>
                <button
                  onClick={() => setCurrentAppView('my-bookings')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                    currentAppView === 'my-bookings'
                      ? 'text-white bg-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 inline mr-1.5" />
                  My Bookings
                  {bookingCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] font-bold rounded-full">
                      {bookingCount}
                    </span>
                  )}
                </button>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentAppView('admin')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentAppView === 'admin'
                        ? 'text-amber-300 bg-amber-950/40 border border-amber-800/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                    Admin Portal
                  </button>
                )}
              </div>
            )}

            {/* AUTH STATE: Logged In vs Logged Out / Guest */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {/* User Profile & Dropdown */}
                <div className="relative group">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-medium text-slate-200 leading-none truncate max-w-[100px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 capitalize">
                        {currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                  </div>

                  {/* Dropdown switch menu */}
                  <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                    <div className="p-2 border-b border-slate-800 mb-1">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize font-mono">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">
                      Quick Persona Switcher
                    </div>
                    {registeredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          if (user.role === 'admin' && activeTab === 'app') {
                            setCurrentAppView('admin');
                          }
                        }}
                        className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs rounded-md text-left transition-colors ${
                          currentUser.id === user.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div className="flex-1 truncate">
                          <div className="font-medium truncate">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {user.role}
                          </div>
                        </div>
                      </button>
                    ))}

                    <div className="border-t border-slate-800 mt-1.5 pt-1.5 space-y-1">
                      <button
                        onClick={() => onOpenAuth('signin')}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-indigo-300 hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Switch / Sign In Other Account</span>
                      </button>
                      <button
                        onClick={() => onOpenAuth('signup')}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-emerald-300 hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register New User / Admin</span>
                      </button>
                      <button
                        onClick={onSignOut}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-md transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Logout</span>
                      </button>
                      <button
                        onClick={onDeleteAccount}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-md transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete My Account</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 mt-1.5 pt-1">
                      <button
                        onClick={onResetData}
                        className="w-full flex items-center space-x-2 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Seed Database</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct 1-Click Logout Button in Header */}
                <button
                  onClick={onSignOut}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition-all flex items-center space-x-1.5 shadow-sm"
                  title={`Log out of ${currentUser.name}`}
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Logged Out / Guest Mode - Prominent Sign In and Sign Up buttons */
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
