import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiMessageSquare, FiGrid, FiUser, FiLogOut,
  FiSun, FiMoon, FiX, FiPlusCircle, FiTrash2, FiClock,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatRelativeTime } from '../utils/helpers';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/chat',      label: 'Chat',      icon: FiMessageSquare },
  { to: '/profile',   label: 'Profile',   icon: FiUser },
];

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
  }`;

/**
 * Sidebar component.
 * @param {{ open, onClose, history, onNewChat, onSelectChat, onDeleteChat, activeId }} props
 */
const Sidebar = ({ open, onClose, history = [], onNewChat, onSelectChat, onDeleteChat, activeId }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-40 flex flex-col
          bg-white dark:bg-slate-900
          border-r border-slate-200/60 dark:border-slate-800/40
          shadow-xl dark:shadow-none
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-500/20">
              CQ
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">Campus Query</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">{user?.role || 'Student'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4 pt-4">
          <button
            id="new-chat-btn"
            onClick={() => { onNewChat?.(); onClose?.(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 hover:scale-[1.01] transition-all duration-200"
          >
            <FiPlusCircle className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 pt-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkCls} onClick={onClose}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Chat history */}
        {history.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 pt-5 min-h-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2 px-1">
              Recent Chats
            </p>
            <ul className="flex flex-col gap-1">
              {history.map((chat) => (
                <li key={chat._id || chat.id} className="group relative">
                  <button
                    onClick={() => { onSelectChat?.(chat); onClose?.(); }}
                    className={`w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                      activeId === (chat._id || chat.id)
                        ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FiClock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-60" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{chat.question}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">
                        {formatRelativeTime(chat.timestamp)}
                      </p>
                    </div>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteChat?.(chat._id || chat.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all"
                    title="Remove from history"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spacer when no history */}
        {history.length === 0 && <div className="flex-1" />}

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-slate-200/60 dark:border-slate-800/40 flex flex-col gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-150"
          >
            {theme === 'dark'
              ? <FiSun className="w-4 h-4" />
              : <FiMoon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Logout */}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-all duration-150"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
