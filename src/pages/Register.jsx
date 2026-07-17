import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiUser, FiMail, FiLock, FiAlertCircle,
  FiCheckCircle, FiShield, FiEye, FiEyeOff, FiSun, FiMoon,
} from 'react-icons/fi';
import { ButtonSpinner } from '../components/Loader';

const Register = () => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('student');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    const result = await register(name, email, password, role);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1800);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300 relative">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm transition-all"
      >
        {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-xl shadow-brand-500/30 mb-4">
            CQ
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Campus Query</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/40 shadow-xl dark:shadow-none">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Get started</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Register to access the chatbot</p>

          {/* Notifications */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl">
              <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-name" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FiUser className="w-4 h-4" /></span>
                <input id="reg-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Aman Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FiMail className="w-4 h-4" /></span>
                <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-pwd" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FiLock className="w-4 h-4" /></span>
                <input id="reg-pwd" type={showPwd ? 'text' : 'password'} required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm" />
                <button type="button" onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-role" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Account Role</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FiShield className="w-4 h-4" /></span>
                <select id="reg-role" value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm appearance-none cursor-pointer">
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button id="register-btn" type="submit" disabled={isSubmitting}
              className="w-full py-3.5 mt-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {isSubmitting && <ButtonSpinner />}
              {isSubmitting ? 'Registering…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
