import React, { useState } from 'react';
import { User, Settings, Shield, Bell, Moon, DollarSign, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUIStore } from '../store/useUIStore';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useUIStore();

  const [name, setName] = useState(user?.name || 'Koushik Konkipudi');
  const [email] = useState(user?.email || 'konkipudikoushik1@gmail.com');
  const [currency, setCurrency] = useState('INR');
  const [travelStyle, setTravelStyle] = useState('Leisure');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', message: 'Settings saved successfully!' });
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-400" /> Account & App Settings
        </h1>
        <p className="text-xs text-slate-400">Personalize user profile, currency, travel style, and notifications</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 space-y-6 max-w-3xl">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" /> User Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input type="email" value={email} disabled className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed" />
          </div>
        </div>

        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-3 flex items-center gap-2 pt-4">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Travel Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Default Travel Style</label>
            <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
              <option value="Leisure">Leisure</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button type="submit" className="glass-button text-xs py-2.5 px-6 flex items-center gap-1.5 shadow-xl shadow-sky-500/20">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
