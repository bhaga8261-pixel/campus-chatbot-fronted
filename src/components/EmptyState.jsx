import React from 'react';
import { FiMessageSquare, FiBell, FiCalendar, FiHelpCircle, FiInbox } from 'react-icons/fi';

const ICONS = {
  chat:    <FiMessageSquare className="w-10 h-10" />,
  notice:  <FiBell className="w-10 h-10" />,
  event:   <FiCalendar className="w-10 h-10" />,
  faq:     <FiHelpCircle className="w-10 h-10" />,
  default: <FiInbox className="w-10 h-10" />,
};

/**
 * EmptyState – shown when a list/feed is empty.
 * @param {string} type - 'chat' | 'notice' | 'event' | 'faq' | 'default'
 * @param {string} title
 * @param {string} description
 * @param {ReactNode} action - Optional CTA button/link
 */
const EmptyState = ({ type = 'default', title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/30 text-brand-500 flex items-center justify-center shadow-inner">
      {ICONS[type] || ICONS.default}
    </div>
    {title && (
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
    )}
    {description && (
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
