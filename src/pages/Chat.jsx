import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import chatAPI from '../api/chat';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import EmptyState from '../components/EmptyState';
import { parseError } from '../utils/helpers';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';

const Chat = () => {
  const location = useLocation();
  const { setHistory, setActiveId, activeId } = useOutletContext();

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [clearing, setClearing]   = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load full chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatAPI.getHistory();
        const hist = res.data || [];
        setHistory(hist);
        // Render all previous messages
        const allMsgs = [];
        hist.forEach((chat) => {
          allMsgs.push({ role: 'user', content: chat.question, timestamp: chat.timestamp, id: `u-${chat._id}` });
          allMsgs.push({ role: 'bot',  content: chat.answer,   timestamp: chat.timestamp, sources: chat.sources || [], id: `b-${chat._id}` });
        });
        setMessages(allMsgs);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };
    loadHistory();
  }, [setHistory]);

  // When a chat is selected from the sidebar, scroll to it / highlight it
  useEffect(() => {
    if (location.state?.selectedChat) {
      scrollToBottom();
    }
  }, [location.state, scrollToBottom]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setError('');

    // Optimistically add user message
    const userMsg = { role: 'user', content: question, timestamp: new Date().toISOString(), id: `u-${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.ask(question);
      const chat = res.data;

      const botMsg = {
        role: 'bot',
        content: chat.answer,
        timestamp: chat.timestamp,
        sources: chat.sources || [],
        id: `b-${chat._id}`,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Update sidebar history
      setHistory((prev) => {
        const entry = { _id: chat._id, question, timestamp: chat.timestamp };
        return [entry, ...prev.filter((h) => h._id !== chat._id)];
      });
      setActiveId(chat._id);
    } catch (err) {
      setError(parseError(err));
      // Remove optimistic user message on failure
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
    setClearing(true);
    try {
      await chatAPI.clearHistory();
      setMessages([]);
      setHistory([]);
      setActiveId(null);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat toolbar */}
      {messages.length > 0 && (
        <div className="flex items-center justify-end px-4 py-2 border-b border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all disabled:opacity-50"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            {clearing ? 'Clearing…' : 'Clear History'}
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 && !loading ? (
          <EmptyState
            type="chat"
            title="Ask me anything about the college"
            description="I can answer questions about admissions, fees, schedules, faculty, and more."
          />
        ) : (
          <div className="flex flex-col max-w-4xl mx-auto">
            {messages.map((msg) => (
              <Message
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                sources={msg.sources}
              />
            ))}
            {loading && <TypingIndicator />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
      />
    </div>
  );
};

export default Chat;
