import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      const me = await api.get('/auth/me');
      setPermissions(me.data.data.permissions || []);
    } catch (err) {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
    const onLogout = () => {
      setUser(null);
      setPermissions([]);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [loadSession]);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    const me = await api.get('/auth/me');
    setPermissions(me.data.data.permissions || []);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      /* ignore */
    }
    setAccessToken(null);
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (...perms) => perms.some((p) => permissions.includes(p));

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout, hasPermission, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}
