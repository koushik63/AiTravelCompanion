import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfileDTO, UserPreferencesDTO } from '../types';
import { AuthService, ProfileService } from '../services/api';

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
  const [user, setUser] = useState<User | null>({
    id: 'usr_demo_1',
    name: 'Alex Rivera',
    email: 'alex.traveler@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  });
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [preferences, setPreferences] = useState<UserPreferencesDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('aitravel_token');
    if (token) {
      AuthService.getMe()
        .then((res) => {
          if (res.user) setUser(res.user);
          if (res.profile) setProfile(res.profile);
          if (res.preferences) setPreferences(res.preferences);
        })
        .catch(() => {})
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
