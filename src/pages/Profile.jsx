import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { docsAPI, adminAPI } from '../api/api';
import { formatDate, parseError } from '../utils/helpers';
import { CardSkeleton, ButtonSpinner } from '../components/Loader';
import {
  FiUser, FiMail, FiShield, FiCalendar, FiUpload, FiTrash2,
  FiAlertCircle, FiCheckCircle, FiRefreshCw, FiFileText,
  FiDatabase, FiUsers, FiActivity, FiCpu,
} from 'react-icons/fi';

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value ?? '—'}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4">{title}</h3>
    {children}
  </div>
);

// ── Alert ─────────────────────────────────────────────────────────────────────
const Alert = ({ type = 'error', message, onDismiss }) => {
  if (!message) return null;
  const styles = type === 'success'
    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400';
  const Icon = type === 'success' ? FiCheckCircle : FiAlertCircle;
  return (
    <div className={`flex items-center gap-2 p-3 border rounded-xl text-sm ${styles}`}>
      <Icon className="w-4 h-4 flex-shrink-0" /><span className="flex-1">{message}</span>
      {onDismiss && <button onClick={onDismiss} className="opacity-60 hover:opacity-100">✕</button>}
    </div>
  );
};

// ── Profile page ──────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, isAdmin } = useAuth();
  const admin = isAdmin();

  // Documents
  const [docs, setDocs]           = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [uploadMsg, setUploadMsg]   = useState({ type: '', text: '' });
  const [uploading, setUploading]   = useState(false);
  const fileInputRef = useRef(null);

  // System status (admin)
  const [status, setStatus]       = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [rebuildMsg, setRebuildMsg] = useState({ type: '', text: '' });
  const [rebuilding, setRebuilding] = useState(false);

  // Users table (admin)
  const [users, setUsers]         = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userMsg, setUserMsg]       = useState({ type: '', text: '' });

  // Load documents
  const loadDocs = useCallback(async () => {
    setDocsLoading(true);
    try {
      const res = await docsAPI.list();
      setDocs(res.data || []);
    } catch { setDocs([]); } finally { setDocsLoading(false); }
  }, []);

  // Load system status (admin only)
  const loadStatus = useCallback(async () => {
    if (!admin) return;
    setStatusLoading(true);
    try {
      const res = await adminAPI.getSystemStatus();
      setStatus(res.data);
    } catch { setStatus(null); } finally { setStatusLoading(false); }
  }, [admin]);

  // Load users (admin only)
  const loadUsers = useCallback(async () => {
    if (!admin) return;
    setUsersLoading(true);
    try {
      const res = await adminAPI.listUsers();
      setUsers(res.data || []);
    } catch { setUsers([]); } finally { setUsersLoading(false); }
  }, [admin]);

  useEffect(() => {
    loadDocs();
    if (admin) { loadStatus(); loadUsers(); }
  }, [admin, loadDocs, loadStatus, loadUsers]);

  // Upload document
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg({ type: '', text: '' });
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await docsAPI.upload(fd);
      setUploadMsg({ type: 'success', text: res.data.message || 'Document uploaded and indexed.' });
      await loadDocs();
    } catch (err) {
      setUploadMsg({ type: 'error', text: parseError(err) });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Delete document
  const handleDeleteDoc = async (id, filename) => {
    if (!window.confirm(`Delete "${filename}"? This will also remove its indexed chunks.`)) return;
    try {
      await docsAPI.delete(id);
      setDocs((prev) => prev.filter((d) => (d.id || d._id) !== id));
    } catch (err) {
      setUploadMsg({ type: 'error', text: parseError(err) });
    }
  };

  // Rebuild embeddings
  const handleRebuild = async () => {
    if (!window.confirm('Re-index all documents? This may take a while.')) return;
    setRebuilding(true);
    setRebuildMsg({ type: '', text: '' });
    try {
      const res = await adminAPI.rebuildEmbeddings();
      setRebuildMsg({ type: 'success', text: `${res.data.message} (${res.data.documents_rebuilt} docs, ${res.data.total_chunks} chunks)` });
    } catch (err) {
      setRebuildMsg({ type: 'error', text: parseError(err) });
    } finally { setRebuilding(false); }
  };

  // Delete user
  const handleDeleteUser = async (uid, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    setUserMsg({ type: '', text: '' });
    try {
      await adminAPI.deleteUser(uid);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== uid));
      setUserMsg({ type: 'success', text: `User ${email} deleted.` });
    } catch (err) {
      setUserMsg({ type: 'error', text: parseError(err) });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {admin ? 'Profile & Admin Panel' : 'My Profile'}
      </h1>

      {/* ── User info card ───────────────────────────────────────────── */}
      <Section title="Account Information">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-brand-500/30 flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <div className="flex items-center gap-2.5">
              <FiUser className="w-4 h-4 text-slate-400" />
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Name</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p></div>
            </div>
            <div className="flex items-center gap-2.5">
              <FiMail className="w-4 h-4 text-slate-400" />
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.email}</p></div>
            </div>
            <div className="flex items-center gap-2.5">
              <FiShield className="w-4 h-4 text-slate-400" />
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Role</p>
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  admin ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {user?.role}
                </span></div>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCalendar className="w-4 h-4 text-slate-400" />
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Joined</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatDate(user?.created_at, false)}
                </p></div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Documents ────────────────────────────────────────────────── */}
      <Section title="Knowledge Base Documents">
        {admin && (
          <div className="mb-4 flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={handleFileUpload}
              id="doc-upload"
            />
            <button
              id="upload-doc-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 font-semibold text-sm transition-all disabled:opacity-60"
            >
              {uploading ? <ButtonSpinner className="text-brand-500" /> : <FiUpload className="w-4 h-4" />}
              {uploading ? 'Uploading & Indexing…' : 'Upload Document (PDF, DOCX, TXT, MD)'}
            </button>
            <Alert type={uploadMsg.type} message={uploadMsg.text} onDismiss={() => setUploadMsg({ type: '', text: '' })} />
          </div>
        )}

        {docsLoading ? (
          <div className="flex flex-col gap-2"><CardSkeleton /><CardSkeleton /></div>
        ) : docs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No documents indexed yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {docs.map((doc) => {
              const id = doc.id || doc._id;
              return (
                <li key={id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 group">
                  <FiFileText className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{doc.title || doc.filename}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(doc.uploadedAt || doc.uploaded_at, false)}</p>
                  </div>
                  {admin && (
                    <button
                      onClick={() => handleDeleteDoc(id, doc.filename)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ── Admin-only sections ──────────────────────────────────────── */}
      {admin && (
        <>
          {/* Rebuild embeddings */}
          <Section title="Embedding Management">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Re-generate vector embeddings for all uploaded documents. Useful after adding new documents or changing the embedding model.
            </p>
            <Alert type={rebuildMsg.type} message={rebuildMsg.text} onDismiss={() => setRebuildMsg({ type: '', text: '' })} />
            <button
              id="rebuild-btn"
              onClick={handleRebuild}
              disabled={rebuilding}
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all disabled:opacity-60 hover:scale-[1.01]"
            >
              {rebuilding ? <ButtonSpinner /> : <FiRefreshCw className="w-4 h-4" />}
              {rebuilding ? 'Rebuilding…' : 'Rebuild All Embeddings'}
            </button>
          </Section>

          {/* System status */}
          <Section title="System Status">
            {statusLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
            ) : status ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  <StatCard icon={FiDatabase} label="DB Status" value={status.database_status} color="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
                  <StatCard icon={FiUsers} label="Students" value={status.user_analytics?.students} color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
                  <StatCard icon={FiShield} label="Admins" value={status.user_analytics?.admins} color="bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400" />
                  <StatCard icon={FiActivity} label="Total Chats" value={status.collection_counts?.chats} color="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" />
                  <StatCard icon={FiFileText} label="Documents" value={status.collection_counts?.documents} color="bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400" />
                  <StatCard icon={FiCpu} label="Chunks" value={status.collection_counts?.document_chunks} color="bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" />
                  <StatCard icon={FiActivity} label="FAQs" value={status.collection_counts?.faq} color="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" />
                  <StatCard icon={FiDatabase} label="Vector Ready" value={status.ai_status?.vector_search_ready ? 'Yes' : 'No'} color="bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" />
                </div>

                {/* Popular questions */}
                {status.popular_questions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Top Questions</p>
                    <ul className="flex flex-col gap-1.5">
                      {status.popular_questions.map((q, i) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm">
                          <span className="text-slate-700 dark:text-slate-300 truncate flex-1">{q.question}</span>
                          <span className="ml-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">×{q.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">Failed to load system status.</p>
            )}
            <button onClick={loadStatus} disabled={statusLoading}
              className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
              <FiRefreshCw className={`w-3 h-3 ${statusLoading ? 'animate-spin' : ''}`} /> Refresh status
            </button>
          </Section>

          {/* User management */}
          <Section title="User Management">
            <Alert type={userMsg.type} message={userMsg.text} onDismiss={() => setUserMsg({ type: '', text: '' })} />
            {usersLoading ? (
              <CardSkeleton />
            ) : (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Name</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</th>
                      <th className="py-2 px-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const uid = u.id || u._id;
                      return (
                        <tr key={uid} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{u.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                              u.role === 'admin'
                                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {u.email !== user?.email && (
                              <button
                                onClick={() => handleDeleteUser(uid, u.email)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
};

export default Profile;
