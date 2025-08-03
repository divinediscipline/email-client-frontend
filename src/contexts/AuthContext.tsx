'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          // Handle the same response structure
          const userData = response.data.data || response.data;
          setUser(userData);
        } catch {
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login...');
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: Login response received');
      
      // The API returns: { success: true, data: { user, token }, message: "..." }
      const { data } = response.data;
      
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response structure from server');
      }
      
      const { token, user } = data;
      console.log('AuthContext: Extracted token and user', { user: user.name, tokenExists: !!token });
      
      localStorage.setItem('authToken', token);
      setUser(user);
      console.log('AuthContext: User state updated, user:', user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await authAPI.register({ email, password, name, role });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoading: isLoading || !isClient,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 