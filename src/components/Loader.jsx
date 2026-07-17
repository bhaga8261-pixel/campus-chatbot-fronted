import React from 'react';

/** Full-screen loading splash shown on first auth check */
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-slate-700" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 animate-spin" />
    </div>
    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
      Loading Campus Query…
    </p>
  </div>
);

/** Inline button spinner */
export const ButtonSpinner = ({ className = '' }) => (
  <svg
    className={`animate-spin h-4 w-4 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8z"
    />
  </svg>
);

/** Chat message skeleton row */
const SkeletonLine = ({ width = 'w-full' }) => (
  <div className={`h-3 rounded-full skeleton-shimmer ${width}`} />
);

export const ChatMessageSkeleton = () => (
  <div className="flex flex-col gap-3 px-4 py-3">
    {/* Bot bubble */}
    <div className="flex gap-3 items-start max-w-2xl">
      <div className="w-8 h-8 rounded-full skeleton-shimmer flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <SkeletonLine width="w-3/4" />
        <SkeletonLine width="w-full" />
        <SkeletonLine width="w-1/2" />
      </div>
    </div>
  </div>
);

/** Card skeleton for Dashboard panels */
export const CardSkeleton = () => (
  <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 flex flex-col gap-3">
    <SkeletonLine width="w-1/3" />
    <SkeletonLine width="w-full" />
    <SkeletonLine width="w-4/5" />
    <SkeletonLine width="w-2/3" />
  </div>
);

export default PageLoader;
