import React, { createContext, useContext, useEffect, useState } from 'react';
import authAPI from '../api/auth';
import { getToken, setToken, clearAuth } from '../utils/token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on app mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await authAPI.me();
          setUser(res.data);
        } catch {
          clearAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { access_token } = res.data;
      setToken(access_token);

      const profileRes = await authAPI.me();
      setUser(profileRes.data);

      return { success: true, role: profileRes.data.role };
    } catch (err) {
      const detail = err.response?.data?.detail || 'Invalid email or password';
      return { success: false, error: detail };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      await authAPI.register({ name, email, password, role });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed. Try again.';
      return { success: false, error: detail };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const isAdmin    = () => user?.role === 'admin';
  const isStudent  = () => user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStudent,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
