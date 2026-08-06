import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const ProfileCompletionPage: React.FC = () => {
  const { user } = useAuth();
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 glass-panel space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/30">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Setup Preferences</h2>
        <p className="text-xs text-slate-400">Welcome, {user?.name || 'Traveler'}! Customize your travel defaults</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Preferred Currency</label>
          <select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="INR">Indian Rupee (₹ INR)</option>
            <option value="USD">US Dollar ($ USD)</option>
            <option value="EUR">Euro (€ EUR)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Default Travel Style</label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="Budget / Backpacker">Budget / Backpacker</option>
            <option value="Balanced">Balanced</option>
            <option value="Luxury Stay">Luxury Stay</option>
          </select>
        </div>

        <Button type="submit" className="w-full py-3">
          <Sparkles className="w-4 h-4 mr-1.5" /> Save & Explore Dashboard
        </Button>
      </form>
    </div>
  );
};
