'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthUser,
  decodeJwtPayload,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getDashboardPathForRole,
} from '../lib/auth';
import { authService } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      const decoded = decodeJwtPayload(existingToken);
      if (decoded) {
        setToken(existingToken);
        setUser(decoded);
      } else {
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const receivedToken = response.token;
    const decoded = decodeJwtPayload(receivedToken);

    if (!decoded) {
      throw new Error('Received malformed token from server');
    }

    setAuthToken(receivedToken);
    setToken(receivedToken);
    setUser(decoded);

    // Redirect to respective role dashboard
    const destination = getDashboardPathForRole(decoded.role);
    router.push(destination);
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

