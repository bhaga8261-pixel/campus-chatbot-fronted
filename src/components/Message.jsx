import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatRelativeTime, copyToClipboard } from '../utils/helpers';
import { CHAT_BOT_NAME } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

// ── Code block with copy button ──────────────────────────────────────────────
const CodeBlock = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Inline code
  if (!className) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-brand-600 dark:text-brand-300 text-[0.85em] font-mono">
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {className?.replace('language-', '') || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiCopy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-slate-50 dark:bg-slate-900">
        <code className="text-sm font-mono text-slate-800 dark:text-slate-200">{code}</code>
      </pre>
    </div>
  );
};

// ── Markdown components map ──────────────────────────────────────────────────
const mdComponents = {
  code: CodeBlock,
  p:    ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul:   ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
  ol:   ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
  li:   ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  h1:   ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3">{children}</h1>,
  h2:   ({ children }) => <h2 className="text-base font-semibold mb-2 mt-3">{children}</h2>,
  h3:   ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand-400 pl-4 my-2 text-slate-600 dark:text-slate-400 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full text-sm border-collapse border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-left font-semibold border border-slate-200 dark:border-slate-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">{children}</td>
  ),
};

// ── Sources accordion ─────────────────────────────────────────────────────────
const SourcesAccordion = ({ sources }) => {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
      >
        {open ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
        {sources.length} source{sources.length !== 1 ? 's' : ''}
      </button>

      {open && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {sources.map((src, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
              <span className="font-medium truncate">{src.document_name || src.metadata?.document_name || 'Document'}</span>
              {(src.page || src.metadata?.page) && (
                <span className="ml-auto flex-shrink-0 text-slate-400">pg. {src.page ?? src.metadata?.page}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Main Message component ────────────────────────────────────────────────────
/**
 * @param {{ role: 'user'|'bot', content: string, timestamp: string|Date, sources: Array }} props
 */
const Message = ({ role, content, timestamp, sources = [] }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const isUser = role === 'user';

  const handleCopyMessage = async () => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`group flex items-start gap-3 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
          isUser
            ? 'bg-brand-600 text-white'
            : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
        }`}
      >
        {isUser ? (user?.name?.[0]?.toUpperCase() || 'U') : 'CQ'}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className={`text-xs font-medium ${isUser ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {isUser ? (user?.name || 'You') : CHAT_BOT_NAME}
        </span>

        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-brand-600 text-white rounded-tr-sm'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/50 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
          )}

          {/* Copy message button – visible on hover */}
          <button
            onClick={handleCopyMessage}
            className={`absolute -top-2 ${isUser ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm`}
            title="Copy message"
          >
            {copied
              ? <FiCheck className="w-3 h-3 text-emerald-500" />
              : <FiCopy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        {/* Sources (bot only) */}
        {!isUser && <SourcesAccordion sources={sources} />}

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">
            {formatRelativeTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
