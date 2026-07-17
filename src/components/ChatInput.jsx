import React, { useRef, useEffect } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { ButtonSpinner } from './Loader';

/**
 * ChatInput – auto-resizing textarea with keyboard shortcuts.
 * @param {{ value, onChange, onSend, loading, placeholder }} props
 */
const ChatInput = ({ value, onChange, onSend, loading, placeholder = 'Ask anything about the college…' }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift); newline on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  const canSend = !loading && value.trim().length > 0;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="flex items-end gap-2 p-2 pl-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-premium focus-within:border-brand-400 dark:focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-400/20 transition-all duration-200">
        <textarea
          ref={textareaRef}
          id="chat-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none min-h-[24px] max-h-[200px] py-1.5 leading-relaxed disabled:opacity-60"
        />

        <button
          id="send-btn"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          title={loading ? 'Waiting for response…' : 'Send (Enter)'}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            canSend
              ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 hover:scale-105'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <ButtonSpinner className="text-slate-400" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-1.5">
        Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Enter</kbd> to send ·{' '}
        <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Shift+Enter</kbd> for newline
      </p>
    </div>
  );
};

export default ChatInput;
