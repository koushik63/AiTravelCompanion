import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Bell, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTravelStore } from '../store/useTravelStore';
import { useUIStore } from '../store/useUIStore';
import { ProfileMenu } from './ui/ProfileMenu';
import { ThemeToggle } from './ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useTravelStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-all flex items-center justify-center"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 text-sky-400" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
                WanderAI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Demo Active
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className="text-slate-300 hover:text-sky-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/plan" className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Trip Planner
          </Link>
          <Link to="/current" className="text-slate-300 hover:text-sky-400 transition-colors">
            Live Trip Mode
          </Link>
          <Link to="/transport" className="text-slate-300 hover:text-sky-400 transition-colors">
            Transport Hub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 relative transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-sky-400" />
                      Trip Alerts & Notifications
                    </h4>
                    <span className="text-xs text-slate-400">{notifications.length} total</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto mt-2 space-y-2.5">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.isRead
                              ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                              : 'bg-sky-950/40 border-sky-500/30 text-slate-200 hover:border-sky-500/60'
                          }`}
                        >
                          <div className="font-medium flex items-center justify-between mb-1">
                            <span>{n.title}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <ProfileMenu />
          ) : (
            <Link to="/login" className="glass-button text-xs py-2 px-4">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
