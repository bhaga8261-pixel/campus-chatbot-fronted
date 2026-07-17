import React, { useEffect, useState, useCallback } from 'react';
import {
  FiBell, FiCalendar, FiHelpCircle, FiPlus, FiTrash2,
  FiChevronDown, FiChevronUp, FiAlertCircle, FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { noticeAPI, eventAPI, faqAPI } from '../api/api';
import { formatDate, parseError } from '../utils/helpers';
import { CardSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';

// ── Reusable section header ──────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, count, color, onAdd, isAdmin, loading }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        {count !== undefined && (
          <p className="text-[10px] text-slate-400">{count} item{count !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
    {isAdmin && (
      <button onClick={onAdd}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]">
        <FiPlus className="w-3.5 h-3.5" /> Add
      </button>
    )}
  </div>
);

// ── Admin Create Modal ───────────────────────────────────────────────────────
const CreateModal = ({ type, onClose, onCreated }) => {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [date, setDate]         = useState('');
  const [answer, setAnswer]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (type === 'notice') await noticeAPI.create({ title, description: desc });
      else if (type === 'event') await eventAPI.create({ title, date, description: desc });
      else if (type === 'faq') await faqAPI.create({ question: title, answer });
      onCreated();
      onClose();
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/60 dark:border-slate-800/40">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          Create {type === 'faq' ? 'FAQ' : type === 'notice' ? 'Notice' : 'Event'}
        </h3>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'faq' ? 'Question' : 'Title'}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />

          {type === 'event' && (
            <input required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
          )}

          <textarea required rows={3}
            value={type === 'faq' ? answer : desc}
            onChange={(e) => type === 'faq' ? setAnswer(e.target.value) : setDesc(e.target.value)}
            placeholder={type === 'faq' ? 'Answer' : 'Description'}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none" />

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-md shadow-brand-500/20">
              {loading ? 'Saving…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
const FAQItem = ({ faq, isAdmin, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200/60 dark:border-slate-700/40 rounded-xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
        <span>{faq.question}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(faq._id || faq.id); }}
              className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {open ? <FiChevronUp className="w-4 h-4 text-slate-400" /> : <FiChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isAdmin } = useAuth();
  const admin = isAdmin();

  const [notices, setNotices]   = useState([]);
  const [events, setEvents]     = useState([]);
  const [faqs, setFaqs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // 'notice' | 'event' | 'faq' | null

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [n, e, f] = await Promise.all([noticeAPI.list(), eventAPI.list(), faqAPI.list()]);
      setNotices(n.data || []);
      setEvents(e.data || []);
      setFaqs(f.data || []);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (type, id) => {
    try {
      if (type === 'notice') { await noticeAPI.delete(id); setNotices((p) => p.filter((n) => (n._id || n.id) !== id)); }
      else if (type === 'event') { await eventAPI.delete(id); setEvents((p) => p.filter((e) => (e._id || e.id) !== id)); }
      else if (type === 'faq') { await faqAPI.delete(id); setFaqs((p) => p.filter((f) => (f._id || f.id) !== id)); }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page heading */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Stay updated with college announcements, events, and FAQs</p>
        </div>
        <button onClick={fetchAll}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all">
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Notices ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <SectionHeader icon={FiBell} title="Notices" count={notices.length}
            color="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            isAdmin={admin} onAdd={() => setModal('notice')} />

          {loading ? (
            <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /></div>
          ) : notices.length === 0 ? (
            <EmptyState type="notice" title="No Notices" description="Announcements will appear here." />
          ) : (
            <ul className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {notices.map((n) => (
                <li key={n._id || n.id}
                  className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{n.title}</p>
                    {admin && (
                      <button onClick={() => handleDelete('notice', n._id || n.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">{n.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{formatDate(n.createdAt || n.created_at, false)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Events ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <SectionHeader icon={FiCalendar} title="Upcoming Events" count={events.length}
            color="bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
            isAdmin={admin} onAdd={() => setModal('event')} />

          {loading ? (
            <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /></div>
          ) : events.length === 0 ? (
            <EmptyState type="event" title="No Events" description="Upcoming events will be listed here." />
          ) : (
            <ul className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {events.map((ev) => (
                <li key={ev._id || ev.id}
                  className="p-4 rounded-xl bg-violet-50/60 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20 group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{ev.title}</p>
                    {admin && (
                      <button onClick={() => handleDelete('event', ev._id || ev.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-violet-700 dark:text-violet-400 font-medium mt-1.5">
                    📅 {formatDate(ev.date)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">{ev.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── FAQs ────────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <SectionHeader icon={FiHelpCircle} title="FAQs" count={faqs.length}
            color="bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
            isAdmin={admin} onAdd={() => setModal('faq')} />

          {loading ? (
            <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /></div>
          ) : faqs.length === 0 ? (
            <EmptyState type="faq" title="No FAQs" description="Frequently asked questions will appear here." />
          ) : (
            <ul className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
              {faqs.map((f) => (
                <FAQItem key={f._id || f.id} faq={f} isAdmin={admin}
                  onDelete={(id) => handleDelete('faq', id)} />
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Create modal */}
      {modal && (
        <CreateModal type={modal} onClose={() => setModal(null)} onCreated={fetchAll} />
      )}
    </div>
  );
};

export default Dashboard;
