import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/chat':      'Chat',
  '/profile':   'Profile & Settings',
};

/**
 * Top navigation bar.
 * @param {{ onMenuClick: () => void }} props
 */
const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const title = Object.entries(TITLES).find(([path]) => pathname.startsWith(path))?.[1] || 'Campus Query';

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200/60 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          id="menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
      </div>

      {/* Right: user chip */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40">
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'User'}</span>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role || 'student'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
