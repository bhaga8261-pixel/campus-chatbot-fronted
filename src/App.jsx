import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider }         from './context/ThemeContext';

// Layout & guards
import MainLayout      from './layouts/MainLayout';
import ProtectedRoute  from './components/ProtectedRoute';

// Pages
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat      from './pages/Chat';
import Profile   from './pages/Profile';
import NotFound  from './pages/NotFound';

// Loading splash
import { PageLoader } from './components/Loader';

// ── Inner app (needs auth context) ──────────────────────────────────────────
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes – all share the MainLayout shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat"      element={<Chat />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ── Root ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
