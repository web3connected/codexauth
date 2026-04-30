'use client';

import React, { useState, useRef, useEffect } from 'react';

interface WhoIsLoggedInWidgetProps {
  /** Whether the user is currently authenticated */
  isAuthenticated?: boolean;
  /** Show skeleton loaders while auth state is resolving */
  isLoading?: boolean;
  /** Logged-in user data */
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  /** Fallback href for login (used when onLogin is not provided) */
  loginHref?: string;
  /** Fallback href for register (used when onRegister is not provided) */
  registerHref?: string;
  /** Called when Login button is clicked */
  onLogin?: () => void;
  /** Called when Register button is clicked */
  onRegister?: () => void;
  /** Called when Sign Out is clicked */
  onLogout?: () => void;
  /** Called when My Profile is clicked */
  onProfile?: () => void;
  /** Called when Settings is clicked */
  onSettings?: () => void;
}

const WhoIsLoggedInWidget: React.FC<WhoIsLoggedInWidgetProps> = ({
  isAuthenticated = false,
  isLoading = false,
  user,
  loginHref = '/login',
  registerHref = '/register',
  onLogin,
  onRegister,
  onLogout,
  onProfile,
  onSettings,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-white/10" />
        <div className="w-20 h-3 rounded bg-white/10" />
      </div>
    );
  }

  // Guest state — show Login + Register buttons
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <a
          href={onLogin ? undefined : loginHref}
          onClick={onLogin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/70 border border-white/20 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Login
        </a>
        <a
          href={onRegister ? undefined : registerHref}
          onClick={onRegister}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register
        </a>
      </div>
    );
  }

  // Authenticated state — avatar + dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border border-white/20">
            {initials}
          </div>
        )}

        {/* Name */}
        <span className="text-xs font-medium text-white/80 max-w-[100px] truncate hidden sm:block">
          {displayName}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-sm shadow-2xl z-50 overflow-hidden">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setDropdownOpen(false); onProfile?.(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </button>

            <button
              onClick={() => { setDropdownOpen(false); onSettings?.(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>

            <div className="my-1 border-t border-white/10" />

            <button
              onClick={() => { setDropdownOpen(false); onLogout?.(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoIsLoggedInWidget;