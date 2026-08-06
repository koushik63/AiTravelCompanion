import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, CheckCircle2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
      >
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
          alt={user.name}
          className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-500/50"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <div className="font-semibold text-slate-100 text-xs truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Active Session
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-medium">Theme Mode</span>
            <ThemeToggle />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4 text-sky-400" /> Account Preferences
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
