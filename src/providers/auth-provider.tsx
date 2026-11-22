'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api-client';

export type UserRole = 'customer' | 'technician' | 'admin';

export interface User {
  id: string;
  _id?: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  area?: string;
  avatarUrl?: string;
  bio?: string;
  specialties?: string[];
  isAvailable?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (): Promise<User | null> => {
    try {
      const res = await api.get<User>('/users/profile');
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      return null;
    } catch (err: any) {
      if (err?.status === 401) {
        localStorage.removeItem('fixmate_token');
        setToken(null);
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('fixmate_token');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${AUTH_BASE_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Invalid email or password.');
    }

    // Capture token from set-auth-token or set-auth-jwt header or response body
    const tokenHeader = res.headers.get('set-auth-token') || res.headers.get('set-auth-jwt');
    const receivedToken = tokenHeader || data?.token || data?.session?.token;

    if (receivedToken) {
      localStorage.setItem('fixmate_token', receivedToken);
      setToken(receivedToken);
    }

    // Fetch authoritative database profile
    const profile = await fetchProfile();
    if (profile) {
      return profile;
    }

    const fallbackUser: User = {
      id: data?.user?.id || data?.id,
      email: data?.user?.email || email,
      name: data?.user?.name,
      role: data?.user?.role || 'customer',
    };
    setUser(fallbackUser);
    return fallbackUser;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'customer'
  ): Promise<User> => {
    const res = await fetch(`${AUTH_BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Registration failed.');
    }

    const tokenHeader = res.headers.get('set-auth-token') || res.headers.get('set-auth-jwt');
    const receivedToken = tokenHeader || data?.token || data?.session?.token;

    if (receivedToken) {
      localStorage.setItem('fixmate_token', receivedToken);
      setToken(receivedToken);
    }

    // If a non-customer role was requested (e.g. technician), update profile role
    if (role === 'technician') {
      try {
        await api.patch('/users/profile', { role: 'technician' });
      } catch {
        // Ignored if server enforces customer role on public signup
      }
    }

    const profile = await fetchProfile();
    if (profile) {
      return profile;
    }

    const fallbackUser: User = {
      id: data?.user?.id || data?.id,
      email: data?.user?.email || email,
      name,
      role,
    };
    setUser(fallbackUser);
    return fallbackUser;
  };

  const logout = async () => {
    try {
      await fetch(`${AUTH_BASE_URL}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('fixmate_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
