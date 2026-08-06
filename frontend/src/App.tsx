import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { PublicLayout } from './components/layout/PublicLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ProfileCompletionPage } from './pages/ProfileCompletionPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { DashboardPage } from './pages/DashboardPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { CalendarPage } from './pages/CalendarPage';
import { UpcomingTripsPage } from './pages/UpcomingTripsPage';
import { TripHistoryPage } from './pages/TripHistoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SearchPage } from './pages/SearchPage';

import { TripPlanningPage } from './pages/TripPlanningPage';
import { AIGenerationHistoryPage } from './pages/AIGenerationHistoryPage';
import { CurrentTripPage } from './pages/CurrentTripPage';
import { TransportPage } from './pages/TransportPage';
import { NearbyPage } from './pages/NearbyPage';
import { NavigationPage } from './pages/NavigationPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { EmergencyPage } from './pages/EmergencyPage';

import { BudgetPage } from './pages/BudgetPage';
import { PackingPage } from './pages/PackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SharedTripPage } from './pages/SharedTripPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/share/:token" element={<SharedTripPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/complete-profile" element={<ProtectedRoute><ProfileCompletionPage /></ProtectedRoute>} />
      </Route>

      {/* Dashboard & App Feature Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/upcoming" element={<UpcomingTripsPage />} />
        <Route path="/history" element={<TripHistoryPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/plan" element={<TripPlanningPage />} />
        <Route path="/ai/history" element={<AIGenerationHistoryPage />} />
        <Route path="/current" element={<CurrentTripPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/saved-places" element={<SavedPlacesPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />

        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
