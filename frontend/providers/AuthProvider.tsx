'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SessionUser, UserRole } from '@/types/user';
import { login as apiLogin, register as apiRegister, logout as apiLogout, fetchCurrentUser } from '@/lib/api/auth';
import { hasToken, getStoredSession } from '@/lib/api/client';
import { ROLE_ROUTES } from '@/lib/auth/roles';

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (username: string, email: string, password: string) => Promise<SessionUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    if (!hasToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    const stored = getStoredSession<SessionUser>();
    if (stored) {
      setUser(stored);
    }
    const current = await fetchCurrentUser();
    if (current) {
      setUser(current);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const sessionUser = await apiLogin(email, password);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const sessionUser = await apiRegister(username, email, password);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRole(): UserRole | null {
  const { user } = useAuth();
  return user?.role || null;
}
