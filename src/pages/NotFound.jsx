import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
    {/* Large illustrated number */}
    <div className="relative mb-8 select-none">
      <span className="text-[120px] sm:text-[160px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-brand-700">
        404
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-950/30 border-4 border-brand-200 dark:border-brand-800 flex items-center justify-center shadow-inner">
          <span className="text-4xl">🔍</span>
        </div>
      </div>
    </div>

    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Page Not Found</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>

    <Link
      to="/dashboard"
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
    >
      <FiHome className="w-4 h-4" />
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
