import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import chatAPI from '../api/chat';

/**
 * MainLayout wraps all authenticated pages.
 * It manages sidebar state and passes chat-history handlers to Sidebar.
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory]         = useState([]);
  const [activeId, setActiveId]       = useState(null);
  const navigate = useNavigate();

  // Load history is triggered by the Chat page – passed down via context would be
  // over-engineering; instead Chat page refreshes sidebar by lifting history up.
  // We expose setHistory and setActiveId so Chat can call them.
  const handleNewChat = () => {
    setActiveId(null);
    navigate('/chat');
  };

  const handleSelectChat = (chat) => {
    setActiveId(chat._id || chat.id);
    navigate('/chat', { state: { selectedChat: chat } });
  };

  const handleDeleteChat = async (id) => {
    // Optimistically remove from UI; server-side we can only clear all or nothing (API limitation).
    setHistory((prev) => prev.filter((c) => (c._id || c.id) !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />

        {/* Render child pages and pass sidebar helpers via Outlet context */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ setHistory, setActiveId, activeId }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
