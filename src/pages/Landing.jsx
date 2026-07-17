import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiShield, FiTrendingUp } from 'react-icons/fi';
import DarkModeToggle from '../components/DarkModeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-300">
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
            CampusQuery
          </span>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all duration-200 shadow-md shadow-brand-500/10 hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24 gap-12">
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex self-center lg:self-start items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
            🤖 Next-Gen RAG Chatbot
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Instant Answers to Your{' '}
            <span className="bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">
              Campus Queries
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
            Powered by semantic vector search and LLMs. Search across syllabi, notices, placement guidelines, and exams in natural language.
          </p>
          <div className="flex items-center gap-4 justify-center lg:justify-start mt-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/20 hover:scale-[1.02]"
            >
              Access Portal
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Visual Grid */}
        <div className="flex-1 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.02] transition-transform shadow-premium">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Chatbot</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ask natural language queries and get direct answers synthesized from official college files.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.02] transition-transform shadow-premium">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <FiSearch className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Semantic Search</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Query syllabi, holiday lists, and timetables; get precise paragraphs and source page citations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.02] transition-transform shadow-premium">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <FiShield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Role Permissions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Students browse and search. Admins upload documents, publish notices, and inspect AI vector stats.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.02] transition-transform shadow-premium">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Admin Analytics</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interactive dashboards detailing popular query keywords, question statistics, and database logs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-center border-t border-slate-200/60 dark:border-slate-800/40 text-sm text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} Campus Query Chatbot. Built with React, FastAPI, and MongoDB Atlas.
      </footer>
    </div>
  );
};

export default Landing;
