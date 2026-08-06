import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfileDTO, UserPreferencesDTO } from '../types';
import { AuthService, ProfileService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';

interface AuthContextType {
  user: User | null;
  profile: ProfileDTO | null;
  preferences: UserPreferencesDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (email?: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferencesDTO>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start unauthenticated — no hardcoded demo user
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [preferences, setPreferences] = useState<UserPreferencesDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // On mount: if we have a saved token, restore the session
    const token = localStorage.getItem('aitravel_token');
    if (token) {
      AuthService.getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            if (res.profile) setProfile(res.profile);
            if (res.preferences) setPreferences(res.preferences);
            // Fetch this user's trips (clears any stale data first)
            useTravelStore.getState().fetchTrips();
          } else {
            // Token invalid, clear it
            localStorage.removeItem('aitravel_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('aitravel_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(email, password);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      if (res.preferences) setPreferences(res.preferences);
      // Load this user's actual trips, replacing any stale data
      await useTravelStore.getState().fetchTrips();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(name, email, password);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      if (res.preferences) setPreferences(res.preferences);
      // New user starts with an empty trip list
      await useTravelStore.getState().fetchTrips();
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (email?: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.googleLogin(email, name);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      if (res.preferences) setPreferences(res.preferences);
      await useTravelStore.getState().fetchTrips();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; avatar?: string }) => {
    const updated = await ProfileService.updateProfile(data);
    setProfile(updated);
    if (user && data.name) setUser({ ...user, name: data.name });
  };

  const updatePreferences = async (data: Partial<UserPreferencesDTO>) => {
    const updated = await ProfileService.updatePreferences(data);
    setPreferences(updated);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setProfile(null);
    setPreferences(null);
    // Clear trip data so the next user doesn't see previous user's trips
    useTravelStore.getState().clearTrips();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        updatePreferences
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
