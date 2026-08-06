import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Compass,
  MapPin,
  History,
  Star,
  Search,
  Wallet,
  Luggage,
  Bell,
  Bot,
  Camera,
  Settings,
  Shield,
  Bookmark,
  ShieldAlert,
  Building2,
  X
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar Timeline', path: '/calendar', icon: Calendar },
    { name: 'Trip Management', path: '/trips', icon: Compass },
    { name: 'Hotels & Stays', path: '/hotels', icon: Building2 },
    { name: 'Live Trip Mode', path: '/current', icon: MapPin },
    { name: 'AI Travel Assistant', path: '/assistant', icon: Bot },
    { name: 'Budget Hub', path: '/budget', icon: Wallet },
    { name: 'Packing Assistant', path: '/packing', icon: Luggage },
    { name: 'Notification Center', path: '/notifications', icon: Bell },
    { name: 'Transport Hub', path: '/transport', icon: Compass },
    { name: 'Nearby Explorer', path: '/nearby', icon: MapPin },
    { name: 'Saved Places', path: '/saved-places', icon: Bookmark },
    { name: 'Emergency Support', path: '/emergency', icon: ShieldAlert },
    { name: 'Upcoming Trips', path: '/upcoming', icon: Compass },
    { name: 'Journey History', path: '/history', icon: History },
    { name: 'Favorite Trips', path: '/favorites', icon: Star },
    { name: 'Destination Search', path: '/search', icon: Search },
    { name: 'Memory Album', path: '/memories', icon: Camera },
    { name: 'Settings & Profile', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        />
      )}

      {/* Slide-out Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/98 border-r border-slate-800 p-5 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Navigation Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
            WanderAI Companion v1.0
          </span>
        </div>
      </aside>
    </>
  );
};
