import React from 'react';
import { CHAT_BOT_NAME } from '../utils/constants';

/**
 * Animated "…" typing bubble shown while waiting for the bot's response.
 */
const TypingIndicator = () => (
  <div className="flex items-start gap-3 px-4 py-2">
    {/* Bot avatar */}
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
      CQ
    </div>

    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400 dark:text-slate-500 mb-1">{CHAT_BOT_NAME}</span>
      <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
        <span className="dot-wave text-brand-500">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
