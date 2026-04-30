import React, { useState } from 'react';

interface WhosLoggedInProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    unreadNotifications?: number;
    unreadMessages?: number;
  };
  isAuthenticated: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  className?: string;
}

/**
 * WhosLoggedIn Widget
 * 
 * When logged in: Shows user tools as icons (notifications, messages, user menu)
 * When logged out: Shows login and registration links
 */
const WhosLoggedIn: React.FC<WhosLoggedInProps> = ({
  user,
  isAuthenticated,
  onLogin,
  onRegister,
  onLogout,
  onNotificationClick,
  onMessageClick,
  className = '',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Not logged in: Show Login and Register links
  if (!isAuthenticated || !user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            onLogin?.();
          }}
          className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
        >
          Login
        </a>
        <span className="text-gray-600">|</span>
        <a
          href="/register"
          onClick={(e) => {
            e.preventDefault();
            onRegister?.();
          }}
          className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
        >
          Register
        </a>
      </div>
    );
  }

  // Logged in: Show user tools (notifications, messages, user menu)
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Notifications Icon - only show if handler provided */}
      {onNotificationClick && (
        <button
          onClick={onNotificationClick}
          className="relative text-gray-300 hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <span className="fa fa-bell text-lg" />
          {user.unreadNotifications && user.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              {user.unreadNotifications > 9 ? '9+' : user.unreadNotifications}
            </span>
          )}
        </button>
      )}

      {/* Messages Icon - only show if handler provided */}
      {onMessageClick && (
        <button
          onClick={onMessageClick}
          className="relative text-gray-300 hover:text-white transition-colors"
          aria-label="Messages"
        >
          <span className="fa fa-envelope text-lg" />
          {user.unreadMessages && user.unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              {user.unreadMessages > 9 ? '9+' : user.unreadMessages}
            </span>
          )}
        </button>
      )}

      {/* User Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="User menu"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full border-2 border-gray-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="fa fa-chevron-down text-xs text-gray-400" />
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-700">
              <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
              {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
            </div>
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span className="fa fa-user mr-2" />
              Profile
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span className="fa fa-cog mr-2" />
              Settings
            </a>
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700 mt-1"
              >
                <span className="fa fa-sign-out mr-2" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhosLoggedIn;
