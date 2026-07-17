import React from 'react';

export const CardSkeleton = () => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col gap-3 skeleton-shimmer">
    <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
    <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2"></div>
  </div>
);

export const NoticeSkeleton = () => (
  <div className="space-y-4">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

export const SystemStatusSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl skeleton-shimmer"></div>
    <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl skeleton-shimmer"></div>
    <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl skeleton-shimmer"></div>
  </div>
);

export const ChatHistorySkeleton = () => (
  <div className="space-y-4 py-4 px-2">
    <div className="flex justify-end">
      <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tr-none skeleton-shimmer"></div>
    </div>
    <div className="flex justify-start">
      <div className="h-16 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tl-none skeleton-shimmer"></div>
    </div>
    <div className="flex justify-end">
      <div className="h-10 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tr-none skeleton-shimmer"></div>
    </div>
  </div>
);
